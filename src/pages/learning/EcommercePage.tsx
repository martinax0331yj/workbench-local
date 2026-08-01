import { useState } from 'react';
import { useStore } from '../../store';
import { formatRelative } from '../../utils';
import { ShoppingBag, TrendingUp, Truck, DollarSign, Package, Plus, X, Edit3, Trash2, ChevronRight } from 'lucide-react';

const statusLabels: Record<string, string> = {
  'idea': '初步想法', 'researching': '调研中', 'to-continue': '可继续', 'finding-supplier': '找供应商',
  'calculating': '待测算', 'testing': '测试中', 'paused': '暂停', 'abandoned': '放弃',
};
const statusColors: Record<string, string> = {
  'idea': 'bg-gray-100 text-text-muted', 'researching': 'bg-blue-50 text-mist-blue',
  'to-continue': 'bg-mist-light/30 text-mist-purple', 'finding-supplier': 'bg-warm-light text-warm-brown',
  'calculating': 'bg-orange-50 text-orange-600', 'testing': 'bg-green-50 text-mint-green',
  'paused': 'bg-gray-100 text-text-muted', 'abandoned': 'bg-gray-100 text-text-muted',
};

const initForm = { name: '', description: '', platform: '', market: '', status: 'idea', profitEstimate: '' };

export default function EcommercePage() {
  const { ecommerceProducts, addEcommerceProduct, updateEcommerceProduct, deleteEcommerceProduct } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...initForm });

  const selected = ecommerceProducts.find(p => p.id === selectedId) || null;

  const resetForm = () => { setForm({ ...initForm }); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name, description: p.description || '', platform: p.platform || '',
      market: p.market || '', status: p.status || 'idea',
      profitEstimate: p.profitEstimate ? String(p.profitEstimate) : '',
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const base = {
      name: form.name.trim(), description: form.description.trim() || undefined,
      platform: form.platform.trim() || undefined, market: form.market.trim() || undefined,
      status: form.status, profitEstimate: form.profitEstimate ? Number(form.profitEstimate) : undefined,
    };
    if (editingId) {
      updateEcommerceProduct(editingId, base as any);
    } else {
      addEcommerceProduct({ ...base, suppliers: [], competitors: [], calculations: [], images: [], links: [] } as any);
    }
    setShowForm(false); resetForm();
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">电商</h1>
          <p className="text-body-sm text-text-muted mt-1">跨境电商调研与项目验证</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> <span>新建产品</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
        {[
          { label: '产品候选', value: ecommerceProducts.length, icon: Package, color: 'text-warm-brown' },
          { label: '调研中', value: ecommerceProducts.filter(p => p.status === 'researching').length, icon: TrendingUp, color: 'text-mist-blue' },
          { label: '测试中', value: ecommerceProducts.filter(p => p.status === 'testing').length, icon: ShoppingBag, color: 'text-mint-green' },
          { label: '找供应商', value: ecommerceProducts.filter(p => p.status === 'finding-supplier').length, icon: Truck, color: 'text-mist-purple' },
          { label: '待测算', value: ecommerceProducts.filter(p => p.status === 'calculating').length, icon: DollarSign, color: 'text-orange-400' },
        ].map(s => (
          <div key={s.label} className="card !p-3 sm:!p-4 text-center">
            <s.icon size={18} className={`mx-auto ${s.color} mb-1`} />
            <p className="text-lg sm:text-xl font-semibold text-text-primary">{s.value}</p>
            <p className="text-[10px] sm:text-caption text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin pr-1">
          {ecommerceProducts.length === 0 ? (
            <p className="text-body-sm text-text-muted text-center py-8">暂无产品候选</p>
          ) : ecommerceProducts.map(p => (
            <div key={p.id} onClick={() => setSelectedId(p.id)}
              className={`card cursor-pointer transition-all hover:shadow-md ${selectedId === p.id ? 'ring-2 ring-warm-brown/30 border-warm-brown/30' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-text-primary truncate flex-1">{p.name}</h3>
                <ChevronRight size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
              </div>
              {p.description && <p className="text-caption text-text-muted line-clamp-2 mt-1">{p.description}</p>}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[p.status] || 'bg-gray-100'}`}>{statusLabels[p.status] || p.status}</span>
                {p.platform && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-mist-blue">{p.platform}</span>}
                {p.market && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-text-muted">{p.market}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">{selected.name}</h2>
                  {selected.description && <p className="text-sm text-text-secondary mt-1">{selected.description}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(selected)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-cream"><Edit3 size={14} /></button>
                  <button onClick={() => setDelId(selected.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[selected.status] || 'bg-gray-100'}`}>{statusLabels[selected.status] || selected.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {selected.platform && <Row label="平台" value={selected.platform} />}
                  {selected.market && <Row label="目标市场" value={selected.market} />}
                  {selected.profitEstimate !== undefined && <Row label="预估利润" value={`¥${(selected as any).profitEstimate.toLocaleString()}`} />}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <Row label="供应商" value={`${(selected as any).suppliers?.length || 0} 个`} />
                  <Row label="竞品" value={`${(selected as any).competitors?.length || 0} 个`} />
                </div>
                <p className="text-[11px] text-text-muted">更新于 {formatRelative(selected.updatedAt)}</p>
              </div>
            </div>
          ) : (
            <div className="card flex items-center justify-center py-16">
              <div className="text-center">
                <ShoppingBag size={32} className="mx-auto text-text-muted mb-3" />
                <p className="text-body-sm text-text-muted">{ecommerceProducts.length > 0 ? '选择一个产品查看详情' : '暂无产品，点击右上角新建'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24 px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowForm(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">{editingId ? '编辑产品' : '新建产品'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3.5">
              <Field label="产品名称 *" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
              <Field label="平台" value={form.platform} onChange={v => setForm(p => ({ ...p, platform: v }))} placeholder="如: Amazon" />
              <Field label="目标市场" value={form.market} onChange={v => setForm(p => ({ ...p, market: v }))} placeholder="如: 美国站" />
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">状态</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20">
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <Field label="预估利润" value={form.profitEstimate} onChange={v => setForm(p => ({ ...p, profitEstimate: v }))} type="number" placeholder="0" />
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">描述</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-5 py-3.5 flex gap-3 rounded-b-2xl">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={handleSubmit} disabled={!form.name.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 disabled:opacity-40">{editingId ? '保存' : '创建'}</button>
            </div>
          </div>
        </div>
      )}

      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDelId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-6">
            <h3 className="font-semibold text-text-primary mb-2">确认删除</h3>
            <p className="text-sm text-text-secondary mb-4">确定要删除此产品吗？此操作不可撤销。</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={() => { deleteEcommerceProduct(delId); setDelId(null); setSelectedId(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[11px] text-text-muted">{label}</p><p className="text-[13px] text-text-primary">{value}</p></div>;
}

function Field({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
    </div>
  );
}
