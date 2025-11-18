import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function timeAgo(date: string | number | Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const unit in intervals) {
    const value = Math.floor(seconds / intervals[unit as keyof typeof intervals]);
    if (value >= 1) {
      return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
    }
  }

  return "just now";
}
