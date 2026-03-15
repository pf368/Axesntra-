import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrier Screening for Underwriters - Axesntra',
  description: 'Carrier screening for underwriters requires understanding both current risk and directional risk to make informed coverage decisions.',
};

export default function Page() {
  return (
    <ContentPage
      title="Carrier Screening for Underwriters"
      intro="Carrier screening for underwriters requires more than a quick look at a carrier's public record. The objective is to understand both current risk and directional risk: what the carrier looks like now, what is driving concern, and whether the profile is improving or deteriorating."
      cta={{ href: '/early-access', label: 'Request Early Access' }}
    >
      <h2>What underwriters need from carrier screening</h2>
      <p>
        Underwriters evaluating trucking and transportation accounts need a way to quickly assess whether a carrier&apos;s safety profile supports the risk being considered. That means going beyond a single number or authority status check.
      </p>
      <p>
        Effective carrier screening for underwriting includes:
      </p>
      <ul>
        <li>Multi-factor risk scoring that considers maintenance, crash, driver, hazmat, and trend indicators together</li>
        <li>Clear identification of the top risk drivers and what is contributing most to the overall assessment</li>
        <li>12-month trend analysis to distinguish between carriers that are stable and those that are worsening</li>
        <li>Executive-level summaries that can be reviewed quickly and shared with underwriting committees</li>
        <li>Remediation guidance that helps underwriters understand what would need to change for the risk profile to improve</li>
      </ul>

      <h2>What this platform provides</h2>
      <p>
        Axesntra produces a structured risk brief for any USDOT number. The brief includes an overall risk score, category-level breakdowns, trend charts, an executive memo, and remediation guidance. It is designed to support the underwriting review process — not replace it — by giving underwriters a faster, more consistent way to interpret public carrier data.
      </p>
      <p>
        For accounts that require deeper review, the brief provides the structured foundation that supports more detailed investigation. For routine screening, it provides enough context to make a confident initial decision without manually assembling data from multiple sources.
      </p>
    </ContentPage>
  );
}
