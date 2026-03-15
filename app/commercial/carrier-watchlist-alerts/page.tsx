import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrier Watchlist Alerts - Axesntra',
  description: 'Carrier watchlists help teams track carriers that warrant closer scrutiny with a middle state between approval and rejection.',
};

export default function Page() {
  return (
    <ContentPage
      title="Carrier Watchlist Alerts"
      intro="Carrier watchlists help teams track carriers that may not be immediately disqualified but still warrant closer scrutiny. A watchlist creates a middle state between approval and rejection, which is where many real-world review decisions belong."
      cta={{ href: '/early-access', label: 'Request Early Access' }}
    >
      <h2>Why watchlists matter</h2>
      <p>
        Not every carrier review ends with a clear approve or decline. Many carriers present a mixed picture: some indicators are acceptable while others are borderline. A watchlist gives teams a structured way to manage those cases rather than defaulting to either full approval or outright rejection.
      </p>
      <p>
        Without a watchlist process, borderline carriers tend to get approved by default — because declining requires more justification — and then go unmonitored. The watchlist addresses that gap by creating a defined status with a defined review cadence.
      </p>

      <h2>Common reasons to add a carrier to a watchlist</h2>
      <p>
        Teams typically place carriers on a watchlist when one or more of the following conditions apply:
      </p>
      <ul>
        <li>Out-of-service rates are above the national average but not at extreme levels</li>
        <li>A recent crash event occurred, but the broader profile is otherwise acceptable</li>
        <li>Trend direction is worsening across one or more key categories</li>
        <li>The carrier has a conditional safety rating</li>
        <li>MCS-150 filing is stale, suggesting reduced compliance engagement</li>
        <li>The carrier was previously flagged but conditions have partially improved</li>
      </ul>
      <p>
        Axesntra supports watchlist workflows by identifying carriers whose profiles have changed and surfacing the specific indicators that triggered the change. That helps teams focus their review effort on the carriers that most need attention, rather than re-reviewing the entire panel manually.
      </p>
    </ContentPage>
  );
}
