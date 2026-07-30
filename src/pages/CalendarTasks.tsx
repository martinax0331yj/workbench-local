import { useState } from 'react';
import { Calendar as CalendarIcon, List, Check, Timer, Clock, ChevronRight, LayoutDashboard, Plus, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';
import { formatDateShort, formatRelative } from '../utils';
import type { Task, Priority, ModuleType } from '../types';

const priorityLabels: Record<string, string> = { urgent: '紧急', high: '优先', medium: '普通', low: '低' };
const priorityColors: Record<string, string> = {
  urgent: 'bg-red-50 text-red-500', high: 'bg-orange-50 text-warm-brown',
  medium: 'bg-blue-50 text-mist-blue', low: 'bg-gray-100 text-text-muted',
};

export default function CalendarTasks() {
  const { tasks, projects, goals, milestones, toggleTask, deleteTask, addTask, postponeTask } = useStore();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'overdue'>('all');
  const [showAdd, setShowAdd] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const weekLater = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  let filtered = tasks;
  if (filter === 'today') filtered = tasks.filter(t => t.deadline === today);
  else if (filter === 'overdue') filtered = tasks.filter(t => t.deadline && t.deadline < today && t.status !== 'completed');
  else if (filter === 'week') filtered = tasks.filter(t => t.deadline && t.deadline >= today && t.deadline <= weekLater);

  const columns = ['todo', 'in-progress', 'completed'] as const;
  const statusLabels: Record<string, string> = { 'todo': '待开始', 'in-progress': '进行中', 'completed': '已完成' };

  const overdueCount = tasks.filter(t => t.deadline && t.deadline < today && t.status !== 'completed').length;
  const postponedHeavy = tasks.filter(t => t.postponedCount >= 2 && t.status !== 'completed');

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">日历与任务</h1>
          <p className="text-body-sm text-text-muted mt-1">
            {tasks.filter(t => t.status === 'completed').length}/{tasks.length} 已完成 · {overdueCount} 已逾期
            {postponedHeavy.length > 0 && <span className="ml-2 text-amber-500">· {postponedHeavy.length} 个多次顺延</span>}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-warm-brown text-white rounded-xl text-sm font-medium self-start sm:self-auto">
          <Plus size={15} /> 添加任务
        </button>
      </div>

      {/* View + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
        <div className="flex bg-white border border-gray-100 rounded-xl overflow-hidden self-start">
          <button onClick={() => setView('list')} className={`px-3 py-2 text-sm ${view === 'list' ? 'bg-cream text-warm-brown' : 'text-text-muted'}`}>
            <List size={15} />
          </button>
          <button onClick={() => setView('kanban')} className={`px-3 py-2 text-sm ${view === 'kanban' ? 'bg-cream text-warm-brown' : 'text-text-muted'}`}>
            <LayoutDashboard size={15} />
          </button>
        </div>
        <div className="flex overflow-x-auto gap-1.5 scrollbar-thin">
          {[
            { key: 'all' as const, label: '全部' },
            { key: 'today' as const, label: '今日' },
            { key: 'week' as const, label: '近7天' },
            { key: 'overdue' as const, label: '已逾期' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap ${filter === f.key ? 'bg-warm-brown text-white' : 'bg-white border border-gray-100 text-text-secondary hover:bg-cream'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-1.5">
          {filtered.length === 0 ? (
            <div className="card text-center py-10">
              <CalendarIcon size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
              <p className="text-text-secondary text-body-sm">暂无任务</p>
            </div>
          ) : (
            filtered.map(task => (
              <TaskRow key={task.id} task={task} />
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {columns.map(col => {
            const colTasks = filtered.filter(t => t.status === col);
            return (
              <div key={col} className="card !p-3 sm:!p-4 min-h-[200px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-text-primary">{statusLabels[col]}</h3>
                  <span className="text-caption text-text-muted">{colTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {colTasks.length === 0 ? (
                    <p className="text-caption text-text-muted text-center py-4">暂无</p>
                  ) : (
                    colTasks.map(task => (
                      <div key={task.id} onClick={() => toggleTask(task.id)} className="p-2.5 rounded-xl bg-cream/40 hover:bg-cream cursor-pointer transition-colors">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityColors[task.priority]}`}>{priorityLabels[task.priority]}</span>
                          {task.postponedCount > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600">顺延×{task.postponedCount}</span>}
                        </div>
                        <p className="text-[13px] font-medium text-text-primary line-clamp-2">{task.title}</p>
                        {task.projectName && <p className="text-[10px] text-warm-brown mt-0.5">{task.projectName}</p>}
                        {task.deadline && <p className="text-[10px] text-text-muted mt-1">{task.deadline}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

// ==================== Task Row ====================
function TaskRow({ task }: { task: Task }) {
  const { toggleTask, deleteTask, postponeTask } = useStore();
  const [showPostpone, setShowPostpone] = useState(false);
  const [reason, setReason] = useState('');
  const isOverdue = task.deadline && task.deadline < new Date().toISOString().split('T')[0] && task.status !== 'completed';

  return (
    <div className={`card !p-3 sm:!p-4 flex items-start gap-3 group ${isOverdue ? 'border-red-100 bg-red-50/30' : ''}`}>
      <button onClick={() => toggleTask(task.id)} className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        task.status === 'completed' ? 'bg-warm-brown border-warm-brown' : 'border-gray-200'
      }`}>
        {task.status === 'completed' && <Check size={11} className="text-white" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-text-muted' : 'text-text-primary'}`}>{task.title}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityColors[task.priority] || 'bg-gray-100'}`}>{priorityLabels[task.priority]}</span>
          {isOverdue && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-500">已逾期</span>}
          {task.postponedCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600">
              <RefreshCw size={9} className="inline mr-0.5" />顺延{task.postponedCount}次
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-caption text-text-muted">
          {task.module && <span>{task.module === 'academic' ? '学术' : task.module === 'paper' ? '论文' : task.module === 'industry' ? '行业' : task.module === 'learning' ? '成长' : task.module}</span>}
          {task.projectName && <span className="text-warm-brown">{task.projectName}</span>}
          {task.deadline && <span className="flex items-center gap-0.5"><Clock size={10} />{task.deadline}</span>}
          {task.estimatedDuration && <span className="flex items-center gap-0.5"><Timer size={10} />{task.estimatedDuration}min</span>}
        </div>
        {task.postponementReasons.length > 0 && (
          <div className="mt-1.5">
            {task.postponementReasons.map((r, i) => (
              <span key={i} className="text-[10px] text-amber-500 mr-2">「{r}」</span>
            ))}
          </div>
        )}
        {task.notCompletedReason && task.status !== 'completed' && (
          <p className="text-xs text-red-500 mt-1">未完成原因：{task.notCompletedReason}</p>
        )}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {task.subtasks.map(sub => (
              <span key={sub.id} className={`text-[10px] px-1.5 py-0.5 rounded-full ${sub.completed ? 'bg-mint-light/20 text-mint-green' : 'bg-gray-50 text-text-muted'}`}>
                {sub.completed ? '✓' : '○'} {sub.title}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {task.status !== 'completed' && (
          <button onClick={(e) => { e.stopPropagation(); setShowPostpone(true); }}
            className="opacity-0 group-hover:opacity-100 text-[10px] text-amber-500 hover:text-amber-700 px-1 py-0.5 transition-opacity">
            顺延
          </button>
        )}
        <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
          className="opacity-0 group-hover:opacity-100 text-[10px] text-rose-400 hover:text-rose-600 px-2 py-0.5 transition-opacity">
          删除
        </button>
      </div>

      {/* Postpone Modal */}
      {showPostpone && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="fixed inset-0 bg-black/20" onClick={() => setShowPostpone(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl p-5 w-full sm:max-w-sm z-10">
            <h4 className="font-medium text-text-primary mb-3">顺延任务</h4>
            <p className="text-sm text-text-secondary mb-3">{task.title}</p>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              placeholder="请填写顺延原因..."
              className="w-full rounded-xl border border-gray-200 p-3 text-sm h-20 resize-none focus:outline-none focus:border-warm-brown/30 placeholder:text-text-muted" />
            <div className="flex gap-3 mt-3">
              <button onClick={() => setShowPostpone(false)} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={() => { if (reason.trim()) { postponeTask(task.id, reason.trim()); setShowPostpone(false); setReason(''); } }}
                disabled={!reason.trim()} className="flex-1 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium disabled:opacity-40">
                确认顺延
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Add Task Modal ====================
function AddTaskModal({ onClose }: { onClose: () => void }) {
  const { projects, goals, addTask } = useStore();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [projectId, setProjectId] = useState('');
  const [goalId, setGoalId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState<number | undefined>();
  const [module, setModule] = useState('');

  const activeProjects = projects.filter(p => p.status === 'active');
  const activeGoals = goals.filter(g => g.status === 'active');

  const handleSelectProject = (id: string) => {
    setProjectId(id);
    const p = projects.find(x => x.id === id);
    if (p) {
      setModule(p.module);
      if (p.linkedGoalIds.length > 0 && !goalId) setGoalId(p.linkedGoalIds[0]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const project = projects.find(p => p.id === projectId);
    addTask({
      title: title.trim(),
      module: module || undefined,
      projectId: projectId || undefined,
      projectName: project?.title,
      goalId: goalId || undefined,
      priority,
      deadline: deadline || undefined,
      estimatedDuration,
      status: 'todo',
      subtasks: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto z-10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">添加任务</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-50"><X size={16} /></button>
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">任务标题</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="输入任务标题"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-warm-brown/30" />
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">优先级</label>
          <div className="flex gap-2">
            {(['urgent', 'high', 'medium', 'low'] as Priority[]).map(p => (
              <button key={p} onClick={() => setPriority(p)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${priority === p ? 'bg-warm-brown text-white' : 'bg-gray-50 text-text-muted hover:bg-gray-100'}`}>
                {priorityLabels[p]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">关联项目</label>
          <select value={projectId} onChange={e => handleSelectProject(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-warm-brown/30">
            <option value="">不关联项目</option>
            {activeProjects.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.progress}%)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">关联目标</label>
          <select value={goalId} onChange={e => setGoalId(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-warm-brown/30">
            <option value="">不关联目标</option>
            {activeGoals.map(g => (
              <option key={g.id} value={g.id}>[{g.type === 'weekly' ? '周' : g.type === 'monthly' ? '月' : g.type === 'annual' ? '年' : '长期'}] {g.title}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-text-muted mb-1.5 block">截止日期</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-warm-brown/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted mb-1.5 block">预计耗时(min)</label>
            <input type="number" value={estimatedDuration ?? ''} onChange={e => setEstimatedDuration(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-warm-brown/30" />
          </div>
        </div>

        <button onClick={handleSubmit}
          disabled={!title.trim()}
          className="w-full py-2.5 bg-warm-brown text-white rounded-xl font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-warm-brown/90 transition-colors">
          添加任务
        </button>
      </div>
    </div>
  );
}
