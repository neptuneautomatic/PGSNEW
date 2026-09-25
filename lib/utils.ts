import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(sinceDateString?: string): string {
  if (!sinceDateString) return '00:00:00';
  const start = new Date(sinceDateString).getTime();
  const now = new Date().getTime();
  const diffSec = Math.max(0, Math.floor((now - start) / 1000));

  const days = Math.floor(diffSec / 86400);
  const hours = Math.floor((diffSec % 86400) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (days > 0) {
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function getStatusBadge(status: number) {
  switch (status) {
    case 0:
      return { label: 'Free', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    case 1:
      return { label: 'Occupied', bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
    case 2:
      return { label: 'Reserved', bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
    case 3:
    default:
      return { label: 'Offline', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  }
}
