"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Loader2, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { sendInquiryEmail } from "@/app/actions/send-inquiry-email"

export function InquirySection() {
  const [isOpen, setIsOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener("open-inquiry", handler)
    return () => window.removeEventListener("open-inquiry", handler)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.location.hash === "#inquiry") setIsOpen(true)
    const handler = () => {
      if (window.location.hash === "#inquiry") setIsOpen(true)
    }
    window.addEventListener("hashchange", handler)
    return () => window.removeEventListener("hashchange", handler)
  }, [])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return

    setSending(true)
    try {
      const result = await sendInquiryEmail({ name, email, subject, message })
      if (result.success) {
        setSubmitted(true)
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
      } else {
        alert(result.message || "送信に失敗しました")
      }
    } catch {
      alert("送信中にエラーが発生しました")
    }
    setSending(false)
  }

  return (
    <section id="inquiry" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-center mb-8 group"
        >
          <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            <MessageCircle className="w-4 h-4 inline mr-1 -mt-0.5" />
            {"お問い合わせ"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance inline-flex items-center justify-center gap-2">
            {"ご質問フォーム"}
            {isOpen ? (
              <ChevronUp className="w-6 h-6 text-muted-foreground group-hover:text-foreground" />
            ) : (
              <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-foreground" />
            )}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {"お気軽にご質問・ご相談ください。drumcandelivery@gmail.com 宛に送信されます。"}
          </p>
        </button>

        {isOpen && (submitted ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{"送信完了"}</h3>
            <p className="text-muted-foreground">
              {"お問い合わせありがとうございます。内容を確認のうえ、ご連絡いたします。"}
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setSubmitted(false)}
            >
              {"別のお問い合わせを送信する"}
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5"
          >
            <div>
              <Label htmlFor="inquiry-name" className="text-foreground">{"お名前（必須）"}</Label>
              <Input
                id="inquiry-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田 太郎"
                className="mt-1.5 bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="inquiry-email" className="text-foreground">{"メールアドレス（必須）"}</Label>
              <Input
                id="inquiry-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="mt-1.5 bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="inquiry-subject" className="text-foreground">{"件名（任意）"}</Label>
              <Input
                id="inquiry-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="レンタルについての質問"
                className="mt-1.5 bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="inquiry-message" className="text-foreground">{"お問い合わせ内容（必須）"}</Label>
              <Textarea
                id="inquiry-message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="お問い合わせ内容をご記入ください"
                rows={5}
                className="mt-1.5 bg-background border-border resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={sending}
              className="w-full py-6 text-base font-bold"
            >
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {"送信中..."}
                </span>
              ) : (
                "送信する"
              )}
            </Button>
          </form>
        ))}
      </div>
    </section>
  )
}
