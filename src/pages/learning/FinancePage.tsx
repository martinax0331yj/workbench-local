import { useState } from 'react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';
import { DollarSign, TrendingUp, Target, BookOpen, Plus, X, Trash2, Edit3, PlusCircle } from 'lucide-react';

const initPlanForm = { title: '', description: '', completed: false };
const initRecordForm = { type: 'expense', amount: '', category: '', note: '', date: '' };

export default function FinancePage() {
  const { financePlans, financeRecords, addFinancePlan, deleteFinancePlan, addFinanceRecord, deleteFinanceRecord, updateFinancePlan } = useStore();
  const [tab, setTab] = useState<'overview' | 'plan' | 'records'>('overview');
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [planForm, setPlanForm] = useState({ ...initPlanForm });
  const [recordForm, setRecordForm] = useState({ ...initRecordForm });
  const [delPlanId, setDelPlanId] = useState<string | null>(null);
  const [delRecordId, setDelRecordId] = useState<string | null>(null);

  const monthlyIncome = financeRecords.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const monthlyExpense = financeRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);

  const handleAddPlan = () => {
    if (!planForm.title.trim()) return;
    addFinancePlan({ title: planForm.title.trim(), description: planForm.description.trim() || '', completed: false } as any);
    setPlanForm({ ...initPlanForm }); setShowPlanForm(false);
  };

  const handleAddRecord = () => {
    if (!recordForm.amount || !recordForm.category.trim()) return;
    addFinanceRecord({
      type: recordForm.type, amount: Number(recordForm.amount),
      category: recordForm.category.trim(),
      note: recordForm.note.trim() || undefined,
      date: recordForm.date || new Date().toISOString().split('T')[0],
    } as any);
    setRecordForm({ ...initRecordForm }); setShowRecordForm(false);
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">理财</h1>
          <p className="text-body-sm text-text-muted mt-1">知识学习与个人财务认知管理</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-1.5 mb-4 border-b border-gray-100 pb-0 scrollbar-thin">
        {[
          { key: 'overview' as const, label: '总览' },
          { key: 'plan' as const, label: '学习计划' },
          { key: 'records' as const, label: '收支记录' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`pb-2.5 px-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.key ? 'border-warm-brown text-warm-brown' : 'border-transparent text-text-muted'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="card !p-4 text-center">
              <DollarSign size={20} className="mx-auto text-warm-brown mb-1.5" />
              <p className="text-lg sm:text-xl font-semibold text-text-primary">¥{monthlyIncome.toLocaleString()}</p>
              <p className="text-caption text-text-muted">本月收入</p>
            </div>
            <div className="card !p-4 text-center">
              <TrendingUp size={20} className="mx-auto text-rose-400 mb-1.5" />
              <p className="text-lg sm:text-xl font-semibold text-text-primary">¥{monthlyExpense.toLocaleString()}</p>
              <p className="text-caption text-text-muted">本月支出</p>
            </div>
            <div className="card !p-4 text-center">
              <BookOpen size={20} className="mx-auto text-mist-blue mb-1.5" />
              <p className="text-lg sm:text-xl font-semibold text-text-primary">{financePlans.filter(p => p.completed).length}/{financePlans.length}</p>
              <p className="text-caption text-text-muted">学习进度</p>
            </div>
            <div className="card !p-4 text-center">
              <Target size={20} className="mx-auto text-mist-purple mb-1.5" />
              <p className="text-lg sm:text-xl font-semibold text-text-primary">¥{(monthlyIncome - monthlyExpense).toLocaleString()}</p>
              <p className="text-caption text-text-muted">结余</p>
            </div>
          </div>

          {financeRecords.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary">最近记录</h3>
                <button onClick={() => setShowRecordForm(true)} className="text-xs text-warm-brown font-medium flex items-center gap-1"><Plus size={12} />添加</button>
              </div>
              <div className="space-y-2">
                {financeRecords.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between py-1.5 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${r.type === 'income' ? 'bg-mint-green' : 'bg-rose-400'}`} />
                      <span className="truncate text-text-secondary">{r.note || r.category}</span>
                    </div>
                    <span className={`font-medium flex-shrink-0 ml-2 ${r.type === 'income' ? 'text-mint-green' : 'text-text-primary'}`}>
                      {r.type === 'income' ? '+' : '-'}¥{r.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'plan' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-body-sm text-text-muted">{financePlans.length} 条计划</p>
            <button onClick={() => setShowPlanForm(true)} className="text-xs text-warm-brown font-medium flex items-center gap-1"><Plus size={12} />添加计划</button>
          </div>
          {financePlans.length === 0 ? (
            <div className="card text-center py-10">
              <BookOpen size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
              <p className="text-text-secondary text-body-sm">暂无学习计划</p>
            </div>
          ) : (
            <div className="space-y-2">
              {financePlans.map(p => (
                <div key={p.id} className="card !p-4 flex items-center gap-3">
                  <button onClick={() => { (updateFinancePlan as any)(p.id, { completed: !p.completed }); }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${p.completed ? 'bg-mint-light/30 text-mint-green' : 'bg-warm-light text-warm-brown'}`}>
                    <TrendingUp size={15} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${p.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>{p.title}</p>
                    {p.description && <p className="text-caption text-text-muted">{p.description}</p>}
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={() => { setPlanForm({ title: p.title, description: p.description || '', completed: p.completed }); setDelPlanId(p.id); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'records' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-body-sm text-text-muted">{financeRecords.length} 条记录</p>
            <button onClick={() => setShowRecordForm(true)} className="text-xs text-warm-brown font-medium flex items-center gap-1"><PlusCircle size={12} />添加记录</button>
          </div>
          {financeRecords.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-text-secondary text-body-sm">暂无记录</p>
            </div>
          ) : (
            <div className="space-y-2">
              {financeRecords.map(r => (
                <div key={r.id} className="card !p-3 flex items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-text-primary truncate">{r.note || r.category}</span>
                    <span className="text-caption text-text-muted">{r.category} · {formatDateShort(r.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${r.type === 'income' ? 'text-mint-green' : 'text-text-primary'}`}>
                      {r.type === 'income' ? '+' : '-'}¥{r.amount.toLocaleString()}
                    </span>
                    <button onClick={() => setDelRecordId(r.id)} className="w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-50">
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Plan Modal */}
      {showPlanForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowPlanForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-6">
            <h3 className="font-semibold text-text-primary mb-4">添加学习计划</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">标题 *</label>
                <input value={planForm.title} onChange={e => setPlanForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="计划名称" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">描述</label>
                <input value={planForm.description} onChange={e => setPlanForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="简单描述" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowPlanForm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={handleAddPlan} disabled={!planForm.title.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium disabled:opacity-40">添加</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showRecordForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowRecordForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-6">
            <h3 className="font-semibold text-text-primary mb-4">添加收支记录</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">类型</label>
                <div className="flex gap-2">
                  <button onClick={() => setRecordForm(p => ({ ...p, type: 'income' }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${recordForm.type === 'income' ? 'bg-mint-light/40 text-mint-green border border-mint-green/20' : 'bg-gray-100 text-text-muted'}`}>收入</button>
                  <button onClick={() => setRecordForm(p => ({ ...p, type: 'expense' }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${recordForm.type === 'expense' ? 'bg-warm-light text-warm-brown border border-warm-brown/20' : 'bg-gray-100 text-text-muted'}`}>支出</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">金额 *</label>
                <input value={recordForm.amount} onChange={e => setRecordForm(p => ({ ...p, amount: e.target.value }))} type="number"
                  placeholder="0" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">类别 *</label>
                <input value={recordForm.category} onChange={e => setRecordForm(p => ({ ...p, category: e.target.value }))}
                  placeholder="如: 餐饮、交通、工资" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">备注</label>
                <input value={recordForm.note} onChange={e => setRecordForm(p => ({ ...p, note: e.target.value }))}
                  placeholder="可选备注" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">日期</label>
                <input type="date" value={recordForm.date} onChange={e => setRecordForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowRecordForm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={handleAddRecord} disabled={!recordForm.amount || !recordForm.category.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium disabled:opacity-40">添加</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete plan confirm */}
      {delPlanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDelPlanId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-6">
            <h3 className="font-semibold text-text-primary mb-2">确认删除</h3>
            <p className="text-sm text-text-secondary mb-4">确定要删除此学习计划吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setDelPlanId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={() => { deleteFinancePlan(delPlanId); setDelPlanId(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium">删除</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete record confirm */}
      {delRecordId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDelRecordId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-6">
            <h3 className="font-semibold text-text-primary mb-2">确认删除</h3>
            <p className="text-sm text-text-secondary mb-4">确定要删除此记录吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setDelRecordId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={() => { deleteFinanceRecord(delRecordId); setDelRecordId(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
