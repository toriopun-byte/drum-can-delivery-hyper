import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createReservationEvent, type ReservationPayload } from "@/lib/google-calendar"
import { sendReservationEmails } from "@/lib/resend-email"

export const runtime = "edge"

const reservationSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  address: z.string().min(1).max(300),
  quantity: z.number().int().min(1).max(10),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dayCount: z.number().int().min(1).max(7),
  addOns: z.array(z.string()).max(50),
  addOnLabels: z.string().max(1000),
  swimwear: z.string().max(100),
  swimwearLabel: z.string().max(200),
  swimwearQty: z.number().int().min(0).max(20),
  notes: z.string().max(2000).optional(),
  totalPrice: z.number().int().min(0).max(1_000_000),
})

export async function POST(req: NextRequest) {
  let parsed
  try {
    const json = await req.json()
    parsed = reservationSchema.parse(json)
  } catch (error) {
    return NextResponse.json({ error: "送信内容が不正です。" }, { status: 400 })
  }

  const {
    name,
    email,
    phone,
    address,
    quantity,
    startDate,
    dayCount,
    addOns,
    addOnLabels,
    swimwear,
    swimwearLabel,
    swimwearQty,
    notes,
    totalPrice,
  } = parsed

  const reservationPayload: ReservationPayload = {
    name,
    email,
    phone,
    address,
    quantity,
    startDate,
    dayCount,
    addOns,
    swimwear,
    swimwearQty,
    notes,
    totalPrice,
  }

  try {
    await createReservationEvent(reservationPayload)

    const start = new Date(startDate + "T00:00:00")
    const end = new Date(start)
    end.setDate(end.getDate() + Math.max(1, dayCount || 1))
    const endDateStr = end.toISOString().slice(0, 10)

    await sendReservationEmails({
      startDate,
      endDate: dayCount > 1 ? endDateStr : undefined,
      dayCount,
      name,
      email,
      phone,
      address,
      quantity,
      addOnLabels,
      swimwearLabel,
      swimwearQty,
      notes,
      totalPrice,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "予約処理に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 }
    )
  }
}

