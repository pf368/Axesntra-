import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crash History vs Inspection History: What Matters More? - Axesntra',
  description: 'Neither crash history nor inspection history should be treated as sufficient on its own. They answer different questions about carrier risk.',
};

export default function Page() {
  return (
    <ContentPage
      title="Crash History vs Inspection History: What Matters More?"
      intro="Neither crash history nor inspection history should be treated as sufficient on its own. They answer different questions. Crash history reflects loss exposure. Inspection history often shows the operational pattern that may help explain risk before more serious outcomes occur."
      cta={{ href: '/sample-report', label: 'See a live demo' }}
      relatedAIQuestions={[
        'How many crashes has this carrier had in the last 24 months?',
        'Is the crash rate worsening or improving?',
        'How does their inspection history compare to similar carriers?',
      ]}
    >
      <h2>Why inspection history matters</h2>
      <p>
        Inspection results provide a higher-frequency signal than crashes. Most carriers have more inspections than crashes, which means inspection data typically has more statistical weight. High out-of-service rates, recurring violations in the same category, and poor overall inspection performance are often leading indicators of deeper operational issues.
      </p>
      <p>
        Inspection history is especially useful for identifying patterns. A carrier with repeated brake defects, for example, is showing a maintenance pattern that is likely to persist unless something changes.
      </p>

      <h2>Why crash history matters</h2>
      <p>
        Crash history matters because it reflects what has already happened. A crash is a realized loss event. Multiple crashes in a short window signal that something in the carrier&apos;s operation is producing outcomes, not just indicators.
      </p>
      <p>
        For insurance teams in particular, crash frequency is directly tied to claims exposure. Even when inspections look acceptable, a carrier with multiple recent crashes may warrant closer review.
      </p>

      <h2>When inspections may be more useful</h2>
      <p>
        Inspections are generally more useful when evaluating smaller carriers with limited crash data, when trying to identify leading indicators before claims develop, and when comparing carriers in the same peer group. Inspection patterns often surface risk earlier than crash events.
      </p>

      <h2>When crash history may matter more</h2>
      <p>
        Crash history may carry more weight when evaluating carriers with significant fleet activity, when making underwriting decisions where loss frequency is a primary concern, and when reviewing carriers where crashes have occurred despite otherwise acceptable inspection metrics.
      </p>

      <h2>Better question, better workflow</h2>
      <p>
        The better question is not which metric matters more. It is how both are being used together. Carrier risk intelligence evaluates inspection history and crash history alongside trend direction, OOS rates, and other factors. That combination produces a more complete and defensible risk view than either metric alone.
      </p>
    </ContentPage>
  );
}
