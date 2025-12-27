// src/app/page.tsx
import { Navbar } from '@/components/layout/Mainnavbar'
import { HeroSection } from '@/components/landing/Hero'
import { CodePreviewSection } from '@/components/landing/CodePreview'
import { FeaturesSection } from '@/components/landing/features'
import { DemoVideoSection } from '@/components/landing/DemoVideo'
import { CtaSection } from '@/components/landing/cta'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-[0.015]" />
      
      <Navbar />
      
      <main className="relative z-10">
        <HeroSection />
        <CodePreviewSection />  
        <FeaturesSection />    
        <DemoVideoSection />    
        <CtaSection />         
      </main>
      
      <Footer />
    </div>
  )
}














