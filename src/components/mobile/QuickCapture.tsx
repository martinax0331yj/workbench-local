import { useState } from 'react';
import { Plus, X, Lightbulb, BookOpen, CheckSquare, ClipboardCheck, Dumbbell, ChevronRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store';
import type { ReviewType, Priority, IdeaStatus, CheckInTemplateType } from '../../types';

type CaptureType = 'idea' | 'note' | 'task' | 'review' | 'checkin' | null;

export default function QuickCapture() {
  const store = useStore();
  const [open, setOpen] = useState(false);
  const [captureType, setCaptureType] = useState<CaptureType>(null);
  const [saved, setSaved] = useState(false);

  // Form states
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaSource, setIdeaSource] = useState('');
  const [ideaNotes, setIdeaNotes] = useState('');
  const [noteBook, setNoteBook] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('');
  const [noteQuestion, setNoteQuestion] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [reviewType, setReviewType] = useState<ReviewType>('daily');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewReflections, setReviewReflections] = useState('');
  const [reviewImprovements, setReviewImprovements] = useState('');
  const [reviewRating, setReviewRating] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [checkinHabitId, setCheckinHabitId] = useState('');
  const [checkinOutput, setCheckinOutput] = useState('');
  const [checkinQuality, setCheckinQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [checkinDuration, setCheckinDuration] = useState('');

  const closeAll = () => {
    setOpen(false);
    setCaptureType(null);
    setSaved(false);
    resetForm();
  };

  const resetForm = () => {
    setIdeaTitle(''); setIdeaSource(''); setIdeaNotes('');
    setNoteBook(''); setNoteAuthor(''); setNoteQuestion('');
    setTaskTitle(''); setTaskPriority('medium');
    setReviewType('daily'); setReviewTitle(''); setReviewReflections(''); setReviewImprovements(''); setReviewRating(3);
    setCheckinHabitId(''); setCheckinOutput(''); setCheckinQuality(3); setCheckinDuration('');
  };

  const handleSave = () => {
    switch (captureType) {
      case 'idea': {
        if (!ideaTitle.trim()) return;
        store.addResearchIdea({
          title: ideaTitle.trim(),
          triggerSource: ideaSource.trim() || undefined,
          oneLineQuestion: ideaNotes.trim() || undefined,
          researchValue: undefined,
          potentialObject: undefined,
          availableTheories: undefined,
          availableMethods: undefined,
          availableData: undefined,
          innovationPotential: undefined,
          feasibility: undefined,
          risks: undefined,
          linkedLiterature: undefined,
          linkedCases: undefined,
          nextVerificationStep: undefined,
          status: 'inspiration' as IdeaStatus,
          convertedProjectId: undefined,
        });
        break;
      }
      case 'note': {
        if (!noteBook.trim()) return;
        store.addReadingNote({
          bookTitle: noteBook.trim(),
          author: noteAuthor.trim() || '未知',
          readingStatus: 'reading' as const,
          coreQuestion: noteQuestion.trim() || undefined,
          linkedPaperIds: [],
          linkedReportIds: [],
          linkedTheoryIds: [],
        });
        break;
      }
      case 'task': {
        if (!taskTitle.trim()) return;
        store.addTask({
          title: taskTitle.trim(),
          priority: taskPriority,
          status: 'todo' as const,
        });
        break;
      }
      case 'review': {
        if (!reviewTitle.trim()) return;
        store.addReview({
          type: reviewType,
          title: reviewTitle.trim(),
          date: new Date().toISOString().slice(0, 10),
          data: {
            taskCompletionRate: 0,
            projectProgress: [],
            moduleTimeDistribution: [],
            effectiveOutput: '',
            uncompletedTasks: [],
            uncompletedReasons: [],
            upcomingDeadlines: [],
          },
          reflections: reviewReflections.trim() || '',
          improvements: reviewImprovements.trim() || '',
          rating: reviewRating,
        });
        break;
      }
      case 'checkin': {
        const activeHabits = store.habits.filter(h => h.active);
        if (activeHabits.length === 0) return;
        const targetHabitId = checkinHabitId || activeHabits[0]?.id;
        if (!targetHabitId) return;
        const habit = activeHabits.find(h => h.id === targetHabitId);
        store.addCheckIn({
          habitId: targetHabitId,
          templateType: (habit?.templateType || 'literature') as CheckInTemplateType,
          date: new Date().toISOString().slice(0, 10),
          output: checkinOutput.trim() || '完成打卡',
          quality: checkinQuality,
          effortLevel: checkinQuality,
          durationMinutes: checkinDuration ? parseInt(checkinDuration) : undefined,
          evidenceIds: [],
        });
        break;
      }
    }
    setSaved(true);
    resetForm();
    setTimeout(() => closeAll(), 1200);
  };

  const canSave = () => {
    switch (captureType) {
      case 'idea': return ideaTitle.trim().length > 0;
      case 'note': return noteBook.trim().length > 0;
      case 'task': return taskTitle.trim().length > 0;
      case 'review': return reviewTitle.trim().length > 0;
      case 'checkin': {
        const activeHabits = store.habits.filter(h => h.active);
        return activeHabits.length > 0 && !!(checkinHabitId || activeHabits[0]);
      }
      default: return false;
    }
  };

  const activeHabits = store.habits.filter(h => h.active);

  const entries: { type: NonNullable<CaptureType>; label: string; desc: string; icon: typeof Lightbulb; color: string }[] = [
    { type: 'idea', label: '记想法', desc: '捕捉研究灵感', icon: Lightbulb, color: 'text-amber-500 bg-amber-50' },
    { type: 'note', label: '记笔记', desc: '记录阅读要点', icon: BookOpen, color: 'text-blue-500 bg-blue-50' },
    { type: 'task', label: '新建任务', desc: '快速添加待办', icon: CheckSquare, color: 'text-emerald-500 bg-emerald-50' },
    { type: 'review', label: '写复盘', desc: '日/周/月复盘', icon: ClipboardCheck, color: 'text-violet-500 bg-violet-50' },
    { type: 'checkin', label: '打卡', desc: '习惯行为打卡', icon: Dumbbell, color: 'text-rose-500 bg-rose-50' },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className={`sm:hidden fixed right-5 bottom-20 w-14 h-14 rounded-2xl bg-warm-brown text-white shadow-lg shadow-warm-brown/25
          flex items-center justify-center z-40 transition-all duration-200
          hover:scale-105 active:scale-95 active:shadow-md
          ${open ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* Saved feedback */}
      {saved && (
        <div className="sm:hidden fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={closeAll} />
          <div className="relative bg-white rounded-2xl shadow-xl px-8 py-6 text-center animate-[fadeInUp_200ms_ease-out]">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <CheckSquare size={22} className="text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-text-primary">已保存</p>
          </div>
        </div>
      )}

      {/* Drawer */}
      {open && !saved && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={closeAll} />

          <div className="relative bg-white rounded-t-2xl shadow-2xl animate-[slideUp_250ms_ease-out] max-h-[85vh] flex flex-col safe-area-bottom">
            {/* Handle */}
            <div className="flex items-center justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-2">
              {captureType ? (
                <button
                  onClick={() => { setCaptureType(null); resetForm(); }}
                  className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>返回</span>
                </button>
              ) : (
                <h3 className="text-base font-semibold text-text-primary">快速记录</h3>
              )}
              <button onClick={closeAll} className="p-1.5 rounded-full hover:bg-gray-50 transition-colors">
                <X size={18} className="text-text-muted" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-6">
              {/* Menu */}
              {!captureType && (
                <div className="space-y-1.5">
                  {entries.map(entry => (
                    <button
                      key={entry.type}
                      onClick={() => {
                        setCaptureType(entry.type);
                        if (entry.type === 'checkin' && activeHabits.length > 0) {
                          setCheckinHabitId(activeHabits[0].id);
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors active:scale-[0.98]"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${entry.color}`}>
                        <entry.icon size={18} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-text-primary">{entry.label}</p>
                        <p className="text-xs text-text-muted">{entry.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-text-muted/50" />
                    </button>
                  ))}
                </div>
              )}

              {/* Form: 记想法 */}
              {captureType === 'idea' && (
                <div className="space-y-4 animate-[fadeInUp_200ms_ease-out]">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Lightbulb size={16} className="text-amber-500" />
                    </div>
                    <span className="text-sm font-semibold text-text-primary">记想法</span>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">想法标题 *</label>
                    <input autoFocus value={ideaTitle} onChange={e => setIdeaTitle(e.target.value)} placeholder="一句话描述你的研究灵感" className="w-full h-11 px-3.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-amber-300 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">触发来源</label>
                    <input value={ideaSource} onChange={e => setIdeaSource(e.target.value)} placeholder="例如：读了某篇论文、听了某场讲座" className="w-full h-11 px-3.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-amber-300 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">自由记录</label>
                    <textarea value={ideaNotes} onChange={e => setIdeaNotes(e.target.value)} placeholder="进一步展开你的想法..." rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-amber-300 focus:outline-none resize-none" />
                  </div>
                  <button onClick={handleSave} disabled={!canSave()} className="w-full py-3 rounded-xl bg-amber-500 text-white text-sm font-semibold disabled:opacity-40 active:scale-[0.98] transition-all">保存想法</button>
                </div>
              )}

              {/* Form: 记笔记 */}
              {captureType === 'note' && (
                <div className="space-y-4 animate-[fadeInUp_200ms_ease-out]">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <BookOpen size={16} className="text-blue-500" />
                    </div>
                    <span className="text-sm font-semibold text-text-primary">记笔记</span>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">书名/文章名 *</label>
                    <input autoFocus value={noteBook} onChange={e => setNoteBook(e.target.value)} placeholder="你在读什么？" className="w-full h-11 px-3.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-blue-300 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">作者</label>
                    <input value={noteAuthor} onChange={e => setNoteAuthor(e.target.value)} placeholder="作者姓名" className="w-full h-11 px-3.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-blue-300 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">核心问题</label>
                    <textarea value={noteQuestion} onChange={e => setNoteQuestion(e.target.value)} placeholder="这本书/这篇文章要解决什么问题？" rows={2} className="w-full px-3.5 py-2.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-blue-300 focus:outline-none resize-none" />
                  </div>
                  <button onClick={handleSave} disabled={!canSave()} className="w-full py-3 rounded-xl bg-blue-500 text-white text-sm font-semibold disabled:opacity-40 active:scale-[0.98] transition-all">保存笔记</button>
                </div>
              )}

              {/* Form: 新建任务 */}
              {captureType === 'task' && (
                <div className="space-y-4 animate-[fadeInUp_200ms_ease-out]">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <CheckSquare size={16} className="text-emerald-500" />
                    </div>
                    <span className="text-sm font-semibold text-text-primary">新建任务</span>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">任务标题 *</label>
                    <input autoFocus value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="你要做什么？" className="w-full h-11 px-3.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-emerald-300 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">优先级</label>
                    <div className="flex gap-2">
                      {([
                        { key: 'low' as const, label: '低', activeClass: 'border-gray-300 bg-gray-100 text-gray-700' },
                        { key: 'medium' as const, label: '中', activeClass: 'border-blue-300 bg-blue-50 text-blue-700' },
                        { key: 'high' as const, label: '高', activeClass: 'border-orange-300 bg-orange-50 text-orange-700' },
                        { key: 'urgent' as const, label: '紧急', activeClass: 'border-red-300 bg-red-50 text-red-700' },
                      ]).map(p => (
                        <button key={p.key} onClick={() => setTaskPriority(p.key)}
                          className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all active:scale-95 ${taskPriority === p.key ? p.activeClass : 'border-gray-100 text-text-muted'}`}
                        >{p.label}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleSave} disabled={!canSave()} className="w-full py-3 rounded-xl bg-emerald-500 text-white text-sm font-semibold disabled:opacity-40 active:scale-[0.98] transition-all">添加任务</button>
                </div>
              )}

              {/* Form: 写复盘 */}
              {captureType === 'review' && (
                <div className="space-y-4 animate-[fadeInUp_200ms_ease-out]">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                      <ClipboardCheck size={16} className="text-violet-500" />
                    </div>
                    <span className="text-sm font-semibold text-text-primary">写复盘</span>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">复盘类型</label>
                    <div className="flex gap-2">
                      {['daily' as const, 'weekly' as const, 'monthly' as const].map(r => (
                        <button key={r} onClick={() => setReviewType(r)}
                          className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all active:scale-95 ${reviewType === r ? 'border-violet-300 bg-violet-50 text-violet-700' : 'border-gray-100 text-text-muted'}`}
                        >{r === 'daily' ? '日复盘' : r === 'weekly' ? '周复盘' : '月复盘'}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">标题 *</label>
                    <input autoFocus value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} placeholder="这次复盘的主题" className="w-full h-11 px-3.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-violet-300 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">反思</label>
                    <textarea value={reviewReflections} onChange={e => setReviewReflections(e.target.value)} placeholder="做得好的地方？有什么不足？" rows={2} className="w-full px-3.5 py-2.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-violet-300 focus:outline-none resize-none" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">改进措施</label>
                    <textarea value={reviewImprovements} onChange={e => setReviewImprovements(e.target.value)} placeholder="下一步怎么改进？" rows={2} className="w-full px-3.5 py-2.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-violet-300 focus:outline-none resize-none" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">自评 ({reviewRating}/5)</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setReviewRating(n as 1|2|3|4|5)}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all active:scale-95 ${reviewRating >= n ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                        >{n}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleSave} disabled={!canSave()} className="w-full py-3 rounded-xl bg-violet-500 text-white text-sm font-semibold disabled:opacity-40 active:scale-[0.98] transition-all">保存复盘</button>
                </div>
              )}

              {/* Form: 打卡 */}
              {captureType === 'checkin' && (
                <div className="space-y-4 animate-[fadeInUp_200ms_ease-out]">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                      <Dumbbell size={16} className="text-rose-500" />
                    </div>
                    <span className="text-sm font-semibold text-text-primary">打卡</span>
                  </div>
                  {activeHabits.length === 0 ? (
                    <div className="text-center py-8">
                      <Dumbbell size={40} className="text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-text-muted">暂无活跃习惯</p>
                      <p className="text-xs text-text-muted mt-1">请先到「习惯」页面创建后再打卡</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs text-text-muted block mb-1.5">选择习惯</label>
                        <div className="flex flex-wrap gap-2">
                          {activeHabits.map(h => (
                            <button key={h.id} onClick={() => setCheckinHabitId(h.id)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all active:scale-95 ${checkinHabitId === h.id ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-gray-100 text-text-muted'}`}
                            >{h.title}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-text-muted block mb-1.5">产出描述</label>
                        <textarea value={checkinOutput} onChange={e => setCheckinOutput(e.target.value)} placeholder="今天完成了什么？具体成果是什么？" rows={2} className="w-full px-3.5 py-2.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-rose-300 focus:outline-none resize-none" />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted block mb-1.5">投入质量 ({checkinQuality}/5)</label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map(n => (
                            <button key={n} onClick={() => setCheckinQuality(n as 1|2|3|4|5)}
                              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all active:scale-95 ${checkinQuality >= n ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                            >{n}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-text-muted block mb-1.5">投入时长（分钟，可选）</label>
                        <input value={checkinDuration} onChange={e => setCheckinDuration(e.target.value.replace(/\D/g, ''))} placeholder="例如：45" inputMode="numeric" className="w-full h-11 px-3.5 rounded-xl bg-cream border border-gray-100 text-sm focus:border-rose-300 focus:outline-none" />
                      </div>
                      <button onClick={handleSave} disabled={!canSave()} className="w-full py-3 rounded-xl bg-rose-500 text-white text-sm font-semibold disabled:opacity-40 active:scale-[0.98] transition-all">完成打卡</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
