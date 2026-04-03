import { ContentPage } from '@/components/content-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Read a Carrier Risk Report - Axesntra',
  description: 'A carrier risk report should help users answer three questions: what is the overall risk level, what is driving that risk, and what action should be taken next.',
};

export default function Page() {
  return (
    <ContentPage
      title="How to Read a Carrier Risk Report"
      intro="A carrier risk report should help users answer three questions quickly: what is the overall risk level, what is driving that risk, and what action should be taken next. The goal is not just to display data. The goal is to support a decision."
      cta={{ href: '/sample-report', label: 'See a live demo' }}
      relatedAIQuestions={[
        'What does the risk score mean for this carrier?',
        'Which section of the report should I focus on first?',
        'How do I interpret the BASIC percentile bars?',
      ]}
    >
      <h2>Start with the overall score</h2>
      <p>
        The overall risk score gives you the fastest read on the carrier. It is not the whole story, but it tells you whether the carrier is generally in range or whether the profile needs closer attention. Low, moderate, elevated, and severe ratings each correspond to different levels of scrutiny.
      </p>

      <h2>Review issue-level drivers</h2>
      <p>
        After the overall score, look at what is driving it. A carrier rated as elevated risk might be there because of high vehicle out-of-service rates, or because of a crash trend, or because of a combination of factors. Understanding which categories are contributing the most helps determine what kind of follow-up makes sense.
      </p>
      <p>
        Risk driver details should include both the category and the specific indicators that are pushing the score. A good report does not just say a carrier has maintenance risk. It says why and what the data shows.
      </p>

      <h2>Use the 12-month trend section</h2>
      <p>
        Trend direction is one of the most underused parts of a carrier risk report. A carrier with moderate risk today could be heading in either direction. If key indicators have been worsening for the last several months, the carrier may cross into higher-risk territory soon. If the carrier is improving, the current score may overstate the real concern.
      </p>

      <h2>Read the memo, not just the tables</h2>
      <p>
        If the report includes an executive memo or AI summary, read it. Summaries are designed to translate data into plain-language context. They are especially useful when passing the report to someone who may not be familiar with FMCSA metrics — such as a senior underwriter, a risk committee, or a broker team lead.
      </p>

      <h2>End with action</h2>
      <p>
        A good carrier risk report should make it clear what the next step is. That might be approval, conditional approval, watchlist placement, escalation for deeper review, or declination. Fix plans and remediation guidance help translate risk findings into specific operational steps when the goal is to help the carrier improve.
      </p>
    </ContentPage>
  );
}
