import { useState, useRef } from 'react';
import { Settings, User, Palette, Database, Trash2, Monitor, Smartphone, Download, Upload } from 'lucide-react';
import { useStore } from '../store';

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData, exportData, importData } = useStore();
  const [tab, setTab] = useState<'profile' | 'display' | 'data'>('profile');
  const [resetConfirm, setResetConfirm] = useState(false);
  const [importMsg, setImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = exportData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `research-workbench-backup-${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('导出失败，请重试');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const payload = JSON.parse(ev.target?.result as string);
        if (!payload.app || !payload.data) {
          setImportMsg({ type: 'error', text: '无效的备份文件格式' });
          setTimeout(() => setImportMsg(null), 3000);
          return;
        }
        if (!window.confirm('导入将覆盖当前设备上的所有数据（目标、任务、打卡记录等），确定继续吗？')) return;
        importData(payload);
        setImportMsg({ type: 'success', text: '数据导入成功！' });
        setTimeout(() => setImportMsg(null), 3000);
      } catch {
        setImportMsg({ type: 'error', text: '文件解析失败，请检查是否为有效的 JSON 备份文件' });
        setTimeout(() => setImportMsg(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">设置</h1>
        <p className="text-body-sm text-text-muted mt-1">个人偏好与数据管理</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1.5 mb-5 sm:mb-6 border-b border-gray-100 pb-0 scrollbar-thin">
        {[
          { key: 'profile' as const, label: '个人信息', icon: User },
          { key: 'display' as const, label: '显示偏好', icon: Palette },
          { key: 'data' as const, label: '数据管理', icon: Database },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 pb-2.5 px-2 sm:px-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.key ? 'border-warm-brown text-warm-brown' : 'border-transparent text-text-muted'}`}>
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="space-y-4 sm:space-y-5">
          <div className="card">
            <h3 className="section-title !text-sm">个人基本信息</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs text-text-muted block mb-1.5">姓名</label>
                <input defaultValue="研究员" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">邮箱</label>
                <input defaultValue="researcher@example.com" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">学校/机构</label>
                <input defaultValue="" placeholder="请输入机构名称" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1.5">研究领域</label>
                <input defaultValue="出版学" className="w-full h-10 px-3 rounded-xl bg-cream border border-gray-100 text-text-primary focus:border-warm-brown/30 focus:outline-none text-sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'display' && (
        <div className="space-y-4 sm:space-y-5">
          <div className="card">
            <h3 className="section-title !text-sm">侧边栏</h3>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-text-primary">默认折叠</p>
                <p className="text-caption text-text-muted">启动时自动折叠侧边栏</p>
              </div>
              <button
                onClick={() => updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.sidebarCollapsed ? 'bg-warm-brown' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.sidebarCollapsed ? 'left-[22px]' : 'left-[2px]'}`} />
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title !text-sm">字体大小</h3>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-text-primary">正文字号</p>
                <p className="text-caption text-text-muted">当前: 14px</p>
              </div>
              <div className="flex gap-2">
                {[13, 14, 15, 16].map(s => (
                  <button key={s} className={`px-3 py-1 rounded-lg text-xs font-medium ${s === 14 ? 'bg-warm-brown text-white' : 'bg-cream text-text-muted'}`}>{s}px</button>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title !text-sm">设备预览提示</h3>
            <div className="flex items-center gap-4 py-2 text-sm text-text-secondary">
              <Monitor size={18} className="text-text-muted" />
              <span>桌面端优先设计（1440px）</span>
            </div>
            <div className="flex items-center gap-4 py-2 text-sm text-text-secondary">
              <Smartphone size={18} className="text-text-muted" />
              <span>移动端响应式已适配</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'data' && (
        <div className="space-y-4 sm:space-y-5">
          <div className="card">
            <h3 className="section-title !text-sm">数据存储</h3>
            <p className="text-sm text-text-secondary mb-2">数据保存在浏览器 localStorage 中，不会自动上传到服务器。</p>
            <p className="text-caption text-text-muted">建议定期导出备份。部署后手机与电脑数据不共享，可通过导出/导入功能实现数据迁移。</p>
          </div>

          <div className="card bg-cream/60 border border-amber-100">
            <h3 className="section-title !text-sm flex items-center gap-1.5">
              <Smartphone size={15} className="text-amber-500" />
              手机端使用提示
            </h3>
            <p className="text-sm text-text-secondary mb-1.5">
              在手机浏览器打开网址后，点击「<strong>分享</strong>」→「<strong>添加到主屏幕</strong>」，即可像 App 一样全屏使用。
            </p>
            <p className="text-caption text-text-muted">
              数据保存在本机浏览器中，清缓存会导致数据丢失，请定期导出备份。
            </p>
          </div>

          {importMsg && (
            <div className={`px-4 py-3 rounded-xl text-sm font-medium ${importMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
              {importMsg.text}
            </div>
          )}

          <div className="card">
            <h3 className="section-title !text-sm">数据操作</h3>
            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="w-full py-2.5 rounded-xl border border-gray-100 text-sm text-text-secondary hover:bg-cream transition-colors flex items-center justify-center gap-1.5">
                <Download size={14} /> 导出数据
              </button>
              <button
                onClick={handleImportClick}
                className="w-full py-2.5 rounded-xl border border-gray-100 text-sm text-text-secondary hover:bg-cream transition-colors flex items-center justify-center gap-1.5">
                <Upload size={14} /> 导入数据
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleFileChange}
                className="hidden"
              />

              {!resetConfirm ? (
                <button
                  onClick={() => setResetConfirm(true)}
                  className="w-full py-2.5 rounded-xl border border-rose-200 text-sm text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5">
                  <Trash2 size={14} /> 重置所有数据
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { resetAllData(); setResetConfirm(false); }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-medium"
                  >
                    确认重置
                  </button>
                  <button
                    onClick={() => setResetConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-100 text-sm text-text-secondary"
                  >
                    取消
                  </button>
                </div>
              )}
              <p className="text-caption text-text-muted">重置将清除所有数据并恢复为默认状态，此操作不可撤销。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
