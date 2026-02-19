import { JWTHeaderParameters, SignJWT, importPKCS8 } from "jose"

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3"

type GoogleEventDate = { date?: string; dateTime?: string }

interface GoogleCalendarEvent {
  id: string
  summary?: string
  start: GoogleEventDate
  end: GoogleEventDate
}

export interface MonthCalendarStatus {
  year: number
  month: number
  bookedDates: string[]
  closedDates: string[]
}

export interface ReservationPayload {
  startDate: string // YYYY-MM-DD
  dayCount: number
  name: string
  email: string
  phone?: string
  address: string
  quantity: number
  addOns: string[]
  swimwear: string
  swimwearQty: number
  notes?: string
  totalPrice: number
}

async function getServiceAccountKey(): Promise<{
  clientEmail: string
  privateKey: string
}> {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Googleサービスアカウントの環境変数が設定されていません。\n" +
      "設定が必要な環境変数:\n" +
      "- GOOGLE_SERVICE_ACCOUNT_EMAIL\n" +
      "- GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY\n" +
      "- GOOGLE_CALENDAR_ID\n\n" +
      "Cloudflare Pagesの環境変数設定でこれらの値を設定してください。"
    )
  }

  return {
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  }
}

async function getGoogleAccessToken(): Promise<string> {
  const { clientEmail, privateKey } = await getServiceAccountKey()

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: clientEmail,
    sub: clientEmail,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: GOOGLE_TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }

  const header: JWTHeaderParameters = {
    alg: "RS256",
    typ: "JWT",
  }

  const key = await importPKCS8(privateKey, "RS256")

  const assertion = await new SignJWT(payload)
    .setProtectedHeader(header)
    .sign(key)

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  })

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Google OAuth トークン取得に失敗しました: ${res.status} ${text}`)
  }

  const json = (await res.json()) as { access_token: string }
  if (!json.access_token) {
    throw new Error("Google OAuth レスポンスに access_token が含まれていません。")
  }
  return json.access_token
}

export async function fetchMonthStatusFromGoogleCalendar(
  year: number,
  month: number
): Promise<MonthCalendarStatus> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) {
    throw new Error("環境変数 GOOGLE_CALENDAR_ID が設定されていません。")
  }

  const accessToken = await getGoogleAccessToken()

  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0))
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0))

  const url = new URL(
    `${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events`
  )
  url.searchParams.set("timeMin", start.toISOString())
  url.searchParams.set("timeMax", end.toISOString())
  url.searchParams.set("singleEvents", "true")
  url.searchParams.set("orderBy", "startTime")
  url.searchParams.set("maxResults", "2500")

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Googleカレンダー取得に失敗しました: ${res.status} ${text}`)
  }

  const data = (await res.json()) as { items?: GoogleCalendarEvent[] }
  const items = data.items ?? []

  const bookedDatesSet = new Set<string>()
  const closedDatesSet = new Set<string>()

  for (const event of items) {
    const summary = event.summary ?? ""
    const startStr = event.start.date ?? event.start.dateTime
    const endStr = event.end.date ?? event.end.dateTime
    if (!startStr || !endStr) continue

    const startDate = new Date(startStr)
    const endDate = new Date(endStr)

    for (
      let d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      d < endDate;
      d.setDate(d.getDate() + 1)
    ) {
      if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1) continue
      const isoDate = d.toISOString().slice(0, 10)

      if (summary.includes("予約済み")) {
        bookedDatesSet.add(isoDate)
        closedDatesSet.delete(isoDate)
      } else if (summary.includes("予約不可")) {
        if (!bookedDatesSet.has(isoDate)) {
          closedDatesSet.add(isoDate)
        }
      }
    }
  }

  return {
    year,
    month,
    bookedDates: Array.from(bookedDatesSet).sort(),
    closedDates: Array.from(closedDatesSet).sort(),
  }
}

export async function createReservationEvent(
  payload: ReservationPayload
): Promise<{ eventId: string }> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) {
    throw new Error("環境変数 GOOGLE_CALENDAR_ID が設定されていません。")
  }

  const accessToken = await getGoogleAccessToken()

  const start = new Date(payload.startDate + "T00:00:00")
  const end = new Date(start)
  end.setDate(end.getDate() + Math.max(1, payload.dayCount || 1))

  const descriptionLines = [
    `お名前: ${payload.name}`,
    `メール: ${payload.email}`,
    `電話: ${payload.phone || "（未記入）"}`,
    `ご利用場所: ${payload.address}`,
    `ドラム缶: ${payload.quantity}本`,
    `追加オプション: ${payload.addOns.join(", ") || "なし"}`,
    `水着: ${payload.swimwear} x ${payload.swimwearQty}`,
    `合計金額(目安): ¥${payload.totalPrice.toLocaleString()}`,
    "",
    "※お支払いは当日、現金またはPayPayにてお願いします。",
  ]
  if (payload.notes) {
    descriptionLines.push("", `備考: ${payload.notes}`)
  }

  const res = await fetch(
    `${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: "【予約済み】裸一缶 ドラム缶風呂レンタル",
        description: descriptionLines.join("\n"),
        start: {
          date: payload.startDate,
          timeZone: "Asia/Tokyo",
        },
        end: {
          date: end.toISOString().slice(0, 10),
          timeZone: "Asia/Tokyo",
        },
      }),
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Googleカレンダーへの予約登録に失敗しました: ${res.status} ${text}`)
  }

  const json = (await res.json()) as { id?: string }
  if (!json.id) {
    throw new Error("Googleカレンダーのレスポンスに event id が含まれていません。")
  }

  return { eventId: json.id }
}

