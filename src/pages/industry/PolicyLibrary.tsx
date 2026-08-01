import { useState } from 'react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';
import {
  Shield, Plus, X, Building2, Calendar, Globe,
  ChevronRight, FileText, ExternalLink, Filter,
} from 'lucide-react';

const levelLabels: Record<string, string> = {
  national: '国家', provincial: '省级', municipal: '市级', industry: '行业',
};

const levelColors: Record<string, string> = {
  national: 'bg-red-50 text-red-600', provincial: 'bg-orange-50 text-orange-600',
  municipal: 'bg-blue-50 text-mist-blue', industry: 'bg-purple-50 text-mist-purple',
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function PolicyLibrary() {
  const { policies, addPolicy, updatePolicy, deletePolicy } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Form state
  const [form, setForm] = useState({
    name: '', issuingBody: '', level: 'national', domain: '',
    issueDate: '', effectiveDate: '', target: '', coreGoal: '',
    mainTasks: '', keyMeasures: '', importantData: '',
    relationToPublishing: '', policyEvolution: '', sourceUrl: '',
    personalInterpretation: '', quotableParagraphs: '', tags: '',
  });

  const resetForm = () => {
    setForm({
      name: '', issuingBody: '', level: 'national', domain: '',
      issueDate: '', effectiveDate: '', target: '', coreGoal: '',
      mainTasks: '', keyMeasures: '', importantData: '',
      relationToPublishing: '', policyEvolution: '', sourceUrl: '',
      personalInterpretation: '', quotableParagraphs: '', tags: '',
    });
    setShowModal(false);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setForm({
      name: p.name, issuingBody: p.issuingBody, level: p.level, domain: p.domain,
      issueDate: p.issueDate, effectiveDate: p.effectiveDate || '', target: p.target || '',
      coreGoal: p.coreGoal || '', mainTasks: p.mainTasks || '', keyMeasures: p.keyMeasures || '',
      importantData: p.importantData || '', relationToPublishing: p.relationToPublishing || '',
      policyEvolution: p.policyEvolution || '', sourceUrl: p.sourceUrl || '',
      personalInterpretation: p.personalInterpretation || '', quotableParagraphs: p.quotableParagraphs || '',
      tags: p.tags.join(', '),
    });
    setEditingId(p.id);
    setShowModal(true);
  };

  const setFormField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.issuingBody.trim()) return;

    const base = {
      issuingBody: form.issuingBody.trim(),
      level: form.level,
      issueDate: form.issueDate,
      effectiveDate: form.effectiveDate || undefined,
      domain: form.domain.trim(),
      target: form.target.trim(),
      coreGoal: form.coreGoal.trim(),
      mainTasks: form.mainTasks.trim(),
      keyMeasures: form.keyMeasures.trim(),
      importantData: form.importantData.trim(),
      relationToPublishing: form.relationToPublishing.trim(),
      policyEvolution: form.policyEvolution.trim(),
      sourceUrl: form.sourceUrl.trim(),
      personalInterpretation: form.personalInterpretation.trim(),
      quotableParagraphs: form.quotableParagraphs.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (editingId) {
      updatePolicy(editingId, { ...base, name: form.name.trim() } as any);
    } else {
      addPolicy({
        ...base,
        name: form.name.trim(),
        linkedPolicies: [],
        attachments: [],
        isActive: true,
        linkedReportIds: [],
        linkedPaperIds: [],
      } as any);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除该政策？')) {
      deletePolicy(id);
      if (selectedId === id) setSelectedId(null);
    }
  };

  const domains = [...new Set(policies.map(p => p.domain).filter(Boolean))];

  const filtered = filter === 'all'
    ? policies
    : policies.filter(p => p.domain === filter);

  const sorted = [...filtered].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  const selected = policies.find(p => p.id === selectedId);

  return (
    <div>
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="page-title">政策库</h1>
            <p className="text-body-sm text-text-muted mt-1">追踪文化产业相关政策，记录核心内容与应用场景</p>
          </div>
          <button onClick={openCreate}
            className="self-start inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors">
            <Plus size={15} /> 添加政策
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      {domains.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all' ? 'bg-warm-brown text-white' : 'bg-gray-50 text-text-muted hover:bg-gray-100'
            }`}>
            全部 ({policies.length})
          </button>
          {domains.map(d => (
            <button key={d} onClick={() => setFilter(d)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === d ? 'bg-warm-brown text-white' : 'bg-gray-50 text-text-muted hover:bg-gray-100'
              }`}>
              {d}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* List */}
        <div className={selected ? 'hidden lg:block' : ''}>
          {sorted.length === 0 ? (
            <div className="card text-center py-12">
              <Shield size={40} className="text-text-muted mx-auto mb-3 opacity-40" />
              <p className="text-body-sm text-text-muted">暂无政策条目，点击右上角添加</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-0.5 scrollbar-thin">
              {sorted.map(pol => (
                <div
                  key={pol.id}
                  onClick={() => setSelectedId(pol.id)}
                  className={`card !p-3 sm:!p-4 cursor-pointer transition-all ${
                    selectedId === pol.id ? 'ring-2 ring-warm-brown/20 border-warm-brown/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${levelColors[pol.level] || 'bg-gray-50 text-text-muted'}`}>
                          {levelLabels[pol.level] || pol.level}
                        </span>
                        {pol.domain && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-warm-brown font-medium">
                            {pol.domain}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{pol.name}</h3>
                    </div>
                    <ChevronRight size={14} className="text-text-muted mt-1 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-text-muted">
                    <span className="flex items-center gap-1"><Building2 size={10} /> {pol.issuingBody}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> {formatDateShort(pol.issueDate)}</span>
                    <span>{formatRelative(pol.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card !p-4 sm:!p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${levelColors[selected.level] || 'bg-gray-50 text-text-muted'}`}>
                    {levelLabels[selected.level] || selected.level}
                  </span>
                  {selected.domain && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-warm-brown font-medium">{selected.domain}</span>}
                  {!selected.isActive && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 font-medium">已失效</span>}
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
              <DetailRow label="发布机构" value={selected.issuingBody} />
              <DetailRow label="发布日期" value={formatDateShort(selected.issueDate)} />
              <DetailRow label="生效日期" value={selected.effectiveDate ? formatDateShort(selected.effectiveDate) : '即时生效'} />
              {selected.target && <DetailRow label="政策对象" value={selected.target} />}
              {selected.coreGoal && <DetailRow label="核心目标" value={selected.coreGoal} />}
              {selected.mainTasks && <DetailRow label="主要任务" value={selected.mainTasks} />}
              {selected.keyMeasures && <DetailRow label="关键措施" value={selected.keyMeasures} />}
              {selected.importantData && <DetailRow label="重要数据" value={selected.importantData} />}
              {selected.relationToPublishing && <DetailRow label="与出版业关系" value={selected.relationToPublishing} />}
              {selected.policyEvolution && <DetailRow label="政策演变" value={selected.policyEvolution} />}
              {selected.personalInterpretation && <DetailRow label="个人解读" value={selected.personalInterpretation} />}
              {selected.quotableParagraphs && <DetailRow label="金句引用" value={selected.quotableParagraphs} />}
              {selected.sourceUrl && (
                <div>
                  <p className="text-xs text-text-muted font-medium mb-1">原文链接</p>
                  <a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-mist-blue hover:underline flex items-center gap-1">
                    <ExternalLink size={10} /> {selected.sourceUrl}
                  </a>
                </div>
              )}
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
              创建于 {formatRelative(selected.createdAt)} · 更新于 {formatRelative(selected.updatedAt)}
            </p>
          </div>
        )}
      </div>

      {/* 创建/编辑弹窗 */}
      {showModal && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={resetForm} />
          <div className="modal-mobile-content relative z-50">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-serif font-semibold text-text-primary">
                {editingId ? '编辑政策' : '添加政策'}
              </h2>
              <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} className="text-text-muted" />
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <FormField label="政策名称 *" value={form.name} onChange={v => setFormField('name', v)} placeholder="如：《文化产业促进法》" />
              <FormField label="发布机构 *" value={form.issuingBody} onChange={v => setFormField('issuingBody', v)} placeholder="如：文化和旅游部" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">级别</label>
                  <select value={form.level} onChange={e => setFormField('level', e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none bg-white">
                    <option value="national">国家</option>
                    <option value="provincial">省级</option>
                    <option value="municipal">市级</option>
                    <option value="industry">行业</option>
                  </select>
                </div>
                <FormField label="领域" value={form.domain} onChange={v => setFormField('domain', v)} placeholder="如：文化产业" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">发布日期 *</label>
                  <input type="date" value={form.issueDate} onChange={e => setFormField('issueDate', e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">生效日期</label>
                  <input type="date" value={form.effectiveDate} onChange={e => setFormField('effectiveDate', e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none" />
                </div>
              </div>
              <FormField label="政策对象" value={form.target} onChange={v => setFormField('target', v)} placeholder="如：出版企业、数字内容平台" />
              <FormField label="核心目标" value={form.coreGoal} onChange={v => setFormField('coreGoal', v)} placeholder="政策旨在解决的核心问题或目标" />
              <FormField label="主要任务" value={form.mainTasks} onChange={v => setFormField('mainTasks', v)} placeholder="政策提出的主要工作任务" isTextarea />
              <FormField label="关键措施" value={form.keyMeasures} onChange={v => setFormField('keyMeasures', v)} placeholder="具体的政策措施与手段" isTextarea />
              <FormField label="重要数据" value={form.importantData} onChange={v => setFormField('importantData', v)} placeholder="政策文件中引用的关键数据与指标" />
              <FormField label="与出版业关系" value={form.relationToPublishing} onChange={v => setFormField('relationToPublishing', v)} placeholder="该政策对出版行业的具体影响" isTextarea />
              <FormField label="政策演变" value={form.policyEvolution} onChange={v => setFormField('policyEvolution', v)} placeholder="与之前相关政策的延续与变化关系" isTextarea />
              <FormField label="原文链接" value={form.sourceUrl} onChange={v => setFormField('sourceUrl', v)} placeholder="https://..." />
              <FormField label="个人解读" value={form.personalInterpretation} onChange={v => setFormField('personalInterpretation', v)} placeholder="你的个人解读与分析" isTextarea />
              <FormField label="金句引用" value={form.quotableParagraphs} onChange={v => setFormField('quotableParagraphs', v)} placeholder="可直接引用的关键段落或句子" isTextarea />
              <FormField label="标签（逗号分割）" value={form.tags} onChange={v => setFormField('tags', v)} placeholder="如：数字经济, 版权保护" />
              <button onClick={handleSave}
                disabled={!form.name.trim() || !form.issuingBody.trim() || !form.issueDate}
                className="w-full py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {editingId ? '保存修改' : '添加政策'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper components
function DetailRow({ label, value }: { label: string; value: string }) {
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
