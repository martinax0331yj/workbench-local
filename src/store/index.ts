import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Goal, Project, Milestone, Habit, CheckIn, FocusSession,
  Review, Evidence, ReminderConfig,
  Literature, Theory, Method, Task, ShortPaper, Thesis,
  ResearchIdea, Policy, CaseStudy, Report, ReadingNote,
  FinancePlan, FinanceRecord, LanguageLearning, LearningTask,
  EcommerceProduct, WechatArticle, VideoProject, HealthRecord,
  AppSettings, GoalStatus
} from '../types';
import { defaultState } from '../data/mockData';

export interface AppStore {
  // Settings
  settings: AppSettings;
  reminderConfig: ReminderConfig;
  updateSettings: (partial: Partial<AppSettings>) => void;
  updateReminderConfig: (partial: Partial<ReminderConfig>) => void;
  toggleSidebar: () => void;
  resetAllData: () => void;

  // Goals
  goals: Goal[];
  addGoal: (g: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => string;
  updateGoal: (id: string, partial: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  recalcGoalProgress: (id: string) => void;

  // Projects
  projects: Project[];
  addProject: (p: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => string;
  updateProject: (id: string, partial: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  recalcProjectProgress: (id: string) => void;

  // Milestones
  milestones: Milestone[];
  addMilestone: (m: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateMilestone: (id: string, partial: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  toggleMilestoneCompleted: (id: string) => void;

  // Habits
  habits: Habit[];
  addHabit: (h: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateHabit: (id: string, partial: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitActive: (id: string) => void;

  // CheckIns
  checkIns: CheckIn[];
  addCheckIn: (c: Omit<CheckIn, 'id' | 'completedAt'>) => string;
  updateCheckIn: (id: string, partial: Partial<CheckIn>) => void;
  deleteCheckIn: (id: string) => void;

  // Focus Sessions
  focusSessions: FocusSession[];
  addFocusSession: (f: Omit<FocusSession, 'id' | 'createdAt'>) => string;
  updateFocusSession: (id: string, partial: Partial<FocusSession>) => void;
  deleteFocusSession: (id: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (r: Omit<Review, 'id' | 'createdAt'>) => string;
  updateReview: (id: string, partial: Partial<Review>) => void;
  deleteReview: (id: string) => void;

  // Evidences
  evidences: Evidence[];
  addEvidence: (e: Omit<Evidence, 'id' | 'createdAt'>) => string;
  updateEvidence: (id: string, partial: Partial<Evidence>) => void;
  deleteEvidence: (id: string) => void;

  // ===== Legacy data =====
  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'postponedCount' | 'postponementReasons'>) => string;
  updateTask: (id: string, partial: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  postponeTask: (id: string, reason: string) => void;

  literatures: Literature[];
  addLiterature: (l: Omit<Literature, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateLiterature: (id: string, partial: Partial<Literature>) => void;
  toggleStarLiterature: (id: string) => void;
  deleteLiterature: (id: string) => void;
  updateLiteratureStatus: (id: string, status: Literature['readingStatus']) => void;

  theories: Theory[];
  addTheory: (t: Omit<Theory, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTheory: (id: string, partial: Partial<Theory>) => void;
  deleteTheory: (id: string) => void;

  methods: Method[];
  addMethod: (m: Omit<Method, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateMethod: (id: string, partial: Partial<Method>) => void;
  deleteMethod: (id: string) => void;

  shortPapers: ShortPaper[];
  addShortPaper: (p: Omit<ShortPaper, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateShortPaper: (id: string, partial: Partial<ShortPaper>) => void;
  deleteShortPaper: (id: string) => void;
  archiveShortPaper: (id: string) => void;
  restoreShortPaper: (id: string) => void;

  thesis: Thesis | null;
  updateThesis: (partial: Partial<Thesis>) => void;

  researchIdeas: ResearchIdea[];
  addResearchIdea: (r: Omit<ResearchIdea, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateResearchIdea: (id: string, partial: Partial<ResearchIdea>) => void;
  deleteResearchIdea: (id: string) => void;

  policies: Policy[];
  addPolicy: (p: Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePolicy: (id: string, partial: Partial<Policy>) => void;
  deletePolicy: (id: string) => void;
  cases: CaseStudy[];
  addCase: (c: Omit<CaseStudy, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCase: (id: string, partial: Partial<CaseStudy>) => void;
  deleteCase: (id: string) => void;
  reports: Report[];
  addReport: (r: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateReport: (id: string, partial: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  readingNotes: ReadingNote[];
  addReadingNote: (n: Omit<ReadingNote, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateReadingNote: (id: string, partial: Partial<ReadingNote>) => void;
  deleteReadingNote: (id: string) => void;

  financePlans: FinancePlan[];
  addFinancePlan: (f: Omit<FinancePlan, 'id'>) => string;
  updateFinancePlan: (id: string, partial: Partial<FinancePlan>) => void;
  deleteFinancePlan: (id: string) => void;
  financeRecords: FinanceRecord[];
  addFinanceRecord: (r: Omit<FinanceRecord, 'id'>) => string;
  updateFinanceRecord: (id: string, partial: Partial<FinanceRecord>) => void;
  deleteFinanceRecord: (id: string) => void;

  languageLearnings: LanguageLearning[];
  addLanguageLearning: (l: Omit<LanguageLearning, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateLanguageLearning: (id: string, partial: Partial<LanguageLearning>) => void;
  deleteLanguageLearning: (id: string) => void;
  learningTasks: LearningTask[];
  addLearningTask: (t: Omit<LearningTask, 'id'>) => string;
  updateLearningTask: (id: string, partial: Partial<LearningTask>) => void;
  deleteLearningTask: (id: string) => void;
  toggleLearningTask: (id: string) => void;

  ecommerceProducts: EcommerceProduct[];
  addEcommerceProduct: (p: Omit<EcommerceProduct, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateEcommerceProduct: (id: string, partial: Partial<EcommerceProduct>) => void;
  deleteEcommerceProduct: (id: string) => void;
  wechatArticles: WechatArticle[];
  addWechatArticle: (a: Omit<WechatArticle, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateWechatArticle: (id: string, partial: Partial<WechatArticle>) => void;
  deleteWechatArticle: (id: string) => void;
  videoProjects: VideoProject[];
  addVideoProject: (v: Omit<VideoProject, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateVideoProject: (id: string, partial: Partial<VideoProject>) => void;
  deleteVideoProject: (id: string) => void;
  healthRecords: HealthRecord[];
  addHealthRecord: (r: Omit<HealthRecord, 'id'>) => string;
  updateHealthRecord: (id: string, partial: Partial<HealthRecord>) => void;
  deleteHealthRecord: (id: string) => void;

  // Data export / import
  exportData: () => object;
  importData: (payload: { app: string; version: number; data: Record<string, unknown> }) => void;
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const now = () => new Date().toISOString();

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      updateSettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),
      updateReminderConfig: (partial) => set((s) => ({ reminderConfig: { ...s.reminderConfig, ...partial } })),
      toggleSidebar: () => set((s) => ({ settings: { ...s.settings, sidebarCollapsed: !s.settings.sidebarCollapsed } })),
      resetAllData: () => set({ ...defaultState }),

      // ==================== Goals ====================
      addGoal: (g) => {
        const id = uid();
        set((s) => ({ goals: [...s.goals, { ...g, id, progress: 0, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateGoal: (id, partial) => set((s) => ({
        goals: s.goals.map(g => g.id === id ? { ...g, ...partial, updatedAt: now() } : g)
      })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter(g => g.id !== id) })),
      recalcGoalProgress: (id) => {
        const s = get();
        const goal = s.goals.find(g => g.id === id);
        if (!goal) return;
        const tasks = s.tasks.filter(t => t.goalId === id);
        const completed = tasks.filter(t => t.status === 'completed').length;
        const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
        set((s2) => ({ goals: s2.goals.map(g => g.id === id ? { ...g, progress, updatedAt: now() } : g) }));
      },

      // ==================== Projects ====================
      addProject: (p) => {
        const id = uid();
        set((s) => ({ projects: [...s.projects, { ...p, id, progress: 0, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateProject: (id, partial) => set((s) => ({
        projects: s.projects.map(p => p.id === id ? { ...p, ...partial, updatedAt: now() } : p)
      })),
      deleteProject: (id) => set((s) => ({ projects: s.projects.filter(p => p.id !== id) })),
      recalcProjectProgress: (id) => {
        const s = get();
        const project = s.projects.find(p => p.id === id);
        if (!project) return;
        const tasks = s.tasks.filter(t => t.projectId === id);
        const completed = tasks.filter(t => t.status === 'completed').length;
        const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
        const milestones = s.milestones.filter(m => m.projectId === id);
        const msCompleted = milestones.filter(m => m.status === 'completed').length;
        const msProgress = milestones.length > 0 ? Math.round((msCompleted / milestones.length) * 100) : 0;
        const avgProgress = milestones.length > 0 ? Math.round((progress + msProgress) / 2) : progress;
        set((s2) => ({
          projects: s2.projects.map(p => p.id === id ? { ...p, progress: avgProgress, updatedAt: now() } : p)
        }));
      },

      // ==================== Milestones ====================
      addMilestone: (m) => {
        const id = uid();
        set((s) => ({ milestones: [...s.milestones, { ...m, id, createdAt: now(), updatedAt: now() }] }));
        get().recalcProjectProgress(m.projectId);
        if (m.goalId) get().recalcGoalProgress(m.goalId);
        return id;
      },
      updateMilestone: (id, partial) => set((s) => ({
        milestones: s.milestones.map(m => m.id === id ? { ...m, ...partial, updatedAt: now() } : m)
      })),
      deleteMilestone: (id) => {
        const m = get().milestones.find(x => x.id === id);
        set((s) => ({ milestones: s.milestones.filter(x => x.id !== id) }));
        if (m) {
          get().recalcProjectProgress(m.projectId);
          if (m.goalId) get().recalcGoalProgress(m.goalId);
        }
      },
      toggleMilestoneCompleted: (id) => set((s) => {
        const updated = s.milestones.map(m => {
          if (m.id !== id) return m;
          const isDone = m.status === 'completed';
          return { ...m, status: isDone ? 'pending' as const : 'completed' as const, completedDate: isDone ? undefined : now(), updatedAt: now() };
        });
        const target = updated.find(m => m.id === id);
        return { milestones: updated };
      }),

      // ==================== Habits ====================
      addHabit: (h) => {
        const id = uid();
        set((s) => ({ habits: [...s.habits, { ...h, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateHabit: (id, partial) => set((s) => ({
        habits: s.habits.map(h => h.id === id ? { ...h, ...partial, updatedAt: now() } : h)
      })),
      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter(h => h.id !== id) })),
      toggleHabitActive: (id) => set((s) => ({
        habits: s.habits.map(h => h.id === id ? { ...h, active: !h.active, updatedAt: now() } : h)
      })),

      // ==================== CheckIns ====================
      addCheckIn: (c) => {
        const id = uid();
        set((s) => ({ checkIns: [...s.checkIns, { ...c, id, completedAt: now() }] }));
        if (c.taskId) {
          set((s) => ({ tasks: s.tasks.map(t => t.id === c.taskId ? { ...t, status: 'completed' as const, updatedAt: now() } : t) }));
          const task = get().tasks.find(t => t.id === c.taskId);
          if (task?.projectId) get().recalcProjectProgress(task.projectId);
          if (task?.goalId) get().recalcGoalProgress(task.goalId);
        }
        return id;
      },
      updateCheckIn: (id, partial) => set((s) => ({
        checkIns: s.checkIns.map(c => c.id === id ? { ...c, ...partial } : c)
      })),
      deleteCheckIn: (id) => set((s) => ({ checkIns: s.checkIns.filter(c => c.id !== id) })),

      // ==================== Focus Sessions ====================
      addFocusSession: (f) => {
        const id = uid();
        set((s) => ({ focusSessions: [...s.focusSessions, { ...f, id, createdAt: now() }] }));
        return id;
      },
      updateFocusSession: (id, partial) => set((s) => ({
        focusSessions: s.focusSessions.map(f => f.id === id ? { ...f, ...partial } : f)
      })),
      deleteFocusSession: (id) => set((s) => ({ focusSessions: s.focusSessions.filter(f => f.id !== id) })),

      // ==================== Reviews ====================
      addReview: (r) => {
        const id = uid();
        set((s) => ({ reviews: [...s.reviews, { ...r, id, createdAt: now() }] }));
        return id;
      },
      updateReview: (id, partial) => set((s) => ({
        reviews: s.reviews.map(r => r.id === id ? { ...r, ...partial } : r)
      })),
      deleteReview: (id) => set((s) => ({ reviews: s.reviews.filter(r => r.id !== id) })),

      // ==================== Evidences ====================
      addEvidence: (e) => {
        const id = uid();
        set((s) => ({ evidences: [...s.evidences, { ...e, id, createdAt: now() }] }));
        return id;
      },
      updateEvidence: (id, partial) => set((s) => ({
        evidences: s.evidences.map(e => e.id === id ? { ...e, ...partial } : e)
      })),
      deleteEvidence: (id) => set((s) => ({ evidences: s.evidences.filter(e => e.id !== id) })),

      // ==================== Tasks ====================
      addTask: (t) => {
        const id = uid();
        set((s) => ({ tasks: [...s.tasks, { ...t, id, postponedCount: 0, postponementReasons: [], createdAt: now(), updatedAt: now() }] }));
        const s2 = get();
        if (t.projectId) s2.recalcProjectProgress(t.projectId);
        if (t.goalId) s2.recalcGoalProgress(t.goalId);
        return id;
      },
      updateTask: (id, partial) => {
        set((s) => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...partial, updatedAt: now() } : t) }));
        const task = get().tasks.find(t => t.id === id);
        if (task?.projectId) get().recalcProjectProgress(task.projectId);
        if (task?.goalId) get().recalcGoalProgress(task.goalId);
      },
      deleteTask: (id) => {
        const task = get().tasks.find(t => t.id === id);
        set((s) => ({ tasks: s.tasks.filter(t => t.id !== id) }));
        if (task?.projectId) get().recalcProjectProgress(task.projectId);
        if (task?.goalId) get().recalcGoalProgress(task.goalId);
      },
      toggleTask: (id) => set((s) => ({
        tasks: s.tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'todo' as const : 'completed' as const, updatedAt: now() } : t)
      })),
      postponeTask: (id, reason) => set((s) => ({
        tasks: s.tasks.map(t => t.id === id ? { ...t, postponedCount: t.postponedCount + 1, postponementReasons: [...t.postponementReasons, reason], updatedAt: now() } : t)
      })),

      // ==================== Legacy ====================
      literatures: defaultState.literatures,
      addLiterature: (l) => {
        const id = uid();
        set((s) => ({ literatures: [...s.literatures, { ...l, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateLiterature: (id, partial) => set((s) => ({
        literatures: s.literatures.map(l => l.id === id ? { ...l, ...partial, updatedAt: now() } : l)
      })),
      toggleStarLiterature: (id) => set((s) => ({
        literatures: s.literatures.map(l => l.id === id ? { ...l, starred: !l.starred } : l)
      })),
      deleteLiterature: (id) => set((s) => ({ literatures: s.literatures.filter(l => l.id !== id) })),
      updateLiteratureStatus: (id, status) => set((s) => ({
        literatures: s.literatures.map(l => l.id === id ? { ...l, readingStatus: status } : l)
      })),

      theories: defaultState.theories,
      addTheory: (t) => {
        const id = uid();
        set((s) => ({ theories: [...s.theories, { ...t, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateTheory: (id, partial) => set((s) => ({
        theories: s.theories.map(t => t.id === id ? { ...t, ...partial, updatedAt: now() } : t)
      })),
      deleteTheory: (id) => set((s) => ({ theories: s.theories.filter(t => t.id !== id) })),
      methods: defaultState.methods,
      addMethod: (m) => {
        const id = uid();
        set((s) => ({ methods: [...s.methods, { ...m, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateMethod: (id, partial) => set((s) => ({
        methods: s.methods.map(m => m.id === id ? { ...m, ...partial, updatedAt: now() } : m)
      })),
      deleteMethod: (id) => set((s) => ({ methods: s.methods.filter(m => m.id !== id) })),

      shortPapers: defaultState.shortPapers,
      addShortPaper: (p) => {
        const id = uid();
        set((s) => ({ shortPapers: [...s.shortPapers, { ...p, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateShortPaper: (id, partial) => set((s) => ({
        shortPapers: s.shortPapers.map(p => p.id === id ? { ...p, ...partial, updatedAt: now() } : p)
      })),
      deleteShortPaper: (id) => set((s) => ({ shortPapers: s.shortPapers.filter(p => p.id !== id) })),
      archiveShortPaper: (id) => set((s) => ({
        shortPapers: s.shortPapers.map(p => p.id === id ? { ...p, archived: true } : p)
      })),
      restoreShortPaper: (id) => set((s) => ({
        shortPapers: s.shortPapers.map(p => p.id === id ? { ...p, archived: false } : p)
      })),
      thesis: defaultState.thesis,
      updateThesis: (partial) => set((s) => ({ thesis: s.thesis ? { ...s.thesis, ...partial } : null })),
      researchIdeas: defaultState.researchIdeas,
      addResearchIdea: (r) => {
        const id = uid();
        set((s) => ({ researchIdeas: [...s.researchIdeas, { ...r, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateResearchIdea: (id, partial) => set((s) => ({
        researchIdeas: s.researchIdeas.map(i => i.id === id ? { ...i, ...partial } : i)
      })),
      deleteResearchIdea: (id) => set((s) => ({ researchIdeas: s.researchIdeas.filter(i => i.id !== id) })),

      policies: defaultState.policies,
      addPolicy: (p) => {
        const id = uid();
        set((s) => ({ policies: [...s.policies, { ...p, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updatePolicy: (id, partial) => set((s) => ({
        policies: s.policies.map(p => p.id === id ? { ...p, ...partial, updatedAt: now() } : p)
      })),
      deletePolicy: (id) => set((s) => ({ policies: s.policies.filter(p => p.id !== id) })),
      cases: defaultState.cases,
      addCase: (c) => {
        const id = uid();
        set((s) => ({ cases: [...s.cases, { ...c, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateCase: (id, partial) => set((s) => ({
        cases: s.cases.map(c => c.id === id ? { ...c, ...partial, updatedAt: now() } : c)
      })),
      deleteCase: (id) => set((s) => ({ cases: s.cases.filter(c => c.id !== id) })),
      reports: defaultState.reports,
      addReport: (r) => {
        const id = uid();
        set((s) => ({ reports: [...s.reports, { ...r, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateReport: (id, partial) => set((s) => ({
        reports: s.reports.map(r => r.id === id ? { ...r, ...partial, updatedAt: now() } : r)
      })),
      deleteReport: (id) => set((s) => ({ reports: s.reports.filter(r => r.id !== id) })),
      readingNotes: defaultState.readingNotes,
      addReadingNote: (n) => {
        const id = uid();
        set((s) => ({ readingNotes: [...s.readingNotes, { ...n, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateReadingNote: (id, partial) => set((s) => ({
        readingNotes: s.readingNotes.map(n => n.id === id ? { ...n, ...partial } : n)
      })),
      deleteReadingNote: (id) => set((s) => ({ readingNotes: s.readingNotes.filter(n => n.id !== id) })),

      financePlans: defaultState.financePlans,
      addFinancePlan: (f) => {
        const id = uid();
        set((s) => ({ financePlans: [...s.financePlans, { ...f, id }] }));
        return id;
      },
      updateFinancePlan: (id, partial) => set((s) => ({
        financePlans: s.financePlans.map(p => p.id === id ? { ...p, ...partial } : p)
      })),
      deleteFinancePlan: (id) => set((s) => ({ financePlans: s.financePlans.filter(p => p.id !== id) })),
      financeRecords: defaultState.financeRecords,
      addFinanceRecord: (r) => {
        const id = uid();
        set((s) => ({ financeRecords: [...s.financeRecords, { ...r, id }] }));
        return id;
      },
      updateFinanceRecord: (id, partial) => set((s) => ({
        financeRecords: s.financeRecords.map(r => r.id === id ? { ...r, ...partial } : r)
      })),
      deleteFinanceRecord: (id) => set((s) => ({ financeRecords: s.financeRecords.filter(r => r.id !== id) })),
      languageLearnings: defaultState.languageLearnings,
      addLanguageLearning: (l) => {
        const id = uid();
        set((s) => ({ languageLearnings: [...s.languageLearnings, { ...l, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateLanguageLearning: (id, partial) => set((s) => ({
        languageLearnings: s.languageLearnings.map(l => l.id === id ? { ...l, ...partial, updatedAt: now() } : l)
      })),
      deleteLanguageLearning: (id) => set((s) => ({ languageLearnings: s.languageLearnings.filter(l => l.id !== id) })),
      learningTasks: defaultState.learningTasks,
      addLearningTask: (t) => {
        const id = uid();
        set((s) => ({ learningTasks: [...s.learningTasks, { ...t, id }] }));
        return id;
      },
      updateLearningTask: (id, partial) => set((s) => ({
        learningTasks: s.learningTasks.map(t => t.id === id ? { ...t, ...partial } : t)
      })),
      deleteLearningTask: (id) => set((s) => ({ learningTasks: s.learningTasks.filter(t => t.id !== id) })),
      toggleLearningTask: (id) => set((s) => ({
        learningTasks: s.learningTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),
      ecommerceProducts: defaultState.ecommerceProducts,
      addEcommerceProduct: (ep) => {
        const id = uid();
        set((s) => ({ ecommerceProducts: [...s.ecommerceProducts, { ...ep, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateEcommerceProduct: (id, partial) => set((s) => ({
        ecommerceProducts: s.ecommerceProducts.map(p => p.id === id ? { ...p, ...partial, updatedAt: now() } : p)
      })),
      deleteEcommerceProduct: (id) => set((s) => ({ ecommerceProducts: s.ecommerceProducts.filter(p => p.id !== id) })),
      wechatArticles: defaultState.wechatArticles,
      addWechatArticle: (a) => {
        const id = uid();
        set((s) => ({ wechatArticles: [...s.wechatArticles, { ...a, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateWechatArticle: (id, partial) => set((s) => ({
        wechatArticles: s.wechatArticles.map(a => a.id === id ? { ...a, ...partial, updatedAt: now() } : a)
      })),
      deleteWechatArticle: (id) => set((s) => ({ wechatArticles: s.wechatArticles.filter(a => a.id !== id) })),
      videoProjects: defaultState.videoProjects,
      addVideoProject: (v) => {
        const id = uid();
        set((s) => ({ videoProjects: [...s.videoProjects, { ...v, id, createdAt: now(), updatedAt: now() }] }));
        return id;
      },
      updateVideoProject: (id, partial) => set((s) => ({
        videoProjects: s.videoProjects.map(v => v.id === id ? { ...v, ...partial, updatedAt: now() } : v)
      })),
      deleteVideoProject: (id) => set((s) => ({ videoProjects: s.videoProjects.filter(v => v.id !== id) })),
      healthRecords: defaultState.healthRecords,
      addHealthRecord: (r) => {
        const id = uid();
        set((s) => ({ healthRecords: [...s.healthRecords, { ...r, id }] }));
        return id;
      },
      updateHealthRecord: (id, partial) => set((s) => ({
        healthRecords: s.healthRecords.map(r => r.id === id ? { ...r, ...partial } : r)
      })),
      deleteHealthRecord: (id) => set((s) => ({ healthRecords: s.healthRecords.filter(r => r.id !== id) })),

      // ==================== Data Export / Import ====================
      exportData: () => {
        const s = get();
        return {
          app: 'research-workbench-v2',
          version: 1,
          exportedAt: now(),
          data: {
            settings: s.settings,
            reminderConfig: s.reminderConfig,
            goals: s.goals,
            projects: s.projects,
            milestones: s.milestones,
            habits: s.habits,
            checkIns: s.checkIns,
            focusSessions: s.focusSessions,
            reviews: s.reviews,
            evidences: s.evidences,
            tasks: s.tasks,
            literatures: s.literatures,
            theories: s.theories,
            methods: s.methods,
            shortPapers: s.shortPapers,
            thesis: s.thesis,
            researchIdeas: s.researchIdeas,
            policies: s.policies,
            cases: s.cases,
            reports: s.reports,
            readingNotes: s.readingNotes,
            financePlans: s.financePlans,
            financeRecords: s.financeRecords,
            languageLearnings: s.languageLearnings,
            learningTasks: s.learningTasks,
            ecommerceProducts: s.ecommerceProducts,
            wechatArticles: s.wechatArticles,
            videoProjects: s.videoProjects,
            healthRecords: s.healthRecords,
          },
        };
      },
      importData: (payload) => {
        const { data } = payload;
        if (!data) throw new Error('无效的备份文件格式');
        const fields = [
          'settings', 'reminderConfig', 'goals', 'projects', 'milestones',
          'habits', 'checkIns', 'focusSessions', 'reviews', 'evidences',
          'tasks', 'literatures', 'theories', 'methods', 'shortPapers',
          'thesis', 'researchIdeas', 'policies', 'cases', 'reports',
          'readingNotes', 'financePlans', 'financeRecords',
          'languageLearnings', 'learningTasks', 'ecommerceProducts',
          'wechatArticles', 'videoProjects', 'healthRecords',
        ] as const;
        const clean: Record<string, unknown> = {};
        for (const field of fields) {
          if (field in data) {
            clean[field] = data[field];
          }
        }
        set(clean as Partial<AppStore>);
      },
    }),
    { name: 'research-workbench-v2', version: 2 }
  )
);
