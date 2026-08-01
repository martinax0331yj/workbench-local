import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ConfirmDialog } from '../components/common';
import type { Task, Habit, CheckIn, CheckInTemplateType, FocusSession } from '../types';
import {
  Star, Clock, AlertTriangle, Target, CheckCircle2, Circle,
  Timer, Play, Square, MoreHorizontal, X, Plus, BarChart3,
  Zap, TrendingUp, Calendar, ChevronRight, BookOpen, Flag,
  Dumbbell, Edit3, FileText, Globe, ShoppingBag, MessageCircle,
  Video, Heart, Scale, RefreshCw, Send, ArrowRight,
} from 'lucide-react';

const todayStr = new Date().toISOString().split('T')[0];
const now = new Date();
const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const todayName = dayNames[now.getDay()];

const templateIcons: Record<CheckInTemplateType, typeof BookOpen> = {
  literature: BookOpen, theory: BookOpen, method: BookOpen, 'paper-writing': Edit3,
  policy: Globe, case: Globe, report: FileText, language: Globe,
  ecommerce: ShoppingBag, wechat: MessageCircle, video: Video, health: Heart,
};

const templateLabels: Record<CheckInTemplateType, string> = {
  literature: '文献阅读', theory: '理论学习', method: '方法学习', 'paper-writing': '论文写作',
  policy: '政策阅读', case: '案例整理', report: '报告写作', language: '多语种学习',
  ecommerce: '电商调研', wechat: '公众号', video: '视频制作', health: '体重饮食管理',
};

const templateOutputLabels: Record<CheckInTemplateType, string> = {
  literature: '阅读篇数', theory: '学完理论数', method: '方法练习数',
  'paper-writing': '写作字数', policy: '政策篇数', case: '案例数',
  report: '报告章节', language: '练习任务数', ecommerce: '调研项数',
  wechat: '文章进度', video: '视频进度', health: '三餐记录+体重',
};

const qualityLabels = ['未评估', '较低', '一般', '良好', '优秀', '卓越'];

// ==================== 子组件 ====================

