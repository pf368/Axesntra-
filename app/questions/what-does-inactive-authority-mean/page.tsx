import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What Does Inactive Authority Mean? - Axesntra',
  description: 'Inactive authority means the carrier operating authority status is not currently active. Pause, verify status, and avoid assuming eligibility.',
};

export default function Page() {
  return (
    <ContentPage
      title="What Does Inactive Authority Mean?"
      intro="Inactive authority means the carrier's operating authority status is not currently active. In screening workflows, that usually means the team should pause, verify status, and avoid assuming the carrier is eligible for normal operations."
      cta={{ href: '/resources', label: 'Browse All Resources' }}
    >
      <h2>Why it matters</h2>
      <p>
        A carrier&apos;s operating authority is the legal foundation for their right to transport freight for hire. When that authority is inactive, the carrier may not be legally operating — or may be in a transitional status such as pending reinstatement, voluntary revocation, or administrative suspension.
      </p>
      <p>
        For brokers, assigning loads to a carrier with inactive authority creates legal and liability exposure. For insurers, binding or maintaining coverage on a carrier with inactive authority may conflict with policy terms. For risk managers, inactive authority is a basic screening flag that should be caught before further review proceeds.
      </p>

      <h2>Operational takeaway</h2>
      <p>
        If a carrier&apos;s authority shows as inactive during a screening check, the default action should be to pause and verify. Determine why the authority is inactive, whether the carrier is taking steps to reinstate, and whether your organization&apos;s policies permit engagement with carriers in that status. In most structured screening workflows, inactive authority is treated as a blocking condition until verified otherwise.
      </p>
    </ContentPage>
  );
}
