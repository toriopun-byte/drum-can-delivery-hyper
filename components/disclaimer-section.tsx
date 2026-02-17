"use client"

import { AlertTriangle, ShieldAlert } from "lucide-react"

export function DisclaimerSection() {
  return (
    <section id="disclaimer" className="bg-background py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {"免責事項（重要）"}
            </h3>
          </div>

          <div className="flex flex-col gap-4 text-sm text-muted-foreground leading-relaxed">
            <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground font-medium">
                {"本サービスは、ドラム缶風呂機材の「レンタル」および搬入・搬出を行うものです。入浴の介助・見守り・湯沸かし代行・場所の提供等は一切含まれない"}
                <strong>{"セルフサービス"}</strong>
                {"です。"}
              </p>
            </div>

            <p>
              {"ご利用中に発生した事故・怪我・火傷・体調不良・物品の損害等について、当方は一切の責任を負いかねます。"}
            </p>

            <div className="bg-destructive/5 border border-destructive/10 rounded-xl p-4">
              <p className="font-semibold text-foreground mb-2">
                {"以下の点を十分にご理解のうえ、ご利用ください："}
              </p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">{"1."}</span>
                  <span>{"火気・高温物を扱う行為であること"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">{"2."}</span>
                  <span>{"ご利用はすべてお客様ご自身の判断・責任で行っていただくこと"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">{"3."}</span>
                  <span>{"お子様の利用には必ず大人の付き添いが必要であること"}</span>
                </li>
              </ul>
            </div>

            <p className="text-foreground font-medium">
              {"安全に配慮した行動をお願いいたします。ご予約時に同意確認がございます。"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
