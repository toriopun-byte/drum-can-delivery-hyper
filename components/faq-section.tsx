"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "スタッフの方は入浴中もいてくれますか？",
    answer:
      "いいえ、スタッフは機材の搬入・搬出のみを行い、入浴中は立ち会いません。プライベートな時間をお楽しみいただくための「機材レンタル」ですので、安全に配慮してお客様の責任においてお楽しみください。なお、追加オプションで「スタッフ同行サポート」をご選択いただくと、設営から火起こしまでをスタッフがお手伝いします。",
  },
  {
    question: "水着は必要ですか？",
    answer:
      "水着の着用を推奨しています。お持ちの方はご持参ください。お持ちでない方は、予約時に水着をご購入いただけます（¥1,500/着、M/L/XLサイズ対応）。プライベートな場所であれば水着なしでもご利用いただけますが、イベント等の場合は着用をお願いしています。",
  },
  {
    question: "自分で火を起こせるか不安です。",
    answer:
      "ご安心ください。初めての方でも分かりやすいご利用ガイドをお渡しします。また、追加オプションの「スタッフ同行サポート」をご選択いただければ、スタッフが火起こしから湯沸かしまでお手伝いいたします。",
  },
  {
    question: "どこに設置できますか？",
    answer:
      "火気使用が許可されている場所であれば、基本的にどこでもOKです。キャンプ場、ご自宅の庭、イベント会場などが人気です。設置場所の確認が不安な場合は、事前にご相談ください。",
  },
  {
    question: "子どもも一緒に入れますか？",
    answer:
      "はい、お子様もご利用いただけます。ただし、小さなお子様が入浴する場合は、必ず大人の方が付き添い、目を離さないようにしてください。安全はお客様の責任においてお願いいたします。",
  },
  {
    question: "雨の日はどうなりますか？",
    answer:
      "小雨程度であれば問題なくご利用いただけます。荒天や強風の場合は安全のためキャンセルをお勧めしています。キャンセル料については予約時にご確認ください。",
  },
  {
    question: "お湯が沸くまでどのくらいかかりますか？",
    answer:
      "気温や水温により異なりますが、目安として1〜2時間程度です。火の量や風の状況によっても変わります。待ち時間もBBQやキャンプを楽しみながらお過ごしください。",
  },
  {
    question: "配達可能エリアはどこですか？",
    answer:
      "長野県全域に対応しています。松本市、長野市、上田市、諏訪市、安曇野市、白馬村など、県内であればどこへでもお届けします。遠方の場合は別途ご相談ください。",
  },
]

function FaqItem({ question, answer, isExpanded }: { question: string; answer: string; isExpanded: boolean }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="w-full flex items-center justify-between px-5 py-4">
        <span className="text-sm font-semibold text-foreground pr-4">
          <span className="text-primary mr-2">{"Q."}</span>
          {question}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </div>
      {isExpanded && (
        <div className="px-5 pb-4">
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground leading-relaxed pt-3">
              <span className="text-accent font-bold mr-2">{"A."}</span>
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function FaqSection() {
  const [allExpanded, setAllExpanded] = useState(false)

  const toggleAll = () => {
    setAllExpanded(!allExpanded)
  }

  return (
    <section id="faq" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-accent/10 text-accent text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            {"よくある質問"}
          </span>
          <button
            onClick={toggleAll}
            className="group cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance inline-flex items-center gap-2">
              {"FAQ"}
              {allExpanded ? (
                <ChevronUp className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </h2>
          </button>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {"ご予約前に、気になるポイントをチェックしてください。"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} isExpanded={allExpanded} />
          ))}
        </div>
      </div>
    </section>
  )
}
