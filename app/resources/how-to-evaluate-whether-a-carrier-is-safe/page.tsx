import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Evaluate Whether a Carrier Is Safe - Axesntra',
  description: 'Review inspection history, crash activity, out-of-service events, operating status, and trend direction together to evaluate carrier safety.',
};

export default function Page() {
  return (
    <ContentPage
      title="How to Evaluate Whether a Carrier Is Safe"
      intro="The most reliable way to evaluate whether a carrier is safe is to review several signals together rather than relying on one metric in isolation. Inspection history, crash activity, out-of-service events, operating status, and trend direction all matter."
      cta={{ href: '/sample-report', label: 'See a live demo' }}
      relatedAIQuestions={[
        'Is this carrier safe to use on our freight?',
        'How does this carrier compare to the industry benchmark?',
        "What's their 12-month trend telling me?",
      ]}
    >
      <h2>Start with inspection history</h2>
      <p>
        Inspection history provides the broadest view of a carrier&apos;s operational discipline. Look at both the volume of inspections and the results. A carrier with many inspections and low violation rates is demonstrating consistent compliance. A carrier with high out-of-service rates is showing a pattern that deserves closer attention.
      </p>

      <h2>Review crash exposure</h2>
      <p>
        Crash history reflects direct loss exposure. Look at crash frequency over the most recent 24-month period. A single crash may not indicate a systemic problem, but multiple crashes in a short window — especially combined with other elevated indicators — should increase scrutiny.
      </p>

      <h2>Look for out-of-service history</h2>
      <p>
        Out-of-service events mean that a vehicle, driver, or operating condition was serious enough that operation could not continue. OOS rates above the national average are a meaningful signal. Repeated OOS events are a stronger signal.
      </p>

      <h2>Identify patterns, not just events</h2>
      <p>
        A single violation or inspection finding is a data point. Multiple findings in the same category — such as brake defects, hours-of-service violations, or driver qualification issues — form a pattern. Patterns are more predictive than isolated events.
      </p>

      <h2>Check operating status and data freshness</h2>
      <p>
        Verify that the carrier&apos;s operating authority is active and that their MCS-150 filing is current. Stale filings do not directly cause safety events, but they often indicate a carrier that is less engaged with compliance obligations.
      </p>

      <h2>Compare current position to prior trend</h2>
      <p>
        A carrier with moderate metrics today may be on a worsening trajectory. Another carrier with slightly elevated metrics may be actively improving. Trend direction adds context that a snapshot alone cannot provide.
      </p>

      <h2>Practical conclusion</h2>
      <p>
        Evaluating whether a carrier is safe is not about finding one number that answers the question. It is about reviewing several signals together, identifying patterns, understanding trend direction, and applying the results to your team&apos;s review criteria. The more structured the process, the more consistent and defensible the outcome.
      </p>
    </ContentPage>
  );
}
