import React from "react"
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'

import './globals.css'

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'ドラム缶風呂一式レンタル 裸一缶 | 長野県限定',
  description: '長野県限定の本格ドラム缶風呂機材レンタルサービス「裸一缶」。セルフスタイルで大自然の中、最高のアウトドアバス体験を。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
