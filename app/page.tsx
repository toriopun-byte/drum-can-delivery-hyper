import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ServiceDetailSection } from "@/components/service-detail-section"
import { TargetSection } from "@/components/target-section"
import { UsageGallerySection } from "@/components/usage-gallery-section"
import { CalendarSection } from "@/components/calendar-section"
import { PricingSection } from "@/components/pricing-section"
import { HowtoSection } from "@/components/howto-section"
import { FaqSection } from "@/components/faq-section"
import { AreaSection } from "@/components/area-section"
import { DisclaimerSection } from "@/components/disclaimer-section"
import { InquirySection } from "@/components/inquiry-section"
import { SiteFooter } from "@/components/site-footer"
import { PageToc } from "@/components/page-toc"

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <PageToc />
      <HeroSection />
      <FeaturesSection />
      <ServiceDetailSection />
      <TargetSection />
      <UsageGallerySection />
      <CalendarSection />
      <PricingSection />
      <AreaSection />
      <HowtoSection />
      <FaqSection />
      <DisclaimerSection />
      <InquirySection />
      <SiteFooter />
    </main>
  )
}
