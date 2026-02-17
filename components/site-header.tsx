"use client"

import { useState } from "react"
import { Logo } from "@/components/logo"
import { ReservationModal } from "@/components/reservation-modal"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navItems = [
  { href: "#service", label: "サービス" },
  { href: "#service-detail", label: "レンタル内容" },
  { href: "#pricing", label: "料金" },
  { href: "#area", label: "配達エリア" },
  { href: "#howto", label: "ご利用ガイド" },
  { href: "#faq", label: "FAQ" },
  { href: "#calendar", label: "予約カレンダー" },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <Logo size="header" alt="裸一缶 ロゴ" />
          <span className="text-sm font-bold text-foreground hidden sm:inline">
            {"ドラム缶風呂一式レンタル 裸一缶"}
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ReservationModal>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-lg"
            >
              {"ご予約"}
            </Button>
          </ReservationModal>

          <button
            type="button"
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="メニュー"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t border-border px-6 py-4">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 text-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
