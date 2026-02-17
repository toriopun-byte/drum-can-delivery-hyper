"use client"

import Image from "next/image"
import { Logo } from "@/components/logo"
import { ReservationModal } from "@/components/reservation-modal"
import { Button } from "@/components/ui/button"
import { ChevronDown, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-outdoor.jpg"
          alt="長野県の大自然でドラム缶風呂体験"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(210,40%,12%)]/70 via-[hsl(210,40%,12%)]/50 to-[hsl(210,40%,12%)]/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Logo */}
          <Logo size="hero" alt="ドラム缶風呂デリバリー 裸一缶 ロゴ" priority />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-[hsl(0,0%,100%)] rounded-full px-4 py-2 text-sm font-semibold backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            {"長野県限定サービス"}
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[hsl(0,0%,100%)] text-balance leading-tight">
              {"大自然の中で、"}
              <br />
              <span className="text-accent">{"ドラム缶風呂"}</span>
              {"を楽しもう"}
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-[hsl(0,0%,100%)]/80 leading-relaxed">
              {"本格ドラム缶風呂一式レンタル「裸一缶」。"}
              <br className="hidden md:block" />
              {"キャンプ場に、川辺に、お庭に。セルフスタイルで最高の思い出を。"}
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <ReservationModal>
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-base font-bold px-10 py-7 rounded-xl shadow-lg shadow-accent/30 text-lg"
              >
                {"カレンダーから予約する"}
              </Button>
            </ReservationModal>
            <a
              href="#service"
              className="text-sm font-medium text-[hsl(0,0%,100%)]/70 hover:text-[hsl(0,0%,100%)] transition-colors flex items-center gap-1"
            >
              {"サービスを詳しく見る"}
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
            fill="hsl(210 40% 98%)"
          />
        </svg>
      </div>
    </section>
  )
}
