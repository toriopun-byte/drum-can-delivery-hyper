import { NextRequest, NextResponse } from "next/server"
import { fetchMonthStatusFromGoogleCalendar } from "@/lib/google-calendar"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const yearParam = searchParams.get("year")
  const monthParam = searchParams.get("month")

  const year = yearParam ? Number(yearParam) : new Date().getFullYear()
  const month = monthParam ? Number(monthParam) : new Date().getMonth() + 1

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Invalid year or month" }, { status: 400 })
  }

  try {
    const status = await fetchMonthStatusFromGoogleCalendar(year, month)
    return NextResponse.json(status)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        year,
        month,
        bookedDates: [],
        closedDates: [],
        error: "Googleカレンダーからの取得に失敗しました。",
      },
      { status: 200 }
    )
  }
}

