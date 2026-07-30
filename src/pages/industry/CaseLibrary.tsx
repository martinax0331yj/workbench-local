import { useState } from 'react';
import { Search, Briefcase, Plus, X, TrendingUp } from 'lucide-react';
import { useStore } from '../../store';
import { formatRelative } from '../../utils';
import type { CaseStudy } from '../../types';

export default function CaseLibrary() {
  const { cases } = useStore();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CaseStudy | null>(null);

  const filtered = cases.filter(c => !search || c.name.includes(search) || c.industry.includes(search) || (c.coreIssue && c.coreIssue.includes(search)));

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">案例库</h1>
          <p className="text-body-sm text-text-muted mt-1">共 {cases.length} 个案例</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-warm-brown text-white rounded-xl text-sm font-medium self-start sm:self-auto">
          <Plus size={15} /> 添加案例
        </button>
      </div>

      <div className="relative mb-4 sm:mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索案例名称、行业、核心问题..."
          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none" />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-10">
          <Briefcase size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">暂无案例</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map(c => (
            <div key={c.id} className="card !p-4 cursor-pointer" onClick={() => setSelected(c)}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-mist-blue">{c.industry}</span>
                {c.evidenceLevel && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-text-muted">{c.evidenceLevel}</span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1 line-clamp-1">{c.name}</h3>
              <p className="text-caption text-text-muted line-clamp-2 mb-2">{c.coreIssue}</p>
              <p className="text-[10px] text-text-muted">
                {c.subject} · {formatRelative(c.updatedAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setSelected(null)} />
          <div className="modal-mobile-content relative z-50 animate-[slideInUp_250ms_ease-out] sm:animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-mist-blue">{selected.industry}</span>
                  {selected.evidenceLevel && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-text-muted">{selected.evidenceLevel}</span>}
                </div>
                <h2 className="text-lg font-serif font-semibold text-text-primary">{selected.name}</h2>
                <p className="text-sm text-text-muted mt-1">{selected.subject} · {selected.timeRange}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              {/* 事实层 */}
              <div>
                <h3 className="text-sm font-medium text-warm-brown mb-2 border-b border-warm-brown/20 pb-1">事实</h3>
                <div className="space-y-3 text-sm">
                  <Section title="背景" content={selected.background} />
                  <Section title="核心问题" content={selected.coreIssue} />
                  <Section title="主要行动" content={selected.mainActions} />
                  <Section title="商业模式" content={selected.businessModel} />
                  <Section title="组织与资源" content={selected.orgResources} />
                  <Section title="数字化实践" content={selected.digitalPractices} />
                  <Section title="实施成效" content={selected.outcomes} />
                  <Section title="存在问题" content={selected.problems} />
                </div>
              </div>

              {/* 机制层 */}
              <div>
                <h3 className="text-sm font-medium text-mist-purple mb-2 border-b border-mist-purple/20 pb-1">机制</h3>
                <Section title="成功/失败机制" content={selected.mechanism} />
              </div>

              {/* 启示 */}
              <div>
                <h3 className="text-sm font-medium text-mint-green mb-2 border-b border-mint-green/20 pb-1">启示</h3>
                <Section title="可借鉴点" content={selected.learnings} />
              </div>

              {selected.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-text-muted">{t}</span>)}
                </div>
              )}

              <div className="text-caption text-text-muted pt-2 border-t border-gray-50">
                {selected.dataSource && <span>数据来源: {selected.dataSource} · </span>}
                创建于 {formatRelative(selected.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, content }: { title: string; content?: string }) {
  if (!content) return null;
  return (
    <div>
      <span className="text-xs text-text-muted">{title}</span>
      <p className="text-[13px] text-text-secondary mt-0.5">{content}</p>
    </div>
  );
}
