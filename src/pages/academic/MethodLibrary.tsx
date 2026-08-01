import { useState, useMemo } from 'react';
import { useStore } from '../../store';
import { formatDateShort } from '../../utils';
import {
  Beaker, Plus, X, Search, ChevronRight, Trash2, Edit3, BarChart3, BookOpen, Settings,
} from 'lucide-react';

const paradigmLabels: Record<string, string> = {
  quantitative: '量化研究', qualitative: '质性研究', mixed: '混合方法', 'computational': '计算方法',
};

export default function MethodLibrary() {
  const { methods, addMethod, updateMethod, deleteMethod } = useStore();
  const [search, setSearch] = useState('');
  const [paradigm, setParadigm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nameZh: '', nameEn: '', type: '', paradigm: '', applicableQuestions: '',
    dataRequirements: '', coreAssumptions: '', commonSoftware: '',
    mainOutput: '', learningStatus: '', unresolvedIssues: '',
    appliedProjects: '',
  });

  const filtered = useMemo(() => {
    let list = methods;
    if (paradigm) list = list.filter(m => m.paradigm === paradigm);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.nameZh.toLowerCase().includes(q) || m.nameEn?.toLowerCase().includes(q) ||
        m.type?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [methods, search, paradigm]);

  const selected = methods.find(m => m.id === selectedId) || null;

  const resetForm = () => {
    setForm({ nameZh: '', nameEn: '', type: '', paradigm: '', applicableQuestions: '',
      dataRequirements: '', coreAssumptions: '', commonSoftware: '',
      mainOutput: '', learningStatus: '', unresolvedIssues: '', appliedProjects: '' });
    setEditingId(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (m: any) => {
    setEditingId(m.id);
    setForm({
      nameZh: m.nameZh, nameEn: m.nameEn || '', type: m.type || '', paradigm: m.paradigm || '',
      applicableQuestions: m.applicableQuestions || '', dataRequirements: m.dataRequirements || '',
      coreAssumptions: m.coreAssumptions || '', commonSoftware: m.commonSoftware || '',
      mainOutput: m.mainOutput || '', learningStatus: m.learningStatus || '',
      unresolvedIssues: m.unresolvedIssues || '', appliedProjects: m.appliedProjects || '',
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.nameZh.trim()) return;
    const base = {
      nameZh: form.nameZh.trim(), nameEn: form.nameEn.trim() || undefined,
      type: form.type.trim() || undefined, paradigm: form.paradigm || undefined,
      applicableQuestions: form.applicableQuestions.trim() || undefined,
      dataRequirements: form.dataRequirements.trim() || undefined,
      coreAssumptions: form.coreAssumptions.trim() || undefined,
      commonSoftware: form.commonSoftware.trim() || undefined,
      mainOutput: form.mainOutput.trim() || undefined,
      learningStatus: form.learningStatus.trim() || undefined,
      unresolvedIssues: form.unresolvedIssues.trim() || undefined,
      appliedProjects: form.appliedProjects.trim() || undefined,
    };
    if (editingId) {
      updateMethod(editingId, base as any);
    } else {
      addMethod(base as any);
    }
    setShowForm(false); resetForm();
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">方法库</h1>
          <p className="text-body-sm text-text-muted mt-1">共 {methods.length} 种方法</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> <span className="hidden sm:inline">新建方法</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[160px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索方法..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mist-purple/20" />
        </div>
        {Object.entries(paradigmLabels).map(([k, v]) => (
          <button key={k} onClick={() => setParadigm(paradigm === k ? '' : k)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
              paradigm === k ? 'bg-mist-purple text-white' : 'bg-white border border-gray-200 text-text-secondary hover:bg-cream'
            }`}>{v}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* List */}
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin pr-1">
          {filtered.length === 0 ? (
            <p className="text-body-sm text-text-muted text-center py-8">暂无匹配的方法</p>
          ) : filtered.map(m => (
            <div key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`card cursor-pointer transition-all hover:shadow-md ${
                selectedId === m.id ? 'ring-2 ring-mist-purple/30 border-mist-purple/30' : ''
              }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary truncate">{m.nameZh}</p>
                  {m.nameEn && <p className="text-[11px] text-text-muted">{m.nameEn}</p>}
                </div>
                <ChevronRight size={14} className="text-text-muted flex-shrink-0 mt-1" />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {m.type && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-mist-light/40 text-mist-purple">{m.type}</span>}
                {m.paradigm && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-warm-brown">{paradigmLabels[m.paradigm] || m.paradigm}</span>}
                {m.learningStatus && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-mint-light/40 text-mint-green">{m.learningStatus}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">{selected.nameZh}</h2>
                  {selected.nameEn && <p className="text-sm text-text-muted">{selected.nameEn}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(selected)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-cream">
                    <Edit3 size={14} /></button>
                  <button onClick={() => setDelId(selected.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50">
                    <Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {selected.type && <Row label="类型" value={selected.type} Icon={BarChart3} />}
                {selected.paradigm && <Row label="范式" value={paradigmLabels[selected.paradigm] || selected.paradigm} Icon={BookOpen} />}
                {selected.applicableQuestions && <Row label="适用问题" value={selected.applicableQuestions} />}
                {selected.dataRequirements && <Row label="数据要求" value={selected.dataRequirements} />}
                {selected.coreAssumptions && <Row label="核心假设" value={selected.coreAssumptions} />}
                {selected.commonSoftware && <Row label="常用软件" value={selected.commonSoftware} Icon={Settings} />}
                {selected.mainOutput && <Row label="主要输出" value={selected.mainOutput} />}
                {selected.learningStatus && <Row label="学习状态" value={selected.learningStatus} />}
                {selected.appliedProjects && <Row label="应用项目" value={selected.appliedProjects} />}
                {selected.unresolvedIssues && <div className="sm:col-span-2">
                  <Row label="待解决问题" value={selected.unresolvedIssues} />
                </div>}
              </div>
              <p className="text-[11px] text-text-muted mt-4 pt-3 border-t">创建于 {formatDateShort(selected.createdAt)}</p>
            </div>
          ) : (
            <div className="card flex items-center justify-center py-16">
              <div className="text-center">
                <Beaker size={32} className="mx-auto text-text-muted mb-3" />
                <p className="text-body-sm text-text-muted">{filtered.length > 0 ? '选择一个方法查看详情' : '暂无法卡片，点击右上角新建'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24 px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowForm(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">{editingId ? '编辑方法' : '新建方法'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3.5">
              <Field label="中文名称 *" value={form.nameZh} onChange={v => setForm(p => ({ ...p, nameZh: v }))} />
              <Field label="英文名称" value={form.nameEn} onChange={v => setForm(p => ({ ...p, nameEn: v }))} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="类型" value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))} placeholder="如: 回归分析" />
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">研究范式</label>
                  <select value={form.paradigm} onChange={e => setForm(p => ({ ...p, paradigm: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-mist-purple/20">
                    <option value="">请选择</option>
                    {Object.entries(paradigmLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">适用问题</label>
                <textarea value={form.applicableQuestions} onChange={e => setForm(p => ({ ...p, applicableQuestions: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-mist-purple/20" />
              </div>
              <Field label="数据要求" value={form.dataRequirements} onChange={v => setForm(p => ({ ...p, dataRequirements: v }))} />
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">核心假设</label>
                <textarea value={form.coreAssumptions} onChange={e => setForm(p => ({ ...p, coreAssumptions: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-mist-purple/20" />
              </div>
              <Field label="学习状态" value={form.learningStatus} onChange={v => setForm(p => ({ ...p, learningStatus: v }))} placeholder="如: 已掌握 / 学习中" />
              <Field label="常用软件" value={form.commonSoftware} onChange={v => setForm(p => ({ ...p, commonSoftware: v }))} />
              <Field label="主要输出" value={form.mainOutput} onChange={v => setForm(p => ({ ...p, mainOutput: v }))} />
              <Field label="应用项目" value={form.appliedProjects} onChange={v => setForm(p => ({ ...p, appliedProjects: v }))} />
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">待解决问题</label>
                <textarea value={form.unresolvedIssues} onChange={e => setForm(p => ({ ...p, unresolvedIssues: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-mist-purple/20" />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-5 py-3.5 flex gap-3 rounded-b-2xl">
              <button onClick={() => { setShowForm(false); resetForm(); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-text-secondary hover:bg-gray-50">取消</button>
              <button onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 rounded-xl bg-mist-purple text-white text-sm font-medium hover:bg-mist-purple/90 disabled:opacity-40"
                disabled={!form.nameZh.trim()}>{editingId ? '保存' : '创建'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDelId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-6">
            <h3 className="font-semibold text-text-primary mb-2">确认删除</h3>
            <p className="text-sm text-text-secondary mb-4">确定要删除这个方法吗？此操作不可撤销。</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={() => { deleteMethod(delId); setDelId(null); setSelectedId(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, Icon }: { label: string; value: string; Icon?: any }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-text-muted mb-0.5 flex items-center gap-1">
        {Icon && <Icon size={12} />}{label}
      </p>
      <p className="text-[13px] text-text-primary">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mist-purple/20" />
    </div>
  );
}
