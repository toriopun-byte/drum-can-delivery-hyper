const RESEND_API_URL = "https://api.resend.com/emails"

export interface ReservationEmailPayload {
  startDate: string
  endDate?: string
  dayCount: number
  name: string
  email: string
  phone?: string
  address: string
  quantity: number
  addOnLabels: string
  swimwearLabel: string
  swimwearQty: number
  notes?: string
  totalPrice: number
}

export function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !from) {
    throw new Error(
      "Resendの環境変数が設定されていません。\n" +
      "設定が必要な環境変数:\n" +
      "- RESEND_API_KEY\n" +
      "- RESEND_FROM_EMAIL\n\n" +
      "Cloudflare Pagesの環境変数設定でこれらの値を設定してください。"
    )
  }

  return { apiKey, from }
}

function buildCustomerEmailHtml(payload: ReservationEmailPayload) {
  const {
    startDate,
    endDate,
    dayCount,
    name,
    address,
    quantity,
    addOnLabels,
    swimwearLabel,
    swimwearQty,
    notes,
    totalPrice,
  } = payload

  const period =
    dayCount === 1 || !endDate ? `${startDate}（${dayCount}日）` : `${startDate} 〜 ${endDate}（${dayCount}日）`

  return `
<p>${name} 様</p>
<p>ドラム缶風呂レンタル「裸一缶」へのご予約ありがとうございます。</p>
<p>以下の内容でご予約を承りました。</p>
<hr />
<p><strong>ご利用日程</strong>: ${period}</p>
<p><strong>ご利用場所</strong>: ${address}</p>
<p><strong>ドラム缶本数</strong>: ${quantity}本</p>
<p><strong>追加オプション</strong>: ${addOnLabels || "なし"}</p>
<p><strong>水着</strong>: ${swimwearLabel} x ${swimwearQty}</p>
<p><strong>お見積り合計（税別）</strong>: ¥${totalPrice.toLocaleString()}</p>
${notes ? `<p><strong>備考</strong>: ${notes}</p>` : ""}
<hr />
<p><strong>お支払い方法</strong>: 当日、<strong>現金</strong> または <strong>PayPay</strong> にてお支払いください。</p>
<p>担当者より改めて詳細のご連絡を差し上げますので、今しばらくお待ちください。</p>
<p>裸一缶</p>
`
}

function buildOwnerEmailHtml(payload: ReservationEmailPayload) {
  const {
    startDate,
    endDate,
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
  } = payload

  const period =
    dayCount === 1 || !endDate ? `${startDate}（${dayCount}日）` : `${startDate} 〜 ${endDate}（${dayCount}日）`

  return `
<p>新規予約が入りました。</p>
<hr />
<p><strong>お名前</strong>: ${name}</p>
<p><strong>メール</strong>: ${email}</p>
<p><strong>電話</strong>: ${phone || "（未記入）"}</p>
<p><strong>ご利用日程</strong>: ${period}</p>
<p><strong>ご利用場所</strong>: ${address}</p>
<p><strong>ドラム缶本数</strong>: ${quantity}本</p>
<p><strong>追加オプション</strong>: ${addOnLabels || "なし"}</p>
<p><strong>水着</strong>: ${swimwearLabel} x ${swimwearQty}</p>
<p><strong>お見積り合計（税別）</strong>: ¥${totalPrice.toLocaleString()}</p>
${notes ? `<p><strong>備考</strong>: ${notes}</p>` : ""}
<hr />
<p>※お支払いは当日、現金またはPayPayにて受領してください。</p>
`
}

export async function sendEmail(to: string, subject: string, html: string) {
  const { apiKey, from } = getResendConfig()

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resendでのメール送信に失敗しました: ${res.status} ${text}`)
  }
}

export async function sendReservationEmails(payload: ReservationEmailPayload) {
  const customerHtml = buildCustomerEmailHtml(payload)
  const ownerHtml = buildOwnerEmailHtml(payload)

  const ownerAddress = "drumcandelivery@gmail.com"

  await Promise.all([
    sendEmail(
      payload.email,
      "【裸一缶】ご予約ありがとうございます",
      customerHtml
    ),
    sendEmail(
      ownerAddress,
      "【裸一缶】新規予約が入りました",
      ownerHtml
    ),
  ])
}

