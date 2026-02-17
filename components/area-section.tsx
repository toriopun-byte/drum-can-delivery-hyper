"use client"

import Image from "next/image"
import { NaganoMap } from "@/components/nagano-map"
import { MapPin } from "lucide-react"

export function AreaSection() {
  return (
    <section id="area" className="bg-card py-20 md:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            {"配達エリア"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            {"長野県全域をカバー"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {"市街地からキャンプ場まで、お好きな場所にお届けします。"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Map + river image */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <NaganoMap />
            </div>
            <div className="relative rounded-2xl overflow-hidden h-40">
              <Image
                src="/images/river-scene.jpg"
                alt="長野県の清流"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent flex items-end p-4">
                <p className="text-[hsl(0,0%,100%)] text-sm font-semibold">
                  {"川辺への配達もOK"}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <p className="text-muted-foreground leading-relaxed">
              {"長野市・松本市・上田市・諏訪市・佐久市・飯田市・軽井沢など、長野県内の主要都市はもちろん、山間部やキャンプ場への配達も承っております。"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { area: "長野市・北信エリア", desc: "善光寺周辺・戸隠高原" },
                { area: "松本市・中信エリア", desc: "上高地・乗鞍高原" },
                { area: "上田市・東信エリア", desc: "軽井沢・菅平高原" },
                { area: "飯田市・南信エリア", desc: "駒ヶ根・天竜峡" },
              ].map((item) => (
                <div
                  key={item.area}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-bold text-foreground block">{item.area}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground bg-secondary rounded-lg px-4 py-3">
              {"※一部山間部は事前のご相談が必要な場合がございます。お気軽にお問い合わせください。"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
