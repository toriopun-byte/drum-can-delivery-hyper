"use client"

import { useCallback } from "react"

const sections = [
  { id: "service", label: "サービスの特長" },
  { id: "service-detail", label: "レンタル内容" },
  { id: "target", label: "ご利用形態" },
  { id: "gallery", label: "使用風景" },
  { id: "calendar", label: "予約カレンダー" },
  { id: "pricing", label: "料金" },
  { id: "area", label: "配達エリア" },
  { id: "howto", label: "ご利用ガイド" },
  { id: "faq", label: "FAQ" },
  { id: "disclaimer", label: "免責事項" },
  { id: "inquiry", label: "ご質問フォーム" },
]

import { useEffect, useState } from "react"

export function PageToc() {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const handler = () => {
      const scrollMiddle = window.scrollY + window.innerHeight * 0.35

      let current: string | null = null
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const top = rect.top + window.scrollY
        const bottom = top + rect.height
        if (scrollMiddle >= top && scrollMiddle < bottom) {
          current = section.id
          break
        }
      }

      setActiveId(current)
    }

    handler()
    window.addEventListener("scroll", handler)
    window.addEventListener("resize", handler)
    return () => {
      window.removeEventListener("scroll", handler)
      window.removeEventListener("resize", handler)
    }
  }, [])

  const handleSectionClick = useCallback((sectionId: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (sectionId === "inquiry") {
      e.preventDefault()
      const el = document.getElementById("inquiry")
      el?.scrollIntoView({ behavior: "smooth" })
      window.dispatchEvent(new CustomEvent("open-inquiry"))
    }
  }, [])

  return (
    <nav
      aria-label="ページ内ナビゲーション"
      className="hidden xl:flex flex-col gap-2 fixed right-6 top-32 z-30 bg-card/80 backdrop-blur-md border border-border rounded-2xl px-3 py-4 shadow-sm max-h-[70vh] overflow-y-auto"
    >
      <p className="text-[11px] font-semibold text-muted-foreground mb-1 px-1">{"目次"}</p>
      {sections.map((section) => {
        const isActive = activeId === section.id
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => handleSectionClick(section.id, e)}
            className={`text-xs px-2 py-1.5 rounded-lg text-left transition-colors ${
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            {section.label}
          </a>
        )
      })}
    </nav>
  )
}

