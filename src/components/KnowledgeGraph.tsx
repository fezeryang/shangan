import type React from "react";
import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import type { StudyStats, UserAnswerRecord } from "../types";
import { allQuestions } from "../data/allQuestions";
import {
  RAW_KNOWLEDGE_POINTS,
  EXTRA_RELATIONS,
  computePointStats,
} from "../data/knowledgeTaxonomy";
import {
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Filter,
  Layers,
  ArrowRight,
  Compass,
} from "lucide-react";

interface KnowledgeNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  shortName: string;
  category: "root" | "verbal" | "data" | "graphic";
  categoryName: string;
  type: "root" | "category" | "topic";
  masteryScore: number; // 0 - 100
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  mistakesCount: number;
  status: "mastered" | "moderate" | "weak" | "unpracticed";
  description: string;
  examWeight: string; // e.g. "必考 15%"
  keyFormulaOrTip: string;
  prerequisites?: string[];
  /** 题库真实 subCategory（题量降序），供跳转专项练习；空数组为题库未覆盖的死节点 */
  practiceSubCategories: string[];
  radius?: number;
}

interface KnowledgeLink extends d3.SimulationLinkDatum<KnowledgeNode> {
  source: string | KnowledgeNode;
  target: string | KnowledgeNode;
  type: "hierarchy" | "prerequisite" | "weakness_warning" | "cross_domain";
  strength?: number;
  label?: string;
  description?: string;
}

interface KnowledgeGraphProps {
  stats: StudyStats;
  answerRecords: UserAnswerRecord[];
  onSelectSubCategory?: (category: string, subCategory: string) => void;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  stats,
  answerRecords,
  onSelectSubCategory,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<
    SVGSVGElement,
    unknown
  > | null>(null);

