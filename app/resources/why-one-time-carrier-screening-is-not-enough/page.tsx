import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why One-Time Carrier Screening Is Not Enough - Axesntra',
  description: 'One-time carrier screening is better than no screening, but it does not solve ongoing risk. A carrier profile can change after onboarding.',
};

export default function Page() {
  return (
    <ContentPage
      title="Why One-Time Carrier Screening Is Not Enough"
      intro="One-time carrier screening is better than no screening, but it does not solve ongoing risk. A carrier's profile can change after onboarding, and those changes may be exactly what matters most."
      cta={{ href: '/early-access', label: 'Request Early Access' }}
      relatedAIQuestions={[
        'Has this carrier deteriorated since we last screened them?',
        'What changed in the last 90 days?',
        'Should we re-screen this carrier before renewal?',
      ]}
    >
      <h2>What one-time screening misses</h2>
      <p>
        A one-time check captures the carrier&apos;s profile at a single point. It does not capture what happens next. New inspections may reveal emerging maintenance problems. Crash activity may increase. OOS rates may rise. Regulatory actions may be initiated. None of these changes will appear in a screening result that was pulled six or twelve months ago.
      </p>

      <h2>Why this matters operationally</h2>
      <p>
        Teams that rely on one-time screening are making ongoing decisions — about which carriers to assign loads to, which accounts to renew, which vendors to keep approved — using outdated information. The gap between the screening date and the decision date is where unmanaged risk lives.
      </p>
      <p>
        This matters most for insurance teams managing books of business, brokers moving freight daily, and risk leaders who need to demonstrate that their review process is current.
      </p>

      <h2>What continuous review adds</h2>
      <p>
        Continuous or periodic re-screening addresses the gap by monitoring for material changes. It does not require reviewing every carrier from scratch. Instead, it flags the carriers whose profiles have changed enough to warrant attention. That might mean a new crash event, a rising OOS rate, a worsening trend score, or a change in operating status.
      </p>
      <p>
        The goal is not to review more carriers. The goal is to review the right carriers at the right time — when something has changed that affects the risk decision.
      </p>

      <h2>Bottom line</h2>
      <p>
        One-time screening establishes a baseline. Ongoing monitoring protects the decision that was made using that baseline. Both are necessary. Teams that invest only in the initial screen are leaving the most dynamic part of the risk lifecycle unmanaged.
      </p>
    </ContentPage>
  );
}
