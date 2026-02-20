import Image from "next/image"
import { Camera } from "lucide-react"

export function UsageGallerySection() {
  return (
    <section id="gallery" className="bg-[hsl(210,40%,96%)] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2.5 bg-[hsl(210,40%,12%)] rounded-full mb-5">
            <Camera className="w-5 h-5 text-[hsl(0,0%,100%)]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[hsl(210,40%,12%)] mb-3">
            実際の使用風景
          </h2>
          <p className="text-[hsl(210,40%,40%)] max-w-xl mx-auto text-sm">
            ドラム缶風呂でのリラックスタイムをお楽しみいただけます
          </p>
        </div>

        <div className="flex justify-center gap-4 md:gap-6">
          <div className="relative w-32 h-40 md:w-40 md:h-48 rounded-lg overflow-hidden shadow-md border-2 border-white/50">
            <Image
              src="/images/usage-1.jpg"
              alt="ドラム缶風呂での入浴風景"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>
          <div className="relative w-32 h-40 md:w-40 md:h-48 rounded-lg overflow-hidden shadow-md border-2 border-white/50">
            <Image
              src="/images/usage-2.jpg"
              alt="ドラム缶風呂でのリラックスタイム"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
