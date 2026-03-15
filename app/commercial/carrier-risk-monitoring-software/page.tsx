import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrier Risk Monitoring Software - Axesntra',
  description: 'Track how a carrier safety and operating profile changes over time with carrier risk monitoring software built for insurance and freight teams.',
};

export default function Page() {
  return (
    <ContentPage
      title="Carrier Risk Monitoring Software"
      intro="Carrier risk monitoring software helps teams track how a carrier's safety and operating profile changes over time. Instead of relying on one-time screening, it highlights new events, worsening patterns, and issue-level signals that may justify review or action."
      cta={{ href: '/early-access', label: 'Request Early Access' }}
    >
      <h2>Why teams need it</h2>
      <p>
        Most carrier screening workflows focus on the initial review. That creates a gap between the point of approval and the ongoing exposure that carrier represents. New inspections, crash events, OOS orders, and worsening trend patterns can develop after the initial check — and those changes may be exactly the signals that matter most.
      </p>
      <p>
        Carrier risk monitoring software closes that gap by continuously evaluating the carrier&apos;s profile against defined thresholds and surfacing material changes when they occur.
      </p>

      <h2>What the software helps you monitor</h2>
      <p>
        Effective carrier risk monitoring includes:
      </p>
      <ul>
        <li>Changes in vehicle and driver out-of-service rates</li>
        <li>New crash events and changes in crash frequency</li>
        <li>Worsening trend direction across inspection, crash, and compliance categories</li>
        <li>Operating authority changes or regulatory actions</li>
        <li>MCS-150 filing lapses and administrative staleness</li>
      </ul>

      <h2>What teams can do with it</h2>
      <p>
        With ongoing monitoring, teams can identify deteriorating carriers before they reach critical thresholds, make re-review decisions based on current data rather than stale snapshots, maintain audit trails that document how risk was managed over time, and allocate review effort toward the carriers that most need attention.
      </p>

      <h2>Who it is for</h2>
      <p>
        Carrier risk monitoring software is relevant for insurance teams managing books of business, freight brokers maintaining approved carrier panels, compliance leaders documenting vendor risk management, and transportation operators with recurring carrier relationships.
      </p>
    </ContentPage>
  );
}
