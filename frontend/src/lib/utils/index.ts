import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export { default as bem } from './bem'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function isValidJSON(str: string) {
  try {
    const object = JSON.parse(str)
    if (object && typeof object === 'object') return true
    return false
  } catch (e) {
    return false
  }
}
export const rowPage = [10, 20, 30, 40, 50]

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}
