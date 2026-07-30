import { Video, Play, Eye, Heart } from 'lucide-react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';

const videoStatusLabels: Record<string, string> = {
  'inspiration': '灵感', 'scripting': '写脚本', 'filming': '拍摄中', 'filmed': '已拍摄',
  'editing': '剪辑中', 'ready': '待发布', 'published': '已发布', 'reviewed': '已复盘',
};
const statusColors: Record<string, string> = {
  'inspiration': 'bg-yellow-50 text-yellow-700', 'scripting': 'bg-blue-50 text-mist-blue',
  'filming': 'bg-warm-light text-warm-brown', 'filmed': 'bg-mist-light/30 text-mist-purple',
  'editing': 'bg-orange-50 text-orange-600', 'ready': 'bg-mist-light/30 text-mist-purple',
  'published': 'bg-green-50 text-mint-green', 'reviewed': 'bg-gray-100 text-text-muted',
};

export default function VideoPage() {
  const { videoProjects } = useStore();

  const published = videoProjects.filter(v => v.status === 'published');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">拍视频</h1>
        <p className="text-body-sm text-text-muted mt-1">视频内容创作</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-5">
        {[
          { label: '视频总数', value: videoProjects.length },
          { label: '已发布', value: published.length },
          { label: '剪辑中', value: videoProjects.filter(v => v.status === 'editing').length },
          { label: '写脚本', value: videoProjects.filter(v => v.status === 'scripting').length },
          { label: '灵感', value: videoProjects.filter(v => v.status === 'inspiration').length },
          { label: '已复盘', value: videoProjects.filter(v => v.status === 'reviewed').length },
        ].map(s => (
          <div key={s.label} className="card !p-3 text-center">
            <p className="text-base sm:text-lg font-semibold text-text-primary">{s.value}</p>
            <p className="text-[10px] text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {videoProjects.length === 0 ? (
        <div className="card text-center py-10">
          <Video size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">暂无视频项目</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {videoProjects.map(v => (
            <div key={v.id} className="card !p-4">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[v.status] || 'bg-gray-100 text-text-muted'}`}>
                  {videoStatusLabels[v.status] || v.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1 line-clamp-2">{v.title}</h3>
              {v.platform && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-text-muted">{v.platform}</span>}

              {v.status === 'published' && (
                <div className="flex items-center gap-3 text-[10px] text-text-muted mt-2 pt-2 border-t border-gray-50">
                  <span className="flex items-center gap-0.5"><Play size={10} /> {v.views || 0}</span>
                  <span className="flex items-center gap-0.5"><Heart size={10} /> {v.likes || 0}</span>
                  <span>{v.publishDate ? formatDateShort(v.publishDate) : ''}</span>
                </div>
              )}

              <p className="text-[10px] text-text-muted mt-2">{formatRelative(v.updatedAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
