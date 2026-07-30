// ==================== 基础类型 ====================
export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type ModuleType = 'academic' | 'paper' | 'industry' | 'learning';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

// ==================== 目标与项目系统 ====================
export type GoalType = 'long-term' | 'annual' | 'monthly' | 'weekly';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'abandoned';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  startDate: string;
  endDate?: string;
  progress: number; // 0-100
  status: GoalStatus;
  parentGoalId?: string;
  linkedProjectIds: string[];
  linkedTaskIds: string[];
  outcome?: string; // 达成成果描述
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  module: ModuleType;
  type: string;
  status: 'active' | 'completed' | 'paused' | 'at-risk';
  progress: number;
  deadline?: string;
  linkedGoalIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  goalId?: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  deliverables: string[];
  createdAt: string;
  updatedAt: string;
}

// ==================== 习惯系统 ====================
export type HabitFrequency = 'daily' | 'weekly' | 'weekdays';
export type CheckInTemplateType =
  | 'literature' | 'theory' | 'method' | 'paper-writing'
  | 'policy' | 'case' | 'report' | 'language'
  | 'ecommerce' | 'wechat' | 'video' | 'health';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  module: ModuleType;
  templateType: CheckInTemplateType;
  frequency: HabitFrequency;
  targetCount: number; // 每周/每日目标次数
  reminderTime?: string; // HH:mm
  daysActive: string[]; // 生效的日期（周几）
  linkedGoalIds: string[];
  linkedProjectIds: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== 打卡系统 ====================
export interface CheckIn {
  id: string;
  habitId?: string;
  taskId?: string;
  templateType: CheckInTemplateType;
  date: string;
  // 行为投入
  durationMinutes?: number;
  effortLevel?: 1 | 2 | 3 | 4 | 5; // 投入程度
  // 实际产出
  output: string; // 具体产出的描述
  outputCount?: number; // 产出数量（字数、页数等）
  // 完成质量
  quality: 1 | 2 | 3 | 4 | 5;
  // 下一步行动
  nextAction?: string;
  // 证据
  evidenceIds: string[];
  notes?: string;
  completedAt: string;
}

// ==================== 专注记录 ====================
export interface FocusSession {
  id: string;
  taskId?: string;
  habitId?: string;
  startTime: string;
  endTime?: string;
  plannedDuration: number; // 计划专注时间（分钟）
  actualDuration?: number; // 实际专注时间（分钟）
  notes?: string;
  interrupted: boolean;
  interruptionReason?: string;
  createdAt: string;
}

// ==================== 复盘系统 ====================
export type ReviewType = 'daily' | 'weekly' | 'monthly';

export interface ReviewData {
  taskCompletionRate: number; // 任务完成率 0-100
  projectProgress: { projectId: string; projectTitle: string; progressBefore: number; progressAfter: number; advancement: number }[];
  moduleTimeDistribution: { module: string; label: string; minutes: number; percentage: number }[];
  effectiveOutput: string; // 有效产出摘要
  uncompletedTasks: { taskId: string; title: string; reason?: string }[];
  uncompletedReasons: { reason: string; count: number }[];
  upcomingDeadlines: { title: string; deadline: string; projectName?: string }[];
}

export interface Review {
  id: string;
  type: ReviewType;
  title: string;
  date: string;
  weekNumber?: number;
  monthNumber?: number;
  data: ReviewData;
  reflections: string; // 反思
  improvements: string; // 改进措施
  rating: 1 | 2 | 3 | 4 | 5; // 自我评分
  createdAt: string;
}

// ==================== 证据系统 ====================
export type EvidenceType = 'file' | 'link' | 'screenshot' | 'note' | 'output';

export interface Evidence {
  id: string;
  title: string;
  type: EvidenceType;
  url?: string;
  description?: string;
  linkedTaskId?: string;
  linkedCheckInId?: string;
  linkedProjectId?: string;
  createdAt: string;
}

// ==================== 提醒配置 ====================
export interface ReminderItem {
  enabled: boolean;
  threshold?: number; // 阈值（天数/次数等）
}

export interface ReminderConfig {
  taskStartReminder: ReminderItem & { minutesBefore?: number }; // 任务开始提醒
  todayUnfinishedReminder: ReminderItem & { timeOfDay?: string }; // 今日未完成提醒
  consecutiveUnpushedReminder: ReminderItem & { daysThreshold?: number }; // 连续未推进提醒
  projectDeadlineRiskReminder: ReminderItem & { daysBefore?: number }; // 项目截止风险
  overloadReminder: ReminderItem & { maxTasksPerDay?: number }; // 计划过量提醒
  repeatedPostponeReminder: ReminderItem & { timesThreshold?: number }; // 多次顺延提醒
}

