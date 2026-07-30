import { useState } from 'react';
import { Languages, Check, Flame, Volume2 } from 'lucide-react';
import { useStore } from '../../store';

const languageLabels: Record<string, string> = { 'english': '英语', 'thai': '泰语', 'korean': '韩语' };

export default function LanguagesPage() {
  const { learningTasks, toggleLearningTask } = useStore();
  const [lang, setLang] = useState('english');

  const langTasks = learningTasks.filter(t => t.language === lang);
  const todayTasks = langTasks.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.date === today;
  });
  const streak = 12; // mock

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">多语种学习</h1>
        <p className="text-body-sm text-text-muted mt-1">连续 {streak} 天</p>
      </div>

      {/* Language tabs */}
      <div className="flex overflow-x-auto gap-1.5 mb-4 sm:mb-5 scrollbar-thin">
        {Object.entries(languageLabels).map(([key, label]) => (
          <button key={key} onClick={() => setLang(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${lang === key ? 'bg-warm-brown text-white' : 'bg-white border border-gray-100 text-text-secondary hover:bg-cream'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 sm:mb-5">
        <div className="card !p-3 sm:!p-4 text-center">
          <Flame size={20} className="mx-auto text-warm-brown mb-1" />
          <p className="text-lg sm:text-xl font-semibold text-text-primary">{streak}</p>
          <p className="text-caption text-text-muted">连续学习</p>
        </div>
        <div className="card !p-3 sm:!p-4 text-center">
          <Volume2 size={20} className="mx-auto text-mist-purple mb-1" />
          <p className="text-lg sm:text-xl font-semibold text-text-primary">{langTasks.filter(t => t.completed).length}</p>
          <p className="text-caption text-text-muted">已完成</p>
        </div>
        <div className="card !p-3 sm:!p-4 text-center">
          <Languages size={20} className="mx-auto text-mist-blue mb-1" />
          <p className="text-lg sm:text-xl font-semibold text-text-primary">{langTasks.length}</p>
          <p className="text-caption text-text-muted">总任务</p>
        </div>
        <div className="card !p-3 sm:!p-4 text-center">
          <Check size={20} className="mx-auto text-mint-green mb-1" />
          <p className="text-lg sm:text-xl font-semibold text-text-primary">{todayTasks.filter(t => t.completed).length}</p>
          <p className="text-caption text-text-muted">今日完成</p>
        </div>
      </div>

      {/* Today tasks */}
      <div className="card mb-4 sm:mb-5">
        <h3 className="section-title !text-sm">今日任务</h3>
        {todayTasks.length === 0 ? (
          <p className="text-body-sm text-text-muted text-center py-4">今日暂无学习任务</p>
        ) : (
          <div className="space-y-1.5">
            {todayTasks.map(task => (
              <div key={task.id}
                onClick={() => toggleLearningTask(task.id)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cream cursor-pointer transition-colors">
                <button className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  task.completed ? 'bg-warm-brown border-warm-brown' : 'border-gray-200'
                }`}>
                  {task.completed && <Check size={11} className="text-white" strokeWidth={3} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] sm:text-sm ${task.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>{task.title}</p>
                  {task.note && <p className="text-caption text-text-muted">{task.note}</p>}
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  task.type === 'listening' ? 'bg-blue-50 text-mist-blue' :
                  task.type === 'speaking' ? 'bg-warm-light text-warm-brown' :
                  'bg-mist-light/30 text-mist-purple'
                }`}>
                  {task.type === 'listening' ? '听力' : task.type === 'speaking' ? '口语' : '阅读'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All tasks */}
      <div className="card">
        <h3 className="section-title !text-sm">所有任务</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {langTasks.map(task => (
            <div key={task.id} onClick={() => toggleLearningTask(task.id)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cream cursor-pointer transition-colors">
              <button className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                task.completed ? 'bg-warm-brown border-warm-brown' : 'border-gray-200'
              }`}>
                {task.completed && <Check size={10} className="text-white" strokeWidth={3} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] sm:text-[13px] ${task.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>{task.title}</p>
                {task.date && <p className="text-[10px] text-text-muted">{task.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
