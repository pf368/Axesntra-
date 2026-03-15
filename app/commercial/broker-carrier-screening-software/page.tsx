import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Broker Carrier Screening Software - Axesntra',
  description: 'Replace fragmented manual carrier review with a consistent screening process built around public carrier risk signals for brokerage teams.',
};

export default function Page() {
  return (
    <ContentPage
      title="Broker Carrier Screening Software"
      intro="Broker carrier screening software helps brokerage teams decide whether a carrier should be approved, escalated, monitored, or blocked. It replaces fragmented manual review with a more consistent process built around public carrier risk signals."
      cta={{ href: '/early-access', label: 'Request Early Access' }}
    >
      <h2>Why brokerage workflows break down</h2>
      <p>
        Brokerage teams often need to make carrier decisions quickly. Time pressure, inconsistent review practices, and lack of structured criteria lead to a process where one reviewer may approve a carrier that another would flag. When the process depends entirely on individual judgment applied under pressure, quality varies.
      </p>
      <p>
        The result is uneven risk exposure, difficulty defending decisions after the fact, and no reliable way to know whether the carrier panel as a whole is getting better or worse over time.
      </p>

      <h2>What should be reviewed before approval</h2>
      <p>
        A structured broker carrier screening process should evaluate:
      </p>
      <ul>
        <li>Operating authority status — active, inactive, or conditional</li>
        <li>Vehicle and driver out-of-service rates against national benchmarks</li>
        <li>Crash history over the most recent 24 months</li>
        <li>Trend direction across key safety categories</li>
        <li>MCS-150 filing currency and data completeness</li>
        <li>Any active regulatory actions or enforcement cases</li>
      </ul>

      <h2>What the platform changes</h2>
      <p>
        Axesntra pulls public carrier data, scores it across multiple risk categories, calculates trend direction, and produces an executive-level brief — in one step. Brokerage teams get a structured view of the carrier that supports faster, more consistent decisions without requiring each reviewer to interpret raw FMCSA data independently.
      </p>
      <p>
        The result is a more defensible screening process, more consistent carrier panel quality, and a clear audit trail showing why each carrier was approved, watchlisted, or declined.
      </p>
    </ContentPage>
  );
}
