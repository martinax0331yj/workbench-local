import { useState } from 'react';
import { Plus, FileText, Calendar, ChevronRight, BookOpen, Archive, RotateCcw, Trash2, X } from 'lucide-react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';
import { ConfirmDialog, useToast } from '../../components/common';

const paperStages = ['研究想法', '选题论证', '文献综述', '理论框架', '研究设计', '数据收集', '数据分析', '初稿写作', '内部修改', '投稿', '外审', '返修', '录用/归档'];

export default function ShortPapers() {
  const { shortPapers, addShortPaper, updateShortPaper, deleteShortPaper, archiveShortPaper, restoreShortPaper } = useStore();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [newPaper, setNewPaper] = useState({ title: '', type: '期刊论文', stage: '研究想法', researchQuestion: '', methodology: '', deadline: '' });
  const paper = shortPapers.find(p => p.id === selectedId);
  const delPaper = shortPapers.find(p => p.id === deleteTarget);

  const handleCreate = () => {
    if (!newPaper.title.trim()) { toast.error('请输入论文标题'); return; }
    addShortPaper({
      title: newPaper.title, type: newPaper.type as any, stage: newPaper.stage,
      researchQuestion: newPaper.researchQuestion, methodology: newPaper.methodology,
      progress: 0, chapters: [], writingTasks: [],
      deadline: newPaper.deadline || null, targetJournal: '', dataSource: '', collaborators: [],
      nextStep: '', versions: [], submissions: [], archived: false
    });
    toast.success('小论文已创建');
    setNewPaper({ title: '', type: '期刊论文', stage: '研究想法', researchQuestion: '', methodology: '', deadline: '' });
    setShowCreate(false);
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">小论文</h1>
          <p className="text-body-sm text-text-muted mt-1">{shortPapers.filter(p => !p.archived).length} 个项目</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-warm-brown text-white rounded-xl text-sm font-medium self-start sm:self-auto hover:bg-warm-brown/90 transition-colors">
          <Plus size={15} /> 新建论文
        </button>
      </div>

      {shortPapers.length === 0 ? (
        <div className="card text-center py-12">
          <FileText size={40} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">暂无小论文项目</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-sm text-warm-brown font-medium hover:underline">创建第一篇文章</button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {shortPapers.filter(p => !p.archived).map(p => {
            const stageIdx = paperStages.indexOf(p.stage);
            return (
              <div key={p.id} className="card !p-4 sm:!p-5 cursor-pointer group">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0" onClick={() => setSelectedId(p.id)}>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-mist-light/50 text-mist-purple font-medium">{p.type}</span>
                      <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-text-muted">{p.stage}</span>
                      {p.targetJournal && <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-mist-blue">投 {p.targetJournal}</span>}
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1.5">{p.title}</h3>
                    {p.researchQuestion && <p className="text-caption text-text-muted line-clamp-1 mb-2">{p.researchQuestion}</p>}
                    
                    {/* Stage progress */}
                    <div className="progress-bar mb-2">
                      <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-text-muted">
                      <span>{p.progress}%</span>
                      {p.deadline && <span className="flex items-center gap-0.5"><Calendar size={10} /> {formatDateShort(p.deadline)}</span>}
                      <span>{formatRelative(p.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); archiveShortPaper(p.id); toast.success('已归档'); }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted opacity-0 group-hover:opacity-100 transition-all"
                      title="归档"
                    >
                      <Archive size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(p.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="hidden sm:block" onClick={() => setSelectedId(p.id)}>
                      <ChevronRight size={18} className="text-text-muted" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {paper && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setSelectedId(null)} />
          <div className="modal-mobile-content relative z-50 animate-[slideInUp_250ms_ease-out] sm:animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-mist-light/50 text-mist-purple font-medium">{paper.type}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-warm-light text-warm-brown font-medium">{paper.stage}</span>
                </div>
                <h2 className="text-lg font-serif font-semibold text-text-primary">{paper.title}</h2>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted flex-shrink-0">
                <FileText size={18} />
              </button>
            </div>

            <div className="progress-bar mb-4">
              <div className="progress-fill" style={{ width: `${paper.progress}%` }} />
            </div>
            <div className="flex justify-between text-caption text-text-muted mb-4">
              <span>总体进度 {paper.progress}%</span>
              {paper.deadline && <span>截止 {formatDateShort(paper.deadline)}</span>}
            </div>

            {/* Paper stages */}
            <div className="mb-4">
              <h3 className="text-xs font-medium text-text-primary mb-2">论文阶段</h3>
              <div className="flex flex-wrap gap-1">
                {paperStages.map((s, i) => {
                  const pi = paperStages.indexOf(paper.stage);
                  return (
                    <span key={s} className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full ${
                      i === pi ? 'bg-warm-brown text-white' :
                      i < pi ? 'bg-mint-light/30 text-mint-green' : 'bg-gray-100 text-text-muted'
                    }`}>{s}</span>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {paper.researchQuestion && <div><span className="text-xs text-text-muted">研究问题</span><p className="text-text-secondary text-[13px] mt-0.5">{paper.researchQuestion}</p></div>}
              {paper.methodology && <div><span className="text-xs text-text-muted">研究方法</span><p className="text-text-secondary text-[13px] mt-0.5">{paper.methodology}</p></div>}
              {paper.dataSource && <div><span className="text-xs text-text-muted">数据来源</span><p className="text-text-secondary text-[13px] mt-0.5">{paper.dataSource}</p></div>}
              {paper.collaborators?.length > 0 && <div><span className="text-xs text-text-muted">合作者</span><p className="text-text-secondary text-[13px] mt-0.5">{paper.collaborators.join(', ')}</p></div>}
            </div>

            {/* Chapters */}
            {paper.chapters && paper.chapters.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-medium text-text-primary mb-2">章节进度</h3>
                <div className="space-y-1.5">
                  {paper.chapters.map(ch => (
                    <div key={ch.id} className="flex items-center justify-between py-1">
                      <span className="text-[13px] text-text-secondary">{ch.title}</span>
                      <span className="text-[11px] text-text-muted">{ch.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Writing tasks */}
            {paper.writingTasks && paper.writingTasks.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-medium text-text-primary mb-2">写作任务</h3>
                <div className="space-y-1">
                  {paper.writingTasks.map(t => (
                    <div key={t.id} className="flex items-center gap-2 text-[13px] text-text-secondary py-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${t.completed ? 'bg-mint-green' : 'bg-gray-300'}`} />
                      <span className={t.completed ? 'line-through text-text-muted' : ''}>{t.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paper.nextStep && (
              <div className="mt-4 p-3 rounded-xl bg-warm-light/30">
                <span className="text-[10px] text-warm-brown font-medium">下一步</span>
                <p className="text-[13px] text-text-secondary mt-0.5">{paper.nextStep}</p>
              </div>
            )}

            <div className="text-caption text-text-muted mt-4 pt-3 border-t border-gray-50">
              创建于 {formatRelative(paper.createdAt)}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">新建小论文</h2>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted block mb-1.5">论文标题 *</label>
                <input value={newPaper.title} onChange={e => setNewPaper(p => ({ ...p, title: e.target.value }))}
                  placeholder="输入论文标题" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted block mb-1.5">类型</label>
                  <select value={newPaper.type} onChange={e => setNewPaper(p => ({ ...p, type: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm">
                    <option>期刊论文</option><option>会议论文</option><option>预印本</option><option>综述</option><option>其他</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1.5">阶段</label>
                  <select value={newPaper.stage} onChange={e => setNewPaper(p => ({ ...p, stage: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm">
                    {paperStages.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">研究问题</label>
                <input value={newPaper.researchQuestion} onChange={e => setNewPaper(p => ({ ...p, researchQuestion: e.target.value }))}
                  placeholder="输入研究问题" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">研究方法</label>
                <input value={newPaper.methodology} onChange={e => setNewPaper(p => ({ ...p, methodology: e.target.value }))}
                  placeholder="如：内容分析法、访谈法" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">截止日期</label>
                <input type="date" value={newPaper.deadline} onChange={e => setNewPaper(p => ({ ...p, deadline: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={handleCreate} className="flex-1 px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors">创建</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) { deleteShortPaper(deleteTarget); toast.success('小论文已删除'); setDeleteTarget(null); if (selectedId === deleteTarget) setSelectedId(null); } }}
        title="删除小论文"
        message="删除后将无法恢复，论文的基本信息将会丢失。"
        itemName={delPaper?.title}
        affectedItems={delPaper?.writingTasks ? [
          { label: '写作任务', count: delPaper.writingTasks.length },
          { label: '章节', count: delPaper.chapters?.length || 0 }
        ] : undefined}
      />

      {/* Archived Papers */}
      {shortPapers.filter(p => p.archived).length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-text-muted mb-3">已归档</h2>
          <div className="space-y-2">
            {shortPapers.filter(p => p.archived).map(p => (
              <div key={p.id} className="card !p-3 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-text-muted mr-2">{p.type}</span>
                  <span className="text-sm text-text-secondary">{p.title}</span>
                </div>
                <button
                  onClick={() => { restoreShortPaper(p.id); toast.success('已恢复'); }}
                  className="p-1.5 rounded-lg hover:bg-mint-light/50 text-text-muted hover:text-mint-green transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
