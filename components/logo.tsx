"use client"

import Image from "next/image"

/** ロゴの位置・拡大率。必要に応じて数値を変更してください */
const LOGO_TRANSFORM = {
  x: 0,   // 横方向の移動（px）
  y: 0,   // 縦方向の移動（px）
  z: 1.35, // 拡大率（1 = 100%、1.25 = 125%）
} as const

type LogoSize = "header" | "hero" | "footer"

const sizeClasses: Record<LogoSize, string> = {
  header: "relative w-9 h-9 overflow-hidden rounded-full",
  hero: "relative w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-[hsl(0,0%,100%)]/30 shadow-2xl overflow-hidden bg-[hsl(0,0%,100%)]",
  footer: "relative w-10 h-10 overflow-hidden rounded-full",
}

const imageSizes: Record<LogoSize, string> = {
  header: "36px",
  hero: "(max-width: 768px) 144px, 176px",
  footer: "45px",
}

interface LogoProps {
  size: LogoSize
  alt: string
  priority?: boolean
}

export function Logo({ size, alt, priority }: LogoProps) {
  const { x, y, z } = LOGO_TRANSFORM
  const transformStyle = {
    transform: `translate(${x}px, ${y}px) scale(${z})`,
  }

  return (
    <div className={sizeClasses[size]}>
      <Image
        src="/logo1.png"
        alt={alt}
        fill
        sizes={imageSizes[size]}
        className="object-contain rounded-full"
        style={transformStyle}
        priority={priority}
      />
    </div>
  )
}
