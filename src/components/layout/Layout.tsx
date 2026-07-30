import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import QuickCapture from '../mobile/QuickCapture';
import { useStore } from '../../store';
import { Home, Play, BookOpen, FileText, Briefcase, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const mobileTabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/today', label: '今日', icon: Play },
  { path: '/academic/literature', label: '学术', icon: BookOpen },
  { path: '/papers/short', label: '论文', icon: FileText },
  { path: '/calendar', label: '任务', icon: Calendar },
  { path: '/review', label: '复盘', icon: TrendingUp },
];

export default function Layout() {
  const { settings } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={`hidden md:block flex-shrink-0 transition-all duration-300 ${settings.sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'}`}>
        <Sidebar mobile={false} collapsed={settings.sidebarCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative z-50 w-[268px] flex-shrink-0 animate-[slideInLeft_250ms_ease-out]">
            <Sidebar mobile={true} collapsed={false} onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="page-container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 md:pb-6">
            <Outlet />
          </div>
        </main>

        {/* Mobile Quick Capture FAB */}
        <QuickCapture />

        {/* Mobile Bottom Tab Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 z-30 safe-area-bottom">
          <div className="flex items-center justify-around h-14">
            {mobileTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path);
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`flex flex-col items-center justify-center min-w-0 px-2 py-0.5 transition-colors ${
                    isActive ? 'text-warm-brown' : 'text-text-muted'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className="text-[10px] mt-0.5 font-medium truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