  // Filter & View State
  const [filterMode, setFilterMode] = useState<
    "all" | "weakness" | "verbal" | "data" | "graphic"
  >("all");
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Compute live mastery data for all nodes
  const nodesData: KnowledgeNode[] = useMemo(() => {
    const qById = new Map(allQuestions.map((q) => [q.id, q]));
    // 1. Root Node（由 answerRecords 派生，与看板同口径；未练习时不虚构分数）
    const totalAtt = answerRecords.length;
    const totalCor = answerRecords.filter((r) => r.isCorrect).length;
    const totalAcc =
      totalAtt > 0 ? Math.round((totalCor / totalAtt) * 100) : null;
    const rootNode: KnowledgeNode = {
      id: "root_hub",
      name: "核心测评能力全景",
      shortName: "能力全景",
      category: "root",
      categoryName: "全科综合",
      type: "root",
      masteryScore: totalAcc ?? 0,
      totalQuestions: allQuestions.length,
      attemptedCount: totalAtt,
      correctCount: totalCor,
      mistakesCount: stats.mistakeIds.length,
      status:
        totalAcc === null
          ? "unpracticed"
          : totalAcc >= 80
            ? "mastered"
            : totalAcc >= 65
              ? "moderate"
              : "weak",
      description: "上岸测评言语理解、资料分析与复杂图形推理核心知识图谱。",
      examWeight: "总分 100%",
      keyFormulaOrTip: "三科均衡发展，突破图推重叠相消与资料百化分秒杀。",
      practiceSubCategories: [],
      radius: 36,
    };

    // 2. Category Nodes
    const categoryConfigs = [
      {
        id: "cat_verbal",
        name: "言语理解与推理",
        shortName: "言语推理",
        category: "verbal" as const,
        categoryName: "言语理解与推理",
        examWeight: "占比 35%",
        desc: "文段主旨、逻辑填空成语辨析、细节判断排雷及语句衔接。",
        tip: "牢抓关联转折词，优选对策解决项。",
      },
      {
        id: "cat_data",
        name: "资料分析与计算",
        shortName: "资料分析",
        category: "data" as const,
        categoryName: "资料分析与计算",
        examWeight: "占比 35%",
        desc: "增长率、基期量、百化分速算、两期比重升降及复式图表极值速读。",
        tip: "巧用百化分代入 n+1 秒杀，截位直除快速比较。",
      },
      {
        id: "cat_graphic",
        name: "图形推理空间思维",
        shortName: "图形推理",
        category: "graphic" as const,
        categoryName: "图形推理空间思维",
        examWeight: "占比 30%",
        desc: "重叠相消去同存异、步长顺逆旋转、黑白格位运算、点线面角素及空间折叠。",
        tip: "先定局部特殊基准标记，再看独立轨迹；去同存异快速相消。",
      },
    ];

    const catNodes: KnowledgeNode[] = categoryConfigs.map((cat) => {
      const records = answerRecords.filter(
        (r) => qById.get(r.questionId)?.category === cat.category,
      );
      const attCount = records.length;
      const corCount = records.filter((r) => r.isCorrect).length;
      const catAcc =
        attCount > 0 ? Math.round((corCount / attCount) * 100) : null;

      const catMistakes = stats.mistakeIds.filter(
        (id) => qById.get(id)?.category === cat.category,
      ).length;

      return {
        id: cat.id,
        name: cat.name,
        shortName: cat.shortName,
        category: cat.category,
        categoryName: cat.categoryName,
        type: "category",
        masteryScore: catAcc ?? 0,
        totalQuestions: allQuestions.filter((q) => q.category === cat.category)
          .length,
        attemptedCount: attCount,
        correctCount: corCount,
        mistakesCount: catMistakes,
        status:
          catAcc === null
            ? "unpracticed"
            : catAcc >= 80
              ? "mastered"
              : catAcc >= 65
                ? "moderate"
                : "weak",
        description: cat.desc,
        examWeight: cat.examWeight,
        keyFormulaOrTip: cat.tip,
        practiceSubCategories: [],
        radius: 28,
      };
    });

    // 3. Topic Sub-nodes（真实作答记录驱动）
    const topicNodes: KnowledgeNode[] = RAW_KNOWLEDGE_POINTS.map((item) => {
      const ps = computePointStats(item, allQuestions, answerRecords, stats);
      return {
        id: item.id,
        name: item.name,
        shortName: item.shortName,
        category: item.category as any,
        categoryName: item.categoryName,
        type: "topic",
        masteryScore: ps.accuracy ?? 0,
        totalQuestions: ps.totalQuestions,
        attemptedCount: ps.attemptedCount,
        correctCount: ps.correctCount,
        mistakesCount: ps.mistakesCount,
        status: ps.status,
        description: item.description,
        examWeight: item.examWeight,
        keyFormulaOrTip: item.keyFormulaOrTip,
        prerequisites: item.prerequisites,
        practiceSubCategories: ps.subCategories,
        radius: ps.status === "weak" ? 22 : 18,
      };
    });

    return [rootNode, ...catNodes, ...topicNodes];
  }, [stats, answerRecords]);

  // Compute links based on hierarchy, prerequisites, and dynamic weakness warning bridges
  const linksData: KnowledgeLink[] = useMemo(() => {
    const links: KnowledgeLink[] = [];

    // Root to categories
    links.push(
      {
        source: "root_hub",
        target: "cat_verbal",
        type: "hierarchy",
        strength: 1.0,
      },
      {
        source: "root_hub",
        target: "cat_data",
        type: "hierarchy",
        strength: 1.0,
      },
      {
        source: "root_hub",
        target: "cat_graphic",
        type: "hierarchy",
        strength: 1.0,
      },
    );

    // Categories to their topics
    nodesData.forEach((node) => {
      if (node.type === "topic") {
        const parentCatId = `cat_${node.category}`;
        links.push({
          source: parentCatId,
          target: node.id,
          type: "hierarchy",
          strength: 0.8,
        });

        // Prerequisite links from RAW data
        if (node.prerequisites && node.prerequisites.length > 0) {
          node.prerequisites.forEach((preId) => {
            links.push({
              source: preId,
              target: node.id,
              type: "prerequisite",
              label: "前置技能",
              strength: 0.5,
            });
          });
        }
      }
    });

    // Extra relations
    EXTRA_RELATIONS.forEach((rel) => {
      links.push({
        source: rel.source,
        target: rel.target,
        type: rel.type as any,
        label: rel.label,
        strength: 0.4,
      });
    });

    // Dynamic Weakness Warning Bridges: If two connected topics are both weak, or a topic is weak and has prerequisites, create a prominent weakness link!
    const weakNodeIds = new Set(
      nodesData.filter((n) => n.status === "weak").map((n) => n.id),
    );
    nodesData.forEach((node) => {
      if (node.status === "weak" && node.prerequisites) {
        node.prerequisites.forEach((preId) => {
          if (weakNodeIds.has(preId)) {
            links.push({
              source: preId,
              target: node.id,
              type: "weakness_warning",
              label: "连带薄弱预警",
              strength: 0.6,
            });
          }
        });
      }
    });

    return links;
  }, [nodesData]);

