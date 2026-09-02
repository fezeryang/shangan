// 本文件由 PDF 题库《2026上岸测评题库（最新版）》自动解析生成，请勿手工编辑。
// 资料分析与计算（254 题）：共 254 题，与 PDF 原文严格对齐。
import type { Question } from '../types';

export const dataAnalysisQuestions: Question[] = [
  {
  id: 'd-2026-001',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `近年智能手机市场竞争激烈，下图为某手机运营商绘制的A、B 两款手机在某地4 年来的用户数量图。
请根据下列信息回答问题: A 手机用户与B 手机用户相比( )`,
  stemImages: ["/qbank/img_614e8199ee.webp"],
  options: [
    { key: "A", content: `过去四年，该地区A 手机的新用户总量大于B 手机的新用户总量` },
    { key: "B", content: `过去四年，B 手机新用户的增长速度低于A 手机新用户的增长速度` },
    { key: "C", content: `过去四年，B 手机在第二年的新用户增长率低于A 手机的新用户增长率` },
    { key: "D", content: `过去四年，该地区A 手机新用户数和B 手机新用户数接近` },
  ],
  correctAnswer: 'A',
  explanation: `A 项：A 总量=9800+11000+15000+18000=53800；B 总量=2500+4330+8500+14000=29330，
A＞B 且不接近，A 正确D 错误。B 项：B 增长速度=（14000-2500）/2500=4.6；A 增长速度=（18000-9800）
/9800=83.7%，错误。C 项：B 第二年增长率=（4330-2500）/2500=73.2%，A 第二年增长率=（11000-9800）
/9800=12.2%，错误。`,
  },
  {
  id: 'd-2026-002',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'medium',
  stem: `HOC 是一家汽车零件生产公司。初步核算，该公司成立的第11 年在国内的销售额达到了6528.72
万元，比上一年增长14.9%。其中，A 区域销售额为606.80 万元，增长5.5%；B 区域销售额为3447.48
万元，增长17.8%；C 区域销售额为2474.44 万元，增长13.3%。下列说法不符合上图的是哪一项?`,
  stemImages: ["/qbank/img_4bad9964fc.webp"],
  options: [
    { key: "A", content: `近年来该公司销售额持续增加` },
    { key: "B", content: `该公司年销售额自成立以来始终保持在3000 万元以上` },
    { key: "C", content: `该公司现在的销售额达到了第二年的两倍以上` },
    { key: "D", content: `该公司第七年和第八年销售额增速同比上年度有所放缓` },
  ],
  correctAnswer: 'B',
  explanation: `如图A 项正确；B 项错误，第二三四年没有达到3000 万元；C 项6528.72/2352=2.78，正确；
D 项第七年和第八年销售额增速均为12.0%，比第六年13.0%有所放缓正确。`,
  },
  {
  id: 'd-2026-003',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `NEO 公司有A、B、C、D、E、F 六家店铺，去年共实现销售收入56 亿元。该公司去年1-4 季度的销
售收入和各店铺的收入如下列图表所示。
去年销售利润率最高的店铺是( )`,
  stemImages: ["/qbank/img_e9a594ec17.webp"],
  options: [
    { key: "A", content: `A 店铺` },
    { key: "B", content: `C 店铺` },
    { key: "C", content: `D 店铺` },
    { key: "D", content: `F 店铺` },
  ],
  correctAnswer: 'D',
  explanation: `销售利润率=（销售收入-销售成本）÷销售收入,A 店铺=（16.8-12.7）/16.8=24.4%,C 店铺=
（10.4-6.3）/10.4=39.4%,D 店铺=（8.5-4.5）/8.5=47%,F 店铺=（3-1.4）/3=53%`,
  },
  {
  id: 'd-2026-004',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `在一项社会调查中，研究者总共发放了500 份问卷。由于部分人的人口学信息不完整等原因，部分
问卷变成了无效问卷。对有效调查问卷进行统计后，得到了调查数据和调查结果，如下列图表所示。
认为知心朋友最重要而且对生活感到满意的，大约有( )人?`,
  stemImages: ["/qbank/img_7f02b6fdce.webp"],
  options: [
    { key: "A", content: `24` },
    { key: "B", content: `73` },
    { key: "C", content: `65` },
    { key: "D", content: `信息不足，无法评价` },
  ],
  correctAnswer: 'A',
  explanation: `看右边柱状图，满意和不满意加起来都是495，可知有效问卷为495 份，150*0.16=24`,
  },
  {
  id: 'd-2026-005',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `根据下表回答问题。CR 公司近年来销售额情况（单位：万元）该公司销售额增幅降低的年份有几
个:( )`,
  stemImages: ["/qbank/img_d3d2efc874.webp"],
  options: [
    { key: "A", content: `1` },
    { key: "B", content: `2` },
    { key: "C", content: `3` },
    { key: "D", content: `4` },
  ],
  correctAnswer: 'C',
  explanation: `第二年销售额增幅=（191571-162376）/162376=18%第三年销售额增幅=（204540-191571）
/191571=6.8% 第四年销售额增幅= （217261-204540 ）/204540=6.2% 第五年销售额增幅=
（227991-217261）/217261=4.9%销售额增幅降低的年份有3 个。`,
  },
  {
  id: 'd-2026-006',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下列图表是我国2 月份全社会客货运输量的信息。请根据图表相关信息，回答问题。2 月份，公路
货运量占货运总量的( )`,
  stemImages: ["/qbank/img_55180bf947.webp"],
  options: [
    { key: "A", content: `65%` },
    { key: "B", content: `79%` },
    { key: "C", content: `85%` },
    { key: "D", content: `34.8%` },
  ],
  correctAnswer: 'B',
  explanation: `31.28÷（2.77+31.28+5.42+0.005036）=79%`,
  },
  {
  id: 'd-2026-007',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `以下是2011 年到2014 年BAT 公布的营收增长图，请根据表格回答下列问题: 2012 年哪两个公司增
长率大致相同`,
  stemImages: ["/qbank/img_83836489bc.webp"],
  options: [
    { key: "A", content: `阿里巴巴和百度` },
    { key: "B", content: `百度和腾讯` },
    { key: "C", content: `阿里巴巴和腾讯` },
  ],
  correctAnswer: 'B',
  explanation: `2012 年百度与腾讯增长率大致相同，均为50%左右。`,
  },
  {
  id: 'd-2026-008',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '平均数计算',
  difficulty: 'medium',
  stem: `A 和B 是人们普遍选择的两款共享单车APP。下面统计了两个APP 近4 个月用户变化情况。请根据
下列图表回答问题: B 独占用户为总用户数增长的平均贡献率约为( )`,
  stemImages: ["/qbank/img_1ae6b15de4.webp"],
  options: [
    { key: "A", content: `60%` },
    { key: "B", content: `64%` },
    { key: "C", content: `68%` },
    { key: "D", content: `72%` },
  ],
  correctAnswer: 'C',
  explanation: `（73.8%+67.6%+64.6%+65.8%）/ 4 = 67.95 约68%`,
  },
  {
  id: 'd-2026-009',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `Y 公司是主营机器人制造的上市公司。Y 公司近五年资产构成情况公布如下股东权益是总资产除去总
负债，是净资产的代表。请根据相关信息，回答问题。Y 公司每年的流动资产在总资产中的比例都
大于50%。该说法( )`,
  stemImages: ["/qbank/img_f5dee01c50.webp"],
  options: [
    { key: "A", content: `正确` },
    { key: "B", content: `错误` },
    { key: "C", content: `无法判断` },
  ],
  correctAnswer: 'A',
  explanation: `第一年=578.19/739.96=78.1%
第二年=610.4/829.39=73.6%
第三年=539.43/772.41=69.8%
第四年=686.88/955.23=72%
第五年=615.16/747.75=82.3%`,
  },
  {
  id: 'd-2026-010',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `IT 公司某年销售额及其增长速度（单位：万元，%）前一年,销售三部销售额与销售二部相比，与以下哪项数据更接
近:( )`,
  stemImages: ["/qbank/img_0cb0633fa6.webp"],
  options: [
    { key: "A", content: `约多35000 万元` },
    { key: "B", content: `约多31000 万元` },
    { key: "C", content: `约少10000 万元` },
  ],
  correctAnswer: 'B',
  explanation: `[306739/（1+8.1%）]-[271392/（1+7.2%）]≈31000`,
  },
  {
  id: 'd-2026-011',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下列图表是我国2 月份全社会客货运输量的信息。请根据图表相关信息，回答问题。单纯地从量来看，去年2 月份，
运输量最大的是( )`,
  stemImages: ["/qbank/img_064efbf352.webp"],
  options: [
    { key: "A", content: `民航货运量` },
    { key: "B", content: `铁路客运量` },
    { key: "C", content: `公路货运量` },
    { key: "D", content: `水运货运量` },
  ],
  correctAnswer: 'C',
  explanation: `注意看单位哈！民航是50.36 万吨，公路是31.28 亿吨`,
  },
  {
  id: 'd-2026-012',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'easy',
  stem: `近6 年中国网络游戏产业发展情况手游的市场份额从第四年的900 亿上升为第五年的1300 亿，估
计端游第五年的市场份额比第四年( )。`,
  stemImages: ["/qbank/img_dbd4f67afc.webp"],
  options: [
    { key: "A", content: `增长了约44 亿` },
    { key: "B", content: `减少了约108 亿` },
    { key: "C", content: `增长了约66 亿` },
    { key: "D", content: `减少了约24 亿` },
  ],
  correctAnswer: 'A',
  explanation: `（1300/57%*32%）-（900/49.9%*38%）≈44`,
  },
  {
  id: 'd-2026-013',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长量',
  difficulty: 'hard',
  stem: `2019 年全国二手车交易量及同比增速统计图回答下列问题。2014-2019 年全国二手车交易量同比
增量高于80 万量的年份有( )个。`,
  stemImages: ["/qbank/img_f1e177003d.webp"],
  options: [
    { key: "A", content: `4` },
    { key: "B", content: `5` },
    { key: "C", content: `3` },
  ],
  correctAnswer: 'A',
  explanation: `交易量相减，如下超过80 的有四个
920-847 = 73
962- 920 = 42
1068 - 962 = 106
1270 - 1068 = 202
1384 - 1270 = 114
1467 - 1384 = 83`,
  },
  {
  id: 'd-2026-014',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'medium',
  stem: `下图反映了某公司近三年2 月至9 月的投资额情况(单位:千万元)。根据图表回答下列问题: 下列说法
错误的是( )。`,
  stemImages: ["/qbank/img_6bb147b9ea.webp"],
  options: [
    { key: "A", content: `第三年二、三两季度的投资规模较第二年二、三季度个月的投资规模有不同幅度的增长` },
    { key: "B", content: `第三年二、三两季度的投资规模较第二年二、三季度个月的投资规模有不同幅度的增长` },
    { key: "C", content: `第三年4-9 月与这几年二、三季度投资规模的变化方向是一致的` },
    { key: "D", content: `第三年全年投资规模的同比增长速度是一路攀升的` },
  ],
  correctAnswer: 'D',
  explanation: `D 项第三年2-3 月份投资规模的增长速度=（149.6-173.8）/173.8=-13.9%，D 项错误`,
  },
  {
  id: 'd-2026-015',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'easy',
  stem: `根据下表回答问题。RT 公司过去三年各区域销售额在公司销售总额中的比重（单位：%）若欧洲区
域销售额第三年下半年在公司销售总额的比重与第二年下半年持平，则欧洲区第三年全年的销售额
在公司的占比为:`,
  stemImages: ["/qbank/img_5821f04a6c.webp"],
  options: [
    { key: "A", content: `小于11%` },
    { key: "B", content: `大于12%` },
    { key: "C", content: `大于13%` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-016',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图是近几年某市的旅游接待量(单位:万人次)。根据图表回答下列问题: 后四年的人数同比增长率呈
现( )趋势。`,
  stemImages: ["/qbank/img_3ed3d2fedb.webp"],
  options: [
    { key: "A", content: `一直上升` },
    { key: "B", content: `一直下降` },
    { key: "C", content: `先下降在上升` },
    { key: "D", content: `先上升再下降` },
  ],
  correctAnswer: 'D',
  explanation: `3-4 年=（2544.7-2122.5）/2122.5=19.9%
4-5 年=（3054.4-2544.7）/2544.7=20%
5-6 年=（3641.3-3054.4）/3054.4=19.2% 由此得知先上升后下降`,
  },
  {
  id: 'd-2026-017',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下表展示了某门店上周和本周的营业情况。客单价和客单件是衡量该店经营的两个指标，分别代表
平均每个客人单次购买的金额和件数。请根据图表回答下列问题: 如果下周三、周四客单件继续保持
本周的增长率，那么以下关于下周三和周四客单件差异的描述正确的是:`,
  stemImages: ["/qbank/img_53389aaaaa.webp"],
  options: [
    { key: "A", content: `下周四的客单件将超越下周3` },
    { key: "B", content: `两者差异小于1 件` },
    { key: "C", content: `下周三客单件将约比下周四多3 件` },
    { key: "D", content: `下周三客单件将约比下周四多2 件` },
  ],
  correctAnswer: 'C',
  explanation: `本周三客单件增长率=（4.02-1.69）/1.69=1.38
本周三客单件增长率=（3.78-2.24）/2.24=68.8% 续保持本周的增长率，那
下周三客单件=4.02*（1+1.38）=9.57
下周四客单件=3.78*（1+68.8%）=6.4 ，C 正确`,
  },
  {
  id: 'd-2026-018',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'medium',
  stem: `下表是GB 精密仪器公司某年的销售情况，请根据表中的信息回答问题。按照表中的变化形式，公
司之后的第二年在美国的销售量将达到(
)万件`,
  stemImages: ["/qbank/img_eb503248a3.webp"],
  options: [
    { key: "A", content: `20.08` },
    { key: "B", content: `17.12` },
    { key: "C", content: `25.06` },
    { key: "D", content: `18.97` },
  ],
  correctAnswer: 'C',
  explanation: `如图美国地区销售总量为33.1 万件，增长率为-24.3%，按照此增长率，GB 公司之后的第二年
在美国的销售量将达到33.1*（1-24.3%）=25.06`,
  },
  {
  id: 'd-2026-019',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长量',
  difficulty: 'hard',
  stem: `下表是三家外卖APP，在某年9 月份、10 月份的活跃度。请根据图表信息，回答问题。三大外卖
APP 月活跃用户数，月增长最快的是: ( )`,
  stemImages: ["/qbank/img_5d48d85e36.webp"],
  options: [
    { key: "A", content: `饿了么` },
    { key: "B", content: `美团外卖` },
    { key: "C", content: `百度外卖` },
  ],
  correctAnswer: 'C',
  explanation: `月增长指的是增长率；增长率= （增量）/ 原量
饿（1064.6-886.1）/ 886.1 = 20%
美（796.8-747.4）/ 747.4 = 6.6%
度(185.6-125.3) / 125.3 = 48.8%`,
  },
  {
  id: 'd-2026-020',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `这种题估算就行了，没不要一个个计算
对团购网站用户进行了一次调查，获得了如下列图表的调查数据。根据图表，回答问题。下列说法
错误的是( )`,
  stemImages: ["/qbank/img_557fe90911.webp"],
  options: [
    { key: "A", content: `25 岁及以下的用户使用最少的团购网站是网站C` },
    { key: "B", content: `46 岁及以上的用户最偏爱的团购网站是网站B` },
    { key: "C", content: `在4 个团购网站用户中，白领所占比例的差异最小` },
  ],
  correctAnswer: 'C',
  explanation: `看图`,
  },
  {
  id: 'd-2026-021',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `王力上周六买进某公司股票1000 股，每股27 元，下表为本周内每日该股票的涨跌情况(单位:元) 王
力上周六买进某公司股票1000 股，每股27 元，下表为本周内每日该股票的涨跌情况(单位:元)`,
  stemImages: ["/qbank/img_eb1d886003.webp"],
  options: [
    { key: "A", content: `收益860.5 元` },
    { key: "B", content: `损失879.5 元` },
    { key: "C", content: `损失883.5 元` },
    { key: "D", content: `收益889.5 元` },
  ],
  correctAnswer: 'D',
  explanation: `27*1000*1.5‰=40.5 、27+4+4.5-1-2.5-6+2=28 、28*1000*1.5‰=42 、28*1000*1‰=28 、
28*1000-40.5-28-42-27000=889.5`,
  },
  {
  id: 'd-2026-022',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `企业公布的财务信息反映了企业的经营和运营状况。毛利润、运营利润和净利润是通常使用到的指
标。毛利润通常是企业营业收入除去营业成本(如原材料、设备等生产成本和营业税等)后的收入，运
营利润是毛利润减去运营成本费用(如员工工资、管理费用、研发费用、销售费用、财务费用)后的收
入，净利润是企业运营利润加其他收入之后减去所得税额之后的收入。运营利润，在其他收入(营业
外收入)之前，反映了企业基本经营活动获得利润的能力。下表是A 公司去年和今年的运营信息，请
根据相关信息回答问题。按照营业收入来计算，A 公司今年的人均差值与去年相比:`,
  stemImages: ["/qbank/img_e41d03952f.webp"],
  options: [
    { key: "A", content: `增加了7000 元` },
    { key: "B", content: `减少了1000 元` },
    { key: "C", content: `基本一致` },
    { key: "D", content: `减少了11000 元` },
  ],
  correctAnswer: 'D',
  explanation: `去年营业收入除员工数就是人均收入
去年（4030/680）= 5.93 万元；今年（5970/1230）= 4.85 万元；5.93 - 4.85 ~= 1.1 万元`,
  },
  {
  id: 'd-2026-023',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下图是2018-2022 年我国人工智能赋能实体经济市场规模的数据。根据图表回答下列问题: 2018 年
我国人工智能赋能实体经济市场规模是多少?`,
  stemImages: ["/qbank/img_4ab0daa7f2.webp"],
  options: [
    { key: "A", content: `251.1 亿` },
    { key: "B", content: `570.1 亿` },
    { key: "C", content: `819.8 亿` },
    { key: "D", content: `1157 亿` },
  ],
  correctAnswer: 'A',
  explanation: `如图，251.1`,
  },
  {
  id: 'd-2026-024',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '平均数计算',
  difficulty: 'medium',
  stem: `某公司在4 个地区分别开了4 家连锁店,其商品销售渠道有4 种方式，分别是零售、在线、邮件预订、
电话。下图反映了某年每个地区4 家连锁店不同渠道的平均销售额。根据图表回答下列问题: A、B、
C、D4 个地区零售渠道的销售额之比为( )。`,
  stemImages: ["/qbank/img_c11e7ea31f.webp"],
  options: [
    { key: "A", content: `1:5:4:6` },
    { key: "B", content: `1:4:3:5` },
    { key: "C", content: `2:5:4:6` },
    { key: "D", content: `5:3:4:1` },
  ],
  correctAnswer: 'B',
  explanation: `1925:7700:5775:9625=1:4:3:5`,
  },
  {
  id: 'd-2026-025',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `国内服装品牌发展迅速，过去四年,太平鸟等国内服装品牌经历了较快的发展。下列图表分别呈现几
家主要的国内服装品牌过去一年的销售经营情况和太平鸟集团、拉夏贝尔两家公司过去四年的经营
情况。(注:毛利润为除去商品成本后的利润，净利润为除去商品成本、租金、员工工资等所有投入后
的利润) 过去四年，拉夏贝尔的利润比太平鸟集团( )`,
  stemImages: ["/qbank/img_b299e7c39f.webp"],
  options: [
    { key: "A", content: `多7.4 亿` },
    { key: "B", content: `多3.72 亿` },
    { key: "C", content: `少3.72 亿` },
  ],
  correctAnswer: 'A',
  explanation: `5.03+4.13+2.6+1.23-1.58-2.11-1-0.92=7.4`,
  },
  {
  id: 'd-2026-026',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下表是AMA 公司上市以来的员工数量及变化情况。请根据下表回答问题。上市以来，AMA 公司员工留任率最高的
一年是: ( )`,
  stemImages: ["/qbank/img_b38f02f9a2.webp"],
  options: [
    { key: "A", content: `第一年` },
    { key: "B", content: `第二年` },
    { key: "C", content: `第三年` },
    { key: "D", content: `第四年` },
  ],
  correctAnswer: 'B',
  explanation: `留任率= （员工人数-年内员工流失量）/员工人数`,
  },
  {
  id: 'd-2026-027',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '平均数计算',
  difficulty: 'hard',
  stem: `下表是近五年某高校困难学生资助情况表。根据表格回答下列问题: 五年间，该高校平均对每个贫困学生的资助增长
趋势是:`,
  stemImages: ["/qbank/img_36fe50bc2c.webp"],
  options: [
    { key: "A", content: `一直上升` },
    { key: "B", content: `一直下降` },
    { key: "C", content: `先下降再上升` },
    { key: "D", content: `先上升再下降` },
  ],
  correctAnswer: 'C',
  explanation: `学生资助总支出÷贫困学生数（注意单位，学生数是千人，资助是万元） 第一年：
66054/5.4=1223.2 ；第二年：92028.1/8.7=1057.8 ；第三年：104066.5/9.8=1061.9 ；第四年：
121030.3/10.7=1131.1；第五年：105886.1/9.1=1163.6，先下降再上升`,
  },
  {
  id: 'd-2026-028',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `一路平安汽车销售公司，
以销售中高端轿车为主，目前在5 个城市设有分店。公司总部和每个分店上一年度的汽车销售情况
如下所示。北京店的汽车销售量占销售总量的( )`,
  stemImages: ["/qbank/img_dd68ca2a1f.webp"],
  options: [
    { key: "A", content: `20.5%` },
    { key: "B", content: `21.0%` },
    { key: "C", content: `22.5%` },
    { key: "D", content: `21.6%` },
  ],
  correctAnswer: 'D',
  explanation: `220/（180+220+215+198+206）=21.6%`,
  },
  {
  id: 'd-2026-029',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `SUV 是一种拥有旅行车般的空间，配以货卡车的越野能力的车型。按照车身的长度，SUV 可以分为
小型，紧凑型、中型、中大型和大型，小型SUV 车长通常不超过4 米，大型SUV 车长通常在5 米以
上。我们通过调查当前汽车消费者的汽车拥有情况，获得了以下信息，请根据相关信息，回答问题。
如果这次有效调查数据为1500,则选择购买紧凑型SUV 的人数有( ) 人`,
  stemImages: ["/qbank/img_1fb38c11d1.webp"],
  options: [
    { key: "A", content: `326` },
    { key: "B", content: `485` },
    { key: "C", content: `633` },
  ],
  correctAnswer: 'A',
  explanation: `1500*51.5%*42.2%=326`,
  },
  {
  id: 'd-2026-030',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `2017 年我国入境游客人数为13948.24 万人，同比增长0.75%; 2017 年外国人入境游客为2916.53 万
人，同比增长3.6%;2017 年港澳同胞入境游客为10444.59 万人，同比下降0.11%; 2017 年台湾同胞入
境游客为587.13 万人，同比增长2.47%; 2017 年入境过夜游客为6073.84 万人，同比下降2.48%。以
下图表是2016-2017 年中国入境旅游情况分析图表。根据题干及图表回答下列问题: 下列指标2017
年同比增速排列正确的是( )`,
  stemImages: ["/qbank/img_f094217481.webp"],
  options: [
    { key: "A", content: `外国人入境游客>入境游客>台湾同胞入境游客>港澳同胞入境游客` },
    { key: "B", content: `外国人入境游客>台湾同胞入境游客>入境游客>港澳同胞入境游客` },
    { key: "C", content: `外国人入境游客>入境游客>港澳同胞入境游客>台湾同胞入境游客` },
    { key: "D", content: `港澳同胞入境游客>外国人入境游客>入境游客>台湾同胞入境游客` },
  ],
  correctAnswer: 'B',
  explanation: `各计算增长率，逐一比较`,
  },
  {
  id: 'd-2026-031',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `对于广告的记忆是影响广告有效性的重要因素，为了解一条广告的有效性,测试了一批消费者对广告
的记忆效果。在测试中随机地向消费者展示他们曾经见过的目标广告，以及他们没有见过但和目标
广告十分相似的分心广告，请消费者判断对该广告是否熟悉,下面是测试结果的报告: 下面说法正确
的是( )`,
  stemImages: ["/qbank/img_ef76a72ab4.webp"],
  options: [
    { key: "A", content: `做出了错误报告的广告共有30 条` },
    { key: "B", content: `目标广告和分心广告的比例为1:1` },
    { key: "C", content: `目标广告被报告为不熟悉的比例小于分心广告被报告为熟悉的比例` },
    { key: "D", content: `以上答案均不正确` },
  ],
  correctAnswer: 'C',
  explanation: `C 项目标广告被报告为不熟悉的比例=5/（20+5）=25%；分心广告被报告为熟悉的比例=10/
（10+25）=28.57%，正确`,
  },
  {
  id: 'd-2026-032',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下表呈现了某两年第三季度，智能手机操作系统的占有情况。请根据表中信息，回答相关问题。如
果Android 智能手机明年的出货量为36000 万台，且市场占有率增至85.2%，则预计第三年全球智能
手机的出货量为( )台`,
  stemImages: ["/qbank/img_22094455ce.webp"],
  options: [
    { key: "A", content: `39872` },
    { key: "B", content: `42303` },
    { key: "C", content: `45631` },
    { key: "D", content: `48234` },
  ],
  correctAnswer: 'B',
  explanation: `36000/82.5%=42253.5`,
  },
  {
  id: 'd-2026-033',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `手机的层出不穷给我们带来巨大的便利，但也大大增加了电子垃圾的数量，如果处置不当或随意抛
弃就会对环境和人类健康构成巨大威胁。以下是关于废置手机处理方式的一些信息，请根据这些信
息，回答相关问题。根据A、B 两家公司的调查数据，大家最不经常使用的废置手机处置方式是( )`,
  stemImages: ["/qbank/img_7001c94b26.webp"],
  options: [
    { key: "A", content: `找商家以旧换新` },
    { key: "B", content: `卖到二手市场` },
    { key: "C", content: `直接扔掉` },
    { key: "D", content: `放到家中不去处理` },
  ],
  correctAnswer: 'C',
  explanation: `C 项比例最小`,
  },
  {
  id: 'd-2026-034',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `NARR 公司成立八年来，用于产品研发的资金逐年增加。第八年产品研发投资为12310.5 万元，比上
一年增长38.4%，其中人工智能类产品研发投入10515.8 万元，增长40.3%,增速同比分别加快9.6 和
9.1 个百分点;大数据产品研发投入7 万元，增长27.9%。NARR 公司成立八年来，产品研发投资增长
速度变化超过3%的有几年? ( )`,
  stemImages: ["/qbank/img_82e93f68f6.webp"],
  options: [
    { key: "A", content: `2 年` },
    { key: "B", content: `3 年` },
    { key: "C", content: `4 年` },
    { key: "D", content: `5 年` },
  ],
  correctAnswer: 'C',
  explanation: `看折线，后一年-前一年取绝对值，超过3%的都可以`,
  },
  {
  id: 'd-2026-035',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下图是RM 公司A 款产品去年一年的销售情况。请根据相关信息，回答问题。A 款产品去年销售的
达标率为( )`,
  stemImages: ["/qbank/img_b1615898ce.webp"],
  options: [
    { key: "A", content: `96%` },
    { key: "B", content: `90%` },
    { key: "C", content: `100%` },
    { key: "D", content: `110%` },
  ],
  correctAnswer: 'C',
  explanation: `(310+320+350+400+370+410+420+425+445+520+470+530)/
（300+320+380+380+380+400+420+420+450+500+500+520）= 1`,
  },
  {
  id: 'd-2026-036',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `3S 集团是一家电子科技公司，其产品深受广大用户的喜爱，上市6 年来公司营业额和资产总额都发
生了显著变化。截止第六年年底，大中华区营业额达到10670 万美元，比上年增加106 万;北美区营
业额为576 万美元，同比减少17 万;欧洲区营业额为1271 万美元，同比增加139 万;东南亚区营业总
额为193 万美元，同比增加13 万元。就公司资产总额而言，大中华区公司资产总额达到52850 万美
元，比上一年增加2690 万，增加5.4%。北美区公司资产总额为750 万美元，比上一年减少1.6%。欧
洲区公司资产总额为2950 万美元，增加14.8%。东南亚区公司资产总额为330 万美元，增加6.7%。如
图可知，该公司上市第一年大中华区资产总额约比第六年少（）万美元`,
  stemImages: ["/qbank/img_d3663bae04.webp"],
  options: [
    { key: "A", content: `6030` },
    { key: "B", content: `5903` },
    { key: "C", content: `7090` },
    { key: "D", content: `9780` },
  ],
  correctAnswer: 'D',
  explanation: `第一年大中华区资产总额=46947/（1+9%）=43070，比第六年少52850-43070=9780 万美元`,
  },
  {
  id: 'd-2026-037',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'easy',
  stem: `下列图表是关于淘宝网用户月均购物次数和消费金额的统计结果。请根据图表,回答相关问题。哪
类用户群的月消费额最高:`,
  stemImages: ["/qbank/img_b0e5f29936.webp"],
  options: [
    { key: "A", content: `每月消费101-300 元的用户群` },
    { key: "B", content: `每月消费301-500 元的用户群` },
    { key: "C", content: `每月消费501-1000 元的用户群` },
  ],
  correctAnswer: 'C',
  explanation: `问的是销售额，不是比重。`,
  },
  {
  id: 'd-2026-038',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `下图为2013年-2022年某支付app交易规模及增长率根据表格回答下列问题: 按此数据趋势来预判，
2023 年该app 将增长几个百分点?`,
  stemImages: ["/qbank/img_ae459a1416.webp"],
  options: [
    { key: "A", content: `一定高于12%` },
    { key: "B", content: `可能负增长` },
    { key: "C", content: `可能低于11%` },
    { key: "D", content: `无法判定` },
  ],
  correctAnswer: 'C',
  explanation: `增长率降低了，不是负增长哦，B 不对`,
  },
  {
  id: 'd-2026-039',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '平均数计算',
  difficulty: 'hard',
  stem: `下图反映了近几年某公司四种产品的销售额情况(单位:万元)。根据图表回答下列问题: 近五年来，销
售总额平均每年增长( )万元。`,
  stemImages: ["/qbank/img_8d84a9554a.webp"],
  options: [
    { key: "A", content: `580` },
    { key: "B", content: `724.9` },
    { key: "C", content: `3912.5` },
    { key: "D", content: `4890.6` },
  ],
  correctAnswer: 'B',
  explanation: `第一年销售总额=702.3+1427.27+45.04+78.81=2253.42 第五年销售总额
=2061+2527+167+398=5153 平均每年增长（5153-2253.42）÷4=724.9`,
  },
  {
  id: 'd-2026-040',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图是某市场一年A、B、C 三种系列商品的销售额情况(单位:万元)。根据图表回答下列问题: B 产品
销售额的增长率呈现( )的趋势。`,
  stemImages: ["/qbank/img_47aabd9ec2.webp"],
  options: [
    { key: "A", content: `持续上升` },
    { key: "B", content: `先上升后下降` },
    { key: "C", content: `先下降后上升` },
    { key: "D", content: `持续下降` },
  ],
  correctAnswer: 'B',
  explanation: `B 产品第二季度销售额增长率=（56.2-51.9）÷51.9=8.3%；第三季度=（65.7-56.2）÷56.2=16.9%；
第四季度=（70.4-65.7）÷65.7=7.2%，先上升后下降`,
  },
  {
  id: 'd-2026-041',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'hard',
  stem: `下图是世界几个国家去年4 月份APP 的下载情况。从全球的平均结果来看，移动应用(APP)76%是智
能手机用户下载，24%是PAD 用户下载的，请根据相关信息，回答问题。如果德国使用PAD 和智
能手机下载APP 的用户比例与全球平均值相同，那么去年4 月份德国的智能手机用户数约为( )`,
  stemImages: ["/qbank/img_128a0531df.webp"],
  options: [
    { key: "A", content: `6100 万` },
    { key: "B", content: `5900 万` },
    { key: "C", content: `5600 万` },
    { key: "D", content: `6000 万` },
  ],
  correctAnswer: 'A',
  explanation: `185÷2.3=80.4 百万人；80.4*76%=61 百万=6100 万`,
  },
  {
  id: 'd-2026-042',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `AR 公司是一家家电销售公司，请根据下表回答问题。去年销售三部第三季度销售量占该季度各部
门总销售量的( )`,
  stemImages: ["/qbank/img_0be0659a3d.webp"],
  options: [
    { key: "A", content: `30%` },
    { key: "B", content: `28.8%` },
    { key: "C", content: `29.6%` },
    { key: "D", content: `29.0%` },
  ],
  correctAnswer: 'A',
  explanation: `19395.6÷64934.4=30%`,
  },
  {
  id: 'd-2026-043',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率比较',
  difficulty: 'hard',
  stem: `下图是近五年某公司两类产品的销售额情况(单位:万元)。根据图表回答下列问题: A 类产品的销售额
增长速度最快的是第( )年。`,
  stemImages: ["/qbank/img_8f09169a5d.webp"],
  options: [
    { key: "A", content: `五` },
    { key: "B", content: `四` },
    { key: "C", content: `三` },
    { key: "D", content: `二` },
  ],
  correctAnswer: 'C',
  explanation: `第二年销售额增长速度=（4330-2386）÷2386=81.5%第三年销售额增长速度=（8453-4330）
÷4330=95% 第四年销售额增长速度=（14522-8453 ）÷8453=71.8% 第五年销售额增长速度=
（20662-14522）÷14522=42.3%`,
  },
  {
  id: 'd-2026-044',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下表是TT 公司某年的销售报表，公司共有销售一部、二部和三部三个销售团队。请根据下表回答问
题。前一年，销售三部销售额与销售二部相比, 与以下哪项数据更接近: ( )`,
  stemImages: ["/qbank/img_0e056b237f.webp"],
  options: [
    { key: "A", content: `约多35000 万元` },
    { key: "B", content: `约多31000 万元` },
    { key: "C", content: `约少10000 万元` },
    { key: "D", content: `约多29000 万元` },
  ],
  correctAnswer: 'B',
  explanation: `前一年销售三部销售额=306739÷（1+8.1%）=283755 销售二部销售额=271392÷（1+7.3%）
=252928 作差≈31000`,
  },
  {
  id: 'd-2026-045',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `在一项社会调查中，研究者总共发放了500 份问卷。由于部分人的人口学信息不完整等原因，部分
问卷变成了无效问卷。对有效调查问卷进行统计后，得到了调查数据和调查结果，如下列图表所示。
认为健康重要的人数比认为工作重要的人数( )`,
  stemImages: ["/qbank/img_154c3aa5b4.webp"],
  options: [
    { key: "A", content: `多34 人` },
    { key: "B", content: `多170 人` },
    { key: "C", content: `多192 人` },
    { key: "D", content: `多168 人` },
  ],
  correctAnswer: 'D',
  explanation: `495*39%-495*5%=168`,
  },
  {
  id: 'd-2026-046',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `美国人每天在手机和数字设备花费的时间如下图所示。请根据图中信息，回答问题。美国人每天在
哪种数字设备上花费时间最长( )`,
  stemImages: ["/qbank/img_6af8716832.webp"],
  options: [
    { key: "A", content: `电视` },
    { key: "B", content: `电脑` },
    { key: "C", content: `手机` },
    { key: "D", content: `无法判定` },
  ],
  correctAnswer: 'D',
  explanation: `图二是每次时长，并不知道频率`,
  },
  {
  id: 'd-2026-047',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'hard',
  stem: `下表反映了近两年一公司在某省八个地区的盈利情况(单位:万元)。根据表格回答下列问题: 今年D
地区盈利占该省总盈利的比重比上一年( )。`,
  stemImages: ["/qbank/img_46f5ae264e.webp"],
  options: [
    { key: "A", content: `上升了20.2 个百分点` },
    { key: "B", content: `下降了20.2 个百分点` },
    { key: "C", content: `上升了2.6 个百分点` },
    { key: "D", content: `下降了2.6 个百分点` },
  ],
  correctAnswer: 'D',
  explanation: `今年D 地区盈利占该省总盈利的比重=29014÷333177=8.7%去年D 地区盈利占该省总盈利的比
重=（29014-4876）÷（333177-119328）=11.3%作差8.7%-11.3%=-2.6%`,
  },
  {
  id: 'd-2026-048',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下图反映了某年A、B 两国体育产业结构(单位: %)。根据图表回答下列问题: 下列说法不正确的是( )。`,
  stemImages: ["/qbank/img_6de05a9083.webp"],
  options: [
    { key: "A", content: `国体育产业结构发展不均衡` },
    { key: "B", content: `国的赛事服务及健身服务等核心产业的市场化程度过低` },
    { key: "C", content: `国的赛事服务及健身服务产业，仅占体育总产值的21%，远低于A 国同期水平` },
    { key: "D", content: `国处于产业化初期` },
  ],
  correctAnswer: 'C',
  explanation: `C 项B 国的赛事服务及健身服务产业占体育总产值的8%+6%=14%`,
  },
  {
  id: 'd-2026-049',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '平均数计算',
  difficulty: 'easy',
  stem: `下表是A 旅游城市1-7 月各类酒店运营情况。根据下表回答问题。以下说法正确的是: ( )`,
  stemImages: ["/qbank/img_7f57886d5d.webp"],
  options: [
    { key: "A", content: `星级越高，饭店平均入住率越高` },
    { key: "B", content: `星级饭店7 月份平均房价均高于1-7 月份平均房价` },
    { key: "C", content: `1-7 月，星级饭店平均入住率呈负增长趋势` },
    { key: "D", content: `五星级饭店7 月平均房价低于1-7 月平均水平` },
  ],
  correctAnswer: 'D',
  explanation: `A 项，三星级酒店入住率没有二星级的高，错误；B 项，三星级饭店7 月份平均房价低于1-7
月份平均房价，错误；C 项，1-7 月，星级饭店平均入住率呈增长下降再增长趋势，错误；D 项五星
级饭店7 月平均房价751.9 低于1-7 月平均水平796.1，正确`,
  },
  {
  id: 'd-2026-050',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下表是近五年境内公司的上市情况。请根据相关图表，回答问题。第二年，既发行A 股又发行B
股的公司数为( )`,
  stemImages: ["/qbank/img_9ed5762565.webp"],
  options: [
    { key: "A", content: `96` },
    { key: "B", content: `86` },
    { key: "C", content: `76` },
    { key: "D", content: `信息不足，无法判断` },
  ],
  correctAnswer: 'B',
  explanation: `第二年境内上市公司数2063-仅发A 股的境内上市公司数1869-仅发B 股的境内上市公司数
108=86`,
  },
  {
  id: 'd-2026-051',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长量',
  difficulty: 'hard',
  stem: `2019 年，浙江某县农业总产值895.36 亿元，增长3.0%。其中，种植业产值436.16 亿元，增长4.4%;
林业产值120.80 亿元，增长2.8%;畜牧业产值20.56 亿元，增长10%;渔业产值292.38 亿元，增长10%。
其余农林牧渔服务业若干亿元。以下图表是2019 年该县主要农副产品产量统计表(单位:亿元)。根据
题干及图表回答下列问题: 下列说法正确的是( )。`,
  stemImages: ["/qbank/img_9570869735.webp"],
  options: [
    { key: "A", content: `2019 年水产增量为8.72 万吨` },
    { key: "B", content: `2019 年蔬菜产量占全县主要农副产品产量的半数以上` },
    { key: "C", content: `2019 年浙江某县主要农副产品产量中增速最低的为禽蛋` },
    { key: "D", content: `2019 年浙江某县主要农副产品产量总量为945.42 万吨` },
  ],
  correctAnswer: 'D',
  explanation: `A 项，2019 年水产增量为117.72÷（1+9%）*9%=9.72，错误；B 项蔬菜产量占全县主要农副产
品产量的455.06÷（190.8+3.2+70.48+455.06+28+117.72+80.16）=48%，错误；C 项，2019 年浙江
某县主要农副产品产量中增速最低的为棉花，错误；D 项2019 年浙江某县主要农副产品产量总量为
190.8+3.2+70.48+455.06+28+117.72+80.16=745.42，正确`,
  },
  {
  id: 'd-2026-052',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据下面的统计图回答问题: 某公司去年每个月收支情况统计表（单位：百万元）该公司纯收入大
于200 万的月份有( )`,
  stemImages: ["/qbank/img_6f2377c728.webp"],
  options: [
    { key: "A", content: `1 个月` },
    { key: "B", content: `2 个月` },
    { key: "C", content: `3 个月` },
    { key: "D", content: `4 个月` },
  ],
  correctAnswer: 'C',
  explanation: `1、10、11 月`,
  },
  {
  id: 'd-2026-053',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `根据下表，回答问题:某学校某三年教师性别、年龄构成40-50 岁年龄段的男教师在哪一年的增长幅
度最大?`,
  stemImages: ["/qbank/img_22a639fd9c.webp"],
  options: [
    { key: "A", content: `第一年` },
    { key: "B", content: `第二年` },
    { key: "C", content: `第三年` },
    { key: "D", content: `不清楚` },
  ],
  correctAnswer: 'B',
  explanation: `（320-240）/240=33.3%
（400-320）/320=25%`,
  },
  {
  id: 'd-2026-054',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下图是AOC公司各部门某月的收入情况，根据图表回答问题: 部门B上个月的实际收入是本月的95%，
超出预算收入5%，上月部门B 的预算收入约为( )万`,
  stemImages: ["/qbank/img_5d449239ee.webp"],
  options: [
    { key: "A", content: `3880` },
    { key: "B", content: `4300` },
    { key: "C", content: `3890` },
    { key: "D", content: `4752` },
  ],
  correctAnswer: 'C',
  explanation: `4300*95%/（1+5%）=3890`,
  },
  {
  id: 'd-2026-055',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `10 月份，几个不同移动教育应用呈现出了不同的覆盖率和活跃率，具体如下。请根据图表信息，回
答问题10 月份不同移动教育应用中，活跃率与覆盖率之比最大的是( )`,
  stemImages: ["/qbank/img_8fc9a2e4e5.webp"],
  options: [
    { key: "A", content: `作业帮` },
    { key: "B", content: `阿凡题` },
    { key: "C", content: `纳米盒` },
    { key: "D", content: `我要当学霸` },
  ],
  correctAnswer: 'B',
  explanation: `1.3%/2.9%=44.8%、1.4%/2.4%=58%、0.3%/0.6%=50%、0.1%/0.2%=50%`,
  },
  {
  id: 'd-2026-056',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下表是GB 精密仪器公司某年的销售情况，请根据表中的信息回答问题GB 公司前一年年末未销售的
零件量为( )万件？`,
  stemImages: ["/qbank/img_237bac7e0a.webp"],
  options: [
    { key: "A", content: `274.24` },
    { key: "B", content: `274.47` },
    { key: "C", content: `274.05` },
    { key: "D", content: `274.74` },
  ],
  correctAnswer: 'A',
  explanation: `305.26-26.74-0.23-4.05=274.24`,
  },
  {
  id: 'd-2026-057',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `HZ 公司是一家家电销售公司，过去的8 月份取得了不错的销售业绩，具体如下。请根据相关信息，
回答问题HZ 公司8 月份回款率最高的产品是（）`,
  stemImages: ["/qbank/img_e34cd79ebe.webp"],
  options: [
    { key: "A", content: `电视机` },
    { key: "B", content: `空调` },
    { key: "C", content: `热水器` },
    { key: "D", content: `洗衣机` },
  ],
  correctAnswer: 'B',
  explanation: `35.67/55.98=63.7%、47.81/70.4=67.9%、54.8/57.54=95.2%、96.64/106.3=90.9%`,
  },
  {
  id: 'd-2026-058',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `NEO 公司有A、B、C、D、E、F 六家店铺，去年共实现销售收入56 亿元，该公司去年1-4 季度的销
售收入和各店铺的收入如下列图表所示如果各个店辅第四李度的销售收入分布与全年度的分布一
致，那么第四季度，B 店铺的销售收入为（）`,
  stemImages: ["/qbank/img_e064b7911d.webp"],
  options: [
    { key: "A", content: `4.5 亿` },
    { key: "B", content: `3.2 亿` },
    { key: "C", content: `3.9 亿` },
    { key: "D", content: `条件不足，无法判断` },
  ],
  correctAnswer: 'C',
  explanation: `12.6*31%=3.9`,
  },
  {
  id: 'd-2026-059',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `SA 公司为一家商务咨询服务公司，其业务范围包括项目投资咨询、商务信息咨询等。下表为该公司
近七年投资咨询项目量，根据下表回答问题。第7 年商务信息咨询订单量为1307.90 个，减少3.7%。
第6 年商务信息咨询订单量与投资咨询项目订单量相比( )`,
  stemImages: ["/qbank/img_19a08fbc21.webp"],
  options: [
    { key: "A", content: `约多42 个` },
    { key: "B", content: `约多8 个` },
    { key: "C", content: `约少8 个` },
    { key: "D", content: `约少41 个` },
  ],
  correctAnswer: 'A',
  explanation: `第6 年商务信息咨询订单量=1307.9÷（1-3.7%）=1358，比投资咨询项目订单量多1358-1316=42
个`,
  },
  {
  id: 'd-2026-060',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `根据下表回答问题。RS 公司近年来空调和电视机的利润情况（单位:万元）列说法正确的是:( )`,
  stemImages: ["/qbank/img_06f5020fde.webp"],
  options: [
    { key: "A", content: `第四年，空调利润额占两类家电利润总额的30%` },
    { key: "B", content: `第三年，空调利润额增幅比电视机利润额增幅高7%` },
    { key: "C", content: `第五年两关家电利润总额是第一年的2 倍多` },
    { key: "D", content: `第二年电视机利润额增幅与第五年相当` },
  ],
  correctAnswer: 'D',
  explanation: `A 选项:36786÷(36786+46189)×100%=36786÷82975×100%≈44.33%，A 错误;B 选项:空调增幅
=35965/31196=1.15 ，电视机增幅=39467/31208=1.26 ，1.15<1.26 ，B 错误;C 选
项:(36587+54636)÷(26293+26315)=91223÷52608=73，C 错误;D 选项:第二年=31208/26315≈1.2，
第五年=54636/46189≈1.2，正确`,
  },
  {
  id: 'd-2026-061',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `某调查公司小样本调查了某地区学生的父母学历情况，得到了以下信息，请根据相关信息，回答问
题。已知本次调查的问卷回收率为100%，下列说法错误的是（）`,
  stemImages: ["/qbank/img_398a27d9e2.webp"],
  options: [
    { key: "A", content: `这次调直对象含城市学生农村学生各100 名` },
    { key: "B", content: `市区学生母亲学历为本科或大专的学生人数占总人数的70%` },
    { key: "C", content: `农村学生父亲学历的平均水平高于母亲` },
    { key: "D", content: `农村学生父母和市区学生父母概比，学历差异巨大` },
  ],
  correctAnswer: 'B',
  explanation: `选项B 错误，(32+38)/200*100%=35%，A、C、D 三项由图可知，说法正确。因此，本题选B。`,
  },
  {
  id: 'd-2026-062',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下图反映了某类型汽车的销量情况。根据图表回答下列问题: 该汽车销量最多连续几个月一直保持增
长状态?`,
  stemImages: ["/qbank/img_1a1431c04a.webp"],
  options: [
    { key: "A", content: `3` },
    { key: "B", content: `4` },
    { key: "C", content: `5` },
    { key: "D", content: `6` },
  ],
  correctAnswer: 'C',
  explanation: `如图，第8 9 10 11 12 月份`,
  },
  {
  id: 'd-2026-063',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图反映了某类型汽车的销量情况。根据图表回答下列问题: 第1 年9-12 月各月的增速趋势是:`,
  stemImages: ["/qbank/img_1a1431c04a.webp"],
  options: [
    { key: "A", content: `先上升后下降` },
    { key: "B", content: `先下降后上升` },
    { key: "C", content: `持续下降` },
    { key: "D", content: `持续上升` },
  ],
  correctAnswer: 'A',
  explanation: `9.1-7.8=1.3
11.9-9.1=2.8
12.1-11.9=0.2`,
  },
  {
  id: 'd-2026-064',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `用户调查中某产品使用者在所有调查对象中的比例被称为渗透率，下图是850 人的调查结果，展示
了在线支付、新闻资讯等6 个领域的微信公众号和小程序的渗透率。TGI（目标群体指数）代表了目
标群体在调查样本中的代表性，数值越大表明产品定位的目标群体与实际使用群体的吻合度越高，
TGI=（目标群体的渗透率/总群体的渗透率）×100。请根据图表回答下列问题: TGI=(目标群体的渗
透率/总群体的渗透率)*100，在这6 个领域中。TGI 指数最高的小程序为:`,
  stemImages: ["/qbank/img_e2f624873e.webp"],
  options: [
    { key: "A", content: `在线支付` },
    { key: "B", content: `新闻资讯` },
    { key: "C", content: `地图导航` },
    { key: "D", content: `综合电商` },
  ],
  correctAnswer: 'D',
  explanation: `90%/60%*100=150
39%/48%*100=80
75%/40%*100=180
66%/33%*100=200`,
  },
  {
  id: 'd-2026-065',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `BW 公司最新开发了一款针对C 端的产品，为了更快地让消费者获悉产品的情况，公司采用了多种
渠道推广产品，并在三个月后对推广效果进行了调查，下列图表呈现了推广渠道，渠道效果的相关
信息，请根据此，回答问题。BW 公司大约多大比例的钱花在了电视广告上? ( )`,
  stemImages: ["/qbank/img_b2b7404e98.webp"],
  options: [
    { key: "A", content: `10.4%` },
    { key: "B", content: `20.8%` },
    { key: "C", content: `27.1%` },
    { key: "D", content: `41.7%` },
  ],
  correctAnswer: 'C',
  explanation: `65/（65+100+50+25）=27.1%`,
  },
  {
  id: 'd-2026-066',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'medium',
  stem: `移动互联网带来的便利条件给网络教育注入新的活力，移动教育当前处于方兴未艾的阶段，各地区
的发展不一，具体如下，请根据图表中的信息，回答问题。细分类型移动教育应用用户城市分布中,
语言学习在二线城市的占比是一线城市的( )倍`,
  stemImages: ["/qbank/img_53599ea6ef.webp"],
  options: [
    { key: "A", content: `1.06` },
    { key: "B", content: `1.82` },
    { key: "C", content: `2.47` },
    { key: "D", content: `2.82` },
  ],
  correctAnswer: 'B',
  explanation: `40.1%/22%=1.82`,
  },
  {
  id: 'd-2026-067',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'hard',
  stem: `移动互联网带来的便利条件给网络教育注入新的活力，移动教育当前处于方兴未艾的阶段，各地区
的发展不一，具体如下，请根据图表中的信息，回答问题。细分类型移动教育应用用户城市分布中,
语言学习在二线城市的占比是一线城市的( )倍`,
  stemImages: ["/qbank/img_53599ea6ef.webp"],
  options: [
    { key: "A", content: `移动教育应用省份分布中，前三名的占比差距较小` },
    { key: "B", content: `移动教育应用省份分布中，第一名的占比是第10 名的2.54 倍` },
    { key: "C", content: `二线城市在细分类型教育移动应用用户城市分布中，占比超过三线城市的有3 个` },
    { key: "D", content: `一线城市中, K12 移动教育类型占比相对最小` },
  ],
  correctAnswer: 'D',
  explanation: `A 项移动教育应用省份分布中前三名的占比差距较大，错误；B 项移动教育应用省份分布中第
一名的占比是第10 名的15.5%÷3.8%=4.1 倍，错误；C 项二线城市在细分类型教育移动应用用户城市
分布中，占比超过三线城市的有2 个，分别是高等教育和语言学习。错误；D 项一线城市中, K12 移
动教育类型占比相对最小，11.2%，正确`,
  },
  {
  id: 'd-2026-068',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下图是某公司近几年的收支情况统计图（单位:万元），根据图表回答下列问题: 若该公司按照第六年
的支出增长趋势,第七年该公司的总支出约为( )万元`,
  stemImages: ["/qbank/img_f35e8700e1.webp"],
  options: [
    { key: "A", content: `923418` },
    { key: "B", content: `723419` },
    { key: "C", content: `771942` },
    { key: "D", content: `832157` },
  ],
  correctAnswer: 'C',
  explanation: `[（570120-421056）/421056+1]*570120`,
  },
  {
  id: 'd-2026-069',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下表是某一年度几个国家的农作物自给率统计表（自给率即某种农作物本国生产量与总供给量的比
例）单位:% 五类农作物完全不能自给的国家是( )`,
  stemImages: ["/qbank/img_10e139ed10.webp"],
  options: [
    { key: "A", content: `丹麦` },
    { key: "B", content: `法国` },
    { key: "C", content: `德国` },
    { key: "D", content: `日本` },
  ],
  correctAnswer: 'C',
  explanation: `德国的五类比例都小于1`,
  },
  {
  id: 'd-2026-070',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下表是某一年度几个国家的农作物自给率统计表（自给率即某种农作物本国生产量与总供给量的比
例）单位:% 以下判断正确的是( )`,
  stemImages: ["/qbank/img_10e139ed10.webp"],
  options: [
    { key: "A", content: `德国的麦产量与肉产量相等` },
    { key: "B", content: `丹麦与法国的薯类产量相等` },
    { key: "C", content: `五个国家中麦产量最高的国家是法国` },
    { key: "D", content: `以上三个都不对` },
  ],
  correctAnswer: 'D',
  explanation: `图表中的比例为农作物本国生产量与总供给量的比例，无法判断出某种农作物具体的产量，所
以ABC 项均无法判断。`,
  },
  {
  id: 'd-2026-071',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'medium',
  stem: `下图是过去某两年，手机用户和PC/平板用户，自主安装浏览器的情况，请根据图表信息，回答问
题。第二年，Chrome 浏览器在PC/平板端的市场份额是手机端份额的( )倍`,
  stemImages: ["/qbank/img_77fd7168b3.webp"],
  options: [
    { key: "A", content: `0.5` },
    { key: "B", content: `1.5` },
    { key: "C", content: `2` },
    { key: "D", content: `2.5` },
  ],
  correctAnswer: 'D',
  explanation: `30%/12%=2.5`,
  },
  {
  id: 'd-2026-072',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `企业公布的财务信息反映了企业的经营和运营状况，毛利润，运营利润和净利润是通常使用到的指
标，毛利润通常是企业营业收入除去营业成本(如原材科、设备等生产成本和营业税等)后的收入，运
营利润是毛利润减去运营成本费用(如员工工资、管理费用、研发费用，销售费用、财务费用)后的收
入，净利润是企业运营利润加其他收入之后减去所得税额之后的收入。运营利润，在其他收入(营业
外收入)之前，反映了企业基本经营活动获得利润的能力。下表是CX 公司4 年内的运营信息，请根
据相关值息回答问题。CX 公司第二年的运营成本为:( )`,
  stemImages: ["/qbank/img_39bd9ee561.webp"],
  options: [
    { key: "A", content: `122.56` },
    { key: "B", content: `453.11` },
    { key: "C", content: `4.5311 亿美元` },
    { key: "D", content: `453.11 万美元` },
  ],
  correctAnswer: 'C',
  explanation: `(837.29-384.18)/100=4.5311 亿美元。`,
  },
  {
  id: 'd-2026-073',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据图表，回答下列问题。注:投入高低是指受众观看广告时的投入程度。面说法正确的是: ( )`,
  stemImages: ["/qbank/img_b978afe597.webp"],
  options: [
    { key: "A", content: `任何情况下，B 产品受众的回忆率和广告重复率都成反比。` },
    { key: "B", content: `对于A 产品，在受众投入水平较低的情况下,回忆率和广告重复率之间的关系不明显。` },
    { key: "C", content: `1 月份，B 产品回忆率高可能是品牌名气大导致。` },
    { key: "D", content: `7 月份,受众对于A 产品和B 产品的回忆次数相同。` },
  ],
  correctAnswer: 'B',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-074',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下图反映了近几年某公司员工的工资情况，根据图表回答下列问题: 基本工资与提成的差额呈( ) 趋
势。`,
  stemImages: ["/qbank/img_d64e217b1d.webp"],
  options: [
    { key: "A", content: `先下降后上升` },
    { key: "B", content: `先上升后下降` },
    { key: "C", content: `一直上升` },
    { key: "D", content: `一直下降` },
  ],
  correctAnswer: 'A',
  explanation: `3250-2900=350
4300-4050=250
6025-5850=175
7500-6450=1050
9000-7900=1100`,
  },
  {
  id: 'd-2026-075',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下图反映了近几年某公司员工的工资情况，根据图表回答下列问题: 第1 年，该公司员工的总工资是
( )元。`,
  stemImages: ["/qbank/img_d64e217b1d.webp"],
  options: [
    { key: "A", content: `2608` },
    { key: "B", content: `3469` },
    { key: "C", content: `4289` },
    { key: "D", content: `4936` },
  ],
  correctAnswer: 'D',
  explanation: `（3250+2900）/1.246=4936`,
  },
  {
  id: 'd-2026-076',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `HOC 是一家汽车零件生产公司。初步核算，该公司成立的第11 年在国内的销告额达到6528.72 万元，
比上一年增长14.9%。其中，A 区域销售额为606.80 万元，增长5.5%;B 区域销售额为3447.48 万元，
增长17.8%;C 区域销告额为2474.44 万元，增长13.3%。结合以上材料和下图回答问题。公司销售额
增幅超过10%的有几年? ( )`,
  stemImages: ["/qbank/img_946e5832f1.webp"],
  options: [
    { key: "A", content: `6 年` },
    { key: "B", content: `7 年` },
    { key: "C", content: `9 年` },
    { key: "D", content: `10 年` },
  ],
  correctAnswer: 'B',
  explanation: `如图，第4、5、6、7、8、10、11 年`,
  },
  {
  id: 'd-2026-077',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'medium',
  stem: `AS 公司是一家汽车生产公司，汽车销往国内和国外。下表是AS 的某年的汽车销售情况，请根据表
中信息回答问题。前一年的6 月份,汽车出口量为( )辆`,
  stemImages: ["/qbank/img_5d9ee02b43.webp"],
  options: [
    { key: "A", content: `27632` },
    { key: "B", content: `26911` },
    { key: "C", content: `25443` },
    { key: "D", content: `24332` },
  ],
  correctAnswer: 'A',
  explanation: `27853/（1+0.8%）=27632`,
  },
  {
  id: 'd-2026-078',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `根据下表回答问题。CR 公司近年来销售额情况（单位:万元）该公司销售额增幅最小的年份是:（）`,
  stemImages: ["/qbank/img_dba0f4123b.webp"],
  options: [
    { key: "A", content: `第二年` },
    { key: "B", content: `第三年` },
    { key: "C", content: `第四年` },
    { key: "D", content: `第五年` },
  ],
  correctAnswer: 'D',
  explanation: `（191571-162376）/162376=18%
（204540-191571）/191571=6.8%
（217261-204540）/204540=6.2%
（227991-217261）/217261=4.9%`,
  },
  {
  id: 'd-2026-079',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `根据图表，回答下列问题。A 公司某年度16 个产品的发货情况如果总销量第二年增长20%，则第二
年的总销量可达约( ) 万件。`,
  stemImages: ["/qbank/img_860e1e8162.webp"],
  options: [
    { key: "A", content: `70` },
    { key: "B", content: `71` },
    { key: "C", content: `80` },
    { key: "D", content: `81` },
  ],
  correctAnswer: 'D',
  explanation: `(14+14+5+3+2+1.4+1.2+1+10+7+4+2+1.7+1.3+1.2+0.9)*120%=81`,
  },
  {
  id: 'd-2026-080',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据图表回答下面问题。M 公司某新车2-4 月份销量和盈利情况
关于该新车第1 季度销售量和盈利的变化，以下描述错误的是: ( )`,
  stemImages: ["/qbank/img_3b09ad7d49.webp"],
  options: [
    { key: "A", content: `新车销售收入持续下降` },
    { key: "B", content: `销售收入下降快于销量下降` },
    { key: "C", content: `新车销量持续下降` },
  ],
  correctAnswer: 'C',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-081',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下图反映了某种产品的成本与出厂价情况(单位:元)。根据图表回答下列问题: 某种产品的成本与出厂价情况(单位:
元)
每生产一件该产品获得的利润率最高的是第(
)年。`,
  stemImages: ["/qbank/img_8e2809f5a6.webp"],
  options: [
    { key: "A", content: `二` },
    { key: "B", content: `三` },
    { key: "C", content: `四` },
    { key: "D", content: `五` },
  ],
  correctAnswer: 'C',
  explanation: `利润率=（出厂价-成本）÷出厂价
第二年利润率=（120-100）÷120=16.7%；
第三年=（120-90）÷120=25%；
第四年=（150-100）÷150=33%；
第五年=（240-180）÷240=25%`,
  },
  {
  id: 'd-2026-082',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'medium',
  stem: `下表为我国2020 年第一季度货物运输量统计表。根据图表回答下列问题。将2020 年2 月的增长速
度转为正数并以此为基础，推测2021 年2 月货运量为( )万吨`,
  stemImages: ["/qbank/img_8249ef7d0e.webp"],
  options: [
    { key: "A", content: `238196` },
    { key: "B", content: `220914` },
    { key: "C", content: `210986` },
    { key: "D", content: `201324` },
  ],
  correctAnswer: 'D',
  explanation: `2020 年2 月货运的同比增长速度为-29.9%，转为正数即为29.9%，2021 年2 月货运量154984*
（1+29.9）=201324 万吨`,
  },
  {
  id: 'd-2026-083',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'medium',
  stem: `下图反映了赴美留学的学生类型，以及美国学校对于不同的国际学生群体在不同时期的学费收入情
况，请根据图表回答问题。在过去十年中，美国学校来源于国际学生学费的收入的增长率约为( ) .`,
  stemImages: ["/qbank/img_e590779d90.webp"],
  options: [
    { key: "A", content: `48%` },
    { key: "B", content: `52%` },
    { key: "C", content: `78%` },
    { key: "D", content: `92%` },
  ],
  correctAnswer: 'D',
  explanation: `[（0.7+1.2+0.4+0.2）-（0.6+0.4+0.2+0.1）]÷（0.6+0.4+0.2+0.1）=92%`,
  },
  {
  id: 'd-2026-084',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长量',
  difficulty: 'hard',
  stem: `根据近年全球及中国隐形矫正市场规模统计图回答下列问题列说法不正确的是( )`,
  stemImages: ["/qbank/img_5c298561b5.webp"],
  options: [
    { key: "A", content: `第二年到第六年全球隐形矫正市场规模同比增量最多的是第三年` },
    { key: "B", content: `第三年全球隐形矫正市场规模同比增量为32 亿美元` },
    { key: "C", content: `第二年全球隐形矫正市场规模同比增速为44%` },
    { key: "D", content: `第二年到第六年全球隐形矫正市场规模同比增速最快的是第二年` },
  ],
  correctAnswer: 'D',
  explanation: `A 项第三年全球隐形矫正市场规模同比增量=（104-72）÷72=44%；第四年=（129-104）
÷104=24%；第五年=（122-129）÷129=-5.4%；第六年=（147-122）÷12220.5%，正确。B 项第三年
全球隐形矫正市场规模同比增量为104-72=32 亿美元正确。C 项第二年全球隐形矫正市场规模同比
增速（72-50）÷50=44%正确。D 项全球隐形矫正市场规模同比增速最快的是第二年与第三年相同均
为44%，错误。`,
  },
  {
  id: 'd-2026-085',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '平均数计算',
  difficulty: 'medium',
  stem: `下图是近年某公司的汽车零售情况
(单位:千万元)。根据图表回答下列问题: 第一年6 月至第二年6 月，平均每月的汽车零售额约为( )
千万元。`,
  stemImages: ["/qbank/img_2489dba5d3.webp"],
  options: [
    { key: "A", content: `51.01` },
    { key: "B", content: `49.78` },
    { key: "C", content: `39.15` },
    { key: "D", content: `45.9` },
  ],
  correctAnswer: 'D',
  explanation: `（41.01+41.86+40.95+39.34+43.43+43.88+51+50.71+43.11+46.34+49.76+53.28+51.46 ）
÷11=45.9`,
  },
  {
  id: 'd-2026-086',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下图反映了某公司某年业务销售量(单位:千件)及盈利状况(单位:万元)。根据图表回答下列问题: 第四
季度的销售量占这一年总销售量的( ) %。`,
  stemImages: ["/qbank/img_9dff549b88.webp"],
  options: [
    { key: "A", content: `25.5` },
    { key: "B", content: `24.4` },
    { key: "C", content: `23.1` },
    { key: "D", content: `27.0` },
  ],
  correctAnswer: 'D',
  explanation: `4125÷（3520+3890+3725+4125）=27%`,
  },
  {
  id: 'd-2026-087',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `如图所示，某公司生产某项商品可获得的利润与生产数量为线性关系。请根据此图回答问题: 照此规
律，公司生产110 万件，可获利( )万元?`,
  stemImages: ["/qbank/img_5e22bc68be.webp"],
  options: [
    { key: "A", content: `12` },
    { key: "B", content: `14` },
    { key: "C", content: `16` },
    { key: "D", content: `18` },
  ],
  correctAnswer: 'C',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-088',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据2020 年3- 12 月青海省发电量增长情况回答下列问题2020 年3- 12 月青海省各季度发电量排
序正确的是( )`,
  stemImages: ["/qbank/img_8c6ef29e38.webp"],
  options: [
    { key: "A", content: `三季度>四季度>二季度` },
    { key: "B", content: `二季度>四季度>三季度` },
    { key: "C", content: `四季度>三季度>二季度` },
    { key: "D", content: `三季度>二季度>四季度` },
  ],
  correctAnswer: 'A',
  explanation: `计算每一季度的总量第二季度456 月第三季度789 月第四季度10 11 12 月，计算求和比`,
  },
  {
  id: 'd-2026-089',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `较就行
下图是近两年某公司的消费者投诉数量情况。根据图表回答下列问题第二年各个月份投诉量变化幅度(与前一个月
相比)从大到小排序为(
).`,
  stemImages: ["/qbank/img_fb7ba3985a.webp"],
  options: [
    { key: "A", content: `7、5、12、2、6、3、10、11、8、4、9` },
    { key: "B", content: `6、3、2、10、11、8、4、12、9、5、7` },
    { key: "C", content: `9、4、8、11、10、3、6、2、12、5、7` },
    { key: "D", content: `7、5、12、2、6、3、10、11、8、4、9` },
  ],
  correctAnswer: 'A',
  explanation: `2 月投诉量变化幅度=（71-62）÷62=14.5%；3 月=（61-71）÷71=-14.1%4 月=（42-61）÷61=-31.1%；
5 月=（61-42）÷42=45.2%；6 月=（67-61）÷61=9.8%；7 月=（130-67）÷67=94%；8 月=（106-130）
÷130=-18.5%；9月=（66-106）÷106=-37.7%；10月=（56-66）÷66=-15.2%；11月=（47-56）÷56=-16.1%；
12 月=（62-47）÷47=31.9%。`,
  },
  {
  id: 'd-2026-090',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下列图表是我国去年服装的生产和消费情况。请根据图表信息，回答问题。根据材料，下列说法错
误的是( )`,
  stemImages: ["/qbank/img_3b35c72f89.webp"],
  options: [
    { key: "A", content: `购买服装并非完全出于穿着需要` },
    { key: "B", content: `去年我国服装产量大于消费量` },
    { key: "C", content: `去年我国服装产量能充分满足国内消费需求，没有进口` },
  ],
  correctAnswer: 'C',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-091',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下表为美国市场上商务笔记本的价格及销售情况，根据图表回答下列问题。假设第一年每个季度卖出商务笔记本数
量一致，那么第一年的四个季度商务笔记本的均价分别可能是(
)美元。`,
  stemImages: ["/qbank/img_d2af920be2.webp"],
  options: [
    { key: "A", content: `950; 850; 900; 900` },
    { key: "B", content: `850; 900; 950; 900` },
    { key: "C", content: `900; 900; 950; 850` },
    { key: "D", content: `900; 950; 850; 900` },
  ],
  correctAnswer: 'C',
  explanation: `第一年每个季度卖出商务笔记本数量一致，第一季度与第二季度的收入也一致，那么一二季度
的均价也应一致，C 项是一致的，答案为C。`,
  },
  {
  id: 'd-2026-092',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下表是近五年电视制作的情况。请根据图表信息，回答相关问题。第三年国产电视剧播出部数约占
当年电视剧播出部数的( )`,
  stemImages: ["/qbank/img_b80b859010.webp"],
  options: [
    { key: "A", content: `25.0%` },
    { key: "B", content: `2.6%` },
    { key: "C", content: `97.0%` },
    { key: "D", content: `75.0%` },
  ],
  correctAnswer: 'C',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-093',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下列图表是我国2 月份全社会客货运输量的信息。请根据图表相关信息，回答问题。如果明年2 月
份，货运总量的增长速度是水运货运量增长速度的2.5 倍，那么明年2 月份的货运总量约为( )`,
  stemImages: ["/qbank/img_be1ab641c0.webp"],
  options: [
    { key: "A", content: `42 亿吨` },
    { key: "B", content: `43 亿吨` },
    { key: "C", content: `99 亿吨` },
    { key: "D", content: `98 亿吨` },
  ],
  correctAnswer: 'B',
  explanation: `如图水运货运量增长速度=4%，货运总量的增长速度是水运货运量增长速度的2.5 倍即
4%*2.5=10%，那么明年2 月份的货运总量约为（2.77+31.28+5.42+0.005036）*（1+10%）=43 亿吨`,
  },
  {
  id: 'd-2026-094',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `K12 教育指针对小学到高中12 个年级在校生的教育培训，下图反映了我国2016-2020 年K12 教育市
场的规模。请根据图表回答下列问题。K12 教育市场规模的增长速度呈( )趋势。`,
  stemImages: ["/qbank/img_6e1f178c77.webp"],
  options: [
    { key: "A", content: `一直上升` },
    { key: "B", content: `一直下降` },
    { key: "C", content: `先升后降` },
    { key: "D", content: `先降后升` },
  ],
  correctAnswer: 'C',
  explanation: `2017 年K12 教育市场规模的增长速度=（6018-5169）÷5169=16.4%；2018 年=（7909-6018）
÷6018=31.4%；2019 年=（9251-7909）÷7909=17%；2020 年=（6603-9251）÷9251=-28.6%，先上
升后下降。`,
  },
  {
  id: 'd-2026-095',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `2019 年中国集成电路产业销售收入为7511.8 亿元，同比增长15
80%，其中集成电路设计业销售收入为3063.5 亿元。同比增长21.
6%，占总值40.5% ;晶圆制造业销售收入为2149.
1 亿元，同比增长18.20%，占总值的28.40%
;封测业销售收入为2349.7 亿元，同比增长7.10%，占总值的31.1%。根据材料和图表回答下列问题。
2018 年晶圆制造业销售收入和2019 年晶圆制造业销售收入的差值在以下哪个区间中( )`,
  stemImages: ["/qbank/img_15a7819a47.webp"],
  options: [
    { key: "A", content: `400 亿元以上` },
    { key: "B", content: `350-400 亿元之间` },
    { key: "C", content: `300 亿元以下` },
    { key: "D", content: `300-350 亿元之间` },
  ],
  correctAnswer: 'D',
  explanation: `2018 年晶圆制造业销售收入=6532*27.84%=1818.5 ；2019 年晶圆制造业销售收入
=7511.8*28.4%=2133.4，作差=314，选D`,
  },
  {
  id: 'd-2026-096',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'hard',
  stem: `下图为某生产商生产的两种化妆品在某地区最近五年的销售数量变化图，根据图表回答下列问题。
化妆品A 的第五年的销售额约占其五年销售额的( )。`,
  stemImages: ["/qbank/img_828c8c57a4.webp"],
  options: [
    { key: "A", content: `12%` },
    { key: "B", content: `26%` },
    { key: "C", content: `25%` },
    { key: "D", content: `23%` },
  ],
  correctAnswer: 'B',
  explanation: `解析: 化妆品A 第五年的销售额=21000，
五年来销售总额=9000+15000+16000+20000+21000=81000 占比为21000/81000=25.9%约26%`,
  },
  {
  id: 'd-2026-097',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图反映了一公司四个月的财务情况(单位:万元)。根据图表回答下列问题: 该公司的收入增长率呈现
( )的趋势。`,
  stemImages: ["/qbank/img_569397899d.webp"],
  options: [
    { key: "A", content: `持续上升` },
    { key: "B", content: `持续下降` },
    { key: "C", content: `先上升后下降` },
    { key: "D", content: `先下降后上升` },
  ],
  correctAnswer: 'C',
  explanation: `由上表可得：2 月收入增长率：（90-88）÷88×100%=2.27%；3 月收入增长率：（114-90）
÷90×100%=26.67%；4 月收入增长率：（137-114）÷114×100%=21.18；5 月收入增长率：（140-137）
÷137×100%=2.19。因此该公司收入增长率呈现先上升后下降趋势，所以选择C。`,
  },
  {
  id: 'd-2026-098',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图反映了近几年某公司的投资额情况(单位:亿元)。根据图表回答下列问题: 后三年的年增长率呈
现( )的趋势。`,
  stemImages: ["/qbank/img_ab0112bebc.webp"],
  options: [
    { key: "A", content: `持续上升` },
    { key: "B", content: `先上升后下降` },
    { key: "C", content: `持续下降` },
    { key: "D", content: `先下降后上升` },
  ],
  correctAnswer: 'B',
  explanation: `由上表可得：第六年增长率：（33.5-31.6）÷31.6×100%=6.01 第七年增长率：（47.7-33.5）
÷33.5×100%=42.39 第八年增长率：（66.6-47.7）÷47.7×100%=39.62 因此，后三年增长率呈现先上升
后下降趋势，所以选择B。`,
  },
  {
  id: 'd-2026-099',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下图是某跨国公司在全球主要国家的销售收入情况，请根据图表回答相关问题: 在日本的销售额与英
国相比少( )`,
  stemImages: ["/qbank/img_630fcb913c.webp"],
  options: [
    { key: "A", content: `5%` },
    { key: "B", content: `8%` },
    { key: "C", content: `10%` },
    { key: "D", content: `12%` },
  ],
  correctAnswer: 'B',
  explanation: `由上图可知，英国销售额是87916，日本销售额是81315；（87916-81315）÷81315×100%=8.11，
所以选择B。`,
  },
  {
  id: 'd-2026-100',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'medium',
  stem: `HDC 是以生产和经营化妆品为主的公司。产品分为彩妆类和护肤类两大系列。下表是HDC 公司某年
1-7 月份的产品销售情况。请根据图表信息回答问题。前一年7 月份的总体销售额为( )万`,
  stemImages: ["/qbank/img_cddb078fe9.webp"],
  options: [
    { key: "A", content: `22026` },
    { key: "B", content: `23228` },
    { key: "C", content: `25412` },
    { key: "D", content: `27194` },
  ],
  correctAnswer: 'A',
  explanation: `24339÷（1+10.5%）=22026
101-150`,
  },
  {
  id: 'd-2026-101',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图是某商店五个工作日的零售总额(单位:元)与增长速度(单位:
%)。根据图表回答下列问题: 本周五的零售总额约是上周周天的零售总额的( ) 倍。`,
  stemImages: ["/qbank/img_8ea7595c34.webp"],
  options: [
    { key: "A", content: `1.2` },
    { key: "B", content: `1.4` },
    { key: "C", content: `1.5` },
    { key: "D", content: `1.7` },
  ],
  correctAnswer: 'D',
  explanation: `上周天零售总额=43055÷（1+10.1%）=39105 本周五的零售总额约是上周周天的零售总额的
67177÷39105=1.7 倍`,
  },
  {
  id: 'd-2026-102',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'medium',
  stem: `4S 公司是一家汽车生产公司，汽车销往国内和国外。下表是4S 的某年的汽车销售情况，请根据表
中信息回答问题。4 月份，汽车内销量环比增长( )辆`,
  stemImages: ["/qbank/img_102d238420.webp"],
  options: [
    { key: "A", content: `375` },
    { key: "B", content: `38696` },
    { key: "C", content: `64821` },
    { key: "D", content: `259` },
  ],
  correctAnswer: 'A',
  explanation: `由上图可知，4 月份汽车内销量是65455，3 月份汽车内销量是65080。65455-65080=375，所
以选择A。`,
  },
  {
  id: 'd-2026-103',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图反映了某地区近五年宠物猫与宠物犬的数量情况。请根据图表回答下列问题。若按照目前的增
长趋势，预计该地区第6 年宠物猫可达( )只。`,
  stemImages: ["/qbank/img_b540190198.webp"],
  options: [
    { key: "A", content: `6256` },
    { key: "B", content: `6326` },
    { key: "C", content: `6416` },
    { key: "D", content: `6526` },
  ],
  correctAnswer: 'C',
  explanation: `第二年的增长速度=（5105-4862）÷4862=5%；第三年=（5386-5105）÷5105=5.5%；第四年=
（5709-5386）÷5386=6%；第五年=（6052-5709）÷5709=6%；按照目前的增长趋势，那也应是6%
的趋势，第六年=6052*（1+6%）=6416`,
  },
  {
  id: 'd-2026-104',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '平均数计算',
  difficulty: 'easy',
  stem: `下表反映了某年某公司某种产品的销量、销售额以及单个产品成本的情况。根据图表回答下列问题:
在这一年，单个产品平均盈利( )元。`,
  stemImages: ["/qbank/img_0ba179225e.webp"],
  options: [
    { key: "A", content: `11` },
    { key: "B", content: `13` },
    { key: "C", content: `14` },
    { key: "D", content: `26` },
  ],
  correctAnswer: 'B',
  explanation: `[ （15480-430*25 ）+ （15000-26*3758 ）+ （17052-28*406 ）+ （16682-25*439 ）]÷
（430+375+406+439）≈13`,
  },
  {
  id: 'd-2026-105',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下图是2018 年全国商品房销售情况数据，请根据下图回答问题。按照2017 年销售面积由多到少排
序正确的是( )`,
  stemImages: ["/qbank/img_0990a173ec.webp"],
  options: [
    { key: "A", content: `住宅商品房>商业营业用房>办公楼商品房>别墅、高档公寓` },
    { key: "B", content: `住宅商品房>商业营业用房>别墅、高档公寓>办公楼商品房` },
    { key: "C", content: `商业营业用房>别墅、高档公寓>办公楼商品房>住宅商品房` },
    { key: "D", content: `商业营业用房<别墅、高档公寓<办公楼商品房<住宅商品房` },
  ],
  correctAnswer: 'A',
  explanation: `商业：11971.3÷（1-6.8%）=12844.74 办公楼：4363.3÷（1-8.3%）=4758.23 别墅：4410.7÷（1-7%）
=4742.69 住宅：147929.4÷（1+2.2%）=144745.01 商品：171654.4÷（1+1.3%）=169451.53`,
  },
  {
  id: 'd-2026-106',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `研究发现，员工满意度与多种因素有关。下表是某咨询公司开展的员工满意度调查的部分结果，请
根据图表中的信息回答问题。表中①②处所缺的数字分别是( )`,
  stemImages: ["/qbank/img_2dd0d765e7.webp"],
  options: [
    { key: "A", content: `7.2, 15.5` },
    { key: "B", content: `7.5, 16.2` },
    { key: "C", content: `6.9,15.9` },
    { key: "D", content: `8.1, 16.5` },
  ],
  correctAnswer: 'B',
  explanation: `①=（11.3+8.3+6.3+4.1）÷4=7.5②=12.3*4-13.8-11-8.2=16.2`,
  },
  {
  id: 'd-2026-107',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `下图是近两年某公司13 种产品的盈利情况(单位:万元),
根据图表回答下列问题: 若按第二年的月平均增长速度估算，第三年12 月A 产品可能实现盈利( )万
元。`,
  stemImages: ["/qbank/img_60c7f968a6.webp"],
  options: [
    { key: "A", content: `180.3` },
    { key: "B", content: `168.9` },
    { key: "C", content: `159.4` },
    { key: "D", content: `157.7` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-108',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `AR 公司是一家家电销售公司，请根据下表回答问题去年各部门总销售量超过25000 万元的季度有( )
个`,
  stemImages: ["/qbank/img_901eaa06a5.webp"],
  options: [
    { key: "A", content: `1` },
    { key: "B", content: `2` },
    { key: "C", content: `3` },
    { key: "D", content: `4` },
  ],
  correctAnswer: 'C',
  explanation: `看图标，分别是去年第四、第三、第二季度`,
  },
  {
  id: 'd-2026-109',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'medium',
  stem: `下表为我国2020 年第一季度旅客运输量统计表。根据图表回答下列问题。将2020 年3 月的增长速
度转为正数并以此为基础，推测2021 年3 月客运量为( )万人`,
  stemImages: ["/qbank/img_f66dd55d02.webp"],
  options: [
    { key: "A", content: `56901` },
    { key: "B", content: `59721` },
    { key: "C", content: `66731` },
    { key: "D", content: `69101` },
  ],
  correctAnswer: 'C',
  explanation: `2020 年3 月客运量的增长速度为-73%，转为正数即为73%，以此为基础2021 年3 月客运量
=38573*（1+73%）=66731`,
  },
  {
  id: 'd-2026-110',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下表为YM 某年1-9 个月的商品零售情况，根据下表回答问题，公司商品零售额最为接近的两个月
是: ( )`,
  stemImages: ["/qbank/img_21535e0578.webp"],
  options: [
    { key: "A", content: `1 月，9 月` },
    { key: "B", content: `5 月，6 月` },
    { key: "C", content: `3 月，4 月` },
    { key: "D", content: `2 月，3 月` },
  ],
  correctAnswer: 'D',
  explanation: `解析：观察上图，选项A、D 较为接近A 选项，2733.5-2677.5=56D 选项，2003.6-1963.8=39.8
故正确答案为D。`,
  },
  {
  id: 'd-2026-111',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `下列图表是某时间段汽车和轿车的生产与增长情况。请根据相关信息，回答问题。汽车日均产量增
速高于轿车日均产量增速的月份有( ) 个`,
  stemImages: ["/qbank/img_b3af8ab74b.webp"],
  options: [
    { key: "A", content: `5` },
    { key: "B", content: `7` },
    { key: "C", content: `9` },
    { key: "D", content: `11` },
  ],
  correctAnswer: 'D',
  explanation: `分别是2、3、4、5、6、7、8、9、10、11、12 月`,
  },
  {
  id: 'd-2026-112',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'medium',
  stem: `4S 公司是一家汽车生产公司，
汽车销往国内和国外。下表是4S 的某年的汽车销售情况，请根据表中信息回答问题。6 月份，汽
车内销量环比增长约( )`,
  stemImages: ["/qbank/img_6cc718eb8d.webp"],
  options: [
    { key: "A", content: `1.0%` },
    { key: "B", content: `0.9%` },
    { key: "C", content: `0.8%` },
    { key: "D", content: `0.7%` },
  ],
  correctAnswer: 'D',
  explanation: `（67510-67015）÷67015×100%=0.74，选择D。`,
  },
  {
  id: 'd-2026-113',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `一路平安汽车销售公司，以销售中高端轿车为主，目前在5 个城市设有分店。公司总部和每个分店
上一年度的汽车销售情况如下所示。如果单个季度的汽车销售量超过了150 辆，那么可以拿到厂商
1000 元/辆的额外补贴，那么去年全年，总计拿了( )万补贴`,
  stemImages: ["/qbank/img_1661f0a562.webp"],
  options: [
    { key: "A", content: `101.9` },
    { key: "B", content: `1019` },
    { key: "C", content: `3010.9` },
    { key: "D", content: `30109` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-114',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下图反映了某种新型止痛贴改善疼痛症状的临床研究结果。请根据图表回答下列问题。根据图表信
息，下列说法错误的是( ).`,
  stemImages: ["/qbank/img_710ade0add.webp"],
  options: [
    { key: "A", content: `使用14 天后，头痛等级下降91%` },
    { key: "B", content: `使用前，头痛等级是关节疼痛等级的1.65 倍` },
    { key: "C", content: `使用14 天后，关节疼痛等级下降73%` },
    { key: "D", content: `使用14 天后，头痛和关节痛人群的疼痛等级差异减小0.5` },
  ],
  correctAnswer: 'D',
  explanation: `A 项，（0.3-3.3）÷3.3=-91%，正确；B 项3.3÷2=1.65，正确；C 项（0.55-2）÷2=-73%，正确；
D 项使用前头痛和关节痛人群的疼痛等级差异=3.3-2=1.3，14 天后差异=0.55-0.3=0.25，差异减小
1.3-0.25=1.05，错误`,
  },
  {
  id: 'd-2026-115',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `企业公布的财务信息反映了企业的经营和运营状况，毛利润，运营利润和净利润是通常使用到的指
标，毛利润通常是企业营业收入除去营业成本(如原材科、设备等生产成本和营业税等)后的收入，运
营利润是毛利润减去运营成本费用(如员工工资、管理费用、研发费用，销售费用、财务费用)后的收
入，净利润是企业运营利润加其他收入之后减去所得税额之后的收入。运营利润，在其他收入(营业
外收入)之前，反映了企业基本经营活动获得利润的能力。下表是CX 公司4 年内的运营信息，请根
据相关值息回答问题。CX 公司第4 年的净利润率为( )`,
  stemImages: ["/qbank/img_4f66ddea7f.webp"],
  options: [
    { key: "A", content: `12%` },
    { key: "B", content: `15%` },
    { key: "C", content: `8%` },
    { key: "D", content: `20%` },
  ],
  correctAnswer: 'B',
  explanation: `由上图可得193.01÷1246.77×100%=15.48，所以选择B。`,
  },
  {
  id: 'd-2026-116',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `Y 公司是主营机器人制造的上市公司。Y 公司近五年资产构成情况公布如下股东权益是总资产除去总
负债，是净资产的代表。请根据相关信息，回答问题。从图表中，我们可以判断出，公司资产总额
等于( )`,
  stemImages: ["/qbank/img_e063ace8ed.webp"],
  options: [
    { key: "A", content: `流动资产总额及固定资产总额` },
    { key: "B", content: `债务总额及权益总额` },
    { key: "C", content: `流动资产总额加长期债务总额` },
  ],
  correctAnswer: 'B',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-117',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `根据2020 年3 月-2021 年3 月中国洗衣机出口量及出口金额增长情况回答下列问题
2020 年3 月中国洗衣机出
口金额比2021 年3 月出口金额少(
)百万美元`,
  stemImages: ["/qbank/img_b94a5ab265.webp", "/qbank/img_438d09a907.webp"],
  options: [
    { key: "A", content: `62` },
    { key: "B", content: `72` },
    { key: "C", content: `82` },
    { key: "D", content: `92` },
  ],
  correctAnswer: 'B',
  explanation: `291-219=72 百万美元，选择B。`,
  },
  {
  id: 'd-2026-118',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'easy',
  stem: `下图反映了2019 年中国家庭育儿成员对国产育儿产品的偏好及评价。请根据图表回答下列问题: 参
与调查的育儿成员人数为1424 人，那么认为国产品牌好用的( )人。`,
  stemImages: ["/qbank/img_7878b2419c.webp"],
  options: [
    { key: "A", content: `557` },
    { key: "B", content: `567` },
    { key: "C", content: `578` },
    { key: "D", content: `758` },
  ],
  correctAnswer: 'B',
  explanation: `根据上图可知，参与调查的育儿成员人数为1424 人，认为国产品牌好用的占比是39.8%，所以
1424×39.8%≈567 人。选择B。`,
  },
  {
  id: 'd-2026-119',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `3S 集团是一家电子科技公司，其产品深受广大用户的喜爱，上市6 年来公司营业额和资产总额都发
生了显著变化。截止第六年年底，大中华区营业额达到10670 万美元，比上年增加106 万;北美区营
业额为576 万美元，同比减少17 万;欧洲区营业额为1271 万美元，同比增加139 万;东南亚区营业总
额为193 万美元，同比增加13 万元。就公司资产总额而言，大中华区公司资产总额达到52850 万美
元，比上一年增加2690 万，增加5.4%。北美区公司资产总额为750 万美元，比上-年减少1.6%。欧
洲区公司资产总额为2950 万美元，增加14.8%。东南亚区公司资产总额为330 万美元，增加6.7%。以
下说法错误的是( )`,
  stemImages: ["/qbank/img_3f8b4cf0fd.webp"],
  options: [
    { key: "A", content: `该公司上市以来，大中华区资产总额逐年增加` },
    { key: "B", content: `公司上市的第五年，大中华区营业额为10564 万美元` },
    { key: "C", content: `公司上市第五年，北美区的资产总额为559 万美元` },
    { key: "D", content: `公司上市后第六年的营业额比第五年有所增加` },
  ],
  correctAnswer: 'C',
  explanation: `如图A 项正确；B 项，第六年年底，大中华区营业额达到10670 万美元，比上年增加106 万，
那么第五年的营业额=10670-106=10564，正确；C 项，第六年，北美区公司资产总额为750 万美元，
比上一年减少1.6%，那么第五年北美区的资产总额=750÷（1-1.6%）=762.2，错误。D 项，（截止第
六年年底，大中华区营业额达到10670 万美元，比上年增加106 万;北美区营业额为576 万美元，同
比减少17 万;欧洲区营业额为1271 万美元，同比增加139 万;东南亚区营业总额为193 万美元，同比
增加13 万元。），106-17+139+13=241，有所增加正确。`,
  },
  {
  id: 'd-2026-120',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `2019 年9 月个级别城市三大品牌门店分布根据给定的信息，以下哪项陈述是正确的:`,
  stemImages: ["/qbank/img_e3dfd4c303.webp"],
  options: [
    { key: "A", content: `C 品牌选择放弃二三线城市市场的原因是该品牌目标客户为高端人群，集中在一线城市。` },
    { key: "B", content: `A 品牌在一线城市的营收是B 品牌的2 倍` },
    { key: "C", content: `A 品牌在新一线城市店数量比一线城市少了30%` },
    { key: "D", content: `相较于其他品牌，B 品牌的营销策略更关注新一线城市的消费潜力。` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-121',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下图是一公司某年各地区的销售额比例图(单位:万元)。
根据图表回答下列问题: 从图中可推出的结论是( )。(1) J 与A 的销售额相差最少;(2)销售额前五名之
外的其他地区的销售额小于B 和C 的销售额之和;(3) F 地区的销售额比C 地区销售额少的比例小于G
地区比J 地区销售额少的比例。`,
  stemImages: ["/qbank/img_75ae9ac574.webp"],
  options: [
    { key: "A", content: `只有(1)` },
    { key: "B", content: `只有(2)` },
    { key: "C", content: `只有(3)` },
    { key: "D", content: `(1) (2) (3)均正确` },
  ],
  correctAnswer: 'D',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-122',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'easy',
  stem: `生产价格指数(PPI)反映某类产品当前的价值相对于某一年(基期，如去年)价值的变化幅度，计算公式
通常为:
(一组固定商品当期的生产价格/一组固定商品按基期的生产价格) ×100,
如果某类商品的生产价格指数为103，则表明此商品当期的生产价格是基期价格的1.03 倍。下表反
映了我国某年8 月份，主要农作物商品的生产价格指数。基于图表信息综合来看，哪个地区的农产
品最贵?`,
  stemImages: ["/qbank/img_68f1661f28.webp"],
  options: [
    { key: "A", content: `辽宁省` },
    { key: "B", content: `四川省` },
    { key: "C", content: `吉林省` },
    { key: "D", content: `无法判断` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-123',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下面是某淘宝店铺连续四年的销售情况，根据图表回答问题。第一年到第四年间，年均增长最大的
是( )`,
  stemImages: ["/qbank/img_a6d8c44c8b.webp"],
  options: [
    { key: "A", content: `销售额` },
    { key: "B", content: `销售成本` },
    { key: "C", content: `销售利润` },
    { key: "D", content: `三者相当` },
  ],
  correctAnswer: 'C',
  explanation: `销售额年均增长=（240-75）/75=2.2 销售成本年均增长=（160-52）/52=2.08 销售利润年均
增长=（80-23）/23=2.48`,
  },
  {
  id: 'd-2026-124',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下表反映了某厂的销售额情况(单位:万元)，根据表格回答下列问题: 近几年，第三季度的销售额同比
增长率变化趋势是( )。`,
  stemImages: ["/qbank/img_0c12a05fc0.webp"],
  options: [
    { key: "A", content: `先上升后下降` },
    { key: "B", content: `先下降后上升` },
    { key: "C", content: `一直下降` },
    { key: "D", content: `一直上升` },
  ],
  correctAnswer: 'C',
  explanation: `第二年第三季度销售额增长率=（480-336）/336=43%第三年第三季度销售额增长率=（570-480）
/480=18.8%第四年第三季度销售额增长率=（577-570）/570=1.2%答案为C`,
  },
  {
  id: 'd-2026-125',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下图反映了去年不同年龄段人群的餐饮月均消费情况。请根据图表回答下列问题。餐饮月开支从小
到大的排序为( )`,
  stemImages: ["/qbank/img_ed69bb79a2.webp"],
  options: [
    { key: "A", content: `95 后学生<95 后办公族<95 前` },
    { key: "B", content: `95 后办公族<95 后学生<95 前` },
    { key: "C", content: `95 后学生<95 前<95 后办公族` },
    { key: "D", content: `95 后办公族<95 前<95 后学生` },
  ],
  correctAnswer: 'C',
  explanation: `95后学生月开支=695.7+412.5+242.4+266.6=1617.295后办公族月开支
=828.7+684.7+569.5+464.5=2547.495 前月开支=927.3+684.7+569.5+464.5=2313 答案为C`,
  },
  {
  id: 'd-2026-126',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `某餐厅对四种菜品的价格进行了一定的调整，下图为菜品价格调整情况及涨价前后销售量对比，请
根据图表回答下列问题。四种菜品中，价格涨幅最大的是( )。`,
  stemImages: ["/qbank/img_8ac72cb431.webp"],
  options: [
    { key: "A", content: `菜品A` },
    { key: "B", content: `菜品B` },
    { key: "C", content: `菜品C` },
    { key: "D", content: `菜品D` },
  ],
  correctAnswer: 'D',
  explanation: `A 菜品的价格涨幅=（70-65）/65=7.7%B 菜品的价格涨幅=（42-40）/40=5%C 菜品的价格涨幅
=（100-95）/95=5.3%D 菜品的价格涨幅=（125-110）/110=13.6%答案为D`,
  },
  {
  id: 'd-2026-127',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'hard',
  stem: `下图反映了近四年6 月某市保费收入变化情况(单位:万元)，根据图表回答下列问题: 财产险的保费收
入占总保费收入的比重呈现( )的趋势。`,
  stemImages: ["/qbank/img_6ee9783ba9.webp"],
  options: [
    { key: "A", content: `持续上升` },
    { key: "B", content: `持续下降` },
    { key: "C", content: `先上升再下降` },
    { key: "D", content: `先下降再上升` },
  ],
  correctAnswer: 'D',
  explanation: `第一年6 月财产险的保费收入占总保费的421/（421+1099+421）=22%第一年6 月财产险的保
费收入占总保费的476/（476+1504+476）=19.4%第一年6 月财产险的保费收入占总保费的586/
（586+1595+586）=21%第一年6 月财产险的保费收入占总保费的678/（678+1802+678）=21%先
下降再上升，答案为D`,
  },
  {
  id: 'd-2026-128',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `根据某年长三角三省一市GDP 总量及增速情况统计图回答下列问题假设今后几年均同比增速超过
8%，问最慢( )年后浙江GDP 总量将超过10 万亿门槛`,
  stemImages: ["/qbank/img_3e0b04985a.webp"],
  options: [
    { key: "A", content: `6` },
    { key: "B", content: `7` },
    { key: "C", content: `5` },
    { key: "D", content: `8` },
  ],
  correctAnswer: 'A',
  explanation: `浙江现在的GDP=64613 亿元，若今后几年均同比增速超过8%，题干问的是最慢几年，那就按
最小8%计算，64613*（1+8%）=69782、69782*（1+8%）=75364、75364*（1+8%）=81393、81393*
（1+8%）=87905、87905*（1+8%）=94937、94937*（1+8%）=102532，答案为A`,
  },
  {
  id: 'd-2026-129',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图反映了近几年某公司A、B 两种产品的销售情况(单位:万件)。根据图表回答下列问题: 问B 产品
销售量增幅最大的是第( )年。`,
  stemImages: ["/qbank/img_447247fca5.webp"],
  options: [
    { key: "A", content: `二` },
    { key: "B", content: `三` },
    { key: "C", content: `四` },
    { key: "D", content: `五` },
  ],
  correctAnswer: 'A',
  explanation: `第二年B 产品销售量增幅=（33482-26995 ）/26995=24% 第三年B 产品销售量增幅=
（39341-33482）/33482=17.5%第四年B 产品销售量增幅=（46106-39341）/39341=17.2%第五年B
产品销售量增幅=（54729-46106）/16106=18.7%答案为A`,
  },
  {
  id: 'd-2026-130',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'hard',
  stem: `AR 公司是一家家电销售公司，请根据下表回答问题去年第二季度销售量同比增长额度最大的是( )`,
  stemImages: ["/qbank/img_e93f801824.webp"],
  options: [
    { key: "A", content: `销售一部` },
    { key: "B", content: `销售二部` },
    { key: "C", content: `销售三部` },
    { key: "D", content: `销售四部` },
  ],
  correctAnswer: 'A',
  explanation: `去年第二季度销售一部同比增长率=（16000.4-4292.6）/4292.6=273%去年第二季度销售二部
同比增长率=（1688.7-634.7）/634.7=166%去年第二季度销售三部同比增长率=（11766.8-6709.4）
/6709.4=75.4%去年第二季度销售四部同比增长率=（3455.5-1484.9）/1484.9=133%答案为A`,
  },
  {
  id: 'd-2026-131',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'hard',
  stem: `下表是TT 公司某年的销售报表，公司共有销售一部、二部和三部三个销售团队。请根据下表回答问
题销售一部销售额占总销售额的比重为: ( )`,
  stemImages: ["/qbank/img_0e056b237f.webp"],
  options: [
    { key: "A", content: `4.1%` },
    { key: "B", content: `9.2%` },
    { key: "C", content: `13.3%` },
    { key: "D", content: `8.6%` },
  ],
  correctAnswer: 'B',
  explanation: `总销售额=58332+271392+306739=636463 销售一部销售额占总销售额的比重
=58332/636463=9.2%，答案为B`,
  },
  {
  id: 'd-2026-132',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `根据下表回答问题。CR 公司近年来销售额情况（单位:万元）下列说法正确的是: ( )`,
  stemImages: ["/qbank/img_dba0f4123b.webp"],
  options: [
    { key: "A", content: `第一年至第五年该公司销售额增长率持续上升` },
    { key: "B", content: `预计第六年该公司销售额将突破250000 万元` },
    { key: "C", content: `第六年，该公司销售额增长率将迎来转机` },
    { key: "D", content: `第一年至第五年该公司销售额增长率持续下降` },
  ],
  correctAnswer: 'D',
  explanation: `第二年销售额增长率=（191571-162376）/162376=18%，第三年销售额增长率=（204540-191571）
/191571=6.8%，第四年销售额增长率=（217261-204540）/204540=6.2%，第五年销售额增长率=
（227991-217261）/217261=4.9%，平均增长率=（18%+6.8%+6.2%+4.9%）/4=8.98%选项A 错误；选
项B 如果按平均增长率计算，第六年该公司销售额=227991*（1+8.98%）=248464，否则无法判断，
因为不知道增长率是多少，错误；C 项也无法判断。D 项正确`,
  },
  {
  id: 'd-2026-133',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `互联网金融在过去五年的发展情况去下面所示，请根据相关信息，回答问题。第五年与第一年相比，
互联网金融的投资额增长了( )倍`,
  stemImages: ["/qbank/img_392720a6d2.webp"],
  options: [
    { key: "A", content: `1.91` },
    { key: "B", content: `2.91` },
    { key: "C", content: `5.01` },
    { key: "D", content: `6.01` },
  ],
  correctAnswer: 'C',
  explanation: `如图，第五年互联网金融的投资额=9887，第一年互联网金融的投资额=1644，注意审题，题
干问的是增长了几倍，（9887-1644）/1644=5.01，答案为C`,
  },
  {
  id: 'd-2026-134',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下图反映了3 个细分行业广告月度投入指数变化情况，请根据图表回答以下问题。根据图表信息，
下列说法不正确的是( )`,
  stemImages: ["/qbank/img_38d9c4fd84.webp"],
  options: [
    { key: "A", content: `食品行业月平均广告投放明显高于饮料和酒饮` },
    { key: "B", content: `6-9 月为饮料广告投放旺季` },
    { key: "C", content: `食品广告月度投入指数时刻都维持在三个细分行业的平均水平之上` },
    { key: "D", content: `酒饮行业广告月度投入指数整体偏低` },
  ],
  correctAnswer: 'C',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-135',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `随着近年来人工智能的快速发展，AI+教育领域备受关注，下图为2013 年2019 年中国AI+教育融资
情况: 假如2020 年中国AI+教育融资总额增长值创新高，则2020 年中国AI+教育融资总额( )`,
  stemImages: ["/qbank/img_e6a531eb9e.webp"],
  options: [
    { key: "A", content: `高于30 亿元` },
    { key: "B", content: `高于35 亿元` },
    { key: "C", content: `高于40 亿元` },
    { key: "D", content: `无法确定` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-136',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图反映了近五年某公司的收入额情况(单位:万元)。根据图表回答下列问题: 第五年收入总额的增长
率是( )。`,
  stemImages: ["/qbank/img_695b6393da.webp"],
  options: [
    { key: "A", content: `19.8%` },
    { key: "B", content: `16.5%` },
    { key: "C", content: `21.6%` },
    { key: "D", content: `17.7%` },
  ],
  correctAnswer: 'A',
  explanation: `如图，第五年的收入总额=31628，第四年的收入总额=26396.5，增长率=（31628-26396.5）
/26396.5=19.8%`,
  },
  {
  id: 'd-2026-137',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下表是2019 年第一季度-2020 年第一季度第三方移动交易规模和结构
(单位:亿万元; %) .根据图表回答下列问题: 在五个季度中个人应用的交易规模最大的是( ) .`,
  stemImages: ["/qbank/img_057bb3edd5.webp"],
  options: [
    { key: "A", content: `2019 年第一季度` },
    { key: "B", content: `2019 年第二季度` },
    { key: "C", content: `2019 年第四季度` },
    { key: "D", content: `2020 年第一季度` },
  ],
  correctAnswer: 'D',
  explanation: `2019 年第一季度个人应用的交易规模=55.4*61.3%=33.962019 年第二季度个人应用的交易规模
=55*57.9%=322019 年第四季度个人应用的交易规模=59.8*55.3%=332020 年第一季度个人应用的交
易规模=56.7*60.8%=34.47 答案为D`,
  },
  {
  id: 'd-2026-138',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长量',
  difficulty: 'hard',
  stem: `根据2015-2019 年中国微波炉出口数量情况和2015-2019 年中国微波炉出口金额统计情况回答下列
问题。2015 -2019 年中国微波炉出口数量增量最多的是( )`,
  stemImages: ["/qbank/img_bada2e497e.webp"],
  options: [
    { key: "A", content: `2015 年` },
    { key: "B", content: `2019 年` },
    { key: "C", content: `2017 年` },
    { key: "D", content: `2016 年` },
  ],
  correctAnswer: 'D',
  explanation: `2016 年微波炉出口数量增量=5628-5371=2572017 年微波炉出口数量增量
=5881-5628=2532018 年微波炉出口数量增量=5841-5881=-402019 年微波炉出口数量增量
=5980-5841=139 答案为D`,
  },
  {
  id: 'd-2026-139',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `下图为某国GDP 同比增速情况和该国大中小型企业利润同比增长情况。(单位:
%)请根据图表回答问题: 宏观背景下，大型企业受到的冲击相对于中小型企业更小。三条曲线中，最
有可能反映大型企业利润同比增长情况的是( )`,
  stemImages: ["/qbank/img_b4ed71d0c1.webp"],
  options: [
    { key: "A", content: `折线一` },
    { key: "B", content: `折线二` },
    { key: "C", content: `折线三` },
    { key: "D", content: `折线二和三均有可能` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-140',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下表为某出版社去年的图书销售情况表，根据表格回答下列问题。如果今年总销量增加了10%，且
网上直销量增加12%，那么除了网上直销外其他的渠道销总量应增加约( )。`,
  stemImages: ["/qbank/img_b2735cc5e5.webp"],
  options: [
    { key: "A", content: `10%` },
    { key: "B", content: `8%` },
    { key: "C", content: `7%` },
    { key: "D", content: `12%` },
  ],
  correctAnswer: 'A',
  explanation: `如图，去年的总销量=1+2.3+5+3+6+2.7=20，其中网上直销=5，其余=20-5=15 今年总销量
增加了10%，即20*（1+10%）=22，其中网上直销增加了12%，即5*（1+12%）=5.6，那么今年其余
的销量便为22-5.6=16.4，除了网上直销外其他的渠道销总量应增加约为（16.4-15）/15≈10%，答
案为A`,
  },
  {
  id: 'd-2026-141',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `根据2020 年3-12 月中国水海产品出口情况回答下列问题下列说法正确的是( )`,
  stemImages: ["/qbank/img_a8c3f6708d.webp"],
  options: [
    { key: "A", content: `2020 年3-12 月中国水海产品出口与上月相比同比增长率出现负增长的月份有2 个` },
    { key: "B", content: `2020 年下半年中国水海产品出口量累计不超过200 万吨` },
    { key: "C", content: `三月和四月累计出口量是六月出口量的两倍` },
    { key: "D", content: `与上月相比，9 月的同比增长率比11 月的同比增长率高` },
  ],
  correctAnswer: 'C',
  explanation: `A 项，2020 年3-12 月中国水海产品出口与上月相比同比增长率出现负增长的月份有4 个，分
别是6 、8 、10 、12 月，错误。B 项，2020 年下半年中国水海产品出口量累计为
31+30+33+32+39+36=201＞200，错误D 项，9 月的同比增长率=（33-30）/30=10%，11 月的同比
增长率=（39-32）/32=22%，11 月比9 月高，错误C 项，三月和四月累计出口量=29+31=60，是6
月的两倍，正确，答案为C`,
  },
  {
  id: 'd-2026-142',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'hard',
  stem: `下面展示了某7 座城市截至某年年底的汽车保有量，请根据下列图表回答问题: 面说法正确的是:`,
  stemImages: ["/qbank/img_44f6f8487a.webp"],
  options: [
    { key: "A", content: `城市D 前一年的汽车保有量为305 万辆` },
    { key: "B", content: `如果城市F 保持3%的年增长率不变，则在三年内可以将汽车保有量提升至300 万辆` },
    { key: "C", content: `城市C 的汽车保有量增长67%，能在下一年时排到首位` },
    { key: "D", content: `以上说法均不正确` },
  ],
  correctAnswer: 'D',
  explanation: `A 项，城市D 的汽车保有量为320，同比增长率为3%，那么城市D 前一年的汽车保有量为320/
（1+3%）=310，错误。B 项，城市F 的汽车保有量为270 万辆，保持3%的年增长率不变，270*（1+3%）
=278.1、278.1*（1+3%）=286.443、286.443*（1+3%）=295，错误C 项，城市C 的汽车保有量增长
67%为330*（1+67%）=551.1，那其他的城市也可能增长，且城市A 只要稍稍增长就会超过城市C，
所以无法判断城市C 是否排在首位，错误。答案为D`,
  },
  {
  id: 'd-2026-143',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'medium',
  stem: `某旅游最点去年6-12 月份经营情况如下表所示，根据下列图表，回答问题。该景区6 月份的营业
收入约为( )万`,
  stemImages: ["/qbank/img_3a2b2df474.webp"],
  options: [
    { key: "A", content: `42000` },
    { key: "B", content: `43000` },
    { key: "C", content: `44000` },
    { key: "D", content: `41000` },
  ],
  correctAnswer: 'B',
  explanation: `该景区7 月份的营业收入为50298，增长率=17.2%，那么该景区6 月份的营业收入约为50298/
（1+17.2%）≈43000，答案为B`,
  },
  {
  id: 'd-2026-144',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'hard',
  stem: `下表展示了某年1-12 月某品牌汽车的销量及其同比增长情况，根据围表。回答下列问题SUV 去年
前11 个月的销量约为( )辆`,
  stemImages: ["/qbank/img_209dc71930.webp"],
  options: [
    { key: "A", content: `1256000` },
    { key: "B", content: `1034320` },
    { key: "C", content: `456980` },
    { key: "D", content: `856702` },
  ],
  correctAnswer: 'D',
  explanation: `SUV12 月销量为93680，同比变化为105%，那么也就是去年12 月SUV 销量=93680/（1+105%）
=45698SUV1-12 月销量为1128000，同比变化为25%，那么也就是去年1-12 月SUV 销量=1128000/
（1+25%）=902400SUV 去年前11 个月的销量约为902400-45698=856702 答案为D`,
  },
  {
  id: 'd-2026-145',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下列图表反映了2015-2019 年中国医疗美容市场规模情况。请根据图表回答以下问题。根据图表信
息，推测2014 年的市场规模大概是( )亿元。`,
  stemImages: ["/qbank/img_3344f40093.webp"],
  options: [
    { key: "A", content: `4.22` },
    { key: "B", content: `42.2` },
    { key: "C", content: `422` },
    { key: "D", content: `4220` },
  ],
  correctAnswer: 'C',
  explanation: `本题要注意单位换算，问题中单位是亿元，图中单位是十亿元，答案为C`,
  },
  {
  id: 'd-2026-146',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率比较',
  difficulty: 'hard',
  stem: `根据2014-2020 年"双十一"全网销售额统计情况和2020 年"双十一"全网销售额各平台占比情况情
况回答下列问题。以下年份同比增长率排序正确的是( ) 。`,
  stemImages: ["/qbank/img_a2dd374529.webp"],
  options: [
    { key: "A", content: `2015> 2019>2017>2018` },
    { key: "B", content: `2015>2017>2019> 2018` },
    { key: "C", content: `2015> 2017> 2018>2019` },
    { key: "D", content: `2015< 2017<2019<2018` },
  ],
  correctAnswer: 'B',
  explanation: `选项中只有2015、2017、2018、2019 四年，所以只算这四年就可以了2015 年同比增长率=
（1230-805）/805=53%；2017 年同比增长率=（2540-1770）/1770=44%2018 年同比增长率=
（3143.2-2540）/2540=24%2019 年同比增长率=（4101-3143.2）/3143.2=30.5%2018＜2019＜2017
＜2015，答案为B`,
  },
  {
  id: 'd-2026-147',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'hard',
  stem: `下表是DG 公司5 种产品在全球几个国家的销售额，请根据图表信息，回答相关问题: 关于"C 产品在
美国、俄罗斯、加拿大三国的销售额比重"的描述最恰当的是( )`,
  stemImages: ["/qbank/img_bf79582244.webp"],
  options: [
    { key: "B", content: `俄罗斯最大` },
    { key: "C", content: `加拿大最大` },
    { key: "D", content: `三国相当` },
  ],
  correctAnswer: 'B',
  explanation: `如图，C 产品在美国的销售额=62130，在俄罗斯的销售额=263832，在加拿大的销售额=142937，
俄罗斯最大，答案为B`,
  },
  {
  id: 'd-2026-148',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `手机的层出不穷给我们带来巨大的便利，但也大大增加了电子垃圾的数量，如果处置不当或随意抛
弃就会对环境和人类健康构成巨大威胁。以下是关于废置手机处理方式的一些信息，请根据这些信
息，回答相关问题。以下说法错误的是: ( )`,
  stemImages: ["/qbank/img_103574e6b6.webp"],
  options: [
    { key: "A", content: `根据A、B 两家公司的调查数据，平均来看，消费者最常使用的处置废置手机的方式是不处理` },
    { key: "B", content: `大量的废置手机没有得到合理地处理` },
    { key: "C", content: `参照官方数据，B 公司的调查结果相对更准确` },
    { key: "D", content: `大多数人没有对废置手机做有害处理` },
  ],
  correctAnswer: 'C',
  explanation: `如图，对手机的处理方式中不处理的比例高A 项正确。B 项，我国废置手机的处理情况中闲置
率较高，大量的废置手机没有得到合理地处理正确。D 项，题干说如果处置不当或随意抛弃就会对
环境和人类健康构成巨大威胁，上图中直接扔掉的比率是很小的，所以D 项大多数人没有对废置手
机做有害处理正确。C 项，A 公司的调查数据相加等于100%，B 公司不等于，所以B 公司的调查结
果相对更准确是错误的。`,
  },
  {
  id: 'd-2026-149',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'medium',
  stem: `QOS 公司为家广告制作公司，去年该公司盈利状况如下图所示，根据下表回答问题。该公司最新报
告显示，12 月该公司实际利润139.2 万元，上一年12 月该公司实际利润为( )万元`,
  stemImages: ["/qbank/img_7dc906b81e.webp"],
  options: [
    { key: "A", content: `107.6` },
    { key: "B", content: `40.9` },
    { key: "C", content: `92.8` },
    { key: "D", content: `101.5` },
  ],
  correctAnswer: 'A',
  explanation: `12 月该公司实际利润139.2 万元，同比增长为29.4%，那么上一年12 月该公司实际利润=139.2÷
（1+29.4%）=107.6，答案为A`,
  },
  {
  id: 'd-2026-150',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率比较',
  difficulty: 'hard',
  stem: `L 市是知名旅游城市，2010 年城市居民为2 百万，下图反映了该市过去40 年公共交通使用人数的变
化，清根据图表回答问题。公共交通使用人数增长率最高的时期是( ).`,
  stemImages: ["/qbank/img_2bb23d1606.webp"],
  options: [
    { key: "A", content: `1970-1980` },
    { key: "B", content: `1980- 1990` },
    { key: "C", content: `1990-2000` },
    { key: "D", content: `2000-2010` },
  ],
  correctAnswer: 'A',
  explanation: `1970-1980 公共交通使用人数增长率=（1695-204）/204=730%1980-1990 公共交通使用人数
增长率= （4385-1695 ）/1695=159%1990-2000 公共交通使用人数增长率= （10592-4385 ）
/4385=142%2000-2010 公共交通使用人数增长率=（20304-10592）/10592=92%答案为A`,
  },
  {
  id: 'd-2026-151',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据下表回答问题，某区域四年时间内的博物馆发展情况博物馆举办展览最多的那一年，年度修复
的文物数为( )件/套`,
  stemImages: ["/qbank/img_fc51d4ce71.webp"],
  options: [
    { key: "A", content: `33871` },
    { key: "B", content: `39120` },
    { key: "C", content: `79496` },
    { key: "D", content: `304839` },
  ],
  correctAnswer: 'B',
  explanation: `如图，博物馆举办展览最多的一年是第三年，第三年修复的文物数为39120 件/套，答案为B`,
  },
  {
  id: 'd-2026-152',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据2020 年3-11 月中国家用或装饰用木制品出口量及金额增长情况回答下列问题2020 年3-11 月
中国家用或装饰用木制品出口价格由低到高排序正确的是( )`,
  stemImages: ["/qbank/img_f30d4319de.webp"],
  options: [
    { key: "A", content: `3 月<10 月<7 月＜9 月` },
    { key: "B", content: `7 月<8 月<10 月<3 月` },
    { key: "C", content: `10 月<3 月<7 月<8 月` },
    { key: "D", content: `8 月<10 月<3 月<7 月` },
  ],
  correctAnswer: 'A',
  explanation: `如图，A 项101＜262＜273＜274，答案为A`,
  },
  {
  id: 'd-2026-153',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'hard',
  stem: `下图反映了近几年某件商品的售价、总成本和某一原料成本的变化情况(单位:元), 根据图表回答下列
问题: 近几年，生产该商品的某一原料的成本占总成本的比重( )。`,
  stemImages: ["/qbank/img_7e6d29edd2.webp"],
  options: [
    { key: "A", content: `先降低再增加` },
    { key: "B", content: `先增加再降低` },
    { key: "C", content: `逐年降低` },
    { key: "D", content: `逐年增加` },
  ],
  correctAnswer: 'B',
  explanation: `第一年某一原料的成本占总成本的比重=1173/1642=71%第二年某一原料的成本占总成本的比
重=1266/1739=73%第三年某一原料的成本占总成本的比重=1389/1985=70%先增加再降低，答案为B`,
  },
  {
  id: 'd-2026-154',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `RT 零售商在过去5 年投入了大量的精力、财力来扩展店铺数量。下表是RT 零售商过去5 年的扩张
情况，请根据相关信息，回答问题。RT 零售商新增店铺数目最多的是第( )年`,
  stemImages: ["/qbank/img_bd21ca3188.webp"],
  options: [
    { key: "A", content: `2` },
    { key: "B", content: `3` },
    { key: "C", content: `4` },
    { key: "D", content: `5` },
  ],
  correctAnswer: 'B',
  explanation: `第二年新增店铺数=300-50=250 第三年新增店铺数=560-300=260 第四年新增店铺数
=680-560=120 第五年新增店铺数=720-680=40 答案为B`,
  },
  {
  id: 'd-2026-155',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下表呈现了C 公司过去四年的营收情况。根据图表回答下列问题: 若第四年利润总额的增长率为41%，
则剩下三个月的利润总额要达到( )千万`,
  stemImages: ["/qbank/img_840b25659a.webp"],
  options: [
    { key: "A", content: `8.325` },
    { key: "B", content: `5.412` },
    { key: "C", content: `4.707` },
    { key: "D", content: `54.12` },
  ],
  correctAnswer: 'C',
  explanation: `第三年的利润总额为127 百万元，第四年利润总额的增长率为41%，那么第四年的利润总额
=127*（1+41%）=179.07 百万元，第四年1-9 月份利润总额=132 百万元，剩下三个月要达到
179.07-132=47.07 百万元=4.707 千万，注意换算。`,
  },
  {
  id: 'd-2026-156',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据下表回答问题，某区域四年时间内的博物馆发展情况四年内，博物馆从业人员数量最多的是哪
一年? ( )`,
  stemImages: ["/qbank/img_fc51d4ce71.webp"],
  options: [
    { key: "A", content: `第四年` },
    { key: "B", content: `第三年` },
    { key: "C", content: `第二年` },
    { key: "D", content: `第一年` },
  ],
  correctAnswer: 'A',
  explanation: `如图，第四年博物馆从业人员数量最多，有79075 人`,
  },
  {
  id: 'd-2026-157',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '平均数计算',
  difficulty: 'medium',
  stem: `根据2020 年3-12 月中国水海产品出口情况回答下列问题2020 年3-12 月中国水海产品月出口量高
于平均出口量的月份有( )`,
  stemImages: ["/qbank/img_f5a1849a97.webp"],
  options: [
    { key: "A", content: `10 月和6 月` },
    { key: "B", content: `11 月和4 月` },
    { key: "C", content: `11 月和12 月` },
    { key: "D", content: `4 月和6 月` },
  ],
  correctAnswer: 'C',
  explanation: `2020 年3-12 月中国水海产品平均出口量=（29+31+32+30+31+30+33+32+39+36）÷10=32.3
高于平均水平的月份有9、11、12 月，答案为C`,
  },
  {
  id: 'd-2026-158',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'medium',
  stem: `根据2017-2019 年广东、江苏、山东和浙江四省GDP 统计(单位:亿元)和2017-2019 年浙江省三大产
业占比统计图表回答下列问题：浙江省2018 年第一产业产值比2017 年第一产业增长大约( )亿元。`,
  stemImages: ["/qbank/img_f3e50c0cfc.webp"],
  options: [
    { key: "A", content: `50` },
    { key: "B", content: `100` },
    { key: "C", content: `5` },
    { key: "D", content: `200` },
  ],
  correctAnswer: 'A',
  explanation: `浙江省2018 年第一产业产值=56192*3.5%≈1966 浙江省2017 年第一产业产值
=51768*3.7%≈1915 相差1966-1915≈50，答案为A`,
  },
  {
  id: 'd-2026-159',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `N 公司是一家高科技公司，单位人员有比较高的产值。下表是N 公司今年的营收情况和工资支出。
请根据相关信息，回答问题。N 公司正处去业务扩张阶段，明年会增加人员的数量，预计明年公司
工资支出增加20%，则明年N 公司的员工工资总额大约为( ) 万元`,
  stemImages: ["/qbank/img_4787fbed70.webp"],
  options: [
    { key: "A", content: `2800` },
    { key: "B", content: `3000` },
    { key: "C", content: `2900` },
  ],
  correctAnswer: 'B',
  explanation: `今年N 公司的员工工资总额=380+320+140+780+520+260+70=2470，预计明年公司工资支出增加20%，即
2470*（1+20%）≈3000`,
  },
  {
  id: 'd-2026-160',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图是一公司某品牌旗下两个子品牌A 和B 的盈利情况(单位:万元)。根据图表回答下列问题第五年，A 品牌盈利
的同比增长幅度比B 品牌的同比增长幅度高约(
)`,
  stemImages: ["/qbank/img_e13e22f03e.webp"],
  options: [
    { key: "A", content: `7 个百分点` },
    { key: "B", content: `9 个百分点` },
    { key: "C", content: `12 个百分点` },
    { key: "D", content: `15 个百分点` },
  ],
  correctAnswer: 'A',
  explanation: `第五年，A 品牌盈利的同比增长幅度=（13071-11303）÷11303=15.6%第五年，B 品牌盈利的
同比增长幅度=（3687-3391）÷3391=8.7%相差15.6%-8.7%≈7%，答案为A`,
  },
  {
  id: 'd-2026-161',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下图反映了某公司某年新进员工及其入职培训的情况，请根据图表回答问题: 一年，新增员工减少
了20%，入职培训率达到了85%,则经过入职培训的至少有( )人`,
  stemImages: ["/qbank/img_90eae80773.webp"],
  options: [
    { key: "A", content: `126` },
    { key: "B", content: `132` },
    { key: "C", content: `135` },
    { key: "D", content: `139` },
  ],
  correctAnswer: 'A',
  explanation: `如图，新员工人数=40+52+48+45=185 人，下一年新增员工减少了20%即185*（1-20）=148
人，入职培训率达到了85%，则经过入职培训的至少有148*85%=126 人`,
  },
  {
  id: 'd-2026-162',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `某旅游景点去年6-12 月份经营情况如下表所示。根据下列图表，回答问题。如果景点的营业收入
全部来自门票，而且20%的人次买的是半价票，那么10 月份的门票票价为:`,
  stemImages: ["/qbank/img_0bc95019ab.webp"],
  options: [
    { key: "A", content: `61 元` },
    { key: "B", content: `58 元` },
    { key: "C", content: `60 元` },
    { key: "D", content: `57 元` },
  ],
  correctAnswer: 'A',
  explanation: `10 月份营业收入为58127 万元=581270000 元，接待总人次为10643 千人次=10643000 次其中
20% 是半价票，也就是10643000*20%=2128600 人次是半价票，那么全价票是
10643000-2128600=8514400 假设票价为X，即8514400X+2128600*（0.5X）=581270000，解得X≈61
元，答案为A`,
  },
  {
  id: 'd-2026-163',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `根据2020 年3 月-2021 年3 月中国集装箱船出口数量及出口金额增长情况回答下列问题列能正确反
映2020 年3 月-2021 年3 月中国集装箱船出口情况的是( )`,
  stemImages: ["/qbank/img_9abe3b9581.webp"],
  options: [
    { key: "A", content: `2021 年第一季度的环比增长率为36.8%` },
    { key: "B", content: `2020 年3-12 月中国集装箱船月均出口数为6 艘` },
    { key: "C", content: `2020 年3-12 月中国集装箱船出口金额低于100 百万美元的月份有3 个` },
    { key: "D", content: `2020 年下半年中国集装箱船出口金额累计不超过1500 百万美元` },
  ],
  correctAnswer: 'C',
  explanation: `A 项无法计算，只说环比增长率，不知道是什么的环比增长率，错误。B 项，2020 年3-12 月
中国集装箱船月均出口数=（2+1+4+1+5+4+5+5+4+10）÷10=4.5，错误C 项，2020 年3-12 月中
国集装箱船出口金额低于100 百万美元的月份有3 个，正确D 项2020 年下半年中国集装箱船出口金
额累计=35.9+206.6+154.5+271.7+331.4+103.8+532.8=1636.5＞1500，错误答案为C`,
  },
  {
  id: 'd-2026-164',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `某汽车制造公司推出了一款新型节能汽车，既可以使用电池，也可以使用汽油。下图反映了该汽车
在不同行驶距离下的燃油的使用情况。根据图表回答下列问题: 电力行驶范围是( )英里。`,
  stemImages: ["/qbank/img_b2ecbe631a.webp"],
  options: [
    { key: "A", content: `20-40` },
    { key: "B", content: `0-20` },
    { key: "C", content: `0-40` },
    { key: "D", content: `40-100` },
  ],
  correctAnswer: 'C',
  explanation: `电力行驶范围是0-40 英里，因为燃油使用是从40 英里处开始的。`,
  },
  {
  id: 'd-2026-165',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下表展示了近五年动画市场的收入构成。请根据图表回答下列问题: 在第五年，商品和电视占总收入
的比例相差( )个百分点`,
  stemImages: ["/qbank/img_2b19956eea.webp"],
  options: [
    { key: "A", content: `28` },
    { key: "B", content: `37` },
    { key: "C", content: `40` },
    { key: "D", content: `45` },
  ],
  correctAnswer: 'B',
  explanation: `第五年动画市场的总收入=1100+2981+527+6552+3265+408=14833 商品占总收入的比例
=6552/14833=44.2%电视占总收入的比例=1100/14833=7.4%相差44.2%-7.4%≈37%`,
  },
  {
  id: 'd-2026-166',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下表是2007 年-2021E3G/4G/5G 智能手机出货量。根据图表回答下列问题: 若按照2021 (E)的5G 手
机增长率，预计2022 (E)的5G 手机出货量是( )`,
  stemImages: ["/qbank/img_61c8f2e89b.webp"],
  options: [
    { key: "A", content: `562.5 万部` },
    { key: "B", content: `700 万部` },
    { key: "C", content: `950 万部` },
    { key: "D", content: `1012.5 万部` },
  ],
  correctAnswer: 'D',
  explanation: `2021 5G 手机增长率=（450-200）÷200=125%按照这个增长率，预计2022 的5G 手机出货量
=450*（1+125%）=1012.5 万部`,
  },
  {
  id: 'd-2026-167',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `根据2020 年1-12 月中国动力电池产量数据统计情况图回答下列问题现在已知2019 年中国动力电
池产量总量为76GWh,如果按照2020 年年均增长率计算，( ) 年后年产量将超过100GWh。`,
  stemImages: ["/qbank/img_20d8813615.webp"],
  options: [
    { key: "A", content: `5` },
    { key: "B", content: `3` },
    { key: "C", content: `2` },
    { key: "D", content: `4` },
  ],
  correctAnswer: 'C',
  explanation: `年均增长率=[（2.9+0.9+4.5+4.7+...12.7+15.2）-76]÷76=10%83.6*（1+10%）=91.9691.96*（1+10%）
=101＞100 答案为C`,
  },
  {
  id: 'd-2026-168',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `根据下表，回答问题:某学校某三年教师性别、年龄构成面说法正确的是( )`,
  stemImages: ["/qbank/img_3949dd7fd9.webp"],
  options: [
    { key: "A", content: `第二年男教师最多` },
    { key: "B", content: `第三年女教师最少` },
    { key: "C", content: `第二年40-50 岁年龄段的男教师比第一年多80 人` },
    { key: "D", content: `第三年40 岁及以下的男女教师比例为1.5:1` },
  ],
  correctAnswer: 'C',
  explanation: `A 项，第一年男教师人数=120+240+100=460，第二年男教师人数=210+320+200=730，第三
年男教师人数=300+400+320=1020 ，第三年最多，A 项错误。B 项，第一年女教师人数
=60+120+40=220，第二年女教师人数=40+200+120=360，第三年女教师人数=150+270+280=700，
第一年女教师最少，B 项错误；D 项，第三年40 岁及以下的男女教师比例为320:280=8:7，D 项错误；
C 项，第一年40-50 岁年龄段的男教师=240，第二年40-50 岁年龄段的男教师=320,320-240=80，C
项正确`,
  },
  {
  id: 'd-2026-169',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'medium',
  stem: `某旅游景点去年6-12 月份经营情况如下表所示。根据下列图表，回答问题。该景区6 月份的营业
收入约为( )万`,
  stemImages: ["/qbank/img_0bc95019ab.webp"],
  options: [
    { key: "A", content: `42000` },
    { key: "B", content: `43000` },
    { key: "C", content: `44000` },
    { key: "D", content: `41000` },
  ],
  correctAnswer: 'B',
  explanation: `如图7 月份营业收入为50298，营业收入增长率为17.2%，那么6 月份的营业收入=50298÷
（1+17.2%）≈43000，答案为B`,
  },
  {
  id: 'd-2026-170',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `根据下表回答问题。RS 公司近年来空调和电视机的利润情况（单位:万元）若公司第六年电视机及
空调利润增长率与第五年相同，预计在第六年两类家电利润额是( )万`,
  stemImages: ["/qbank/img_2e0cbe0b97.webp"],
  options: [
    { key: "A", content: `91223` },
    { key: "B", content: `96765` },
    { key: "C", content: `101038` },
    { key: "D", content: `110382` },
  ],
  correctAnswer: 'C',
  explanation: `第五年电视机利润增长率=（54636-46189 ）÷46189=18.3% 第五年空调利润增长率=
（36587-36786）÷36786=-0.5%第六年电视机利润=54636*（1+18.3%）=64634 第六年空调利润
=36587*（1-0.5%）=3640464634+36404=101038`,
  },
  {
  id: 'd-2026-171',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下图反映了A、B 两种商品的销售额情况(单位:万元)。根据图表回答下列问题: 第二年至第五年，A
商品的销售额与上年相比增长幅度最大的年份是第( )年。`,
  stemImages: ["/qbank/img_1431771a0b.webp"],
  options: [
    { key: "A", content: `二` },
    { key: "B", content: `三` },
    { key: "C", content: `四` },
    { key: "D", content: `五` },
  ],
  correctAnswer: 'A',
  explanation: `第二年A 商品的销售额与上年相比增长幅度=（1132-1037）/1037=9.2%第三年A 商品的销售
额与上年相比增长幅度=（1189-1132）/1132=5%第四年A 商品的销售额与上年相比增长幅度=
（1289-1189）/1189=8.4%第五年A 商品的销售额与上年相比增长幅度=（1401-1289）/1289=8.7%
答案为A`,
  },
  {
  id: 'd-2026-172',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长量',
  difficulty: 'hard',
  stem: `根据2015-2019 年海南省房地产销售情况统计图回答下列问题。列说法正确的是( )。`,
  stemImages: ["/qbank/img_5291d11326.webp"],
  options: [
    { key: "A", content: `2015-2019 年海南省房地产总销售金额不超过8500 亿元` },
    { key: "B", content: `2017 年海南省房地产销售额同比增速不足80%` },
    { key: "C", content: `2015-2019 年海南省房地产销售金额增量最少的是2018 年` },
    { key: "D", content: `2016-2019 年海南省房地产销售金额同比增速从高到低排序为:2017>2016>2018>2019` },
  ],
  correctAnswer: 'D',
  explanation: `A项2015-2019年海南省房地产总销售金额
=982.75+1490.2+2713.72+2088.29+1275.76=8550.72＞8500，错误。B 项2017 年海南省房地产销售
额同比增速不足80%，2016-2017 年的增速=（2713.72-1490.2）÷1490.2=82.1%，错误C 项，2015-2019
年海南省房地产销售金额增量最少的是2015 年，错误D 项，2016 年销售金额同比增速=
（1490.2-982.75）÷982.75=51.6%2017 年销售金额同比增速=（2713.72-1490.2）÷1490.2=82.1%2018
年销售金额同比增速= （2088.29-2713.72 ）÷2713.72=-23%2019 年销售金额同比增速=
（1275.76-2088.29）÷2088.29=-39%2017>2016>2018>2019，正确`,
  },
  {
  id: 'd-2026-173',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `电子商务的迅速发展，也促进了快递物流的快速发展。下列图表呈现了某八年间，电子商务和物流
行业的发展状况。根据图表，回答下列问题: 如果保持第八年的快递物流业务量增长率，那么快递物
流业务量突破5100,000 万件，至少需要多少年?`,
  stemImages: ["/qbank/img_ddb51915f9.webp"],
  options: [
    { key: "A", content: `1` },
    { key: "B", content: `2` },
    { key: "C", content: `3` },
    { key: "D", content: `4` },
  ],
  correctAnswer: 'C',
  explanation: `保持第八年的快递物流业务量增长率，第八年的快递物流业务量增长率=（2001000-1402000）
÷1402000=42.7%，2001000*（1+42.7%）=2855427,2855427*（1+42.7%）=4074694,4074694*（1+42.7%）
=5814588＞5100000 答案为C`,
  },
  {
  id: 'd-2026-174',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'hard',
  stem: `下表是GB 精密仪器公司某年的销售情况，请根据表中的信息回答问题。在美国销售的零部件前一
年的单位售价为( )元`,
  stemImages: ["/qbank/img_dc068edf95.webp"],
  options: [
    { key: "A", content: `7,614` },
    { key: "B", content: `8,309` },
    { key: "C", content: `9,029` },
    { key: "D", content: `9,777` },
  ],
  correctAnswer: 'B',
  explanation: `如图，美国地区销售总量为33.1 万件=331000 件，增长率为-24.3%，那么前一年美国地区销售
总量为331000÷（1-24.3%）=437252 件；美国地区销售额为25.07 亿元=2507000000 元，增长率为
-31%，那么前一年美国地区销售额为2507000000÷（1-31%）=3633333333 元；美国销售的零部件
前一年的单位售价为3633333333÷437252=8309 元答案为B`,
  },
  {
  id: 'd-2026-175',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下图是近两年某公司的消费者投诉数量情况(单位:件)。根据图表回答下列问题: 在第二年的投诉数量
图中，波谷数跟第一年比相差( )个。`,
  stemImages: ["/qbank/img_9a13edc7bc.webp"],
  options: [
    { key: "A", content: `0` },
    { key: "B", content: `1` },
    { key: "C", content: `2` },
    { key: "D", content: `3` },
  ],
  correctAnswer: 'A',
  explanation: `第一年分别是3 月，6 月，8 月三个波谷，第二年分别是4 月，6 月，11 月三个波谷，答案为
A。`,
  },
  {
  id: 'd-2026-176',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据下图回答问题:某国过去11 年石油进口情况(单位:百万桶) 在石油进口量最多的那个年份里，从
中东进口的石油量与从中东以外的其他国家进口的石油量之比约为( )`,
  stemImages: ["/qbank/img_f963e10499.webp"],
  options: [
    { key: "A", content: `1:3` },
    { key: "B", content: `1:2` },
    { key: "C", content: `2:1` },
    { key: "D", content: `3:2` },
  ],
  correctAnswer: 'C',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-177',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下列图表反映了2014-2018 年中国动漫行业情况。请根据图表回答以下问题。列说法正确的是( )。`,
  stemImages: ["/qbank/img_5644c0c0fb.webp"],
  options: [
    { key: "A", content: `我国动漫产业稳步上升` },
    { key: "B", content: `2017 年中国动漫行业总产值达到1536 亿元` },
    { key: "C", content: `在线动漫市场规模近百亿` },
    { key: "D", content: `动漫产值主要来自于在线动漫` },
  ],
  correctAnswer: 'A',
  explanation: `B 项，2017 年中国动漫行业总产值达到1536 亿元，可以看到图中2017 年是1540 亿元，错误
C 项，在线动漫市场规模近百亿，可以看到图中2018 年在线动漫市场规模为111.6，超百亿，错误
D 项，动漫产值主要来自于在线动漫，可以到看图中只是一小部分是来自于在线动漫，错误A 项，
我国动漫产业稳步上升正确`,
  },
  {
  id: 'd-2026-178',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `下图反映了某地铁公司近几年的经营利润(单位:亿元)根据图表回答下列问题: 车站商务利润和客运
业务利润的同比增长率趋势( )。`,
  stemImages: ["/qbank/img_498dcf801b.webp"],
  options: [
    { key: "A", content: `一致` },
    { key: "B", content: `不一致` },
    { key: "C", content: `无法比较` },
  ],
  correctAnswer: 'B',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-179',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `A、
B、C、D 是四家数字医疗公司，由于市场前景看好，四家公司都获得了风险投资机构的青睐，而且去年全部上
市成功。但上市后，各公司经历了不同的的发展状况，具体如下表所示。截至去年年底，A、B、C、D 四家上
市公司股票市场价值跌幅最大的是(
)，跌了(
)
B、`,
  stemImages: ["/qbank/img_cbc2fac007.webp", "/qbank/img_357bd8f57b.webp"],
  options: [
    { key: "A", content: `B 公司，21%` },
    { key: "B", content: `B 公司，76%` },
    { key: "C", content: `C 公司，76%` },
    { key: "D", content: `D 公司，21%` },
  ],
  correctAnswer: 'B',
  explanation: `本题中，去年年底收盘股价＜上市当天开盘股价股票才是跌的，股票跌幅=（去年年底收盘股
价-上市当天开盘股价）÷去年年底收盘股价如图，A、B、C、D 四家上市公司中，BD 公司的股票是
跌的，B 公司跌幅=（4.5-19）/19=-76%D 公司跌幅=（3.1-3.9）/3.9=-20.5%答案为B`,
  },
  {
  id: 'd-2026-180',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下表为我国2019 年第四季度邮政总量统计表。根据图表回答下列问题。2019 年第四季度邮政业务
总量和电信业务总量相差( )亿元`,
  stemImages: ["/qbank/img_327fbb3f29.webp"],
  options: [
    { key: "A", content: `21875` },
    { key: "B", content: `22969` },
    { key: "C", content: `23719` },
    { key: "D", content: `24875` },
  ],
  correctAnswer: 'C',
  explanation: `2019 年第四季度邮政业务总量=1712.3+1795.5+1473.1=4980.92019 年第四季度电信业务总量
=9547.2+9404.8+9748.1=28700.1 相差28700.1-4980.9≈23719`,
  },
  {
  id: 'd-2026-181',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `在互联网的普及下，人们的生活方式发生了变化，对于农产品、食品、医药等消费品的选购方式也
变的越来越便利。对于网购、生鲜电商、蔬果宅配等来说，运输环节十分重要。受益于这类消费的
增长，国内冷链物流市场也快速发展。数据显示:2019 年，我国冷链物流行业的市场规模约3391 亿
元，据中商产业研究院预测，到2020 年，我国冷链物流行业市场规模将突破4000 亿元。根据材料
和图表回答下列问题。假如2016 年我国冷链物流行业市场规模同比增长了4%，那么2015 年我国冷
链物流行业市场规模约占2019 年我国冷链物流行业市场规模的( )。`,
  stemImages: ["/qbank/img_787f3ff475.webp"],
  options: [
    { key: "A", content: `63%以上` },
    { key: "B", content: `60%以下` },
    { key: "C", content: `60%-61.5%` },
    { key: "D", content: `61.5%-63%` },
  ],
  correctAnswer: 'D',
  explanation: `2016 年市场规模为2210，同比增长了4%,，那么2015 年市场规模=2210÷（1+4%）=21252019
年市场规模为3391，占比为2125/3391=62.7%，答案为D`,
  },
  {
  id: 'd-2026-182',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `根据2015-2019 年全国光伏发电量及新增光伏发电装机量图表回答下列问题。
2017 年光伏发电量同比增速处于以下哪个区间中( )`,
  stemImages: ["/qbank/img_6e8448712a.webp"],
  options: [
    { key: "A", content: `80%以上` },
    { key: "B", content: `70%以下` },
    { key: "C", content: `70%-75%` },
    { key: "D", content: `75%-80%` },
  ],
  correctAnswer: 'D',
  explanation: `2017 年发电量=1182,2016 年发电量=662，同比增长为（1182-662）÷662=78.5%，答案为D`,
  },
  {
  id: 'd-2026-183',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'medium',
  stem: `下图反映了去年4-7 月主流平台各流量来源渠道占比。请根据图表回答下列问题。搜索渠道的流量
占比为( ) %。`,
  stemImages: ["/qbank/img_58a6b44fe7.webp"],
  options: [
    { key: "A", content: `4.2` },
    { key: "B", content: `9.3` },
    { key: "C", content: `25.1` },
    { key: "D", content: `29.3` },
  ],
  correctAnswer: 'D',
  explanation: `搜索渠道包括自然搜索与付费搜索，其中自然搜索占比25.1%，付费搜索占4.2%，搜索渠道的
流量占比为25.1%+4.2%=29.3%，答案为D。`,
  },
  {
  id: 'd-2026-184',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图反映了某公司的投资情况(单位:万元)。根据图表回答下列问题: 列说法正确的是( )。`,
  stemImages: ["/qbank/img_daf5d0a5ab.webp"],
  options: [
    { key: "A", content: `第五年A 投资额占总投资额的比重为80.2%。` },
    { key: "B", content: `A 投资和B 投资在近五年间增长趋势保持一致。` },
    { key: "C", content: `近五年B 投资额增长率最高是在第三年。` },
    { key: "D", content: `近几年B 投资总额占投资总额的比重超过30%，` },
  ],
  correctAnswer: 'D',
  explanation: `A 项第五年A 投资额占总投资额的比重为116345÷169014=68.84%，错误；B 项A 投资和B 投
资在近五年间增长趋势保持一致，不须计算，第五至六年A 投资是增长的，B 是下降的，错误；C
项B 投资额增长率，第五六年是下降的不用计算，第二年=（45499-42115）÷42115=8%、第三年=
（53833-45499）÷45499=18%，第四年=（80000-53833）÷53833=48.6%，第四年最高，C 项错误；
D 项近几年B 投资总额=42115+45499+53833+80000+52669+51334=325450 ，总投资额
=110067+116936+153832+199614+169014+201684=951147，占比为325450÷951147=34%，正确。`,
  },
  {
  id: 'd-2026-185',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `随着电子商务发展和收入水平的提升，我国公民对奢侈品的需求也不断提高，实现方式也变得多样。
下列图表是我国公民当前购买奢侈品的方式和未来在奢侈品购买上的意愿。请根据图表信息，回答
相关问题。与过去12 个月相比，我国公民最愿意在哪类奢侈品上"花费更多"( )`,
  stemImages: ["/qbank/img_4561fdafd3.webp"],
  options: [
    { key: "A", content: `腕表` },
    { key: "B", content: `服装` },
    { key: "C", content: `配饰` },
    { key: "D", content: `汽车` },
  ],
  correctAnswer: 'C',
  explanation: `如图，花费更多（蓝色）部分在配饰上比例最高。答案为C`,
  },
  {
  id: 'd-2026-186',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'medium',
  stem: `下图是某公司年的产品销售情况，根据图表回答下列问题。若PC 原辅材料的销售额增加20%，其他
商品的销售额不变，则PC 原辅材料的销售额将占总销售额的( )。`,
  stemImages: ["/qbank/img_f6ac8a99bc.webp"],
  options: [
    { key: "A", content: `22%` },
    { key: "B", content: `20%` },
    { key: "C", content: `21%` },
    { key: "D", content: `23%` },
  ],
  correctAnswer: 'D',
  explanation: `PC 原辅材料的销售额增加20% 后为20%* （1+20% ）=24% ，那么总份额就变成了
15%+15%+15%+35%+24%=104%，PC 原辅材料的销售额将占总销售额的24%÷104%23%,答案为D`,
  },
  {
  id: 'd-2026-187',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `AUM 公司拥有三个销售团队，下列图表是三个销售团队上半年的销售完成情况。请根据相关图表回
答问题。上半年，销售一部的销售额比销售二部的销售额( )`,
  stemImages: ["/qbank/img_c2d35ac31a.webp"],
  options: [
    { key: "A", content: `多4200 万` },
    { key: "B", content: `基本持平` },
    { key: "C", content: `多3500 万` },
    { key: "D", content: `多4000 万` },
  ],
  correctAnswer: 'A',
  explanation: `上半年销售一部的销售额=8584+7730+8433+9240+8228+7837=50052 上半年销售二部的销
售额=7700+8157+7404+8148+7161+7225=45795 相差50052-45795=4257，答案为A`,
  },
  {
  id: 'd-2026-188',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `企业公布的财务信息反映了企业的经营和运营状况，毛利润，运营利润和净利润是通常使用到的指
标，毛利润通常是企业营业收入除去营业成本(如原材科、设备等生产成本和营业税等)后的收入，运
营利润是毛利润减去运营成本费用(如员工工资、管理费用、研发费用，销售费用、财务费用)后的收
入，净利润是企业运营利润加其他收入之后减去所得税额之后的收入。运营利润，在其他收入(营业
外收入)之前，反映了企业基本经营活动获得利润的能力。下表是CX 公司4 年内的运营信息，请根
据相关值息回答问题根据材料，下列说法错误的是( )`,
  stemImages: ["/qbank/img_d82be688a9.webp"],
  options: [
    { key: "A", content: `CX 公司第1-4 年的营收总额增长率逐年降低` },
    { key: "B", content: `CX 公司第1-4 年间的营收总额和运营总额都在增加` },
    { key: "C", content: `CX 公司第1-4 年间的营收毛利逐年增加` },
    { key: "D", content: `CX 公司的运营利润逐年增加` },
  ],
  correctAnswer: 'D',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-189',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率比较',
  difficulty: 'hard',
  stem: `M 公司的主营业务是主机游戏和在线游戏。
下图反映了近五年来M 公司主机游戏和在线游戏市场规模变化情况。根据图表回答下列问题: 在线
游戏市场规模同比增长最快的是( )`,
  stemImages: ["/qbank/img_877fb68802.webp"],
  options: [
    { key: "A", content: `第二年` },
    { key: "B", content: `第三年` },
    { key: "C", content: `第四年` },
    { key: "D", content: `第五年` },
  ],
  correctAnswer: 'B',
  explanation: `同比增长=（后一年-前一年）÷前一年
第2 年同比增长=（13-8）÷8=62.5%
第3 年同比增长=（25-13）÷13=92%
第4 年同比增长=（44-25）÷25=76%
第5 年同比增长=（51-44）÷44=16%答案为B。`,
  },
  {
  id: 'd-2026-190',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率比较',
  difficulty: 'hard',
  stem: `A 和B 是人们普遍选择的两款共享单车APP。下面统计了两个APP 近4 个月用户变化情况。请根据
下列图表回答问题: 列关于A 的指标，近4 个月增速最快的是:`,
  stemImages: ["/qbank/img_4195d2596a.webp"],
  options: [
    { key: "A", content: `总用户量` },
    { key: "B", content: `独占用户量` },
    { key: "C", content: `重合用户量` },
    { key: "D", content: `不能比较` },
  ],
  correctAnswer: 'C',
  explanation: `A 指标近4 个月增速最快，也就是（4 月-1 月）÷1 月。总用户量=（360-106）÷106=240%独
占用户量=（229-89）÷89=160%重合用户量=（131-17）÷17=670%答案为C`,
  },
  {
  id: 'd-2026-191',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `2019 年北京首都国际机场旅客、货邮吞吐量和起降架次同比分别增长1.5%、4.4%、-1.5%:
香港国际机场分别增长2.5%、1.7%和1.5%;
上海浦东国际机场分别增长2%、5%和4%;
广州白云国际机场同比增长均为6%，以下图表是2019 年我国四大机场吞吐量统计图表:根据题干以
及图表回答下列问题: 2019 年起降架次同比负增长的是( )`,
  stemImages: ["/qbank/img_e02cdf6acd.webp"],
  options: [
    { key: "A", content: `北京首都` },
    { key: "B", content: `香港国际` },
    { key: "C", content: `上海浦东` },
    { key: "D", content: `广州白云` },
  ],
  correctAnswer: 'A',
  explanation: `题干中，2019 年北京首都国际机场起降架次同比增长-1.5%，答案为A`,
  },
  {
  id: 'd-2026-192',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `HDC 是以生产和经营化妆品为主的公司。产品分为彩妆类和护肤类两大系列。下表是HDC 公司某年
1-7 月份的产品销售情况。请根据图表信息回答问题。7 月份，护肤类化妆品销售额同比增加( )万`,
  stemImages: ["/qbank/img_cddb078fe9.webp"],
  options: [
    { key: "A", content: `300` },
    { key: "B", content: `283` },
    { key: "C", content: `275` },
    { key: "D", content: `264` },
  ],
  correctAnswer: 'B',
  explanation: `如图，7 月份，护肤类化妆品销售额=2601 万，同比增长12.2%，那么增长前为2601÷（1+12.2%）
=2318，增长了2601-2318=283 万元`,
  },
  {
  id: 'd-2026-193',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据2020 年3 -12 月中国微波炉出口量及金额增长情况回答下列问题列选项能正确反映2020 年
3-12 月中国微波炉各季度出口量顺序的是( )`,
  stemImages: ["/qbank/img_ba4b9042cb.webp"],
  options: [
    { key: "A", content: `三季度>四季度>二季度` },
    { key: "B", content: `四季度>三季度>二季度` },
    { key: "C", content: `三季度<四季度<二季度` },
    { key: "D", content: `四季度<三季度<二季度` },
  ],
  correctAnswer: 'A',
  explanation: `仔细观察上图，三季度>四季度>二季度，所以选择A。`,
  },
  {
  id: 'd-2026-194',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下表是2016 年第一季度到2017 年第二季度旅游行业市场交易规模和结构(单位:亿元;%)。根据图表回
答下列问题: 2016 年旅游行业市场交易规模增长率呈现( )趋势。`,
  stemImages: ["/qbank/img_0ee74187f1.webp"],
  options: [
    { key: "A", content: `持续下降` },
    { key: "B", content: `先下降后上升` },
    { key: "C", content: `持续上升` },
    { key: "D", content: `先上升后下降` },
  ],
  correctAnswer: 'D',
  explanation: `算出2016 年4 季度间的交易规模增长率。
2016Q1-Q2=（1410.4-1326.5）/1326.5=6.3%
2016Q2-Q3=（1689.6-1410.4）/1410.4=19.8%
2016Q3-Q4=（1516.2-1689.6）/1689.6=-10.1%
先上升后下降，答案为D`,
  },
  {
  id: 'd-2026-195',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'easy',
  stem: `用户自主安装PC/平板游览器市场份额情况以下说法正确的是( )`,
  stemImages: ["/qbank/img_04fc521f66.webp"],
  options: [
    { key: "A", content: `用户安装的手机浏览器只包括表上列举的那几种` },
    { key: "B", content: `两年间，图上列出的6 种手机浏览器在市场上的总份额没有发生变化` },
    { key: "C", content: `两年间，有4 款手机浏览器在市场份额上的变化幅度是一样的` },
  ],
  correctAnswer: 'C',
  explanation: `C 项，有4 款手机浏览器在市场份额上的变化幅度是一样的，幅度也就是不考虑正负，那有三种游览器市场
份额上升了1%（360、遨游、世界之窗），有一种下降了1%（搜狗），一共四种，选项C 正确。`,
  },
  {
  id: 'd-2026-196',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率比较',
  difficulty: 'easy',
  stem: `下图反映了近几年某件商品的售价、总成本和某一原料成本的变化情况(单位:元)。根据图表回答下列问题:
第二
年，商品的售价、总成本和某一原料成本增长率最高的是( )。`,
  stemImages: ["/qbank/img_4a086563f5.webp"],
  options: [
    { key: "A", content: `商品售价` },
    { key: "B", content: `总成本` },
    { key: "C", content: `某一原料成本` },
  ],
  correctAnswer: 'C',
  explanation: `考察增长率，带公式进去计算就行`,
  },
  {
  id: 'd-2026-197',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `增长率= （第二年-第一年）/ 第一年
下图反映了近四年6 月某市保费收入变化情况(单位:万元)。根据图表回答下列问题:
以下选项中，与上一年同期相比增幅最大的是( )。`,
  stemImages: ["/qbank/img_4fc2869e39.webp"],
  options: [
    { key: "A", content: `第三年6 月财产险保费收入` },
    { key: "B", content: `第三年6 月人身险保费收入` },
    { key: "C", content: `第四年6 月财产险保费收入` },
    { key: "D", content: `第四年6 月人身险保费收入` },
  ],
  correctAnswer: 'A',
  explanation: `A 项，第三年6 月财产险保费同比增幅=（586-476）/476=23.1%
B 项，第三年6 月人身险保费同比增幅=（1595-1504）/1504=6.1%
C 项，第四年6 月财产险保费同比增幅=（678-586）/586=15.7%
D 项，第四年6 月人身险保费同比增幅=（1802-1595）/1595=13%
A 项第三年6 月财产险保费同比增幅最大。`,
  },
  {
  id: 'd-2026-198',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'medium',
  stem: `用户自主安装PC/平板游览器市场份额情况第一年,用户自主安装的PC/平板浏览器中，前两名的市
场份额之和为( )`,
  stemImages: ["/qbank/img_1dea526a1e.webp"],
  options: [
    { key: "A", content: `42.5%` },
    { key: "B", content: `43%` },
    { key: "C", content: `48%` },
    { key: "D", content: `66%` },
  ],
  correctAnswer: 'B',
  explanation: `如图，橙色部分的前两名市场份额为24%和19%，24%+19%=43%`,
  },
  {
  id: 'd-2026-199',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `一路平安汽车销售公司去年各分店及去年1-4 季度汽车销售情况如下所示: 如果单个季度的汽车销
售量超过了150 辆,那么可以拿到厂商1000 元/辆的额外补贴,那么去年全年，总计拿了( )万补贴`,
  stemImages: ["/qbank/img_34691fa3f0.webp"],
  options: [
    { key: "A", content: `101.9` },
    { key: "B", content: `1019` },
    { key: "C", content: `3010.9` },
    { key: "D", content: `30109` },
  ],
  correctAnswer: 'A',
  explanation: `如图，每个季度的汽车销售量都超过了150 辆，那么可以拿到补贴的车辆数
=210+230+274+305=1019 辆，每辆补贴1000 元，共补贴1019*1000=1019000 千元=101.9 万元，
答案为A`,
  },
  {
  id: 'd-2026-200',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `A 公司某年度16 个产品的发货情况及产品的不同发货量占总发货量的比例根据图表，回答下列问题。
如果总销量第二年增长20%，则第二年的总销量可达约( )万件。`,
  stemImages: ["/qbank/img_17ccb8d0be.webp"],
  options: [
    { key: "A", content: `70` },
    { key: "B", content: `71` },
    { key: "C", content: `80` },
    { key: "D", content: `81` },
  ],
  correctAnswer: 'D',
  explanation: `16 个产品的发货件数=14+12+5+3+2+1.4+1.2+1+10+7+4+2+1.7+1.3+1.2+0.9=67.7 万件总
销量第二年增长20%，那么第二年的总销量=67.7*（1+20%）=81 万件
201-250`,
  },
  {
  id: 'd-2026-201',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'hard',
  stem: `下表是TT 公司某年的销售报表，公司共有销售一部、二部和三部三个销售团队。请根据下表回答问
题。前一年，该公司销售总额为:( )`,
  stemImages: ["/qbank/img_84359a4a04.webp"],
  options: [
    { key: "A", content: `636463 万元` },
    { key: "B", content: `592610 万元` },
    { key: "C", content: `573750 万元` },
    { key: "D", content: `765879 万元` },
  ],
  correctAnswer: 'B',
  explanation: `今年的销售总额=58332+271392+306739=636463，比去年增长7.4%，那么去年的销售总额
=636463÷（1-7.4%）=592610`,
  },
  {
  id: 'd-2026-202',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '平均数计算',
  difficulty: 'hard',
  stem: `五年间，该高校平均对每个贫困学生的资助增长趋势是:`,
  stemImages: ["/qbank/img_e12aa3cf64.webp"],
  options: [
    { key: "A", content: `一直上升` },
    { key: "B", content: `一直下降` },
    { key: "C", content: `先下降再上升` },
    { key: "D", content: `先上升再下降` },
  ],
  correctAnswer: 'C',
  explanation: `五年间，高校平均对每个贫困学生的资助额为：第一年6605.4÷5.4≈1223 、第二年
9202.81÷8.7≈1058 、第三年10406.65÷9.8≈1062 、第四年12103.03÷10.7≈1131 、第五年
10588.61÷9.1≈1164，第1 年-第2 年下降，排除AD；第3 年-第4 年上升，排除B。所以选择C。`,
  },
  {
  id: 'd-2026-203',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `根据某年1-7 月集成灶线下零售情况统计图回答下列问题该年3 月集成灶线下零售量环比增幅在以
下哪个区间( )`,
  stemImages: ["/qbank/img_b2adf2fcf5.webp"],
  options: [
    { key: "A", content: `600%以上` },
    { key: "B", content: `580%-600%` },
    { key: "C", content: `550%以下` },
    { key: "D", content: `550%-570%` },
  ],
  correctAnswer: 'B',
  explanation: `集成灶3 月零售量=21.6,2 月零售量=3.1，环比增幅=（21.6-3.1）÷3.1≈596.8%`,
  },
  {
  id: 'd-2026-204',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `2015-2019 年全国生猪出栏量情况及国内猪肉产量占肉类总产量的比例情况现已知2015 年全国生
猪出栏量同比下降了8%，那么2015 年全国生猪出栏量同2014 年相比约( )万头。`,
  stemImages: ["/qbank/img_ce9c2634c4.webp"],
  options: [
    { key: "A", content: `增加了5676` },
    { key: "B", content: `减少了6666` },
    { key: "C", content: `减少了6159` },
    { key: "D", content: `增加了5875` },
  ],
  correctAnswer: 'C',
  explanation: `2015 年生猪出栏量=70825，同比下降8%，那么2014 年生猪出栏量=70825÷（1-8%）
=769842015-2014=70825-76984=-6159`,
  },
  {
  id: 'd-2026-205',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'hard',
  stem: `下图为某生产商生产的两种化妆品在某地区最近五年的销售数量变化图,根据图表回答下列问题。化
妆品A 的第五年的销售额约占其五年销售额的( )。`,
  stemImages: ["/qbank/img_d04cff2e86.webp"],
  options: [
    { key: "A", content: `12%` },
    { key: "B", content: `26%` },
    { key: "C", content: `25%` },
    { key: "D", content: `23%` },
  ],
  correctAnswer: 'B',
  explanation: `解析: 化妆品A 第五年的销售额=21000，
五年来销售总额=9000+15000+16000+20000+21000=81000 占比为21000/81000=25.9%约26%`,
  },
  {
  id: 'd-2026-206',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下表是某年某连锁店在各地的消费人次和销售额情况(单位:千人;元)。根据表格回答下列问题: A、B、
C 和D 地区的人均消费依次呈现( )的趋势。`,
  stemImages: ["/qbank/img_0fc519fbc4.webp"],
  options: [
    { key: "A", content: `先下降后上升` },
    { key: "B", content: `先上升后下降` },
    { key: "C", content: `下降` },
    { key: "D", content: `上升` },
  ],
  correctAnswer: 'A',
  explanation: `人均消费= 销售额÷ 消费人次A 地区=165÷95.64=1.73B 地区=150÷89.45=1.68C 地区
=154÷108.57=1.42D 地区=97÷60=1.62 答案为A`,
  },
  {
  id: 'd-2026-207',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `HOC 公司过去10 年间的销售额及其增长速度列说法不符合上图的是哪一项?`,
  stemImages: ["/qbank/img_a28dac63e0.webp"],
  options: [
    { key: "A", content: `近年来该公司销售额持续增加` },
    { key: "B", content: `该公司年销售额自成立以来始终保持在3000 万元以上` },
    { key: "C", content: `该公司现在的销售额达到了第二年的两倍以上` },
    { key: "D", content: `该公司第七年和第八年销售额增速同比上年度有所放缓` },
  ],
  correctAnswer: 'B',
  explanation: `如图，销售额持续增加，A 项正确；C 项该公司现在的销售额达到了第二年的两倍以上，现在
的销售额=6528.72，第二年的销售额=2587,6528.72÷2587=2.5，C 项正确；D 项该公司第七年和第
八年销售额增速同比上年度有所放缓，第七八年增速为12%，第六年为13%，D 项正确；B 项，该公
司年销售额自成立以来始终保持在3000 万元以上，第二三四年不是，B 项错误。`,
  },
  {
  id: 'd-2026-208',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `QOS 公司为一家广告制作公司，去年该公司盈利状况如下图所示，根据下表回答问题。该公司最新
报告显示，12 月该公司实际利润139.2 万元，上一年12 月该公司实际利润为( )
万元`,
  stemImages: ["/qbank/img_79f7675190.webp"],
  options: [
    { key: "A", content: `107.6` },
    { key: "B", content: `40.9` },
    { key: "C", content: `92.8` },
    { key: "D", content: `101.5` },
  ],
  correctAnswer: 'A',
  explanation: `上一年12 月该公司实际利润=139.12÷（1+29.4%）=107.6`,
  },
  {
  id: 'd-2026-209',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `GK 公司过去五年里各产品创造的销售额如下表所示，请根据图表信息回答问题: 公司第二年家具的
销售额相对于第一年增长了( )。`,
  stemImages: ["/qbank/img_aabbddc32d.webp"],
  options: [
    { key: "A", content: `10.00%` },
    { key: "B", content: `8.60%` },
    { key: "C", content: `9.58%` },
    { key: "D", content: `11.20%` },
  ],
  correctAnswer: 'A',
  explanation: `（第二年-第一年）÷第一年（18536-16855）÷16855≈10%`,
  },
  {
  id: 'd-2026-210',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'hard',
  stem: `9 月份,几种主要工业产品的生产和增长情况如下表所示。请根据相关信息，回答问题。去年9 月份，
蚕丝及机织物的产量与天然原油比:( )`,
  stemImages: ["/qbank/img_0b9a31a7c6.webp"],
  options: [
    { key: "A", content: `约多4555 万吨` },
    { key: "B", content: `约多3380 万吨` },
    { key: "C", content: `约多3438 万吨` },
    { key: "D", content: `约多3480 万吨` },
  ],
  correctAnswer: 'C',
  explanation: `如图，天然原油今年9 月份产量=1774，比去年同期增长2.7%，那么去年9 月份天然原油的产
量=1774÷（1+2.7%）=1727；同理，蚕丝及机织物今年9 月份产量=5299.9，比去年同期增长2.6%，
那么去年9 月份蚕丝及机织物的产量=5299.9÷（1+2.6%）=51655165-1727=3438，答案为C`,
  },
  {
  id: 'd-2026-211',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'easy',
  stem: `移动互联网带来的便利条件给网络教育注入新的活动。移动教育当前处于方兴未艾的阶段,各地区的
发展不一,具体如下，请根据图表中的信息，回答问题。细分类型移动教育应用用户城市分布中，在
一线城市中占比最大的类型是( )`,
  stemImages: ["/qbank/img_f37525f7fa.webp"],
  options: [
    { key: "A", content: `早教` },
    { key: "B", content: `K12` },
    { key: "C", content: `教育工具` },
    { key: "D", content: `语言学习` },
  ],
  correctAnswer: 'D',
  explanation: `如图，细分教育分布情况，蓝色的为一线城市，语言学习为22%，最大，答案为D`,
  },
  {
  id: 'd-2026-212',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率比较',
  difficulty: 'hard',
  stem: `下表反映了近四年某公司四个厂每年新招的员工人数情况(单位:人)。已知最初四个厂的人均为120
人。根据表格回答下列问题: 后一年与的一年相比较，B 厂的员工总人数增长率呈现( )的趋势。`,
  stemImages: ["/qbank/img_dde41170e9.webp"],
  options: [
    { key: "A", content: `持续下降` },
    { key: "B", content: `持续上升` },
    { key: "C", content: `先上升后下降` },
    { key: "D", content: `先下降后上升` },
  ],
  correctAnswer: 'A',
  explanation: `增长率=（后一年-前一年）÷前一年第一年至第二年=（200-120）÷120=67%第二年至第三年
=（290-200）÷200=45%第三年至第四年=（320-290）÷290=10%持续下降，答案为A`,
  },
  {
  id: 'd-2026-213',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'hard',
  stem: `下表是2019 年第一季度2020 年第一季度第三方移动交易规模和结构(单位:亿万元;%)。根据图表回答
下列问题: 在五个季度中个人应用的交易规模最大的是( )。`,
  stemImages: ["/qbank/img_9e48147893.webp"],
  options: [
    { key: "A", content: `2019 年第一季度` },
    { key: "B", content: `2019 年第二季度` },
    { key: "C", content: `2019 年第四季度` },
    { key: "D", content: `2020 年第一季度` },
  ],
  correctAnswer: 'D',
  explanation: `个人应用的交易规模=交易规模*个人应用占比2019 年第一季度=55.4*61.3%=33.962019 年第
二季度=55*57.9%=31.852019 年第三季度=56*55.3%=30.972019 年第四季度=59.8*55.3%=33.072020
年第一季度=56.7*60.8%=34.47 答案为D`,
  },
  {
  id: 'd-2026-214',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率比较',
  difficulty: 'hard',
  stem: `根据2020 年3-12 月中国水海产品出口情况回答下列问题2020 年3-12 月中国水海产品每月出口量
与上个月相比的同比增长率由高到低排序正确的是( )`,
  stemImages: ["/qbank/img_dbc2c2e6cc.webp"],
  options: [
    { key: "A", content: `6 月>7 月>9 月>11 月` },
    { key: "B", content: `11 月>9 月>7 月>6 月` },
    { key: "C", content: `09 月>7 月>6 月>11 月` },
    { key: "D", content: `7 月>11 月>6 月>9 月` },
  ],
  correctAnswer: 'B',
  explanation: `选项中只有6、7、9、11 四个月，所以只算这四个月与上个月相比的同比增长率就可以。同比
增长率=（本月-上月）/上月6 月=（30-32）/32=-6.25%7 月=（31-30）/30=3.3%9 月=（33-30）/30=10%11
月=（39-32）/32=21.9%11 月＞9 月＞7 月＞6 月，答案为B`,
  },
  {
  id: 'd-2026-215',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下表是A 公司竞争态势的分析表，图中S 代表公司的经营优势，W 代表经营劣势,
O 代表经营机会, T 代表经营威胁，根据图表回答问题。对于A 公司来说，最大的经营优势是( )。`,
  stemImages: ["/qbank/img_6f71509c30.webp"],
  options: [
    { key: "A", content: `品牌形象佳` },
    { key: "B", content: `人才优势` },
    { key: "C", content: `产品质量优秀` },
    { key: "D", content: `售后完备` },
  ],
  correctAnswer: 'C',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-216',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `根据2015-2019 年全国生猪出栏量情况和2015-2019 年国内猪肉产量占肉类总产量的比例情况图回
答下列问题。由于"非洲猪瘟"影响，2019 年全国生猪出栏量明显下降,国家为了稳定猪肉价格,大力
推进生猪养殖，从2020 年起全国生猪出栏量每年按照10%的速度增长,问到( )年全国生猪出栏量超过
2015 年水准。`,
  stemImages: ["/qbank/img_e9d71e56ad.webp"],
  options: [
    { key: "A", content: `2025` },
    { key: "B", content: `2024` },
    { key: "C", content: `2023` },
    { key: "D", content: `2022` },
  ],
  correctAnswer: 'D',
  explanation: `如图2015 年生猪出栏量=70825，2015 年生猪出栏量=54419，从2020 年起全国生猪出栏量每
年按照10%的速度增长。那么2020 年生猪出栏量=54419*（1+10%）=59860.92021 年生猪出栏量
=598609*（1+10%）=65846.992022年生猪出栏量=65846.99*（1+10%）=72431.68972431.689＞70825，
答案为D`,
  },
  {
  id: 'd-2026-217',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下表是近五年电视制作的情况。请根据图表信息，回答相关问题。第三年国产电视剧播出部数约占
当年电视剧播出部数的( )。`,
  stemImages: ["/qbank/img_d403a62b8a.webp"],
  options: [
    { key: "A", content: `25.0%` },
    { key: "B", content: `2.6%` },
    { key: "C", content: `97.0%` },
    { key: "D", content: `75.0%` },
  ],
  correctAnswer: 'C',
  explanation: `如图，第三年电视剧播出部数=247100，其中进口电视剧播出部数=6377，那么国产电视剧播
出部数=247100-6377=240723；国产电视剧播出部数占当年电视剧播出部数的240723÷247100=97%`,
  },
  {
  id: 'd-2026-218',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'hard',
  stem: `BM 公司是一家生物医药类的公司。9-12 月份,总部和三个分部的销售情况如下表所示。请根据图表
信息,回答相关问题。12 月份,如果四个部门的总收入同比增长了12%,则去年12 月份的总收入为( )
元`,
  stemImages: ["/qbank/img_951227eef1.webp"],
  options: [
    { key: "A", content: `5987968` },
    { key: "B", content: `5400382` },
    { key: "C", content: `4864272` },
    { key: "D", content: `4773571` },
  ],
  correctAnswer: 'D',
  explanation: `如图今年12 月份的总收入为534.64 万元，同比增长就是比去年增长了12%，那么去年的总收
入=534.64÷（1+12%）=477.3571 万元，问题问的是多少元，477.3571 万元=4773571 元`,
  },
  {
  id: 'd-2026-219',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '平均数计算',
  difficulty: 'easy',
  stem: `RT 零售商在过去5 年投入了大量的精力、财力来扩展店铺数量。下表是RT 零售商过去5 年的扩张
情况，请根据相关信息,回答问题。RT 零告商5 年内，店铺年平均收入一直在降低。该说法( )`,
  stemImages: ["/qbank/img_1f032999a6.webp"],
  options: [
    { key: "A", content: `正确` },
    { key: "B", content: `错误` },
    { key: "C", content: `不能判断` },
  ],
  correctAnswer: 'B',
  explanation: `总收入除店铺数，都计算一下，并不是一直降低`,
  },
  {
  id: 'd-2026-220',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `手机厂商在双十一期间，往往会提供比较理想的折扣来吸引消费者。根据天猫平台某年的双十一数据，我们获得了
以下信息。请根据图表中的信息，回答问题。华为手机品牌销售量排行为第(
)`,
  stemImages: ["/qbank/img_6551c2f5de.webp"],
  options: [
    { key: "A", content: `1` },
    { key: "B", content: `2` },
    { key: "C", content: `3` },
    { key: "D", content: `4` },
  ],
  correctAnswer: 'B',
  explanation: `如图，华为手机品牌销售量排行为第二`,
  },
  {
  id: 'd-2026-221',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `2019 年北京首都国际机场旅客、货邮吞吐量和起降架次同比分别增长1.5%、4.4%、-1.5%:
香港国际机场分别增长2.5%、1.7%和1.5%;上海浦东国际机场分别增长2%、5%和4%;广州白云国际机
场同比增长均为6%，以下图表是2019 年我国四大机场吞吐量统计图表:根据题干以及图表回答下列
问题: 2018 年我国四大机场旅客吞吐量排名第二的是( ) .`,
  stemImages: ["/qbank/img_e02cdf6acd.webp"],
  options: [
    { key: "A", content: `北京首都` },
    { key: "B", content: `香港国际` },
    { key: "C", content: `上海浦东` },
    { key: "D", content: `广州白云` },
  ],
  correctAnswer: 'B',
  explanation: `2019 年北京、香港、上海、广州旅客吞吐量同比增长分别为1.5%、2.5%、2%、6%2018 年北京
旅客吞吐量=9578.6/（1+1.5%）=94372018 年香港旅客吞吐量=7470/（1+2.5%）=72882018 年上海
旅客吞吐量=7405.4/（1+2%）=72602018 年广州旅客吞吐量=7000/（1+6%）=6604 排名第二是香港`,
  },
  {
  id: 'd-2026-222',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图反映了近几年某公司四种产品的销售额情况(单位:万元)。根据图表回答下列问题: 第五年销售额
增幅最大的产品是( )。`,
  stemImages: ["/qbank/img_932c751b3f.webp"],
  options: [
    { key: "A", content: `A 产品` },
    { key: "B", content: `B 产品` },
    { key: "C", content: `C 产品` },
    { key: "D", content: `D 产品` },
  ],
  correctAnswer: 'D',
  explanation: `第五年A 产品销售额增幅=（2061-1853.73）÷1853.73=11.2%B 产品=（2527-2435.56）
÷2435.56=3.75%C 产品=（167-148.09）÷148.09=12.77%D 产品=（398-323.24）÷323.24=23%`,
  },
  {
  id: 'd-2026-223',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `根据图表:（某段时间内我国的医疗器材进出口状况），回答下面问题今年1-3 月，我国医疗器材累
计出口额为( )百万美元。`,
  stemImages: ["/qbank/img_346fafdf0f.webp"],
  options: [
    { key: "A", content: `1106` },
    { key: "B", content: `1180` },
    { key: "C", content: `1684` },
    { key: "D", content: `1784` },
  ],
  correctAnswer: 'A',
  explanation: `如图，今年3 月累计出口额=1106`,
  },
  {
  id: 'd-2026-224',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '比重分析',
  difficulty: 'easy',
  stem: `下图反映了2016-2019 年中国劳动力人力数量及三大产业就业人员占比情况。请根据图表回答以下
问题。三大产业就业人员占比差距最小的是( )年。`,
  stemImages: ["/qbank/img_d93b822ace.webp"],
  options: [
    { key: "A", content: `2016` },
    { key: "B", content: `2017` },
    { key: "C", content: `2018` },
    { key: "D", content: `2019` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-225',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下表反映了近四年某公司四个厂每年新招的员工人数情况(单位:人)。已知最初四个厂的人均为120
人。根据表格回答下列问题: 列说法正确的是( )`,
  stemImages: ["/qbank/img_f45511f6da.webp"],
  options: [
    { key: "A", content: `该公司盈利情况不乐观` },
    { key: "B", content: `从员工增长率来看，近四年公司对劳动力型员工需求增多` },
    { key: "C", content: `四个厂均面临裁员风险。` },
    { key: "D", content: `该公司进入稳定发展阶段。` },
  ],
  correctAnswer: 'D',
  explanation: `A 项错误，盈利情况不乐观就不会持续招新员工了；BC 项无法从图表中判断，排除；D 项正确。`,
  },
  {
  id: 'd-2026-226',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `根据2020 年4-12 月中国中央处理部件进口量及金额增长情况回答下列问题列说法错误的是( )`,
  stemImages: ["/qbank/img_53847c4a82.webp"],
  options: [
    { key: "A", content: `2020 年下半年中国中央处理部件累计进口量不超过500 万台` },
    { key: "B", content: `2020 年中国中央处理部件最高进口金额与最低进口金额相差120 百万美元` },
    { key: "C", content: `2020 年9 月份中国中央处理部件的进口价格最高` },
    { key: "D", content: `2020 年4-12 月中国中央处理部件进口金额超过150 百万美元的月份有5 个` },
  ],
  correctAnswer: 'A',
  explanation: `A 项2020 年下半年中国中央处理部件累计进口量=65+77+98+82+90+109=521，错误；B 项
2020 年中国中央处理部件最高进口金额=235，最低进口金额=115，相差120 正确；C 项正确；D 项，
正确，分别是4、8、9、11、12 月。`,
  },
  {
  id: 'd-2026-227',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据图表（某企业产品的销售情况）回答下面问题: 在不考虑其他成本的情况下，每销售一个A 产品
或B 产品，两个产品的利润相比:`,
  stemImages: ["/qbank/img_26b8f005f7.webp"],
  options: [
    { key: "A", content: `A 产品更大` },
    { key: "B", content: `B 产品更大` },
    { key: "C", content: `A.、B 一样大` },
    { key: "D", content: `不确定` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-228',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图对比了某公司近两年各职级的薪酬水平。其中一、二
级为初级，三、四、五级为中级，六、七级为高级。请根据图表回答下列问题: 薪酬同比增幅最大的
岗位职级是( )`,
  stemImages: ["/qbank/img_6d051bb3ae.webp"],
  options: [
    { key: "A", content: `初级` },
    { key: "B", content: `中级` },
    { key: "C", content: `高级` },
    { key: "D", content: `不能比较` },
  ],
  correctAnswer: 'A',
  explanation: `初级同比：一级：（8.89-7）÷7×100%=27，二级：（13-10）÷10×100%=30；
中级同比：三级：（16.8-15）÷15×100%=12，四级：（23-20）÷20×100%=15，五级：（36-30）÷30×100%=20；
高级同比：六级：（50.16-44）÷44×100%=14，七级：（70.4-64）÷64×100%=10 因此，初级27+30=57，
中级12+15+20=47，高级14+10=24，薪酬同比增幅最大的岗位职级是初级，选择A`,
  },
  {
  id: 'd-2026-229',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `根据2020 年1-9 月海南省饮料生产及增长情况回答下列问题2020 年1-9 月海南省饮料生产累计产
量达( )万吨`,
  stemImages: ["/qbank/img_b64172887d.webp"],
  options: [
    { key: "A", content: `62.43` },
    { key: "B", content: `50.72` },
    { key: "C", content: `58.51` },
    { key: "D", content: `49.76` },
  ],
  correctAnswer: 'C',
  explanation: `7.5+5+6.76+7.02+8.47+8.39+7.36+8.01=58.51`,
  },
  {
  id: 'd-2026-230',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下表是AMA 公司上市以来的员工数量及变化情况。请根据下表回答问题。上市以来，AMA 公司员
工留任率最高的一年是:（）`,
  stemImages: ["/qbank/img_03d968fa5c.webp"],
  options: [
    { key: "A", content: `第一年` },
    { key: "B", content: `第二年` },
    { key: "C", content: `第四年` },
    { key: "D", content: `第五年` },
  ],
  correctAnswer: 'B',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-231',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `SUV 是一种拥有旅行车般的空间，配以货卡车的越野能力的车型。按照车身的长度，SUV 可以分为
小型，紧凑型、中型、中大型和大型，小型SUV 车长通常不超过4 米，大型SUV 车长通常在5 米以
上。我们通过调查当前汽车消费者的汽车拥有情况，获得了以下信息，请根据相关信息，回答问题。
如果这次有效调查数据为1500，则选择购买紧凑型SUV 的人数有（）人`,
  stemImages: ["/qbank/img_55239cd922.webp"],
  options: [
    { key: "A", content: `326` },
    { key: "B", content: `485` },
    { key: "C", content: `633` },
    { key: "D", content: `773` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-232',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'medium',
  stem: `下列图表是我国2 月份全社会客货运输量的信息。请根据图表相关信息，回答问题。单纯地从量来
看，去年2 月份，运输量最大的是（）`,
  stemImages: ["/qbank/img_316323087f.webp"],
  options: [
    { key: "A", content: `民航货运量` },
    { key: "B", content: `铁路客运量` },
    { key: "C", content: `铁路货运量` },
    { key: "D", content: `水运货运量` },
  ],
  correctAnswer: 'D',
  explanation: `铁路去年（2.77）/（1-0.0153）= 2.77
水运去年5.42/（1+0.04）= 5.21
民航就不算了，单位不一样，明显最小`,
  },
  {
  id: 'd-2026-233',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '基期量',
  difficulty: 'easy',
  stem: `生产价格指数(PPI)
反映某类产品当前的价值相对于某一年(基期，如去年)价值的变化幅度，计算公式通常为:
(一组固定商品当期的生产价格/组固定商品按基期的生产价格)
*100，如果某类商品的生产价格指数为1.03，则表明此商品当期的生产价格是基期价格的1.03 倍。
下表反映了我国某年8 月份，主要农作物商品的生产价格指数。基于图表信息综合来看，哪个地区
的农产品最贵?`,
  stemImages: ["/qbank/img_154744e3c0.webp"],
  options: [
    { key: "A", content: `辽宁省` },
    { key: "B", content: `四川省` },
    { key: "C", content: `吉林省` },
    { key: "D", content: `无法判断` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-234',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `3S 集团是一家电子科技公司，其产品深受广大用户的喜爱，上市6 年来公司营业额和资产总额都发
生了显著变化。截止第六年年底，大中华区营业额达到10670 万美元，比上年增加106 万;北美区营
业额为576 万美元，同比减少17 万;欧洲区营业额为1271 万美元，同比增加139 万:东南亚区营业总
额为193 万美元，同比增加13 万元。就公司资产总额而言，大中华区公司资产总额达到52850 万美
元，比上年增加2690 万，增加5.4%。
北美区公司资产总额为750 万美元，比上一年减少1.6%。
欧洲区公司资产总额为2950 万美元，增加14.8%。东南亚区公司资产总额为330 万美元，增加6.7%。
如图可知，该公司上市第一年大中华区资产总额约比第六年少（）万美元`,
  stemImages: ["/qbank/img_ea3988d065.webp"],
  options: [
    { key: "A", content: `6030` },
    { key: "B", content: `5903` },
    { key: "C", content: `7090` },
    { key: "D", content: `9780` },
  ],
  correctAnswer: 'D',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-235',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图反映C 饭店上周的顾客数量及营业额情况。请根据图表回答下列问题: 周五到周天的营业额增长
速度呈（）趋势。`,
  stemImages: ["/qbank/img_9fdc0fecac.webp"],
  options: [
    { key: "A", content: `先增大后减小` },
    { key: "B", content: `逐年减小` },
    { key: "C", content: `总体减小` },
    { key: "D", content: `先减小后增大` },
  ],
  correctAnswer: 'D',
  explanation: `周五营业额增长率:（1100-603）/603*100%=82.42%
周六营业额增长率:（1250-1100）/1100*100%=13.64
周天营业额增长率:（1700-1250）/1250*100%=36%
选择D 先减小后增大。`,
  },
  {
  id: 'd-2026-236',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下图为某生产商生产的两种化妆品在某地区最近五年的销售数量变化图，根据图表回答下列问题。
化妆品A 的第五年的销售额约占其五年销售额的（）。`,
  stemImages: ["/qbank/img_7c7438ec97.webp"],
  options: [
    { key: "A", content: `12%` },
    { key: "B", content: `26%` },
    { key: "C", content: `25%` },
    { key: "D", content: `23%` },
  ],
  correctAnswer: 'B',
  explanation: `21000÷（9000+15000+16000+20000+21000）≈26%，选择B。`,
  },
  {
  id: 'd-2026-237',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下表反映了某年某公司某种产品的销量、销售额以及单个产品成本的情况。根据图表回答下列问题:
盈利最高的是第（）个季度。`,
  stemImages: ["/qbank/img_aea59f6efd.webp"],
  options: [
    { key: "A", content: `1` },
    { key: "B", content: `2` },
    { key: "C", content: `3` },
    { key: "D", content: `4` },
  ],
  correctAnswer: 'D',
  explanation: `第一季度盈利:15480-430×25=4730;
第二季度盈利:15000-375×26=5250;
第三季度盈利:17052-406×28=5684;
第四季度盈利:16682-439×25=5707
所以选择D`,
  },
  {
  id: 'd-2026-238',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `10 月份，几个不同移动教育应用呈现出了不同的覆盖率和活跃率，具体如下。请根据图表信息，回
答问题。10 月份不同移动教育应用中，活跃率与覆盖率之比最大的是（）`,
  stemImages: ["/qbank/img_3c1165934d.webp"],
  options: [
    { key: "A", content: `作业帮` },
    { key: "B", content: `阿凡题` },
    { key: "C", content: `纳米盒` },
    { key: "D", content: `我要当学霸` },
  ],
  correctAnswer: 'B',
  explanation: `活跃率比覆盖率，即橙色比蓝色柱:
作业帮= 1.3% / 2.9% < 0.5
阿凡题= 1.4% / 2.4% > 0.5
纳米盒= 0.3% / 0.6% = 0.5
我要当学霸= 0.1% / 0.2% = 0.5
阿凡题最高，所以选项为B。`,
  },
  {
  id: 'd-2026-239',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `下图反应了2019 年社会消费品零售总额及增速情况月度数据。根据图表回答下列问题。当月实现社会消费品零售
总额超过的3.5 万亿的月份有（
）个。`,
  stemImages: ["/qbank/img_194ccd238a.webp"],
  options: [
    { key: "A", content: `0` },
    { key: "B", content: `1` },
    { key: "C", content: `2` },
    { key: "D", content: `3` },
  ],
  correctAnswer: 'D',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-240',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `M 公司的主营业务是主机游戏和在线游戏。下图反映了近五年来M 公司主机游戏和在线游戏市场规模变化情况。根据
图表回答下列问题:
关于主机游戏和在线游戏市场规模比值说法正确的是:`,
  stemImages: ["/qbank/img_b159b99ac7.webp"],
  options: [
    { key: "A", content: `先减小后增大` },
    { key: "B", content: `逐渐增大` },
    { key: "C", content: `逐渐减小` },
    { key: "D", content: `先增大后减小` },
  ],
  correctAnswer: 'C',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-241',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `HZDD 是冒险类游戏APP。请根据表中的信息回答问题。ORDD 的下载价格上涨了:`,
  stemImages: ["/qbank/img_43f80467c2.webp"],
  options: [
    { key: "A", content: `0.2%` },
    { key: "B", content: `0.3%` },
    { key: "C", content: `0.4%` },
    { key: "D", content: `0.5%` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-242',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `根据近几年某公司的财务支出情况(单位:万元)回答下列问题。若该公司的支出金额增长率再创新高，则下一年的
支出金额将达到（
）元。`,
  stemImages: ["/qbank/img_f2e3edda39.webp"],
  options: [
    { key: "A", content: `49887.4` },
    { key: "B", content: `51654.5` },
    { key: "C", content: `54663.5` },
    { key: "D", content: `54282` },
  ],
  correctAnswer: 'C',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-243',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下图是2018 年全国商品房销售情况数据，请根据下图回答问题。别墅、高档公寓2018 年销售面积比2017 年少（
）
万平方米`,
  stemImages: ["/qbank/img_d15728de99.webp"],
  options: [
    { key: "A", content: `332` },
    { key: "B", content: `304` },
    { key: "C", content: `295` },
    { key: "D", content: `264` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-244',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据近中国化妆品出C 及金额统计图回答下列问题若已知第六年，上半年中国化妆品出口量占全年出口总量的41%，
问第五年中国化妆品出口量为第六年的（
）。`,
  stemImages: ["/qbank/img_2c657d4c8a.webp"],
  options: [
    { key: "A", content: `72.8%` },
    { key: "B", content: `94.8%` },
    { key: "C", content: `52.8%` },
    { key: "D", content: `84.8%` },
  ],
  correctAnswer: 'D',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-245',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'easy',
  stem: `下图是某公司九种产品的销售量同比增长率情况(单位: %)根据图表回答下列问题:
根据这两年的产品销售情况，
）产品的生产量,减少对（
公司在下一年更可能加大对（
）产品的生产量。`,
  stemImages: ["/qbank/img_ae344758ca.webp"],
  options: [
    { key: "A", content: `G，B` },
    { key: "B", content: `A，B` },
    { key: "C", content: `A，D` },
    { key: "D", content: `H，D` },
  ],
  correctAnswer: 'B',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-246',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下图是2019 年9 月个级别城市三大品牌门店分布。根据图表回答问题。根据给定的信息，以吓哪项陈述是正确的:`,
  stemImages: ["/qbank/img_035587011a.webp"],
  options: [
    { key: "A", content: `C 品牌选择放弃二三线城市市场的原因是该品牌目标客户为高端人群，集中在一线城市。` },
    { key: "B", content: `A 品牌在一线城市的营收是B 品牌的2 倍` },
    { key: "C", content: `A 品牌在新一线城市们店数量比一线城市少了30%` },
    { key: "D", content: `相较于其他品牌，B 品牌的营销策略更关注新线城市的消费潜力。` },
  ],
  correctAnswer: 'D',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-247',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `根据金溢科技停车场ETC 收入规模及比例图，回答下列问题。比较2015-2018 年金溢科技停车场ETC 收入年增长
率,以下排序正确的是（
）。`,
  stemImages: ["/qbank/img_da755663b6.webp"],
  options: [
    { key: "A", content: `2015 年> 2016 年> 2017 年> 2018 年` },
    { key: "B", content: `2015 年<201 6 年<2017 年<2018 年` },
    { key: "C", content: `2015 年> 2017 年> 2018 年> 2016 年` },
    { key: "D", content: `2017 年> 2015 年> 2016 年> 2018 年` },
  ],
  correctAnswer: 'C',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-248',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率比较',
  difficulty: 'easy',
  stem: `根据近几年某公司的投资额情况表，回答问题。第五年至第八年，该公司投资额增长率最高的是（
）。`,
  stemImages: ["/qbank/img_75673500d5.webp"],
  options: [
    { key: "A", content: `第五年` },
    { key: "B", content: `第六年` },
    { key: "C", content: `第七年` },
    { key: "D", content: `第八年` },
  ],
  correctAnswer: 'C',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-249',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `下图为2020 年二月某理财类app 用户年龄分布统计图。根据下图回答下列问题。根据某调查显示，该app 使用情
况和用户年龄相关性很大，50 岁以上用户使用该app 可能是如何分布的呢?`,
  stemImages: ["/qbank/img_e648cec5f9.webp"],
  options: [
    { key: "A", content: `可能小于9.1%` },
    { key: "B", content: `一定小于5%` },
    { key: "C", content: `可能大于9.1%` },
    { key: "D", content: `一定大于9.1%` },
  ],
  correctAnswer: 'A',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-250',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长量',
  difficulty: 'easy',
  stem: `根据2019 年10 月---2020 年3 月江西省移动手机产量及增长情况回答下列问题。2019 年10 月---2020 年3 月
江西省移动手机产量环比增量最多的月份是（
）。`,
  stemImages: ["/qbank/img_c4075b094f.webp"],
  options: [
    { key: "A", content: `1 月` },
    { key: "B", content: `2 月` },
    { key: "C", content: `10 月` },
    { key: "D", content: `12 月` },
  ],
  correctAnswer: 'D',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-251',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'easy',
  stem: `NEO 公司有A、B、C、D、E、F 六家店铺，去年共实现销售收入56 亿元，该公司去年1-4 季度的销
售收入和各店铺的收入如下列图表所示。NEO 公司去年第4 季度的销售收入比第三季度增长了（）。`,
  stemImages: ["/qbank/img_b31eed24b5.webp"],
  options: [
    { key: "A", content: `18%` },
    { key: "B", content: `24%` },
    { key: "C", content: `36%` },
    { key: "D", content: `44.4%` },
  ],
  correctAnswer: 'B',
  explanation: `本题暂无官方解析，可结合 AI 导师获得详细讲解。`,
  },
  {
  id: 'd-2026-252',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '平均数计算',
  difficulty: 'medium',
  stem: `根据XX 网店近两年X 商品销售情况回答下列问题。若接下来的三个月，每月增长10%，则销量能达
到`,
  stemImages: ["/qbank/img_d2c31532d5.webp"],
  options: [
    { key: "A", content: `4674` },
    { key: "B", content: `4395` },
    { key: "C", content: `4174` },
    { key: "D", content: `4874` },
  ],
  correctAnswer: 'A',
  explanation: `3512*1.1*1.1*1.1=4674.5`,
  },
  {
  id: 'd-2026-253',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '综合分析',
  difficulty: 'hard',
  stem: `下表是11 月某日的电影票房排行榜，根据图表回答下列问题:关于当天电影单场票房收入排序
正确的是( )`,
  stemImages: ["/qbank/img_0992d0e3a1.webp"],
  options: [
    { key: "A", content: `C>B>E> F` },
    { key: "B", content: `B>A>E> D` },
    { key: "C", content: `A>C>F> D` },
    { key: "D", content: `A>B≥D> E` },
  ],
  correctAnswer: 'D',
  explanation: `求单场的票房(单位万元)
电影A ：10010 / 91000 = 0.11
电影B ：6700 / 87000 = 0.077
电影C ：1330 / 19000 = 0.068
电影D ：430 / 6600 = 0.065
电影E ：120 / 7300 = 0.016
电影F ：50 / 480 = 0.104`,
  },
  {
  id: 'd-2026-254',
  category: 'data',
  categoryName: '资料分析与计算',
  subCategory: '增长率计算',
  difficulty: 'hard',
  stem: `下图反映了近几年某地区的A 产品销售量(单位:万件)以及该地区占全国A 产品销售量总量的比
重。根据图表回答下列问题:这几年间，某地区A 产品销售量的年均增长率约为( )`,
  stemImages: ["/qbank/img_06fe9a3c87.webp"],
  options: [
    { key: "A", content: `6%` },
    { key: "B", content: `10%` },
    { key: "C", content: `16%` },
    { key: "D", content: `25%` },
  ],
  correctAnswer: 'C',
  explanation: `求每一年的增长率，求平均即可
（57377-49788）/ 49788 = 0.152
(68226 - 57377) / 57377 = 0.189
(71184 - 68226) / 68226 = 0.043
(89147 - 71184) / 71184 = 0.252
求平均得：0.159 约16%`,
  },
];
