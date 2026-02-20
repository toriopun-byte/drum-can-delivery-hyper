"use client"

import { Package, XCircle, Check, X } from "lucide-react"

const included = [
  "ドラム缶本体",
  "すのこ",
  "設置用レンガ",
  "踏み台",
  "設置・撤去作業",
  "排水作業",
  "給水用品",
]

const notIncluded = [
  "入浴のサポート・見守り",
  "場所の提供",
  "タオル等のアメニティ",
]

export function ServiceDetailSection() {
  return (
    <section id="service-detail" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            {"サービス内容"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            {"レンタル内容とお客様の役割"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {"私たちは"}
            <strong className="text-foreground">{"「最高に贅沢な遊び道具」"}</strong>
            {"をあなたの元へお届けします。設営から火起こし、入浴、片付けまで、お客様ご自身で楽しんでいただく"}
            <strong className="text-foreground">{"セルフスタイルのレンタルサービス"}</strong>
            {"です。"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Provided items */}
          <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{"提供するもの"}</h3>
            </div>
            <ul className="flex flex-col gap-3">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Not included */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{"含まれないもの"}</h3>
            </div>
            <ul className="flex flex-col gap-3">
              {notIncluded.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <X className="w-4 h-4 text-destructive/60 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Swimwear notice */}
        <div className="mt-6 bg-secondary/60 rounded-2xl p-4 md:p-5 border border-border">
          <div className="flex flex-col md:flex-row items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl" role="img" aria-label="水着">{"👙"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-foreground mb-1">{"水着について"}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {"入浴時には水着の着用を推奨しています。お持ちの方はご持参ください。お持ちでない方は、予約時に水着を購入いただけます（¥1,500/着）。"}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-card border border-border rounded-lg px-2.5 py-1 text-sm text-foreground">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  {"持参する（無料）"}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-card border border-border rounded-lg px-2.5 py-1 text-sm text-foreground">
                  <Package className="w-3.5 h-3.5 text-accent" />
                  {"購入する（¥1,500/着）"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
