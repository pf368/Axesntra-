import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What Does Out-of-Service Mean in Trucking? - Axesntra',
  description: 'Out-of-service means a driver, vehicle, or operating condition was serious enough that operation could not continue until the issue was corrected.',
};

export default function Page() {
  return (
    <ContentPage
      title="What Does Out-of-Service Mean in Trucking?"
      intro="Out-of-service means a driver, vehicle, or operating condition was serious enough that operation could not continue until the issue was corrected. In carrier risk review, out-of-service history often signals more serious breakdowns than routine administrative findings."
      cta={{ href: '/sample-report', label: 'View Sample Report' }}
    >
      <h2>Why it matters</h2>
      <p>
        Not all inspection violations result in an out-of-service order. An OOS event means the violation was severe enough that the inspector determined continued operation would create an imminent hazard. That distinction is important. OOS rates above the national average are one of the more reliable signals in carrier risk review.
      </p>
      <p>
        Vehicle OOS events often involve brake defects, tire failures, or lighting issues. Driver OOS events often involve hours-of-service violations, license or endorsement issues, or substance-related findings. Both categories indicate failures that are more serious than routine paperwork gaps.
      </p>

      <h2>How to evaluate out-of-service history</h2>
      <p>
        Start with the OOS rate, which is the percentage of inspections that result in an out-of-service order. Compare the carrier&apos;s rate to the national average. Then look at volume: a carrier with a 30% vehicle OOS rate across 20 inspections is showing a more reliable pattern than one with the same rate across 2 inspections.
      </p>
      <p>
        Look at the trend as well. A carrier whose OOS rate is rising over the past 12 months may be heading toward a worse outcome even if the current rate appears borderline.
      </p>

      <h2>One event vs repeated events</h2>
      <p>
        A single OOS event may be a one-time issue. It could reflect unusual circumstances or a recently acquired vehicle that had not yet been inspected. Repeated OOS events in the same category are a different signal. They suggest a systemic gap — in maintenance, in driver management, or in operational oversight — that is unlikely to resolve without deliberate action.
      </p>

      <h2>Practical takeaway</h2>
      <p>
        Out-of-service history is one of the most direct indicators of operational risk in a carrier&apos;s public profile. It deserves weight in any carrier review workflow. Teams that track OOS rates, compare them to benchmarks, and evaluate trend direction will have a more accurate view of exposure than those that focus only on crash counts or authority status.
      </p>
    </ContentPage>
  );
}
