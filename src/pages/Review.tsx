import { useState, useMemo } from 'react';
import { useStore } from '../store';
import type { Review, ReviewType } from '../types';
import {
  RefreshCw, ChevronRight, TrendingUp, Target, Clock,
  AlertTriangle, CheckCircle2, X, BarChart3, Calendar,
  ChevronDown,
} from 'lucide-react';

const now = new Date();
const todayStr = now.toISOString().split('T')[0];

function getMonday(d: Date) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}
const weekStart = getMonday(now).toISOString().split('T')[0];
const weekEnd = new Date(getMonday(now).getTime() + 6 * 86400000).toISOString().split('T')[0];

function getWeekNumber(d: Date) {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = (d.getTime() - start.getTime() + 86400000) / 86400000;
  return Math.ceil(diff / 7);
}

export default function ReviewPage() {
  const {
    reviews, tasks, projects, habits, checkIns, focusSessions,
    goals, addReview, updateReview, deleteReview,
  } = useStore();

  const [tab, setTab] = useState<ReviewType>('daily');
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => r.type === tab).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reviews, tab]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-text-primary">复盘</h1>
        <p className="text-sm text-text-muted mt-0.5">日收尾 · 周复盘 · 月复盘</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 w-fit">
        {([
          { key: 'daily' as ReviewType, label: '日复盘' },
          { key: 'weekly' as ReviewType, label: '周复盘' },
          { key: 'monthly' as ReviewType, label: '月复盘' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Create button */}
      <button
        onClick={() => setShowCreate(true)}
        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors flex items-center justify-center gap-2"
      >
        <RefreshCw size={16} />
        {tab === 'daily' ? '开始今日收尾' : tab === 'weekly' ? '开始本周复盘' : '开始本月复盘'}
      </button>

      {/* Reviews list */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16">
          <RefreshCw size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-text-muted">暂无{tab === 'daily' ? '日' : tab === 'weekly' ? '周' : '月'}复盘记录</p>
          <p className="text-sm text-text-muted mt-1">开始记录你的复盘，追踪成长</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              expanded={expandedId === review.id}
              onToggle={() => setExpandedId(expandedId === review.id ? null : review.id)}
              onDelete={() => deleteReview(review.id)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <CreateReviewModal
          type={tab}
          onClose={() => setShowCreate(false)}
          onSaved={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}

// ==================== Review Card ====================

function ReviewCard({ review, expanded, onToggle, onDelete }: {
  review: Review;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 sm:p-5 text-left hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-text-primary">{review.title}</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-text-muted">
                {review.type === 'daily' ? '日' : review.type === 'weekly' ? '周' : '月'}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              {new Date(review.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
              {review.weekNumber && ` · 第${review.weekNumber}周`}
              {review.monthNumber && ` · 第${review.monthNumber}月`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className={`w-2 h-2 rounded-full ${s <= review.rating ? 'bg-warm-brown' : 'bg-gray-200'}`} />
              ))}
            </div>
            <ChevronRight size={16} className={`text-text-muted transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4 border-t border-gray-50">
          {/* Task Completion */}
          <div>
            <h4 className="text-xs font-medium text-text-muted mb-2">任务完成率</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-warm-brown transition-all" style={{ width: `${review.data.taskCompletionRate}%` }} />
              </div>
              <span className="text-sm font-semibold text-text-primary">{review.data.taskCompletionRate}%</span>
            </div>
          </div>

          {/* Project Progress */}
          {review.data.projectProgress.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-text-muted mb-2">项目推进</h4>
              <div className="space-y-1.5">
                {review.data.projectProgress.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary truncate flex-1 mr-2">{p.projectTitle}</span>
                    <span className="text-xs text-green-600 flex-shrink-0">+{p.advancement}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Distribution */}
          {review.data.moduleTimeDistribution.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-text-muted mb-2">时间分布</h4>
              <div className="space-y-1.5">
                {review.data.moduleTimeDistribution.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary w-16 flex-shrink-0">{m.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-warm-brown/60" style={{ width: `${m.percentage}%` }} />
                    </div>
                    <span className="text-xs text-text-muted flex-shrink-0 w-10 text-right">{m.minutes}min</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Effective Output */}
          {review.data.effectiveOutput && (
            <div>
              <h4 className="text-xs font-medium text-text-muted mb-1">有效产出</h4>
              <p className="text-sm text-text-secondary">{review.data.effectiveOutput}</p>
            </div>
          )}

          {/* Uncompleted Tasks */}
          {review.data.uncompletedTasks.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-text-muted mb-1.5">未完成任务</h4>
              <div className="space-y-1">
                {review.data.uncompletedTasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <AlertTriangle size={12} className="text-amber-400 flex-shrink-0" />
                    <span className="text-text-secondary">{t.title}</span>
                    {t.reason && <span className="text-xs text-red-400">({t.reason})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uncompleted Reasons */}
          {review.data.uncompletedReasons.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-text-muted mb-1.5">未完成原因</h4>
              <div className="flex flex-wrap gap-2">
                {review.data.uncompletedReasons.map((r, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                    {r.reason} ×{r.count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Deadlines */}
          {review.data.upcomingDeadlines.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-text-muted mb-1.5">即将到期</h4>
              <div className="space-y-1">
                {review.data.upcomingDeadlines.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Clock size={12} className="text-amber-400 flex-shrink-0" />
                    <span className="text-text-secondary">{d.title}</span>
                    <span className="text-xs text-text-muted">{d.deadline}</span>
                    {d.projectName && <span className="text-xs text-text-muted">({d.projectName})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reflections */}
          {review.reflections && (
            <div>
              <h4 className="text-xs font-medium text-text-muted mb-1">反思</h4>
              <p className="text-sm text-text-secondary bg-gray-50 rounded-xl p-3">{review.reflections}</p>
            </div>
          )}

          {/* Improvements */}
          {review.improvements && (
            <div>
              <h4 className="text-xs font-medium text-text-muted mb-1">改进措施</h4>
              <p className="text-sm text-text-secondary bg-green-50 rounded-xl p-3">{review.improvements}</p>
            </div>
          )}

          <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-500 transition-colors">删除此复盘</button>
        </div>
      )}
    </div>
  );
}

// ==================== Create Review Modal ====================

function CreateReviewModal({ type, onClose, onSaved }: {
  type: ReviewType;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { tasks, checkIns, focusSessions, projects, habits, addReview } = useStore();
  const [reflections, setReflections] = useState('');
  const [improvements, setImprovements] = useState('');
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(3);

  const dateRange = useMemo(() => {
    if (type === 'daily') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
      return { start, end, dateLabel: todayStr };
    }
    if (type === 'weekly') {
      const monday = getMonday(now);
      const sunday = new Date(monday.getTime() + 6 * 86400000);
      sunday.setHours(23, 59, 59);
      return { start: monday.toISOString(), end: sunday.toISOString(), dateLabel: weekStart };
    }
    // monthly
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    return { start, end, dateLabel: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0] };
  }, [type]);

  const autoData = useMemo(() => {
    const periodTasks = tasks.filter(t => t.createdAt >= dateRange.start || (t.status === 'completed' && t.updatedAt >= dateRange.start));
    const completed = periodTasks.filter(t => t.status === 'completed');
    const rate = periodTasks.length > 0 ? Math.round((completed.filter(t => t.updatedAt >= dateRange.start).length / periodTasks.length) * 100) : 100;

    // Module time distribution from check-ins
    const moduleTime: Record<string, { label: string; minutes: number }> = {};
    checkIns.filter(c => c.date >= dateRange.start.slice(0, 10)).forEach(c => {
      const k = c.templateType;
      const labels: Record<string, string> = {
        literature: '文献阅读', theory: '理论学习', method: '方法学习',
        'paper-writing': '论文写作', policy: '政策研究', case: '案例分析',
        report: '报告写作', language: '语言学习', ecommerce: '电商调研',
        wechat: '公众号', video: '视频制作', health: '健康管理',
      };
      moduleTime[k] = moduleTime[k] || { label: labels[k] || k, minutes: 0 };
      moduleTime[k].minutes += c.durationMinutes || 0;
    });

    // Focus time
    const periodFocus = focusSessions.filter(f => f.startTime >= dateRange.start);
    const focusMin = periodFocus.reduce((s, f) => s + (f.actualDuration || 0), 0);

    // Output
    const periodCheckIns = checkIns.filter(c => c.date >= dateRange.start.slice(0, 10));
    const output = periodCheckIns.map(c => c.output).filter(Boolean).join('；');

    // Uncompleted
    const uncompleted = periodTasks.filter(t => t.status !== 'completed');
    const reasonCounts: Record<string, number> = {};
    uncompleted.forEach(t => {
      if (t.notCompletedReason) reasonCounts[t.notCompletedReason] = (reasonCounts[t.notCompletedReason] || 0) + 1;
    });
    if (uncompleted.length > 0 && Object.keys(reasonCounts).length === 0) {
      reasonCounts['未填写原因'] = uncompleted.length;
    }

    // Project progress snapshot
    const projectProgress = projects.filter(p => p.status !== 'completed').map(p => ({
      projectId: p.id, projectTitle: p.title,
      progressBefore: Math.max(0, p.progress - 5),
      progressAfter: p.progress,
      advancement: 5,
    }));

    // Upcoming deadlines
    const upcoming = tasks
      .filter(t => t.status !== 'completed' && t.deadline && new Date(t.deadline) > now)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 5)
      .map(t => ({ title: t.title, deadline: new Date(t.deadline!).toLocaleDateString('zh-CN'), projectName: t.projectName }));

    const totalMin = Object.values(moduleTime).reduce((s, v) => s + v.minutes, 0);
    const dist = Object.entries(moduleTime).map(([k, v]) => ({
      module: k, label: v.label, minutes: v.minutes + (k === 'paper-writing' ? focusMin : 0),
      percentage: totalMin > 0 ? Math.round((v.minutes / totalMin) * 100) : 0,
    }));

    return {
      taskCompletionRate: rate,
      projectProgress,
      moduleTimeDistribution: dist,
      effectiveOutput: output,
      uncompletedTasks: uncompleted.map(t => ({ taskId: t.id, title: t.title, reason: t.notCompletedReason })),
      uncompletedReasons: Object.entries(reasonCounts).map(([reason, count]) => ({ reason, count })),
      upcomingDeadlines: upcoming,
    };
  }, [tasks, checkIns, focusSessions, projects, dateRange]);

  const handleSave = () => {
    const title =
      type === 'daily' ? `${now.getMonth() + 1}月${now.getDate()}日收尾复盘` :
      type === 'weekly' ? `第${getWeekNumber(now)}周复盘` :
      `${now.getMonth() + 1}月月度复盘`;

    addReview({
      type,
      title,
      date: dateRange.dateLabel,
      weekNumber: type === 'weekly' ? getWeekNumber(now) : undefined,
      monthNumber: type === 'monthly' ? now.getMonth() + 1 : undefined,
      data: autoData,
      reflections,
      improvements,
      rating,
    });
    onSaved();
  };

  // Quick reflection templates
  const quickReflections = type === 'daily' ? [
    '今天推进稳定，按计划完成', '今天注意力不够集中', '今天任务安排过满',
  ] : [
    '本周整体推进顺利', '本周某项目进展缓慢', '本周时间分配需调整',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto z-10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">
            {type === 'daily' ? '今日收尾复盘' : type === 'weekly' ? '本周复盘' : '本月复盘'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-50"><X size={16} /></button>
        </div>

        {/* Auto Summary */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-warm-brown" />
            <span className="text-sm font-medium text-text-primary">自动汇总</span>
          </div>
          <p className="text-sm text-text-secondary">
            任务完成率 {autoData.taskCompletionRate}%，
            {type === 'daily' && checkIns.filter(c => c.date === todayStr).length > 0 &&
              `打卡 ${checkIns.filter(c => c.date === todayStr).length} 次，`}
            {autoData.effectiveOutput && `产出: ${autoData.effectiveOutput}`}
          </p>
          {autoData.uncompletedTasks.length > 0 && (
            <p className="text-xs text-text-muted">
              未完成: {autoData.uncompletedTasks.map(t => t.title).join('、')}
            </p>
          )}
        </div>

        {/* Quick reflections */}
        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">快速记录</label>
          <div className="flex flex-wrap gap-2">
            {quickReflections.map((r, i) => (
              <button key={i} onClick={() => setReflections(prev => (prev ? prev + '；' : '') + r)}
                className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-text-secondary hover:bg-gray-100 transition-colors">
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">反思</label>
          <textarea value={reflections} onChange={e => setReflections(e.target.value)}
            placeholder="这段时间哪些做得好？哪些可以改进？"
            className="w-full rounded-xl border border-gray-200 p-3 text-sm h-24 resize-none focus:outline-none focus:border-warm-brown/30 placeholder:text-text-muted" />
        </div>

        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">改进措施</label>
          <textarea value={improvements} onChange={e => setImprovements(e.target.value)}
            placeholder="下一步具体怎么改进？"
            className="w-full rounded-xl border border-gray-200 p-3 text-sm h-20 resize-none focus:outline-none focus:border-warm-brown/30 placeholder:text-text-muted" />
        </div>

        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">自我评分</label>
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
