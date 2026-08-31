import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Question, StudyStats, UserAnswerRecord } from '../types';
import { allQuestions } from '../data/allQuestions';
import {
  RAW_KNOWLEDGE_POINTS,
  EXTRA_RELATIONS,
  findKnowledgePointForQuestion,
} from '../data/knowledgeTaxonomy';
import {
  Network,
  Compass,
  Sparkles,
  BookOpen,
  BarChart3,
  Shapes,
  X,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Target,
} from 'lucide-react';

interface QuestionKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  stats?: StudyStats;
  answerRecords?: UserAnswerRecord[];
  onNavigateToSubCategory?: (category: string, subCategory: string) => void;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  shortName: string;
  category: 'root' | 'verbal' | 'data' | 'graphic';
  categoryName: string;
  type: 'root' | 'category' | 'topic';
  isTarget?: boolean;
  isPrerequisite?: boolean;
  isNextStep?: boolean;
  masteryScore: number;
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  mistakesCount: number;
  status: 'mastered' | 'moderate' | 'weak';
  description: string;
  examWeight: string;
  keyFormulaOrTip: string;
  radius: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'hierarchy' | 'prerequisite' | 'weakness_warning' | 'cross_domain';
  label?: string;
}

export const QuestionKnowledgeModal: React.FC<QuestionKnowledgeModalProps> = ({
  isOpen,
  onClose,
  question,
  stats,
  answerRecords = [],
  onNavigateToSubCategory,
}) => {
  const targetPoint = useMemo(() => findKnowledgePointForQuestion(question), [question]);
  const [viewMode, setViewMode] = useState<'focused' | 'global'>('focused');
  const [activeNodeId, setActiveNodeId] = useState<string>(targetPoint.id);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  // Sync activeNodeId when question or target changes
  useEffect(() => {
    setActiveNodeId(targetPoint.id);
  }, [targetPoint.id, question.id]);

  // Compute node mastery metrics
  const activePointInfo = useMemo(() => {
    const found = RAW_KNOWLEDGE_POINTS.find((p) => p.id === activeNodeId) || targetPoint;
    const matchingQuestions = allQuestions.filter(
      (q) =>
        q.category === found.category &&
        (q.subCategory?.includes(found.shortName) ||
          found.name.includes(q.subCategory || '') ||
          found.subCategoryKeywords.some((kw) => q.subCategory?.includes(kw)))
    );
    const qIds = new Set(matchingQuestions.map((q) => q.id));
    const records = answerRecords.filter((r) => qIds.has(r.questionId));
    const mistakesCount = stats?.mistakeIds.filter((id) => qIds.has(id)).length || 0;
    const attemptedCount = records.length;
    const correctCount = records.filter((r) => r.isCorrect).length;

    let score = found.baseAccuracy;
    if (attemptedCount > 0) {
      const userAcc = Math.round((correctCount / attemptedCount) * 100);
      score = Math.round(userAcc * 0.8 + found.baseAccuracy * 0.2);
    }
    if (mistakesCount > 0) {
      score = Math.max(25, score - mistakesCount * 12);
    }

    const status: 'mastered' | 'moderate' | 'weak' =
      score >= 80 ? 'mastered' : score >= 65 ? 'moderate' : 'weak';

    return {
      point: found,
      masteryScore: score,
      attemptedCount,
      correctCount,
      mistakesCount,
      status,
      questionCount: Math.max(matchingQuestions.length, 1),
    };
  }, [activeNodeId, targetPoint, answerRecords, stats]);

  // Build Graph Data
  const { nodes, links } = useMemo(() => {
    if (viewMode === 'focused') {
      // Subgraph focused around targetPoint
      const nodesMap = new Map<string, GraphNode>();

      // 1. Target node
      nodesMap.set(targetPoint.id, {
        id: targetPoint.id,
        name: targetPoint.name,
        shortName: targetPoint.shortName,
        category: targetPoint.category,
        categoryName: targetPoint.categoryName,
        type: 'topic',
        isTarget: true,
        masteryScore: targetPoint.baseAccuracy,
        totalQuestions: 5,
        attemptedCount: 0,
        correctCount: 0,
        mistakesCount: 0,
        status: 'moderate',
        description: targetPoint.description,
        examWeight: targetPoint.examWeight,
        keyFormulaOrTip: targetPoint.keyFormulaOrTip,
        radius: 34,
      });

      // 2. Category Hub
      const catId = `cat_${targetPoint.category}`;
      nodesMap.set(catId, {
        id: catId,
        name: targetPoint.categoryName,
        shortName: targetPoint.categoryName.slice(0, 4),
        category: targetPoint.category,
        categoryName: targetPoint.categoryName,
        type: 'category',
        masteryScore: 78,
        totalQuestions: 30,
        attemptedCount: 0,
        correctCount: 0,
        mistakesCount: 0,
        status: 'moderate',
        description: `北森测评 ${targetPoint.categoryName} 核心能力体系`,
        examWeight: '模块核心',
        keyFormulaOrTip: '系统掌握基础模型与速算解题策略。',
        radius: 30,
      });

      // 3. Prerequisites
      targetPoint.prerequisites.forEach((preId) => {
        const pre = RAW_KNOWLEDGE_POINTS.find((p) => p.id === preId);
        if (pre) {
          nodesMap.set(pre.id, {
            id: pre.id,
            name: pre.name,
            shortName: pre.shortName,
            category: pre.category,
            categoryName: pre.categoryName,
            type: 'topic',
            isPrerequisite: true,
            masteryScore: pre.baseAccuracy,
            totalQuestions: 4,
            attemptedCount: 0,
            correctCount: 0,
            mistakesCount: 0,
            status: 'moderate',
            description: pre.description,
            examWeight: pre.examWeight,
            keyFormulaOrTip: pre.keyFormulaOrTip,
            radius: 24,
          });
        }
      });

      // 4. Downstream / Next steps
      const downstream = (targetPoint.nextSteps || []).concat(
        RAW_KNOWLEDGE_POINTS.filter((p) => p.prerequisites.includes(targetPoint.id)).map((p) => p.id)
      );
      Array.from(new Set(downstream)).forEach((nextId) => {
        const next = RAW_KNOWLEDGE_POINTS.find((p) => p.id === nextId);
        if (next) {
          nodesMap.set(next.id, {
            id: next.id,
            name: next.name,
            shortName: next.shortName,
            category: next.category,
            categoryName: next.categoryName,
            type: 'topic',
            isNextStep: true,
            masteryScore: next.baseAccuracy,
            totalQuestions: 4,
            attemptedCount: 0,
            correctCount: 0,
            mistakesCount: 0,
            status: 'moderate',
            description: next.description,
            examWeight: next.examWeight,
            keyFormulaOrTip: next.keyFormulaOrTip,
            radius: 24,
          });
        }
      });

      // 5. Related extra relations
      EXTRA_RELATIONS.forEach((rel) => {
        if (rel.source === targetPoint.id || rel.target === targetPoint.id) {
          const otherId = rel.source === targetPoint.id ? rel.target : rel.source;
          const other = RAW_KNOWLEDGE_POINTS.find((p) => p.id === otherId);
          if (other && !nodesMap.has(other.id)) {
            nodesMap.set(other.id, {
              id: other.id,
              name: other.name,
              shortName: other.shortName,
              category: other.category,
              categoryName: other.categoryName,
              type: 'topic',
              masteryScore: other.baseAccuracy,
              totalQuestions: 3,
              attemptedCount: 0,
              correctCount: 0,
              mistakesCount: 0,
              status: 'moderate',
              description: other.description,
              examWeight: other.examWeight,
              keyFormulaOrTip: other.keyFormulaOrTip,
              radius: 22,
            });
          }
        }
      });

      // Build Links
      const linkList: GraphLink[] = [];
      // Cat -> Target
      linkList.push({
        source: catId,
        target: targetPoint.id,
        type: 'hierarchy',
        label: '核心归属',
      });

      // Pre -> Target
      targetPoint.prerequisites.forEach((preId) => {
        if (nodesMap.has(preId)) {
          linkList.push({
            source: preId,
            target: targetPoint.id,
            type: 'prerequisite',
            label: '前置基础',
          });
        }
      });

      // Target -> Downstream
      downstream.forEach((nextId) => {
        if (nodesMap.has(nextId)) {
          linkList.push({
            source: targetPoint.id,
            target: nextId,
            type: 'prerequisite',
            label: '延伸进阶',
          });
        }
      });

      // Extra relations
      EXTRA_RELATIONS.forEach((rel) => {
        if (nodesMap.has(rel.source) && nodesMap.has(rel.target)) {
          linkList.push({
            source: rel.source,
            target: rel.target,
            type: rel.type as any,
            label: rel.label,
          });
        }
      });

      return { nodes: Array.from(nodesMap.values()), links: linkList };
    } else {
      // Global View
      const rootNode: GraphNode = {
        id: 'root_hub',
        name: '北森测评能力全景',
        shortName: '能力全景',
        category: 'root',
        categoryName: '全科综合',
        type: 'root',
        masteryScore: 75,
        totalQuestions: allQuestions.length,
        attemptedCount: 0,
        correctCount: 0,
        mistakesCount: 0,
        status: 'mastered',
        description: '北森核心测评三大模块知识图谱体系',
        examWeight: '全科 100%',
        keyFormulaOrTip: '全科协同，掌握核心题型规律。',
        radius: 30,
      };

      const catNodes: GraphNode[] = [
        {
          id: 'cat_verbal',
          name: '言语理解与推理',
          shortName: '言语推理',
          category: 'verbal',
          categoryName: '言语理解与推理',
          type: 'category',
          masteryScore: 78,
          totalQuestions: 30,
          attemptedCount: 0,
          correctCount: 0,
          mistakesCount: 0,
          status: 'moderate',
          description: '言语理解核心题型体系',
          examWeight: '占比 35%',
          keyFormulaOrTip: '抓转折抓中心句。',
          radius: 26,
        },
        {
          id: 'cat_data',
          name: '资料分析与计算',
          shortName: '资料分析',
          category: 'data',
          categoryName: '资料分析与计算',
          type: 'category',
          masteryScore: 72,
          totalQuestions: 30,
          attemptedCount: 0,
          correctCount: 0,
          mistakesCount: 0,
          status: 'moderate',
          description: '资料分析速算与图表模型',
          examWeight: '占比 35%',
          keyFormulaOrTip: '百化分代入 n+1 秒杀。',
          radius: 26,
        },
        {
          id: 'cat_graphic',
          name: '图形推理空间思维',
          shortName: '图形推理',
          category: 'graphic',
          categoryName: '图形推理空间思维',
          type: 'category',
          masteryScore: 68,
          totalQuestions: 30,
          attemptedCount: 0,
          correctCount: 0,
          mistakesCount: 0,
          status: 'moderate',
          description: '图形推理空间拓扑与变化规律',
          examWeight: '占比 30%',
          keyFormulaOrTip: '同消异存，定位特征基准。',
          radius: 26,
        },
      ];

      const topicNodes: GraphNode[] = RAW_KNOWLEDGE_POINTS.map((item) => ({
        id: item.id,
        name: item.name,
        shortName: item.shortName,
        category: item.category,
        categoryName: item.categoryName,
        type: 'topic',
        isTarget: item.id === targetPoint.id,
        masteryScore: item.baseAccuracy,
        totalQuestions: 4,
        attemptedCount: 0,
        correctCount: 0,
        mistakesCount: 0,
        status: 'moderate',
        description: item.description,
        examWeight: item.examWeight,
        keyFormulaOrTip: item.keyFormulaOrTip,
        radius: item.id === targetPoint.id ? 28 : 18,
      }));

      const linkList: GraphLink[] = [
        { source: 'root_hub', target: 'cat_verbal', type: 'hierarchy' },
        { source: 'root_hub', target: 'cat_data', type: 'hierarchy' },
        { source: 'root_hub', target: 'cat_graphic', type: 'hierarchy' },
      ];

      RAW_KNOWLEDGE_POINTS.forEach((pt) => {
        linkList.push({
          source: `cat_${pt.category}`,
          target: pt.id,
          type: 'hierarchy',
        });
        pt.prerequisites.forEach((preId) => {
          linkList.push({
            source: preId,
            target: pt.id,
            type: 'prerequisite',
            label: '前置',
          });
        });
      });

      EXTRA_RELATIONS.forEach((rel) => {
        linkList.push({
          source: rel.source,
          target: rel.target,
          type: rel.type as any,
          label: rel.label,
        });
      });

      return { nodes: [rootNode, ...catNodes, ...topicNodes], links: linkList };
    }
  }, [viewMode, targetPoint]);

  // Render D3 Interactive Visualization
  useEffect(() => {
    if (!isOpen || !svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = 360;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', [0, 0, width, height]);

    // Defs for markers & filters
    const defs = svg.append('defs');

    // Arrow markers
    defs
      .append('marker')
      .attr('id', 'arrow-hierarchy')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 24)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#c4b59d');

    defs
      .append('marker')
      .attr('id', 'arrow-prerequisite')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 26)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L9,0L0,4')
      .attr('fill', '#b45309');

    defs
      .append('marker')
      .attr('id', 'arrow-cross')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 24)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#92400e');

    // Container Group for Zoom/Pan
    const g = svg.append('g').attr('class', 'main-graph-group');

    // Setup Zoom
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Initial center transform
    svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(0, 0).scale(1));

    // Force Simulation Setup
    const simNodes = nodes.map((d) => ({ ...d }));
    const simLinks = links.map((d) => ({ ...d }));

    const chargeStrength = viewMode === 'focused' ? -420 : -280;
    const distanceFactor = viewMode === 'focused' ? 120 : 75;

    const simulation = d3
      .forceSimulation<GraphNode>(simNodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(simLinks)
          .id((d) => d.id)
          .distance((d) => {
            if (d.type === 'hierarchy') return distanceFactor * 0.9;
            if (d.type === 'prerequisite') return distanceFactor * 1.1;
            return distanceFactor * 1.2;
          })
          .strength((d) => (d.type === 'hierarchy' ? 0.7 : 0.5))
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.8))
      .force('collision', d3.forceCollide<GraphNode>().radius((d) => (d.radius || 20) + 16))
      .alphaDecay(0.04);

    simulationRef.current = simulation;

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', (d) => {
        if (d.type === 'prerequisite') return '#b45309';
        if (d.type === 'cross_domain') return '#854d0e';
        return '#dccfb7';
      })
      .attr('stroke-width', (d) => {
        if (d.type === 'prerequisite') return 2.2;
        return 1.4;
      })
      .attr('stroke-dasharray', (d) => {
        if (d.type === 'prerequisite') return '4,3';
        if (d.type === 'cross_domain') return '2,3';
        return 'none';
      })
      .attr('marker-end', (d) => {
        if (d.type === 'prerequisite') return 'url(#arrow-prerequisite)';
        if (d.type === 'cross_domain') return 'url(#arrow-cross)';
        return 'url(#arrow-hierarchy)';
      });

    // Link Labels
    const linkLabels = g
      .append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(simLinks.filter((d) => d.label))
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .attr('fill', '#8c765c')
      .attr('dy', -4)
      .text((d) => d.label || '');

    // Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup
      .selectAll('g')
      .data(simNodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('click', (_, d) => {
        setActiveNodeId(d.id);
      })
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Target pulse outer aura
    node
      .filter((d) => !!d.isTarget)
      .append('circle')
      .attr('r', (d) => d.radius + 10)
      .attr('fill', 'none')
      .attr('stroke', '#b45309')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.8)
      .append('animateTransform')
      .attr('attributeName', 'transform')
      .attr('type', 'rotate')
      .attr('from', '0')
      .attr('to', '360')
      .attr('dur', '16s')
      .attr('repeatCount', 'indefinite');

    // Node Base Circle
    node
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => {
        if (d.isTarget) return '#b45309';
        if (d.type === 'root') return '#2c241d';
        if (d.type === 'category') {
          return d.category === 'verbal' ? '#4338ca' : d.category === 'data' ? '#047857' : '#9a3412';
        }
        if (d.isPrerequisite) return '#d97706';
        if (d.isNextStep) return '#78350f';
        return '#faf6ee';
      })
      .attr('stroke', (d) => {
        if (d.isTarget) return '#fef3c7';
        if (d.type === 'root') return '#e3d9c4';
        if (d.type === 'category') return '#ffffff';
        if (d.id === activeNodeId) return '#b45309';
        return '#dccfb7';
      })
      .attr('stroke-width', (d) => (d.isTarget || d.id === activeNodeId ? 3 : 1.5))
      .attr('filter', (d) => (d.isTarget ? 'drop-shadow(0 2px 8px rgba(180,83,9,0.35))' : 'none'));

    // Node Text (Short Name)
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => (d.type === 'topic' && !d.isTarget ? '0.35em' : '0.35em'))
      .attr('font-size', (d) => {
        if (d.isTarget) return '11px';
        if (d.type === 'root' || d.type === 'category') return '10.5px';
        return '9.5px';
      })
      .attr('font-weight', (d) => (d.isTarget || d.type === 'root' ? '800' : '600'))
      .attr('fill', (d) => {
        if (d.isTarget || d.type === 'root' || d.type === 'category' || d.isPrerequisite || d.isNextStep) {
          return '#ffffff';
        }
        return '#3d3124';
      })
      .text((d) => d.shortName);

    // Target Tag Badge on top
    const targetNodes = node.filter((d) => !!d.isTarget);
    targetNodes
      .append('rect')
      .attr('x', -28)
      .attr('y', (d) => -d.radius - 14)
      .attr('width', 56)
      .attr('height', 16)
      .attr('rx', 4)
      .attr('fill', '#2c241d')
      .attr('stroke', '#b45309')
      .attr('stroke-width', 1);

    targetNodes
      .append('text')
      .attr('x', 0)
      .attr('y', (d) => -d.radius - 3)
      .attr('text-anchor', 'middle')
      .attr('font-size', '8.5px')
      .attr('font-weight', '700')
      .attr('fill', '#fef3c7')
      .text('当前本题考点');

    // Simulation Ticking
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [isOpen, viewMode, nodes, links, activeNodeId, targetPoint]);

  if (!isOpen) return null;

  const CategoryIcon =
    question.category === 'verbal' ? BookOpen : question.category === 'data' ? BarChart3 : Shapes;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1e1711]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#fdfbf7] w-full max-w-4xl max-h-[92vh] rounded-2xl border border-[#e3d9c4] shadow-2xl flex flex-col overflow-hidden text-[#2c241d]">
        {/* Modal Top Header */}
        <div className="bg-[#f7f2e5] border-b border-[#e3d9c4] px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#b45309] text-white flex items-center justify-center shadow-xs">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-[#26201a]">
                  关联考点图谱 · 知识网络定位
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-[#fef7ea] text-[#854d0e] border border-[#ebdcb9]">
                  {question.categoryName}
                </span>
                <span className="text-[11px] text-[#786c5e] font-medium hidden sm:inline-block">
                  · {question.subCategory}
                </span>
              </div>
              <p className="text-xs text-[#786c5e] mt-0.5">
                定位本题在北森测评全科知识图谱中的层级坐标、前置基础与进阶考点
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#ded4bf] bg-[#faf6ee] text-[#786c5e] hover:text-[#26201a] hover:bg-[#f2ebd9] cursor-pointer transition-colors"
            title="关闭图谱"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Two-column layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* View Mode Controls & Graph Canvas */}
          <div className="bg-[#fffdfa] rounded-xl border border-[#e3d9c4] p-3 shadow-2xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#8c7e6d] font-semibold">图谱视野:</span>
                <div className="bg-[#f3ece0] p-0.5 rounded-lg flex">
                  <button
                    onClick={() => setViewMode('focused')}
                    className={`px-3 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                      viewMode === 'focused'
                        ? 'bg-[#fffdfa] text-[#b45309] shadow-2xs'
                        : 'text-[#786c5e] hover:text-[#26201a]'
                    }`}
                  >
                    🎯 本题考点网络 (推荐)
                  </button>
                  <button
                    onClick={() => setViewMode('global')}
                    className={`px-3 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                      viewMode === 'global'
                        ? 'bg-[#fffdfa] text-[#b45309] shadow-2xs'
                        : 'text-[#786c5e] hover:text-[#26201a]'
                    }`}
                  >
                    🌐 全科全景图谱
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#786c5e]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]"></span> 当前考点
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span> 前置基础
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#78350f]"></span> 延伸进阶
                </span>
              </div>
            </div>

            {/* D3 SVG Container */}
            <div
              ref={containerRef}
              className="relative w-full h-[320px] sm:h-[360px] bg-[#fbf9f4] rounded-lg border border-[#ebdcb9] overflow-hidden select-none"
            >
              <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

              {/* Floating Canvas Controls */}
              <div className="absolute right-3 bottom-3 flex flex-col gap-1 bg-[#fdfbf7]/90 backdrop-blur-xs p-1 rounded-lg border border-[#e3d9c4] shadow-xs">
                <button
                  onClick={() => {
                    if (svgRef.current) {
                      d3.select(svgRef.current).transition().duration(250).call(d3.zoom().scaleBy as any, 1.25);
                    }
                  }}
                  className="p-1 text-[#6e6153] hover:text-[#26201a] hover:bg-[#f3ebd9] rounded cursor-pointer"
                  title="放大"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (svgRef.current) {
                      d3.select(svgRef.current).transition().duration(250).call(d3.zoom().scaleBy as any, 0.8);
                    }
                  }}
                  className="p-1 text-[#6e6153] hover:text-[#26201a] hover:bg-[#f3ebd9] rounded cursor-pointer"
                  title="缩小"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (svgRef.current) {
                      d3.select(svgRef.current).transition().duration(300).call(d3.zoom().transform as any, d3.zoomIdentity);
                    }
                  }}
                  className="p-1 text-[#6e6153] hover:text-[#26201a] hover:bg-[#f3ebd9] rounded cursor-pointer"
                  title="重置视野"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Helper guide in corner */}
              <div className="absolute left-3 top-3 bg-[#fdfbf7]/90 px-2 py-1 rounded text-[10px] text-[#8c7e6d] border border-[#ebdcb9]">
                💡 点击任意节点可查看该考点破题方法与前置链路；按住拖动可平移画布
              </div>
            </div>
          </div>

          {/* Active Knowledge Point Deep-dive Card */}
          <div className="bg-[#f7f2e5] rounded-xl border border-[#ded2bd] p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfd5bf]">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                    activePointInfo.point.category === 'verbal'
                      ? 'bg-[#4338ca]'
                      : activePointInfo.point.category === 'data'
                      ? 'bg-[#047857]'
                      : 'bg-[#b45309]'
                  }`}
                >
                  <CategoryIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-[#26201a]">
                      {activePointInfo.point.name}
                    </span>
                    {activePointInfo.point.id === targetPoint.id && (
                      <span className="text-[10px] bg-[#b45309] text-white px-1.5 py-0.5 rounded font-bold">
                        本题归属考点
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#786c5e] flex items-center gap-2 mt-0.5">
                    <span>{activePointInfo.point.categoryName}</span>
                    <span>·</span>
                    <span className="text-[#854d0e] font-semibold">{activePointInfo.point.examWeight}</span>
                  </div>
                </div>
              </div>

              {/* Mastery Gauge */}
              <div className="flex items-center gap-3 bg-[#fffdfa] px-3.5 py-1.5 rounded-xl border border-[#ebdcb9] shadow-2xs">
                <div className="text-right">
                  <div className="text-[11px] text-[#786c5e]">个人掌握度估算</div>
                  <div className="text-sm font-extrabold text-[#26201a]">
                    {activePointInfo.masteryScore}%{' '}
                    <span
                      className={`text-xs font-semibold ${
                        activePointInfo.status === 'mastered'
                          ? 'text-[#15803d]'
                          : activePointInfo.status === 'moderate'
                          ? 'text-[#b45309]'
                          : 'text-[#b91c1c]'
                      }`}
                    >
                      ({activePointInfo.status === 'mastered' ? '熟练' : activePointInfo.status === 'moderate' ? '良好' : '薄弱'})
                    </span>
                  </div>
                </div>
                <div className="w-16 bg-[#eaddc5] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      activePointInfo.status === 'mastered'
                        ? 'bg-[#15803d]'
                        : activePointInfo.status === 'moderate'
                        ? 'bg-[#b45309]'
                        : 'bg-[#b91c1c]'
                    }`}
                    style={{ width: `${activePointInfo.masteryScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Point Description & Core Formula */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#fffdfa] p-3 rounded-lg border border-[#ebdcb9] space-y-1">
                <div className="font-semibold text-[#854d0e] flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>考点内涵与考察目标</span>
                </div>
                <p className="text-[#4a3e31] leading-relaxed">{activePointInfo.point.description}</p>
              </div>

              <div className="bg-[#fff8eb] p-3 rounded-lg border border-[#f0d8a8] space-y-1">
                <div className="font-semibold text-[#92400e] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>名师秒杀口诀与速解法宝</span>
                </div>
                <p className="text-[#78350f] leading-relaxed font-mono font-medium">
                  {activePointInfo.point.keyFormulaOrTip}
                </p>
              </div>
            </div>

            {/* Learning Path Chain: Prerequisites -> Next Steps */}
            <div className="pt-2 border-t border-[#dfd5bf] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#786c5e] font-semibold">前置考点:</span>
                {activePointInfo.point.prerequisites.length === 0 ? (
                  <span className="text-[#968877]">无前置依赖（基础起手考点）</span>
                ) : (
                  activePointInfo.point.prerequisites.map((preId) => {
                    const pre = RAW_KNOWLEDGE_POINTS.find((p) => p.id === preId);
                    return (
                      <button
                        key={preId}
                        onClick={() => setActiveNodeId(preId)}
                        className="px-2 py-0.5 bg-[#fffdfa] hover:bg-[#f3ebd9] border border-[#dccfb7] rounded text-[#4a3e31] font-medium cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <span>{pre?.shortName || preId}</span>
                        <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    );
                  })
                )}
              </div>

              {/* Action Button: Jump to practice this subcategory */}
              {onNavigateToSubCategory && (
                <button
                  onClick={() => {
                    onNavigateToSubCategory(activePointInfo.point.category, activePointInfo.point.shortName);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 bg-[#b45309] hover:bg-[#9a3412] text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95 text-xs"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>专项练习此考点 ({activePointInfo.questionCount} 题)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-[#f7f2e5] border-t border-[#e3d9c4] px-5 py-3 flex items-center justify-between text-xs">
          <div className="text-[#786c5e]">
            已收录北森全科知识图谱核心考点 23 项 · 覆盖真题 {allQuestions.length} 道
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2c241d] hover:bg-[#3d3124] text-white font-semibold rounded-lg cursor-pointer transition-colors"
          >
            返回做题
          </button>
        </div>
      </div>
    </div>
  );
};
