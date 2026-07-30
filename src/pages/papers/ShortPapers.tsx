import { useState } from 'react';
import { Plus, FileText, Calendar, ChevronRight, BookOpen } from 'lucide-react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';

const paperStages = ['研究想法', '选题论证', '文献综述', '理论框架', '研究设计', '数据收集', '数据分析', '初稿写作', '内部修改', '投稿', '外审', '返修', '录用/归档'];

export default function ShortPapers() {
  const { shortPapers, updateShortPaper } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const paper = shortPapers.find(p => p.id === selectedId);

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">小论文</h1>
          <p className="text-body-sm text-text-muted mt-1">{shortPapers.length} 个项目</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-warm-brown text-white rounded-xl text-sm font-medium self-start sm:self-auto">
          <Plus size={15} /> 新建论文
        </button>
      </div>

      {shortPapers.length === 0 ? (
        <div className="card text-center py-12">
          <FileText size={40} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">暂无小论文项目</p>
          <button className="mt-3 text-sm text-warm-brown font-medium">创建第一篇文章</button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {shortPapers.map(p => {
            const stageIdx = paperStages.indexOf(p.stage);
            return (
              <div key={p.id} onClick={() => setSelectedId(p.id)} className="card !p-4 sm:!p-5 cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
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

                  <div className="hidden sm:block self-center">
                    <ChevronRight size={18} className="text-text-muted" />
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
    </div>
  );
}
