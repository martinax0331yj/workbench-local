import { useState } from 'react';
import { Search, X, Lightbulb, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../store';
import { formatRelative } from '../../utils';

export default function TheoryLibrary() {
  const { theories, deleteTheory } = useStore();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = search.trim()
    ? theories.filter(t => t.nameZh.toLowerCase().includes(search.toLowerCase()) || t.nameEn?.toLowerCase().includes(search.toLowerCase()) || t.coreConcepts.some(c => c.toLowerCase().includes(search.toLowerCase())))
    : theories;

  const selected = selectedId ? theories.find(t => t.id === selectedId) : null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">理论库</h1>
        <p className="text-body-sm text-text-muted mt-1">{theories.length} 个理论卡片</p>
      </div>

      <div className="relative mb-4 sm:mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索理论名称、概念..."
          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-10">
          <Lightbulb size={32} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary">暂无理论卡片</p>
          <button className="mt-3 text-sm text-warm-brown font-medium">新建理论卡片</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map(theory => (
            <div key={theory.id} onClick={() => setSelectedId(theory.id)} className="card !p-4 cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <Lightbulb size={18} className="text-warm-brown" />
                <ArrowUpRight size={13} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-0.5">{theory.nameZh}</h3>
              {theory.nameEn && <p className="text-[11px] text-text-muted italic mb-2">{theory.nameEn}</p>}
              <p className="text-caption text-text-muted mb-2">
                {theory.proposer} · {theory.yearProposed}
              </p>
              <div className="flex flex-wrap gap-1">
                {theory.coreConcepts.slice(0, 3).map(c => (
                  <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-full bg-mist-light/30 text-mist-purple">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setSelectedId(null)} />
          <div className="modal-mobile-content relative z-50 animate-[slideInUp_250ms_ease-out] sm:animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-serif font-semibold text-text-primary">{selected.nameZh}</h2>
                {selected.nameEn && <p className="text-sm text-text-muted italic">{selected.nameEn}</p>}
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-text-muted">{selected.proposer} · {selected.yearProposed}</p>

              {selected.coreConcepts.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-text-primary mb-1.5">核心概念</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.coreConcepts.map(c => <span key={c} className="text-[11px] px-2 py-0.5 rounded-full bg-mist-light/30 text-mist-purple">{c}</span>)}
                  </div>
                </div>
              )}

              {selected.corePropositions && selected.corePropositions.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-text-primary mb-1.5">核心命题</h3>
                  <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                    {selected.corePropositions.map((p: string, i: number) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}

              {selected.applicationLevel && (
                <div>
                  <h3 className="text-xs font-medium text-text-primary mb-1">适用层级</h3>
                  <p className="text-sm text-text-secondary">{selected.applicationLevel}</p>
                </div>
              )}

              {selected.boundaryConditions && (
                <div>
                  <h3 className="text-xs font-medium text-text-primary mb-1">理论边界</h3>
                  <p className="text-sm text-text-secondary">{selected.boundaryConditions}</p>
                </div>
              )}

              <div className="text-caption text-text-muted pt-2 border-t border-gray-50">
                创建于 {formatRelative(selected.createdAt)}
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-50">
                <button className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-100 text-text-secondary hover:bg-cream transition-colors">
                  编辑
                </button>
                <button
                  onClick={() => { deleteTheory(selected.id); setSelectedId(null); }}
                  className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-100 text-rose-500 hover:bg-rose-50 transition-colors"
                >
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
