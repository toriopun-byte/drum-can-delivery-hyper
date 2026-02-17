"use client"

import { ReservationModal } from "@/components/reservation-modal"
import { Button } from "@/components/ui/button"
import { Check, Flame } from "lucide-react"

const addOnsList = [
  { name: "薪セット（1束）", price: "¥1,500" },
  { name: "薪セット（3束お得パック）", price: "¥3,500" },
  { name: "スタッフ補助サポート", price: "¥1,000" },
]

const examples = [
  {
    title: "ソロ・カップル",
    subtitle: "日帰り1缶でお手軽に",
    icon: Flame,
    items: [
      "基本料金: ¥8,000 (1缶 x 1日)",
      "薪セット1束: ¥1,500",
      "焚き火シート: ¥500",
    ],
    total: "¥10,000",
    highlight: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-accent/10 text-accent text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            {"料金プラン"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            {"基本料金 + オプションのシンプル設計"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {"基本料金は1缶1日あたり "}
            <span className="text-foreground font-bold">{"¥8,000"}</span>
            {"。薪や備品を追加するとその分が加算されます。"}
          </p>
        </div>

        {/* Base price hero */}
        <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-8 md:p-10 text-center mb-12">
          <p className="text-sm font-semibold text-primary mb-2">{"基本料金"}</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-sm text-muted-foreground">{"¥"}</span>
            <span className="text-5xl md:text-6xl font-bold text-foreground">{"8,000"}</span>
            <span className="text-base text-muted-foreground ml-2">{"/ 1缶 / 1日（税別）"}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {"ドラム缶の配達・回収費用込み。缶数 x 日数で計算されます。"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-5">
            <span className="flex items-center gap-1.5 text-sm text-foreground">
              <Check className="w-4 h-4 text-primary" /> {"配達込み"}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-foreground">
              <Check className="w-4 h-4 text-primary" /> {"回収込み"}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-foreground">
              <Check className="w-4 h-4 text-primary" /> {"1日 or 2日選択可"}
            </span>
          </div>
        </div>

        {/* Add-ons table */}
        <div className="mb-14">
          <h3 className="text-xl font-bold text-foreground mb-4 text-center">
            {"追加オプション一覧"}
          </h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {addOnsList.map((item, i) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    i < addOnsList.length - (addOnsList.length % 2 === 0 ? 2 : 1)
                      ? "border-b border-border"
                      : ""
                  } ${i % 2 === 0 ? "sm:border-r" : ""}`}
                >
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span
                    className={`text-sm font-bold ${
                      item.price === "無料" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Example combinations */}
        <h3 className="text-xl font-bold text-foreground mb-6 text-center">
          {"料金シミュレーション"}
        </h3>
        <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
          {examples.map((ex) => (
            <div
              key={ex.title}
              className={`flex flex-col rounded-2xl border p-6 transition-shadow ${
                ex.highlight
                  ? "border-accent bg-accent/5 shadow-xl shadow-accent/10 relative"
                  : "border-border bg-card hover:shadow-lg"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  ex.highlight ? "bg-accent/20" : "bg-primary/10"
                }`}>
                  <ex.icon className={`w-5 h-5 ${ex.highlight ? "text-accent" : "text-primary"}`} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{ex.title}</h4>
                  <p className="text-xs text-muted-foreground">{ex.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 mt-2">
                {ex.items.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">{"合計（税別）"}</span>
                  <span className="text-2xl font-bold text-foreground">{ex.total}</span>
                </div>
              </div>

              <ReservationModal>
                <Button
                  className={`mt-4 w-full py-5 font-bold rounded-xl ${
                    ex.highlight
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                  }`}
                >
                  {"この内容で予約する"}
                </Button>
              </ReservationModal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
