import { useState } from 'react';
import { Search, Filter, Grid3X3, List, Archive, Star, Trash2, X, ChevronDown, BookOpen, ExternalLink } from 'lucide-react';
import { useStore } from '../../store';
import { formatRelative, formatDateShort } from '../../utils';
import type { ReadingStatus, Literature } from '../../types';

const statusLabels: Record<ReadingStatus, string> = {
  'to-read': '待读', 'skimming': '略读中', 'reading': '精读中', 'completed': '已完成',
};

const statusColors: Record<ReadingStatus, string> = {
  'to-read': 'bg-gray-100 text-gray-600', 'skimming': 'bg-blue-50 text-mist-blue', 'reading': 'bg-warm-light text-warm-brown', 'completed': 'bg-green-50 text-mint-green',
};

export default function LiteratureLibrary() {
  const { literatures, toggleStarLiterature, deleteLiterature, updateLiteratureStatus } = useStore();
  const [view, setView] = useState<'card' | 'table'>('card');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  let filtered = literatures;
  if (statusFilter !== 'all') filtered = filtered.filter(l => l.readingStatus === statusFilter);
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(l => l.title.toLowerCase().includes(q) || l.authors.some(a => a.toLowerCase().includes(q)) || l.keywords.some(k => k.toLowerCase().includes(q)));
  }

  const selected = selectedId ? literatures.find(l => l.id === selectedId) : null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">文献库</h1>
        <p className="text-body-sm text-text-muted mt-1">{literatures.length} 篇文献</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-5">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索文献标题、作者、关键词..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 h-10 rounded-xl text-sm border transition-colors ${
              statusFilter !== 'all' ? 'border-warm-brown/30 bg-warm-light text-warm-brown' : 'border-gray-100 text-text-secondary hover:bg-cream'
            }`}
          >
            <Filter size={14} />
            <span className="hidden sm:inline">筛选</span>
            {statusFilter !== 'all' && <span className="text-[10px] hidden sm:inline">(1)</span>}
          </button>
          <div className="flex bg-white border border-gray-100 rounded-xl overflow-hidden">
            <button onClick={() => setView('card')} className={`px-2.5 py-2 ${view === 'card' ? 'bg-cream text-warm-brown' : 'text-text-muted hover:text-text-primary'}`}>
              <Grid3X3 size={15} />
            </button>
            <button onClick={() => setView('table')} className={`px-2.5 py-2 ${view === 'table' ? 'bg-cream text-warm-brown' : 'text-text-muted hover:text-text-primary'}`}>
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Status filter chips (mobile) */}
      {showFilters && (
        <div className="flex flex-wrap gap-1.5 mb-3 sm:hidden">
          {(['all', 'to-read', 'skimming', 'reading', 'completed'] as const).map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setShowFilters(false); }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === s ? 'bg-warm-brown text-white' : 'bg-gray-100 text-text-muted'}`}
            >
              {s === 'all' ? '全部' : statusLabels[s]}
            </button>
          ))}
        </div>
      )}

      {/* Status filter pills (desktop) */}
      <div className="hidden sm:flex gap-2 mb-4">
        {(['all', 'to-read', 'skimming', 'reading', 'completed'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === s ? 'bg-warm-brown text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
          >
            {s === 'all' ? '全部' : statusLabels[s]}
          </button>
        ))}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="card text-center py-10">
          <BookOpen size={32} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary">暂无符合条件的文献</p>
          <button className="mt-3 text-sm text-warm-brown font-medium">新建文献</button>
        </div>
      ) : view === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map(lit => (
            <div key={lit.id} onClick={() => setSelectedId(lit.id)} className="card !p-4 cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[lit.readingStatus]}`}>{statusLabels[lit.readingStatus]}</span>
                <div className="flex gap-0.5">
                  {lit.starred && <Star size={12} className="text-warm-brown fill-warm-brown" />}
                  {lit.archived && <Archive size={12} className="text-text-muted" />}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-text-primary line-clamp-2 mb-1.5 leading-snug">{lit.title}</h3>
              <p className="text-[11px] text-text-muted mb-2">{lit.authors.join(', ')} · {lit.year}</p>
              <p className="text-caption text-text-muted truncate">{lit.journal || lit.publisher}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {lit.keywords.slice(0, 3).map(kw => (
                  <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-text-muted">{kw}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-cream/30">
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-text-muted">标题</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-text-muted hidden sm:table-cell">作者</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-text-muted hidden md:table-cell">年份</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-text-muted hidden sm:table-cell">期刊</th>
                  <th className="text-center px-4 py-2.5 text-[11px] font-medium text-text-muted">状态</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lit => (
                  <tr key={lit.id} onClick={() => setSelectedId(lit.id)} className="border-b border-gray-50 hover:bg-cream/50 cursor-pointer transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-[13px] line-clamp-2">{lit.title}</span>
                      <span className="sm:hidden text-[10px] text-text-muted block mt-0.5">{lit.authors.join(', ')}</span>
                    </td>
                    <td className="px-4 py-2.5 text-text-muted text-[12px] hidden sm:table-cell">{lit.authors.join(', ')}</td>
                    <td className="px-4 py-2.5 text-text-muted text-[12px] hidden md:table-cell">{lit.year}</td>
                    <td className="px-4 py-2.5 text-text-muted text-[12px] hidden sm:table-cell truncate">{lit.journal || lit.publisher}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[lit.readingStatus]}`}>{statusLabels[lit.readingStatus]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setSelectedId(null)} />
          <div className="modal-mobile-content relative z-50 animate-[slideInUp_250ms_ease-out] sm:animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-serif font-semibold text-text-primary">{selected.title}</h2>
                <p className="text-sm text-text-muted mt-1">{selected.authors.join(', ')} · {selected.year} · {selected.journal || selected.publisher}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selected.readingStatus]}`}>{statusLabels[selected.readingStatus]}</span>
                {selected.literatureType && <span className="px-2 py-1 rounded-full text-xs bg-cream text-text-muted">{selected.literatureType}</span>}
              </div>

              {selected.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.keywords.map(kw => <span key={kw} className="text-[11px] px-2 py-0.5 rounded-full bg-cream text-text-muted">{kw}</span>)}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {selected.researchQuestion && <div><span className="text-text-muted text-xs">研究问题</span><p className="text-text-secondary mt-0.5">{selected.researchQuestion}</p></div>}
                {selected.methodology && <div><span className="text-text-muted text-xs">研究方法</span><p className="text-text-secondary mt-0.5">{selected.methodology}</p></div>}
                {selected.coreFindings && <div className="sm:col-span-2"><span className="text-text-muted text-xs">核心结论</span><p className="text-text-secondary mt-0.5">{selected.coreFindings}</p></div>}
                {selected.innovation && <div><span className="text-text-muted text-xs">创新点</span><p className="text-text-secondary mt-0.5">{selected.innovation}</p></div>}
                {selected.limitations && <div><span className="text-text-muted text-xs">局限</span><p className="text-text-secondary mt-0.5">{selected.limitations}</p></div>}
                {selected.connectionToMyResearch && <div className="sm:col-span-2"><span className="text-text-muted text-xs">与本人研究的关系</span><p className="text-text-secondary mt-0.5">{selected.connectionToMyResearch}</p></div>}
              </div>

              <div className="text-caption text-text-muted pt-2 border-t border-gray-50">
                创建于 {formatRelative(selected.createdAt)} · 更新于 {formatRelative(selected.updatedAt)}
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-50">
                <button onClick={() => toggleStarLiterature(selected.id)} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${selected.starred ? 'bg-warm-light border-warm-brown/30 text-warm-brown' : 'border-gray-100 text-text-secondary hover:bg-cream'}`}>
                  {selected.starred ? '已收藏' : '收藏'}
                </button>
                <button onClick={() => { deleteLiterature(selected.id); setSelectedId(null); }} className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-100 text-rose-500 hover:bg-rose-50 transition-colors">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
