import type { AppStore } from '../store';

const now = new Date();
const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => iso(new Date(now.getTime() - n * 86400000));
const daysFromNow = (n: number) => iso(new Date(now.getTime() + n * 86400000));

// ==================== Helpers ====================
const td = (h: number, m: number) => {
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

// ==================== Reminder Config ====================
const reminderConfig = {
  taskStartReminder: { enabled: true, minutesBefore: 15 },
  todayUnfinishedReminder: { enabled: true, timeOfDay: '18:00' },
  consecutiveUnpushedReminder: { enabled: true, daysThreshold: 3 },
  projectDeadlineRiskReminder: { enabled: true, daysBefore: 7 },
  overloadReminder: { enabled: true, maxTasksPerDay: 8 },
  repeatedPostponeReminder: { enabled: true, timesThreshold: 3 },
};

// ==================== Goals ====================
const goals = [
  {
    id: 'goal-1', title: '2026年度学术成长计划', description: '完成核心论文发表与毕业论文推进', type: 'annual' as const,
    startDate: '2026-01-01', endDate: '2026-12-31', progress: 45, status: 'active' as const,
    parentGoalId: undefined, linkedProjectIds: ['proj-1', 'proj-2'], linkedTaskIds: [],
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'goal-2', title: '7月月度目标', description: '完成文献综述初稿，推进第二章框架', type: 'monthly' as const,
    startDate: '2026-07-01', endDate: '2026-07-31', progress: 60, status: 'active' as const,
    parentGoalId: 'goal-1', linkedProjectIds: ['proj-1'], linkedTaskIds: ['task-1', 'task-2', 'task-3'],
    createdAt: '2026-07-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'goal-3', title: '本周核心目标', description: '精读3篇文献，完成第二章框架初稿', type: 'weekly' as const,
    startDate: daysAgo(3), endDate: daysFromNow(4), progress: 40, status: 'active' as const,
    parentGoalId: 'goal-2', linkedProjectIds: ['proj-1'], linkedTaskIds: ['task-1', 'task-2'],
    createdAt: daysAgo(3), updatedAt: iso(now),
  },
  {
    id: 'goal-4', title: '行业研究能力建设', description: '积累政策与案例，输出行业分析报告', type: 'annual' as const,
    startDate: '2026-01-01', endDate: '2026-12-31', progress: 35, status: 'active' as const,
    parentGoalId: undefined, linkedProjectIds: ['proj-3'], linkedTaskIds: [],
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: iso(now),
  },
];

// ==================== Projects ====================
const projects = [
  {
    id: 'proj-1', title: '博士毕业论文', description: '新媒体与数字出版方向', module: 'paper' as const, type: 'thesis',
    status: 'active' as const, progress: 38, deadline: '2027-06-30',
    linkedGoalIds: ['goal-1', 'goal-2'], createdAt: '2026-01-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'proj-2', title: 'SSCI小论文', description: '实证论文投稿', module: 'paper' as const, type: 'short-paper',
    status: 'active' as const, progress: 25, deadline: '2026-10-31',
    linkedGoalIds: ['goal-1'], createdAt: '2026-03-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'proj-3', title: '行业分析报告', description: '季度行业趋势分析', module: 'industry' as const, type: 'report',
    status: 'active' as const, progress: 50, deadline: '2026-08-15',
    linkedGoalIds: ['goal-4'], createdAt: '2026-04-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'proj-4', title: '英语能力提升', description: '学术英语写作与口语', module: 'learning' as const, type: 'language',
    status: 'active' as const, progress: 40, deadline: '2026-12-31',
    linkedGoalIds: [], createdAt: '2026-01-01T00:00:00.000Z', updatedAt: iso(now),
  },
];

// ==================== Milestones ====================
const milestones = [
  {
    id: 'ms-1', title: '文献综述完成', description: '系统性完成30+篇核心文献梳理', projectId: 'proj-1',
    goalId: 'goal-1', targetDate: '2026-08-15', status: 'in-progress' as const,
    deliverables: ['文献综述初稿', '理论框架图', '研究空白分析'],
    createdAt: '2026-06-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'ms-2', title: '第二章初稿完成', description: '理论框架与研究假设', projectId: 'proj-1',
    goalId: 'goal-1', targetDate: '2026-09-15', status: 'pending' as const,
    deliverables: ['第二章正文', '概念模型图', '假设推导'],
    createdAt: '2026-06-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'ms-3', title: '数据收集方案确定', description: '完成问卷设计与预测试', projectId: 'proj-2',
    goalId: 'goal-1', targetDate: '2026-08-30', status: 'pending' as const,
    deliverables: ['问卷终稿', '预测试报告'],
    createdAt: '2026-05-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'ms-4', title: '行业数据汇总', description: '关键指标数据收集完毕', projectId: 'proj-3',
    goalId: 'goal-4', targetDate: '2026-08-01', status: 'in-progress' as const,
    deliverables: ['数据表格', '可视化图表'],
    createdAt: '2026-06-15T00:00:00.000Z', updatedAt: iso(now),
  },
];

// ==================== Habits ====================
const habits = [
  {
    id: 'h-1', title: '每日文献阅读', description: '至少阅读一篇核心文献摘要', module: 'academic' as const,
    templateType: 'literature' as const, frequency: 'daily' as const, targetCount: 1,
    daysActive: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    linkedGoalIds: ['goal-1'], linkedProjectIds: ['proj-1'], active: true,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'h-2', title: '论文写作', description: '每日至少写作500字', module: 'paper' as const,
    templateType: 'paper-writing' as const, frequency: 'daily' as const, targetCount: 1,
    daysActive: ['mon', 'tue', 'wed', 'thu', 'fri'],
    linkedGoalIds: ['goal-1'], linkedProjectIds: ['proj-1'], active: true,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'h-3', title: '英语听说练习', description: '每日30分钟英语练习', module: 'learning' as const,
    templateType: 'language' as const, frequency: 'daily' as const, targetCount: 1,
    daysActive: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    linkedGoalIds: [], linkedProjectIds: ['proj-4'], active: true,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'h-4', title: '政策阅读', description: '每周阅读2篇行业政策', module: 'industry' as const,
    templateType: 'policy' as const, frequency: 'weekly' as const, targetCount: 2,
    daysActive: ['mon', 'wed', 'fri'],
    linkedGoalIds: ['goal-4'], linkedProjectIds: ['proj-3'], active: true,
    createdAt: '2026-03-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'h-5', title: '案例整理', description: '每周整理1个行业案例', module: 'industry' as const,
    templateType: 'case' as const, frequency: 'weekly' as const, targetCount: 1,
    daysActive: ['tue'],
    linkedGoalIds: ['goal-4'], linkedProjectIds: ['proj-3'], active: true,
    createdAt: '2026-04-01T00:00:00.000Z', updatedAt: iso(now),
  },
  {
    id: 'h-6', title: '体重管理', description: '每日记录饮食与体重', module: 'learning' as const,
    templateType: 'health' as const, frequency: 'daily' as const, targetCount: 1,
    daysActive: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    linkedGoalIds: [], linkedProjectIds: [], active: true,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: iso(now),
  },
];

// ==================== Tasks ====================
const tasks = [
  {
    id: 'task-1', title: '精读文献：新媒体传播中的用户行为模型', module: 'academic',
    projectId: 'proj-1', projectName: '博士毕业论文', goalId: 'goal-3',
    priority: 'high' as const, deadline: daysFromNow(1), estimatedDuration: 120,
    status: 'in-progress' as const, postponedCount: 1,
    postponementReasons: ['上午临时会议打断了阅读'],
    subtasks: [{ id: 'st-1-1', title: '梳理理论框架', completed: true }, { id: 'st-1-2', title: '提取方法论要点', completed: false }],
    createdAt: daysAgo(2), updatedAt: iso(now),
  },
  {
    id: 'task-2', title: '撰写第二章理论框架初稿', module: 'paper',
    projectId: 'proj-1', projectName: '博士毕业论文', goalId: 'goal-3',
    priority: 'urgent' as const, deadline: daysFromNow(0), estimatedDuration: 180,
    status: 'in-progress' as const, postponedCount: 0, postponementReasons: [],
    subtasks: [{ id: 'st-2-1', title: '绘制概念模型', completed: false }, { id: 'st-2-2', title: '整理假设推导', completed: false }],
    createdAt: daysAgo(3), updatedAt: iso(now),
  },
  {
    id: 'task-3', title: '阅读行业政策文件（数字经济相关）', module: 'industry',
    projectId: 'proj-3', projectName: '行业分析报告', goalId: 'goal-3',
    priority: 'medium' as const, deadline: daysFromNow(2), estimatedDuration: 60,
    status: 'todo' as const, postponedCount: 0, postponementReasons: [],
    createdAt: daysAgo(1), updatedAt: iso(now),
  },
  {
    id: 'task-4', title: '完成英语精听训练Unit 4', module: 'learning',
    projectId: 'proj-4', projectName: '英语能力提升',
    priority: 'medium' as const, deadline: daysFromNow(1), estimatedDuration: 45,
    status: 'todo' as const, postponedCount: 0, postponementReasons: [],
    createdAt: daysAgo(1), updatedAt: iso(now),
  },
  {
    id: 'task-5', title: '整理SSCI目标期刊投稿要求', module: 'paper',
    projectId: 'proj-2', projectName: 'SSCI小论文',
    priority: 'medium' as const, deadline: daysFromNow(3), estimatedDuration: 90,
    status: 'todo' as const, postponedCount: 0, postponementReasons: [],
    createdAt: daysAgo(1), updatedAt: iso(now),
  },
  {
    id: 'task-6', title: '公众号选题讨论与大纲撰写', module: 'learning',
    priority: 'low' as const, deadline: daysFromNow(4), estimatedDuration: 60,
    status: 'todo' as const, postponedCount: 0, postponementReasons: [],
    createdAt: daysAgo(1), updatedAt: iso(now),
  },
];

// ==================== CheckIns ====================
const checkIns = [
  {
    id: 'ci-1', habitId: 'h-1', templateType: 'literature' as const,
    date: daysAgo(1), durationMinutes: 75, effortLevel: 4 as const, output: '完成Khan et al. (2023)全文精读，整理核心变量表',
    outputCount: 1, quality: 4 as const, nextAction: '明天继续精读Liu et al. (2022)', evidenceIds: [],
    notes: '变量测量部分对后续研究很有参考价值', completedAt: td(10, 30),
  },
  {
    id: 'ci-2', habitId: 'h-2', templateType: 'paper-writing' as const,
    date: daysAgo(1), durationMinutes: 120, effortLevel: 3 as const, output: '完成理论框架部分800字',
    outputCount: 800, quality: 3 as const, nextAction: '完善三变量关系推导',
    evidenceIds: [], notes: '', completedAt: td(16, 0),
  },
  {
    id: 'ci-3', habitId: 'h-3', templateType: 'language' as const,
    date: daysAgo(1), durationMinutes: 30, effortLevel: 3 as const, output: '完成VOA精听1篇，雅思口语话题练习1组',
    outputCount: 2, quality: 3 as const, nextAction: '重点练习Part2话题拓展',
    evidenceIds: [], notes: '', completedAt: td(20, 0),
  },
  {
    id: 'ci-4', habitId: 'h-6', templateType: 'health' as const,
    date: daysAgo(1), durationMinutes: 5, effortLevel: 3 as const, output: '三餐记录完成，总摄入约1800kcal',
    outputCount: 3, quality: 4 as const, nextAction: '明天控制主食比例',
    evidenceIds: [], notes: '', completedAt: td(21, 0),
  },
  {
    id: 'ci-5', habitId: 'h-1', templateType: 'literature' as const,
    date: daysAgo(0), durationMinutes: 60, effortLevel: 4 as const, output: '精读Liu et al.关于新媒体传播机制的研究',
    outputCount: 1, quality: 4 as const, nextAction: '将核心发现整合入理论框架', evidenceIds: [],
    notes: '这篇的方法论设计值得借鉴', completedAt: td(9, 30),
  },
  {
    id: 'ci-6', habitId: 'h-3', templateType: 'language' as const,
    date: daysAgo(0), durationMinutes: 30, effortLevel: 3 as const, output: '雅思听力Section 3练习+口语打卡',
    outputCount: 2, quality: 3 as const, nextAction: '继续推进听力训练',
    evidenceIds: [], notes: '', completedAt: td(20, 0),
  },
  {
    id: 'ci-7', habitId: 'h-6', templateType: 'health' as const,
    date: daysAgo(0), durationMinutes: 5, effortLevel: 3 as const, output: '三餐记录完成，体重62.5kg',
    outputCount: 3, quality: 4 as const, nextAction: '周末需要有氧运动',
    evidenceIds: [], notes: '', completedAt: td(21, 0),
  },
];

// ==================== Focus Sessions ====================
const focusSessions = [
  {
    id: 'fs-1', taskId: 'task-1', startTime: td(8, 0), endTime: td(9, 45),
    plannedDuration: 120, actualDuration: 95, notes: '文献阅读状态佳，中间接了一个电话',
    interrupted: true, interruptionReason: '接电话5分钟', createdAt: daysAgo(1),
  },
  {
    id: 'fs-2', taskId: 'task-2', startTime: td(10, 0), endTime: td(11, 30),
    plannedDuration: 90, actualDuration: 85, notes: '写作思路顺畅',
    interrupted: false, createdAt: daysAgo(1),
  },
  {
    id: 'fs-3', taskId: 'task-2', startTime: td(14, 0), endTime: td(15, 30),
    plannedDuration: 90, actualDuration: 78, interrupted: false,
    createdAt: daysAgo(1),
  },
  {
    id: 'fs-4', taskId: 'task-1', startTime: td(9, 0), endTime: td(9, 50),
    plannedDuration: 60, actualDuration: 50, notes: '效率较高',
    interrupted: false, createdAt: daysAgo(0),
  },
];

// ==================== Reviews ====================
const reviews = [
  {
    id: 'rev-1', type: 'daily' as const, title: '7月29日收尾复盘', date: daysAgo(1),
    data: {
      taskCompletionRate: 60,
      projectProgress: [
        { projectId: 'proj-1', projectTitle: '博士毕业论文', progressBefore: 35, progressAfter: 38, advancement: 3 },
        { projectId: 'proj-3', projectTitle: '行业分析报告', progressBefore: 48, progressAfter: 50, advancement: 2 },
      ],
      moduleTimeDistribution: [
        { module: 'academic', label: '学术研究', minutes: 95, percentage: 36 },
        { module: 'paper', label: '论文写作', minutes: 163, percentage: 62 },
        { module: 'learning', label: '学习成长', minutes: 30, percentage: 11 },
      ],
      effectiveOutput: '精读文献1篇(核心变量表)、理论框架写作800字',
      uncompletedTasks: [
        { taskId: 'task-3', title: '阅读行业政策文件', reason: '论文写作占用较长时间' },
        { taskId: 'task-4', title: '英语精听训练', reason: '忘记了' },
      ],
      uncompletedReasons: [
        { reason: '论文写作占用较长时间', count: 1 },
        { reason: '忘记了', count: 1 },
      ],
      upcomingDeadlines: [
        { title: '撰写第二章初稿', deadline: daysFromNow(0), projectName: '博士毕业论文' },
        { title: '精读文献', deadline: daysFromNow(1), projectName: '博士毕业论文' },
      ],
    },
    reflections: '今天论文写作推进不错，但行业研究模块被挤压了。明天需要优先完成政策文件阅读。',
    improvements: '英语学习设置在固定时段（晚饭后），避免遗忘。', rating: 3 as const,
    createdAt: daysAgo(1),
  },
  {
    id: 'rev-2', type: 'weekly' as const, title: '第30周复盘', date: daysAgo(3), weekNumber: 30,
    data: {
      taskCompletionRate: 65,
      projectProgress: [
        { projectId: 'proj-1', projectTitle: '博士毕业论文', progressBefore: 30, progressAfter: 35, advancement: 5 },
        { projectId: 'proj-2', projectTitle: 'SSCI小论文', progressBefore: 20, progressAfter: 25, advancement: 5 },
        { projectId: 'proj-3', projectTitle: '行业分析报告', progressBefore: 40, progressAfter: 48, advancement: 8 },
      ],
      moduleTimeDistribution: [
        { module: 'academic', label: '学术研究', minutes: 360, percentage: 30 },
        { module: 'paper', label: '论文写作', minutes: 600, percentage: 50 },
        { module: 'industry', label: '行业研究', minutes: 150, percentage: 13 },
        { module: 'learning', label: '学习成长', minutes: 90, percentage: 7 },
      ],
      effectiveOutput: '精读6篇文献、写作3000字、政策笔记2篇、案例整理1个',
      uncompletedTasks: [
        { taskId: 'task-4', title: '英语精听训练' },
        { taskId: 'task-6', title: '公众号选题' },
      ],
      uncompletedReasons: [
        { reason: '时间不足', count: 1 },
        { reason: '优先级较低主动推迟', count: 1 },
      ],
      upcomingDeadlines: [
        { title: '第二章初稿', deadline: daysFromNow(4), projectName: '博士毕业论文' },
        { title: '行业数据汇总', deadline: '2026-08-01', projectName: '行业分析报告' },
      ],
    },
    reflections: '论文写作推进稳定，但英语学习投入不足，需要在下周固定时间。',
    improvements: '每天18:00-18:30固定为英语时间。行业研究需要增加投入。', rating: 3 as const,
    createdAt: daysAgo(3),
  },
];

// ==================== Evidences ====================
const evidences = [
  {
    id: 'ev-1', title: '理论框架概念模型v1', type: 'output' as const,
    description: '第二章概念模型草图', linkedTaskId: 'task-2',
    linkedProjectId: 'proj-1', createdAt: daysAgo(1),
  },
  {
    id: 'ev-2', title: 'Khan et al. (2023) 文献笔记', type: 'note' as const,
    description: '核心变量表与研究设计摘要', linkedTaskId: 'task-1',
    linkedProjectId: 'proj-1', createdAt: daysAgo(1),
  },
];

// ==================== Literatures ====================
const literatures = [
  {
    id: 'lit-1', title: 'Understanding User Engagement in Social Media: A Multi-Method Approach',
    authors: ['Khan, A.', 'Richardson, S.'], year: 2023, journal: 'Journal of Communication',
    keywords: ['user engagement', 'social media', 'mixed methods'],
    researchQuestion: '社交媒体用户参与行为的驱动因素与机制', methodology: '混合方法（问卷+内容分析）',
    sampleAndData: 'N=1,200 Twitter用户', coreFindings: '内容类型比发布频率对用户参与影响更大',
    readingStatus: 'completed' as const, readingPriority: 'high',
    starred: true, archived: false, tags: ['social media', 'user behavior'],
    linkedPaperIds: [], linkedTheoryIds: [], linkedMethodIds: [],
    createdAt: daysAgo(30), updatedAt: daysAgo(1),
  },
  {
    id: 'lit-2', title: 'The Role of Algorithmic Curation in News Consumption',
    authors: ['Liu, M.', 'Zhang, Y.', 'Wang, H.'], year: 2022, journal: 'New Media & Society',
    keywords: ['algorithm', 'news', 'personalization'],
    researchQuestion: '算法推荐对新闻消费多样性的影响',
    methodology: '准实验设计', coreFindings: '算法个性化显著减少信息多样性',
    readingStatus: 'reading' as const, readingPriority: 'high',
    starred: true, archived: false, tags: ['algorithm', 'publishing'],
    linkedPaperIds: [], linkedTheoryIds: [], linkedMethodIds: [],
    createdAt: daysAgo(14), updatedAt: daysAgo(0),
  },
  {
    id: 'lit-3', title: 'Digital Transformation in Publishing Industry',
    authors: ['Park, J.'], year: 2024, journal: 'Publishing Research Quarterly',
    keywords: ['digital publishing', 'transformation', 'business model'],
    researchQuestion: '出版业数字化转型的商业模式变迁',
    readingStatus: 'to-read' as const, readingPriority: 'medium',
    starred: false, archived: false, tags: ['publishing', 'digital'],
    linkedPaperIds: [], linkedTheoryIds: [], linkedMethodIds: [],
    createdAt: daysAgo(5), updatedAt: iso(now),
  },
];

const theories = [
  {
    id: 'th-1', nameZh: '使用与满足理论', nameEn: 'Uses and Gratifications Theory',
    proposer: 'Katz, Blumler & Gurevitch', yearProposed: 1973,
    coreConcepts: ['主动受众', '需求满足', '媒介选择'],
    corePropositions: ['受众主动选择媒介以满足特定需求', '媒介使用行为受社会心理因素驱动'],
    mechanism: '需求→动机→媒介选择→使用→满足',
    applicationLevel: 'individual and media',
    linkedLiteratureIds: [], linkedPaperIds: [],
    createdAt: daysAgo(60), updatedAt: daysAgo(7),
  },
  {
    id: 'th-2', nameZh: '技术接受模型（TAM）', nameEn: 'Technology Acceptance Model',
    proposer: 'Davis', yearProposed: 1989,
    coreConcepts: ['感知有用性', '感知易用性', '行为意图'],
    corePropositions: ['感知有用性和感知易用性共同决定技术接受行为'],
    mechanism: '外部变量→感知有用性/感知易用性→使用态度→行为意图→实际使用',
    applicationLevel: 'technology adoption',
    linkedLiteratureIds: [], linkedPaperIds: [],
    createdAt: daysAgo(45), updatedAt: iso(now),
  },
];

const methods = [
  {
    id: 'm-1', nameZh: '结构方程模型（SEM）', nameEn: 'Structural Equation Modeling',
    type: '定量分析', paradigm: '实证主义',
    applicableQuestions: '验证多个变量间的因果关系', dataRequirements: '连续变量，大样本(N>200)',
    commonSoftware: 'AMOS, Mplus, R(lavaan)',
    mainOutput: '路径系数、拟合指标', learningStatus: '熟练',
    createdAt: daysAgo(100), updatedAt: iso(now),
  },
  {
    id: 'm-2', nameZh: '主题分析法', nameEn: 'Thematic Analysis',
    type: '定性分析', paradigm: '解释主义',
    applicableQuestions: '从文本数据中提取主题模式', dataRequirements: '访谈转录文本、文档等',
    commonSoftware: 'NVivo, MAXQDA',
    mainOutput: '主题网络、编码框架', learningStatus: '学习中',
    createdAt: daysAgo(50), updatedAt: iso(now),
  },
];

// ==================== Papers ====================
const shortPapers = [
  {
    id: 'sp-1', title: '新媒体环境下用户内容分享行为的驱动机制研究',
    type: 'empirical' as const, researchQuestion: '社交媒体用户内容分享行为的多层驱动因素',
    targetJournal: 'Journal of Communication', stage: '理论构建阶段', progress: 25,
    nextStep: '完善理论模型，识别可操作化变量',
    collaborators: [], linkedLiteratureIds: [], linkedTheoryIds: [], linkedMethodIds: [],
    timeLine: [{ date: daysAgo(30), event: '选题确定' }, { date: daysAgo(14), event: '文献梳理完成' }],
    createdAt: daysAgo(30), updatedAt: iso(now),
  },
];

const thesis = {
  id: 'th-es-1', title: '数字出版平台用户体验对用户忠诚的影响机制研究',
  researchQuestion: '数字出版平台用户体验如何通过价值感知影响用户忠诚？',
  subQuestions: ['用户体验的哪些维度影响最深？', '价值感知的中介机制是什么？'],
  theoreticalFramework: '使用与满足理论、技术接受模型、感知价值理论',
  stage: '第二章写作推进', progress: 38, nextStep: '完成理论框架初稿',
  chapters: [
    { id: 'ch-1', title: '绪论', status: 'completed', progress: 90, wordCount: 8000, subChapters: [] },
    { id: 'ch-2', title: '文献综述与理论框架', status: 'writing', progress: 40, wordCount: 5000, subChapters: [] },
    { id: 'ch-3', title: '研究方法', status: 'outline', progress: 10, wordCount: 0, subChapters: [] },
    { id: 'ch-4', title: '数据分析与发现', status: 'outline', progress: 0, wordCount: 0, subChapters: [] },
    { id: 'ch-5', title: '结论与讨论', status: 'outline', progress: 0, wordCount: 0, subChapters: [] },
  ],
  milestones: [
    { id: 'thm-1', title: '开题答辩', date: '2026-03-15', completed: true },
    { id: 'thm-2', title: '文献综述完成', date: '2026-08-15', completed: false },
    { id: 'thm-3', title: '问卷调研完成', date: '2026-11-30', completed: false },
  ],
  dataCollectionPlan: '问卷调查+平台爬虫数据',
  phaseResults: [], splittablePapers: [],
  advisorFeedback: [
    { topic: '理论框架', date: daysAgo(7), content: '建议增加数字出版行业特有变量' },
  ],
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: iso(now),
};

const researchIdeas = [
  {
    id: 'ri-1', title: 'AI辅助写作工具对学术论文质量的影响',
    oneLineQuestion: 'AI辅助工具使用是否提升学术论文质量？体现在哪些维度？',
    triggerSource: '最近使用ChatGPT辅助文献梳理', status: 'validating' as const,
    createdAt: daysAgo(7), updatedAt: iso(now),
  },
];

// ==================== Industry ====================
const policies = [
  {
    id: 'pol-1', name: '"十四五"数字经济发展规划', issuingBody: '国务院', level: '国家级',
    issueDate: '2021-12-12', domain: '数字经济',
    coreGoal: '到2025年数字经济核心产业增加值占GDP比重达到10%',
    tags: ['数字经济', '十四五', '产业规划'], isActive: true,
    linkedPolicies: [], attachments: [], linkedReportIds: [], linkedPaperIds: [],
    createdAt: daysAgo(200), updatedAt: iso(now),
  },
  {
    id: 'pol-2', name: '关于推进实施国家文化数字化战略的意见', issuingBody: '中共中央办公厅', level: '国家级',
    issueDate: '2022-05-22', domain: '文化数字化',
    tags: ['文化数字化', '出版业'], isActive: true,
    linkedPolicies: [], attachments: [], linkedReportIds: [], linkedPaperIds: [],
    createdAt: daysAgo(150), updatedAt: iso(now),
  },
];

const cases = [
  {
    id: 'case-1', name: '微信读书社区化运营策略', industry: '数字出版',
    coreIssue: '如何通过社区化运营提升用户留存', learnings: '社交阅读功能是留存关键驱动',
    linkedPolicyIds: [], linkedReportIds: [], tags: ['数字出版', '社区运营'],
    createdAt: daysAgo(30), updatedAt: iso(now),
  },
  {
    id: 'case-2', name: '得到App知识付费转型', industry: '在线教育/出版',
    coreIssue: '从知识付费到系统化学习平台转型',
    linkedPolicyIds: [], linkedReportIds: [], tags: ['知识付费', '平台转型'],
    createdAt: daysAgo(20), updatedAt: iso(now),
  },
];

const reports = [
  {
    id: 'rep-1', title: '中国数字出版产业季度分析（2026Q2）', type: 'industry-analysis',
    coreQuestion: '2026年Q2数字出版产业核心趋势与关键变化',
    linkedPolicyIds: [], linkedCaseIds: [], linkedNoteIds: [],
    progress: 50, status: '撰写中',
    outputFiles: [], createdAt: daysAgo(45), updatedAt: iso(now),
  },
];

const readingNotes = [
  {
    id: 'rn-1', bookTitle: '创新者的窘境', author: '克莱顿·克里斯坦森',
    readingStatus: 'completed' as const,
    coreIdeas: ['破坏性创新', '价值网络', '在位者困境'],
    linkedPaperIds: [], linkedReportIds: [], linkedTheoryIds: [],
    createdAt: daysAgo(90), updatedAt: iso(now),
  },
];

// ==================== Learning ====================
const financePlans = [
  { id: 'fp-1', title: '每月定投指数基金', description: '沪深300+中证500', completed: true },
  { id: 'fp-2', title: '紧急备用金6个月', description: '', completed: false },
];
const financeRecords = [
  { id: 'fr-1', date: daysAgo(0), type: 'expense' as const, amount: 35, category: '餐饮', note: '午餐外卖' },
];

const languageLearnings = [
  {
    id: 'lang-1', language: 'english' as const, currentLevel: 'B2（中高级）',
    goal: '2026年底学术英语写作达到C1水平', plan: '每日听力+口语，每周写作1篇',
    dailyTasks: [
      { id: 'ld-1', title: 'VOA精听1篇', completed: false },
      { id: 'ld-2', title: '雅思口语Part2练习', completed: false },
      { id: 'ld-3', title: 'Academic Word List复习', completed: false },
    ],
    vocabulary: [{ word: 'disseminate', meaning: '传播', example: 'to disseminate information' }],
    streak: 14, weeklyReview: '本周听力练习持续进行，口语仍需加强', listeningHours: 3.5, speakingHours: 1.5,
    createdAt: daysAgo(100), updatedAt: iso(now),
  },
  {
    id: 'lang-2', language: 'thai' as const, currentLevel: 'A1（初级）',
    goal: '日常对话初级水平', plan: '每周2次学习',
    dailyTasks: [{ id: 'ltd-1', title: '泰语字母复习', completed: false }],
    vocabulary: [{ word: 'สวัสดี', meaning: '你好', example: 'สวัสดีครับ' }],
    streak: 3, weeklyReview: '', listeningHours: 1, speakingHours: 0.5,
    createdAt: daysAgo(50), updatedAt: iso(now),
  },
];

const learningTasks = [
  { id: 'lt-1', language: 'english', date: daysAgo(0), title: 'VOA精听', type: 'listening', completed: true },
  { id: 'lt-2', language: 'english', date: daysAgo(0), title: '雅思口语', type: 'speaking', completed: false },
  { id: 'lt-3', language: 'thai', date: daysAgo(0), title: '字母复习', type: 'vocab', completed: false },
];

const ecommerceProducts = [
  {
    id: 'ep-1', name: '学术周边文创产品', market: '博士生/硕博研究生',
    platform: '小红书+微信', status: '调研中',
    suppliers: [{ name: '供应商A', price: 15, moq: 100 }],
    researchFiles: [], createdAt: daysAgo(14), updatedAt: iso(now),
  },
];
const wechatArticles = [
  {
    id: 'wa-1', title: '博士生如何高效管理文献笔记', status: '选题中',
    createdAt: daysAgo(3), updatedAt: iso(now),
  },
];
const videoProjects = [
  {
    id: 'vp-1', title: '博士生科研工作台搭建vlog', status: '拍摄中',
    materials: ['设备清单', '脚本v1'], createdAt: daysAgo(7), updatedAt: iso(now),
  },
];

const healthRecords = [
  {
    id: 'hr-1', date: daysAgo(1), weight: 62.5, targetWeight: 60,
    meals: [
      { type: '早餐', ingredients: '燕麦+鸡蛋+牛奶', portion: '适量', protein: true, vegetables: false, staple: true, fullness: 3, onPlan: true, note: '' },
      { type: '午餐', ingredients: '鸡胸肉+西兰花+米饭', portion: '适量', protein: true, vegetables: true, staple: true, fullness: 3, onPlan: true, note: '' },
      { type: '晚餐', ingredients: '沙拉+三文鱼', portion: '适量', protein: true, vegetables: true, staple: false, fullness: 3, onPlan: true, note: '' },
    ],
    waterIntake: 1500, exercise: [{ type: '散步', duration: 30, intensity: '低' }],
    sleep: { hours: 7, quality: 4 },
  },
  {
    id: 'hr-2', date: daysAgo(0), weight: 62.5, targetWeight: 60,
    meals: [
      { type: '早餐', ingredients: '全麦面包+鸡蛋+黑咖啡', portion: '适量', protein: true, vegetables: false, staple: true, fullness: 3, onPlan: true, note: '' },
      { type: '午餐', ingredients: '藜麦+鸡腿+蔬菜', portion: '适量', protein: true, vegetables: true, staple: true, fullness: 3, onPlan: true, note: '' },
      { type: '晚餐', ingredients: '牛肉面', portion: '偏多', protein: true, vegetables: false, staple: true, fullness: 4, onPlan: false, note: '外食偏多' },
    ],
    waterIntake: 1200, exercise: [],
    sleep: { hours: 6.5, quality: 3 },
  },
];

// ==================== Default State ====================
export const defaultState = {
  settings: {
    sidebarCollapsed: false,
    focusMode: false,
    theme: 'light' as const,
    language: 'zh-CN' as const,
    userName: '雪夜',
    weeklyGoal: '完成文献综述初稿，推进毕业论文第二章框架',
  },
  reminderConfig,
  goals, projects, milestones, habits, checkIns, focusSessions, reviews, evidences,
  tasks,
  literatures, theories, methods,
  shortPapers, thesis,
  researchIdeas,
  policies, cases: cases as any, reports, readingNotes,
  financePlans, financeRecords,
  languageLearnings, learningTasks,
  ecommerceProducts, wechatArticles, videoProjects,
  healthRecords,
};
