import { NextRequest, NextResponse } from "next/server"
import { getResendConfig } from "@/lib/resend-email"
import { sendEmail } from "@/lib/resend-email"

export const runtime = "edge"

interface InquiryPayload {
  name: string
  email: string
  subject?: string
  message: string
}

function buildInquiryEmailHtml(payload: InquiryPayload) {
  const { name, email, subject, message } = payload
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1e40af; margin: 0 0 10px 0;">【裸一缶】お問い合わせ</h2>
        <p style="margin: 0 0 15px 0; color: #374151;">新しいお問い合わせがありました。</p>
      </div>
      
      <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <div style="margin-bottom: 15px;">
          <h3 style="color: #111827; margin: 0 0 5px 0;">お問い合わせ詳細</h3>
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #374151;">お名前:</strong><br>
          <span style="color: #6b7280;">${name}</span>
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #374151;">メールアドレス:</strong><br>
          <span style="color: #6b7280;">${email}</span>
        </div>
        
        ${subject ? `
        <div style="margin-bottom: 10px;">
          <strong style="color: #374151;">件名:</strong><br>
          <span style="color: #6b7280;">${subject}</span>
        </div>
        ` : ''}
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #374151;">お問い合わせ内容:</strong><br>
          <div style="color: #6b7280; white-space: pre-wrap; background: #f9fafb; padding: 10px; border-radius: 4px; margin-top: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            このメールは裸一缶ウェブサイトのお問い合わせフォームから送信されました。<br>
            ご確認のうえ、ご返信ください。
          </p>
        </div>
      </div>
    </div>
  `
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body as InquiryPayload

    // バリデーション
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "必須項目を入力してください。" },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: "メールアドレスの形式が正しくありません。" },
        { status: 400 }
      )
    }

    const { apiKey, from } = getResendConfig()
    
    // 管理者に問い合わせメールを送信
    const subjectLine = subject?.trim() ? `【裸一缶】${subject}` : "【裸一缶】お問い合わせ"
    
    await sendEmail(
      "drumcandelivery@gmail.com",
      subjectLine,
      buildInquiryEmailHtml({ name, email, subject, message })
    )

    console.log("Inquiry email sent successfully")

    return NextResponse.json({ 
      success: true,
      message: "お問い合わせを送信しました。確認次第、ご連絡いたします。" 
    })

  } catch (error) {
    console.error("Inquiry submission error:", error)
    return NextResponse.json(
      { error: "お問い合わせの送信に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 }
    )
  }
}
