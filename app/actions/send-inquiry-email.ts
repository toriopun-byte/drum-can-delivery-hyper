"use server"

/**
 * Server Action: Send inquiry/contact form email to drumcandelivery@gmail.com
 *
 * Required environment variable:
 * - RESEND_API_KEY: Your Resend API key
 */

const INQUIRY_EMAIL = "drumcandelivery@gmail.com"

interface InquiryEmailPayload {
  name: string
  email: string
  subject?: string
  message: string
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

export async function sendInquiryEmail(
  payload: InquiryEmailPayload
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log("[v0] RESEND_API_KEY not set, skipping inquiry email send")
    console.log("[v0] Inquiry payload:", JSON.stringify(payload, null, 2))
    return {
      success: true,
      message: "お問い合わせを受け付けました（メール送信はスキップされました）",
    }
  }

  const safeName = escapeHtml(payload.name.trim())
  const safeEmail = payload.email.trim()
  const safeSubject = payload.subject ? escapeHtml(payload.subject.trim()) : "（件名なし）"
  const safeMessage = escapeHtml(payload.message.trim()).replace(/\n/g, "<br/>")

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px;">
      <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1a73a7; font-size: 24px; margin: 0;">裸一缶 お問い合わせ</h1>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #64748b; font-size: 14px;">お名前</p>
        <p style="color: #1e293b; font-size: 16px; margin-bottom: 16px;">${safeName}</p>
        <p style="color: #64748b; font-size: 14px;">メールアドレス</p>
        <p style="color: #1e293b; font-size: 16px; margin-bottom: 16px;">${safeEmail}</p>
        <p style="color: #64748b; font-size: 14px;">件名</p>
        <p style="color: #1e293b; font-size: 16px; margin-bottom: 16px;">${safeSubject}</p>
        <p style="color: #64748b; font-size: 14px;">お問い合わせ内容</p>
        <p style="color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">ドラム缶風呂デリバリー 裸一缶 ウェブサイトより</p>
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
        from: "裸一缶 ウェブサイト <onboarding@resend.dev>",
        to: [INQUIRY_EMAIL],
        replyTo: safeEmail,
        subject: `【裸一缶】お問い合わせ: ${payload.subject || "（件名なし）"}`,
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
      message: "お問い合わせを送信しました。ありがとうございます。",
    }
  } catch (error) {
    console.error("[v0] Failed to send inquiry email:", error)
    return {
      success: false,
      message: "送信中にエラーが発生しました",
      error: String(error),
    }
  }
}
