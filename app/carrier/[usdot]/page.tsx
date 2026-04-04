'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RiskBadge } from '@/components/risk-badge';
import { TrendBadge } from '@/components/trend-badge';
import { MetricCard } from '@/components/metric-card';
import { InsightCard } from '@/components/insight-card';
import { CarrierHeaderCard } from '@/components/carrier-header-card';
import { TrendCharts } from '@/components/trend-charts';
import { FixPlanTable } from '@/components/fix-plan-table';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { EmptyState, ErrorState, SourceUnavailableState, ParseFailedState } from '@/components/empty-state';
import { SourceMetadataCard } from '@/components/source-metadata-card';
import { LookupWarningBanner } from '@/components/lookup-warning-banner';
import { AiSafetyAdvisorPanel } from '@/components/ai-safety-advisor-panel';
import { AiIssueInsightCard } from '@/components/ai-issue-insight-card';
import { AiGuidedPromptPanel } from '@/components/ai-guided-prompt-panel';
import { getAiSafetyInsight, getIssueForRiskDriver } from '@/lib/ai-advisory';
import { formatPercentage, formatDelta } from '@/lib/risk-utils';
import { CarrierBrief } from '@/lib/types';
import {
  ChevronLeft,
  Download,
  Bell,
  Activity,
  TriangleAlert as AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  FileText,
  Info,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useParams, useSearchParams } from 'next/navigation';
import { useWatchlist } from '@/hooks/useWatchlist';

function getContributionColor(contribution: number) {
  if (contribution > 25) return 'bg-red-500';
  if (contribution > 15) return 'bg-amber-500';
  return 'bg-emerald-500';
}

