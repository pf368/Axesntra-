import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scoring Methodology - Axesntra',
  description: 'Understand what each score component measures in the Axesntra model, how it is meant to be used, and where public-data limits still apply.',
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-4xl font-bold mb-4">Scoring Methodology</h1>
          <p className="text-lg text-slate-300 max-w-3xl">
            Understand what each score component measures, how the model is meant to be used, and where public-data limits still apply.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-16">
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">What the score is for</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Axesntra is designed to help users interpret public carrier data more consistently. The Axesntra scoring model does not rely on one metric alone. It evaluates multiple signal categories together — including maintenance, crash, driver, hazmat, trend, and administrative indicators — to identify carriers that may require closer review.
          </p>
          <p className="text-slate-700 leading-relaxed">
            The score is a decision-support tool. It is meant to help underwriters, brokers, risk managers, and transportation teams evaluate carriers faster and with more structure. It does not replace internal judgment, underwriting policy, or operational standards. It supports them.
          </p>
        </Card>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Score components</h2>
          <p className="text-slate-600 mb-6">
            Each component contributes a weighted share to the overall carrier risk score. The weights reflect the relative importance of each category in predicting operational and safety exposure.
          </p>
          <div className="space-y-4">
            {[
              {
                name: 'Maintenance Risk',
                weight: '30%',
                desc: 'Vehicle out-of-service rates, inspection findings, and equipment condition patterns. This is the highest-weighted category because maintenance issues are among the most consistent leading indicators of operational risk.',
              },
              {
                name: 'Crash Risk',
                weight: '20%',
                desc: 'Crash frequency, severity indicators, and crash-related BASIC percentiles. Crash history reflects direct loss exposure and is a primary concern for insurance and brokerage teams.',
              },
              {
                name: 'Driver Risk',
                weight: '15%',
                desc: 'Driver out-of-service rates, hours-of-service compliance, and driver-related violation patterns. Driver behavior and qualification issues often compound other risk factors.',
              },
              {
                name: 'Hazmat Risk',
                weight: '15%',
                desc: 'Hazmat BASIC percentile and hazmat-specific inspection findings. Relevant for carriers with hazmat endorsements, where violations carry elevated regulatory and exposure consequences.',
              },
              {
                name: 'Trend Risk',
                weight: '15%',
                desc: '12-month trajectory across key indicators, weighted by recency. A carrier with stable current metrics but a worsening trend may warrant earlier re-review than one with elevated but improving metrics.',
              },
              {
                name: 'Administrative Freshness',
                weight: '5%',
                desc: 'MCS-150 currency and operational data completeness. Stale filings do not directly cause safety events, but they often correlate with carriers that are less engaged with compliance obligations.',
              },
            ].map((item) => (
              <div key={item.name} className="flex items-start gap-4 p-5 bg-slate-50 rounded-lg">
                <div className="w-16 text-center flex-shrink-0">
                  <span className="text-lg font-bold text-slate-900">{item.weight}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">How to interpret the score</h2>
          <div className="space-y-6">
            <div className="p-5 bg-emerald-50 rounded-lg border border-emerald-100">
              <h3 className="font-semibold text-emerald-900 mb-2">Low risk</h3>
              <p className="text-sm text-emerald-800 leading-relaxed">
                The carrier&apos;s public safety and operating indicators are generally within acceptable ranges. No individual category is flagged as a primary concern. Trend direction is stable or improving. Low-risk carriers may still warrant periodic re-review, but they do not typically require immediate intervention.
              </p>
            </div>
            <div className="p-5 bg-amber-50 rounded-lg border border-amber-100">
              <h3 className="font-semibold text-amber-900 mb-2">Moderate risk</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                One or more signal categories show elevated readings. The carrier may have above-average out-of-service rates, a recent uptick in inspection findings, or a worsening trend in a key area. Moderate-risk carriers deserve closer review and may be candidates for a watchlist, conditional approval, or additional documentation.
              </p>
            </div>
            <div className="p-5 bg-red-50 rounded-lg border border-red-100">
              <h3 className="font-semibold text-red-900 mb-2">High risk</h3>
              <p className="text-sm text-red-800 leading-relaxed">
                Multiple categories are elevated, or one category is significantly outside normal bounds. The carrier&apos;s profile suggests material safety or operating exposure. High-risk carriers typically warrant escalation, detailed review, or potential declination depending on the team&apos;s internal policy and risk appetite.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Why trends matter</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A carrier&apos;s current metrics tell part of the story. Trend direction tells the rest. A carrier with moderate metrics today may be on a clear worsening trajectory. Another carrier with slightly elevated metrics may be actively improving.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Axesntra calculates trend direction over a rolling 12-month window, weighted so that recent changes carry more influence than older data points. This helps surface carriers that are deteriorating before they reach a critical threshold, and gives credit to carriers that are making measurable improvements.
          </p>
        </Card>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Primary data sources</h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
              <span>FMCSA Safety Measurement System (SMS) — inspection results, violation records, and BASIC percentile rankings</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
              <span>FMCSA Census / MCS-150 filings — carrier identity, operating status, fleet size, and filing currency</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
              <span>Roadside inspection records — vehicle and driver out-of-service rates, inspection counts, and violation details</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
              <span>Crash reports (MCMIS) — crash frequency, DOT-recordable events, and severity indicators</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
              <span>BASIC percentile rankings — relative positioning across safety categories compared to carrier peer groups</span>
            </li>
          </ul>
        </Card>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Limitations and disclaimer</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Public data has limitations. Not all carrier activity is captured in public records. Inspection rates vary by geography and enforcement patterns. Crash data may be incomplete or subject to reporting lag. Small carriers with few inspections may have less statistical reliability in their metrics.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            This scoring methodology is for internal screening purposes and decision support. It is not an official FMCSA safety rating, a legal opinion, an underwriting decision, or a guarantee of future carrier performance.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Users should apply their own internal judgment, underwriting policy, and operational standards when making business decisions. Axesntra is designed to make that process faster and more consistent, not to replace it.
          </p>
        </Card>

        <div className="text-center pt-4">
          <p className="text-slate-600 mb-4">See how this methodology applies in practice.</p>
          <Link
            href="/sample-report"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            View Sample Report
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