// ==================== 学术研究 ====================
export type ReadingStatus = 'to-read' | 'skimming' | 'reading' | 'completed';

export interface Literature {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  publisher?: string;
  doi?: string;
  literatureType?: string;
  discipline?: string;
  keywords: string[];
  theoreticalBasis?: string;
  researchQuestion?: string;
  researchObject?: string;
  methodology?: string;
  sampleAndData?: string;
  coreVariables?: string;
  coreFindings?: string;
  innovation?: string;
  limitations?: string;
  borrowings?: string;
  connectionToMyResearch?: string;
  readingStatus: ReadingStatus;
  readingPriority?: string;
  citationStatus?: string;
  pdfPath?: string;
  tags: string[];
  linkedPaperIds: string[];
  linkedTheoryIds: string[];
  linkedMethodIds: string[];
  starred: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Theory {
  id: string;
  nameZh: string;
  nameEn?: string;
  proposer: string;
  yearProposed?: number;
  originalLiterature?: string;
  coreConcepts: string[];
  corePropositions?: string[];
  mainVariables?: string;
  mechanism?: string;
  applicationLevel?: string;
  applicableQuestions?: string;
  measurementMethods?: string;
  boundaryConditions?: string;
  representativeStudies?: string;
  differencesFromSimilar?: string;
  applicableResearch?: string;
  usageRisk?: string;
  linkedLiteratureIds: string[];
  linkedPaperIds: string[];
  personalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Method {
  id: string;
  nameZh: string;
  nameEn?: string;
  type?: string;
  paradigm?: string;
  applicableQuestions?: string;
  dataRequirements?: string;
  sampleRequirements?: string;
  coreAssumptions?: string;
  standardSteps?: string;
  commonSoftware?: string;
  mainOutput?: string;
  resultInterpretation?: string;
  commonMistakes?: string;
  robustnessChecks?: string;
  representativeLiterature?: string;
  reproducibleCode?: string;
  learningStatus?: string;
  appliedProjects?: string;
  unresolvedIssues?: string;
  usageGuide?: {
    whenToUse: string;
    prerequisites: string;
    howTo: string;
    howToJudge: string;
    howToReport: string;
    commonMistakes: string;
    examples: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ==================== 论文项目 ====================
export interface ShortPaper {
  id: string;
  title: string;
  type: 'empirical' | 'theoretical' | 'review' | 'case-study' | 'other';
  researchQuestion?: string;
  researchObject?: string;
  theoreticalFramework?: string;
  methodology?: string;
  dataSource?: string;
  targetJournal?: string;
  journalLevel?: string;
  wordRequirement?: number;
  deadline?: string;
  stage: string;
  progress: number;
  nextStep?: string;
  versionStatus?: string;
  collaborators: string[];
  linkedLiteratureIds: string[];
  linkedTheoryIds: string[];
  linkedMethodIds: string[];
  submissionInfo?: { submittedDate?: string; reviewResult?: string; revisionDeadline?: string };
  timeLine: { date: string; event: string }[];
  chapters?: { id: string; title: string; progress: number; wordCount: number }[];
  writingTasks?: { id: string; description: string; completed: boolean }[];
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Thesis {
  id: string;
  title: string;
  researchQuestion?: string;
  subQuestions: string[];
  theoreticalFramework?: string;
  stage: string;
  progress: number;
  nextStep?: string;
  finalDefenseDate?: string;
  chapters: { id: string; title: string; status: string; progress: number; wordCount: number; subChapters?: { id: string; title: string; completed: boolean; wordCount: number }[] }[];
  milestones: { id: string; title: string; date: string; completed: boolean }[];
  dataCollectionPlan?: string;
  phaseResults: string[];
  splittablePapers: string[];
  advisorFeedback?: { topic: string; date: string; content: string }[];
  revisions?: { date: string; description: string }[];
  literatureCoverage?: string;
  createdAt: string;
  updatedAt: string;
}

export type IdeaStatus = 'inspiration' | 'validating' | 'feasible' | 'converted' | 'paused' | 'abandoned';

export interface ResearchIdea {
  id: string;
  title: string;
  oneLineQuestion?: string;
  triggerSource?: string;
  researchValue?: string;
  potentialObject?: string;
  availableTheories?: string;
  availableMethods?: string;
  availableData?: string;
  innovationPotential?: string;
  feasibility?: string;
  risks?: string;
  linkedLiterature?: string;
  linkedCases?: string;
  nextVerificationStep?: string;
  status: IdeaStatus;
  convertedProjectId?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== 行业研究 ====================
export interface Policy {
  id: string;
  name: string;
  issuingBody: string;
  level: string;
  issueDate: string;
  effectiveDate?: string;
  domain: string;
  target?: string;
  coreGoal?: string;
  mainTasks?: string;
  keyMeasures?: string;
  importantData?: string;
  relationToPublishing?: string;
  policyEvolution?: string;
  linkedPolicies: string[];
  sourceUrl?: string;
  attachments: string[];
  personalInterpretation?: string;
  quotableParagraphs?: string;
  tags: string[];
  isActive: boolean;
  verificationDate?: string;
  linkedReportIds: string[];
  linkedPaperIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudy {
  id: string;
  name: string;
  subject?: string;
  industry: string;
  timeRange?: string;
  background?: string;
  coreIssue?: string;
  mainActions?: string;
  businessModel?: string;
  orgResources?: string;
  digitalPractices?: string;
  outcomes?: string;
  problems?: string;
  mechanism?: string;
  learnings?: string;
  dataSource?: string;
  linkedPolicyIds: string[];
  linkedReportIds: string[];
  evidenceLevel?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  title: string;
  type: string;
  client?: string;
  coreQuestion?: string;
  targetReader?: string;
  outline?: string[];
  materialList?: string;
  dataSources?: string;
  linkedPolicyIds: string[];
  linkedCaseIds: string[];
  linkedNoteIds: string[];
  keyConclusions?: string;
  checklist?: string[];
  chapterProgress?: number;
  progress?: number;
  status?: string;
  versions?: { date: string; description: string }[];
  deliveryDate?: string;
  deadline?: string;
  outputFiles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReadingNote {
  id: string;
  bookTitle: string;
  author: string;
  publishInfo?: string;
  readingDate?: string;
  readingStatus: 'reading' | 'completed' | 'to-read';
  coreQuestion?: string;
  chapterSummaries?: { title?: string; chapter?: string; summary: string }[];
  coreIdeas?: string[];
  keyConcepts?: string[];
  quotableContent?: string;
  connections?: string;
  reflections?: string;
  applicableScenarios?: string;
  linkedPaperIds: string[];
  linkedReportIds: string[];
  linkedTheoryIds: string[];
  followUpReadings?: string;
  mode?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== 学习成长 ====================
export interface FinancePlan {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface FinanceRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note?: string;
}

export interface LanguageLearning {
  id: string;
  language: 'english' | 'thai' | 'korean';
  currentLevel: string;
  goal: string;
  plan: string;
  dailyTasks: { id: string; title: string; completed: boolean }[];
  vocabulary: { word: string; meaning: string; example: string }[];
  streak: number;
  weeklyReview: string;
  listeningHours: number;
  speakingHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningTask {
  id: string;
  language: string;
  date: string;
  title: string;
  type: string;
  completed: boolean;
  note?: string;
}

export interface EcommerceProduct {
  id: string;
  name: string;
  description?: string;
  market?: string;
  platform?: string;
  competitorAnalysis?: string;
  userNeeds?: string;
  suppliers: { name: string; price?: number; moq?: number }[];
  logistics?: string;
  profitEstimate?: number;
  riskAssessment?: string;
  status: string;
  nextAction?: string;
  researchFiles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WechatArticle {
  id: string;
  title: string;
  summary?: string;
  topic?: string;
  status: string;
  outline?: string;
  draft?: string;
  coverImage?: string;
  publishDate?: string;
  views?: number;
  likes?: number;
  shares?: number;
  review?: string;
  reusableContent?: string;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoProject {
  id: string;
  title: string;
  topic?: string;
  status: string;
  script?: string;
  storyboard?: string;
  shootingList?: string;
  materials: string[];
  platform?: string;
  publishDate?: string;
  views?: number;
  likes?: number;
  comments?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  weight: number;
  targetWeight?: number;
  meals: {
    type: string;
    ingredients: string;
    portion: string;
    protein: boolean;
    vegetables: boolean;
    staple: boolean;
    fullness: number;
    onPlan: boolean;
    note: string;
  }[];
  waterIntake: number;
  exercise: { type: string; duration: number; intensity: string }[];
  sleep: { hours: number; quality: number };
  measurements?: { waist?: number; hip?: number };
  weeklyPlan?: string;
  notes?: string;
}

// ==================== 任务 ====================
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  module?: string;
  projectId?: string;
  projectName?: string;
  goalId?: string;
  milestoneId?: string;
  priority: Priority;
  deadline?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  status: TaskStatus;
  repeatRule?: string;
  subtasks?: Subtask[];
  notes?: string;
  // 执行闭环字段
  postponedCount: number;
  postponementReasons: string[];
  completionEvidence?: string;
  notCompletedReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== 全局设置 ====================
export interface AppSettings {
  sidebarCollapsed: boolean;
  focusMode: boolean;
  theme: 'light';
  language: 'zh-CN';
  userName: string;
  weeklyGoal: string;
}