  // Overall Statistics
  const totalTopicsCount = nodesData.filter((n) => n.type === "topic").length;
  const masteredCount = nodesData.filter(
    (n) => n.type === "topic" && n.status === "mastered",
  ).length;
  const weakCount = nodesData.filter(
    (n) => n.type === "topic" && n.status === "weak",
  ).length;
  const practicedTopics = nodesData.filter(
    (n) => n.type === "topic" && n.attemptedCount > 0,
  );
  const avgMastery =
    practicedTopics.length > 0
      ? Math.round(
          practicedTopics.reduce((acc, n) => acc + n.masteryScore, 0) /
            practicedTopics.length,
        )
      : null;

  // Set default selected node
  useEffect(() => {
    if (!selectedNode) {
      const firstWeak = nodesData.find(
        (n) => n.status === "weak" && n.type === "topic",
      );
      setSelectedNode(
        firstWeak ||
          nodesData.find((n) => n.id === "g_overlay_subtraction") ||
          nodesData[1],
      );
    }
  }, [nodesData, selectedNode]);

  // D3 Rendering & Simulation Effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 560;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    // Defs for gradients, filters, and markers
    const defs = svg.append("defs");

    // Arrow marker for prerequisite links
    defs
      .append("marker")
      .attr("id", "arrow-prereq")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 22)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L8,0L0,4")
      .attr("fill", "#818cf8");

    // Arrow marker for weakness links
    defs
      .append("marker")
      .attr("id", "arrow-weak")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 24)
      .attr("refY", 0)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L8,0L0,4")
      .attr("fill", "#f43f5e");

    // Drop shadow filter
    const filter = defs
      .append("filter")
      .attr("id", "node-shadow")
      .attr("height", "130%");
    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2)
      .attr("result", "blur");
    filter
      .append("feOffset")
      .attr("in", "blur")
      .attr("dx", 0)
      .attr("dy", 2)
      .attr("result", "offsetBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Pulsing glow filter for weak nodes
    const glowFilter = defs
      .append("filter")
      .attr("id", "glow-weak")
      .attr("x", "-30%")
      .attr("y", "-30%")
      .attr("width", "160%")
      .attr("height", "160%");
    glowFilter
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "blur");
    const glowMerge = glowFilter.append("feMerge");
    glowMerge.append("feMergeNode").attr("in", "blur");
    glowMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Root Group with Zoom Support
    const g = svg.append("g").attr("class", "graph-root");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3.5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Filter nodes and links based on filterMode
    const filteredNodes = nodesData.filter((node) => {
      if (filterMode === "all") return true;
      if (filterMode === "weakness")
        return (
          node.type === "root" ||
          node.type === "category" ||
          node.status === "weak"
        );
      if (filterMode === "verbal")
        return node.type === "root" || node.category === "verbal";
      if (filterMode === "data")
        return node.type === "root" || node.category === "data";
      if (filterMode === "graphic")
        return node.type === "root" || node.category === "graphic";
      return true;
    });

    const activeNodeIds = new Set(filteredNodes.map((n) => n.id));

    const filteredLinks = linksData
      .filter((link) => {
        const sId =
          typeof link.source === "object"
            ? (link.source as any).id
            : link.source;
        const tId =
          typeof link.target === "object"
            ? (link.target as any).id
            : link.target;
        if (!activeNodeIds.has(sId) || !activeNodeIds.has(tId)) return false;
        if (
          filterMode === "weakness" &&
          link.type !== "weakness_warning" &&
          link.type !== "hierarchy"
        ) {
          return false;
        }
        return true;
      })
      .map((l) => ({ ...l })); // Shallow clone for d3 mutability

    // Position categories in a triangle around center
    const catPositions: Record<string, { x: number; y: number }> = {
      root_hub: { x: width / 2, y: height / 2 },
      cat_verbal: { x: width / 2 - 180, y: height / 2 - 110 },
      cat_data: { x: width / 2 + 180, y: height / 2 - 110 },
      cat_graphic: { x: width / 2, y: height / 2 + 160 },
    };

    filteredNodes.forEach((node) => {
      if (catPositions[node.id]) {
        node.x = catPositions[node.id].x;
        node.y = catPositions[node.id].y;
      }
    });

    // D3 Force Simulation
    const simulation = d3
      .forceSimulation<KnowledgeNode>(filteredNodes)
      .force(
        "link",
        d3
          .forceLink<KnowledgeNode, any>(filteredLinks)
          .id((d) => d.id)
          .distance((d) => {
            if (d.type === "hierarchy")
              return d.source.id === "root_hub" ? 140 : 85;
            if (d.type === "weakness_warning") return 75;
            return 95;
          })
          .strength((d) => d.strength || 0.6),
      )
      .force(
        "charge",
        d3
          .forceManyBody<KnowledgeNode>()
          .strength((d) =>
            d.type === "root" ? -450 : d.type === "category" ? -280 : -140,
          ),
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3
          .forceCollide<KnowledgeNode>()
          .radius((d) => (d.radius || 20) + 16)
          .iterations(3),
      )
      .alphaDecay(0.028);

    // Draw Links
    const linkGroup = g.append("g").attr("class", "links");

    const link = linkGroup
      .selectAll<SVGLineElement, any>("line")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("stroke", (d) => {
        if (d.type === "weakness_warning") return "#f43f5e";
        if (d.type === "prerequisite") return "#818cf8";
        if (d.type === "cross_domain") return "#a855f7";
        return "#cbd5e1";
      })
      .attr("stroke-width", (d) =>
        d.type === "weakness_warning"
          ? 2.5
          : d.type === "prerequisite"
            ? 1.8
            : 1.2,
      )
      .attr("stroke-dasharray", (d) => {
        if (d.type === "weakness_warning") return "5,4";
        if (d.type === "prerequisite") return "4,3";
        if (d.type === "cross_domain") return "2,2";
        return "none";
      })
      .attr("stroke-opacity", (d) =>
        d.type === "weakness_warning" ? 0.9 : 0.6,
      )
      .attr("marker-end", (d) => {
        if (d.type === "weakness_warning") return "url(#arrow-weak)";
        if (d.type === "prerequisite") return "url(#arrow-prereq)";
        return null;
      });

    // Draw Nodes
    const nodeGroup = g.append("g").attr("class", "nodes");

    const node = nodeGroup
      .selectAll<SVGGElement, KnowledgeNode>("g")
      .data(filteredNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, KnowledgeNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    // Node Outer Pulse Ring for Weak Nodes
    node
      .filter((d) => d.status === "weak" && d.type === "topic")
      .append("circle")
      .attr("r", (d) => (d.radius || 20) + 7)
      .attr("fill", "none")
      .attr("stroke", "#f43f5e")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0.8)
      .append("animateTransform")
      .attr("attributeName", "transform")
      .attr("type", "rotate")
      .attr("from", "0")
      .attr("to", "360")
      .attr("dur", "10s")
      .attr("repeatCount", "indefinite");

    // Main Node Circle
    node
      .append("circle")
      .attr("r", (d) => d.radius || 20)
      .attr("fill", (d) => {
        if (d.type === "root") return "#1e1b4b"; // Deep Indigo
        if (d.type === "category") {
          if (d.category === "verbal") return "#4338ca";
          if (d.category === "data") return "#047857";
          if (d.category === "graphic") return "#b45309";
        }
        if (d.status === "mastered") return "#ecfdf5"; // Emerald bg
        if (d.status === "weak") return "#fff1f2"; // Rose bg
        if (d.status === "unpracticed") return "#f8fafc"; // Untested neutral bg
        return "#f8fafc"; // Neutral bg
      })
      .attr("stroke", (d) => {
        if (d.type === "root") return "#6366f1";
        if (d.type === "category") return "#ffffff";
        if (d.status === "mastered") return "#10b981";
        if (d.status === "weak") return "#f43f5e";
        if (d.status === "unpracticed") return "#cbd5e1";
        return "#64748b";
      })
      .attr("stroke-width", (d) =>
        d.type === "root" ? 3.5 : d.type === "category" ? 3 : 2,
      )
      .attr("filter", (d) =>
        d.status === "weak" ? "url(#glow-weak)" : "url(#node-shadow)",
      );

    // Mastery Ring arc (progress circle for topic nodes)
    node
      .filter((d) => d.type === "topic")
      .append("circle")
      .attr("r", (d) => (d.radius || 20) - 3)
      .attr("fill", "none")
      .attr("stroke", (d) =>
        d.status === "mastered"
          ? "#34d399"
          : d.status === "weak"
            ? "#fb7185"
            : d.status === "unpracticed"
              ? "#cbd5e1"
              : "#818cf8",
      )
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) => {
        const circum = 2 * Math.PI * ((d.radius || 20) - 3);
        const filled = (d.masteryScore / 100) * circum;
        return `${filled}, ${circum}`;
      })
      .attr("transform", "rotate(-90)");

    // Node Text: Category / Root label or Topic Name
    node
      .append("text")
      .text((d) => (d.type === "root" ? "全景" : d.shortName))
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (d.type === "topic" ? "-0.1em" : "0.35em"))
      .attr("font-size", (d) =>
        d.type === "root" ? "11px" : d.type === "category" ? "11px" : "9.5px",
      )
      .attr("font-weight", "bold")
      .attr("fill", (d) => {
        if (d.type === "root" || d.type === "category") return "#ffffff";
        if (d.status === "weak") return "#be123c";
        if (d.status === "mastered") return "#065f46";
        if (d.status === "unpracticed") return "#94a3b8";
        return "#334155";
      })
      .attr("pointer-events", "none");

    // Node Sub-label: Percentage score on topic nodes
    node
      .filter((d) => d.type === "topic")
      .append("text")
      .text((d) => (d.status === "unpracticed" ? "未练" : `${d.masteryScore}%`))
      .attr("text-anchor", "middle")
      .attr("dy", "1.15em")
      .attr("font-size", "8px")
      .attr("font-weight", "600")
      .attr("fill", (d) =>
        d.status === "weak"
          ? "#e11d48"
          : d.status === "mastered"
            ? "#059669"
            : d.status === "unpracticed"
              ? "#94a3b8"
              : "#64748b",
      )
      .attr("pointer-events", "none");

    // Warning Badge Icon on top-right of weak nodes
    node
      .filter((d) => d.status === "weak" && d.type === "topic")
      .append("circle")
      .attr("cx", (d) => (d.radius || 20) * 0.75)
      .attr("cy", (d) => -(d.radius || 20) * 0.75)
      .attr("r", 5.5)
      .attr("fill", "#f43f5e")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.2);

    node
      .filter((d) => d.status === "weak" && d.type === "topic")
      .append("text")
      .text("!")
      .attr("x", (d) => (d.radius || 20) * 0.75)
      .attr("y", (d) => -(d.radius || 20) * 0.75 + 3.2)
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("font-weight", "bold")
      .attr("fill", "#ffffff")
      .attr("pointer-events", "none");

    // Interactivity: Hover & Click Handlers
    node
      .on("mouseenter", (_event, d) => {
        // Find directly connected node ids
        const neighborIds = new Set<string>([d.id]);
        filteredLinks.forEach((l: any) => {
          if (l.source.id === d.id) neighborIds.add(l.target.id);
          if (l.target.id === d.id) neighborIds.add(l.source.id);
        });

        // Dim non-neighbors
        node
          .transition()
          .duration(150)
          .style("opacity", (n) => (neighborIds.has(n.id) ? 1 : 0.22));
        link
          .transition()
          .duration(150)
          .style("opacity", (l: any) =>
            l.source.id === d.id || l.target.id === d.id ? 1 : 0.08,
          );
      })
      .on("mouseleave", () => {
        node.transition().duration(150).style("opacity", 1);
        link
          .transition()
          .duration(150)
          .style("opacity", (d) => (d.type === "weakness_warning" ? 0.9 : 0.6));
      })
      .on("click", (_event, d) => {
        setSelectedNode(d);
      });

    // Simulation Tick Update
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Clean up
    return () => {
      simulation.stop();
    };
  }, [nodesData, linksData, filterMode, isFullscreen]);

  // Zoom control buttons using stored D3 ZoomBehavior
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(260)
      .call(zoomBehaviorRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(260)
      .call(zoomBehaviorRef.current.scaleBy, 0.75);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(350)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 bg-[#1e1914]/98 p-4 sm:p-6 overflow-y-auto flex flex-col space-y-4 backdrop-blur-md"
          : "bg-[#fdfbf7] rounded-2xl border border-[#e3d9c4] shadow-2xs overflow-hidden space-y-4"
      }
    >
      {/* Top Header with Overview & Filters */}
      <div className="p-5 sm:p-6 border-b border-[#e8ded0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#fef7ea] text-[#b45309] border border-[#ebdcb9] rounded-xl">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#26201a] text-base sm:text-lg flex items-center gap-2 font-display">
                <span>全题型知识图谱与弱项拓扑网</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#fef7ea] text-[#854d0e] font-semibold border border-[#ebdcb9]">
                  D3.js 力导向引擎
                </span>
                {isFullscreen && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    全屏沉浸模式
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#786c5e] mt-0.5">
                完整覆盖 25+ 核心考点 · 掌握度颜色编码 ·
                红色虚线代表跨考点薄弱警示连线
              </p>
            </div>
          </div>
        </div>

        {/* Global Summary KPI Pills */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
          <div className="px-3 py-1.5 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#786c5e]" />
            <span className="text-[#786c5e]">考点总数:</span>
            <strong className="text-[#26201a]">{totalTopicsCount} 个</strong>
          </div>
          <div className="px-3 py-1.5 bg-[#edf7ee] rounded-xl border border-[#bbf7d0] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
            <span className="text-[#14532d]">已掌握:</span>
            <strong className="text-[#15803d]">{masteredCount}</strong>
          </div>
          <div className="px-3 py-1.5 bg-[#fef2f2] rounded-xl border border-[#fecaca] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#b91c1c]" />
            <span className="text-[#991b1b]">需攻坚薄弱:</span>
            <strong className="text-[#b91c1c]">{weakCount}</strong>
          </div>
          <div className="px-3 py-1.5 bg-[#fef7ea] rounded-xl border border-[#ebdcb9] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
            <span className="text-[#78350f]">全图掌握指数:</span>
            <strong className="text-[#854d0e]">
              {avgMastery === null ? "—" : `${avgMastery}%`}
            </strong>
          </div>

          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="px-3.5 py-1.5 bg-[#b45309] hover:bg-[#9a3412] text-white rounded-xl flex items-center gap-1.5 font-semibold transition-colors cursor-pointer shadow-xs ml-auto"
            >
              <Minimize2 className="w-4 h-4" />
              <span>退出全屏</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar & Legend */}
      <div className="px-5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[#786c5e] font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#b45309]" /> 视图筛选:
          </span>
          {[
            { id: "all", label: "🌐 全景拓扑网" },
            { id: "weakness", label: "⚠️ 仅看弱点与预警连线" },
            { id: "verbal", label: "📖 言语理解 (8考点)" },
            { id: "data", label: "📊 资料分析 (9考点)" },
            { id: "graphic", label: "🧩 图形推理 (8考点)" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterMode(btn.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                filterMode === btn.id
                  ? "bg-[#b45309] text-white shadow-xs font-semibold"
                  : "bg-[#f8f3e8] hover:bg-[#f3ead7] text-[#4a3e31] border border-[#ded2bd]"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-[#786c5e] bg-[#f8f3e8] px-3 py-1.5 rounded-xl border border-[#e3d8c2]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803d] border border-[#166534]"></span>
            <span>熟练掌握 (≥80%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8c7e6d] border border-[#6e6153]"></span>
            <span>稳固进阶 (65-79%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c] border border-[#991b1b] animate-pulse"></span>
            <span>重点薄弱 (＜65% / 错题)</span>
          </div>
          <div className="flex items-center gap-1 pl-2 border-l border-[#ded2bd] text-[#991b1b] font-medium">
            <span className="w-4 border-t-2 border-dashed border-[#b91c1c]"></span>
            <span>弱点连带警示线</span>
          </div>
        </div>
      </div>

      {/* Main Canvas + Interactive Inspector Split */}
      <div
        className={`px-5 sm:px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-5 ${isFullscreen ? "flex-1" : ""}`}
      >
        {/* Left/Center Graph Canvas */}
        <div
          ref={containerRef}
          className={`lg:col-span-2 relative bg-[#26201a] rounded-2xl border border-[#4a3e31] shadow-inner overflow-hidden flex flex-col ${
            isFullscreen
              ? "min-h-[620px] h-[calc(100vh-250px)]"
              : "min-h-[480px] sm:min-h-[540px]"
          }`}
        >
          {/* Zoom Buttons on Top-Right */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-[#3a3026]/90 backdrop-blur-xs p-1 rounded-xl border border-[#524436] text-[#ded3bd] shadow-md">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-[#4a3e31] rounded-lg hover:text-white transition-colors cursor-pointer"
              title="放大视图 (Zoom In)"
              aria-label="放大视图"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-[#4a3e31] rounded-lg hover:text-white transition-colors cursor-pointer"
              title="缩小视图 (Zoom Out)"
              aria-label="缩小视图"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-[#4a3e31] rounded-lg hover:text-white transition-colors cursor-pointer"
              title="复位全景居中 (Reset View)"
              aria-label="复位全景居中"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-[#4a3e31] rounded-lg hover:text-white transition-colors cursor-pointer border-t border-[#524436] pt-2"
              title={
                isFullscreen ? "退出全屏" : "全屏沉浸查看 (Toggle Fullscreen)"
              }
              aria-label="全屏切换"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-amber-400" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Quick Tip on Canvas */}
          <div className="absolute bottom-3 left-3 z-10 text-[11px] text-[#ded3bd] bg-[#3a3026]/90 px-2.5 py-1 rounded-lg border border-[#524436] backdrop-blur-xs pointer-events-none">
            💡
            提示：按住拖拽节点可自由重构网络，滚轮或右上角按钮缩放，点击任意节点查看秒杀提分秘籍
          </div>

          <svg
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing flex-1"
          />
        </div>

        {/* Right Knowledge Inspector & Mastery Card */}
        <div className="bg-[#f8f3e8] rounded-2xl p-5 border border-[#e3d8c2] flex flex-col justify-between space-y-4">
          {selectedNode ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Card Header */}
              <div className="pb-3 border-b border-[#e3d8c2] flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#fffdfa] border border-[#ded3bd] text-[#6e6153]">
                    {selectedNode.categoryName} · {selectedNode.examWeight}
                  </span>
                  <h4 className="text-base font-bold text-[#26201a] mt-1.5 flex items-center gap-1.5">
                    <span>{selectedNode.name}</span>
                    {selectedNode.status === "weak" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#fef2f2] text-[#991b1b] font-bold border border-[#fca5a5]">
                        需突破
                      </span>
                    )}
                  </h4>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold font-display shrink-0 border ${
                    selectedNode.status === "mastered"
                      ? "bg-[#edf7ee] border-[#bbf7d0] text-[#15803d]"
                      : selectedNode.status === "weak"
                        ? "bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]"
                        : selectedNode.status === "unpracticed"
                          ? "bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8]"
                          : "bg-[#fef7ea] border-[#ebdcb9] text-[#854d0e]"
                  }`}
                >
                  <span className="text-sm font-extrabold">
                    {selectedNode.status === "unpracticed"
                      ? "—"
                      : `${selectedNode.masteryScore}%`}
                  </span>
                  <span className="text-[8px] font-normal text-[#8c7e6d]">
                    掌握度
                  </span>
                </div>
              </div>

              {/* Stat Counters Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#fffdfa] p-2.5 rounded-xl border border-[#ded3bd]">
                  <div className="text-[#8c7e6d] text-[10px]">题库收录</div>
                  <div className="font-bold text-[#26201a] text-sm mt-0.5">
                    {selectedNode.totalQuestions} 题
                  </div>
                </div>
                <div className="bg-[#fffdfa] p-2.5 rounded-xl border border-[#ded3bd]">
                  <div className="text-[#8c7e6d] text-[10px]">已练题数</div>
                  <div className="font-bold text-[#b45309] text-sm mt-0.5">
                    {selectedNode.attemptedCount} 题
                  </div>
                </div>
                <div className="bg-[#fffdfa] p-2.5 rounded-xl border border-[#ded3bd]">
                  <div className="text-[#8c7e6d] text-[10px]">当前错题</div>
                  <div
                    className={`font-bold text-sm mt-0.5 ${
                      selectedNode.mistakesCount > 0
                        ? "text-[#b91c1c]"
                        : "text-[#15803d]"
                    }`}
                  >
                    {selectedNode.mistakesCount} 题
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-[#5c4e3f] leading-relaxed bg-[#fffdfa] p-3 rounded-xl border border-[#ded3bd]">
                <span className="font-semibold text-[#26201a]">
                  📌 考点定义与命题规律：
                </span>
                <p className="mt-1">{selectedNode.description}</p>
              </div>

              {/* Secret Tip / Formula */}
              <div className="p-3.5 bg-[#fef7ea] rounded-xl border border-[#ebdcb9] text-xs space-y-1">
                <div className="flex items-center gap-1 font-bold text-[#78350f]">
                  <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
                  <span>AI 导师秒杀与破题锦囊：</span>
                </div>
                <p className="text-[#854d0e] text-xs leading-relaxed font-sans">
                  {selectedNode.keyFormulaOrTip}
                </p>
              </div>

              {/* Prerequisites & Weakness Bridges */}
              {selectedNode.prerequisites &&
                selectedNode.prerequisites.length > 0 && (
                  <div className="text-xs text-[#786c5e]">
                    <span className="font-medium">关联前置考点：</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedNode.prerequisites.map((preId) => {
                        const preNode = nodesData.find((n) => n.id === preId);
                        return (
                          <button
                            key={preId}
                            onClick={() => preNode && setSelectedNode(preNode)}
                            className="px-2 py-0.5 bg-[#fffdfa] hover:bg-[#f6eee0] text-[#78350f] rounded-md border border-[#ded3bd] text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            {preNode?.shortName || preId} →
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="py-16 text-center text-[#8c7e6d] space-y-2">
              <Compass
                className="w-8 h-8 mx-auto text-[#b45309] animate-spin"
                style={{ animationDuration: "8s" }}
              />
              <p className="text-xs">
                点击左侧图谱中的任意节点，查看深度掌握分析与秒杀技巧
              </p>
            </div>
          )}

          {/* Action button: Jump to Practice Mode with this category（题库真实 subCategory，题库未覆盖的死节点不提供跳转） */}
          {selectedNode &&
            selectedNode.type === "topic" &&
            onSelectSubCategory &&
            selectedNode.practiceSubCategories.length > 0 && (
              <button
                onClick={() =>
                  onSelectSubCategory(
                    selectedNode.category,
                    selectedNode.practiceSubCategories[0],
                  )
                }
                className="w-full py-2.5 bg-[#b45309] hover:bg-[#9a3412] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>
                  前往【{selectedNode.practiceSubCategories[0]}】专项刷题（
                  {selectedNode.totalQuestions} 题考点）
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
