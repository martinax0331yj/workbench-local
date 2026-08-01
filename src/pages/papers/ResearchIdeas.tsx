import { useState } from 'react';
import { useStore } from '../../store';
import { formatRelative } from '../../utils';
import { Lightbulb, Plus, X, ChevronRight, FileText, Search, Target } from 'lucide-react';

const statusLabels: Record<string, string> = {
  inspiration: '灵感', validating: '验证中', feasible: '可行',
  converted: '已转化', paused: '暂停', abandoned: '放弃',
};
const statusColors: Record<string, string> = {
  inspiration: 'bg-purple-50 text-mist-purple', validating: 'bg-blue-50 text-mist-blue',
  feasible: 'bg-green-50 text-mint-green', converted: 'bg-warm-light text-warm-brown',
  paused: 'bg-yellow-50 text-yellow-700', abandoned: 'bg-gray-100 text-text-muted',
};

export default function ResearchIdeas() {
  const { researchIdeas, addResearchIdea, updateResearchIdea, deleteResearchIdea } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    title: '', oneLineQuestion: '', triggerSource: '', status: 'inspiration',
    researchValue: '', potentialObject: '', availableTheories: '',
    availableMethods: '', availableData: '', innovationPotential: '',
    feasibility: '', risks: '', nextVerificationStep: '',
  });

  const resetForm = () => {
    setForm({ title: '', oneLineQuestion: '', triggerSource: '', status: 'inspiration', researchValue: '', potentialObject: '', availableTheories: '', availableMethods: '', availableData: '', innovationPotential: '', feasibility: '', risks: '', nextVerificationStep: '' });
    setShowModal(false); setEditingId(null);
  };
  const setF = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const openEdit = (r: any) => {
    setForm({ title: r.title, oneLineQuestion: r.oneLineQuestion || '', triggerSource: r.triggerSource || '', status: r.status || 'inspiration', researchValue: r.researchValue || '', potentialObject: r.potentialObject || '', availableTheories: r.availableTheories || '', availableMethods: r.availableMethods || '', availableData: r.availableData || '', innovationPotential: r.innovationPotential || '', feasibility: r.feasibility || '', risks: r.risks || '', nextVerificationStep: r.nextVerificationStep || '' });
    setEditingId(r.id); setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const base: Record<string, any> = {
      title: form.title.trim(), oneLineQuestion: form.oneLineQuestion.trim(),
      triggerSource: form.triggerSource.trim(), status: form.status,
      researchValue: form.researchValue.trim(), potentialObject: form.potentialObject.trim(),
      availableTheories: form.availableTheories.trim(), availableMethods: form.availableMethods.trim(),
      availableData: form.availableData.trim(), innovationPotential: form.innovationPotential.trim(),
      feasibility: form.feasibility.trim(), risks: form.risks.trim(),
      nextVerificationStep: form.nextVerificationStep.trim(),
    };
    editingId ? updateResearchIdea(editingId, base) : addResearchIdea(base as any);
    resetForm();
  };

  const handleDelete = (id: string) => { if (confirm('确认删除？')) { deleteResearchIdea(id); if (selectedId === id) setSelectedId(null); } };

  const filtered = search.trim() ? researchIdeas.filter((r: any) => r.title.includes(search) || r.oneLineQuestion?.includes(search)) : researchIdeas;
  const selected = researchIdeas.find((r: any) => r.id === selectedId);

  return (
    <div>
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div><h1 className="page-title">研究思路</h1><p className="text-body-sm text-text-muted mt-1">记录研究想法、评估可行性、规划验证步骤</p></div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="self-start inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors"><Plus size={15} /> 添加思路</button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索标题、研究问题..." className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={selected ? 'hidden lg:block' : ''}>
          {filtered.length === 0 ? (
            <div className="card text-center py-12"><Lightbulb size={40} className="text-text-muted mx-auto mb-3 opacity-40" /><p className="text-body-sm text-text-muted">暂无研究思路</p></div>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-0.5 scrollbar-thin">
              {filtered.map((r: any) => (
                <div key={r.id} onClick={() => setSelectedId(r.id)} className={`card !p-3 sm:!p-4 cursor-pointer transition-all ${selectedId === r.id ? 'ring-2 ring-warm-brown/20 border-warm-brown/30' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[r.status] || 'bg-gray-50 text-text-muted'}`}>{statusLabels[r.status] || r.status}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{r.title}</h3>
                    </div>
                    <ChevronRight size={14} className="text-text-muted mt-1 flex-shrink-0" />
                  </div>
                  {r.oneLineQuestion && <p className="text-xs text-text-muted line-clamp-2">{r.oneLineQuestion}</p>}
                  {r.triggerSource && <p className="text-[10px] text-text-muted mt-1">触发源：{r.triggerSource}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="card !p-4 sm:!p-5 max-h-[70vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-serif font-semibold text-text-primary">{selected.title}</h2>
                <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[selected.status] || 'bg-gray-50 text-text-muted'}`}>{statusLabels[selected.status] || selected.status}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(selected)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"><FileText size={14} /></button>
                <button onClick={() => handleDelete(selected.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500"><X size={14} /></button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {selected.oneLineQuestion && <Bl label="一句话问题" text={selected.oneLineQuestion} />}
              {selected.triggerSource && <Bl label="触发来源" text={selected.triggerSource} />}
              {selected.researchValue && <Bl label="研究价值" text={selected.researchValue} />}
              {selected.potentialObject && <Bl label="潜在对象" text={selected.potentialObject} />}
              {selected.availableTheories && <Bl label="可用理论" text={selected.availableTheories} />}
              {selected.availableMethods && <Bl label="可用方法" text={selected.availableMethods} />}
              {selected.availableData && <Bl label="可用数据" text={selected.availableData} />}
              {selected.innovationPotential && <Bl label="创新潜力" text={selected.innovationPotential} />}
              {selected.feasibility && <Bl label="可行性" text={selected.feasibility} />}
              {selected.risks && <Bl label="风险" text={selected.risks} />}
              {selected.nextVerificationStep && <Bl icon={Target} label="下一步验证" text={selected.nextVerificationStep} />}
            </div>
            <p className="text-[10px] text-text-muted mt-4 pt-3 border-t border-gray-50">创建于 {formatRelative(selected.createdAt)}</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={resetForm} />
          <div className="modal-mobile-content relative z-50">
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-serif font-semibold text-text-primary">{editingId ? '编辑思路' : '添加思路'}</h2><button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} className="text-text-muted" /></button></div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <F label="标题 *" v={form.title} onChange={v => setF('title', v)} ph="如：数字出版平台用户行为研究" />
              <F label="一句话问题" v={form.oneLineQuestion} onChange={v => setF('oneLineQuestion', v)} ph="用一句话概括核心研究问题" />
              <F label="触发来源" v={form.triggerSource} onChange={v => setF('triggerSource', v)} ph="这个想法从何而来" />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">状态</label>
                <select value={form.status} onChange={e => setF('status', e.target.value)} className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none bg-white">
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <F label="研究价值" v={form.researchValue} onChange={v => setF('researchValue', v)} ph="这个研究的理论或实践价值" ta />
              <F label="潜在对象" v={form.potentialObject} onChange={v => setF('potentialObject', v)} ph="研究的对象或案例" />
              <F label="可用理论" v={form.availableTheories} onChange={v => setF('availableTheories', v)} ph="可借鉴的理论框架" />
              <F label="可用方法" v={form.availableMethods} onChange={v => setF('availableMethods', v)} ph="可能采用的研究方法" />
              <F label="可用数据" v={form.availableData} onChange={v => setF('availableData', v)} ph="已有的或可获取的数据" />
              <F label="创新潜力" v={form.innovationPotential} onChange={v => setF('innovationPotential', v)} ph="可能的创新点" ta />
              <F label="可行性" v={form.feasibility} onChange={v => setF('feasibility', v)} ph="时间、资源、能力评估" ta />
              <F label="风险" v={form.risks} onChange={v => setF('risks', v)} ph="可能遇到的风险与障碍" ta />
              <F label="下一步验证" v={form.nextVerificationStep} onChange={v => setF('nextVerificationStep', v)} ph="下一步需要验证什么" />
              <button onClick={handleSave} disabled={!form.title.trim()} className="w-full py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors disabled:opacity-40">{editingId ? '保存修改' : '添加思路'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Bl({ icon: Icon, label, text }: { icon?: any; label: string; text: string }) {
  return <div><p className="text-xs text-text-muted font-medium mb-0.5 flex items-center gap-1">{Icon && <Icon size={12} />}{label}</p><p className="text-[13px] text-text-secondary whitespace-pre-wrap">{text}</p></div>;
}

function F({ label, v, onChange, ph, ta }: { label: string; v: string; onChange: (v: string) => void; ph: string; ta?: boolean }) {
  const cls = 'w-full px-3.5 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none';
  return <div><label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>{ta ? <textarea value={v} onChange={e => onChange(e.target.value)} placeholder={ph} rows={2} className={`${cls} py-2.5 resize-none`} /> : <input value={v} onChange={e => onChange(e.target.value)} placeholder={ph} className={`${cls} h-11`} />}</div>;
}
