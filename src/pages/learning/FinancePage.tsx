import { useState } from 'react';
import { DollarSign, TrendingUp, Target, Calendar, BookOpen } from 'lucide-react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';

export default function FinancePage() {
  const { financePlans, financeRecords } = useStore();
  const [tab, setTab] = useState<'overview' | 'plan' | 'records'>('overview');

  const monthlyIncome = financeRecords.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const monthlyExpense = financeRecords.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">理财</h1>
        <p className="text-body-sm text-text-muted mt-1">知识学习与个人财务认知管理</p>
      </div>

      <div className="flex overflow-x-auto gap-1.5 mb-4 sm:mb-5 border-b border-gray-100 pb-0 scrollbar-thin">
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
        <div className="space-y-4 sm:space-y-5">
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
              <p className="text-lg sm:text-xl font-semibold text-text-primary">¥{((monthlyIncome - monthlyExpense)).toLocaleString()}</p>
              <p className="text-caption text-text-muted">结余</p>
            </div>
          </div>

          {financeRecords.length > 0 && (
            <div className="card">
              <h3 className="section-title !text-sm">最近记录</h3>
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
        <div className="space-y-3">
          {financePlans.length === 0 ? (
            <div className="card text-center py-10">
              <BookOpen size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
              <p className="text-text-secondary text-body-sm">暂无学习计划</p>
            </div>
          ) : (
            financePlans.map(p => (
              <div key={p.id} className="card !p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.completed ? 'bg-mint-light/30 text-mint-green' : 'bg-warm-light text-warm-brown'}`}>
                    {p.completed ? <TrendingUp size={15} /> : <BookOpen size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${p.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>{p.title}</p>
                    <p className="text-caption text-text-muted">{p.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'records' && (
        <div>
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
                  <span className={`text-sm font-semibold flex-shrink-0 ml-3 ${r.type === 'income' ? 'text-mint-green' : 'text-text-primary'}`}>
                    {r.type === 'income' ? '+' : '-'}¥{r.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
