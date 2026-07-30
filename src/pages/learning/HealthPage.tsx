import { useState } from 'react';
import { Heart, TrendingUp, Droplets, Dumbbell, Moon, Plus, Target, Utensils } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useStore } from '../../store';
import { formatDateShort } from '../../utils';

export default function HealthPage() {
  const { healthRecords } = useStore();
  const [tab, setTab] = useState<'overview' | 'meals' | 'plan'>('overview');

  const latest = healthRecords[healthRecords.length - 1];
  const weightData = healthRecords.slice().reverse().map(r => ({
    date: formatDateShort(r.date),
    weight: r.weight,
  }));

  const currentWeight = latest?.weight || 0;
  const targetWeight = latest?.targetWeight || 68;
  const weightDiff = currentWeight - targetWeight;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">体重与饮食管理</h1>
        <p className="text-body-sm text-text-muted mt-1">长期健康行为记录</p>
      </div>

      <div className="flex overflow-x-auto gap-1.5 mb-4 sm:mb-5 border-b border-gray-100 pb-0 scrollbar-thin">
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
        <div className="space-y-4 sm:space-y-5">
          {/* Weight cards */}
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

          {/* Weight chart */}
          <div className="card">
            <h3 className="section-title !text-sm">体重趋势</h3>
            <div className="h-40 sm:h-52 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="weightGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C98762" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#C98762" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dy={5} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0', fontSize: 12 }} />
                  <Area type="monotone" dataKey="weight" stroke="#C98762" strokeWidth={1.5} fill="url(#weightGrad2)" dot={{ r: 2, fill: '#C98762' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Latest day summary */}
          {latest && (
            <div className="card">
              <h3 className="section-title !text-sm">昨日概览 ({latest.date})</h3>
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
              {latest.notes && (
                <p className="text-body-sm text-text-secondary mt-3 pt-3 border-t border-gray-50">{latest.notes}</p>
              )}
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
              <button className="mt-3 text-sm text-warm-brown font-medium">添加记录</button>
            </div>
          ) : (
            healthRecords.slice().reverse().map(record => (
              <div key={record.id} className="card !p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-text-primary">{record.date}</h4>
                  <span className="text-sm font-medium text-warm-brown">{record.weight}kg</span>
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
                      {meal.note && <p className="text-[10px] text-text-muted mt-0.5 italic">{meal.note}</p>}
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
          <h3 className="section-title !text-sm">饮食计划</h3>
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
    </div>
  );
}
