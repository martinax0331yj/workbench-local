import { useState, useMemo } from 'react';
import { useStore } from '../../store';
import { formatDateShort } from '../../utils';
import {
  BookOpen, Plus, X, Search, ChevronRight, Trash2, Edit3,
} from 'lucide-react';

export default function TheoryLibrary() {
  const { theories, addTheory, updateTheory, deleteTheory } = useStore();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nameZh: '', nameEn: '', proposer: '', yearProposed: '', originalLiterature: '',
    coreConcepts: '', corePropositions: '', mechanism: '', applicationLevel: '',
    boundaryConditions: '', personalNotes: '',
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return theories;
    const q = search.toLowerCase();
    return theories.filter(t =>
      t.nameZh.toLowerCase().includes(q) || t.nameEn?.toLowerCase().includes(q) ||
      t.proposer.toLowerCase().includes(q) || t.coreConcepts.some(c => c.toLowerCase().includes(q))
    );
  }, [theories, search]);

  const selected = theories.find(t => t.id === selectedId) || null;
  const editing = editingId ? theories.find(t => t.id === editingId) : null;

  const resetForm = () => {
    setForm({ nameZh: '', nameEn: '', proposer: '', yearProposed: '', originalLiterature: '',
      coreConcepts: '', corePropositions: '', mechanism: '', applicationLevel: '',
      boundaryConditions: '', personalNotes: '' });
    setEditingId(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (t: any) => {
    setEditingId(t.id);
    setForm({
      nameZh: t.nameZh, nameEn: t.nameEn || '', proposer: t.proposer,
      yearProposed: t.yearProposed ? String(t.yearProposed) : '',
      originalLiterature: t.originalLiterature || '',
      coreConcepts: t.coreConcepts.join(', '), corePropositions: (t.corePropositions || []).join(', '),
      mechanism: t.mechanism || '', applicationLevel: t.applicationLevel || '',
      boundaryConditions: t.boundaryConditions || '', personalNotes: t.personalNotes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.nameZh.trim() || !form.proposer.trim()) return;
    const base = {
      nameZh: form.nameZh.trim(),
      nameEn: form.nameEn.trim() || undefined,
      proposer: form.proposer.trim(),
      yearProposed: form.yearProposed ? Number(form.yearProposed) : undefined,
      originalLiterature: form.originalLiterature.trim() || undefined,
      coreConcepts: form.coreConcepts.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      corePropositions: form.corePropositions.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      mechanism: form.mechanism.trim() || undefined,
      applicationLevel: form.applicationLevel.trim() || undefined,
      boundaryConditions: form.boundaryConditions.trim() || undefined,
      personalNotes: form.personalNotes.trim() || undefined,
    };
    if (editingId) {
      updateTheory(editingId, base as any);
    } else {
      addTheory({ ...base, linkedLiteratureIds: [], linkedPaperIds: [] } as any);
    }
    setShowForm(false); resetForm();
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">理论库</h1>
          <p className="text-body-sm text-text-muted mt-1">共 {theories.length} 条理论</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> <span className="hidden sm:inline">新建理论</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索理论名称、提出者、概念..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* List */}
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin pr-1">
          {filtered.length === 0 ? (
            <p className="text-body-sm text-text-muted text-center py-8">暂无匹配的理论</p>
          ) : filtered.map(t => (
            <div key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={`card cursor-pointer transition-all hover:shadow-md ${
                selectedId === t.id ? 'ring-2 ring-warm-brown/30 border-warm-brown/30' : ''
              }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary truncate">{t.nameZh}</p>
                  {t.nameEn && <p className="text-[11px] text-text-muted">{t.nameEn}</p>}
                  <p className="text-[12px] text-warm-brown mt-1">{t.proposer}{t.yearProposed ? ` (${t.yearProposed})` : ''}</p>
                </div>
                <ChevronRight size={14} className="text-text-muted flex-shrink-0 mt-1" />
              </div>
              {t.coreConcepts.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.coreConcepts.slice(0, 3).map((c, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-warm-brown">{c}</span>
                  ))}
                </div>
              )}
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
              <div className="space-y-3">
                <Row label="提出者" value={`${selected.proposer}${selected.yearProposed ? ` (${selected.yearProposed})` : ''}`} />
                {selected.originalLiterature && <Row label="原始文献" value={selected.originalLiterature} />}
                {selected.coreConcepts.length > 0 && <Row label="核心概念" value={selected.coreConcepts.join('、')} />}
                {selected.corePropositions && selected.corePropositions.length > 0 && <Row label="核心命题" value={selected.corePropositions.join('；')} />}
                {selected.mechanism && <Row label="作用机制" value={selected.mechanism} />}
                {selected.applicationLevel && <Row label="应用层次" value={selected.applicationLevel} />}
                {selected.boundaryConditions && <Row label="边界条件" value={selected.boundaryConditions} />}
                {selected.personalNotes && <Row label="个人笔记" value={selected.personalNotes} />}
                <p className="text-[11px] text-text-muted pt-2">创建于 {formatDateShort(selected.createdAt)}</p>
              </div>
            </div>
          ) : (
            <div className="card flex items-center justify-center py-16">
              <div className="text-center">
                <BookOpen size={32} className="mx-auto text-text-muted mb-3" />
                <p className="text-body-sm text-text-muted">{filtered.length > 0 ? '选择一个理论查看详情' : '暂无理论卡片，点击右上角新建'}</p>
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
              <h3 className="font-semibold text-text-primary">{editingId ? '编辑理论' : '新建理论'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3.5">
              <Field label="中文名称 *" value={form.nameZh} onChange={v => setForm(p => ({ ...p, nameZh: v }))} />
              <Field label="英文名称" value={form.nameEn} onChange={v => setForm(p => ({ ...p, nameEn: v }))} />
              <Field label="提出者 *" value={form.proposer} onChange={v => setForm(p => ({ ...p, proposer: v }))} />
              <Field label="提出年份" type="number" value={form.yearProposed} onChange={v => setForm(p => ({ ...p, yearProposed: v }))} />
              <Field label="原始文献" value={form.originalLiterature} onChange={v => setForm(p => ({ ...p, originalLiterature: v }))} />
              <Field label="核心概念（逗号分隔）" value={form.coreConcepts} onChange={v => setForm(p => ({ ...p, coreConcepts: v }))} />
              <Field label="核心命题（逗号分隔）" value={form.corePropositions} onChange={v => setForm(p => ({ ...p, corePropositions: v }))} />
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">作用机制</label>
                <textarea value={form.mechanism} onChange={e => setForm(p => ({ ...p, mechanism: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <Field label="应用层次" value={form.applicationLevel} onChange={v => setForm(p => ({ ...p, applicationLevel: v }))} />
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">边界条件</label>
                <textarea value={form.boundaryConditions} onChange={e => setForm(p => ({ ...p, boundaryConditions: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">个人笔记</label>
                <textarea value={form.personalNotes} onChange={e => setForm(p => ({ ...p, personalNotes: e.target.value }))} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-5 py-3.5 flex gap-3 rounded-b-2xl">
              <button onClick={() => { setShowForm(false); resetForm(); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-text-secondary hover:bg-gray-50">取消</button>
              <button onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 disabled:opacity-40"
                disabled={!form.nameZh.trim() || !form.proposer.trim()}>{editingId ? '保存' : '创建'}</button>
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
            <p className="text-sm text-text-secondary mb-4">确定要删除这条理论卡片吗？此操作不可撤销。</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={() => { deleteTheory(delId); setDelId(null); setSelectedId(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-text-muted mb-0.5">{label}</p>
      <p className="text-[13px] text-text-primary">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
    </div>
  );
}
