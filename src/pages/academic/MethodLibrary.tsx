import { useState } from 'react';
import { Search, X, FlaskConical, ChevronRight } from 'lucide-react';
import { useStore } from '../../store';
import { formatRelative } from '../../utils';

const paradigms = ['定量研究', '质性研究', '混合研究', '文本与计算', '案例研究', '文献研究'];

export default function MethodLibrary() {
  const { methods, deleteMethod } = useStore();
  const [search, setSearch] = useState('');
  const [selectedParadigm, setSelectedParadigm] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'guide'>('overview');

  const filtered = methods.filter(m => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!m.nameZh.toLowerCase().includes(q) && !m.nameEn?.toLowerCase().includes(q) && !m.type?.toLowerCase().includes(q)) return false;
    }
    if (selectedParadigm && m.paradigm !== selectedParadigm) return false;
    return true;
  });

  const selected = selectedId ? methods.find(m => m.id === selectedId) : null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">方法库</h1>
        <p className="text-body-sm text-text-muted mt-1">{methods.length} 个方法卡片</p>
      </div>

      <div className="relative mb-4 sm:mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索方法名称..."
          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none"
        />
      </div>

      {/* Paradigm filter */}
      <div className="flex overflow-x-auto gap-1.5 sm:gap-2 mb-4 pb-1 scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setSelectedParadigm(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${!selectedParadigm ? 'bg-warm-brown text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
        >
          全部
        </button>
        {paradigms.map(p => (
          <button
            key={p}
            onClick={() => setSelectedParadigm(p)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${selectedParadigm === p ? 'bg-warm-brown text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
          >
            {p}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-10">
          <FlaskConical size={32} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary">暂无方法卡片</p>
          <button className="mt-3 text-sm text-warm-brown font-medium">新建方法卡片</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map(method => (
            <div key={method.id} onClick={() => setSelectedId(method.id)} className="card !p-4 cursor-pointer hover:border-mist-blue/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FlaskConical size={16} className="text-mist-blue" />
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-mist-blue font-medium">{method.type || method.paradigm}</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-0.5">{method.nameZh}</h3>
              {method.nameEn && <p className="text-[11px] text-text-muted italic mb-2">{method.nameEn}</p>}
              {method.applicableQuestions && <p className="text-caption text-text-muted line-clamp-2">{method.applicableQuestions}</p>}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setSelectedId(null)} />
          <div className="modal-mobile-content relative z-50 animate-[slideInUp_250ms_ease-out] sm:animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-serif font-semibold text-text-primary">{selected.nameZh}</h2>
                {selected.nameEn && <p className="text-sm text-text-muted italic">{selected.nameEn}</p>}
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>

            <div className="flex gap-2 mb-4 border-b border-gray-100 overflow-x-auto scrollbar-thin">
              <button onClick={() => setDetailTab('overview')} className={`pb-2 px-1 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${detailTab === 'overview' ? 'border-warm-brown text-warm-brown' : 'border-transparent text-text-muted'}`}>
                方法概览
              </button>
              <button onClick={() => setDetailTab('guide')} className={`pb-2 px-1 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${detailTab === 'guide' ? 'border-warm-brown text-warm-brown' : 'border-transparent text-text-muted'}`}>
                如何复现
              </button>
            </div>

            {detailTab === 'overview' ? (
              <div className="space-y-3 text-sm">
                {selected.applicableQuestions && <div><span className="text-xs text-text-muted">适用问题</span><p className="text-text-secondary mt-0.5">{selected.applicableQuestions}</p></div>}
                {selected.dataRequirements && <div><span className="text-xs text-text-muted">数据要求</span><p className="text-text-secondary mt-0.5">{selected.dataRequirements}</p></div>}
                {selected.coreAssumptions && <div><span className="text-xs text-text-muted">核心假设</span><p className="text-text-secondary mt-0.5">{selected.coreAssumptions}</p></div>}
                {selected.mainOutput && <div><span className="text-xs text-text-muted">主要输出</span><p className="text-text-secondary mt-0.5">{selected.mainOutput}</p></div>}
                {selected.commonMistakes && <div><span className="text-xs text-text-muted">常见错误</span><p className="text-text-secondary mt-0.5">{selected.commonMistakes}</p></div>}
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-xl bg-cream/50">
                  <h4 className="text-xs font-medium text-text-primary mb-1">1. 什么时候使用</h4>
                  <p className="text-text-secondary text-[13px]">{selected.applicableQuestions || '待补充'}</p>
                </div>
                <div className="p-3 rounded-xl bg-cream/50">
                  <h4 className="text-xs font-medium text-text-primary mb-1">2. 使用前需要什么</h4>
                  <p className="text-text-secondary text-[13px]">{selected.dataRequirements || '待补充'}</p>
                </div>
                <div className="p-3 rounded-xl bg-cream/50">
                  <h4 className="text-xs font-medium text-text-primary mb-1">3. 如何操作</h4>
                  <p className="text-text-secondary text-[13px]">{selected.standardSteps || '待补充'}</p>
                </div>
                <div className="p-3 rounded-xl bg-cream/50">
                  <h4 className="text-xs font-medium text-text-primary mb-1">4. 如何判断结果</h4>
                  <p className="text-text-secondary text-[13px]">{selected.resultInterpretation || '待补充'}</p>
                </div>
                <div className="p-3 rounded-xl bg-cream/50">
                  <h4 className="text-xs font-medium text-text-primary mb-1">5. 如何规范报告</h4>
                  <p className="text-text-secondary text-[13px]">{selected.mainOutput || '待补充'}</p>
                </div>
                <div className="p-3 rounded-xl bg-cream/50">
                  <h4 className="text-xs font-medium text-text-primary mb-1">6. 常见错误</h4>
                  <p className="text-text-secondary text-[13px]">{selected.commonMistakes || '待补充'}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-3 mt-3 border-t border-gray-50">
              <button className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-100 text-text-secondary hover:bg-cream transition-colors">编辑</button>
              <button onClick={() => { deleteMethod(selected.id); setSelectedId(null); }} className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-100 text-rose-500 hover:bg-rose-50 transition-colors">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
