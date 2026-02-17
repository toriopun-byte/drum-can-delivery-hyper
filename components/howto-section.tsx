"use client"

import { useState } from "react"
import {
  MapPin,
  Flame,
  Shield,
  Layers,
  Droplets,
  Bath,
  ThumbsUp,
  Hand,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const steps = [
  {
    number: 1,
    icon: MapPin,
    title: "設置場所を決めます",
    description:
      "平らで安定した地面を選んでください。火気使用が許可されている場所であることを確認しましょう。",
    note: "不安な場合は、事前にスタッフへご相談ください。",
  },
  {
    number: 2,
    icon: Shield,
    title: "焚き火シートを敷きます",
    description:
      "直火が禁止・制限されている場所では、必ず焚き火シートを敷いてください。地面の保護と安全確保のために重要です。",
    note: null,
  },
  {
    number: 3,
    icon: Layers,
    title: "レンガを配置します",
    description:
      "焚き火シートの上に、ドラム缶と同じくらいの大きさになるよう、中心から放射状に五角形を描く形でレンガを5個配置します。",
    note: "ドラム缶がしっかり安定することを確認してください。",
  },
  {
    number: 4,
    icon: Flame,
    title: "火を起こします",
    description:
      "細い薪・小枝 → 中くらいの薪 → 太い薪の順で使います。最初は薪を詰め込みすぎず、火が安定するまでは目を離さないでください。",
    note: "風が強い場合は無理に火を起こさないでください。スタッフがサポートします。",
  },
  {
    number: 5,
    icon: Hand,
    title: "ドラム缶を設置します",
    description:
      "火が安定したら、必ず二人以上でドラム缶を持ち、レンガの上に慎重に設置してください。",
    note: "火傷防止のため、軍手や耐熱手袋の使用をおすすめします。",
  },
  {
    number: 6,
    icon: Droplets,
    title: "水を入れます",
    description:
      "ホースなどを使ってドラム缶に水を入れてください。",
    note: "水が入っていない状態で加熱しないでください（空焚き厳禁）。",
  },
  {
    number: 7,
    icon: Bath,
    title: "入浴準備",
    description:
      "水が十分に温まったら、すのこを入れてから入浴してください。貸し出しの踏み台を使用して、ゆっくり出入りしてください。",
    note: "飛び乗り・またぎ込みは非常に危険です。",
  },
  {
    number: 8,
    icon: ThumbsUp,
    title: "ドラム缶風呂をお楽しみください",
    description:
      "無理のない温度で、体調に注意しながらご利用ください。小さなお子様が入る場合は、必ず大人が付き添ってください。",
    note: null,
  },
  {
    number: 9,
    icon: AlertTriangle,
    title: "ご利用終了後",
    description:
      "入浴終了後は、ドラム缶や焚き火には触れず、そのままの状態で置いてください。完全に消火されていることを必ず確認してください。",
    note: null,
  },
]

export function HowtoSection() {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])

  const allExpanded = expandedSteps.length === steps.length

  const toggleAll = () => {
    setExpandedSteps(allExpanded ? [] : steps.map((s) => s.number))
  }

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((n) => n !== stepNumber)
        : [...prev, stepNumber]
    )
  }

  return (
    <section id="howto" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            {"ご利用ガイド"}
          </span>
          <button
            onClick={toggleAll}
            className="group cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance inline-flex items-center gap-2">
              {"かんたん9ステップ"}
              {allExpanded ? (
                <ChevronUp className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </h2>
          </button>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {"初めてでも安心。スタッフが丁寧にレクチャーします。"}
          </p>
        </div>

        <div className="flex flex-col gap-0 relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          {steps.map((step, idx) => {
            const isExpanded = expandedSteps.includes(step.number)

            return (
              <div
                key={step.number}
                className="relative flex gap-4 md:gap-6 pb-8"
              >
                {/* Step number */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1.5 pb-4">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.number)}
                    className="flex w-full items-center gap-2 mb-2 text-left group"
                  >
                    <step.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <h3 className="text-lg font-bold text-foreground flex-1">{step.title}</h3>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      {isExpanded ? "−" : "＋"}
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                      {step.note && (
                        <p className="mt-2 text-xs bg-accent/10 text-accent border border-accent/20 rounded-lg px-3 py-2 leading-relaxed">
                          {step.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Brick layout illustration */}
        {allExpanded && (
          <div className="mt-8 bg-card border border-border rounded-2xl p-6">
            <h4 className="font-bold text-foreground text-center mb-4">
              {"レンガ設置のイメージ"}
            </h4>
            <div className="flex justify-center">
              <svg viewBox="0 0 200 200" className="w-48 h-48" aria-label="レンガ設置イメージ図">
                {/* Center drum can */}
                <circle cx="100" cy="100" r="35" fill="hsl(210 20% 85%)" stroke="hsl(210 40% 12%)" strokeWidth="2" />
                <text x="100" y="104" textAnchor="middle" fontSize="11" fontWeight="bold" fill="hsl(210 40% 12%)">{"ドラム缶"}</text>

                {/* Pentagon bricks */}
                {[0, 72, 144, 216, 288].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180
                  const x = 100 + 62 * Math.cos(rad - Math.PI / 2)
                  const y = 100 + 62 * Math.sin(rad - Math.PI / 2)
                  return (
                    <g key={angle}>
                      <rect
                        x={x - 14}
                        y={y - 8}
                        width="28"
                        height="16"
                        rx="3"
                        fill="hsl(15 60% 55%)"
                        stroke="hsl(15 60% 40%)"
                        strokeWidth="1.5"
                      />
                      <text x={x} y={y + 4} textAnchor="middle" fontSize="8" fill="hsl(0 0% 100%)" fontWeight="bold">
                        {`${"レンガ"}`}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
