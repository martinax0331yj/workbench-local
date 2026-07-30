import { useState } from 'react';
import { Search, BookMarked, Plus, X } from 'lucide-react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';

const readingStates: Record<string, string> = {
  'reading': '阅读中', 'completed': '已读完', 'to-read': '待读',
};

export default function ReadingNotes() {
  const { readingNotes } = useStore();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<'quick' | 'chapter' | 'review'>('quick');
  const note = readingNotes.find(n => n.id === selectedId);

  const filtered = readingNotes.filter(n => !search || n.bookTitle.includes(search) || n.author.includes(search) || n.coreQuestion?.includes(search));

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">读书笔记</h1>
          <p className="text-body-sm text-text-muted mt-1">共 {readingNotes.length} 条笔记</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-warm-brown text-white rounded-xl text-sm font-medium self-start sm:self-auto">
          <Plus size={15} /> 新建笔记
        </button>
      </div>

      <div className="relative mb-4 sm:mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索书名、作者..."
          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none" />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-10">
          <BookMarked size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">暂无读书笔记</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map(n => (
            <div key={n.id} className="card !p-4 cursor-pointer" onClick={() => setSelectedId(n.id)}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  n.readingStatus === 'completed' ? 'bg-mint-light/30 text-mint-green' :
                  n.readingStatus === 'reading' ? 'bg-blue-50 text-mist-blue' : 'bg-gray-100 text-text-muted'
                }`}>
                  {readingStates[n.readingStatus] || n.readingStatus}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1 line-clamp-1">{n.bookTitle}</h3>
              <p className="text-caption text-text-muted mb-1">{n.author} · {n.publishInfo}</p>
              {n.coreQuestion && <p className="text-caption text-text-muted line-clamp-2">{n.coreQuestion}</p>}
              <p className="text-[10px] text-text-muted mt-2">{formatRelative(n.updatedAt)}</p>
            </div>
          ))}
        </div>
      )}

      {note && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setSelectedId(null)} />
          <div className="modal-mobile-content relative z-50 animate-[slideInUp_250ms_ease-out] sm:animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-serif font-semibold text-text-primary">{note.bookTitle}</h2>
                <p className="text-sm text-text-muted mt-1">{note.author} · {note.publishInfo}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"><X size={18} /></button>
            </div>

            <div className="flex gap-1.5 mb-4 border-b border-gray-100 overflow-x-auto scrollbar-thin">
              {(['quick', 'chapter', 'review'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={`pb-2 px-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-warm-brown text-warm-brown' : 'border-transparent text-text-muted'}`}>
                  {t === 'quick' ? '速记' : t === 'chapter' ? '章节笔记' : '书评'}
                </button>
              ))}
            </div>

            {tab === 'quick' && (
              <div className="space-y-3 text-sm">
                {note.coreQuestion && <Section title="核心问题" content={note.coreQuestion} />}
                {note.coreIdeas && note.coreIdeas.map((idea, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-cream/50"><p className="text-[13px] text-text-secondary">{idea}</p></div>
                ))}
                {note.quotableContent && <Section title="可引用内容" content={note.quotableContent} />}
                {note.reflections && <Section title="反思与质疑" content={note.reflections} />}
              </div>
            )}

            {tab === 'chapter' && (
              <div className="space-y-3 text-sm">
                {note.chapterSummaries && note.chapterSummaries.map((ch, i) => (
                  <div key={i} className="p-3 rounded-xl bg-cream/50">
                    <p className="text-xs font-medium text-text-primary mb-1">{ch.title || `第${i + 1}章`}</p>
                    <p className="text-[13px] text-text-secondary">{ch.summary}</p>
                  </div>
                ))}
                {!note.chapterSummaries?.length && (
                  <p className="text-text-muted text-sm text-center py-4">暂无章节笔记</p>
                )}
              </div>
            )}

            {tab === 'review' && (
              <div className="space-y-3 text-sm">
                {note.coreIdeas && <Section title="整体评价" content={note.coreIdeas.join('；')} />}
                {note.keyConcepts && note.keyConcepts.map((c, i) => (
                  <span key={i} className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-cream text-text-muted mr-1.5 mb-1.5">{c}</span>
                ))}
                {note.connections && <Section title="知识联结" content={note.connections} />}
                {note.applicableScenarios && <Section title="可应用场景" content={note.applicableScenarios} />}
                {note.followUpReadings && <Section title="后续阅读建议" content={note.followUpReadings} />}
              </div>
            )}

            <div className="text-caption text-text-muted mt-4 pt-3 border-t border-gray-50">
              创建于 {formatRelative(note.createdAt)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  if (!content) return null;
  return (
    <div>
      <span className="text-xs text-text-muted">{title}</span>
      <p className="text-[13px] text-text-secondary mt-0.5">{content}</p>
    </div>
  );
}
