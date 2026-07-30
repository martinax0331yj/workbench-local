import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Database, BookOpen, FileText, Briefcase, Lightbulb, BookMarked } from 'lucide-react';
import { useStore } from '../store';
import { formatDateShort } from '../utils';

export default function GlobalLibrary() {
  const { literatures, theories, methods, policies, cases, readingNotes, shortPapers, researchIdeas } = useStore();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [module, setModule] = useState<string>('all');

  const allResults = [
    ...(module === 'all' || module === 'literature' ? literatures.map(l => ({ id: l.id, type: '文献' as const, title: l.title, subtitle: l.authors.join(', '), icon: BookOpen, color: 'text-mist-blue', date: l.updatedAt })) : []),
    ...(module === 'all' || module === 'theory' ? theories.map(t => ({ id: t.id, type: '理论' as const, title: t.nameZh, subtitle: t.proposer, icon: Lightbulb, color: 'text-warm-brown', date: t.updatedAt })) : []),
    ...(module === 'all' || module === 'method' ? methods.map(m => ({ id: m.id, type: '方法' as const, title: m.nameZh, subtitle: m.type || '', icon: Lightbulb, color: 'text-mist-purple', date: m.updatedAt })) : []),
    ...(module === 'all' || module === 'policy' ? policies.map(p => ({ id: p.id, type: '政策' as const, title: p.name, subtitle: p.issuingBody, icon: Briefcase, color: 'text-warm-brown', date: p.updatedAt })) : []),
    ...(module === 'all' || module === 'case' ? cases.map(c => ({ id: c.id, type: '案例' as const, title: c.name, subtitle: c.industry, icon: Briefcase, color: 'text-mist-blue', date: c.updatedAt })) : []),
    ...(module === 'all' || module === 'note' ? readingNotes.map(n => ({ id: n.id, type: '读书笔记' as const, title: n.bookTitle, subtitle: n.author, icon: BookMarked, color: 'text-mint-green', date: n.updatedAt })) : []),
    ...(module === 'all' || module === 'paper' ? shortPapers.map(p => ({ id: p.id, type: '论文' as const, title: p.title, subtitle: p.type, icon: FileText, color: 'text-mist-purple', date: p.updatedAt })) : []),
    ...(module === 'all' || module === 'idea' ? researchIdeas.map(i => ({ id: i.id, type: '研究想法' as const, title: i.title, subtitle: i.triggerSource, icon: Lightbulb, color: 'text-warm-brown', date: i.updatedAt })) : []),
  ];

  const filtered = query.trim()
    ? allResults.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || (r.subtitle && r.subtitle.toLowerCase().includes(query.toLowerCase())))
    : allResults;

  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const modules = [
    { key: 'all', label: '全部' },
    { key: 'literature', label: '文献' },
    { key: 'theory', label: '理论' },
    { key: 'method', label: '方法' },
    { key: 'paper', label: '论文' },
    { key: 'idea', label: '研究想法' },
    { key: 'policy', label: '政策' },
    { key: 'case', label: '案例' },
    { key: 'note', label: '读书笔记' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">全局资料库</h1>
        <p className="text-body-sm text-text-muted mt-1">跨模块搜索与资料检索</p>
      </div>

      <div className="relative mb-3 sm:mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="搜索标题、作者、标签..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-gray-100 text-sm focus:border-warm-brown/30 focus:outline-none"
        />
      </div>

      {/* Module tabs */}
      <div className="flex overflow-x-auto gap-1.5 mb-4 sm:mb-5 scrollbar-thin -mx-2 px-2 sm:mx-0 sm:px-0">
        {modules.map(m => (
          <button key={m.key} onClick={() => setModule(m.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${module === m.key ? 'bg-warm-brown text-white' : 'bg-white border border-gray-100 text-text-secondary hover:bg-cream'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Database size={40} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">未找到匹配结果</p>
          <p className="text-caption text-text-muted mt-1">试试其他关键词</p>
        </div>
      ) : (
        <>
          <p className="text-caption text-text-muted mb-3">{filtered.length} 条结果</p>
          <div className="space-y-1.5">
            {filtered.map(r => (
              <div key={r.id} className="card !p-3 sm:!p-4 flex items-center gap-3 hover:border-warm-brown/20 cursor-pointer transition-colors">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  r.type === '文献' ? 'bg-blue-50' :
                  r.type === '理论' ? 'bg-orange-50' :
                  r.type === '方法' ? 'bg-purple-50' :
                  r.type === '政策' ? 'bg-orange-50' :
                  r.type === '案例' ? 'bg-blue-50' :
                  r.type === '读书笔记' ? 'bg-green-50' :
                  r.type === '论文' ? 'bg-purple-50' :
                  'bg-orange-50'
                }`}>
                  <r.icon size={15} className={r.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] sm:text-sm font-medium text-text-primary truncate">{r.title}</p>
                  <p className="text-caption text-text-muted">{r.subtitle}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0 ml-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-text-muted">{r.type}</span>
                  <span className="text-[10px] text-text-muted hidden sm:inline">{formatDateShort(r.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
