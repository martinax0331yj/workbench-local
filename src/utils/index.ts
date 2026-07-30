import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { IdeaStatus, ReadingStatus } from '../types';

export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr), 'M月d日', { locale: zhCN });
}

export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: zhCN });
}

export function getIdeaStatusLabel(status: IdeaStatus): string {
  const map: Record<IdeaStatus, string> = {
    inspiration: '灵感',
    validating: '待验证',
    feasible: '可推进',
    converted: '已转化为项目',
    paused: '暂停',
    abandoned: '放弃',
  };
  return map[status] || status;
}

export function getReadingStatusLabel(status: ReadingStatus): string {
  const map: Record<ReadingStatus, string> = {
    'to-read': '待读',
    'skimming': '略读中',
    'reading': '精读中',
    'completed': '已完成',
  };
  return map[status] || status;
}
