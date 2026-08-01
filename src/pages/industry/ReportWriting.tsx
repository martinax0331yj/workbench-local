import { useState } from 'react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';
import {
  FileText, Plus, X, ChevronRight, CheckCircle2, Circle,
  ListTodo, Calendar, Target, Globe, BookOpen, Lightbulb,
  Clock, AlertTriangle,
} from 'lucide-react';

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ReportWriting() {
  const { reports, addReport, updateReport, deleteReport } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '', type: 'industry', client: '', coreQuestion: '',
    targetReader: '', outlineText: '', materialList: '', dataSources: '',
    keyConclusions: '', checklistText: '', deadline: '', status: 'planning',
  });

  const resetForm = () => {
    setForm({
      title: '', type: 'industry', client: '', coreQuestion: '',
      targetReader: '', outlineText: '', materialList: '', dataSources: '',
      keyConclusions: '', checklistText: '', deadline: '', status: 'planning',
    });
    setShowModal(false);
    setEditingId(null);
  };

  const setFormField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const openCreate = () => { resetForm(); setShowModal(true); };

  const openEdit = (r: any) => {
    setForm({
      title: r.title, type: r.type, client: r.client || '', coreQuestion: r.coreQuestion || '',
      targetReader: r.targetReader || '', outlineText: (r.outline || []).join('\n'),
      materialList: r.materialList || '', dataSources: r.dataSources || '',
      keyConclusions: r.keyConclusions || '', checklistText: (r.checklist || []).join('\n'),
      deadline: r.deadline || '', status: r.status || 'planning',
    });
    setEditingId(r.id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const base = {
      title: form.title.trim(),
      type: form.type,
      client: form.client.trim(),
      coreQuestion: form.coreQuestion.trim(),
      targetReader: form.targetReader.trim(),
      outline: form.outlineText.split('\n').map(s => s.trim()).filter(Boolean),
      materialList: form.materialList.trim(),
      dataSources: form.dataSources.trim(),
      keyConclusions: form.keyConclusions.trim(),
      checklist: form.checklistText.split('\n').map(s => s.trim()).filter(Boolean),
      deadline: form.deadline || undefined,
      status: form.status,
    };

    if (editingId) {
      updateReport(editingId, base);
    } else {
      addReport({
        ...base,
        linkedPolicyIds: [],
        linkedCaseIds: [],
        linkedNoteIds: [],
        outputFiles: [],
      } as any);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除该报告？')) {
      deleteReport(id);
      if (selectedId === id) setSelectedId(null);
    }
  };

  const handleToggleChecklist = (report: any, idx: number) => {
    const checklist = [...(report.checklist || [])];
    const item = checklist[idx];
    checklist[idx] = item.startsWith('✓ ') ? item.replace('✓ ', '') : '✓ ' + item;
    updateReport(report.id, { checklist });
  };

  const selected = reports.find(r => r.id === selectedId);

  const statusLabels: Record<string, string> = {
    planning: '规划中', researching: '研究中', drafting: '写作中',
    reviewing: '审核中', completed: '已完成', delivered: '已交付',
  };
  const statusColors: Record<string, string> = {
    planning: 'bg-blue-50 text-mist-blue', researching: 'bg-purple-50 text-mist-purple',
    drafting: 'bg-warm-light text-warm-brown', reviewing: 'bg-orange-50 text-orange-600',
    completed: 'bg-green-50 text-mint-green', delivered: 'bg-green-100 text-mint-green',
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="page-title">报告写作</h1>
            <p className="text-body-sm text-text-muted mt-1">行业研究报告与企业咨询报告的写作管理</p>
          </div>
          <button onClick={openCreate}
            className="self-start inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors">
            <Plus size={15} /> 新建报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={selected ? 'hidden lg:block' : ''}>
          {reports.length === 0 ? (
            <div className="card text-center py-12">
              <FileText size={40} className="text-text-muted mx-auto mb-3 opacity-40" />
              <p className="text-body-sm text-text-muted">暂无报告，点击右上角新建</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-0.5 scrollbar-thin">
              {[...reports].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(r => {
                const completedChecklist = (r.checklist || []).filter(c => c.startsWith('✓ ')).length;
                const totalChecklist = (r.checklist || []).length;
                return (
                  <div key={r.id} onClick={() => setSelectedId(r.id)}
                    className={`card !p-3 sm:!p-4 cursor-pointer transition-all ${
                      selectedId === r.id ? 'ring-2 ring-warm-brown/20 border-warm-brown/30' : ''
                    }`}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[r.status || 'planning'] || 'bg-gray-50 text-text-muted'}`}>
                            {statusLabels[r.status || ''] || r.status || '规划中'}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-50 text-text-muted font-medium">
                            {r.type}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{r.title}</h3>
                      </div>
                      <ChevronRight size={14} className="text-text-muted mt-1 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-text-muted">
                      {r.client && <span className="flex items-center gap-1"><Globe size={10} /> {r.client}</span>}
                      {totalChecklist > 0 && (
                        <span className="flex items-center gap-1"><ListTodo size={10} /> {completedChecklist}/{totalChecklist}</span>
                      )}
                      {r.deadline && <span className="flex items-center gap-0.5"><Calendar size={10} />{formatDateShort(r.deadline)}</span>}
                      <span>{formatRelative(r.updatedAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div className="card !p-4 sm:!p-5 max-h-[70vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[selected.status || 'planning'] || 'bg-gray-50 text-text-muted'}`}>
                    {statusLabels[selected.status || ''] || selected.status || '规划中'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-50 text-text-muted font-medium">{selected.type}</span>
                </div>
                <h2 className="text-base sm:text-lg font-serif font-semibold text-text-primary">{selected.title}</h2>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(selected)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted">
                  <FileText size={14} />
                </button>
                <button onClick={() => handleDelete(selected.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <Detail label="类型" value={selected.type} />
              {selected.client && <Detail label="客户" value={selected.client} />}
              {selected.coreQuestion && <Detail label="核心问题" value={selected.coreQuestion} />}
              {selected.targetReader && <Detail label="目标读者" value={selected.targetReader} />}
              {selected.deadline && <Detail label="交付日期" value={formatDateShort(selected.deadline)} />}

              {(selected.outline || []).length > 0 && (
                <div>
                  <p className="text-xs text-text-muted font-medium mb-1.5 flex items-center gap-1">
                    <ListTodo size={12} /> 大纲
                  </p>
                  <div className="space-y-1">
                    {selected.outline!.map((item, i) => (
                      <div key={i} className="text-[13px] text-text-secondary pl-4 border-l-2 border-cream py-0.5">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.materialList && <Detail label="材料清单" value={selected.materialList} />}
              {selected.dataSources && <Detail label="数据来源" value={selected.dataSources} />}
              {selected.keyConclusions && <Detail label="关键结论" value={selected.keyConclusions} />}

              {(selected.checklist || []).length > 0 && (
                <div>
                  <p className="text-xs text-text-muted font-medium mb-1.5 flex items-center gap-1">
                    <CheckCircle2 size={12} /> 写作清单
                  </p>
                  <div className="space-y-1.5">
                    {selected.checklist!.map((item, i) => {
                      const done = item.startsWith('✓ ');
                      const text = done ? item.replace('✓ ', '') : item;
                      return (
                        <button key={i} onClick={() => handleToggleChecklist(selected, i)}
                          className="flex items-start gap-2 w-full text-left p-1.5 rounded-lg hover:bg-cream/50 transition-colors">
                          {done ? (
                            <CheckCircle2 size={14} className="text-mint-green mt-0.5 flex-shrink-0" />
                          ) : (
                            <Circle size={14} className="text-text-muted mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-[13px] ${done ? 'text-text-muted line-through' : 'text-text-secondary'}`}>
                            {text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selected.versions && selected.versions.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted font-medium mb-1.5 flex items-center gap-1">
                    <Clock size={12} /> 版本历史
                  </p>
                  <div className="space-y-1">
                    {selected.versions.map((v, i) => (
                      <div key={i} className="text-xs text-text-muted flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cream" />
                        {formatDateShort(v.date)} {v.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <p className="text-[10px] text-text-muted mt-4 pt-3 border-t border-gray-50">
              创建于 {formatRelative(selected.createdAt)}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={resetForm} />
          <div className="modal-mobile-content relative z-50">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-serif font-semibold text-text-primary">
                {editingId ? '编辑报告' : '新建报告'}
              </h2>
              <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} className="text-text-muted" /></button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <FormField label="报告标题 *" value={form.title} onChange={v => setFormField('title', v)} placeholder="如：2024中国出版业数字化转型报告" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">报告类型</label>
                  <select value={form.type} onChange={e => setFormField('type', e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none bg-white">
                    <option value="industry">行业研究</option>
                    <option value="consulting">咨询报告</option>
                    <option value="policy">政策分析</option>
                    <option value="academic">学术报告</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">状态</label>
                  <select value={form.status} onChange={e => setFormField('status', e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none bg-white">
                    {Object.entries(statusLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <FormField label="客户" value={form.client} onChange={v => setFormField('client', v)} placeholder="委托方/客户名称" />
              <FormField label="核心问题" value={form.coreQuestion} onChange={v => setFormField('coreQuestion', v)} placeholder="报告要回答的核心问题" />
              <FormField label="目标读者" value={form.targetReader} onChange={v => setFormField('targetReader', v)} placeholder="谁会阅读这份报告" />
              <FormField label="大纲（每行一条）" value={form.outlineText} onChange={v => setFormField('outlineText', v)} placeholder={`1. 行业概况\n2. 竞争格局\n3. ...`} isTextarea />
              <FormField label="材料清单" value={form.materialList} onChange={v => setFormField('materialList', v)} placeholder="需要准备的材料" isTextarea />
              <FormField label="数据来源" value={form.dataSources} onChange={v => setFormField('dataSources', v)} placeholder="计划使用的数据来源" isTextarea />
              <FormField label="关键结论" value={form.keyConclusions} onChange={v => setFormField('keyConclusions', v)} placeholder="初步结论或核心观点" isTextarea />
              <FormField label="写作清单（每行一条）" value={form.checklistText} onChange={v => setFormField('checklistText', v)} placeholder={`完成数据分析\n撰写核心章节\n...`} isTextarea />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">截止日期</label>
                <input type="date" value={form.deadline} onChange={e => setFormField('deadline', e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none" />
              </div>
              <button onClick={handleSave} disabled={!form.title.trim()}
                className="w-full py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {editingId ? '保存修改' : '新建报告'}
              </button>
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
      <p className="text-xs text-text-muted font-medium mb-0.5">{label}</p>
      <p className="text-[13px] text-text-secondary whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, isTextarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; isTextarea?: boolean;
}) {
  const cls = 'w-full px-3.5 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none';
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>
      {isTextarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          rows={3} className={`${cls} py-2.5 resize-none`} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`${cls} h-11`} />
      )}
    </div>
  );
}
