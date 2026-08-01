import { useState } from 'react';
import { Search, Filter, Grid3X3, List, Archive, Star, Trash2, X, ChevronDown, BookOpen, ExternalLink, Plus, Edit3 } from 'lucide-react';
import { useStore } from '../../store';
import { formatRelative, formatDateShort } from '../../utils';
import { ConfirmDialog, useToast } from '../../components/common';
import type { ReadingStatus, Literature } from '../../types';

const statusLabels: Record<ReadingStatus, string> = {
  'to-read': '待读', 'skimming': '略读中', 'reading': '精读中', 'completed': '已完成',
};

const statusColors: Record<ReadingStatus, string> = {
  'to-read': 'bg-gray-100 text-gray-600', 'skimming': 'bg-blue-50 text-mist-blue', 'reading': 'bg-warm-light text-warm-brown', 'completed': 'bg-green-50 text-mint-green',
};

export default function LiteratureLibrary() {
  const { literatures, addLiterature, toggleStarLiterature, deleteLiterature, updateLiteratureStatus, updateLiterature } = useStore();
  const { toast } = useToast();
  const [view, setView] = useState<'card' | 'table'>('card');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [newLit, setNewLit] = useState({ title: '', authors: '', year: new Date().getFullYear().toString(), journal: '', doi: '', abstract: '', keywords: '', link: '', type: '期刊论文' });
  const [editLit, setEditLit] = useState<Literature | null>(null);
  const [editForm, setEditForm] = useState({ title: '', authors: '', year: '', journal: '', doi: '', researchQuestion: '', keywords: '', literatureType: '' });

  let filtered = literatures;
  if (statusFilter !== 'all') filtered = filtered.filter(l => l.readingStatus === statusFilter);
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(l => l.title.toLowerCase().includes(q) || l.authors.some(a => a.toLowerCase().includes(q)) || l.keywords.some(k => k.toLowerCase().includes(q)));
  }

  const selected = selectedId ? literatures.find(l => l.id === selectedId) : null;

  const openEdit = (lit: Literature) => {
    setEditLit(lit);
    setEditForm({
      title: lit.title, authors: lit.authors.join(', '), year: String(lit.year),
      journal: lit.journal || '', doi: lit.doi || '', researchQuestion: lit.researchQuestion || '',
      keywords: lit.keywords.join(', '), literatureType: lit.literatureType || '期刊论文',
    });
    setShowEdit(true);
  };

  const handleEdit = () => {
    if (!editLit || !editForm.title.trim()) return;
    updateLiterature(editLit.id, {
      title: editForm.title.trim(),
      authors: editForm.authors.split(/[,;，；]/).map((s: string) => s.trim()).filter(Boolean),
      year: parseInt(editForm.year) || new Date().getFullYear(),
      journal: editForm.journal.trim() || undefined,
      doi: editForm.doi.trim() || undefined,
      researchQuestion: editForm.researchQuestion.trim() || undefined,
      keywords: editForm.keywords.split(/[,;，；]/).map((s: string) => s.trim()).filter(Boolean),
      literatureType: editForm.literatureType,
    } as any);
    setShowEdit(false); setEditLit(null);
    toast('success', '文献已更新');
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">文献库</h1>
          <p className="text-body-sm text-text-muted mt-1">{literatures.length} 篇文献</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> <span className="hidden sm:inline">新建文献</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-5">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索文献标题、作者、关键词..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 h-10 rounded-xl text-sm border transition-colors ${
              statusFilter !== 'all' ? 'border-warm-brown/30 bg-warm-light text-warm-brown' : 'border-gray-100 text-text-secondary hover:bg-cream'
            }`}
          >
            <Filter size={14} />
            <span className="hidden sm:inline">筛选</span>
            {statusFilter !== 'all' && <span className="text-[10px] hidden sm:inline">(1)</span>}
          </button>
          <div className="flex bg-white border border-gray-100 rounded-xl overflow-hidden">
            <button onClick={() => setView('card')} className={`px-2.5 py-2 ${view === 'card' ? 'bg-cream text-warm-brown' : 'text-text-muted hover:text-text-primary'}`}>
              <Grid3X3 size={15} />
            </button>
            <button onClick={() => setView('table')} className={`px-2.5 py-2 ${view === 'table' ? 'bg-cream text-warm-brown' : 'text-text-muted hover:text-text-primary'}`}>
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Status filter chips (mobile) */}
      {showFilters && (
        <div className="flex flex-wrap gap-1.5 mb-3 sm:hidden">
          {(['all', 'to-read', 'skimming', 'reading', 'completed'] as const).map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setShowFilters(false); }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === s ? 'bg-warm-brown text-white' : 'bg-gray-100 text-text-muted'}`}
            >
              {s === 'all' ? '全部' : statusLabels[s]}
            </button>
          ))}
        </div>
      )}

      {/* Status filter pills (desktop) */}
      <div className="hidden sm:flex gap-2 mb-4">
        {(['all', 'to-read', 'skimming', 'reading', 'completed'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === s ? 'bg-warm-brown text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
          >
            {s === 'all' ? '全部' : statusLabels[s]}
          </button>
        ))}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="card text-center py-10">
          <BookOpen size={32} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary">暂无符合条件的文献</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-sm text-warm-brown font-medium hover:underline">新建文献</button>
        </div>
      ) : view === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map(lit => (
            <div key={lit.id} onClick={() => setSelectedId(lit.id)} className="card !p-4 cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[lit.readingStatus]}`}>{statusLabels[lit.readingStatus]}</span>
                <div className="flex gap-0.5">
                  {lit.starred && <Star size={12} className="text-warm-brown fill-warm-brown" />}
                  {lit.archived && <Archive size={12} className="text-text-muted" />}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-text-primary line-clamp-2 mb-1.5 leading-snug">{lit.title}</h3>
              <p className="text-[11px] text-text-muted mb-2">{lit.authors.join(', ')} · {lit.year}</p>
              <p className="text-caption text-text-muted truncate">{lit.journal || lit.publisher}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {lit.keywords.slice(0, 3).map(kw => (
                  <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-text-muted">{kw}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-cream/30">
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-text-muted">标题</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-text-muted hidden sm:table-cell">作者</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-text-muted hidden md:table-cell">年份</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-text-muted hidden sm:table-cell">期刊</th>
                  <th className="text-center px-4 py-2.5 text-[11px] font-medium text-text-muted">状态</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lit => (
                  <tr key={lit.id} onClick={() => setSelectedId(lit.id)} className="border-b border-gray-50 hover:bg-cream/50 cursor-pointer transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-[13px] line-clamp-2">{lit.title}</span>
                      <span className="sm:hidden text-[10px] text-text-muted block mt-0.5">{lit.authors.join(', ')}</span>
                    </td>
                    <td className="px-4 py-2.5 text-text-muted text-[12px] hidden sm:table-cell">{lit.authors.join(', ')}</td>
                    <td className="px-4 py-2.5 text-text-muted text-[12px] hidden md:table-cell">{lit.year}</td>
                    <td className="px-4 py-2.5 text-text-muted text-[12px] hidden sm:table-cell truncate">{lit.journal || lit.publisher}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[lit.readingStatus]}`}>{statusLabels[lit.readingStatus]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={() => setSelectedId(null)} />
          <div className="modal-mobile-content relative z-50 animate-[slideInUp_250ms_ease-out] sm:animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-serif font-semibold text-text-primary">{selected.title}</h2>
                <p className="text-sm text-text-muted mt-1">{selected.authors.join(', ')} · {selected.year} · {selected.journal || selected.publisher}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selected.readingStatus]}`}>{statusLabels[selected.readingStatus]}</span>
                {selected.literatureType && <span className="px-2 py-1 rounded-full text-xs bg-cream text-text-muted">{selected.literatureType}</span>}
              </div>

              {selected.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.keywords.map(kw => <span key={kw} className="text-[11px] px-2 py-0.5 rounded-full bg-cream text-text-muted">{kw}</span>)}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {selected.researchQuestion && <div><span className="text-text-muted text-xs">研究问题</span><p className="text-text-secondary mt-0.5">{selected.researchQuestion}</p></div>}
                {selected.methodology && <div><span className="text-text-muted text-xs">研究方法</span><p className="text-text-secondary mt-0.5">{selected.methodology}</p></div>}
                {selected.coreFindings && <div className="sm:col-span-2"><span className="text-text-muted text-xs">核心结论</span><p className="text-text-secondary mt-0.5">{selected.coreFindings}</p></div>}
                {selected.innovation && <div><span className="text-text-muted text-xs">创新点</span><p className="text-text-secondary mt-0.5">{selected.innovation}</p></div>}
                {selected.limitations && <div><span className="text-text-muted text-xs">局限</span><p className="text-text-secondary mt-0.5">{selected.limitations}</p></div>}
                {selected.connectionToMyResearch && <div className="sm:col-span-2"><span className="text-text-muted text-xs">与本人研究的关系</span><p className="text-text-secondary mt-0.5">{selected.connectionToMyResearch}</p></div>}
              </div>

              <div className="text-caption text-text-muted pt-2 border-t border-gray-50">
                创建于 {formatRelative(selected.createdAt)} · 更新于 {formatRelative(selected.updatedAt)}
              </div>

              <div className="pt-2 border-t border-gray-50">
                <p className="text-xs text-text-muted mb-2">阅读状态</p>
                <div className="flex flex-wrap gap-1.5">
                  {(['to-read', 'skimming', 'reading', 'completed'] as ReadingStatus[]).map(s => (
                    <button key={s}
                      onClick={() => updateLiteratureStatus(selected.id, s)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        selected.readingStatus === s ? 'bg-warm-brown text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                      }`}>{statusLabels[s]}</button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-50">
                <button onClick={() => toggleStarLiterature(selected.id)} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${selected.starred ? 'bg-warm-light border-warm-brown/30 text-warm-brown' : 'border-gray-100 text-text-secondary hover:bg-cream'}`}>
                  {selected.starred ? '已收藏' : '收藏'}
                </button>
                <button onClick={() => { openEdit(selected); setSelectedId(null); }} className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-100 text-mist-blue hover:bg-mist-light/30 transition-colors">
                  <span className="flex items-center justify-center gap-1"><Edit3 size={13} />编辑</span>
                </button>
                <button onClick={() => { setDeleteTarget(selected.id); }} className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-100 text-rose-500 hover:bg-rose-50 transition-colors">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">新建文献</h2>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted block mb-1.5">标题 *</label>
                <input value={newLit.title} onChange={e => setNewLit(p => ({ ...p, title: e.target.value }))}
                  placeholder="输入文献标题" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">作者（逗号分隔）</label>
                <input value={newLit.authors} onChange={e => setNewLit(p => ({ ...p, authors: e.target.value }))}
                  placeholder="如：张三, 李四" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted block mb-1.5">年份</label>
                  <input value={newLit.year} onChange={e => setNewLit(p => ({ ...p, year: e.target.value }))}
                    placeholder="2024" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1.5">文献类型</label>
                  <select value={newLit.type} onChange={e => setNewLit(p => ({ ...p, type: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm">
                    <option>期刊论文</option><option>会议论文</option><option>书籍</option><option>学位论文</option><option>报告</option><option>其他</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">期刊/出版</label>
                <input value={newLit.journal} onChange={e => setNewLit(p => ({ ...p, journal: e.target.value }))}
                  placeholder="期刊或出版机构名称" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">DOI</label>
                <input value={newLit.doi} onChange={e => setNewLit(p => ({ ...p, doi: e.target.value }))}
                  placeholder="10.xxxx/xxxxx" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">关键词（逗号分隔）</label>
                <input value={newLit.keywords} onChange={e => setNewLit(p => ({ ...p, keywords: e.target.value }))}
                  placeholder="如：数字出版, 人工智能" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">摘要</label>
                <textarea value={newLit.abstract} onChange={e => setNewLit(p => ({ ...p, abstract: e.target.value }))}
                  placeholder="文献摘要" rows={3} className="w-full px-3 py-2 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={() => {
                if (!newLit.title.trim()) { toast('error', '请输入文献标题'); return; }
                addLiterature({
                  title: newLit.title, authors: newLit.authors.split(',').map(s => s.trim()).filter(Boolean),
                  year: parseInt(newLit.year) || new Date().getFullYear(), journal: newLit.journal,
                  doi: newLit.doi, researchQuestion: newLit.abstract,
                  keywords: newLit.keywords.split(',').map(s => s.trim()).filter(Boolean),
                  readingStatus: 'to-read' as ReadingStatus, starred: false,
                  literatureType: newLit.type, tags: [], linkedPaperIds: [],
                  linkedTheoryIds: [], linkedMethodIds: [], archived: false,
                } as any);
                toast('success', '文献已添加');
                setNewLit({ title: '', authors: '', year: new Date().getFullYear().toString(), journal: '', doi: '', abstract: '', keywords: '', link: '', type: '期刊论文' });
                setShowCreate(false);
              }} className="flex-1 px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors">创建</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && editLit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowEdit(false); setEditLit(null); }} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">编辑文献</h2>
              <button onClick={() => { setShowEdit(false); setEditLit(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted block mb-1.5">标题 *</label>
                <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">作者（逗号分隔）</label>
                <input value={editForm.authors} onChange={e => setEditForm(p => ({ ...p, authors: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted block mb-1.5">年份</label>
                  <input value={editForm.year} onChange={e => setEditForm(p => ({ ...p, year: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1.5">文献类型</label>
                  <select value={editForm.literatureType} onChange={e => setEditForm(p => ({ ...p, literatureType: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm">
                    <option>期刊论文</option><option>会议论文</option><option>书籍</option><option>学位论文</option><option>报告</option><option>其他</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">期刊/出版</label>
                <input value={editForm.journal} onChange={e => setEditForm(p => ({ ...p, journal: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">DOI</label>
                <input value={editForm.doi} onChange={e => setEditForm(p => ({ ...p, doi: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">关键词（逗号分隔）</label>
                <input value={editForm.keywords} onChange={e => setEditForm(p => ({ ...p, keywords: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">研究问题</label>
                <textarea value={editForm.researchQuestion} onChange={e => setEditForm(p => ({ ...p, researchQuestion: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowEdit(false); setEditLit(null); }} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={handleEdit} className="flex-1 px-4 py-2.5 rounded-xl bg-mist-blue text-white text-sm font-medium hover:bg-mist-blue/90 transition-colors disabled:opacity-40"
                disabled={!editForm.title.trim()}>保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) { deleteLiterature(deleteTarget); toast('success', '文献已删除'); setSelectedId(null); setDeleteTarget(null); } }}
        title="删除文献"
        message="删除后将无法恢复，该文献的阅读笔记等信息可能丢失。"
        itemName={literatures.find(l => l.id === deleteTarget)?.title}
      />
    </div>
  );
}
