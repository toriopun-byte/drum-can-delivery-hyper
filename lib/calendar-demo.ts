/**
 * Client-side demo calendar data for static site (Cloudflare Pages).
 * Used when /api/calendar is not available.
 */

export interface CalendarData {
  year: number
  month: number
  bookedDates: string[]
  closedDates?: string[]
}

export function generateDemoCalendarData(
  year: number,
  month: number
): CalendarData {
  const bookedDates: string[] = []
  const closedDates: string[] = []
  const daysInMonth = new Date(year, month, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dow = date.getDay()
    const isPast = date < new Date(new Date().toDateString())
    if (isPast) {
      closedDates.push(
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      )
      continue
    }
    if ((dow === 0 || dow === 6) && day % 3 === 0) {
      bookedDates.push(
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      )
    } else if (day % 7 === 0) {
      closedDates.push(
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      )
    }
  }

  return { year, month, bookedDates, closedDates }
}

/**
 * Fetcher for useSWR: tries /api/calendar, falls back to demo data (static site).
 */
export async function fetchCalendarData(url: string): Promise<CalendarData> {
  try {
    const res = await fetch(url)
    if (res.ok) return res.json()
  } catch {
    // Static site or API not available
  }
  const match = url.match(/year=(\d+).*month=(\d+)/)
  const year = match ? Number(match[1]) : new Date().getFullYear()
  const month = match ? Number(match[2]) : new Date().getMonth() + 1
  return generateDemoCalendarData(year, month)
}
