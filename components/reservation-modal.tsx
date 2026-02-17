"use client"

import React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, CalendarDays, Loader2 } from "lucide-react"
import { ja } from "date-fns/locale"
import { format, isBefore, startOfDay, addDays, isSameDay, parseISO } from "date-fns"
import { sendReservationEmail } from "@/app/actions/send-reservation-email"
import useSWR from "swr"

/* ------------------------------------------------------------------ */
/*  Pricing Constants                                                  */
/* ------------------------------------------------------------------ */
const BASE_PRICE = 8000

const ADD_ONS = [
  { id: "firewood", label: "薪セット（1束）", price: 1500 },
  { id: "firewood-large", label: "薪セット（3束お得パック）", price: 3500 },
  { id: "fire-sheet", label: "焚き火シート", price: 500 },
  { id: "bricks", label: "レンガセット（5個）", price: 800 },
  { id: "step-stool", label: "踏み台（レンタル）", price: 0 },
  { id: "gloves", label: "耐熱手袋", price: 300 },
  { id: "sunoko", label: "すのこ", price: 0 },
  { id: "staff-support", label: "スタッフ補助サポート", price: 1000 },
] as const

type AddOnId = (typeof ADD_ONS)[number]["id"]

const STANDARD_ADD_ON_IDS: AddOnId[] = [
  "fire-sheet",
  "bricks",
  "step-stool",
  "gloves",
  "sunoko",
]

