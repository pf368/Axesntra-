import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Do You Check If a Carrier Is Safe? - Axesntra',
  description: 'Check carrier safety by reviewing inspection history, crash exposure, out-of-service events, operating status, and trend direction together.',
};

export default function Page() {
  return (
    <ContentPage
      title="How Do You Check If a Carrier Is Safe?"
      intro="Check whether a carrier is safe by reviewing inspection history, crash exposure, out-of-service events, operating status, and trend direction together. The objective is to identify both current risk and any meaningful sign of deterioration."
      cta={{ href: '/sample-report', label: 'View Sample Report' }}
    >
      <h2>Fast answer</h2>
      <p>
        Pull the carrier&apos;s public profile using their USDOT number. Look at their overall inspection results, crash history, OOS rates, and trend direction over the most recent 12 months. Compare those indicators to national averages and to your internal review criteria.
      </p>

      <h2>What to review</h2>
      <p>
        A complete carrier safety check should include:
      </p>
      <ul>
        <li>Vehicle and driver out-of-service rates compared to national averages</li>
        <li>Crash frequency over the past 24 months</li>
        <li>Operating authority status (active, inactive, or conditional)</li>
        <li>MCS-150 filing currency</li>
        <li>Trend direction across key indicators</li>
        <li>Any recurring violation patterns in specific categories</li>
      </ul>

      <h2>Better workflow</h2>
      <p>
        The most effective carrier safety checks are not ad hoc. They follow a repeatable process that considers the same categories for every carrier. That creates consistency, makes decisions more defensible, and reduces the risk that something important gets overlooked because one reviewer focused on a different area than another.
      </p>
      <p>
        Axesntra is built to support that kind of structured review. It pulls public data, evaluates multiple risk categories, calculates trend direction, and produces a usable brief — so the reviewer can focus on the decision rather than the data assembly.
      </p>
    </ContentPage>
  );
}