function FocusTimer({ onDone }: { onDone: (session: { plannedDuration: number; actualDuration: number; notes: string; interrupted: boolean }) => void }) {
  const [stage, setStage] = useState<'idle' | 'planning' | 'running' | 'done'>('idle');
  const [plannedMin, setPlannedMin] = useState(25);
  const [elapsed, setElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
  const [interrupted, setInterrupted] = useState(false);
  const [notes, setNotes] = useState('');

  const start = () => {
    setStage('running');
    setElapsed(0);
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    setIntervalId(id);
  };

  const stop = () => {
    if (intervalId) clearInterval(intervalId);
    setStage('done');
  };

  const finish = () => {
    onDone({ plannedDuration: plannedMin, actualDuration: Math.round(elapsed / 60), notes, interrupted });
    setStage('idle');
    setElapsed(0);
    setNotes('');
    setInterrupted(false);
  };

  const cancel = () => {
    if (intervalId) clearInterval(intervalId);
    setStage('idle');
    setElapsed(0);
  };

  const fmtSec = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
      {stage === 'idle' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Timer size={16} className="text-amber-600" />
            </div>
            <h3 className="font-medium text-text-primary">开始专注</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted flex-shrink-0">计划时长</span>
            <div className="flex items-center gap-2">
              {[25, 45, 60, 90, 120].map(m => (
                <button
                  key={m}
                  onClick={() => setPlannedMin(m)}
                  className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-colors ${
                    plannedMin === m ? 'bg-warm-brown text-white' : 'bg-gray-50 text-text-secondary hover:bg-gray-100'
                  }`}
                >
                  {m}min
                </button>
              ))}
            </div>
          </div>
          <button onClick={start} className="w-full py-2.5 bg-warm-brown text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-warm-brown/90 transition-colors">
            <Play size={16} /> 开始专注
          </button>
        </div>
      )}

      {stage === 'running' && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center animate-pulse">
              <Timer size={16} className="text-amber-600" />
            </div>
            <h3 className="font-medium text-text-primary">专注中...</h3>
          </div>
          <div className="text-4xl font-mono font-bold text-text-primary">{fmtSec(elapsed)}</div>
          <p className="text-sm text-text-muted">计划 {plannedMin} 分钟 | 勿扰模式</p>
          <div className="flex items-center gap-3 justify-center">
            <button onClick={() => setInterrupted(!interrupted)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${interrupted ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-text-secondary hover:bg-gray-100'}`}>
              {interrupted ? '已标记中断' : '标记中断'}
            </button>
            <button onClick={stop} className="px-4 py-1.5 bg-warm-brown text-white rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-warm-brown/90">
              <Square size={14} /> 结束
            </button>
          </div>
        </div>
      )}

      {stage === 'done' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-green-600">{fmtSec(elapsed)}</div>
            <p className="text-sm text-text-muted mt-1">实际 {Math.round(elapsed / 60)} 分钟 | 计划 {plannedMin} 分钟</p>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="记录这段专注的感受和收获..."
            className="w-full text-sm rounded-xl border border-gray-200 p-3 h-20 resize-none focus:outline-none focus:border-warm-brown/30 placeholder:text-text-muted"
          />
          <div className="flex gap-3">
            <button onClick={cancel} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium text-text-secondary hover:bg-gray-50">
              取消
            </button>
            <button onClick={finish} className="flex-1 py-2 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90">
              保存记录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckInForm({ habit, onClose }: { habit: Habit; onClose: () => void }) {
  const { addCheckIn, addEvidence, tasks } = useStore();
  const [durationMin, setDurationMin] = useState(30);
  const [effortLevel, setEffortLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [output, setOutput] = useState('');
  const [outputCount, setOutputCount] = useState<number | undefined>();
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [nextAction, setNextAction] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    addCheckIn({
      habitId: habit.id,
      templateType: habit.templateType,
      date: todayStr,
      durationMinutes: durationMin,
      effortLevel,
      output,
      outputCount,
      quality,
      nextAction,
      evidenceIds: [],
      notes,
    });
    onClose();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-text-primary flex items-center gap-2">
          {(() => { const I = templateIcons[habit.templateType] || BookOpen; return <I size={16} className="text-warm-brown" />; })()}
          {habit.title} · 打卡
        </h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-50"><X size={16} className="text-text-muted" /></button>
      </div>

      {/* 行为投入 */}
      <div>
        <label className="text-xs font-medium text-text-muted mb-2 block">行为投入</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-text-muted">投入时长（分钟）</span>
            <input type="number" value={durationMin} onChange={e => setDurationMin(Number(e.target.value))}
              className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-warm-brown/30" />
          </div>
          <div>
            <span className="text-xs text-text-muted">投入程度</span>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(l => (
                <button key={l} onClick={() => setEffortLevel(l as 1 | 2 | 3 | 4 | 5)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${effortLevel >= l ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-text-muted'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 实际产出 */}
      <div>
        <label className="text-xs font-medium text-text-muted mb-2 block">实际产出</label>
        <textarea value={output} onChange={e => setOutput(e.target.value)}
          placeholder={`描述具体产出（如「完成XX文献精读」「写作XX字」）`}
          className="w-full rounded-xl border border-gray-200 p-3 text-sm h-20 resize-none focus:outline-none focus:border-warm-brown/30 placeholder:text-text-muted" />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-text-muted">{templateOutputLabels[habit.templateType] || '产出数量'}</span>
          <input type="number" value={outputCount ?? ''} onChange={e => setOutputCount(e.target.value ? Number(e.target.value) : undefined)}
            className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:border-warm-brown/30" />
        </div>
      </div>

      {/* 完成质量 */}
      <div>
        <label className="text-xs font-medium text-text-muted mb-1.5 block">完成质量</label>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map(l => (
            <button key={l} onClick={() => setQuality(l as 1 | 2 | 3 | 4 | 5)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${quality >= l ? 'bg-warm-brown text-white' : 'bg-gray-50 text-text-muted hover:bg-gray-100'}`}>
              {qualityLabels[l]}
            </button>
          ))}
        </div>
      </div>

      {/* 下一步行动 */}
      <div>
        <label className="text-xs font-medium text-text-muted mb-1.5 block">下一步行动</label>
        <input value={nextAction} onChange={e => setNextAction(e.target.value)}
          placeholder="明天继续做什么？"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-warm-brown/30 placeholder:text-text-muted" />
      </div>

      {/* 备注 */}
      <textarea value={notes} onChange={e => setNotes(e.target.value)}
        placeholder="备注（可选）"
        className="w-full rounded-xl border border-gray-200 p-3 text-sm h-16 resize-none focus:outline-none focus:border-warm-brown/30 placeholder:text-text-muted" />

      <button onClick={handleSubmit}
        disabled={!output.trim()}
        className="w-full py-2.5 bg-warm-brown text-white rounded-xl font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-warm-brown/90 transition-colors flex items-center justify-center gap-2">
        <CheckCircle2 size={16} /> 完成打卡
      </button>
    </div>
  );
}

function TaskRow({ task, onCheckIn }: { task: Task; onCheckIn?: () => void }) {
  const { toggleTask, postponeTask, deleteTask } = useStore();
  const [showActions, setShowActions] = useState(false);
  const [reasonInput, setReasonInput] = useState('');
  const [showPostpone, setShowPostpone] = useState(false);
  const isOverdue = task.deadline && new Date(task.deadline) < now && task.status !== 'completed';

  return (
    <div className={`group flex items-start gap-3 p-3 rounded-xl border transition-colors ${
      task.status === 'completed' ? 'bg-gray-50/50 border-gray-100 opacity-60' :
      isOverdue ? 'bg-red-50/30 border-red-100' : 'bg-white border-gray-100 hover:border-gray-200'
    }`}>
      <button onClick={() => toggleTask(task.id)} className="mt-0.5 flex-shrink-0">
        {task.status === 'completed'
          ? <CheckCircle2 size={20} className="text-warm-brown" />
          : <Circle size={20} className="text-text-muted" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-text-muted' : 'text-text-primary'}`}>
            {task.title}
          </span>
          {isOverdue && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-medium flex-shrink-0">已逾期</span>}
          {task.postponedCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 font-medium flex-shrink-0">
              顺延{task.postponedCount}次
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {task.projectName && <span className="text-xs text-text-muted">{task.projectName}</span>}
          {task.deadline && (
            <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-text-muted'}`}>
              <Clock size={11} /> {new Date(task.deadline).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
            </span>
          )}
          {task.estimatedDuration && <span className="text-xs text-text-muted">预计{task.estimatedDuration}min</span>}
          {task.notCompletedReason && task.status !== 'completed' && (
            <span className="text-xs text-red-500">原因：{task.notCompletedReason}</span>
          )}
        </div>
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1.5">
            {task.subtasks.map(st => (
              <span key={st.id} className={`text-[11px] px-2 py-0.5 rounded-full ${st.completed ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-text-muted'}`}>
                {st.completed ? '✓' : '○'} {st.title}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="relative flex-shrink-0">
        <button onClick={() => setShowActions(!showActions)} className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={14} className="text-text-muted" />
        </button>
        {showActions && (
          <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 w-40">
            {onCheckIn && task.status !== 'completed' && (
              <button onClick={() => { onCheckIn(); setShowActions(false); }} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
                <CheckCircle2 size={14} /> 完成打卡
              </button>
            )}
            <button onClick={() => { setShowPostpone(true); setShowActions(false); }} className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
              <RefreshCw size={14} /> 顺延任务
            </button>
            <button onClick={() => { deleteTask(task.id); setShowActions(false); }} className="w-full text-left px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
              <X size={14} /> 删除
            </button>
          </div>
        )}
      </div>

      {/* Postpone Modal */}
      {showPostpone && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="fixed inset-0 bg-black/20" onClick={() => setShowPostpone(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl p-5 w-full sm:max-w-sm z-10">
            <h4 className="font-medium text-text-primary mb-3">顺延任务</h4>
            <p className="text-sm text-text-secondary mb-3">{task.title}</p>
            <textarea value={reasonInput} onChange={e => setReasonInput(e.target.value)}
              placeholder="请填写顺延原因..."
              className="w-full rounded-xl border border-gray-200 p-3 text-sm h-20 resize-none focus:outline-none focus:border-warm-brown/30 placeholder:text-text-muted" />
            <div className="flex gap-3 mt-3">
              <button onClick={() => setShowPostpone(false)} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button
                onClick={() => {
                  if (reasonInput.trim()) {
                    postponeTask(task.id, reasonInput.trim());
                    setShowPostpone(false);
                    setReasonInput('');
                  }
                }}
                disabled={!reasonInput.trim()}
                className="flex-1 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium disabled:opacity-40"
              >
                确认顺延
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RiskAlert({ project, onClick }: { project: { id: string; title: string; progress: number; deadline?: string; atRisk?: boolean }; onClick: () => void }) {
  const daysLeft = project.deadline ? Math.ceil((new Date(project.deadline).getTime() - now.getTime()) / 86400000) : Infinity;
  if (daysLeft > 14 && (!project.atRisk || project.progress > 50)) return null;

  return (
    <button onClick={onClick} className="w-full text-left p-3 rounded-xl bg-red-50/50 border border-red-100 hover:bg-red-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
          <span className="text-sm font-medium text-text-primary truncate">{project.title}</span>
        </div>
        <span className="text-xs text-red-500 flex-shrink-0 ml-2">{daysLeft <= 0 ? '已过期' : `还有${daysLeft}天`}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-red-100 overflow-hidden">
          <div className="h-full rounded-full bg-red-400 transition-all" style={{ width: `${project.progress}%` }} />
        </div>
        <span className="text-xs text-red-500 font-medium">{project.progress}%</span>
      </div>
    </button>
  );
}

function DailyReviewForm({ onSaved }: { onSaved: () => void }) {
  const [show, setShow] = useState(false);
  const { reviews, addReview } = useStore();
  const todayReview = reviews.find(r => r.type === 'daily' && r.date === todayStr);

  if (todayReview) {
    return (
      <div className="bg-green-50/50 rounded-2xl border border-green-100 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-600" />
          <span className="text-sm font-medium text-green-700">今日已复盘</span>
        </div>
        <p className="text-xs text-green-600 mt-1.5 line-clamp-2">{todayReview.reflections}</p>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setShow(true)}
        className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-warm-brown/30 hover:text-warm-brown transition-colors flex items-center justify-center gap-2">
        <RefreshCw size={16} />
        <span className="text-sm font-medium">今日收尾复盘</span>
      </button>

      {show && <DailyReviewModal onClose={() => setShow(false)} onSaved={() => { setShow(false); onSaved(); }} />}
    </>
  );
}

function DailyReviewModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { tasks, checkIns, focusSessions, projects, literatures, addReview } = useStore();
  const [reflections, setReflections] = useState('');
  const [improvements, setImprovements] = useState('');
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(3);

  const todayTasks = tasks.filter(t => {
    if (t.status === 'completed') return t.updatedAt >= dayStart && t.updatedAt <= dayEnd;
    return true;
  });
  const completed = todayTasks.filter(t => t.status === 'completed');
  const uncompleted = todayTasks.filter(t => t.status !== 'completed');
  const todayCheckIns = checkIns.filter(c => c.date === todayStr);
  const todayFocus = focusSessions.filter(f => f.startTime >= dayStart);
  const totalFocusMin = todayFocus.reduce((sum, f) => sum + (f.actualDuration || 0), 0);

  const autoSummary = useMemo(() => {
    const totalTasks = todayTasks.length;
    const rate = totalTasks > 0 ? Math.round((completed.length / totalTasks) * 100) : 100;
    const moduleTime: Record<string, { label: string; minutes: number }> = {};
    todayCheckIns.forEach(c => {
      const k = c.templateType;
      moduleTime[k] = moduleTime[k] || { label: templateLabels[c.templateType] || k, minutes: 0 };
      moduleTime[k].minutes += c.durationMinutes || 0;
    });

    return {
      taskCompletionRate: rate,
      moduleTimeDistribution: Object.entries(moduleTime).map(([k, v]) => ({ module: k, label: v.label, minutes: v.minutes, percentage: 0 })),
      uncompletedTasks: uncompleted.map(t => ({ taskId: t.id, title: t.title, reason: t.notCompletedReason })),
    };
  }, [todayTasks, todayCheckIns, uncompleted]);

  const handleSave = () => {
    const totalMin = autoSummary.moduleTimeDistribution.reduce((s, m) => s + m.minutes, 0);
    const dist = autoSummary.moduleTimeDistribution.map(m => ({ ...m, percentage: totalMin > 0 ? Math.round((m.minutes / totalMin) * 100) : 0 }));

    const reasonCounts: Record<string, number> = {};
    uncompleted.forEach(t => {
      if (t.notCompletedReason) {
        reasonCounts[t.notCompletedReason] = (reasonCounts[t.notCompletedReason] || 0) + 1;
      }
    });

    addReview({
      type: 'daily',
      title: `${new Date().getMonth() + 1}月${new Date().getDate()}日收尾复盘`,
      date: todayStr,
      data: {
        taskCompletionRate: autoSummary.taskCompletionRate,
        projectProgress: [],
        moduleTimeDistribution: dist,
        effectiveOutput: todayCheckIns.map(c => c.output).filter(Boolean).join('；'),
        uncompletedTasks: autoSummary.uncompletedTasks,
        uncompletedReasons: Object.entries(reasonCounts).map(([reason, count]) => ({ reason, count })),
        upcomingDeadlines: [],
      },
      reflections,
      improvements,
      rating,
    });
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto z-10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">今日收尾复盘</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-50"><X size={16} /></button>
        </div>

        {/* Auto summary */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <p className="text-sm text-text-secondary">
            今日共 {todayTasks.length} 项任务，完成 {completed.length} 项（{autoSummary.taskCompletionRate}%），
            打卡 {todayCheckIns.length} 次，专注 {totalFocusMin} 分钟。
          </p>
          {uncompleted.length > 0 && (
            <div>
              <p className="text-xs font-medium text-text-muted mt-2">未完成任务：</p>
              {uncompleted.map(t => (
                <p key={t.id} className="text-xs text-text-secondary mt-1">• {t.title}</p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">反思</label>
          <textarea value={reflections} onChange={e => setReflections(e.target.value)}
            placeholder="今天做得好的是什么？哪里可以改进？"
            className="w-full rounded-xl border border-gray-200 p-3 text-sm h-24 resize-none focus:outline-none focus:border-warm-brown/30 placeholder:text-text-muted" />
        </div>

        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">改进措施</label>
          <textarea value={improvements} onChange={e => setImprovements(e.target.value)}
            placeholder="明天如何做得更好？"
            className="w-full rounded-xl border border-gray-200 p-3 text-sm h-20 resize-none focus:outline-none focus:border-warm-brown/30 placeholder:text-text-muted" />
        </div>

        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">今日自评</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(l => (
              <button key={l} onClick={() => setRating(l as 1 | 2 | 3 | 4 | 5)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${rating >= l ? 'bg-warm-brown text-white' : 'bg-gray-50 text-text-muted'}`}>
                {l}分
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave}
          className="w-full py-2.5 bg-warm-brown text-white rounded-xl font-medium text-sm hover:bg-warm-brown/90 transition-colors">
          保存复盘
        </button>
      </div>
    </div>
  );
}

// ==================== 主组件 ====================

export default function TodayPage() {
  const navigate = useNavigate();
  const {
    tasks, habits, checkIns, projects, focusSessions, goals,
    toggleTask, addCheckIn, addFocusSession,
  } = useStore();

  const [checkInTarget, setCheckInTarget] = useState<Habit | null>(null);
  const [timeBudgetExpanded, setTimeBudgetExpanded] = useState(false);
  const [showHabitManager, setShowHabitManager] = useState(false);

  // 今日任务（未完成 + 今天完成的）
  const todayTasks = useMemo(() => {
    return tasks
      .filter(t => {
        if (t.status === 'completed') return t.updatedAt >= dayStart && t.updatedAt <= dayEnd;
        return true;
      })
      .sort((a, b) => {
        const pOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return pOrder[a.priority] - pOrder[b.priority];
      });
  }, [tasks]);

  const top3 = todayTasks.slice(0, 3);

  // 今日习惯
  const todayHabits = useMemo(() => {
    return habits.filter(h => h.active && h.daysActive.includes(todayName));
  }, [habits]);

  const habitCheckInMap = useMemo(() => {
    const map: Record<string, CheckIn> = {};
    checkIns.filter(c => c.date === todayStr).forEach(c => {
      if (c.habitId) map[c.habitId] = c;
    });
    return map;
  }, [checkIns]);

  // 即将到期
  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(t => t.status !== 'completed' && t.deadline)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 5);
  }, [tasks]);

  // 项目风险
  const atRiskProjects = useMemo(() => {
    return projects
      .filter(p => p.status !== 'completed')
      .map(p => {
        const daysLeft = p.deadline ? Math.ceil((new Date(p.deadline).getTime() - now.getTime()) / 86400000) : Infinity;
        const atRisk = daysLeft <= 14 || p.progress < 30;
        return { ...p, daysLeft, atRisk };
      })
      .filter(p => p.atRisk || (p.deadline && p.daysLeft <= 14))
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);
  }, [projects]);

  // 时间预算
  const plannedMin = todayTasks.reduce((s, t) => s + (t.estimatedDuration || 0), 0);
  const todayFocusSessions = focusSessions.filter(f => f.startTime >= dayStart);
  const actualFocusMin = todayFocusSessions.reduce((s, f) => s + (f.actualDuration || 0), 0);
  const todayCheckInsList = checkIns.filter(c => c.date === todayStr);
  const checkInMin = todayCheckInsList.reduce((s, c) => s + (c.durationMinutes || 0), 0);

  // Weekly goal
  const weeklyGoal = goals.find(g => g.type === 'weekly' && g.status === 'active');

  const handleFocusDone = (session: { plannedDuration: number; actualDuration: number; notes: string; interrupted: boolean }) => {
    addFocusSession({
      startTime: new Date(now.getTime() - session.actualDuration * 60000).toISOString(),
      endTime: now.toISOString(),
      plannedDuration: session.plannedDuration,
      actualDuration: session.actualDuration,
      notes: session.notes,
      interrupted: session.interrupted,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-text-primary">今日执行</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>
        {weeklyGoal && (
          <div className="hidden sm:block max-w-[200px]">
            <span className="text-xs text-text-muted">本周目标</span>
            <p className="text-sm text-text-secondary mt-0.5 line-clamp-2">{weeklyGoal.title}</p>
          </div>
        )}
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Col */}
        <div className="space-y-4">
          {/* Top 3 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-500" />
                <h2 className="font-medium text-text-primary">今日重点</h2>
              </div>
              <span className="text-xs text-text-muted">{todayTasks.length}项</span>
            </div>
            {todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 size={32} className="text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-text-muted">今天没有待办任务</p>
                <button onClick={() => navigate('/calendar')} className="mt-2 text-sm text-warm-brown font-medium">去添加任务</button>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.map(t => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </div>
            )}
          </div>

          {/* 今日习惯 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-warm-brown" />
                <h2 className="font-medium text-text-primary">今日习惯</h2>
                <button onClick={() => setShowHabitManager(true)} className="text-xs text-warm-brown hover:underline ml-1">管理</button>
              </div>
              <span className="text-xs text-text-muted">
                {todayHabits.filter(h => habitCheckInMap[h.id]).length}/{todayHabits.length}
              </span>
            </div>
            {todayHabits.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">今天没有设定的习惯</p>
            ) : (
              <div className="space-y-2">
                {todayHabits.map(h => {
                  const checked = !!habitCheckInMap[h.id];
                  const ci = habitCheckInMap[h.id];
                  const Icon = templateIcons[h.templateType] || BookOpen;
                  return checkInTarget && checkInTarget.id === h.id ? (
                    <CheckInForm key={h.id} habit={h} onClose={() => setCheckInTarget(null)} />
                  ) : (
                    <div key={h.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${checked ? 'bg-green-50/50 border-green-100' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${checked ? 'bg-green-100' : 'bg-gray-50'}`}>
                        <Icon size={14} className={checked ? 'text-green-600' : 'text-text-muted'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${checked ? 'text-green-700 line-through' : 'text-text-primary'}`}>{h.title}</p>
                        {checked && ci && <p className="text-xs text-green-600 mt-0.5 truncate">{ci.output}</p>}
                      </div>
                      {checked ? (
                        <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <button onClick={() => setCheckInTarget(h)}
                          className="px-3 py-1 rounded-lg bg-warm-brown/10 text-warm-brown text-xs font-medium hover:bg-warm-brown/20 transition-colors flex-shrink-0">
                          打卡
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Focus Timer */}
          <FocusTimer onDone={handleFocusDone} />
        </div>

        {/* Right Col */}
        <div className="space-y-4">
          {/* Time Budget */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <button onClick={() => setTimeBudgetExpanded(!timeBudgetExpanded)} className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-warm-brown" />
                <h2 className="font-medium text-text-primary">今日时间预算</h2>
              </div>
              <ChevronRight size={16} className={`text-text-muted transition-transform ${timeBudgetExpanded ? 'rotate-90' : ''}`} />
            </button>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <p className="text-2xl font-bold text-text-primary">{plannedMin}</p>
                <p className="text-xs text-text-muted mt-1">计划(min)</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-amber-50">
                <p className="text-2xl font-bold text-amber-600">{actualFocusMin}</p>
                <p className="text-xs text-text-muted mt-1">专注(min)</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-green-50">
                <p className="text-2xl font-bold text-green-600">{checkInMin}</p>
                <p className="text-xs text-text-muted mt-1">打卡(min)</p>
              </div>
            </div>
            {timeBudgetExpanded && (
              <div className="mt-4 space-y-2">
                {todayTasks.filter(t => t.estimatedDuration).map(t => (
                  <div key={t.id} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary truncate flex-1 mr-3">{t.title}</span>
                    <span className="text-text-muted flex-shrink-0">{t.estimatedDuration}min</span>
                  </div>
                ))}
                {todayFocusSessions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-text-muted mb-2">今日专注记录</p>
                    {todayFocusSessions.map(fs => (
                      <div key={fs.id} className="flex items-center justify-between text-xs text-text-secondary py-1">
                        <span className="flex items-center gap-1">
                          <Timer size={10} /> {new Date(fs.startTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>{fs.actualDuration || fs.plannedDuration}min {fs.interrupted ? '(有中断)' : ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-red-400" />
              <h2 className="font-medium text-text-primary">即将到期</h2>
            </div>
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-text-muted py-3 text-center">暂无临近截止的任务</p>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.map(t => {
                  const daysLeft = Math.ceil((new Date(t.deadline!).getTime() - now.getTime()) / 86400000);
                  return (
                    <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                      <span className="text-sm text-text-primary truncate flex-1 mr-2">{t.title}</span>
                      <span className={`text-xs font-medium flex-shrink-0 ${daysLeft <= 0 ? 'text-red-500' : daysLeft <= 3 ? 'text-amber-600' : 'text-text-muted'}`}>
                        {daysLeft <= 0 ? '今日截止' : `${daysLeft}天后`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Project Risks */}
          {atRiskProjects.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-red-400" />
                <h2 className="font-medium text-text-primary">项目风险</h2>
              </div>
              <div className="space-y-2">
                {atRiskProjects.map(p => (
                  <RiskAlert key={p.id} project={p} onClick={() => navigate('/papers/thesis')} />
                ))}
              </div>
            </div>
          )}

          {/* Reminders */}
          <ReminderSection />

          {/* Daily Review */}
          <DailyReviewForm onSaved={() => {}} />
        </div>
      </div>

      {/* Habit Manager Modal */}
      {showHabitManager && <HabitManagerModal onClose={() => setShowHabitManager(false)} />}
    </div>
  );
}

// ==================== 习惯管理弹窗 ====================

function HabitManagerModal({ onClose }: { onClose: () => void }) {
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabitActive, reorderHabits, reminderConfig } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', module: 'academic' as Habit['module'],
    templateType: 'literature' as CheckInTemplateType, frequency: 'daily' as Habit['frequency'],
    targetCount: 1, unit: '次', planTime: '', needNote: false, daysActive: ['mon','tue','wed','thu','fri'],
  });

  const resetForm = () => setForm({
    title: '', description: '', module: 'academic', templateType: 'literature',
    frequency: 'daily', targetCount: 1, unit: '次', planTime: '', needNote: false,
    daysActive: ['mon','tue','wed','thu','fri'],
  });

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      updateHabit(editingId, {
        title: form.title, description: form.description, module: form.module,
        templateType: form.templateType, frequency: form.frequency,
        targetCount: form.targetCount, unit: form.unit, planTime: form.planTime || undefined,
        needNote: form.needNote, daysActive: form.daysActive,
      });
    } else {
      addHabit({
        title: form.title, description: form.description, module: form.module,
        templateType: form.templateType, frequency: form.frequency,
        targetCount: form.targetCount, unit: form.unit, planTime: form.planTime || undefined,
        needNote: form.needNote, daysActive: form.daysActive,
        linkedGoalIds: [], linkedProjectIds: [], active: true, sortOrder: habits.length,
        streak: 0, reminderTime: undefined,
      });
    }
    setEditingId(null); setShowAdd(false); resetForm();
  };

  function startEdit(h: Habit) {
    setEditingId(h.id); setShowAdd(true);
    setForm({
      title: h.title, description: h.description || '', module: h.module,
      templateType: h.templateType, frequency: h.frequency, targetCount: h.targetCount,
      unit: h.unit, planTime: h.planTime || '', needNote: h.needNote,
      daysActive: h.daysActive,
    });
  }

  const sorted = [...habits].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg mx-4 p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-text-primary">管理习惯</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"><X size={18} /></button>
        </div>

        {!showAdd ? (
          <>
            <button onClick={() => { setShowAdd(true); setEditingId(null); resetForm(); }}
              className="w-full mb-4 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-text-muted hover:border-warm-brown/30 hover:text-warm-brown transition-colors flex items-center justify-center gap-1.5">
              <Plus size={16} /> 添加新习惯
            </button>

            {sorted.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-6">暂无习惯，点击上方按钮添加</p>
            ) : (
              <div className="space-y-2">
                {sorted.map((h, idx) => {
                  const Icon = templateIcons[h.templateType] || BookOpen;
                  return (
                    <div key={h.id} className={`flex items-center gap-3 p-3 rounded-xl border ${h.active ? 'bg-white border-gray-100' : 'bg-gray-50/50 border-gray-100 opacity-50'}`}>
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className="text-text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{h.title}</p>
                        <p className="text-xs text-text-muted">{h.targetCount}{h.unit}/{h.frequency === 'daily' ? '天' : '周'} · {h.streak}天连续</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => toggleHabitActive(h.id)} className={`p-1.5 rounded-lg hover:bg-gray-100 text-xs ${h.active ? 'text-mint-green' : 'text-text-muted'}`} title={h.active ? '暂停' : '恢复'}>
                          {h.active ? <CheckCircle2 size={14} /> : <RefreshCw size={14} />}
                        </button>
                        <button onClick={() => startEdit(h)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted" title="编辑">
                          <Edit3 size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(h.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-400" title="删除">
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button onClick={() => { setShowAdd(false); setEditingId(null); resetForm(); }}
                className="p-1 rounded-lg hover:bg-gray-100 text-text-muted"><ArrowRight size={16} className="rotate-180" /></button>
              <h3 className="font-medium text-text-primary">{editingId ? '编辑习惯' : '新建习惯'}</h3>
            </div>

            <div>
              <label className="text-xs text-text-muted block mb-1.5">习惯名称 *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="如：每日文献阅读" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-muted block mb-1.5">所属领域</label>
                <select value={form.module} onChange={e => setForm(f => ({ ...f, module: e.target.value as any }))}
                  className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none">
                  <option value="academic">学术研究</option><option value="paper">论文项目</option>
                  <option value="industry">行业研究</option><option value="learning">多语种学习</option>
                  <option value="finance">理财</option><option value="ecommerce">电商</option>
                  <option value="wechat">自媒体</option><option value="health">体重饮食</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">类型</label>
                <select value={form.templateType} onChange={e => setForm(f => ({ ...f, templateType: e.target.value as any }))}
                  className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none">
                  {Object.entries(templateLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-muted block mb-1.5">频率</label>
                <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value as any }))}
                  className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none">
                  <option value="daily">每天</option><option value="workday">工作日</option>
                  <option value="weekly">每周</option><option value="custom">自定义</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">每次目标量</label>
                <div className="flex gap-2">
                  <input type="number" value={form.targetCount} onChange={e => setForm(f => ({ ...f, targetCount: Number(e.target.value) }))}
                    className="flex-1 h-10 px-3 rounded-xl bg-cream border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none" />
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    className="w-16 h-10 px-2 rounded-xl bg-cream border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none">
                    <option>次</option><option>篇</option><option>页</option><option>字</option><option>分钟</option><option>个</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1.5">计划执行时间</label>
              <input type="time" value={form.planTime} onChange={e => setForm(f => ({ ...f, planTime: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1.5">生效日期</label>
              <div className="flex flex-wrap gap-1.5">
                {[{ v: 'mon', l: '一' }, { v: 'tue', l: '二' }, { v: 'wed', l: '三' }, { v: 'thu', l: '四' }, { v: 'fri', l: '五' }, { v: 'sat', l: '六' }, { v: 'sun', l: '日' }].map(d => (
                  <button key={d.v} onClick={() => setForm(f => ({
                    ...f, daysActive: f.daysActive.includes(d.v) ? f.daysActive.filter(x => x !== d.v) : [...f.daysActive, d.v]
                  }))}
                    className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors ${form.daysActive.includes(d.v) ? 'bg-warm-brown text-white' : 'bg-gray-50 text-text-muted hover:bg-gray-100'}`}>
                    周{d.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1.5">描述</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="简短描述这个习惯" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.needNote} onChange={e => setForm(f => ({ ...f, needNote: e.target.checked }))} id="needNote" className="rounded" />
              <label htmlFor="needNote" className="text-xs text-text-muted">打卡时要求填写备注</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowAdd(false); setEditingId(null); resetForm(); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors">
                {editingId ? '保存' : '创建'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) { deleteHabit(deleteTarget); setDeleteTarget(null); } }}
        title="删除习惯"
        message="删除后将无法恢复该习惯及其打卡历史。"
        itemName={habits.find(h => h.id === deleteTarget)?.title}
      />
    </div>
  );
}

// ==================== 督促提醒组件 ====================

function ReminderSection() {
  const { reminderConfig, tasks, habits, checkIns } = useStore();
  const reminders: { icon: typeof AlertTriangle; color: string; label: string; detail: string }[] = [];

  // 计划过量提醒
  const todayTaskCount = tasks.filter(t => t.status !== 'completed').length;
  if (reminderConfig.overloadReminder.enabled && reminderConfig.overloadReminder.maxTasksPerDay && todayTaskCount > reminderConfig.overloadReminder.maxTasksPerDay) {
    reminders.push({
      icon: AlertTriangle, color: 'text-amber-500',
      label: '计划过量提醒',
      detail: `今日未完成任务 ${todayTaskCount} 项，超过建议上限 ${reminderConfig.overloadReminder.maxTasksPerDay} 项，建议调整优先级`,
    });
  }

  // 连续未推进提醒
  if (reminderConfig.consecutiveUnpushedReminder.enabled) {
    const todayHabits = habits.filter(h => h.active && h.daysActive.includes(todayName));
    const uncheckedToday = todayHabits.filter(h => !checkIns.some(c => c.habitId === h.id && c.date === todayStr));
    const threshold = reminderConfig.consecutiveUnpushedReminder.daysThreshold || 3;

    // Check for habits that haven't been checked for multiple days
    const pastDays: string[] = [];
    for (let i = 0; i < threshold; i++) {
      const d = new Date(now.getTime() - i * 86400000);
      pastDays.push(d.toISOString().split('T')[0]);
    }

    habits.filter(h => h.active).forEach(h => {
      const uncheckedDays = pastDays.filter(d => !checkIns.some(c => c.habitId === h.id && c.date === d));
      if (uncheckedDays.length >= threshold) {
        reminders.push({
          icon: RefreshCw, color: 'text-amber-500',
          label: '连续未推进',
          detail: `「${h.title}」已连续 ${uncheckedDays.length} 天未打卡`,
        });
      }
    });
  }

  if (reminders.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-amber-500" />
        <h2 className="font-medium text-text-primary">督促提醒</h2>
        <button onClick={() => window.location.href = '/settings'} className="text-xs text-warm-brown hover:underline ml-auto">配置</button>
      </div>
      <div className="space-y-2">
        {reminders.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={i} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
              <div className="flex items-center gap-2">
                <Icon size={14} className={r.color} />
                <span className="text-xs font-medium text-text-primary">{r.label}</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">{r.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
