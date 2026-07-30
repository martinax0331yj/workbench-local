import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import {
  LayoutDashboard, Play, Star, BookOpen, FileText, Briefcase,
  TrendingUp, CalendarDays, Library, Settings, ChevronLeft,
  ChevronDown, ChevronUp, X, Target, RefreshCw, BarChart3,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  mobile?: boolean;
  collapsed?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile = false, collapsed = false, onClose }: SidebarProps) {
  const { settings, updateSettings } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    academic: true, papers: false, industry: false, learning: false,
  });

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (paths: string[]) => paths.some(p => location.pathname.startsWith(p));

  const toggleGroup = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navItem = (path: string, label: string, Icon: typeof LayoutDashboard) => (
    <button
      key={path}
      onClick={() => { navigate(path); onClose?.(); }}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
        isActive(path)
          ? 'bg-warm-brown/8 text-warm-brown font-medium'
          : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
      } ${collapsed ? 'justify-center px-2' : ''}`}
    >
      <Icon size={18} strokeWidth={isActive(path) ? 2 : 1.5} />
      {!collapsed && <span>{label}</span>}
    </button>
  );

  // If collapsed, show only primary navigation
  if (collapsed) {
    return (
      <div className="h-full bg-white border-r border-gray-100 flex flex-col py-3 px-2 space-y-1">
        <button onClick={() => navigate('/')} className="flex items-center justify-center h-10 mb-4">
          <div className="w-8 h-8 rounded-xl bg-warm-brown flex items-center justify-center">
            <Star size={18} className="text-white" />
          </div>
        </button>
        {[{ path: '/', icon: LayoutDashboard }, { path: '/today', icon: Play }, { path: '/review', icon: RefreshCw }].map(t =>
          navItem(t.path, '', t.icon)
        )}
      </div>
    );
  }

  return (
    <div className={`h-full bg-white border-r border-gray-100 flex flex-col ${mobile ? 'rounded-r-xl' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-50">
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-warm-brown flex items-center justify-center">
            <Star size={18} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-text-primary">研究台</p>
            <p className="text-[10px] text-text-muted">{settings.userName}</p>
          </div>
        </button>
        {mobile ? (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-50">
            <X size={16} className="text-text-muted" />
          </button>
        ) : (
          <button onClick={() => updateSettings({ sidebarCollapsed: true })} className="p-1.5 rounded-lg hover:bg-gray-50">
            <ChevronLeft size={16} className="text-text-muted" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {/* === 核心 === */}
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-3 py-2">核心</p>
        {navItem('/', '首页', LayoutDashboard)}
        {navItem('/today', '今日执行', Play)}
        {navItem('/review', '复盘', RefreshCw)}
        {navItem('/calendar', '任务日历', CalendarDays)}
        {navItem('/library', '全局资料库', Library)}

        {/* === 学术研究 === */}
        <GroupSection
          label="学术研究"
          paths={['/academic']}
          expanded={expanded.academic || isGroupActive(['/academic'])}
          onToggle={() => toggleGroup('academic')}
        >
          {navItem('/academic/literature', '文献库', BookOpen)}
          {navItem('/academic/theory', '理论库', BookOpen)}
          {navItem('/academic/method', '方法库', BookOpen)}
        </GroupSection>

        {/* === 论文项目 === */}
        <GroupSection
          label="论文项目"
          paths={['/papers']}
          expanded={expanded.papers || isGroupActive(['/papers'])}
          onToggle={() => toggleGroup('papers')}
        >
          {navItem('/papers/short', '小论文', FileText)}
          {navItem('/papers/thesis', '毕业论文', FileText)}
          {navItem('/papers/ideas', '选题池', FileText)}
        </GroupSection>

        {/* === 行业研究 === */}
        <GroupSection
          label="行业研究"
          paths={['/industry']}
          expanded={expanded.industry || isGroupActive(['/industry'])}
          onToggle={() => toggleGroup('industry')}
        >
          {navItem('/industry/policies', '政策库', Briefcase)}
          {navItem('/industry/cases', '案例库', Briefcase)}
          {navItem('/industry/reports', '报告写作', Briefcase)}
          {navItem('/industry/notes', '阅读笔记', Briefcase)}
        </GroupSection>

        {/* === 学习成长 === */}
        <GroupSection
          label="学习成长"
          paths={['/learning']}
          expanded={expanded.learning || isGroupActive(['/learning'])}
          onToggle={() => toggleGroup('learning')}
        >
          {navItem('/learning/finance', '财务规划', TrendingUp)}
          {navItem('/learning/languages', '多语种', TrendingUp)}
          {navItem('/learning/ecommerce', '电商调研', TrendingUp)}
          {navItem('/learning/wechat', '公众号', TrendingUp)}
          {navItem('/learning/video', '视频制作', TrendingUp)}
          {navItem('/learning/health', '健康管理', TrendingUp)}
        </GroupSection>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-50">
        {navItem('/settings', '设置', Settings)}
      </div>
    </div>
  );
}

function GroupSection({ label, expanded, onToggle, children, paths }: {
  label: string;
  paths: string[];
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const loc = useLocation();
  const isActive = paths.some(p => loc.pathname.startsWith(p));
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
          isActive ? 'text-warm-brown' : 'text-text-muted'
        } hover:text-text-primary`}
      >
        <span className="flex-1 text-left">{label}</span>
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {expanded && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}
