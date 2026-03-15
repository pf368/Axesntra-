import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrier Vetting Checklist for Brokers - Axesntra',
  description: 'A broker carrier vetting checklist creates a repeatable review standard before a carrier is approved for freight. Build consistency into carrier approval.',
};

export default function Page() {
  return (
    <ContentPage
      title="Carrier Vetting Checklist for Brokers"
      intro="A broker carrier vetting checklist should create a repeatable review standard before a carrier is approved for freight. The goal is consistency. Without a checklist, carrier approval tends to depend too much on time pressure and individual judgment."
      cta={{ href: '/early-access', label: 'Request Early Access' }}
    >
      <h2>Step 1: Verify core carrier identity</h2>
      <p>
        Confirm the carrier&apos;s USDOT number, legal name, and operating authority status. Verify that authority is active and that the carrier is authorized to operate in the relevant capacity (for-hire, contract, etc.). Check the MC number and ensure it corresponds to the entity you are engaging.
      </p>

      <h2>Step 2: Review inspection history</h2>
      <p>
        Pull the carrier&apos;s inspection record and look at both the number of inspections and the results. Calculate or reference the vehicle and driver out-of-service rates. Compare those rates to national averages. A carrier with consistent inspections and low OOS rates is showing better operational discipline than one with limited inspections or elevated rates.
      </p>

      <h2>Step 3: Review crash exposure</h2>
      <p>
        Check the carrier&apos;s crash record over the most recent 24 months. Look at both the count and the frequency relative to fleet size and miles operated, if available. A single crash may not be disqualifying, but multiple crashes in a short window should trigger additional scrutiny.
      </p>

      <h2>Step 4: Check out-of-service history</h2>
      <p>
        Out-of-service events indicate that a vehicle or driver was found to be in a condition that could not continue safely. OOS rates above the national average are a signal. Repeated OOS events in the same category — such as brake defects or HOS violations — suggest a systemic issue rather than an isolated finding.
      </p>

      <h2>Step 5: Check operating status and data freshness</h2>
      <p>
        Verify that the carrier&apos;s MCS-150 filing is current. Stale filings may indicate a carrier that is less engaged with compliance requirements. Also check for any active regulatory actions, alerts, or enforcement cases.
      </p>

      <h2>Step 6: Review trend direction</h2>
      <p>
        Look at how the carrier&apos;s key indicators have changed over the past 12 months. A carrier that is stable or improving across categories is a different risk profile than one that is worsening — even if the current snapshot looks similar. Trend direction helps you catch deterioration early.
      </p>

      <h2>Step 7: Decide and document</h2>
      <p>
        Based on the review, make a clear decision: approve, approve with conditions, place on watchlist, or decline. Document the rationale for the decision and the data that supported it. This documentation protects the brokerage in the event of a later claim or regulatory question and creates an audit trail that demonstrates due diligence.
      </p>
    </ContentPage>
  );
}
