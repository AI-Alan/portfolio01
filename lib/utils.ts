import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export const CATEGORY_COLORS: Record<string, string> = {
  'AI': '#00fff0',
  'ML': '#ff00ff',
  'Robotics': '#ffff00',
  'Web': '#00ff88',
  'CV': '#ff6600',
  'Other': '#8888ff',
}

export const SKILL_CATEGORY_COLORS: Record<string, string> = {
  'AI/ML': '#00fff0',
  'Web Dev': '#00ff88',
  'Robotics': '#ffff00',
  'Computer Vision': '#ff00ff',
  'Languages': '#ff6600',
  'Tools': '#8888ff',
}
