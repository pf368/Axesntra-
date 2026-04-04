import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Build a Carrier Watchlist Process - Axesntra',
  description: 'A carrier watchlist process helps teams handle borderline cases more intelligently with a middle stage between approval and rejection.',
};

export default function Page() {
  return (
    <ContentPage
      title="How to Build a Carrier Watchlist Process"
      intro="A carrier watchlist process helps teams handle borderline cases more intelligently. It creates a middle stage between full approval and outright rejection."
      cta={{ href: '/early-access', label: 'Request Early Access' }}
      relatedAIQuestions={[
        'Which carriers in my book should be on a watchlist?',
        'What triggers should I set for monitoring alerts?',
        'How often should I re-review watchlisted carriers?',
      ]}
    >
      <h2>Step 1: Define watchlist criteria</h2>
      <p>
        Start by defining what conditions should place a carrier on the watchlist. Common criteria include: OOS rates above a defined threshold, a recent crash event, a worsening trend over the prior quarter, a conditional safety rating, or any combination of indicators that creates concern without meeting the standard for immediate removal.
      </p>
      <p>
        The criteria should be specific enough to be applied consistently across reviewers. Avoid subjective standards like &quot;seems risky&quot; — instead, tie watchlist placement to measurable indicators.
      </p>

      <h2>Step 2: Define review cadence</h2>
      <p>
        Determine how often watchlisted carriers will be re-reviewed. Monthly or quarterly review cadences are common. The cadence should be frequent enough to catch material changes but not so frequent that it overwhelms the team. Automated monitoring can help by flagging only those carriers whose profiles have actually changed since the last review.
      </p>

      <h2>Step 3: Define escalation thresholds</h2>
      <p>
        Establish clear criteria for what would move a carrier from the watchlist to a more serious status. That might be a second OOS event in the same category, a new crash, a continued worsening trend over two consecutive review periods, or any material change in operating status.
      </p>
      <p>
        Conversely, define what would move a carrier off the watchlist in a positive direction. If the carrier&apos;s indicators have improved and stabilized over a defined period, they should be eligible for return to standard status.
      </p>

      <h2>Step 4: Document outcomes</h2>
      <p>
        Every watchlist review should end with a documented outcome: remain on watchlist, escalate to restricted or declined status, or return to standard approval. Include the data that supported the decision. This documentation serves as both an operational record and a compliance artifact that demonstrates the team&apos;s risk management discipline.
      </p>
    </ContentPage>
  );
}
