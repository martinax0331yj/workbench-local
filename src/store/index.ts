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
  toggleStarLiterature: (id: string) => void;
  deleteLiterature: (id: string) => void;
  updateLiteratureStatus: (id: string, status: Literature['readingStatus']) => void;

  theories: Theory[];
  deleteTheory: (id: string) => void;

  methods: Method[];
  deleteMethod: (id: string) => void;

  shortPapers: ShortPaper[];
  updateShortPaper: (id: string, partial: Partial<ShortPaper>) => void;

  thesis: Thesis | null;
  updateThesis: (partial: Partial<Thesis>) => void;

  researchIdeas: ResearchIdea[];
  updateResearchIdea: (id: string, partial: Partial<ResearchIdea>) => void;

  policies: Policy[];
  cases: CaseStudy[];
  reports: Report[];
  readingNotes: ReadingNote[];

  financePlans: FinancePlan[];
  financeRecords: FinanceRecord[];

  languageLearnings: LanguageLearning[];
  learningTasks: LearningTask[];
  toggleLearningTask: (id: string) => void;

  ecommerceProducts: EcommerceProduct[];
  wechatArticles: WechatArticle[];
  videoProjects: VideoProject[];
  healthRecords: HealthRecord[];

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
      toggleStarLiterature: (id) => set((s) => ({
        literatures: s.literatures.map(l => l.id === id ? { ...l, starred: !l.starred } : l)
      })),
      deleteLiterature: (id) => set((s) => ({ literatures: s.literatures.filter(l => l.id !== id) })),
      updateLiteratureStatus: (id, status) => set((s) => ({
        literatures: s.literatures.map(l => l.id === id ? { ...l, readingStatus: status } : l)
      })),

      theories: defaultState.theories,
      deleteTheory: (id) => set((s) => ({ theories: s.theories.filter(t => t.id !== id) })),
      methods: defaultState.methods,
      deleteMethod: (id) => set((s) => ({ methods: s.methods.filter(m => m.id !== id) })),

      shortPapers: defaultState.shortPapers,
      updateShortPaper: (id, partial) => set((s) => ({
        shortPapers: s.shortPapers.map(p => p.id === id ? { ...p, ...partial } : p)
      })),
      thesis: defaultState.thesis,
      updateThesis: (partial) => set((s) => ({ thesis: s.thesis ? { ...s.thesis, ...partial } : null })),
      researchIdeas: defaultState.researchIdeas,
      updateResearchIdea: (id, partial) => set((s) => ({
        researchIdeas: s.researchIdeas.map(i => i.id === id ? { ...i, ...partial } : i)
      })),

      policies: defaultState.policies,
      cases: defaultState.cases,
      reports: defaultState.reports,
      readingNotes: defaultState.readingNotes,

      financePlans: defaultState.financePlans,
      financeRecords: defaultState.financeRecords,
      languageLearnings: defaultState.languageLearnings,
      learningTasks: defaultState.learningTasks,
      toggleLearningTask: (id) => set((s) => ({
        learningTasks: s.learningTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),
      ecommerceProducts: defaultState.ecommerceProducts,
      wechatArticles: defaultState.wechatArticles,
      videoProjects: defaultState.videoProjects,
      healthRecords: defaultState.healthRecords,

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
    { name: 'research-workbench-v2' }
  )
);
