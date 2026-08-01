import { useState } from 'react';
import { useStore } from '../../store';
import { formatDateShort } from '../../utils';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Heart, TrendingUp, Droplets, Dumbbell, Moon, Plus, Target, Utensils, X, Trash2 } from 'lucide-react';

export default function HealthPage() {
  const { healthRecords, addHealthRecord, deleteHealthRecord } = useStore();
  const [tab, setTab] = useState<'overview' | 'meals' | 'plan'>('overview');
  const [showForm, setShowForm] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0], weight: '', targetWeight: '', waterIntake: '',
    sleepHours: '', exerciseNotes: '', notes: '',
    meals: [] as { type: string; ingredients: string; portion: string; protein: boolean; vegetables: boolean; staple: boolean; onPlan: boolean; note: string }[],
    mealType: 'breakfast', mealIngredients: '', mealPortion: '', mealNote: '', mealProtein: false, mealVeg: false, mealStaple: false, mealOnPlan: true,
  });

  const latest = healthRecords[healthRecords.length - 1];
  const weightData = healthRecords.slice().reverse().map(r => ({
    date: formatDateShort(r.date),
    weight: r.weight,
  }));

  const currentWeight = latest?.weight || 0;
  const targetWeight = latest?.targetWeight || 68;
  const weightDiff = currentWeight - targetWeight;

  const addMeal = () => {
    if (!form.mealIngredients.trim()) return;
    setForm(f => ({
      ...f, meals: [...f.meals, {
        type: f.mealType, ingredients: f.mealIngredients.trim(), portion: f.mealPortion.trim() || '适量',
        protein: f.mealProtein, vegetables: f.mealVeg, staple: f.mealStaple, onPlan: f.mealOnPlan,
        note: f.mealNote.trim() || '',
      }],
      mealIngredients: '', mealPortion: '', mealNote: '', mealOnPlan: true,
    }));
  };

  const handleSubmit = () => {
    if (!form.date || !form.weight) return;
    addHealthRecord({
      date: form.date,
      weight: Number(form.weight),
      targetWeight: form.targetWeight ? Number(form.targetWeight) : undefined,
      waterIntake: form.waterIntake ? Number(form.waterIntake) : undefined,
      sleep: form.sleepHours ? { hours: Number(form.sleepHours), quality: 'ok' as any } : undefined,
      exercise: form.exerciseNotes ? form.exerciseNotes.split(/[,;]/).map(s => ({ name: s.trim(), duration: 30 })) : [],
      meals: form.meals,
      notes: form.notes.trim() || undefined,
      weeklyPlan: undefined,
    } as any);
    setShowForm(false);
    setForm(f => ({ ...f, date: new Date().toISOString().split('T')[0], weight: '', targetWeight: '', waterIntake: '', sleepHours: '', exerciseNotes: '', notes: '', meals: [] }));
  };

  const DelBtn = ({ id }: { id: string }) => (
    <button onClick={() => setDelId(id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
  );

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">体重与饮食管理</h1>
          <p className="text-body-sm text-text-muted mt-1">长期健康行为记录</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> <span>添加记录</span>
        </button>
      </div>

      <div className="flex overflow-x-auto gap-1.5 mb-4 border-b border-gray-100 pb-0 scrollbar-thin">
        {[
          { key: 'overview' as const, label: '概览' },
          { key: 'meals' as const, label: '饮食记录' },
          { key: 'plan' as const, label: '计划' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`pb-2.5 px-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.key ? 'border-warm-brown text-warm-brown' : 'border-transparent text-text-muted'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card !p-3 sm:!p-4 text-center">
              <Heart size={20} className="mx-auto text-bare-pink mb-1" />
              <p className="text-lg sm:text-xl font-semibold text-text-primary">{currentWeight}kg</p>
              <p className="text-caption text-text-muted">当前体重</p>
            </div>
            <div className="card !p-3 sm:!p-4 text-center">
              <Target size={20} className="mx-auto text-mint-green mb-1" />
              <p className="text-lg sm:text-xl font-semibold text-text-primary">{targetWeight}kg</p>
              <p className="text-caption text-text-muted">目标体重</p>
            </div>
            <div className="card !p-3 sm:!p-4 text-center">
              <TrendingUp size={20} className={`mx-auto ${weightDiff > 0 ? 'text-warm-brown' : 'text-mint-green'} mb-1`} />
              <p className={`text-lg sm:text-xl font-semibold ${weightDiff > 0 ? 'text-warm-brown' : 'text-mint-green'}`}>
                {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)}kg
              </p>
              <p className="text-caption text-text-muted">距目标</p>
            </div>
            <div className="card !p-3 sm:!p-4 text-center">
              <Droplets size={20} className="mx-auto text-mist-blue mb-1" />
              <p className="text-lg sm:text-xl font-semibold text-text-primary">{latest?.waterIntake || 0}ml</p>
              <p className="text-caption text-text-muted">昨日饮水</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-text-primary mb-3">体重趋势</h3>
            <div className="h-40 sm:h-52 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C98762" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#C98762" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dy={5} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0', fontSize: 12 }} />
                  <Area type="monotone" dataKey="weight" stroke="#C98762" strokeWidth={1.5} fill="url(#wg2)" dot={{ r: 2, fill: '#C98762' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {latest && (
            <div className="card">
              <h3 className="text-sm font-semibold text-text-primary mb-3">昨日概览 ({latest.date})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <Dumbbell size={16} className="text-warm-brown" />
                  <div><p className="text-sm font-medium text-text-primary">{latest.exercise?.length || 0}</p><p className="text-caption text-text-muted">运动次数</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Moon size={16} className="text-mist-purple" />
                  <div><p className="text-sm font-medium text-text-primary">{latest.sleep?.hours || 0}h</p><p className="text-caption text-text-muted">睡眠</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils size={16} className="text-mint-green" />
                  <div><p className="text-sm font-medium text-text-primary">{latest.meals?.length || 0}</p><p className="text-caption text-text-muted">餐次记录</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets size={16} className="text-mist-blue" />
                  <div><p className="text-sm font-medium text-text-primary">{latest.waterIntake || 0}ml</p><p className="text-caption text-text-muted">饮水</p></div>
                </div>
              </div>
              {latest.notes && <p className="text-body-sm text-text-secondary mt-3 pt-3 border-t border-gray-50">{latest.notes}</p>}
            </div>
          )}
        </div>
      )}

      {tab === 'meals' && (
        <div className="space-y-4">
          {healthRecords.length === 0 ? (
            <div className="card text-center py-10">
              <Utensils size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
              <p className="text-text-secondary text-body-sm">暂无饮食记录</p>
              <button onClick={() => { setTab('overview'); setShowForm(true); }} className="mt-3 text-sm text-warm-brown font-medium hover:underline">添加记录</button>
            </div>
          ) : (
            healthRecords.slice().reverse().map(record => (
              <div key={record.id} className="card !p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-text-primary">{record.date}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-warm-brown">{record.weight}kg</span>
                    <DelBtn id={record.id} />
                  </div>
                </div>
                {record.meals.map((meal, i) => (
                  <div key={i} className="flex items-start gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-medium text-text-muted w-12 flex-shrink-0 pt-0.5">
                      {meal.type === 'breakfast' ? '早餐' : meal.type === 'lunch' ? '午餐' : meal.type === 'dinner' ? '晚餐' : '加餐'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-text-secondary">{meal.ingredients}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-text-muted">{meal.portion}</span>
                        {meal.protein && <span className="text-[10px] px-1 rounded bg-red-50 text-red-500">蛋白质</span>}
                        {meal.vegetables && <span className="text-[10px] px-1 rounded bg-green-50 text-mint-green">蔬菜</span>}
                        {meal.staple && <span className="text-[10px] px-1 rounded bg-orange-50 text-orange-500">主食</span>}
                        {!meal.onPlan && <span className="text-[10px] px-1 rounded bg-yellow-50 text-yellow-600">未按计划</span>}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-50 text-[10px] text-text-muted">
                  <span>饮水 {record.waterIntake}ml</span>
                  <span>睡眠 {record.sleep?.hours}h</span>
                  {(record.exercise?.length ?? 0) > 0 && <span>运动 {(record.exercise || []).length}次</span>}
                </div>
                {record.notes && <p className="text-caption text-text-secondary mt-1.5">{record.notes}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'plan' && (
        <div className="card">
          <h3 className="text-sm font-semibold text-text-primary mb-3">饮食计划</h3>
          <p className="text-body-sm text-text-muted mb-3">{latest?.weeklyPlan || '三人家庭饮食计划'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-cream/50">
              <h4 className="text-xs font-medium text-text-primary mb-2">蛋白质</h4>
              <p className="text-[12px] text-text-secondary">鸡胸肉、鱼、虾、豆腐、鸡蛋</p>
            </div>
            <div className="p-3 rounded-xl bg-cream/50">
              <h4 className="text-xs font-medium text-text-primary mb-2">蔬菜</h4>
              <p className="text-[12px] text-text-secondary">西兰花、菠菜、番茄、黄瓜、菌菇</p>
            </div>
            <div className="p-3 rounded-xl bg-cream/50">
              <h4 className="text-xs font-medium text-text-primary mb-2">主食</h4>
              <p className="text-[12px] text-text-secondary">糙米、全麦面包、红薯、燕麦</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">添加健康记录</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3.5">
              <Field label="日期 *" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} type="date" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="体重 (kg) *" value={form.weight} onChange={v => setForm(f => ({ ...f, weight: v }))} type="number" />
                <Field label="目标体重 (kg)" value={form.targetWeight} onChange={v => setForm(f => ({ ...f, targetWeight: v }))} type="number" />
              </div>
              <Field label="饮水量 (ml)" value={form.waterIntake} onChange={v => setForm(f => ({ ...f, waterIntake: v }))} type="number" />
              <Field label="睡眠时长 (h)" value={form.sleepHours} onChange={v => setForm(f => ({ ...f, sleepHours: v }))} type="number" />
              <Field label="运动 (逗号分隔)" value={form.exerciseNotes} onChange={v => setForm(f => ({ ...f, exerciseNotes: v }))} placeholder="如: 跑步30分钟, 游泳45分钟" />
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">备注</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>

              {/* Meals section */}
              <div className="pt-2 border-t">
                <label className="block text-xs font-medium text-text-primary mb-2">饮食记录</label>
                <div className="bg-cream/30 rounded-xl p-3 space-y-2">
                  {form.meals.map((m, i) => (
                    <div key={i} className="text-[12px] flex items-center gap-2">
                      <span className="text-text-muted w-10">{m.type === 'breakfast' ? '早' : m.type === 'lunch' ? '午' : m.type === 'dinner' ? '晚' : '加'}</span>
                      <span className="flex-1 truncate text-text-primary">{m.ingredients} · {m.portion}</span>
                      <button onClick={() => setForm(f => ({ ...f, meals: f.meals.filter((_, j) => j !== i) }))} className="text-red-400"><X size={12} /></button>
                    </div>
                  ))}
                  {form.meals.length === 0 && <p className="text-xs text-text-muted text-center py-1">暂无餐次，下方添加</p>}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <select value={form.mealType} onChange={e => setForm(f => ({ ...f, mealType: e.target.value }))}
                    className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white text-text-primary">
                    <option value="breakfast">早餐</option><option value="lunch">午餐</option><option value="dinner">晚餐</option><option value="snack">加餐</option>
                  </select>
                  <input value={form.mealIngredients} onChange={e => setForm(f => ({ ...f, mealIngredients: e.target.value }))}
                    placeholder="食材, 逗号分隔" className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-text-primary" />
                  <input value={form.mealPortion} onChange={e => setForm(f => ({ ...f, mealPortion: e.target.value }))}
                    placeholder="份量" className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-text-primary" />
                  <input value={form.mealNote} onChange={e => setForm(f => ({ ...f, mealNote: e.target.value }))}
                    placeholder="备注" className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-text-primary" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                  <label className="flex items-center gap-1 text-text-muted"><input type="checkbox" checked={form.mealProtein} onChange={e => setForm(f => ({ ...f, mealProtein: e.target.checked }))} />蛋白质</label>
                  <label className="flex items-center gap-1 text-text-muted"><input type="checkbox" checked={form.mealVeg} onChange={e => setForm(f => ({ ...f, mealVeg: e.target.checked }))} />蔬菜</label>
                  <label className="flex items-center gap-1 text-text-muted"><input type="checkbox" checked={form.mealStaple} onChange={e => setForm(f => ({ ...f, mealStaple: e.target.checked }))} />主食</label>
                  <label className="flex items-center gap-1 text-text-muted"><input type="checkbox" checked={form.mealOnPlan} onChange={e => setForm(f => ({ ...f, mealOnPlan: e.target.checked }))} />按计划</label>
                </div>
                <button onClick={addMeal} className="mt-2 w-full py-1.5 rounded-lg bg-cream text-xs font-medium text-warm-brown hover:bg-cream/70">添加餐次</button>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-5 py-3.5 flex gap-3 rounded-b-2xl">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={handleSubmit} disabled={!form.date || !form.weight}
                className="flex-1 px-4 py-2.5 rounded-xl bg-mint-green text-white text-sm font-medium hover:bg-mint-green/90 disabled:opacity-40">保存记录</button>
            </div>
          </div>
        </div>
      )}

      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDelId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-6">
            <h3 className="font-semibold text-text-primary mb-2">确认删除</h3>
            <p className="text-sm text-text-secondary mb-4">确定要删除此日期的健康记录吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={() => { deleteHealthRecord(delId); setDelId(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
