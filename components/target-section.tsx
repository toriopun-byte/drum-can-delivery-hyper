"use client"

import Image from "next/image"
import { ReservationModal } from "@/components/reservation-modal"
import { Button } from "@/components/ui/button"
import { User, PartyPopper, Check } from "lucide-react"

export function TargetSection() {
  return (
    <section id="target" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-accent/10 text-accent text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            {"ご利用シーン"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            {"個人利用ですか？イベント利用ですか？"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Individual */}
          <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative h-56">
              <Image
                src="/images/forest-camp.jpg"
                alt="森のキャンプ場でドラム缶風呂を楽しむファミリー"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(210,40%,12%)]/70 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-[hsl(0,0%,100%)]">{"個人・ファミリー向け"}</span>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-muted-foreground leading-relaxed">
                {"週末の家族キャンプ、友人とのBBQ、記念日のサプライズに。1缶からお気軽にご利用いただけます。"}
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "ファミリーキャンプのアクティビティに",
                  "友人グループのBBQパーティーに",
                  "記念日・誕生日のサプライズに",
                  "自宅の庭で非日常体験",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <ReservationModal>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-5 rounded-xl mt-2">
                  {"個人利用で予約する"}
                </Button>
              </ReservationModal>
            </div>
          </div>

          {/* Event */}
          <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative h-56">
              <Image
                src="/images/event-scene.jpg"
                alt="アウトドアイベントでドラム缶風呂を楽しむグループ"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(210,40%,12%)]/70 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <PartyPopper className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-lg font-bold text-[hsl(0,0%,100%)]">{"イベント・法人向け"}</span>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-muted-foreground leading-relaxed">
                {"企業研修、地域のお祭り、音楽フェス、ウェディングパーティーに。複数缶の設置と専任スタッフ同行も可能です。"}
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "企業研修・チームビルディングに",
                  "地域の祭り・フェスの目玉コンテンツに",
                  "結婚式の二次会・パーティーに",
                  "専任スタッフ同行で安心運営",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <ReservationModal>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-5 rounded-xl mt-2">
                  {"イベント利用で予約する"}
                </Button>
              </ReservationModal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
