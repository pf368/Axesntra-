import { HeroSection } from '@/components/hero-section';
import { HowItWorks } from '@/components/how-it-works';
import { UsdotSearch } from '@/components/usdot-search';
import { BeforeAfter } from '@/components/before-after';
import { ProductShowcase } from '@/components/product-showcase';
import { FinalCTA } from '@/components/final-cta';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sb-surface">
      <HeroSection />
      <HowItWorks />
      <UsdotSearch />
      <BeforeAfter />
      <ProductShowcase />
      <FinalCTA />
    </div>
  );
}
