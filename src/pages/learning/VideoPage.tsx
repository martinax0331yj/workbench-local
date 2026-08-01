import { useState } from 'react';
import { useStore } from '../../store';
import { formatDateShort, formatRelative } from '../../utils';
import { Video, Plus, X, Edit3, Trash2, ChevronRight, Play, Heart } from 'lucide-react';

const statusLabels: Record<string, string> = {
  'inspiration': '灵感', 'scripting': '写脚本', 'filming': '拍摄中', 'filmed': '已拍摄',
  'editing': '剪辑中', 'ready': '待发布', 'published': '已发布', 'reviewed': '已复盘',
};
const statusColors: Record<string, string> = {
  'inspiration': 'bg-yellow-50 text-yellow-700', 'scripting': 'bg-blue-50 text-mist-blue',
  'filming': 'bg-warm-light text-warm-brown', 'filmed': 'bg-mist-light/30 text-mist-purple',
  'editing': 'bg-orange-50 text-orange-600', 'ready': 'bg-mist-light/30 text-mist-purple',
  'published': 'bg-green-50 text-mint-green', 'reviewed': 'bg-gray-100 text-text-muted',
};

const initForm = { title: '', platform: '', status: 'inspiration', topic: '', publishDate: '', views: '', likes: '' };

export default function VideoPage() {
  const { videoProjects, addVideoProject, updateVideoProject, deleteVideoProject } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...initForm });

  const selected = videoProjects.find(v => v.id === selectedId) || null;
  const published = videoProjects.filter(v => v.status === 'published');

  const resetForm = () => { setForm({ ...initForm }); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (v: any) => {
    setEditingId(v.id);
    setForm({
      title: v.title, platform: v.platform || '', status: v.status || 'inspiration',
      topic: v.topic || '', publishDate: v.publishDate || '',
      views: v.metrics?.views ? String(v.metrics.views) : '',
      likes: v.metrics?.likes ? String(v.metrics.likes) : '',
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const base = {
      title: form.title.trim(), platform: form.platform.trim() || undefined,
      status: form.status, topic: form.topic.trim() || undefined,
      publishDate: form.publishDate || undefined,
      metrics: { views: form.views ? Number(form.views) : 0, likes: form.likes ? Number(form.likes) : 0, engagements: 0 },
    };
    if (editingId) {
      updateVideoProject(editingId, base as any);
    } else {
      addVideoProject({ ...base, script: '', clips: [], tags: [] } as any);
    }
    setShowForm(false); resetForm();
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">拍视频</h1>
          <p className="text-body-sm text-text-muted mt-1">视频内容创作</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> <span>新建视频</span>
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin pr-1">
          {videoProjects.length === 0 ? (
            <p className="text-body-sm text-text-muted text-center py-8">暂无视频项目</p>
          ) : videoProjects.map(v => (
            <div key={v.id} onClick={() => setSelectedId(v.id)}
              className={`card cursor-pointer transition-all hover:shadow-md ${selectedId === v.id ? 'ring-2 ring-warm-brown/30 border-warm-brown/30' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-text-primary truncate flex-1">{v.title}</h3>
                <ChevronRight size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[v.status] || 'bg-gray-100'}`}>{statusLabels[v.status] || v.status}</span>
                {v.platform && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-text-muted">{v.platform}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">{selected.title}</h2>
                  {selected.topic && <p className="text-sm text-text-secondary mt-1">{selected.topic}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(selected)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-cream"><Edit3 size={14} /></button>
                  <button onClick={() => setDelId(selected.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="space-y-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[selected.status] || 'bg-gray-100'}`}>{statusLabels[selected.status] || selected.status}</span>
                {selected.platform && <div><p className="text-[11px] text-text-muted">平台</p><p className="text-[13px] text-text-primary">{selected.platform}</p></div>}
                {selected.status === 'published' && (
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1"><Play size={14} /> {(selected as any).metrics?.views || 0} 播放</span>
                    <span className="flex items-center gap-1"><Heart size={14} /> {(selected as any).metrics?.likes || 0} 点赞</span>
                    {selected.publishDate && <span>{formatDateShort(selected.publishDate)}</span>}
                  </div>
                )}
                <p className="text-[11px] text-text-muted pt-3 border-t">更新于 {formatRelative(selected.updatedAt)}</p>
              </div>
            </div>
          ) : (
            <div className="card flex items-center justify-center py-16">
              <div className="text-center">
                <Video size={32} className="mx-auto text-text-muted mb-3" />
                <p className="text-body-sm text-text-muted">{videoProjects.length > 0 ? '选择一个视频查看详情' : '暂无视频项目，点击右上角新建'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24 px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowForm(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">{editingId ? '编辑视频' : '新建视频'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">标题 *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">平台</label>
                <input value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}
                  placeholder="如: 抖音、B站、YouTube" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">状态</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20">
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">主题</label>
                <textarea value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
              </div>
              <Field label="发布日期" value={form.publishDate} onChange={v => setForm(p => ({ ...p, publishDate: v }))} type="date" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="播放量" value={form.views} onChange={v => setForm(p => ({ ...p, views: v }))} type="number" />
                <Field label="点赞量" value={form.likes} onChange={v => setForm(p => ({ ...p, likes: v }))} type="number" />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-5 py-3.5 flex gap-3 rounded-b-2xl">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={handleSubmit} disabled={!form.title.trim()}
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
            <p className="text-sm text-text-secondary mb-4">确定要删除此视频项目吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary">取消</button>
              <button onClick={() => { deleteVideoProject(delId); setDelId(null); setSelectedId(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-warm-brown/20" />
    </div>
  );
}
