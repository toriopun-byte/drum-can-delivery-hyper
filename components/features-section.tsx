"use client"

import { Truck, Flame, Shield, Clock, TreePine, Users } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "県内どこでも配達",
    description:
      "長野県全域に対応。ご自宅はもちろん、キャンプ場やBBQ会場など、お好きな場所にお届けします。",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Flame,
    title: "薪焚きで本格体験",
    description:
      "本物の薪で沸かすドラム缶風呂。揺らめく炎と共に、贅沢なアウトドアバスタイムをお楽しみください。",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Shield,
    title: "安心のサポート体制",
    description:
      "設置から使い方のレクチャーまでスタッフが丁寧にご対応。初めての方でも安心してご利用いただけます。",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Clock,
    title: "最短翌日配達",
    description:
      "ご予約は最短翌日から対応可能。急なイベントや思い立ったアウトドア計画にも柔軟に対応いたします。",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: TreePine,
    title: "大自然と一体化",
    description:
      "長野県の美しい山々、清流、森の中で、五感を開放する特別なバスタイムを体験できます。",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "イベント対応可能",
    description:
      "企業研修、ウェディング、フェスなど大規模なイベントにも対応。専任スタッフが全面サポートします。",
    color: "bg-accent/10 text-accent",
  },
]

export function FeaturesSection() {
  return (
    <section id="service" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            {"サービスの特長"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            {"選ばれる6つの理由"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {"セルフスタイルの機材レンタルだから、自分たちのペースで自由に楽しめます。"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-row items-start gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex-shrink-0 ${feature.color} flex items-center justify-center group-hover:scale-105 transition-transform`}
              >
                <feature.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground mb-0.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
