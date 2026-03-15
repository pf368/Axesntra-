import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What Does a Conditional Safety Rating Mean? - Axesntra',
  description: 'A conditional safety rating signals that a carrier does not currently meet the standard for a satisfactory rating and warrants concern.',
};

export default function Page() {
  return (
    <ContentPage
      title="What Does a Conditional Safety Rating Mean?"
      intro="A conditional safety rating generally signals that a carrier does not currently meet the standard expected for a satisfactory rating and that the carrier's safety profile warrants concern. In practical screening, a conditional rating should usually trigger secondary review rather than be ignored."
      cta={{ href: '/resources', label: 'Browse All Resources' }}
    >
      <h2>Why it matters</h2>
      <p>
        FMCSA assigns safety ratings based on compliance reviews. A &quot;satisfactory&quot; rating means the carrier met the applicable standards during the review. A &quot;conditional&quot; rating means deficiencies were found that the carrier needs to address. An &quot;unsatisfactory&quot; rating means the carrier failed to meet safety fitness standards.
      </p>
      <p>
        A conditional rating is not the same as being shut down, but it is a clear signal. It means the carrier has known gaps that FMCSA expects to be corrected. For underwriters, brokers, and risk managers, a conditional rating is relevant context that should inform the review — especially when combined with other elevated indicators like high OOS rates or worsening trends.
      </p>

      <h2>Practical takeaway</h2>
      <p>
        Do not ignore a conditional rating, and do not treat it as disqualifying by itself. Instead, use it as one signal within the broader carrier review. If the conditional rating is the only concern — and all other indicators are stable — the carrier may still be appropriate depending on your policy. If the conditional rating appears alongside other red flags, the combined picture strengthens the case for closer scrutiny or declination.
      </p>
    </ContentPage>
  );
}