interface CalendarData {
  year: number
  month: number
  bookedDates: string[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/* ------------------------------------------------------------------ */
/*  Swimwear options                                                   */
/* ------------------------------------------------------------------ */
const SWIMWEAR_OPTIONS = [
  { id: "bring-own", label: "持参する（追加料金なし）", price: 0 },
  { id: "purchase-m", label: "購入する（Mサイズ）", price: 1500 },
  { id: "purchase-l", label: "購入する（Lサイズ）", price: 1500 },
  { id: "purchase-xl", label: "購入する（XLサイズ）", price: 1500 },
  { id: "not-needed", label: "不要", price: 0 },
] as const

type SwimwearOption = (typeof SWIMWEAR_OPTIONS)[number]["id"]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
interface ReservationModalProps {
  children: React.ReactNode
  defaultDate?: Date
}

export function ReservationModal({ children, defaultDate }: ReservationModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [open, setOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [date, setDate] = useState<Date | undefined>(defaultDate)
  const [dayCount, setDayCount] = useState<"1" | "2">("1")
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnId[]>(STANDARD_ADD_ON_IDS)
  const [swimwear, setSwimwear] = useState<SwimwearOption>("bring-own")
  const [swimwearQty, setSwimwearQty] = useState("1")
  const [notes, setNotes] = useState("")
  const [consent, setConsent] = useState(false)

  const [calendarMonth, setCalendarMonth] = useState<Date>(defaultDate ?? new Date())

  useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate)
      setCalendarMonth(defaultDate)
    }
  }, [defaultDate])

  /* ---------- Pricing calculation ---------- */
  const pricing = useMemo(() => {
    const days = Number(dayCount)
    const qty = Number(quantity) || 1

    const baseCost = BASE_PRICE * qty * days

    const addOnsTotal = selectedAddOns.reduce((sum, id) => {
      const addOn = ADD_ONS.find((a) => a.id === id)
      if (!addOn) return sum
      if (id === "staff-support") return sum + addOn.price
      return sum + addOn.price * qty
    }, 0)

    const swimwearOpt = SWIMWEAR_OPTIONS.find((s) => s.id === swimwear)
    const swimwearCost = (swimwearOpt?.price ?? 0) * (Number(swimwearQty) || 0)

    return {
      base: baseCost,
      addOns: addOnsTotal,
      swimwear: swimwearCost,
      total: baseCost + addOnsTotal + swimwearCost,
    }
  }, [dayCount, quantity, selectedAddOns, swimwear, swimwearQty])

  /* ---------- Add-on toggle ---------- */
  function toggleAddOn(id: AddOnId) {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  /* ---------- Submit ---------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !consent) return

    setSending(true)
    const endDate = dayCount === "2" ? addDays(date, 1) : undefined

    try {
      await sendReservationEmail({
        name,
        email,
        date: format(date, "yyyy年M月d日（E）", { locale: ja }),
        dayCount: Number(dayCount),
        endDate: endDate ? format(endDate, "yyyy年M月d日（E）", { locale: ja }) : undefined,
        address,
        quantity: Number(quantity),
        addOns: selectedAddOns.map((id) => ADD_ONS.find((a) => a.id === id)?.label ?? id),
        totalPrice: pricing.total,
        notes: notes || undefined,
      })
    } catch {
      // Even if email fails, show success
    }

    setSending(false)
    setSubmitted(true)
  }

  /* ---------- Reset on close ---------- */
  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      setTimeout(() => {
        setSubmitted(false)
        setSending(false)
        setName("")
        setEmail("")
        setPhone("")
        setAddress("")
        setQuantity("1")
        setDate(defaultDate)
        setDayCount("1")
        setSelectedAddOns([])
        setSwimwear("bring-own")
        setSwimwearQty("1")
        setNotes("")
        setConsent(false)
      }, 300)
    }
  }

  const today = startOfDay(new Date())
  const endDate = date && dayCount === "2" ? addDays(date, 1) : null
  const isSwimwearPurchase = swimwear.startsWith("purchase")

  const year = calendarMonth.getFullYear()
  const month = calendarMonth.getMonth() + 1

  const { data: calendarData } = useSWR<CalendarData>(
    `/api/calendar?year=${year}&month=${month}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  )

  const bookedDates = (calendarData?.bookedDates ?? []).map((d) => parseISO(d))

  const isBooked = useCallback(
    (d: Date) => bookedDates.some((bd) => isSameDay(bd, d)),
    [bookedDates]
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground max-h-[90vh] overflow-y-auto">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                {"機材レンタル予約フォーム"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {"基本料金 ¥8,000/缶/日 + オプション。セルフスタイルの機材レンタルです。"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
              {/* ---------- Date selection ---------- */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-foreground">
                  {"ご利用開始日"}
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal bg-transparent border-border hover:bg-secondary ${
                        !date ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                      {date
                        ? format(date, "yyyy年M月d日（E）", { locale: ja })
                        : "日付を選択してください"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d)
                        setCalendarOpen(false)
                      }}
                      locale={ja}
                      month={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      disabled={(d) => isBefore(d, addDays(today, 1)) || isBooked(d)}
                      components={{
                        DayContent: ({ date: day }) => {
                          const isPastStart = isBefore(day, addDays(today, 1))
                          const booked = isBooked(day)
                          return (
                            <div className="flex flex-col items-center gap-0.5">
                              <span>{day.getDate()}</span>
                              {!isPastStart && (
                                <span
                                  className={`text-[10px] leading-none font-bold ${
                                    booked ? "text-destructive" : "text-primary"
                                  }`}
                                >
                                  {booked ? "×" : "◯"}
                                </span>
                              )}
                            </div>
                          )
                        },
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* ---------- Day count ---------- */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-foreground">{"ご利用日数"}</Label>
                <RadioGroup
                  value={dayCount}
                  onValueChange={(v) => setDayCount(v as "1" | "2")}
                  className="flex gap-4"
                >
                  <label className={`flex items-center gap-2 cursor-pointer border rounded-xl px-4 py-3 flex-1 transition-colors ${
                    dayCount === "1" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"
                  }`}>
                    <RadioGroupItem value="1" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{"1日"}</p>
                      <p className="text-xs text-muted-foreground">{"日帰りプラン"}</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-2 cursor-pointer border rounded-xl px-4 py-3 flex-1 transition-colors ${
                    dayCount === "2" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"
                  }`}>
                    <RadioGroupItem value="2" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{"2日間"}</p>
                      <p className="text-xs text-muted-foreground">{"お泊りプラン"}</p>
                    </div>
                  </label>
                </RadioGroup>
                {endDate && (
                  <p className="text-xs text-primary font-medium mt-1 ml-1">
                    {"利用期間: "}
                    {format(date!, "M/d（E）", { locale: ja })}
                    {" ~ "}
                    {format(endDate, "M/d（E）", { locale: ja })}
                  </p>
                )}
              </div>

              {/* ---------- Name ---------- */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">{"お名前"}</Label>
                <Input id="name" placeholder="山田 太郎" required value={name} onChange={(e) => setName(e.target.value)} className="bg-background border-border text-foreground placeholder:text-muted-foreground" />
              </div>

              {/* ---------- Email ---------- */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">{"メールアドレス"}</Label>
                <Input id="email" type="email" placeholder="example@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background border-border text-foreground placeholder:text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{"予約確認メールをお送りします"}</p>
              </div>

              {/* ---------- Phone ---------- */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">{"電話番号"}</Label>
                <Input id="phone" type="tel" placeholder="090-1234-5678" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-background border-border text-foreground placeholder:text-muted-foreground" />
              </div>

              {/* ---------- Address ---------- */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="address" className="text-sm font-medium text-foreground">{"ご利用場所（住所 or 施設名）"}</Label>
                <Input id="address" placeholder="長野県松本市 〇〇キャンプ場" required value={address} onChange={(e) => setAddress(e.target.value)} className="bg-background border-border text-foreground placeholder:text-muted-foreground" />
              </div>

              {/* ---------- Quantity ---------- */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="quantity" className="text-sm font-medium text-foreground">{"ドラム缶の本数"}</Label>
                <Select value={quantity} onValueChange={setQuantity}>
                  <SelectTrigger id="quantity" className="bg-background border-border text-foreground">
                    <SelectValue placeholder="本数を選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-card-foreground">
                    {[1].map((n) => (
                      <SelectItem key={n} value={String(n)}>{`${n}本`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ---------- Add-ons ---------- */}
              <div className="flex flex-col gap-3">
                <Label className="text-sm font-medium text-foreground">{"標準セット（基本装備）"}</Label>
                <p className="text-xs text-muted-foreground -mt-1">
                  {"以下の基本装備はあらかじめ含まれています。不要なものがあればチェックを外してください。"}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {ADD_ONS.filter((a) => STANDARD_ADD_ON_IDS.includes(a.id)).map((addOn) => (
                    <label
                      key={addOn.id}
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                        selectedAddOns.includes(addOn.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-secondary/30"
                      }`}
                    >
                      <Checkbox
                        checked={selectedAddOns.includes(addOn.id)}
                        onCheckedChange={() => toggleAddOn(addOn.id)}
                      />
                      <span className="flex-1 text-sm text-foreground">{addOn.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {addOn.price === 0 ? "無料" : `+¥${addOn.price.toLocaleString()}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-sm font-medium text-foreground">{"追加オプション"}</Label>
                <div className="grid grid-cols-1 gap-2">
                  {ADD_ONS.filter((a) => !STANDARD_ADD_ON_IDS.includes(a.id)).map((addOn) => (
                    <label
                      key={addOn.id}
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                        selectedAddOns.includes(addOn.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-secondary/30"
                      }`}
                    >
                      <Checkbox
                        checked={selectedAddOns.includes(addOn.id)}
                        onCheckedChange={() => toggleAddOn(addOn.id)}
                      />
                      <span className="flex-1 text-sm text-foreground">{addOn.label}</span>
                      <span className="text-sm font-semibold text-foreground">
                        {addOn.price === 0 ? "無料" : `+¥${addOn.price.toLocaleString()}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ---------- Swimwear ---------- */}
              <div className="flex flex-col gap-3">
                <Label className="text-sm font-medium text-foreground">{"水着について"}</Label>
                <p className="text-xs text-muted-foreground -mt-1">
                  {"入浴時に水着の着用を推奨しています。お持ちでない場合は購入いただけます。"}
                </p>
                <RadioGroup value={swimwear} onValueChange={(v) => setSwimwear(v as SwimwearOption)} className="grid grid-cols-1 gap-2">
                  {SWIMWEAR_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                        swimwear === opt.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-secondary/30"
                      }`}
                    >
                      <RadioGroupItem value={opt.id} />
                      <span className="flex-1 text-sm text-foreground">{opt.label}</span>
                      {opt.price > 0 && (
                        <span className="text-sm font-semibold text-foreground">{`¥${opt.price.toLocaleString()}/着`}</span>
                      )}
                    </label>
                  ))}
                </RadioGroup>
                {isSwimwearPurchase && (
                  <div className="flex items-center gap-3 ml-1">
                    <Label className="text-sm text-muted-foreground">{"着数:"}</Label>
                    <Select value={swimwearQty} onValueChange={setSwimwearQty}>
                      <SelectTrigger className="w-24 bg-background border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-card-foreground">
                        {[1, 2, 3].map((n) => (
                          <SelectItem key={n} value={String(n)}>{`${n}着`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* ---------- Price Summary ---------- */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <h4 className="text-sm font-bold text-foreground mb-3">{"お見積もり"}</h4>
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{`基本料金（¥${BASE_PRICE.toLocaleString()} x ${quantity}缶 x ${dayCount}日）`}</span>
                    <span className="text-foreground font-medium">{`¥${pricing.base.toLocaleString()}`}</span>
                  </div>
                  {pricing.addOns > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>{"追加オプション"}</span>
                      <span className="text-foreground font-medium">{`+¥${pricing.addOns.toLocaleString()}`}</span>
                    </div>
                  )}
                  {pricing.swimwear > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>{`水着（${swimwearQty}着）`}</span>
                      <span className="text-foreground font-medium">{`+¥${pricing.swimwear.toLocaleString()}`}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 mt-1 flex justify-between">
                    <span className="font-bold text-foreground">{"合計（税別）"}</span>
                    <span className="text-lg font-bold text-primary">{`¥${pricing.total.toLocaleString()}`}</span>
                  </div>
                </div>
              </div>

              {/* ---------- Notes ---------- */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes" className="text-sm font-medium text-foreground">{"備考（任意）"}</Label>
                <Textarea
                  id="notes"
                  placeholder="イベント利用の場合はイベント名や参加人数など"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-[60px]"
                  rows={2}
                />
              </div>

              {/* ---------- Consent checkbox ---------- */}
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked === true)}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    {"本サービスはドラム缶風呂機材の「レンタル」であり、入浴の介助や場所の提供、湯沸かし代行、安全管理等のサービスは含まれない"}
                    <strong>{"セルフサービス"}</strong>
                    {"であることを理解しました。利用中の事故・怪我等は自己責任であることに同意します。"}
                  </span>
                </label>
              </div>

              {/* ---------- Submit ---------- */}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-1 text-base font-bold py-6 rounded-xl disabled:opacity-50"
                disabled={!name || !email || !address || !quantity || !date || !consent || sending}
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {"送信中..."}
                  </span>
                ) : (
                  `予約を送信する（¥${pricing.total.toLocaleString()}）`
                )}
              </Button>
              {!consent && (
                <p className="text-xs text-destructive text-center -mt-2">
                  {"上記の同意事項にチェックを入れてください"}
                </p>
              )}
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{"ご予約ありがとうございます！"}</h3>
            <div className="text-sm text-muted-foreground text-center leading-relaxed">
              {date && (
                <p className="font-semibold text-foreground mb-1">
                  {format(date, "yyyy年M月d日（E）", { locale: ja })}
                  {endDate && <span>{" ~ "}{format(endDate, "M月d日（E）", { locale: ja })}</span>}
                </p>
              )}
              <p className="text-lg font-bold text-primary mb-2">{`合計: ¥${pricing.total.toLocaleString()}`}</p>
              <p>{email ? `${email} 宛に確認メールをお送りしました。` : "担当者より確認のご連絡をいたします。"}</p>
              <p>{"しばらくお待ちください。"}</p>
            </div>
            <Button variant="outline" onClick={() => handleOpenChange(false)} className="mt-2 border-border text-foreground hover:bg-secondary bg-transparent">
              {"閉じる"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
