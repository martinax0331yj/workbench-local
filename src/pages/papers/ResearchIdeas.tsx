import { useState } from 'react';
import { Plus, Lightbulb, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store';
import { getIdeaStatusLabel, formatRelative } from '../../utils';

const statusColors: Record<string, string> = {
  'inspiration': 'bg-yellow-50 text-yellow-700',
  'validating': 'bg-blue-50 text-mist-blue',
  'feasible': 'bg-mist-light/30 text-mist-purple',
  'converted': 'bg-green-50 text-mint-green',
  'paused': 'bg-gray-100 text-text-muted',
  'abandoned': 'bg-gray-100 text-text-muted line-through',
};

export default function ResearchIdeas() {
  const { researchIdeas } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const idea = researchIdeas.find(i => i.id === selectedId);

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">研究想法</h1>
          <p className="text-body-sm text-text-muted mt-1">{researchIdeas.length} 个想法</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-warm-brown text-white rounded-xl text-sm font-medium self-start sm:self-auto">
          <Plus size={15} /> 新想法
        </button>
      </div>

      {researchIdeas.length === 0 ? (
        <div className="card text-center py-12">
          <Lightbulb size={40} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">暂无研究想法</p>
          <p className="text-caption text-text-muted mt-1">记录灵感，从一句话问题开始</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {researchIdeas.map(idea => (
            <div key={idea.id} onClick={() => setSelectedId(idea.id)} className="card !p-4 cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColors[idea.status] || 'bg-gray-100 text-text-muted'}`}>
                  {getIdeaStatusLabel(idea.status)}
                </span>
                <Lightbulb size={14} className="text-warm-brown/40 group-hover:text-warm-brown transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1.5 line-clamp-2">{idea.title}</h3>
              {idea.oneLineQuestion && (
                <p className="text-caption text-text-muted line-clamp-2 mb-2">{idea.oneLineQuestion}</p>
              )}
              <div className="flex items-center justify-between text-[10px] text-text-muted">
                <span>{idea.triggerSource}</span>
                <span>{formatRelative(idea.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {idea && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setSelectedId(null)} />
          <div className="modal-mobile-content relative z-50 animate-[slideInUp_250ms_ease-out] sm:animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[idea.status] || 'bg-gray-100 text-text-muted'}`}>
                  {getIdeaStatusLabel(idea.status)}
                </span>
                <h2 className="text-lg font-serif font-semibold text-text-primary mt-2">{idea.title}</h2>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted flex-shrink-0">
                <AlertTriangle size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {idea.oneLineQuestion && (
                <div className="p-3 rounded-xl bg-warm-light/20">
                  <span className="text-[10px] text-warm-brown font-medium uppercase">一句话问题</span>
                  <p className="text-sm text-text-primary mt-1">{idea.oneLineQuestion}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {idea.triggerSource && <div><span className="text-xs text-text-muted">触发来源</span><p className="text-text-secondary text-[13px] mt-0.5">{idea.triggerSource}</p></div>}
                {idea.researchValue && <div><span className="text-xs text-text-muted">研究价值</span><p className="text-text-secondary text-[13px] mt-0.5">{idea.researchValue}</p></div>}
                {idea.potentialObject && <div><span className="text-xs text-text-muted">潜在对象</span><p className="text-text-secondary text-[13px] mt-0.5">{idea.potentialObject}</p></div>}
                {idea.availableTheories && <div><span className="text-xs text-text-muted">可用理论</span><p className="text-text-secondary text-[13px] mt-0.5">{idea.availableTheories}</p></div>}
                {idea.availableMethods && <div><span className="text-xs text-text-muted">可用方法</span><p className="text-text-secondary text-[13px] mt-0.5">{idea.availableMethods}</p></div>}
                {idea.availableData && <div><span className="text-xs text-text-muted">可获得数据</span><p className="text-text-secondary text-[13px] mt-0.5">{idea.availableData}</p></div>}
                {idea.innovationPotential && <div><span className="text-xs text-text-muted">创新可能</span><p className="text-text-secondary text-[13px] mt-0.5">{idea.innovationPotential}</p></div>}
                {idea.risks && <div><span className="text-xs text-text-muted">风险</span><p className="text-text-secondary text-[13px] mt-0.5">{idea.risks}</p></div>}
              </div>

              {idea.nextVerificationStep && (
                <div className="p-3 rounded-xl bg-mint-light/10">
                  <span className="text-[10px] text-mint-green font-medium">下一步验证</span>
                  <p className="text-[13px] text-text-secondary mt-0.5">{idea.nextVerificationStep}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
              <button className="flex-1 py-2 rounded-xl text-sm font-medium bg-warm-brown text-white">
                转化为项目
              </button>
              <button className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-100 text-text-secondary hover:bg-cream transition-colors">
                编辑
              </button>
            </div>

            <div className="text-caption text-text-muted mt-3 text-center">
              创建于 {formatRelative(idea.createdAt)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
