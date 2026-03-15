import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What Is a CSA Score? - Axesntra',
  description: 'A CSA score refers to safety-related measurement signals associated with a carrier FMCSA profile. Screening decisions should not rely on one number alone.',
};

export default function Page() {
  return (
    <ContentPage
      title="What Is a CSA Score?"
      intro="A CSA score generally refers to the safety-related measurement signals associated with a carrier's FMCSA profile. In practice, teams use the term to describe how a carrier appears from a safety and enforcement perspective, even though screening decisions should not rely on one number alone."
      cta={{ href: '/resources', label: 'Browse All Resources' }}
    >
      <h2>Why people use the term</h2>
      <p>
        The term &quot;CSA score&quot; is commonly used in insurance, brokerage, and transportation contexts even though there is no single official &quot;CSA score&quot; published by FMCSA. What most people mean when they reference a CSA score is the combination of BASIC percentile rankings, inspection results, and violation data that make up a carrier&apos;s safety profile in the FMCSA Safety Measurement System.
      </p>
      <p>
        Because this data is publicly accessible and widely referenced, the shorthand &quot;CSA score&quot; has become part of the industry vocabulary. The important thing to understand is that it typically refers to a collection of signals, not a single number.
      </p>

      <h2>Better way to use CSA-related information</h2>
      <p>
        Rather than treating any single BASIC percentile as a pass/fail threshold, the more effective approach is to evaluate the carrier&apos;s profile across multiple categories. That includes inspection history, crash exposure, out-of-service rates, and trend direction. A carrier might have a low percentile in one BASIC category and still present elevated risk in another area.
      </p>
      <p>
        Carrier risk intelligence uses CSA-related data as one input among several. The goal is not to replace CSA data, but to put it in context alongside other signals that affect screening and monitoring decisions.
      </p>

      <h2>Practical conclusion</h2>
      <p>
        A &quot;CSA score&quot; is a useful shorthand but should not be treated as a single-number answer to whether a carrier is safe. The more effective approach is to use CSA-related data alongside other indicators — including trend direction, OOS rates, and crash history — in a structured review process.
      </p>
    </ContentPage>
  );
}
