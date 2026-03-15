import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What Is a Bad CSA Score? - Axesntra',
  description: 'Carrier review should not depend on one threshold. Ask whether the carrier safety indicators, issue patterns, and trend direction justify concern.',
};

export default function Page() {
  return (
    <ContentPage
      title="What Is a Bad CSA Score?"
      intro="There is no universally useful answer to that question because carrier review should not depend on one threshold in isolation. A more accurate approach is to ask whether the carrier's safety indicators, issue patterns, and trend direction justify concern under your workflow."
      cta={{ href: '/resources', label: 'Browse All Resources' }}
    >
      <h2>Why a single threshold is not enough</h2>
      <p>
        BASIC percentile rankings are relative to a carrier&apos;s peer group and are one of several inputs in the FMCSA Safety Measurement System. A carrier at the 75th percentile in one category may or may not be a concern depending on the context: how many inspections are behind that number, what other categories look like, and whether the trend is stable, improving, or worsening.
      </p>
      <p>
        Teams that set one rigid threshold — such as declining any carrier above a specific BASIC percentile — may be creating false confidence. They may reject carriers that are improving and accept carriers that are worsening, because the threshold does not account for direction.
      </p>

      <h2>Better question to ask</h2>
      <p>
        Instead of asking &quot;what is a bad CSA score?&quot;, a more productive question is: &quot;Does this carrier&apos;s overall profile — across inspection history, crash exposure, OOS rates, trend direction, and operating status — present enough concern to warrant deeper review, monitoring, or a different decision?&quot;
      </p>
      <p>
        That framing leads to better outcomes because it accounts for the full picture rather than a single data point. Carrier risk intelligence is designed to support exactly that kind of structured, multi-factor evaluation.
      </p>
    </ContentPage>
  );
}
