'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RiskBadge } from '@/components/risk-badge';
import { TrendBadge } from '@/components/trend-badge';
import { TrendCharts } from '@/components/trend-charts';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { ErrorState } from '@/components/empty-state';
import { AiSafetyAdvisorPanel } from '@/components/ai-safety-advisor-panel';
import { AiIssueInsightCard } from '@/components/ai-issue-insight-card';
import { AiGuidedPromptPanel } from '@/components/ai-guided-prompt-panel';
import { AiComplianceProgramCards } from '@/components/ai-compliance-program-card';
import { AiFixPlanDrawer } from '@/components/ai-fix-plan-drawer';
import { ViolationScenarioCard } from '@/components/violation-scenario-card';
import { InspectionHistoryTable } from '@/components/inspection-history-table';
import { ReportAIPanel } from '@/components/report-ai-panel';
import { CarrierBrief, CarrierListItem, InspectionWithViolations } from '@/lib/types';
import {
  getAiSafetyInsight,
  getIssueForRiskDriver,
  getCompliancePrograms,
} from '@/lib/ai-advisory';
import { getAllViolationScenarios, buildViolationScenariosFromInspections, buildViolationScenariosFromApiData } from '@/lib/violation-scenarios';
import {
  ChevronLeft,
  Wrench,
  TriangleAlert as AlertTriangle,
  FileWarning,
  TrendingUp,
  TrendingDown,
  Minus,
  Truck,
  Users,
  Calendar,
  Building2,
  ShieldCheck,
  Database,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function getRiskDriverIcon(severity: string) {
  if (severity === 'high') return <AlertTriangle className="h-5 w-5 text-red-600" />;
  if (severity === 'medium') return <FileWarning className="h-5 w-5 text-amber-600" />;
  return <Wrench className="h-5 w-5 text-slate-500" />;
}

function getChangeIcon(direction: string) {
  if (direction === 'up') return <TrendingUp className="h-4 w-4 text-red-600" />;
  if (direction === 'down') return <TrendingDown className="h-4 w-4 text-emerald-600" />;
  return <Minus className="h-4 w-4 text-slate-500" />;
}

function getChangeColor(direction: string) {
  if (direction === 'up') return 'text-red-600 bg-red-50 border-red-100';
  if (direction === 'down') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  return 'text-slate-600 bg-slate-50 border-slate-200';
}

function getSeverityRank(severity: string) {
  if (severity === 'high') return 1;
  if (severity === 'medium') return 2;
  return 3;
}

function getRiskChipStyle(risk: string) {
  if (risk === 'Severe') return 'bg-red-100 text-red-800 border-red-200';
  if (risk === 'Elevated') return 'bg-amber-100 text-amber-800 border-amber-200';
  if (risk === 'Moderate') return 'bg-yellow-50 text-yellow-800 border-yellow-200';
  return 'bg-emerald-50 text-emerald-800 border-emerald-200';
}

function getRiskChipDot(risk: string) {
  if (risk === 'Severe') return 'bg-red-500';
  if (risk === 'Elevated') return 'bg-amber-500';
  if (risk === 'Moderate') return 'bg-yellow-400';
  return 'bg-emerald-500';
}

function getAtAGlanceBorderColor(risk: string): string {
  if (risk === 'Severe') return '#ef4444';
  if (risk === 'Elevated') return '#f97316';
  if (risk === 'Moderate') return '#eab308';
  if (risk === 'Low') return '#22c55e';
  return '#64748b';
}

// Pre-computed SVG points (72×28) for each well-known label.
// For unknown labels, fall back to direction-based curves.
const SPARKLINE_DATA: Record<string, { pts: string; color: string }> = {
  // Worsened — clear upward sweep, stroke orange
  'Vehicle OOS Rate':       { pts: '0,27 14.4,22 28.8,20 43.2,14 57.6,8 72,1',  color: '#f97316' },
  'Maintenance Violations': { pts: '0,27 14.4,27 28.8,21 43.2,17 57.6,10 72,1', color: '#f97316' },
  // Stable — gentle oscillation near the centre, stroke slate
  'Driver OOS Rate':   { pts: '0,15 14.4,12 28.8,15 43.2,10 57.6,13 72,14', color: '#64748b' },
  'Crash Frequency':   { pts: '0,16 14.4,13 28.8,16 43.2,13 57.6,16 72,13', color: '#64748b' },
};

// Fallback curves by direction
const FALLBACK_UP   = '0,27 14.4,22 28.8,19 43.2,13 57.6,7 72,1';
const FALLBACK_DOWN = '0,1 14.4,6 28.8,11 43.2,17 57.6,22 72,27';
const FALLBACK_FLAT = '0,14 14.4,12 28.8,14 43.2,13 57.6,12 72,14';

function Sparkline({ label, direction }: { label: string; direction: string }) {
  const preset = SPARKLINE_DATA[label];
  const pts   = preset?.pts   ?? (direction === 'up' ? FALLBACK_UP : direction === 'down' ? FALLBACK_DOWN : FALLBACK_FLAT);
  const color = preset?.color ?? (direction === 'up' ? '#f97316'   : direction === 'down' ? '#22c55e'     : '#64748b');

  return (
    <svg width="72" height="28" aria-hidden="true">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SampleReportPage() {
  const [carrierList, setCarrierList] = useState<CarrierListItem[]>([]);
  const [selectedUsdot, setSelectedUsdot] = useState<string>('');
  const [data, setData] = useState<CarrierBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('medical-cert-cdl-mismatch');
  const [inspections, setInspections] = useState<InspectionWithViolations[]>([]);
  const [inspectionPercentile, setInspectionPercentile] = useState<number | undefined>();
  const [inspectionsLoading, setInspectionsLoading] = useState(false);

  useEffect(() => {
    async function fetchCarrierList() {
      try {
        const response = await fetch('/api/carriers');
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          setCarrierList(result.data);
          setSelectedUsdot(result.data[0].usdot);
        }
      } catch {
        setError('Failed to load carrier list');
      }
    }
    fetchCarrierList();
  }, []);

  useEffect(() => {
    if (!selectedUsdot) return;

    async function fetchCarrier() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/carriers/${selectedUsdot}`);
        const result = await response.json();
        if (result.error) {
          setError(result.error);
          setData(null);
        } else {
          setData(result.data);
        }
      } catch {
        setError('Failed to load carrier data');
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCarrier();
  }, [selectedUsdot]);

  // Fetch inspection data for live carriers after carrier data loads
  useEffect(() => {
    if (!data || data.source !== 'public-live') {
      setInspections([]);
      setInspectionPercentile(undefined);
      return;
    }

    const usdot = data.usdot;

    async function fetchInspections() {
      setInspectionsLoading(true);
      try {
        const response = await fetch(`/api/carriers/${usdot}/inspections`);
        const result = await response.json();
        if (result.data) {
          setInspections(result.data.inspectionDetails || []);
          setInspectionPercentile(result.data.basicPercentile);
        }
      } catch {
        // Non-fatal — inspection section just won't show
      } finally {
        setInspectionsLoading(false);
      }
    }
    fetchInspections();
  }, [data]);

  const handleRetry = () => {
    if (selectedUsdot) {
      setLoading(true);
      setError(null);
      fetch(`/api/carriers/${selectedUsdot}`)
        .then((r) => r.json())
        .then((result) => {
          if (result.error) {
            setError(result.error);
          } else {
            setData(result.data);
          }
        })
        .catch(() => setError('Failed to load carrier data'))
        .finally(() => setLoading(false));
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ErrorState
          title="Failed to Load Report"
          description={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSkeleton />
      </div>
    );
  }

  const sortedRiskDrivers = [...data.riskDriverDetails].sort(
    (a, b) => getSeverityRank(a.severity) - getSeverityRank(b.severity)
  );

  const sortedScoreContributions = [...data.scoreContributions].sort(
    (a, b) => b.contribution - a.contribution
  );

  const primaryRiskDriver = sortedRiskDrivers[0];
  const immediateFocus = data.fixPlan[0];
  const operationType = data.operationType || 'Interstate / For-Hire';
  const dataFreshness = data.dataFreshness || 'Company profile daily / public safety data on source cadence';
  const trendSummary =
    data.trendSummary ||
    'Vehicle-maintenance exposure has worsened over the last 12 months, while driver-related indicators have remained comparatively stable. Recent movement suggests operational controls should be prioritized over broad policy changes.';

  const aiInsight = getAiSafetyInsight(data);
  const compliancePrograms = getCompliancePrograms(data);
  const staticScenarios = getAllViolationScenarios();
  const inspectionScenarios = inspections.length > 0
    ? buildViolationScenariosFromInspections(inspections)
    : [];
  // For live carriers, generate scenarios from API aggregate data (OOS rates, BASIC scores)
  const raw = data.rawInspectionCounts;
  const apiScenarios = data.source === 'public-live'
    ? buildViolationScenariosFromApiData({
        vehicleOosRate: data.metrics.vehicleOOS,
        vehicleInsp: raw?.vehicleInsp,
        vehicleOosInsp: raw?.vehicleOosInsp,
        driverOosRate: data.metrics.driverOOS,
        driverInsp: raw?.driverInsp,
        driverOosInsp: raw?.driverOosInsp,
        hazmatInsp: raw?.hazmatInsp,
        hazmatOosInsp: raw?.hazmatOosInsp,
        crashTotal: data.metrics.crashes24mo,
        fatalCrash: raw?.fatalCrash,
        injCrash: raw?.injCrash,
        basicScores: data.scoreContributions.map((s) => ({
          basicName: s.category,
          percentile: s.score,
          threshold: 65,
          exceedThreshold: s.score > 65,
        })),
      })
    : [];
  // Priority: inspection-scraped scenarios > API aggregate scenarios > static mock
  const dynamicScenarios = inspectionScenarios.length > 0 ? inspectionScenarios : apiScenarios;
  const violationScenarios = data.source === 'public-live' && dynamicScenarios.length > 0
    ? [...dynamicScenarios, ...staticScenarios]
    : staticScenarios;

  // Auto-select first violation scenario if current selection isn't in the list
  const selectedExists = violationScenarios.some((s) => s.id === selectedScenarioId);
  const effectiveScenarioId = selectedExists
    ? selectedScenarioId
    : violationScenarios[0]?.id || 'medical-cert-cdl-mismatch';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="text-sm text-slate-400">Switch Carrier:</span>
              <Select value={selectedUsdot} onValueChange={setSelectedUsdot}>
                <SelectTrigger className="w-full bg-slate-800 text-white border-slate-700 sm:w-[320px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {carrierList.map((carrier) => (
                    <SelectItem key={carrier.usdot} value={carrier.usdot}>
                      <div className="flex items-center gap-2">
                        <span>{carrier.carrierName}</span>
                        <span className="text-xs text-slate-500">({carrier.overallRisk})</span>
                        {carrier.source === 'live' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Carrier Risk Brief
          </p>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold">{data.carrierName}</h1>
            {data.source === 'public-live' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                <Database className="h-3.5 w-3.5" />
                Live FMCSA API
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">
            USDOT {data.usdot} | MC {data.mc}
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Executive Summary Card */}
        <Card className="mb-8 border-l-4 border-l-slate-900 bg-white p-8 shadow-sm">
          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr_0.8fr]">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Executive Summary
              </p>

              <div className="mb-6 flex flex-wrap items-center gap-6">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Risk Assessment
                  </p>
                  <RiskBadge risk={data.overallRisk} size="lg" />
                </div>

                <div className="hidden h-12 w-px bg-slate-200 sm:block" />

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                    12-Month Trend
                  </p>
                  <TrendBadge trend={data.trend} size="lg" />
                </div>

                <div className="hidden h-12 w-px bg-slate-200 sm:block" />

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Confidence
                  </p>
                  <span className="text-lg font-semibold text-slate-900">{data.confidence}</span>
                </div>
              </div>

              <p className="text-base leading-relaxed text-slate-700">{data.executiveMemo}</p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-red-700">
                    Primary Issue
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {primaryRiskDriver?.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {primaryRiskDriver?.description}
                  </p>
                </div>

                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-blue-700">
                    Immediate Focus
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {immediateFocus?.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {immediateFocus?.expectedEffect}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Carrier Details
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    <p className="text-sm font-medium text-slate-900">{data.status}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Operation Type</p>
                    <p className="text-sm font-medium text-slate-900">{operationType}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Power Units</p>
                    <p className="text-sm font-medium text-slate-900">{data.powerUnits}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Drivers</p>
                    <p className="text-sm font-medium text-slate-900">{data.drivers}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">MCS-150 Updated</p>
                    <p className="text-sm font-medium text-slate-900">{data.mcs150Updated}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Database className="mt-0.5 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Data Freshness</p>
                    <p className="text-sm font-medium text-slate-900">{dataFreshness}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                At-a-Glance
              </p>

              <div className="space-y-4">
                {[
                  {
                    label: 'Top Driver of Risk',
                    primary: primaryRiskDriver?.title,
                    secondary: null,
                  },
                  {
                    label: 'Leading Score Contributor',
                    primary: sortedScoreContributions[0]?.category,
                    secondary: `${sortedScoreContributions[0]?.contribution}% contribution`,
                  },
                  {
                    label: 'Recommended First Action',
                    primary: immediateFocus?.title,
                    secondary: null,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-slate-200 border-l-4 p-4"
                    style={{
                      borderLeftColor: getAtAGlanceBorderColor(data.overallRisk),
                      background: `linear-gradient(to right, ${getAtAGlanceBorderColor(data.overallRisk)}0f, transparent 40%)`,
                    }}
                  >
                    <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">{item.primary}</p>
                    {item.secondary && (
                      <p className="mt-1 text-xs text-slate-500">{item.secondary}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Chips Row */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Risk Category Overview
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { label: 'Maintenance', value: data.riskChips.maintenance },
                  { label: 'Crash', value: data.riskChips.crash },
                  { label: 'Driver', value: data.riskChips.driver },
                  { label: 'Hazmat', value: data.riskChips.hazmat },
                  { label: 'Admin', value: data.riskChips.admin },
                ] as { label: string; value: string }[]
              ).map((chip) => (
                <span
                  key={chip.label}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getRiskChipStyle(chip.value)}`}
                >
                  <span className={`h-2 w-2 rounded-full ${getRiskChipDot(chip.value)}`} />
                  {chip.label}: {chip.value}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* AI Safety Advisor Panel */}
        <div className="mb-8">
          <AiSafetyAdvisorPanel insight={aiInsight} />
        </div>

        {/* OOS Violation Scenario Library */}
        <div className="mb-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                <ShieldAlert className="h-4 w-4 text-red-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">AI Violation Analysis</h2>
                <p className="text-xs text-slate-500">
                  Select a violation — click any question to see root cause, prevention steps, and compliance workflow
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {violationScenarios.length} scenarios
            </span>
          </div>

          {/* Scenario selector tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            {violationScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  effectiveScenarioId === scenario.id
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                    scenario.severity === 'OOS'
                      ? effectiveScenarioId === scenario.id
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-700'
                      : effectiveScenarioId === scenario.id
                        ? 'bg-amber-400 text-white'
                        : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {scenario.severity}
                </span>
                <span className="font-mono">{scenario.code}</span>
                {scenario.occurrenceCount && scenario.occurrenceCount > 0 && (
                  <span className={`inline-flex items-center justify-center rounded-full min-w-[18px] h-[18px] px-1 text-[10px] font-bold ${
                    effectiveScenarioId === scenario.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {scenario.occurrenceCount}
                  </span>
                )}
                {scenario.id.startsWith('live-') && (
                  <span className="rounded bg-emerald-100 px-1 py-0.5 text-[9px] font-semibold uppercase text-emerald-700">
                    Live
                  </span>
                )}
                <span className="hidden sm:inline text-slate-500">— {scenario.category}</span>
                {scenario.mostRecentDate && (
                  <span className={`hidden sm:inline text-[10px] ${
                    effectiveScenarioId === scenario.id ? 'text-slate-400' : 'text-slate-400'
                  }`}>
                    {scenario.mostRecentDate}
                  </span>
                )}
              </button>
            ))}
          </div>

          {violationScenarios
            .filter((s) => s.id === effectiveScenarioId)
            .map((scenario) => (
              <ViolationScenarioCard key={scenario.id} scenario={scenario} />
            ))}
        </div>

        {/* Top Risk Drivers with AI Insight Cards */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <AlertTriangle className="h-5 w-5 text-slate-700" />
            Top Risk Drivers
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {sortedRiskDrivers.map((driver, index) => {
              const issueExplanation = getIssueForRiskDriver(driver.title, data);

              return (
                <Card
                  key={driver.title}
                  className={`relative overflow-hidden p-5 ${
                    driver.severity === 'high'
                      ? 'border-l-4 border-l-red-500'
                      : driver.severity === 'medium'
                        ? 'border-l-4 border-l-amber-500'
                        : 'border-l-4 border-l-slate-300'
                  }`}
                >
                  <div className="mb-3 flex items-start gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        driver.severity === 'high'
                          ? 'bg-red-50'
                          : driver.severity === 'medium'
                            ? 'bg-amber-50'
                            : 'bg-slate-50'
                      }`}
                    >
                      {getRiskDriverIcon(driver.severity)}
                    </div>

                    <div className="flex-1">
                      <span
                        className={`mb-2 inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                          driver.severity === 'high'
                            ? 'bg-red-100 text-red-700'
                            : driver.severity === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900">{driver.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-600">{driver.description}</p>

                  {issueExplanation && (
                    <AiIssueInsightCard
                      issue={issueExplanation}
                      triggerLabel={
                        driver.severity === 'high'
                          ? 'Ask AI: How do I fix this?'
                          : 'Ask AI: What program would prevent this?'
                      }
                    />
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* What Changed */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <TrendingUp className="h-5 w-5 text-slate-700" />
            What Changed
          </h2>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {data.whatChangedItems.map((item) => (
              <Card key={item.label} className="pt-5 px-5 pb-11 relative overflow-hidden">
                <div className="mb-3 flex items-center gap-2">
                  <div className={`rounded border p-1.5 ${getChangeColor(item.direction)}`}>
                    {getChangeIcon(item.direction)}
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {item.direction === 'up'
                      ? 'Worsened'
                      : item.direction === 'down'
                        ? 'Improved'
                        : 'Stable'}
                  </span>
                </div>

                <p className="mb-1 text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="text-xs leading-relaxed text-slate-500 pr-14">{item.detail}</p>

                <div className="absolute bottom-3 right-3" style={{ opacity: 0.75 }}>
                  <Sparkline label={item.label} direction={item.direction} />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Inspection History (live carriers only) */}
        {data.source === 'public-live' && (
          <div className="mb-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <ShieldAlert className="h-4 w-4 text-slate-700" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Vehicle Maintenance Inspection History
                  </h2>
                  <p className="text-xs text-slate-500">
                    SMS inspection records — click a row to expand violation details
                  </p>
                </div>
              </div>
            </div>

            {inspectionsLoading ? (
              <Card className="p-8 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                <p className="mt-2 text-sm text-slate-500">Loading inspection history...</p>
              </Card>
            ) : inspections.length > 0 ? (
              <InspectionHistoryTable
                inspections={inspections}
                basicPercentile={inspectionPercentile}
              />
            ) : (
              <Card className="p-6 text-center text-sm text-slate-500">
                No SMS inspection records available for this carrier.
              </Card>
            )}
          </div>
        )}

        {/* Performance Trends */}
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Performance Trends (12 Months)</h2>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-600">
            {trendSummary}
          </p>
          <TrendCharts data={data.trendData} />
        </div>

        {/* AI-Enhanced Fix Plan */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Prioritized Remediation Plan
            </h2>
            <span className="flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
              <Sparkles className="h-3 w-3" />
              Click rows for AI guidance
            </span>
          </div>

          <AiFixPlanDrawer fixPlan={data.fixPlan} data={data} />
        </div>

        {/* Compliance Programs */}
        <div className="mb-8">
          <AiComplianceProgramCards programs={compliancePrograms} />
        </div>

        {/* Score Breakdown */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">What Drove This Score</h2>

          <Card className="p-6">
            <div className="space-y-4">
              {sortedScoreContributions.map((item) => (
                <div key={item.category}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-32 text-sm font-medium text-slate-900">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500">{item.weight}% weight</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600">Score: {item.score}</span>
                      <span className="w-16 text-right text-sm font-semibold text-slate-900">
                        {item.contribution}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.contribution > 25
                          ? 'bg-red-500'
                          : item.contribution > 15
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.contribution}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 border-t pt-4 text-xs text-slate-500">
              Contribution percentages show how much each category affects the overall risk
              assessment. Higher percentages indicate greater influence on the final score.
            </p>
          </Card>
        </div>

        {/* Ask AI About This Carrier */}
        <div className="mb-8">
          <AiGuidedPromptPanel data={data} />
        </div>

        {/* Data Sources & Disclaimers */}
        <Card className="mb-8 p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sources" className="border-b-0">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">
                Data Sources & Methodology
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-8 pt-2 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-medium text-slate-900">Data Sources</h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>FMCSA SMS (Safety Measurement System)</li>
                      <li>FMCSA Census / MCS-150 filings</li>
                      <li>Roadside inspection records</li>
                      <li>Crash reports</li>
                      <li>BASIC percentile rankings</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium text-slate-900">Scoring Weights</h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>Maintenance Risk: 30%</li>
                      <li>Crash Risk: 20%</li>
                      <li>Driver Risk: 15%</li>
                      <li>Hazmat Risk: 15%</li>
                      <li>Trend Risk: 15%</li>
                      <li>Administrative Freshness: 5%</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>Company profile data refreshes daily where available.</p>
                  <p>Public safety measure updates follow source publication cadence.</p>
                  <p>Trend interpretations are based on internal snapshot and scoring logic.</p>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  <Link href="/methodology" className="text-blue-600 hover:underline">
                    View detailed methodology
                  </Link>
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="disclaimers" className="border-b-0">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">
                Disclaimers
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-3 text-sm text-slate-600">
                  This is an internal screening-oriented score intended to summarize public risk
                  indicators.
                </p>

                <p className="mb-2 text-sm font-medium text-slate-900">This is NOT:</p>
                <ul className="mb-3 space-y-1 text-sm text-slate-600">
                  <li>An official FMCSA safety rating</li>
                  <li>A legal opinion or recommendation</li>
                  <li>An underwriting decision</li>
                  <li>A guarantee of future performance</li>
                </ul>

                <p className="text-xs text-slate-500">
                  Users should conduct their own due diligence and consult qualified professionals
                  before making business decisions.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <div className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-teal-400">
              Carrier Risk Intelligence
            </p>
            <h2 className="mb-3 text-2xl font-bold">Run a live brief on any carrier</h2>
            <p className="mb-2 text-slate-300">
              Enter a USDOT number and get a carrier risk profile with AI-assisted explanation, root cause analysis, and a prioritized remediation plan.
            </p>
            <p className="mb-7 text-sm text-slate-400">
              Used by underwriters, safety directors, brokers, and fleet operators.
            </p>

            <div className="mb-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-sm font-semibold text-white">What happened</p>
                <p className="text-xs leading-relaxed text-slate-400">Live FMCSA data interpreted in plain English — not just raw numbers.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-sm font-semibold text-white">Why it matters</p>
                <p className="text-xs leading-relaxed text-slate-400">Root cause identification and risk significance — not a generic scorecard.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-sm font-semibold text-white">What to do next</p>
                <p className="text-xs leading-relaxed text-slate-400">Prioritized remediation steps and compliance programs — not vague advice.</p>
              </div>
            </div>

            <Button size="lg" variant="secondary" asChild>
              <Link href="/#search">Analyze a Carrier Now</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* AI Advisor Panel */}
      <ReportAIPanel />
    </div>
  );
}
