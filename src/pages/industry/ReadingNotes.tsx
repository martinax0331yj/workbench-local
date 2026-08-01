import { useState } from 'react';
import { useStore } from '../../store';
import { formatRelative } from '../../utils';
import { BookOpen, Plus, X, ChevronRight, FileText, Quote, Search, Bookmark, Tag } from 'lucide-react';

const readingStatuses: Record<string, string> = { reading: '阅读中', completed: '已完成', 'to-read': '待阅读' };
const readingColors: Record<string, string> = { reading: 'bg-blue-50 text-mist-blue', completed: 'bg-green-50 text-mint-green', 'to-read': 'bg-gray-50 text-text-muted' };

export default function ReadingNotes() {
  const { readingNotes, addReadingNote, updateReadingNote, deleteReadingNote } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    bookTitle: '', author: '', publishInfo: '', readingDate: '', readingStatus: 'reading',
    coreQuestion: '', coreIdeasText: '', keyConceptsText: '',
    quotableContent: '', connections: '', reflections: '',
    applicableScenarios: '', followUpReadings: '', mode: '',
  });

  const resetForm = () => {
    setForm({ bookTitle: '', author: '', publishInfo: '', readingDate: '', readingStatus: 'reading', coreQuestion: '', coreIdeasText: '', keyConceptsText: '', quotableContent: '', connections: '', reflections: '', applicableScenarios: '', followUpReadings: '', mode: '' });
    setShowModal(false); setEditingId(null);
  };
  const setF = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const openEdit = (n: any) => {
    setForm({
      bookTitle: n.bookTitle || '', author: n.author, publishInfo: n.publishInfo || '',
      readingDate: n.readingDate || '', readingStatus: n.readingStatus || 'reading',
      coreQuestion: n.coreQuestion || '', coreIdeasText: (n.coreIdeas || []).join('\n'),
      keyConceptsText: (n.keyConcepts || []).join('\n'), quotableContent: n.quotableContent || '',
      connections: n.connections || '', reflections: n.reflections || '',
      applicableScenarios: n.applicableScenarios || '', followUpReadings: n.followUpReadings || '',
      mode: n.mode || '',
    });
    setEditingId(n.id); setShowModal(true);
  };

  const handleSave = () => {
    if (!form.bookTitle.trim() || !form.author.trim()) return;
    const base: Record<string, any> = {
      bookTitle: form.bookTitle.trim(), author: form.author.trim(),
      publishInfo: form.publishInfo.trim(), readingDate: form.readingDate,
      readingStatus: form.readingStatus, coreQuestion: form.coreQuestion.trim(),
      coreIdeas: form.coreIdeasText.split('\n').map(s => s.trim()).filter(Boolean),
      keyConcepts: form.keyConceptsText.split('\n').map(s => s.trim()).filter(Boolean),
      quotableContent: form.quotableContent.trim(), connections: form.connections.trim(),
      reflections: form.reflections.trim(), applicableScenarios: form.applicableScenarios.trim(),
      followUpReadings: form.followUpReadings.trim(), mode: form.mode.trim(),
    };
    editingId ? updateReadingNote(editingId, base) : addReadingNote({ ...base, linkedPaperIds: [], linkedReportIds: [], linkedTheoryIds: [] } as any);
    resetForm();
  };

  const handleDelete = (id: string) => { if (confirm('确认删除？')) { deleteReadingNote(id); if (selectedId === id) setSelectedId(null); } };

  const filtered = search.trim() ? readingNotes.filter((n: any) => n.bookTitle?.includes(search) || n.author?.includes(search)) : readingNotes;
  const selected = readingNotes.find((n: any) => n.id === selectedId);

  return (
    <div>
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div><h1 className="page-title">阅读笔记</h1><p className="text-body-sm text-text-muted mt-1">记录关键阅读内容、反思与后续计划</p></div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="self-start inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors"><Plus size={15} /> 添加笔记</button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索书名、作者..." className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={selected ? 'hidden lg:block' : ''}>
          {filtered.length === 0 ? (
            <div className="card text-center py-12"><BookOpen size={40} className="text-text-muted mx-auto mb-3 opacity-40" /><p className="text-body-sm text-text-muted">暂无阅读笔记</p></div>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-0.5 scrollbar-thin">
              {filtered.map((n: any) => (
                <div key={n.id} onClick={() => setSelectedId(n.id)} className={`card !p-3 sm:!p-4 cursor-pointer transition-all ${selectedId === n.id ? 'ring-2 ring-warm-brown/20 border-warm-brown/30' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${readingColors[n.readingStatus] || 'bg-gray-50 text-text-muted'}`}>{readingStatuses[n.readingStatus] || n.readingStatus}</span>
                        {n.mode && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-warm-brown font-medium">{n.mode}</span>}
                      </div>
                      <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{n.bookTitle}</h3>
                    </div>
                    <ChevronRight size={14} className="text-text-muted mt-1 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-text-muted">{n.author}{n.publishInfo ? ` · ${n.publishInfo}` : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="card !p-4 sm:!p-5 max-h-[70vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-serif font-semibold text-text-primary">{selected.bookTitle}</h2>
                <p className="text-xs text-text-muted mt-1">{selected.author}{selected.publishInfo ? ` · ${selected.publishInfo}` : ''}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${readingColors[selected.readingStatus] || 'bg-gray-50 text-text-muted'}`}>{readingStatuses[selected.readingStatus] || selected.readingStatus}</span>
                  {selected.mode && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-warm-brown font-medium">{selected.mode}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(selected)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"><FileText size={14} /></button>
                <button onClick={() => handleDelete(selected.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500"><X size={14} /></button>
              </div>
            </div>

            <div className="space-y-4">
              {selected.coreQuestion && <Bl label="核心问题" text={selected.coreQuestion} />}
              {(selected.coreIdeas || []).length > 0 && <Sec icon={Bookmark} title="核心观点" items={selected.coreIdeas!} />}
              {(selected.keyConcepts || []).length > 0 && <Sec icon={Tag} title="关键概念" items={selected.keyConcepts!} />}
              {selected.quotableContent && <Bl icon={Quote} label="可引用内容" text={selected.quotableContent} />}
              {selected.connections && <Bl label="连接" text={selected.connections} />}
              {selected.reflections && <Bl label="反思" text={selected.reflections} />}
              {selected.applicableScenarios && <Bl label="应用场景" text={selected.applicableScenarios} />}
              {selected.followUpReadings && <Bl label="后续阅读" text={selected.followUpReadings} />}
            </div>
            <p className="text-[10px] text-text-muted mt-4 pt-3 border-t border-gray-50">创建于 {formatRelative(selected.createdAt)}</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-mobile">
          <div className="fixed inset-0 bg-black/20 sm:bg-black/30 z-40" onClick={resetForm} />
          <div className="modal-mobile-content relative z-50">
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-serif font-semibold text-text-primary">{editingId ? '编辑笔记' : '添加笔记'}</h2><button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} className="text-text-muted" /></button></div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <F label="书名/标题 *" v={form.bookTitle} onChange={v => setF('bookTitle', v)} ph="书籍或文章名称" />
              <div className="grid grid-cols-2 gap-3">
                <F label="作者 *" v={form.author} onChange={v => setF('author', v)} ph="作者姓名" />
                <F label="出版信息" v={form.publishInfo} onChange={v => setF('publishInfo', v)} ph="出版社、年份" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-text-primary mb-1.5">阅读状态</label><select value={form.readingStatus} onChange={e => setF('readingStatus', e.target.value)} className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none bg-white"><option value="reading">阅读中</option><option value="completed">已完成</option><option value="to-read">待阅读</option></select></div>
                <F label="阅读日期" v={form.readingDate} onChange={v => setF('readingDate', v)} ph="YYYY-MM-DD" />
              </div>
              <F label="核心问题" v={form.coreQuestion} onChange={v => setF('coreQuestion', v)} ph="这本书回答了什么核心问题" />
              <F label="核心观点（每行一条）" v={form.coreIdeasText} onChange={v => setF('coreIdeasText', v)} ph={`核心论点一\n核心论点二\n...`} ta />
              <F label="关键概念（每行一条）" v={form.keyConceptsText} onChange={v => setF('keyConceptsText', v)} ph={`概念一\n概念二\n...`} ta />
              <F label="可引用内容" v={form.quotableContent} onChange={v => setF('quotableContent', v)} ph="值得引用的段落" ta />
              <F label="与其他内容的连接" v={form.connections} onChange={v => setF('connections', v)} ph="与你的研究有何关联" ta />
              <F label="反思" v={form.reflections} onChange={v => setF('reflections', v)} ph="你的思考与评论" ta />
              <F label="应用场景" v={form.applicableScenarios} onChange={v => setF('applicableScenarios', v)} ph="可以应用到哪些场景" />
              <F label="后续阅读" v={form.followUpReadings} onChange={v => setF('followUpReadings', v)} ph="接下来要读什么" />
              <F label="阅读方式" v={form.mode} onChange={v => setF('mode', v)} ph="如：精读、略读、检索式阅读" />
              <button onClick={handleSave} disabled={!form.bookTitle.trim() || !form.author.trim()} className="w-full py-2.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors disabled:opacity-40">{editingId ? '保存修改' : '添加笔记'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Sec({ icon: Icon, title, items }: { icon: any; title: string; items: string[] }) {
  return <div><p className="text-xs text-text-muted font-medium mb-1.5 flex items-center gap-1"><Icon size={12} /> {title}</p><ul className="space-y-1">{items.map((item, i) => <li key={i} className="text-[13px] text-text-secondary pl-4 border-l-2 border-cream py-0.5">{item}</li>)}</ul></div>;
}

function Bl({ icon: Icon, label, text }: { icon?: any; label: string; text: string }) {
  return <div><p className="text-xs text-text-muted font-medium mb-0.5 flex items-center gap-1">{Icon && <Icon size={12} />}{label}</p><p className="text-[13px] text-text-secondary whitespace-pre-wrap">{text}</p></div>;
}

function F({ label, v, onChange, ph, ta }: { label: string; v: string; onChange: (v: string) => void; ph: string; ta?: boolean }) {
  const cls = 'w-full px-3.5 rounded-xl border border-gray-200 text-sm focus:border-warm-brown/30 focus:outline-none';
  return <div><label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>{ta ? <textarea value={v} onChange={e => onChange(e.target.value)} placeholder={ph} rows={2} className={`${cls} py-2.5 resize-none`} /> : <input value={v} onChange={e => onChange(e.target.value)} placeholder={ph} className={`${cls} h-11`} />}</div>;
}
