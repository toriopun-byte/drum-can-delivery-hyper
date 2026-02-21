"use client"

import { Instagram } from "lucide-react"
import { Logo } from "@/components/logo"

const footerLinks = [
  { href: "#service", label: "サービス" },
  { href: "#service-detail", label: "レンタル内容" },
  { href: "#pricing", label: "料金" },
  { href: "#area", label: "配達エリア" },
  { href: "#howto", label: "ご利用ガイド" },
  { href: "#faq", label: "FAQ" },
  { href: "#disclaimer", label: "免責事項" },
  { href: "#calendar", label: "予約カレンダー" },
  { href: "#inquiry", label: "ご質問" },
]

export function SiteFooter() {
  return (
    <footer className="bg-[hsl(210,40%,12%)] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size="footer" alt="裸一缶 ロゴ" />
            <div>
              <span className="text-sm font-bold text-[hsl(0,0%,100%)] block">
                {"ドラム缶風呂一式レンタル 裸一缶"}
              </span>
              <span className="text-xs text-[hsl(0,0%,100%)]/50">{"長野県限定サービス"}</span>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[hsl(0,0%,100%)]/60 hover:text-[hsl(0,0%,100%)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-[hsl(0,0%,100%)]/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-[hsl(0,0%,100%)] font-semibold mb-2">{"お問い合わせ"}</p>
              <a
                href="tel:08025907736"
                className="text-sm text-[hsl(0,0%,100%)]/80 hover:text-[hsl(0,0%,100%)] transition-colors"
              >
                {"電話: 080-2590-7736"}
              </a>
              <a
                href="mailto:drumcandelivery@gmail.com"
                className="text-sm text-[hsl(0,0%,100%)]/80 hover:text-[hsl(0,0%,100%)] transition-colors"
              >
                {"メール: drumcandelivery@gmail.com"}
              </a>
              <a
                href="https://www.instagram.com/durumcandelivery?igsh=Mzl4aG9zMWd4a2Nv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[hsl(0,0%,100%)]/80 hover:text-[hsl(0,0%,100%)] transition-colors flex items-center gap-2 mt-1"
              >
                <Instagram className="w-4 h-4" />
                {"インスタグラム"}
              </a>
            </div>
            <p className="text-xs text-[hsl(0,0%,100%)]/40">
              {"© 2026 ドラム缶風呂一式レンタル 裸一缶. All rights reserved."}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
