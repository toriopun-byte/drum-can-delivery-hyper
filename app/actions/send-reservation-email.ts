"use server"

/**
 * Server Action: Send reservation confirmation email via Resend
 *
 * Required environment variable:
 * - RESEND_API_KEY: Your Resend API key
 *
 * Setup:
 * 1. Sign up at https://resend.com
 * 2. Create an API key
 * 3. Verify your sending domain (or use onboarding@resend.dev for testing)
 * 4. Set RESEND_API_KEY in environment variables
 */

interface ReservationEmailPayload {
  name: string
  email: string
  date: string
  dayCount: number
  endDate?: string
  address: string
  quantity: number
  addOns: string[]
  totalPrice: number
  notes?: string
}

interface SendEmailResult {
  success: boolean
  message: string
  error?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function sendReservationEmail(
  payload: ReservationEmailPayload
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log("[v0] RESEND_API_KEY not set, skipping email send")
    // In development, log the email payload and return success
    console.log("[v0] Email payload:", JSON.stringify(payload, null, 2))
    return {
      success: true,
      message: "予約を受け付けました（メール送信はスキップされました）",
    }
  }

  const safeName = escapeHtml(payload.name.trim())
  const safeAddress = escapeHtml(payload.address.trim())
  const safeNotes = payload.notes ? escapeHtml(payload.notes.trim()) : undefined

  const addOnsText =
    payload.addOns.length > 0
      ? payload.addOns.map((text) => escapeHtml(text)).join("、")
      : "なし"

  const dateRange =
    payload.dayCount === 2 && payload.endDate
      ? `${payload.date} 〜 ${payload.endDate}`
      : payload.date

  // Build email HTML
  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px;">
      <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1a73a7; font-size: 24px; margin: 0;">ドラム缶風呂デリバリー 裸一缶</h1>
          <p style="color: #64748b; margin-top: 8px;">ご予約確認メール</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

        <p style="color: #1e293b; font-size: 16px;">${safeName} 様</p>
        <p style="color: #475569; line-height: 1.6;">
          この度はドラム缶風呂デリバリーをご予約いただき、誠にありがとうございます。<br/>
          以下の内容でご予約を承りました。
        </p>

        <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;">ご利用日</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${dateRange}（${payload.dayCount}日間）</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">ご利用場所</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${safeAddress}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">ドラム缶本数</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${payload.quantity}本</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">追加オプション</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${addOnsText}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">お見積り金額</td>
              <td style="padding: 8px 0; color: #1a73a7; font-weight: bold; font-size: 18px;">¥${payload.totalPrice.toLocaleString()}</td>
            </tr>
            ${safeNotes ? `
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">備考</td>
              <td style="padding: 8px 0; color: #1e293b;">${safeNotes}</td>
            </tr>
            ` : ""}
          </table>
        </div>

        <p style="color: #475569; line-height: 1.6; font-size: 14px;">
          スタッフより、ご予約内容の確認とお支払い方法について、改めてご連絡いたします。<br/>
          ご不明な点がございましたら、お気軽にお問い合わせください。
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          ドラム缶風呂デリバリー 裸一缶<br/>
          長野県限定サービス
        </p>
      </div>
    </div>
  `

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "裸一缶 <noreply@yourdomain.com>", // Replace with your verified domain
        to: [payload.email],
        subject: `【裸一缶】ご予約確認 - ${dateRange}`,
        html: emailHtml,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Resend API error:", error)
      return {
        success: false,
        message: "メール送信に失敗しました",
        error,
      }
    }

    return {
      success: true,
      message: "予約完了メールを送信しました",
    }
  } catch (error) {
    console.error("[v0] Failed to send email:", error)
    return {
      success: false,
      message: "メール送信中にエラーが発生しました",
      error: String(error),
    }
  }
}
