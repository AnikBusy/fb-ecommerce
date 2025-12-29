import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  const value = typeof amount === 'number' ? amount : 0
  const formattedValue = new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
  return `${formattedValue} TK.`
}

export function toEnglishDigits(str) {
  if (!str) return str
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return str.toString().replace(/[০-৯]/g, (w) => bengaliDigits.indexOf(w))
}

export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}
