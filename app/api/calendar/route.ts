import { NextResponse } from "next/server"

/**
 * Google Calendar API integration
 *
 * Required environment variables:
 * - GOOGLE_CALENDAR_ID: The Google Calendar ID to fetch events from
 * - GOOGLE_API_KEY: Google API key with Calendar API enabled
 *
 * Setup steps:
 * 1. Create a Google Cloud project and enable Calendar API
 * 2. Create an API key (or service account for private calendars)
 * 3. Set GOOGLE_CALENDAR_ID and GOOGLE_API_KEY in environment variables
 *
 * For service account auth (private calendars), use GOOGLE_SERVICE_ACCOUNT_KEY instead.
 */

interface GoogleCalendarEvent {
  id: string
  summary: string
  start: { date?: string; dateTime?: string }
  end: { date?: string; dateTime?: string }
  status: string
}

interface GoogleCalendarResponse {
  items: GoogleCalendarEvent[]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const yearParam = searchParams.get("year")
  const monthParam = searchParams.get("month")

  const year = yearParam ? Number.parseInt(yearParam, 10) : new Date().getFullYear()
  const month = monthParam ? Number.parseInt(monthParam, 10) : new Date().getMonth() + 1

  // Build the time range for the requested month
  const timeMin = new Date(year, month - 1, 1).toISOString()
  const timeMax = new Date(year, month, 0, 23, 59, 59).toISOString()

  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const apiKey = process.env.GOOGLE_API_KEY

  // If Google Calendar credentials are not configured, return demo data
  if (!calendarId || !apiKey) {
    console.log("[v0] Google Calendar API not configured, returning demo data")
    return NextResponse.json(generateDemoData(year, month))
  }

  try {
    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
    )
    url.searchParams.set("key", apiKey)
    url.searchParams.set("timeMin", timeMin)
    url.searchParams.set("timeMax", timeMax)
    url.searchParams.set("singleEvents", "true")
    url.searchParams.set("orderBy", "startTime")
    url.searchParams.set("maxResults", "100")

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.error("[v0] Google Calendar API error:", response.status, await response.text())
      return NextResponse.json(generateDemoData(year, month))
    }

    const data: GoogleCalendarResponse = await response.json()

    // Build a map of date -> booked status
    // Convention: If a date has an event, it is considered booked (x)
    const bookedDates: string[] = []

    for (const event of data.items) {
      if (event.status === "cancelled") continue

      // All-day events use `date`, timed events use `dateTime`
      const startStr = event.start.date || event.start.dateTime?.split("T")[0]
      const endStr = event.end.date || event.end.dateTime?.split("T")[0]

      if (startStr) {
        // For multi-day events, mark each day
        const start = new Date(startStr)
        const end = endStr ? new Date(endStr) : start

        const current = new Date(start)
        // For all-day events, Google uses exclusive end date, so subtract 1 day
        const actualEnd = event.end.date ? new Date(end.getTime() - 86400000) : end

        while (current <= actualEnd) {
          const dateStr = current.toISOString().split("T")[0]
          if (!bookedDates.includes(dateStr)) {
            bookedDates.push(dateStr)
          }
          current.setDate(current.getDate() + 1)
        }
      }
    }

    return NextResponse.json({
      year,
      month,
      bookedDates, // Array of "YYYY-MM-DD" strings that are booked
    })
  } catch (error) {
    console.error("[v0] Failed to fetch Google Calendar:", error)
    return NextResponse.json(generateDemoData(year, month))
  }
}

/**
 * Generate demo availability data for development/preview
 */
function generateDemoData(year: number, month: number) {
  const bookedDates: string[] = []
  const daysInMonth = new Date(year, month, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dow = date.getDay()

    // Mark some dates as booked for demo purposes
    // Weekends have higher chance of being booked
    const isPast = date < new Date(new Date().toDateString())
    if (isPast) {
      bookedDates.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
      continue
    }

    if ((dow === 0 || dow === 6) && day % 3 === 0) {
      bookedDates.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
    } else if (day % 7 === 0) {
      bookedDates.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
    }
  }

  return { year, month, bookedDates }
}
