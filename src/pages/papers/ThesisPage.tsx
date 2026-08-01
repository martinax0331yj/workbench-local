import { useState } from 'react';
import { useStore } from '../../store';
import {
  GraduationCap, Plus, X, ChevronDown, Edit3, Trash2,
  CheckCircle2, Clock, Calendar, MessageSquare, BookOpen,
  FileText, Target,
} from 'lucide-react';
import { formatDateShort, formatRelative } from '../../utils';

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// Chapter status helpers
const chStatusLabels: Record<string, string> = {
  'not-started': '未开始', outline: '大纲', writing: '写作中',
  drafted: '初稿完成', revising: '修改中', completed: '已完成',
};
const chStatusColors: Record<string, string> = {
  'not-started': 'bg-gray-100 text-text-muted', outline: 'bg-purple-50 text-mist-purple',
  writing: 'bg-blue-50 text-mist-blue', drafted: 'bg-orange-50 text-warm-brown',
  revising: 'bg-yellow-50 text-yellow-700', completed: 'bg-green-50 text-mint-green',
};
const allChStatuses = ['not-started', 'outline', 'writing', 'drafted', 'revising', 'completed'];

export default function ThesisPage() {
  const { thesis, updateThesis } = useStore();

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createRQ, setCreateRQ] = useState('');
  const [createFramework, setCreateFramework] = useState('');

  // Chapter modal
  const [showChModal, setShowChModal] = useState(false);
  const [editingChId, setEditingChId] = useState<string | null>(null);
  const [chTitle, setChTitle] = useState('');
  const [chStatus, setChStatus] = useState('not-started');

  // Milestone modal
  const [showMsModal, setShowMsModal] = useState(false);
  const [msTitle, setMsTitle] = useState('');
  const [msDate, setMsDate] = useState('');

  // Feedback modal
  const [showFbModal, setShowFbModal] = useState(false);
  const [fbTopic, setFbTopic] = useState('');
  const [fbContent, setFbContent] = useState('');
  const [fbDate, setFbDate] = useState(new Date().toISOString().split('T')[0]);

  // Next step inline
  const [editingNextStep, setEditingNextStep] = useState(false);
  const [nextStepVal, setNextStepVal] = useState('');

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setCollapsed(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // --- Thesis create ---
  const handleCreate = () => {
    if (!createTitle.trim()) return;
    // Using as any to match store's flexible thesis shape
    updateThesis({
      title: createTitle.trim(),
      researchQuestion: createRQ.trim() || undefined,
      theoreticalFramework: createFramework.trim() || undefined,
      stage: '选题与规划',
      progress: 0,
      chapters: [],
      milestones: [],
      subQuestions: [],
      phaseResults: [],
      splittablePapers: [],
    } as any);
    setShowCreate(false);
    setCreateTitle(''); setCreateRQ(''); setCreateFramework('');
  };

  // --- Chapter CRUD ---
  const resetChForm = () => { setChTitle(''); setChStatus('not-started'); setShowChModal(false); setEditingChId(null); };
  const openAddCh = () => { resetChForm(); setShowChModal(true); };
  const openEditCh = (ch: any) => { setEditingChId(ch.id); setChTitle(ch.title); setChStatus(ch.status); setShowChModal(true); };

  const handleSaveCh = () => {
    if (!chTitle.trim() || !thesis) return;
    const chapters = [...thesis.chapters];
    if (editingChId) {
      const idx = chapters.findIndex((c: any) => c.id === editingChId);
      if (idx >= 0) chapters[idx] = { ...chapters[idx], title: chTitle.trim(), status: chStatus };
    } else {
      chapters.push({ id: uid(), title: chTitle.trim(), status: chStatus, progress: 0, wordCount: 0, subChapters: [] });
    }
    updateThesis({ chapters } as any);
    resetChForm();
  };

  const handleDeleteCh = (id: string) => {
    if (!thesis) return;
    updateThesis({ chapters: thesis.chapters.filter((c: any) => c.id !== id) } as any);
  };

  const handleChStatus = (id: string, status: string) => {
    if (!thesis) return;
    updateThesis({ chapters: thesis.chapters.map((c: any) => c.id === id ? { ...c, status } : c) } as any);
  };

  const handleUpdateWC = (id: string, wc: string) => {
    if (!thesis) return;
    const n = wc ? Number(wc) : 0;
    updateThesis({ chapters: thesis.chapters.map((c: any) => c.id === id ? { ...c, wordCount: n } : c) } as any);
  };

  // --- Milestones ---
  const handleAddMs = () => {
    if (!msTitle.trim() || !msDate || !thesis) return;
    updateThesis({ milestones: [...thesis.milestones, { id: uid(), title: msTitle.trim(), date: msDate, completed: false }] } as any);
    setShowMsModal(false); setMsTitle(''); setMsDate('');
  };

  const handleToggleMs = (id: string) => {
    if (!thesis) return;
    updateThesis({
      milestones: thesis.milestones.map((m: any) => m.id === id ? { ...m, completed: !m.completed } : m),
    } as any);
  };

  const handleDeleteMs = (id: string) => {
    if (!thesis) return;
    updateThesis({ milestones: thesis.milestones.filter((m: any) => m.id !== id) } as any);
  };

  // --- Feedback ---
  const handleAddFb = () => {
    if (!fbTopic.trim() || !fbContent.trim() || !thesis) return;
    updateThesis({
      advisorFeedback: [...(thesis.advisorFeedback || []), { topic: fbTopic.trim(), date: fbDate, content: fbContent.trim() }],
    } as any);
    setShowFbModal(false); setFbTopic(''); setFbContent(''); setFbDate(new Date().toISOString().split('T')[0]);
  };

  const handleDeleteFb = (idx: number) => {
    if (!thesis) return;
    const fbs = [...(thesis.advisorFeedback || [])];
    fbs.splice(idx, 1);
    updateThesis({ advisorFeedback: fbs } as any);
  };

  // --- Next step ---
  const handleSaveNextStep = () => {
    updateThesis({ nextStep: nextStepVal.trim() || undefined } as any);
    setEditingNextStep(false);
  };

  // Recalc progress
  const calcProgress = () => {
    if (!thesis?.chapters?.length) return thesis?.progress || 0;
    const totalProgress = thesis.chapters.reduce((s: number, c: any) => s + (c.progress || 0), 0);
    return Math.round(totalProgress / thesis.chapters.length);
  };

  const totalWc = thesis?.chapters?.reduce((s: number, c: any) => s + (c.wordCount || 0), 0) || 0;

  // If no thesis, show creation page
  if (!thesis) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">毕业论文</h1>
          <p className="text-body-sm text-text-muted mt-1">从选题到答辩，管理你的毕业论文全流程</p>
        </div>
        <div className="card text-center py-12 sm:py-16">
          <GraduationCap size={48} className="mx-auto text-text-muted mb-4 opacity-40" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">还未创建毕业论文</h2>
          <p className="text-body-sm text-text-muted mb-6 max-w-sm mx-auto">创建毕业论文项目，管理章节进度、里程碑与导师反馈</p>
          <button onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors">
            <Plus size={16} /> 创建毕业论文
          </button>
        </div>
        {showCreate && (
          <div className="modal-mobile">
            <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setShowCreate(false)} />
            <div className="modal-mobile-content relative z-50">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-serif font-semibold text-text-primary">创建毕业论文</h2>
                <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} className="text-text-muted" /></button>
              </div>
              <div className="space-y-4">
                <F label="论文标题 *" v={createTitle} onChange={setCreateTitle} ph="请输入毕业论文标题" />
                <F label="研究问题" v={createRQ} onChange={setCreateRQ} ph="核心研究问题" ta />
                <F label="理论框架" v={createFramework} onChange={setCreateFramework} ph="使用与满足理论、TAM模型等" />
                <button onClick={handleCreate} disabled={!createTitle.trim()}
                  className="w-full py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors disabled:opacity-40">创建论文</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const displayProgress = calcProgress();
  const completedMs = thesis.milestones.filter((m: any) => m.completed).length;

  return (
    <div>
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="page-title">毕业论文</h1>
            <p className="text-body-sm text-text-muted mt-1">{thesis.stage || '进行中'}</p>
          </div>
        </div>
      </div>

      {/* Header card */}
      <div className="card !p-4 sm:!p-5 mb-4">
        <h2 className="text-base sm:text-lg font-serif font-semibold text-text-primary mb-2">{thesis.title}</h2>
        {thesis.researchQuestion && <p className="text-sm text-text-secondary mb-1">{thesis.researchQuestion}</p>}
        {thesis.theoreticalFramework && <p className="text-xs text-text-muted mb-3">理论框架：{thesis.theoreticalFramework}</p>}
        <div className="progress-bar mb-2">
          <div className="progress-fill" style={{ width: `${displayProgress}%` }} />
        </div>
        <p className="text-xs text-text-muted">
          总体进度 {displayProgress}% · 已写 {Math.round(totalWc / 10000 * 10) / 10}万字
          {thesis.nextStep && <span className="ml-2 text-warm-brown">下一步：{thesis.nextStep}</span>}
        </p>
        <button onClick={() => { setNextStepVal(thesis.nextStep || ''); setEditingNextStep(true); }}
          className="text-[11px] text-mist-blue hover:underline mt-1.5 inline-block">编辑下一步计划</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
        <div className="card !p-3 sm:!p-4">
          <BookOpen size={18} className="text-mist-blue mb-1" />
          <p className="text-lg sm:text-xl font-semibold text-text-primary">{thesis.chapters.length}</p>
          <p className="text-[10px] sm:text-caption text-text-muted">章节数</p>
        </div>
        <div className="card !p-3 sm:!p-4">
          <FileText size={18} className="text-mist-purple mb-1" />
          <p className="text-lg sm:text-xl font-semibold text-text-primary">{Math.round(totalWc / 10000 * 10) / 10}w</p>
          <p className="text-[10px] sm:text-caption text-text-muted">总字数</p>
        </div>
        <div className="card !p-3 sm:!p-4">
          <MessageSquare size={18} className="text-warm-brown mb-1" />
          <p className="text-lg sm:text-xl font-semibold text-text-primary">{(thesis.advisorFeedback || []).length}</p>
          <p className="text-[10px] sm:text-caption text-text-muted">导师反馈</p>
        </div>
        <div className="card !p-3 sm:!p-4">
          <Target size={18} className="text-orange-400 mb-1" />
          <p className="text-lg sm:text-xl font-semibold text-text-primary">{completedMs}/{thesis.milestones.length}</p>
          <p className="text-[10px] sm:text-caption text-text-muted">里程碑</p>
        </div>
      </div>

      {/* Chapters + Milestones row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Chapters */}
        <div className="card !p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5"><BookOpen size={16} className="text-mist-blue" /> 章节</h3>
            <button onClick={openAddCh} className="text-[11px] text-warm-brown hover:underline font-medium"><Plus size={12} className="inline" /> 添加</button>
          </div>
          {thesis.chapters.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-4">暂无章节</p>
          ) : (
            <div className="space-y-1.5">
              {thesis.chapters.map((ch: any) => {
                const isOpen = !collapsed.has(ch.id);
                return (
                  <div key={ch.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 p-2.5 cursor-pointer hover:bg-cream/50" onClick={() => toggle(ch.id)}>
                      <ChevronDown size={14} className={`text-text-muted transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${chStatusColors[ch.status] || 'bg-gray-50 text-text-muted'}`}>
                        {chStatusLabels[ch.status] || ch.status}
                      </span>
                      <span className="text-sm font-medium text-text-primary flex-1 line-clamp-1">{ch.title}</span>
                      <span className="text-[10px] text-text-muted">{(ch.wordCount / 10000).toFixed(1)}w</span>
                      <div className="flex gap-0.5" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEditCh(ch)} className="p-1 rounded hover:bg-gray-200 text-text-muted"><Edit3 size={11} /></button>
                        <button onClick={() => handleDeleteCh(ch.id)} className="p-1 rounded hover:bg-red-50 text-text-muted hover:text-red-500"><Trash2 size={11} /></button>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="px-3 pb-3 border-t border-gray-50 space-y-2">
                        <div className="flex items-center gap-1.5 pt-2">
                          <span className="text-[10px] text-text-muted">字数:</span>
                          <input type="number" value={ch.wordCount || ''} onChange={e => handleUpdateWC(ch.id, e.target.value)}
                            onClick={e => e.stopPropagation()} placeholder="0"
                            className="w-20 h-7 px-2 rounded-lg border border-gray-200 text-xs focus:border-warm-brown/30 focus:outline-none" />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {allChStatuses.map(s => (
                            <button key={s} onClick={e => { e.stopPropagation(); handleChStatus(ch.id, s); }}
                              className={`text-[10px] px-2 py-1 rounded-lg font-medium transition-colors ${ch.status === s ? 'bg-warm-brown text-white' : 'bg-gray-50 text-text-muted hover:bg-gray-100'}`}>
                              {chStatusLabels[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Milestones + Feedback */}
        <div className="space-y-4">
          <div className="card !p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5"><Target size={16} className="text-orange-400" /> 里程碑</h3>
              <button onClick={() => setShowMsModal(true)} className="text-[11px] text-warm-brown hover:underline font-medium"><Plus size={12} className="inline" /> 添加</button>
            </div>
            {thesis.milestones.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">暂无里程碑</p>
            ) : (
              <div className="space-y-1.5">
                {thesis.milestones.map((m: any) => (
                  <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-cream/50 group">
                    <button onClick={() => handleToggleMs(m.id)} className="flex-shrink-0">
                      {m.completed ? <CheckCircle2 size={16} className="text-mint-green" /> : <Clock size={16} className="text-text-muted" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] ${m.completed ? 'text-text-muted line-through' : 'text-text-secondary'}`}>{m.title}</p>
                      <p className="text-[10px] text-text-muted">{formatDateShort(m.date)}</p>
                    </div>
                    <button onClick={() => handleDeleteMs(m.id)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card !p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5"><MessageSquare size={16} className="text-warm-brown" /> 导师反馈</h3>
              <button onClick={() => setShowFbModal(true)} className="text-[11px] text-warm-brown hover:underline font-medium"><Plus size={12} className="inline" /> 添加</button>
            </div>
            {(thesis.advisorFeedback || []).length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">暂无导师反馈</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {thesis.advisorFeedback!.map((f: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-lg bg-cream/50 relative group">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-medium text-warm-brown">{f.topic}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-text-muted">{formatDateShort(f.date)}</span>
                        <button onClick={() => handleDeleteFb(i)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500"><X size={11} /></button>
                      </div>
                    </div>
                    <p className="text-[12px] text-text-secondary">{f.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next step editing modal */}
      {editingNextStep && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setEditingNextStep(false)} />
          <div className="modal-mobile-content relative z-50">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-serif font-semibold text-text-primary">编辑下一步计划</h2>
              <button onClick={() => setEditingNextStep(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} className="text-text-muted" /></button>
            </div>
            <div className="space-y-4">
              <F label="下一步" v={nextStepVal} onChange={setNextStepVal} ph="如：完成第二章初稿、联系导师讨论..." ta />
              <button onClick={handleSaveNextStep} className="w-full py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter modal */}
      {showChModal && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={resetChForm} />
          <div className="modal-mobile-content relative z-50">
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-serif font-semibold text-text-primary">{editingChId ? '编辑章节' : '添加章节'}</h2><button onClick={resetChForm} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} className="text-text-muted" /></button></div>
            <div className="space-y-4">
              <F label="章节标题 *" v={chTitle} onChange={setChTitle} ph="如：绪论、文献综述..." />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">状态</label>
                <div className="flex flex-wrap gap-1.5">
                  {allChStatuses.map(s => (
                    <button key={s} onClick={() => setChStatus(s)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${chStatus === s ? 'bg-warm-brown text-white' : 'bg-gray-50 text-text-muted hover:bg-gray-100'}`}>
                      {chStatusLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSaveCh} disabled={!chTitle.trim()} className="w-full py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors disabled:opacity-40">{editingChId ? '保存' : '添加'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Milestone modal */}
      {showMsModal && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setShowMsModal(false)} />
          <div className="modal-mobile-content relative z-50">
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-serif font-semibold text-text-primary">添加里程碑</h2><button onClick={() => setShowMsModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} className="text-text-muted" /></button></div>
            <div className="space-y-4">
              <F label="名称 *" v={msTitle} onChange={setMsTitle} ph="如：开题答辩、文献综述完成" />
              <div><label className="block text-sm font-medium text-text-primary mb-1.5">日期 *</label><input type="date" value={msDate} onChange={e => setMsDate(e.target.value)} className="w-full h-11 px-3.5 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none" /></div>
              <button onClick={handleAddMs} disabled={!msTitle.trim() || !msDate} className="w-full py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors disabled:opacity-40">添加</button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback modal */}
      {showFbModal && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setShowFbModal(false)} />
          <div className="modal-mobile-content relative z-50">
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-serif font-semibold text-text-primary">添加导师反馈</h2><button onClick={() => setShowFbModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} className="text-text-muted" /></button></div>
            <div className="space-y-4">
              <F label="主题 *" v={fbTopic} onChange={setFbTopic} ph="如：理论框架、研究方法" />
              <div><label className="block text-sm font-medium text-text-primary mb-1.5">日期</label><input type="date" value={fbDate} onChange={e => setFbDate(e.target.value)} className="w-full h-11 px-3.5 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none" /></div>
              <F label="反馈内容 *" v={fbContent} onChange={setFbContent} ph="导师的具体建议..." ta />
              <button onClick={handleAddFb} disabled={!fbTopic.trim() || !fbContent.trim()} className="w-full py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors disabled:opacity-40">添加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function F({ label, v, onChange, ph, ta }: { label: string; v: string; onChange: (v: string) => void; ph: string; ta?: boolean }) {
  const cls = 'w-full px-3.5 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none';
  return <div><label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>{ta ? <textarea value={v} onChange={e => onChange(e.target.value)} placeholder={ph} rows={3} className={`${cls} py-2.5 resize-none`} /> : <input value={v} onChange={e => onChange(e.target.value)} placeholder={ph} className={`${cls} h-11`} />}</div>;
}
