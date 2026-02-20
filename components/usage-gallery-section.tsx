import Image from "next/image"
import { Camera } from "lucide-react"

export function UsageGallerySection() {
  return (
    <section id="gallery" className="bg-[hsl(210,40%,96%)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[hsl(210,40%,12%)] rounded-full mb-6">
            <Camera className="w-6 h-6 text-[hsl(0,0%,100%)]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[hsl(210,40%,12%)] mb-4">
            実際の使用風景
          </h2>
          <p className="text-[hsl(210,40%,40%)] max-w-2xl mx-auto">
            ドラム缶風呂でのリラックスタイムをお楽しみいただけます
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/usage-1.jpg"
              alt="ドラム缶風呂での入浴風景"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/usage-2.jpg"
              alt="ドラム缶風呂でのリラックスタイム"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
