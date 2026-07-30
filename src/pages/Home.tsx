import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import {
  Star, AlertTriangle, Target, BookOpen, Briefcase, TrendingUp,
  CheckCircle2, Clock, Zap, ChevronRight, FileText, Calendar,
  Play, RefreshCw, BarChart3, CheckCheck,
} from 'lucide-react';
import type { Task, Habit, CheckIn, Project } from '../types';

const now = new Date();
const todayStr = now.toISOString().split('T')[0];
const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
const weekStart = (() => {
  const monday = new Date(now);
  monday.setDate(monday.getDate() - monday.getDay() + 1);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
})();
const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const todayName = dayNames[now.getDay()];

export default function Home() {
  const navigate = useNavigate();
  const {
    settings, tasks, habits, checkIns, projects, milestones,
    reviews, focusSessions, goals, literatures,
    toggleTask, updateTask,
  } = useStore();

  // ===== Today's Priority =====
  const todayTasks = useMemo(() => tasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => {
      const pOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (pOrder[a.priority] ?? 3) - (pOrder[b.priority] ?? 3);
    })
    .slice(0, 3), [tasks]);

  const todayCompleted = useMemo(() => tasks.filter(t =>
    t.status === 'completed' && t.updatedAt >= dayStart
  ).length, [tasks]);

  // ===== Project Risks =====
  const atRiskProjects = useMemo(() => projects
    .filter(p => p.status !== 'completed')
    .map(p => {
      const daysLeft = p.deadline ? Math.ceil((new Date(p.deadline).getTime() - now.getTime()) / 86400000) : Infinity;
      const risk = daysLeft <= 7 || (daysLeft <= 14 && p.progress < 40);
      return { ...p, daysLeft, risk };
    })
    .filter(p => p.risk)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3), [projects]);

  // ===== Today's Habits =====
  const todayHabits = useMemo(() => habits
    .filter(h => h.active && h.daysActive.includes(todayName)), [habits]);

  const todayCheckInMap = useMemo(() => {
    const map: Record<string, CheckIn> = {};
    checkIns.filter(c => c.date === todayStr).forEach(c => {
      if (c.habitId) map[c.habitId] = c;
    });
    return map;
  }, [checkIns]);

  const habitsDone = todayHabits.filter(h => todayCheckInMap[h.id]).length;

  // ===== Current Project =====
  const currentProject = useMemo(() => {
    const active = projects.filter(p => p.status === 'active');
    return active.sort((a, b) => b.progress - a.progress).slice(0, 2);
  }, [projects]);

  // ===== Active milestones count =====
  const activeMilestones = useMemo(() =>
    milestones.filter(m => m.status === 'in-progress' || m.status === 'pending'),
  [milestones]);

  // ===== This Week Stats =====
  const weekStats = useMemo(() => {
    const weekTasks = tasks.filter(t => t.status === 'completed' && t.updatedAt >= weekStart);
    const weekCheckIns = checkIns.filter(c => c.date >= weekStart.slice(0, 10));
    const weekFocus = focusSessions.filter(f => f.startTime >= weekStart);
    const focusMin = weekFocus.reduce((s, f) => s + (f.actualDuration || 0), 0);
    return {
      tasksDone: weekTasks.length,
      checkIns: weekCheckIns.length,
      focusMin,
    };
  }, [tasks, checkIns, focusSessions]);

  // ===== Latest Review =====
  const latestReview = useMemo(() => reviews
    .filter(r => r.type === 'weekly')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0],
  [reviews]);

  // ===== Has today review? =====
  const hasTodayReview = reviews.some(r => r.type === 'daily' && r.date === todayStr);

  // ===== Goals active count =====
  const activeGoals = goals.filter(g => g.status === 'active');

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-text-primary">
            {settings.userName}，{now.getHours() < 12 ? '上午好' : now.getHours() < 18 ? '下午好' : '晚上好'}
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            {now.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
            {settings.weeklyGoal && <span className="ml-2">· {settings.weeklyGoal}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/today')}
            className="px-4 py-2 rounded-xl bg-warm-brown text-white text-sm font-medium flex items-center gap-1.5 hover:bg-warm-brown/90 transition-colors">
            <Play size={14} /> 今日执行
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* 1. 今日重点 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Star size={14} className="text-amber-500" />
                </div>
                <h2 className="font-medium text-text-primary">今日重点</h2>
              </div>
              <button onClick={() => navigate('/calendar')} className="text-xs text-warm-brown hover:underline">
                查看全部
              </button>
            </div>
            {todayTasks.length === 0 ? (
              <p className="text-sm text-text-muted py-6 text-center">今天没有待办，去添加任务吧</p>
            ) : (
              <div className="space-y-1.5">
                {todayTasks.map(t => (
                  <button
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      t.status === 'completed' ? 'bg-warm-brown border-warm-brown' : 'border-gray-300 group-hover:border-warm-brown'
                    }`}>
                      {t.status === 'completed' && <CheckCheck size={12} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${t.status === 'completed' ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                        {t.title}
                      </p>
                      {t.projectName && <p className="text-xs text-text-muted mt-0.5">{t.projectName}</p>}
                    </div>
                    {t.deadline && (
                      <span className={`text-xs flex-shrink-0 ${new Date(t.deadline) < now ? 'text-red-500' : 'text-text-muted'}`}>
                        {new Date(t.deadline).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
                      </span>
                    )}
                    {t.priority === 'urgent' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 flex-shrink-0">紧急</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. 项目风险 */}
          {atRiskProjects.length > 0 && (
            <div className="bg-white rounded-2xl border border-red-50 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                  <AlertTriangle size={14} className="text-red-500" />
                </div>
                <h2 className="font-medium text-text-primary">项目风险</h2>
              </div>
              <div className="space-y-2">
                {atRiskProjects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { if (p.module === 'paper') navigate('/papers/thesis'); else navigate('/industry/reports'); }}
                    className="w-full text-left p-3 rounded-xl bg-red-50/50 border border-red-100 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">{p.title}</span>
                      <span className="text-xs text-red-500 flex-shrink-0 ml-2">
                        {p.daysLeft <= 0 ? '已逾期' : `还有${p.daysLeft}天`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-red-100 overflow-hidden">
                        <div className="h-full rounded-full bg-red-400" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs text-red-500 font-medium">{p.progress}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. 今日习惯 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                  <Target size={14} className="text-green-500" />
                </div>
                <h2 className="font-medium text-text-primary">今日习惯</h2>
              </div>
              <span className="text-xs text-text-muted">{habitsDone}/{todayHabits.length}</span>
            </div>
            {todayHabits.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">今天没有活跃习惯</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {todayHabits.map(h => {
                  const done = !!todayCheckInMap[h.id];
                  return (
                    <button
                      key={h.id}
                      onClick={() => navigate('/today')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        done ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-text-secondary border border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {done ? '✓ ' : '○ '}{h.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* 4. 当前重点项目 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Briefcase size={14} className="text-blue-500" />
                </div>
                <h2 className="font-medium text-text-primary">当前重点项目</h2>
              </div>
            </div>
            <div className="space-y-3">
              {currentProject.map(p => (
                <button
                  key={p.id}
                  onClick={() => { if (p.module === 'paper') navigate('/papers/thesis'); else navigate('/industry/reports'); }}
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary group-hover:text-warm-brown transition-colors">{p.title}</span>
                    <ChevronRight size={14} className="text-text-muted" />
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-warm-brown/60" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs text-text-muted">{p.progress}%</span>
                  </div>
                  {p.deadline && (
                    <p className="text-xs text-text-muted mt-1">
                      截止 {new Date(p.deadline).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </button>
              ))}
              {activeMilestones.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs font-medium text-text-muted mb-2">
                    进行中里程碑 ({activeMilestones.filter(m => m.status === 'in-progress').length})
                  </p>
                  {activeMilestones.slice(0, 3).map(m => (
                    <div key={m.id} className="flex items-center justify-between py-1">
                      <span className="text-sm text-text-secondary truncate flex-1 mr-2">{m.title}</span>
                      <span className={`text-xs flex-shrink-0 ${m.status === 'in-progress' ? 'text-warm-brown' : 'text-text-muted'}`}>
                        {m.status === 'in-progress' ? '进行中' : '待开始'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 5. 本周成果与复盘 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                  <RefreshCw size={14} className="text-purple-500" />
                </div>
                <h2 className="font-medium text-text-primary">本周成果</h2>
              </div>
              <button onClick={() => navigate('/review')} className="text-xs text-warm-brown hover:underline flex items-center gap-1">
                复盘 <ChevronRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 rounded-xl bg-blue-50/50">
                <p className="text-xl font-bold text-blue-600">{weekStats.tasksDone}</p>
                <p className="text-xs text-text-muted mt-0.5">完成任务</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-green-50/50">
                <p className="text-xl font-bold text-green-600">{weekStats.checkIns}</p>
                <p className="text-xs text-text-muted mt-0.5">打卡次数</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-amber-50/50">
                <p className="text-xl font-bold text-amber-600">{Math.round(weekStats.focusMin / 60)}h</p>
                <p className="text-xs text-text-muted mt-0.5">专注时间</p>
              </div>
            </div>

            {/* Today review status */}
            {hasTodayReview ? (
              <div className="p-3 rounded-xl bg-green-50/50 border border-green-100 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-600" />
                <span className="text-sm text-green-700">今日已复盘</span>
              </div>
            ) : (
              <button onClick={() => navigate('/review')}
                className="w-full p-3 rounded-xl border-2 border-dashed border-gray-200 text-text-muted hover:border-warm-brown/30 hover:text-warm-brown transition-colors flex items-center justify-center gap-2">
                <RefreshCw size={14} /> <span className="text-sm">开始今日复盘</span>
              </button>
            )}

            {/* Latest weekly review hint */}
            {latestReview && (
              <div className="mt-3 p-3 rounded-xl bg-gray-50/50">
                <p className="text-xs text-text-muted">上次周复盘</p>
                <p className="text-sm text-text-secondary mt-0.5 line-clamp-1">{latestReview.reflections}</p>
              </div>
            )}
          </div>

          {/* 6. 收件箱 & 数据概览 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <h2 className="font-medium text-text-primary mb-3">数据概览</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/calendar')} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <Calendar size={14} className="text-warm-brown" />
                <div className="text-left">
                  <p className="text-lg font-bold text-text-primary">{tasks.filter(t => t.status !== 'completed').length}</p>
                  <p className="text-xs text-text-muted">待处理任务</p>
                </div>
              </button>
              <button onClick={() => navigate('/today')} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <Zap size={14} className="text-warm-brown" />
                <div className="text-left">
                  <p className="text-lg font-bold text-text-primary">{focusSessions.length}</p>
                  <p className="text-xs text-text-muted">专注记录</p>
                </div>
              </button>
              <button onClick={() => navigate('/review')} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <CheckCircle2 size={14} className="text-warm-brown" />
                <div className="text-left">
                  <p className="text-lg font-bold text-text-primary">{checkIns.length}</p>
                  <p className="text-xs text-text-muted">总打卡</p>
                </div>
              </button>
              <button onClick={() => navigate('/academic/literature')} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <BookOpen size={14} className="text-warm-brown" />
                <div className="text-left">
                  <p className="text-lg font-bold text-text-primary">{literatures.length}</p>
                  <p className="text-xs text-text-muted">文献库</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