export default function CarrierPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const usdot = params.usdot as string;
  const sourcePref = searchParams.get('source');

  const [data, setData] = useState<CarrierBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lookupStatus, setLookupStatus] = useState<string | null>(null);
  const { isTracked, toggle } = useWatchlist();

  const fetchCarrier = async () => {
    setLoading(true);
    setError(null);
    setLookupStatus(null);
    try {
      // If source=fmcsa-api, use the dedicated FMCSA API endpoint
      const url = sourcePref === 'fmcsa-api'
        ? `/api/fmcsa?usdot=${usdot}`
        : `/api/carriers/${usdot}`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.data) {
        setData(result.data);
        setLookupStatus(result.lookupStatus || (sourcePref === 'fmcsa-api' ? 'Live FMCSA API' : null));
      } else {
        setError(result.error || 'Failed to fetch carrier data');
        setLookupStatus(result.lookupStatus);
        setData(null);
      }
    } catch {
      setError('Failed to fetch carrier data. Please try again.');
      setLookupStatus('fetch_error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarrier();
  }, [usdot]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error && !data) {
    if (lookupStatus === 'source_unavailable') {
      return (
        <div className="bg-slate-50 min-h-screen">
          <SourceUnavailableState
            usdot={usdot}
            message={error}
            onRetry={fetchCarrier}
            onViewSample={() => window.location.href = '/sample-report'}
          />
        </div>
      );
    }

    if (lookupStatus === 'parse_failed') {
      return (
        <div className="bg-slate-50 min-h-screen">
          <ParseFailedState
            usdot={usdot}
            message={error}
            onRetry={fetchCarrier}
            onViewSample={() => window.location.href = '/sample-report'}
          />
        </div>
      );
    }

    if (lookupStatus === 'not_found') {
      return (
        <div className="bg-slate-50 min-h-screen">
          <EmptyState
            title="Carrier Not Found"
            description={`No public carrier profile found for USDOT ${usdot}. The carrier may not exist, or may not be in the public FMCSA database.`}
          />
        </div>
      );
    }

    return (
      <div className="bg-slate-50 min-h-screen">
        <ErrorState
          title="Something Went Wrong"
          description={error}
          onRetry={fetchCarrier}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <EmptyState
          title="No Data"
          description="No carrier data available"
        />
      </div>
    );
  }

  const sortedContributions = [...data.scoreContributions].sort(
    (a, b) => b.contribution - a.contribution
  );

  const aiInsight = getAiSafetyInsight(data);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Search
          </Link>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => data && toggle({ usdot: data.usdot, carrierName: data.carrierName, overallRisk: data.overallRisk, trend: data.trend })}
              className={isTracked(usdot) ? 'border-blue-500 text-blue-700 bg-blue-50' : ''}
            >
              <Bell className={`h-4 w-4 mr-2 ${isTracked(usdot) ? 'fill-blue-500 text-blue-500' : ''}`} />
              {isTracked(usdot) ? 'Tracking' : 'Track'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="no-print">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" asChild className="no-print">
              <Link href={`/compare?a=${usdot}`}>
                Compare
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-tight">
            {data.carrierName}
          </h1>
          <p className="text-slate-600 text-sm">
            USDOT {data.usdot} | MC {data.mc}
          </p>
        </div>

        <CarrierHeaderCard data={data} />

        {lookupStatus && (lookupStatus === 'parse_failed' || lookupStatus === 'source_unavailable' || lookupStatus === 'Using demonstration data') && (
          <div className="mt-6">
            <LookupWarningBanner lookupStatus={lookupStatus} />
          </div>
        )}

        <div className="mt-6">
          <SourceMetadataCard
            source={data.source}
            lastRefreshed={data.lastRefreshed}
            sourceNotes={data.sourceNotes}
            dataCoverage={data.dataCoverage}
          />
        </div>

        <div className="mt-6">
          <AiSafetyAdvisorPanel insight={aiInsight} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Risk Summary
              </h2>
              <Link
                href="/methodology"
                className="text-xs font-medium text-sky-600 hover:text-sky-500 transition-colors"
              >
                View methodology
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-slate-600">Overall Risk</span>
                <RiskBadge risk={data.overallRisk} />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-slate-600">Trend</span>
                <TrendBadge trend={data.trend} />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-slate-600">Confidence</span>
                <span className="text-slate-900 font-medium">
                  {data.confidence}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Risk by Category
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Maintenance</span>
                  <RiskBadge risk={data.riskChips.maintenance} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Crash</span>
                  <RiskBadge risk={data.riskChips.crash} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Hazmat</span>
                  <RiskBadge risk={data.riskChips.hazmat} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Driver</span>
                  <RiskBadge risk={data.riskChips.driver} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Admin Freshness</span>
                  <RiskBadge risk={data.riskChips.admin} size="sm" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-50 to-white">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              AI Summary
            </h2>
            <p className="text-slate-700 leading-relaxed">{data.aiSummary}</p>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-900">
                  What Drove This Score
                </h2>
              </div>
              <Link
                href="/methodology"
                className="text-xs font-medium text-sky-600 hover:text-sky-500 transition-colors whitespace-nowrap"
              >
                How is this scored?
              </Link>
            </div>
            <p className="text-sm text-slate-600 mb-5">
              Contribution percentages show how much each category affects the overall risk assessment.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedContributions.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">
                      {item.category}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {item.contribution}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${getContributionColor(item.contribution)}`}
                      style={{ width: `${item.contribution}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Weight: {item.weight}%</span>
                    <span>Score: {item.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Key Metrics
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Overall OOS Rate"
              value={formatPercentage(data.metrics.overallOOS)}
              delta={formatDelta(data.metrics.overallOOSDelta) + ' vs avg'}
              deltaPositive={data.metrics.overallOOSDelta < 0}
              icon={AlertTriangle}
            />
            <MetricCard
              title="Vehicle OOS Rate"
              value={formatPercentage(data.metrics.vehicleOOS)}
              delta={formatDelta(data.metrics.vehicleOOSDelta) + ' vs avg'}
              deltaPositive={data.metrics.vehicleOOSDelta < 0}
              icon={Activity}
            />
            <MetricCard
              title="Driver OOS Rate"
              value={formatPercentage(data.metrics.driverOOS)}
              delta={formatDelta(data.metrics.driverOOSDelta) + ' vs avg'}
              deltaPositive={data.metrics.driverOOSDelta < 0}
              icon={Activity}
            />
            <MetricCard
              title="Crashes (24 months)"
              value={data.metrics.crashes24mo}
              subtitle={data.metrics.crashesTrend}
              icon={TrendingUp}
            />
            <MetricCard
              title="BASIC Exposure"
              value={data.metrics.basicExposure}
              icon={FileText}
            />
            <MetricCard
              title="MCS-150 Freshness"
              value={data.metrics.mcs150Freshness}
              subtitle={`Updated ${data.mcs150Updated}`}
              icon={Calendar}
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Performance Trends
          </h2>
          <TrendCharts data={data.trendData} />
          <div className="mt-6">
            <InsightCard variant={data.trend === 'Worsening' ? 'warning' : data.trend === 'Improving' ? 'success' : 'info'}>
              {data.trend === 'Worsening'
                ? 'Key metrics have deteriorated over the last 12 months. Review the fix plan for prioritized remediation actions.'
                : data.trend === 'Improving'
                ? 'Performance is improving across key metrics. Continue current compliance programs to sustain progress.'
                : 'Performance is stable. Consider proactive improvements to strengthen the safety profile.'}
            </InsightCard>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Top Risk Drivers
            </h2>
            <div className="space-y-4">
              {data.riskDriverDetails.map((driver, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    driver.severity === 'high'
                      ? 'bg-red-50 border-l-red-500'
                      : driver.severity === 'medium'
                      ? 'bg-amber-50 border-l-amber-500'
                      : 'bg-slate-50 border-l-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        driver.severity === 'high'
                          ? 'bg-red-100 text-red-700'
                          : driver.severity === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <h3 className="font-medium text-slate-900 text-sm">
                      {driver.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600">{driver.description}</p>
                  {(() => {
                    const issue = getIssueForRiskDriver(driver.title, data);
                    return issue ? (
                      <AiIssueInsightCard issue={issue} triggerLabel="Ask AI: How do I fix this?" />
                    ) : null;
                  })()}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              What Changed
            </h2>
            <div className="space-y-3">
              {data.whatChangedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      item.direction === 'up'
                        ? 'bg-red-100'
                        : item.direction === 'down'
                        ? 'bg-emerald-100'
                        : 'bg-slate-100'
                    }`}
                  >
                    {item.direction === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    ) : item.direction === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500">{item.detail}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      item.direction === 'up'
                        ? 'bg-red-100 text-red-700'
                        : item.direction === 'down'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.direction === 'up'
                      ? 'Worsened'
                      : item.direction === 'down'
                      ? 'Improved'
                      : 'Stable'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <FixPlanTable items={data.fixPlan} />
        </div>

        <div className="mt-8">
          <AiGuidedPromptPanel data={data} />
        </div>

        <div className="mt-8">
          <Card className="p-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="sources">
                <AccordionTrigger className="text-lg font-semibold">
                  Data Sources
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700">
                      This brief is derived from public data sources including:
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li>FMCSA SMS (Safety Measurement System)</li>
                      <li>FMCSA Census / MCS-150 filings</li>
                      <li>Roadside inspection records</li>
                      <li>Crash reports</li>
                      <li>BASIC percentile rankings</li>
                    </ul>
                    <p className="text-sm text-slate-600 mt-4">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="scoring">
                <AccordionTrigger className="text-lg font-semibold">
                  Scoring Methodology
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700">
                      Our internal screening score combines multiple risk
                      factors:
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li>Maintenance Risk: 30%</li>
                      <li>Crash Risk: 20%</li>
                      <li>Driver Risk: 15%</li>
                      <li>Hazmat Risk: 15%</li>
                      <li>Trend Risk: 15%</li>
                      <li>Administrative Freshness: 5%</li>
                    </ul>
                    <p className="text-sm text-slate-600 mt-4">
                      <Link
                        href="/methodology"
                        className="text-blue-600 hover:underline"
                      >
                        View detailed methodology
                      </Link>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="disclaimers">
                <AccordionTrigger className="text-lg font-semibold">
                  Disclaimers
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700">
                      This is an internal screening-oriented score intended to
                      summarize public risk indicators.
                    </p>
                    <p className="text-slate-700 mt-3 font-semibold">
                      This is NOT:
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li>An official FMCSA safety rating</li>
                      <li>A legal opinion or recommendation</li>
                      <li>An underwriting decision</li>
                      <li>A guarantee of future performance</li>
                    </ul>
                    <p className="text-sm text-slate-600 mt-4">
                      Users should conduct their own due diligence and consult
                      with qualified professionals before making business
                      decisions.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
}
