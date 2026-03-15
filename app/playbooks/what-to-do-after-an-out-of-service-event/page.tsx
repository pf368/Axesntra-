import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What to Do After an Out-of-Service Event - Axesntra',
  description: 'An out-of-service event should trigger structured review rather than a casual note in the file. Follow these steps to evaluate and respond.',
};

export default function Page() {
  return (
    <ContentPage
      title="What to Do After an Out-of-Service Event"
      intro="An out-of-service event should trigger structured review rather than a casual note in the file. The event may represent a one-time issue, but it may also indicate a deeper problem."
      cta={{ href: '/early-access', label: 'Request Early Access' }}
    >
      <h2>Step 1: Confirm the event details</h2>
      <p>
        Identify what type of OOS event occurred — vehicle, driver, or hazmat. Review the specific violations cited. Understand whether the event was related to a mechanical defect, a driver qualification issue, an hours-of-service violation, or another category. The type of OOS event determines the appropriate response.
      </p>

      <h2>Step 2: Check for repetition</h2>
      <p>
        A single OOS event could be an isolated incident. But if the carrier has prior OOS events in the same category, the pattern changes the interpretation. Look at the carrier&apos;s OOS rate over the prior 12-24 months. If the rate is above the national average, or if OOS events are recurring in the same category, the signal is stronger than a one-time occurrence.
      </p>

      <h2>Step 3: Review surrounding indicators</h2>
      <p>
        Look at the carrier&apos;s broader risk profile alongside the OOS event. Are inspection results generally acceptable, or are there other elevated categories? Is the carrier&apos;s trend direction stable, improving, or worsening? An OOS event that appears alongside other warning signals is more concerning than one that appears in an otherwise clean profile.
      </p>

      <h2>Step 4: Escalate if needed</h2>
      <p>
        If the OOS event represents part of a pattern, or if the carrier&apos;s broader profile shows elevated risk, escalate the carrier for additional review. That might mean placing the carrier on a watchlist, requiring a corrective action plan, increasing review frequency, or — in more serious cases — suspending the carrier&apos;s approval status until conditions are met.
      </p>

      <h2>Step 5: Decide on action</h2>
      <p>
        The final step is a clear decision. Options include: continue with no change (if the event is isolated and the broader profile is clean), place on watchlist with a defined review date, require corrective action with documentation, restrict load assignments, or remove the carrier from the approved list. Whatever the decision, document the rationale and the supporting data.
      </p>
    </ContentPage>
  );
}
