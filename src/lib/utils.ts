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

/**
 * Formats a Date object as YYYY-MM-DD using local date components.
 * This avoids timezone issues from toISOString().
 */
export function formatDateAsLocalString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Formats a date string (YYYY-MM-DD) to a readable format in Mountain Time.
 */
export function formatDateStringMountainTime(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = parseLocalDate(dateString)
  return date.toLocaleDateString('en-US', {
    timeZone: 'America/Denver',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  })
}
