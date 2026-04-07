'use client';

import { useState, useEffect } from 'react';
import { CarrierBrief, CarrierListItem, InspectionWithViolations } from '@/lib/types';
import {
  getAiSafetyInsight,
  getCompliancePrograms,
} from '@/lib/ai-advisory';
import { getAllViolationScenarios, buildViolationScenariosFromInspections, buildViolationScenariosFromApiData, enrichScenariosWithOccurrences } from '@/lib/violation-scenarios';
import { MOCK_CARRIER_INSPECTIONS } from '@/lib/seed-inspections-mock';

// Dashboard components
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { DashboardSidebar, DashboardTab } from '@/components/dashboard/dashboard-sidebar';
import { DashboardTopBar } from '@/components/dashboard/dashboard-top-bar';
import { EntityProfileHeader } from '@/components/dashboard/entity-profile-header';
import { BasicScoreGrid } from '@/components/dashboard/basic-score-grid';
import { RiskScoreCard } from '@/components/dashboard/risk-score-card';
import { SafetyLedger } from '@/components/dashboard/safety-ledger';
import { DashboardTrendChart } from '@/components/dashboard/dashboard-trend-chart';

// Existing components (reused in tabs)
import { ViolationScenarioCard } from '@/components/violation-scenario-card';
import { InspectionHistoryTable } from '@/components/inspection-history-table';
import { AiFixPlanDrawer } from '@/components/ai-fix-plan-drawer';
import { AiComplianceProgramCards } from '@/components/ai-compliance-program-card';
import { AiGuidedPromptPanel } from '@/components/ai-guided-prompt-panel';
import { AiSafetyAdvisorPanel } from '@/components/ai-safety-advisor-panel';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { ErrorState } from '@/components/empty-state';
import { ShieldAlert, TriangleAlert as AlertTriangle } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // ── Data fetching (unchanged) ──

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

  useEffect(() => {
    if (!data) {
      setInspections([]);
      setInspectionPercentile(undefined);
      return;
    }

    const usdot = data.usdot;

    if (data.source !== 'public-live') {
      const mockData = MOCK_CARRIER_INSPECTIONS[usdot];
      if (mockData) {
        setInspections(mockData);
      } else {
        setInspections([]);
      }
      setInspectionPercentile(undefined);
      return;
    }

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
        // Non-fatal
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

  // ── Loading / error states ──

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-surface">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-surface">
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
      <div className="min-h-screen bg-surface">
        <LoadingSkeleton />
      </div>
    );
  }

  // ── Data processing (unchanged) ──

  const operationType = data.operationType || 'Interstate / For-Hire';
  const aiInsight = getAiSafetyInsight(data);
  const compliancePrograms = getCompliancePrograms(data);
  const baseStaticScenarios = getAllViolationScenarios();
  const staticScenarios = inspections.length > 0
    ? enrichScenariosWithOccurrences(baseStaticScenarios, inspections)
    : baseStaticScenarios;
  const inspectionScenarios = inspections.length > 0
    ? buildViolationScenariosFromInspections(inspections)
    : [];
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
  const dynamicScenarios = inspectionScenarios.length > 0 ? inspectionScenarios : apiScenarios;
  const violationScenarios = data.source === 'public-live' && dynamicScenarios.length > 0
    ? [...dynamicScenarios, ...staticScenarios]
    : staticScenarios;

  const selectedExists = violationScenarios.some((s) => s.id === selectedScenarioId);
  const effectiveScenarioId = selectedExists
    ? selectedScenarioId
    : violationScenarios[0]?.id || 'medical-cert-cdl-mismatch';

  // ── Dashboard render ──

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      }
      topBar={
        <DashboardTopBar
          carrierList={carrierList}
          selectedUsdot={selectedUsdot}
          onCarrierChange={setSelectedUsdot}
        />
      }
      rightSidebar={
        <>
          <RiskScoreCard
            overallRisk={data.overallRisk}
            scoreContributions={data.scoreContributions}
          />
          <SafetyLedger
            inspections={inspections}
            whatChanged={data.whatChangedItems}
            carrierName={data.carrierName}
          />
        </>
      }
    >
      {/* ── Overview Tab ── */}
      {activeTab === 'overview' && (
        <>
          <EntityProfileHeader
            carrierName={data.carrierName}
            usdot={data.usdot}
            operationType={operationType}
            overallRisk={data.overallRisk}
            isLive={data.source === 'public-live'}
          />

          <BasicScoreGrid
            scoreContributions={data.scoreContributions}
            riskChips={data.riskChips}
            metrics={{
              vehicleOOS: data.metrics.vehicleOOS,
              driverOOS: data.metrics.driverOOS,
              crashes24mo: data.metrics.crashes24mo,
            }}
          />

          <DashboardTrendChart data={data.trendData} />

          {/* Right sidebar content visible on mobile/tablet (below main) */}
          <div className="xl:hidden space-y-6 mt-6">
            <RiskScoreCard
              overallRisk={data.overallRisk}
              scoreContributions={data.scoreContributions}
            />
            <SafetyLedger
              inspections={inspections}
              whatChanged={data.whatChangedItems}
              carrierName={data.carrierName}
            />
          </div>
        </>
      )}

      {/* ── Violations Tab ── */}
      {activeTab === 'violations' && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                <ShieldAlert className="h-4 w-4 text-red-700" />
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                  AI Violation Analysis
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Select a violation to see root cause, prevention steps, and compliance workflow
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-surface-container px-2.5 py-0.5 text-xs font-medium text-on-surface-variant font-mono">
              {violationScenarios.length} scenarios
            </span>
          </div>

          {/* Scenario selector tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            {violationScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  effectiveScenarioId === scenario.id
                    ? 'bg-foreground text-background shadow-ambient'
                    : 'bg-surface-panel text-on-surface-variant hover:bg-surface-container shadow-ambient'
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
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {scenario.occurrenceCount}
                  </span>
                )}
                {scenario.id.startsWith('live-') && (
                  <span className="rounded bg-ai-teal/10 px-1 py-0.5 text-[9px] font-semibold uppercase text-ai-teal">
                    Live
                  </span>
                )}
                <span className="hidden sm:inline text-on-surface-variant/60">— {scenario.category}</span>
                {scenario.mostRecentDate && (
                  <span className="hidden sm:inline text-[10px] text-on-surface-variant/50">
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
      )}

      {/* ── Inspections Tab ── */}
      {activeTab === 'inspections' && (
        <div>
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
              Vehicle Maintenance Inspection History
            </h2>
            <p className="mt-1 text-xs text-on-surface-variant">
              SMS inspection records with violation details from FMCSA
            </p>
          </div>

          {inspectionsLoading ? (
            <div className="rounded-xl bg-surface-panel p-8 text-center shadow-ambient">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-on-surface-variant/20 border-t-indigo" />
              <p className="mt-2 text-sm text-on-surface-variant">Loading inspection history...</p>
            </div>
          ) : inspections.length > 0 ? (
            <InspectionHistoryTable
              inspections={inspections}
              basicPercentile={inspectionPercentile}
            />
          ) : (
            <div className="rounded-xl bg-surface-panel p-6 text-center text-sm text-on-surface-variant shadow-ambient">
              No SMS inspection records available for this carrier.
            </div>
          )}
        </div>
      )}

      {/* ── Remediation Tab ── */}
      {activeTab === 'remediation' && (
        <div>
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
              Prioritized Remediation Plan
            </h2>
            <p className="mt-1 text-xs text-on-surface-variant">
              AI-generated fix plan based on carrier risk profile. Click rows for detailed guidance.
            </p>
          </div>
          <AiFixPlanDrawer fixPlan={data.fixPlan} data={data} />

          <div className="mt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
              Compliance Programs
            </h2>
            <AiComplianceProgramCards programs={compliancePrograms} />
          </div>

          {/* What Changed section */}
          <div className="mt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
              What Changed
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.whatChangedItems.map((item, i) => (
                <div key={i} className="rounded-xl bg-surface-panel p-4 shadow-ambient">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`h-2 w-2 rounded-full ${
                      item.direction === 'up' ? 'bg-red-500' : item.direction === 'down' ? 'bg-ai-teal' : 'bg-on-surface-variant/30'
                    }`} />
                    <span className="text-xs font-semibold text-foreground">{item.label}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AI Advisor Tab ── */}
      {activeTab === 'ai' && (
        <div>
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
              AI Safety Advisor
            </h2>
            <p className="mt-1 text-xs text-on-surface-variant">
              Ask questions about this carrier&apos;s safety profile
            </p>
          </div>

          <AiSafetyAdvisorPanel insight={aiInsight} />

          <div className="mt-8">
            <AiGuidedPromptPanel data={data} />
          </div>
        </div>
      )}

      {/* Watermark footer */}
      <div className="mt-12 pb-16 lg:pb-4">
        <p className="font-mono text-[10px] text-on-surface-variant/20 uppercase tracking-[0.2em] select-none">
          Precision_Safety_Log_V2.0_Axesntra
        </p>
      </div>
    </DashboardShell>
  );
}
