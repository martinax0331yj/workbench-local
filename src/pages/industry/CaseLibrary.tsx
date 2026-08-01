import { useState } from 'react';
import { useStore } from '../../store';
import { formatRelative } from '../../utils';
import {
  Building2, Plus, X, ChevronRight, Briefcase, Tag,
  FileText, Lightbulb, AlertTriangle, Target, Search,
  Database,
} from 'lucide-react';

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function CaseLibrary() {
  const { cases, addCase, updateCase, deleteCase } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '', subject: '', industry: '', timeRange: '',
    background: '', coreIssue: '', mainActions: '', businessModel: '',
    orgResources: '', digitalPractices: '', outcomes: '',
    problems: '', mechanism: '', learnings: '', dataSource: '',
    evidenceLevel: 'secondary', tags: '',
  });

  const resetForm = () => {
    setForm({
      name: '', subject: '', industry: '', timeRange: '',
      background: '', coreIssue: '', mainActions: '', businessModel: '',
      orgResources: '', digitalPractices: '', outcomes: '',
      problems: '', mechanism: '', learnings: '', dataSource: '',
      evidenceLevel: 'secondary', tags: '',
    });
    setShowModal(false);
    setEditingId(null);
  };

  const setFormField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const openCreate = () => { resetForm(); setShowModal(true); };

  const openEdit = (c: any) => {
    setForm({
      name: c.name, subject: c.subject || '', industry: c.industry, timeRange: c.timeRange || '',
      background: c.background || '', coreIssue: c.coreIssue || '', mainActions: c.mainActions || '',
      businessModel: c.businessModel || '', orgResources: c.orgResources || '',
      digitalPractices: c.digitalPractices || '', outcomes: c.outcomes || '',
      problems: c.problems || '', mechanism: c.mechanism || '', learnings: c.learnings || '',
      dataSource: c.dataSource || '', evidenceLevel: c.evidenceLevel || 'secondary',
      tags: c.tags.join(', '),
    });
    setEditingId(c.id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.industry.trim()) return;
    const base = {
      name: form.name.trim(),
      subject: form.subject.trim(),
      industry: form.industry.trim(),
      timeRange: form.timeRange.trim(),
      background: form.background.trim(),
      coreIssue: form.coreIssue.trim(),
      mainActions: form.mainActions.trim(),
      businessModel: form.businessModel.trim(),
      orgResources: form.orgResources.trim(),
      digitalPractices: form.digitalPractices.trim(),
      outcomes: form.outcomes.trim(),
      problems: form.problems.trim(),
      mechanism: form.mechanism.trim(),
      learnings: form.learnings.trim(),
      dataSource: form.dataSource.trim(),
      evidenceLevel: form.evidenceLevel,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (editingId) {
      updateCase(editingId, base);
    } else {
      addCase({
        ...base,
        linkedPolicyIds: [],
        linkedReportIds: [],
      } as any);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除该案例？')) {
      deleteCase(id);
      if (selectedId === id) setSelectedId(null);
    }
  };

  const filtered = search.trim()
    ? cases.filter(c =>
        c.name.includes(search) ||
        c.industry.includes(search) ||
        c.subject?.includes(search) ||
        c.tags.some(t => t.includes(search))
      )
    : cases;

  const selected = cases.find(c => c.id === selectedId);

  return (
    <div>
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="page-title">案例库</h1>
            <p className="text-body-sm text-text-muted mt-1">收集分析行业案例，提炼经验教训与最佳实践</p>
          </div>
          <button onClick={openCreate}
            className="self-start inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors">
            <Plus size={15} /> 添加案例
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="搜索案例名称、行业、主题..."
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* List */}
        <div className={selected ? 'hidden lg:block' : ''}>
          {filtered.length === 0 ? (
            <div className="card text-center py-12">
              <Building2 size={40} className="text-text-muted mx-auto mb-3 opacity-40" />
              <p className="text-body-sm text-text-muted">暂无案例，点击右上角添加</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-0.5 scrollbar-thin">
              {filtered.map(c => (
                <div key={c.id} onClick={() => setSelectedId(c.id)}
                  className={`card !p-3 sm:!p-4 cursor-pointer transition-all ${
                    selectedId === c.id ? 'ring-2 ring-warm-brown/20 border-warm-brown/30' : ''
                  }`}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-mist-blue font-medium">
                          {c.industry}
                        </span>
                        {c.evidenceLevel && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-warm-brown font-medium">
                            {c.evidenceLevel === 'primary' ? '一手资料' : '二手资料'}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{c.name}</h3>
                    </div>
                    <ChevronRight size={14} className="text-text-muted mt-1 flex-shrink-0" />
                  </div>
                  {c.subject && (
                    <p className="text-xs text-text-muted line-clamp-2">{c.subject}</p>
                  )}
                  <p className="text-[10px] text-text-muted mt-2">
                    {c.subject} · {formatRelative(c.updatedAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div className="card !p-4 sm:!p-5 max-h-[70vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-mist-blue font-medium">
                    {selected.industry}
                  </span>
                  {selected.evidenceLevel && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-warm-brown font-medium">
                      {selected.evidenceLevel === 'primary' ? '一手资料' : '二手资料'}
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-serif font-semibold text-text-primary">{selected.name}</h2>
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

            <div className="space-y-3 text-sm">
              {selected.subject && <Section icon={Target} title="研究对象" content={selected.subject} />}
              {selected.timeRange && <Section icon={Tag} title="时间范围" content={selected.timeRange} />}
              {selected.background && <Section icon={FileText} title="背景" content={selected.background} />}
              {selected.coreIssue && <Section icon={AlertTriangle} title="核心问题" content={selected.coreIssue} />}
              {selected.mainActions && <Section icon={Briefcase} title="主要行动" content={selected.mainActions} />}
              {selected.businessModel && <Section icon={Building2} title="商业模式" content={selected.businessModel} />}
              {selected.orgResources && <Section icon={FileText} title="组织资源" content={selected.orgResources} />}
              {selected.digitalPractices && <Section icon={Lightbulb} title="数字化实践" content={selected.digitalPractices} />}
              {selected.outcomes && <Section icon={Target} title="成效" content={selected.outcomes} />}
              {selected.problems && <Section icon={AlertTriangle} title="问题与挑战" content={selected.problems} />}
              {selected.mechanism && <Section icon={FileText} title="机制分析" content={selected.mechanism} />}
              {selected.learnings && <Section icon={Lightbulb} title="可借鉴经验" content={selected.learnings} />}
              {selected.dataSource && <Section icon={Database} title="数据来源" content={selected.dataSource} />}
              {selected.tags.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted font-medium mb-1">标签</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-text-muted">{t}</span>
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
                {editingId ? '编辑案例' : '添加案例'}
              </h2>
              <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} className="text-text-muted" /></button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <FormField label="案例名称 *" value={form.name} onChange={v => setFormField('name', v)} placeholder="如：中信出版数字化转型" />
              <div className="grid grid-cols-2 gap-3">
                <FormField label="行业 *" value={form.industry} onChange={v => setFormField('industry', v)} placeholder="如：出版" />
                <FormField label="时间范围" value={form.timeRange} onChange={v => setFormField('timeRange', v)} placeholder="如：2018-2023" />
              </div>
              <FormField label="研究对象" value={form.subject} onChange={v => setFormField('subject', v)} placeholder="案例的核心研究对象" />
              <FormField label="背景" value={form.background} onChange={v => setFormField('background', v)} placeholder="案例的行业背景与情境" isTextarea />
              <FormField label="核心问题" value={form.coreIssue} onChange={v => setFormField('coreIssue', v)} placeholder="案例要解决或展示的核心问题" isTextarea />
              <FormField label="主要行动" value={form.mainActions} onChange={v => setFormField('mainActions', v)} placeholder="采取了哪些主要行动" isTextarea />
              <FormField label="商业模式" value={form.businessModel} onChange={v => setFormField('businessModel', v)} placeholder="商业模式特征" isTextarea />
              <FormField label="组织资源" value={form.orgResources} onChange={v => setFormField('orgResources', v)} placeholder="组织架构与资源配置" isTextarea />
              <FormField label="数字化实践" value={form.digitalPractices} onChange={v => setFormField('digitalPractices', v)} placeholder="数字技术应用场景" isTextarea />
              <FormField label="成效" value={form.outcomes} onChange={v => setFormField('outcomes', v)} placeholder="取得的成效与结果" isTextarea />
              <FormField label="问题与挑战" value={form.problems} onChange={v => setFormField('problems', v)} placeholder="面临的问题与挑战" isTextarea />
              <FormField label="机制分析" value={form.mechanism} onChange={v => setFormField('mechanism', v)} placeholder="背后的机制与逻辑" isTextarea />
              <FormField label="可借鉴经验" value={form.learnings} onChange={v => setFormField('learnings', v)} placeholder="值得学习的经验教训" isTextarea />
              <FormField label="数据来源" value={form.dataSource} onChange={v => setFormField('dataSource', v)} placeholder="信息来源与可靠程度" />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">证据级别</label>
                <select value={form.evidenceLevel} onChange={e => setFormField('evidenceLevel', e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none bg-white">
                  <option value="primary">一手资料（访谈/调研）</option>
                  <option value="secondary">二手资料（公开信息）</option>
                </select>
              </div>
              <FormField label="标签（逗号分割）" value={form.tags} onChange={v => setFormField('tags', v)} placeholder="如：数字化转型, AI应用" />
              <button onClick={handleSave} disabled={!form.name.trim() || !form.industry.trim()}
                className="w-full py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {editingId ? '保存修改' : '添加案例'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ icon: Icon, title, content }: { icon: React.ElementType; title: string; content: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted font-medium mb-0.5 flex items-center gap-1">
        <Icon size={12} /> {title}
      </p>
      <p className="text-[13px] text-text-secondary whitespace-pre-wrap">{content}</p>
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
          rows={2} className={`${cls} py-2.5 resize-none`} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`${cls} h-11`} />
      )}
    </div>
  );
}
