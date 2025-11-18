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



export function expireTime(expireDate: Date): string {
  const now = new Date();
  const diff = expireDate.getTime() - now.getTime(); // milliseconds

  if (diff <= 0) return "Poll has ended"; // Change this to show the "ended" message

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `Poll ends in ${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `Poll ends in ${hours} hour${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `Poll ends in ${minutes} minute${minutes > 1 ? "s" : ""}`;
  return `Poll ends in ${seconds} second${seconds > 1 ? "s" : ""}`;
}
