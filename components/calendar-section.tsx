"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar } from "@/components/ui/calendar"
import { ReservationModal } from "@/components/reservation-modal"
import { Button } from "@/components/ui/button"
import { CalendarDays, X, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { ja } from "date-fns/locale"
import {
  format,
  isPast,
  isSameDay,
  isBefore,
  isAfter,
  startOfDay,
  parseISO,
  addMonths,
  subMonths,
} from "date-fns"
import useSWR from "swr"
import { fetchCalendarData, type CalendarData } from "@/lib/calendar-demo"

// 予約可能な最終日（2026年12月31日）
const MAX_RESERVATION_DATE = new Date(2026, 11, 31) // 月は0-indexed（11 = 12月）

export function CalendarSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const today = startOfDay(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth() + 1

  // Fetch calendar data (API or client-side demo for static site)
  const { data, isLoading, mutate } = useSWR<CalendarData>(
    `/api/calendar?year=${year}&month=${month}`,
    fetchCalendarData,
    { 
      revalidateOnFocus: true, 
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5秒に短縮
      refreshInterval: 30000, // 30秒ごとに自動更新
    }
  )

  const nextMonth = addMonths(currentMonth, 1)
  useSWR<CalendarData>(
    `/api/calendar?year=${nextMonth.getFullYear()}&month=${nextMonth.getMonth() + 1}`,
    fetchCalendarData,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  )

  const bookedDates = (data?.bookedDates ?? []).map((d) => parseISO(d))
  const closedDates = (data?.closedDates ?? []).map((d) => parseISO(d))

  const isBooked = useCallback(
    (date: Date) => bookedDates.some((d) => isSameDay(d, date)),
    [bookedDates]
  )
  const isClosed = useCallback(
    (date: Date) => closedDates.some((d) => isSameDay(d, date)),
    [closedDates]
  )
  const isPast = useCallback(
    (date: Date) => isBefore(date, today),
    [today]
  )
  const isAvailable = useCallback(
    (date: Date) => !isPast(date) && !isBooked(date) && !isClosed(date),
    [isPast, isBooked, isClosed]
  )

  return (
    <section id="calendar" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            <CalendarDays className="w-4 h-4 inline mr-1 -mt-0.5" />
            {"予約カレンダー"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            {"ご希望の日付を選んで予約"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {"Googleカレンダーと連動した最新の空き状況です。"}
            <br className="hidden sm:block" />
            <span className="inline-flex items-center gap-1">
              <span className="font-bold text-primary">{"◯"}</span>
              {"が予約可能、"}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="font-bold text-destructive">{"×"}</span>
              {"が予約済み、"}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="font-bold text-muted-foreground">{"-"}</span>
              {"が予約不可（過去日・休業日など）です。"}
            </span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* Calendar */}
          <div className="bg-background rounded-2xl border border-border p-5 shadow-sm relative">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h3 className="text-lg font-bold text-foreground">
                {format(currentMonth, "yyyy年 M月", { locale: ja })}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {isLoading && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              locale={ja}
              disabled={(date) =>
                isBefore(date, today) ||
                isAfter(date, MAX_RESERVATION_DATE) ||
                isBooked(date) ||
                isClosed(date)
              }
              modifiers={{
                booked: bookedDates,
                available: (date: Date) => isAvailable(date),
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "hsl(0 84% 60% / 0.12)",
                  color: "hsl(0 84% 45%)",
                  opacity: 0.6,
                  cursor: "not-allowed",
                },
                available: {
                  backgroundColor: "hsl(205 78% 42% / 0.08)",
                  color: "hsl(205 78% 35%)",
                },
              }}
              components={{
                DayContent: ({ date }) => {
                  const booked = isBooked(date)
                  const past = isPast(date)
                  const closed = isClosed(date)
                  return (
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span className="text-sm font-medium leading-none">{date.getDate()}</span>
                      <span
                        className={`text-[9px] leading-none font-bold ${
                          past || closed
                            ? "text-muted-foreground"
                            : booked
                            ? "text-destructive"
                            : "text-primary"
                        }`}
                      >
                        {past || closed ? "-" : booked ? "×" : "◯"}
                      </span>
                    </div>
                  )
                },
              }}
              numberOfMonths={1}
              className="text-foreground"
            />

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border px-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center font-bold text-primary text-[11px]">
                  {"◯"}
                </div>
                {"空きあり"}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded bg-destructive/10 flex items-center justify-center font-bold text-destructive text-[11px]">
                  {"×"}
                </div>
                {"予約済み"}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded bg-muted/40 flex items-center justify-center font-bold text-muted-foreground text-[11px]">
                  {"-"}
                </div>
                {"予約不可"}
              </div>
            </div>
          </div>

          {/* Selected date info */}
          <div className="flex-1 max-w-md w-full">
            {selectedDate ? (
              <div className="bg-background rounded-2xl border border-primary/20 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{"選択した日付"}</p>
                    <p className="text-xl font-bold text-foreground">
                      {format(selectedDate, "yyyy年M月d日（E）", { locale: ja })}
                    </p>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      {"予約可能です"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {"配達時間帯: 午前9:00〜午後5:00"}
                  </p>
                </div>

                {/* カレンダー凡例 */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">{"カレンダーの記号について"}</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">◯</span>
                      <span className="text-gray-700">{"予約可能"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">☓</span>
                      <span className="text-gray-700">{"予約済み"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold">−</span>
                      <span className="text-gray-700">{"予約不可"}</span>
                    </div>
                  </div>
                </div>

                {/* 予約期間の注意 */}
                <div className="bg-amber-50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-amber-900 mb-2">{"予約期間について"}</h4>
                  <p className="text-xs text-amber-800">
                    {"2026年12月31日まで予約可能です。それ以降は予約できません。"}
                  </p>
                </div>

                <ReservationModal defaultDate={selectedDate}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl text-base shadow-md">
                    {"この日で予約する"}
                  </Button>
                </ReservationModal>
              </div>
            ) : (
              <div className="bg-background rounded-2xl border border-dashed border-border p-8 text-center">
                <CalendarDays className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">
                  {"日付を選んでください"}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {"カレンダーからご希望の日付をクリックすると、"}
                  <br className="hidden sm:block" />
                  {"空き状況と予約フォームが表示されます。"}
                </p>
              </div>
            )}

            {/* Quick info card */}
            <div className="mt-6 bg-background rounded-2xl border border-border p-5">
              <h4 className="font-bold text-foreground text-sm mb-3">{"予約について"}</h4>
              <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">{"1"}</span>
                  {"カレンダーから空きのある日付を選択"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">{"2"}</span>
                  {"1日 or 2日間を選んでオプションを追加"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">{"3"}</span>
                  {"予約完了メールが届きます"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
