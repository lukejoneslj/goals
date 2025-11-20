import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets today's date in local timezone as YYYY-MM-DD string.
 * This prevents UTC timezone issues where dates can shift by a day.
 */
export function getTodayLocalDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parses a date string (YYYY-MM-DD) as a local date, not UTC.
 * This prevents timezone issues where dates can shift by a day.
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Gets the weekday name from a date string in local timezone.
 */
export function getWeekdayFromDateString(dateString: string): string {
  const date = parseLocalDate(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
}
