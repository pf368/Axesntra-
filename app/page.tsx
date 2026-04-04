import { HeroSection } from '@/components/hero-section';
import { UsdotSearch } from '@/components/usdot-search';
import { BeforeAfter } from '@/components/before-after';
import { HowItWorks } from '@/components/how-it-works';
import { InteractiveReportPreview } from '@/components/interactive-report-preview';
import { ProactiveMonitoring } from '@/components/proactive-monitoring';
import { PersonaCards } from '@/components/persona-cards';
import { CaseStudy } from '@/components/case-study';
import { MidFunnelOffers } from '@/components/mid-funnel-offers';
import { FinalCTA } from '@/components/final-cta';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <UsdotSearch />
      <BeforeAfter />
      <HowItWorks />
      <InteractiveReportPreview />
      <ProactiveMonitoring />
      <PersonaCards />
      <CaseStudy />
      <MidFunnelOffers />
      <FinalCTA />
    </div>
  );
}
