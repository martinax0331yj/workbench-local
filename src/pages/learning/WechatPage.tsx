import { FileEdit, Eye, Heart, TrendingUp } from 'lucide-react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';

const articleStatusLabels: Record<string, string> = {
  'inspiration': '灵感', 'validated': '已验证', 'collecting': '搜集资料', 'outlining': '搭大纲',
  'draft': '初稿', 'revising': '修改中', 'formatting': '排版', 'ready': '待发布',
  'published': '已发布', 'reviewed': '已复盘',
};
const statusColors: Record<string, string> = {
  'inspiration': 'bg-yellow-50 text-yellow-700', 'validated': 'bg-blue-50 text-mist-blue',
  'collecting': 'bg-orange-50 text-warm-brown', 'outlining': 'bg-mist-light/30 text-mist-purple',
  'draft': 'bg-gray-100 text-text-muted', 'revising': 'bg-blue-50 text-mist-blue',
  'formatting': 'bg-mist-light/30 text-mist-purple', 'ready': 'bg-warm-light text-warm-brown',
  'published': 'bg-green-50 text-mint-green', 'reviewed': 'bg-gray-100 text-text-muted',
};

export default function WechatPage() {
  const { wechatArticles } = useStore();

  const published = wechatArticles.filter(a => a.status === 'published');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">公众号</h1>
        <p className="text-body-sm text-text-muted mt-1">内容创作与管理</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-5">
        {[
          { label: '文章总数', value: wechatArticles.length, icon: FileEdit, color: 'text-warm-brown' },
          { label: '已发布', value: published.length, icon: TrendingUp, color: 'text-mint-green' },
          { label: '修改中', value: wechatArticles.filter(a => a.status === 'revising').length, icon: FileEdit, color: 'text-mist-blue' },
          { label: '待发布', value: wechatArticles.filter(a => a.status === 'ready').length, icon: FileEdit, color: 'text-mist-purple' },
          { label: '灵感', value: wechatArticles.filter(a => a.status === 'inspiration').length, icon: Heart, color: 'text-red-400' },
          { label: '已复盘', value: wechatArticles.filter(a => a.status === 'reviewed').length, icon: Eye, color: 'text-gray-400' },
        ].map(s => (
          <div key={s.label} className="card !p-3 text-center">
            <p className="text-base sm:text-lg font-semibold text-text-primary">{s.value}</p>
            <p className="text-[10px] text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Articles */}
      {wechatArticles.length === 0 ? (
        <div className="card text-center py-10">
          <FileEdit size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">暂无文章</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {wechatArticles.map(a => (
            <div key={a.id} className="card !p-4">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[a.status] || 'bg-gray-100 text-text-muted'}`}>
                  {articleStatusLabels[a.status] || a.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1 line-clamp-2">{a.title}</h3>
              {a.summary && <p className="text-caption text-text-muted line-clamp-2 mb-2">{a.summary}</p>}
              
              {a.status === 'published' && (
                <div className="flex items-center gap-3 text-[10px] text-text-muted mt-2 pt-2 border-t border-gray-50">
                  <span className="flex items-center gap-0.5"><Eye size={10} /> {a.views || 0}</span>
                  <span className="flex items-center gap-0.5"><Heart size={10} /> {a.likes || 0}</span>
                  <span>{a.publishDate ? formatDateShort(a.publishDate) : ''}</span>
                </div>
              )}

              <p className="text-[10px] text-text-muted mt-2">{formatRelative(a.updatedAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
