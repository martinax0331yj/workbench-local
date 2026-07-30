import { useState } from 'react';
import { Search, FileBarChart, Plus, X, Calendar, ChevronRight } from 'lucide-react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';

export default function ReportWriting() {
  const { reports } = useStore();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const report = reports.find(r => r.id === selectedId);

  const filtered = reports.filter(r => !search || r.title.includes(search) || (r.coreQuestion && r.coreQuestion.includes(search)));

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">报告撰写</h1>
          <p className="text-body-sm text-text-muted mt-1">共 {reports.length} 份报告项目</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-warm-brown text-white rounded-xl text-sm font-medium self-start sm:self-auto">
          <Plus size={15} /> 新建报告
        </button>
      </div>

      <div className="relative mb-4 sm:mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索报告标题..."
          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none" />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-10">
          <FileBarChart size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">暂无报告项目</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="card !p-4 cursor-pointer" onClick={() => setSelectedId(r.id)}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warm-light text-warm-brown font-medium">{r.type}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-text-muted">{r.status === 'drafting' ? '撰写中' : r.status === 'reviewing' ? '审核中' : r.status === 'completed' ? '已完成' : r.status}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">{r.title}</h3>
                  <p className="text-caption text-text-muted line-clamp-1">{r.coreQuestion}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] text-text-muted">
                    {r.deadline && <span className="flex items-center gap-0.5"><Calendar size={10} />{formatDateShort(r.deadline)}</span>}
                    <span>{formatRelative(r.updatedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {r.progress !== undefined && (
                    <div className="text-right">
                      <div className="progress-bar w-20 sm:w-24">
                        <div className="progress-fill" style={{ width: `${r.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-text-muted">{r.progress}%</span>
                    </div>
                  )}
                  <ChevronRight size={16} className="text-text-muted hidden sm:block" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {report && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setSelectedId(null)} />
          <div className="modal-mobile-content relative z-50 animate-[slideInUp_250ms_ease-out] sm:animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warm-light text-warm-brown font-medium">{report.type}</span>
                <h2 className="text-lg font-serif font-semibold text-text-primary mt-2">{report.title}</h2>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"><X size={18} /></button>
            </div>

            <div className="space-y-3 text-sm">
              {report.coreQuestion && <Detail label="核心问题" value={report.coreQuestion} />}
              {report.deadline && <Detail label="交付日期" value={formatDateShort(report.deadline)} />}
              {report.keyConclusions && <Detail label="关键结论" value={report.keyConclusions} />}
            </div>

            {report.outline && report.outline.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-medium text-text-primary mb-2">报告大纲</h3>
                <div className="space-y-1">
                  {report.outline.map((item, i) => (
                    <div key={i} className="text-[13px] text-text-secondary py-1 pl-2 border-l-2 border-warm-brown/20">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.checklist && report.checklist.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-medium text-text-primary mb-2">待核查事项</h3>
                <ul className="list-disc list-inside text-[13px] text-text-secondary space-y-1">
                  {report.checklist.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}

            <div className="text-caption text-text-muted mt-4 pt-3 border-t border-gray-50">
              创建于 {formatRelative(report.createdAt)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-text-muted">{label}</span>
      <p className="text-[13px] text-text-secondary mt-0.5">{value}</p>
    </div>
  );
}
