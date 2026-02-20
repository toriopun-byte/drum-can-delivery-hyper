import React from "react"
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import StructuredData from '@/components/structured-data'
import './globals.css'

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    default: 'ドラム缶風呂一式レンタル 裸一缶 | 長野県限定',
    template: '%s | 裸一缶'
  },
  description: '長野県限定の本格ドラム缶風呂機材レンタルサービス「裸一缶」。セルフスタイルで大自然の中、最高のアウトドアバス体験を。薪、焚き火シート、レンガ等すべて含むお得なレンタルプラン。',
  keywords: [
    'ドラム缶風呂',
    'ドラム缶',
    '風呂',
    'レンタル',
    '長野県',
    'アウトドア',
    'キャンプ',
    '裸一缶',
    'セルフ風呂',
    '焚き火',
    '薪',
    '自然',
    'リラックス',
    '温泉',
    '露天風呂'
  ],
  authors: [{ name: '裸一缶' }],
  creator: '裸一缶',
  publisher: '裸一缶',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://candeli.jp'),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://candeli.jp',
    title: 'ドラム缶風呂一式レンタル 裸一缶 | 長野県限定',
    description: '長野県限定の本格ドラム缶風呂機材レンタルサービス。大自然の中で最高のアウトドアバス体験を。',
    siteName: '裸一缶',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ドラム缶風呂レンタル 裸一缶',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ドラム缶風呂一式レンタル 裸一缶 | 長野県限定',
    description: '長野県限定の本格ドラム缶風呂機材レンタルサービス。大自然の中で最高のアウトドアバス体験を。',
    images: ['/og-image.jpg'],
    creator: '@hadacandi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <StructuredData />
      </head>
      <body className={`${notoSansJP.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
