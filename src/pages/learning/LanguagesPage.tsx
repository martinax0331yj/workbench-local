import { useState } from 'react';
import { useStore } from '../../store';
import { formatRelative } from '../../utils';
import { Languages, Plus, X, Trash2, Edit3, CheckCircle2, Flame } from 'lucide-react';

export default function LanguagesPage() {
  const { languageLearnings, addLanguageLearning, updateLanguageLearning, deleteLanguageLearning } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState({ language: '', level: '', dailyGoal: '', currentStreak: '' });

  const resetForm = () => { setForm({ language: '', level: '', dailyGoal: '', currentStreak: '' }); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (l: any) => {
    setEditingId(l.id);
    setForm({
      language: l.language, level: l.level || '', dailyGoal: l.dailyGoal || '',
      currentStreak: l.currentStreak ? String(l.currentStreak) : '',
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.language.trim()) return;
    const base = {
      language: form.language.trim(), level: form.level.trim() || undefined,
      dailyGoal: form.dailyGoal.trim() || undefined,
      currentStreak: form.currentStreak ? Number(form.currentStreak) : undefined,
    };
    if (editingId) {
      updateLanguageLearning(editingId, base as any);
    } else {
      addLanguageLearning({ ...base, checkIns: [], tasks: [] } as any);
    }
    setShowForm(false); resetForm();
  };

  const handleToggleCheckIn = (l: any) => {
    const today = new Date().toISOString().split('T')[0];
    const checkIns = l.checkIns || [];
    const hasToday = checkIns.some((c: any) => c.date === today);
    const newCheckIns = hasToday
      ? checkIns.filter((c: any) => c.date !== today)
      : [...checkIns, { date: today, minutes: 30, completed: true }];
    
    const sorted = [...newCheckIns].sort((a: any, b: any) => b.date.localeCompare(a.date));
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date(now);
      expected.setDate(expected.getDate() - i);
      const expDate = expected.toISOString().split('T')[0];
      if (sorted[i].date === expDate) streak++;
      else break;
    }
    
    updateLanguageLearning(l.id, { checkIns: newCheckIns, currentStreak: streak } as any);
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">语言学习</h1>
          <p className="text-body-sm text-text-muted mt-1">多语言学习进度追踪</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> <span>添加语言</span>
        </button>
      </div>

      {languageLearnings.length === 0 ? (
        <div className="card text-center py-12">
          <Languages size={40} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary">暂未添加语言学习计划</p>
          <p className="text-caption text-text-muted mt-1">点击右上角开始</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {languageLearnings.map((l: any) => (
            <div key={l.id} className="card !p-4 relative">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{l.language}</h3>
                  {l.level && <p className="text-[11px] text-text-muted">{l.level}</p>}
                </div>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => openEdit(l)} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-cream"><Edit3 size={13} /></button>
                  <button onClick={() => setDelId(l.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <Flame size={16} className={l.currentStreak > 0 ? 'text-orange-500' : 'text-text-muted'} />
                  <span className="text-sm font-semibold text-text-primary">{l.currentStreak || 0}</span>
                  <span className="text-[10px] text-text-muted">天</span>
                </div>
                {l.dailyGoal && <span className="text-[11px] text-text-muted">目标: {l.dailyGoal}</span>}
              </div>

              <button onClick={() => handleToggleCheckIn(l)}
                className={`w-full py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  (l.checkIns || []).some((c: any) => c.date === new Date().toISOString().split('T')[0])
                    ? 'bg-mint-light/40 text-mint-green border border-mint-green/20'
                    : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                }`}>
                <CheckCircle2 size={14} fill={(l.checkIns || []).some((c: any) => c.date === new Date().toISOString().split('T')[0]) ? 'currentColor' : 'none'} />
                {(l.checkIns || []).some((c: any) => c.date === new Date().toISOString().split('T')[0]) ? '今日已打卡' : '打卡签到'}
              </button>

              <p className="text-[10px] text-text-muted mt-3 text-center">更新于 {formatRelative(l.updatedAt)}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24 px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowForm(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">{editingId ? '编辑语言' : '添加语言'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">语言 *</label>
                <input value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
                  placeholder="如: 英语、日语、法语" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">当前水平</label>
                <input value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                  placeholder="如: B1, N3" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">每日目标</label>
                <input value={form.dailyGoal} onChange={e => setForm(p => ({ ...p, dailyGoal: e.target.value }))}
                  placeholder="如: 30分钟、1节课" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">当前连续天数</label>
                <input value={form.currentStreak} onChange={e => setForm(p => ({ ...p, currentStreak: e.target.value }))} type="number"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-5 py-3.5 flex gap-3 rounded-b-2xl">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={handleSubmit} disabled={!form.language.trim()}
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
            <p className="text-sm text-text-secondary mb-4">确定要删除此语言学习记录吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={() => { deleteLanguageLearning(delId); setDelId(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
