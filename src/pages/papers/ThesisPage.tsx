import { useState } from 'react';
import { Plus, ScrollText, CheckCircle2, Calendar, Clock } from 'lucide-react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';

const chapterStatusLabels: Record<string, string> = {
  'not-started': '未开始', 'framework': '搭建框架', 'collecting': '资料收集', 'drafted': '初稿完成', 'revising': '修改中', 'final': '定稿',
};
const chapterStatusColors: Record<string, string> = {
  'not-started': 'bg-gray-100 text-gray-500', 'framework': 'bg-blue-50 text-mist-blue', 'collecting': 'bg-orange-50 text-warm-brown', 'drafted': 'bg-mist-light/30 text-mist-purple', 'revising': 'bg-yellow-50 text-yellow-700', 'final': 'bg-green-50 text-mint-green',
};

export default function ThesisPage() {
  const { thesis, updateThesis } = useStore();

  if (!thesis) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">毕业论文</h1>
        </div>
        <div className="card text-center py-12">
          <ScrollText size={40} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">暂无毕业论文项目</p>
          <button className="mt-3 text-sm text-warm-brown font-medium">创建毕业论文</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">毕业论文</h1>
          <p className="text-body-sm text-text-muted mt-1">章节驱动管理</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-warm-brown text-white rounded-xl text-sm font-medium self-start sm:self-auto">
          <Plus size={15} /> 添加章节
        </button>
      </div>

      {/* Overview */}
      <div className="card mb-4 sm:mb-5">
        <h2 className="font-serif text-lg font-semibold text-text-primary mb-2">{thesis.title}</h2>
        <p className="text-body-sm text-text-secondary mb-3">{thesis.researchQuestion}</p>
        <div className="progress-bar mb-2">
          <div className="progress-fill" style={{ width: `${thesis.progress}%` }} />
        </div>
        <div className="flex justify-between text-caption text-text-muted">总体进度 {thesis.progress}%</div>
      </div>

      {/* Milestones */}
      <div className="card mb-4 sm:mb-5">
        <h3 className="section-title !text-sm">关键节点</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {thesis.milestones.map(m => (
            <div key={m.id} className={`p-2.5 sm:p-3 rounded-xl text-center ${m.completed ? 'bg-mint-light/20' : 'bg-cream/50'}`}>
              <div className="text-xs font-medium text-text-primary mb-0.5">{m.title}</div>
              <div className="text-[10px] text-text-muted">{formatDateShort(m.date)}</div>
              {m.completed && <CheckCircle2 size={12} className="mx-auto mt-1 text-mint-green" />}
            </div>
          ))}
        </div>
      </div>

      {/* Chapter Tree */}
      <div className="card">
        <h3 className="section-title !text-sm">章节树</h3>
        <div className="space-y-2">
          {thesis.chapters.map(ch => (
            <div key={ch.id}>
              <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-cream/50 hover:bg-cream transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] sm:text-xs font-medium text-text-primary">{ch.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${chapterStatusColors[ch.status] || 'bg-gray-100 text-text-muted'}`}>
                      {chapterStatusLabels[ch.status]}
                    </span>
                  </div>
                  <div className="progress-bar max-w-[200px]">
                    <div className="progress-fill" style={{ width: `${ch.progress}%` }} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-text-muted">
                    {ch.wordCount > 0 && <span>{ch.wordCount.toLocaleString()} 字</span>}
                    <span>{ch.progress}%</span>
                  </div>
                </div>
              </div>

              {ch.subChapters && ch.subChapters.length > 0 && (
                <div className="ml-6 mt-1 space-y-1 border-l border-gray-100 pl-3">
                  {ch.subChapters.map(sub => (
                    <div key={sub.id} className="flex items-center gap-2 py-1">
                      <div className={`w-1 h-1 rounded-full ${sub.completed ? 'bg-mint-green' : 'bg-gray-300'}`} />
                      <span className="text-[12px] text-text-secondary">{sub.title}</span>
                      {sub.wordCount > 0 && <span className="text-[10px] text-text-muted">{sub.wordCount.toLocaleString()}字</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Advisor Feedback */}
      {thesis.advisorFeedback && thesis.advisorFeedback.length > 0 && (
        <div className="card mt-4 sm:mt-5">
          <h3 className="section-title !text-sm">导师意见</h3>
          <div className="space-y-2">
            {thesis.advisorFeedback.map((fb, i) => (
              <div key={i} className="p-2.5 sm:p-3 rounded-xl bg-mist-light/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-mist-purple">{fb.topic}</span>
                  <span className="text-[10px] text-text-muted">{formatDateShort(fb.date)}</span>
                </div>
                <p className="text-[12px] sm:text-[13px] text-text-secondary">{fb.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revision Records */}
      {thesis.revisions && thesis.revisions.length > 0 && (
        <div className="card mt-4 sm:mt-5">
          <h3 className="section-title !text-sm">修改记录</h3>
          <div className="space-y-1.5">
            {thesis.revisions.map((rev, i) => (
              <div key={i} className="flex items-start gap-2 text-[12px] sm:text-[13px]">
                <span className="text-text-muted flex-shrink-0">{formatDateShort(rev.date)}</span>
                <span className="text-text-secondary">{rev.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
