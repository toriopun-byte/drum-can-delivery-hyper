export default function StructuredData() {
  const businessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: '裸一缶',
    description: '長野県限定の本格ドラム缶風呂機材レンタルサービス。大自然の中で最高のアウトドアバス体験を。',
    url: 'https://candeli.jp',
    telephone: '080-2590-7736',
    email: 'drumcandelivery@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
      addressRegion: '長野県',
      addressLocality: '伊那市',
      streetAddress: '信州大学周辺',
    },
    openingHours: 'Mo-Su 09:00-17:00',
    priceRange: '8000円〜',
    category: 'レンタルサービス',
    image: 'https://candeli.jp/og-image.jpg',
    sameAs: 'https://candeli.jp',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }}
    />
  )
}
