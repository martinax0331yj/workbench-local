import { useState } from 'react';
import { Search, Building2, Calendar, ExternalLink, Plus, X } from 'lucide-react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';
import type { Policy } from '../../types';

export default function PolicyLibrary() {
  const { policies } = useStore();
  const [search, setSearch] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  const filtered = policies.filter(p =>
    !search || p.name.includes(search) || p.issuingBody.includes(search) || p.domain.includes(search)
  );

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">政策文件库</h1>
          <p className="text-body-sm text-text-muted mt-1">共 {policies.length} 份政策文件</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-warm-brown text-white rounded-xl text-sm font-medium self-start sm:self-auto">
          <Plus size={15} /> 添加政策
        </button>
      </div>

      <div className="relative mb-4 sm:mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索政策名称、发布机构..."
          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-10">
          <Building2 size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">暂无政策文件</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(pol => (
            <div key={pol.id} className="card !p-4 cursor-pointer" onClick={() => setSelectedPolicy(pol)}>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${pol.isActive ? 'bg-mint-light/30 text-mint-green' : 'bg-gray-100 text-text-muted'}`}>
                  {pol.isActive ? '有效' : '已失效'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-mist-light/30 text-mist-purple">
                  {pol.level === 'national' ? '国家级' : pol.level === 'provincial' ? '省级' : pol.level === 'municipal' ? '市级' : '部门级'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">{pol.name}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-text-muted">
                <span className="flex items-center gap-1"><Building2 size={10} /> {pol.issuingBody}</span>
                <span className="flex items-center gap-1"><Calendar size={10} /> {formatDateShort(pol.issueDate)}</span>
                <span>{formatRelative(pol.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPolicy && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setSelectedPolicy(null)} />
          <div className="modal-mobile-content relative z-50 animate-[slideInUp_250ms_ease-out] sm:animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${selectedPolicy.isActive ? 'bg-mint-light/30 text-mint-green' : 'bg-gray-100 text-text-muted'}`}>
                  {selectedPolicy.isActive ? '有效' : '已失效'}
                </span>
                <h2 className="text-lg font-serif font-semibold text-text-primary mt-2">{selectedPolicy.name}</h2>
              </div>
              <button onClick={() => setSelectedPolicy(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <DetailRow label="发布机构" value={selectedPolicy.issuingBody} />
              <DetailRow label="发布层级" value={selectedPolicy.level === 'national' ? '国家级' : selectedPolicy.level} />
              <DetailRow label="发布日期" value={formatDateShort(selectedPolicy.issueDate)} />
              <DetailRow label="生效日期" value={selectedPolicy.effectiveDate ? formatDateShort(selectedPolicy.effectiveDate) : '即时生效'} />
              <DetailRow label="政策领域" value={selectedPolicy.domain} />
              <DetailRow label="政策对象" value={selectedPolicy.target} />
            </div>

            <div className="mt-4 space-y-3">
              <DetailSection title="核心目标" content={selectedPolicy.coreGoal} />
              <DetailSection title="主要任务" content={selectedPolicy.mainTasks} />
              <DetailSection title="关键措施" content={selectedPolicy.keyMeasures} />
              <DetailSection title="与出版业的关系" content={selectedPolicy.relationToPublishing} />
              {selectedPolicy.personalInterpretation && (
                <DetailSection title="个人解读" content={selectedPolicy.personalInterpretation} />
              )}
              {selectedPolicy.quotableParagraphs && (
                <DetailSection title="可引用段落" content={selectedPolicy.quotableParagraphs} />
              )}
            </div>

            {selectedPolicy.sourceUrl && (
              <a href={selectedPolicy.sourceUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-mist-blue hover:underline mt-4">
                <ExternalLink size={12} /> 原文链接
              </a>
            )}

            {selectedPolicy.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selectedPolicy.tags.map(tag => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-text-muted">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <span className="text-caption text-text-muted">{label}</span>
      <p className="text-[13px] sm:text-sm text-text-secondary mt-0.5">{value || '-'}</p>
    </div>
  );
}

function DetailSection({ title, content }: { title: string; content?: string }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-[13px] sm:text-sm text-text-secondary">{content || '-'}</p>
    </div>
  );
}
