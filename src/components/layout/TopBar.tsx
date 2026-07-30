import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, User, Timer, X, Menu, Sun, Moon } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useStore } from '../../store';

const quickCreateItems = [
  { label: '新建文献', path: '/academic/literature' },
  { label: '新建理论卡片', path: '/academic/theory' },
  { label: '新建方法卡片', path: '/academic/method' },
  { label: '新建论文项目', path: '/papers/short' },
  { label: '新建研究想法', path: '/papers/ideas' },
  { label: '新建政策文件', path: '/industry/policies' },
  { label: '新建案例', path: '/industry/cases' },
  { label: '新建读书笔记', path: '/industry/notes' },
  { label: '新建学习任务', path: '/calendar' },
  { label: '新建饮食记录', path: '/learning/health' },
];

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const navigate = useNavigate();
  const { tasks } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const today = format(new Date(), 'yyyy年M月d日 EEEE', { locale: zhCN });
  const urgentTasks = tasks.filter(t => t.status !== 'completed').slice(0, 3);

  return (
    <>
      <header className="h-14 md:h-16 bg-white/90 backdrop-blur-lg border-b border-gray-100 flex items-center justify-between px-3 md:px-6 sticky top-0 z-30">
        {/* Left: Mobile hamburger + greeting */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 text-text-primary"
            aria-label="打开菜单"
          >
            <Menu size={20} />
          </button>
          <span className="hidden sm:inline text-sm text-text-muted truncate">{today}</span>
          <span className="sm:hidden text-xs text-text-muted truncate">{format(new Date(), 'M月d日', { locale: zhCN })}</span>
        </div>

        {/* Center: Search (desktop always, mobile toggle) */}
        <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="搜索文献、笔记、项目..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                  navigate(`/library?q=${encodeURIComponent(e.target.value)}`);
                }
              }}
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-cream text-sm text-text-primary placeholder:text-text-muted border border-transparent focus:border-warm-brown/20 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Mobile search toggle */}
        <button
          onClick={() => setSearchOpen(true)}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 text-text-muted"
        >
          <Search size={18} />
        </button>

        {/* Right: actions */}
        <div className="flex items-center gap-0.5 md:gap-1.5">
          {/* Quick Create */}
          <div className="relative">
            <button
              onClick={() => setQuickCreateOpen(!quickCreateOpen)}
              className="p-2 md:px-3 md:py-1.5 rounded-xl bg-warm-brown text-white text-sm font-medium hover:bg-warm-brown/90 transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">快速新建</span>
            </button>

            {quickCreateOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setQuickCreateOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30">
                  {quickCreateItems.map(item => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setQuickCreateOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-cream hover:text-text-primary transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Focus Mode */}
          <button
            onClick={() => navigate('/calendar')}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-cream text-text-muted transition-colors"
            title="专注模式"
          >
            <Timer size={17} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifyOpen(!notifyOpen)}
              className="p-1.5 rounded-lg hover:bg-cream text-text-muted transition-colors"
            >
              <Bell size={17} />
              {urgentTasks.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-warm-brown text-[10px] text-white flex items-center justify-center font-medium">
                  {urgentTasks.length}
                </span>
              )}
            </button>

            {notifyOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setNotifyOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-30">
                  <h3 className="text-sm font-medium text-text-primary mb-3">即将到期任务</h3>
                  {urgentTasks.length === 0 ? (
                    <p className="text-sm text-text-muted">暂无即将到期任务</p>
                  ) : (
                    <div className="space-y-2">
                      {urgentTasks.map(task => (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-cream rounded-lg p-2 -mx-2"
                          onClick={() => { navigate('/calendar'); setNotifyOpen(false); }}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${task.priority === 'urgent' ? 'bg-rose-400' : task.priority === 'high' ? 'bg-warm-brown' : 'bg-mist-blue'}`} />
                          <span className="text-text-secondary truncate">{task.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User */}
          <button
            onClick={() => navigate('/settings')}
            className="ml-1 w-8 h-8 rounded-full bg-warm-light text-warm-brown flex items-center justify-center text-xs font-medium border border-warm-brown/20"
          >
            <User size={14} />
          </button>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="sm:hidden fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center gap-3 h-14 px-4 border-b border-gray-100">
            <Search size={16} className="text-text-muted" />
            <input
              autoFocus
              type="text"
              placeholder="搜索文献、笔记、项目..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/library?q=${encodeURIComponent(searchQuery)}`);
                  setSearchOpen(false);
                }
              }}
              className="flex-1 h-full bg-transparent text-base text-text-primary placeholder:text-text-muted outline-none"
            />
            <button onClick={() => setSearchOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {searchQuery.trim() ? (
              <button
                onClick={() => {
                  navigate(`/library?q=${encodeURIComponent(searchQuery)}`);
                  setSearchOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl bg-cream text-sm text-warm-brown font-medium"
              >
                在全局资料库中搜索「{searchQuery}」
              </button>
            ) : (
              <p className="text-text-muted text-sm text-center mt-12">输入关键词搜索</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
