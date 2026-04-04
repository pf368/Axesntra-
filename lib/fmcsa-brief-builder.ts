/**
 * Converts FMCSA API carrier records into CarrierBrief format
 * for display alongside mock/scraped data.
 */

import { CarrierBrief, RiskLevel, TrendDirection } from './types';
import { FmcsaCarrierRecord } from './fmcsa-api-service';

function deriveRiskLevel(carrier: FmcsaCarrierRecord): RiskLevel {
  // Use BASIC scores if available
  if (carrier.basicScores && carrier.basicScores.length > 0) {
    const exceeding = carrier.basicScores.filter((b) => b.exceedThreshold).length;
    if (exceeding >= 3) return 'Severe';
    if (exceeding >= 2) return 'Elevated';
    if (exceeding >= 1) return 'Moderate';
    return 'Low';
  }

  // Fall back to OOS rates
  const vOOS = carrier.vehicleOosRate || 0;
  const dOOS = carrier.driverOosRate || 0;
  const avgOOS = (vOOS + dOOS) / 2;

  if (avgOOS > 35) return 'Severe';
  if (avgOOS > 25) return 'Elevated';
  if (avgOOS > 15) return 'Moderate';
  return 'Low';
}

function chipFromOOS(rate: number | undefined): RiskLevel {
  if (!rate) return 'Low';
  if (rate > 35) return 'Severe';
  if (rate > 25) return 'Elevated';
  if (rate > 15) return 'Moderate';
  return 'Low';
}

function formatMcs150Date(raw?: string): string {
  if (!raw) return 'Unknown';
  // FMCSA API returns dates like "12/31/2024" or "20241231"
  if (raw.includes('/')) return raw;
  if (raw.length === 8) {
    return `${raw.slice(4, 6)}/${raw.slice(6, 8)}/${raw.slice(0, 4)}`;
  }
  return raw;
}

function buildExecutiveMemo(carrier: FmcsaCarrierRecord): string {
  const name = carrier.legalName || carrier.dbaName || 'This carrier';
  const parts: string[] = [];

  parts.push(`${name} operates with ${carrier.totalPowerUnits ?? 'unknown'} power units and ${carrier.totalDrivers ?? 'unknown'} drivers.`);

  if (carrier.allowedToOperate === 'Y') {
    parts.push('The carrier is currently authorized for operation.');
  } else {
    parts.push('The carrier is NOT currently authorized for operation.');
  }

  if (carrier.vehicleOosRate && carrier.vehicleOosRate > 21) {
    parts.push(`Vehicle out-of-service rate of ${carrier.vehicleOosRate.toFixed(1)}% exceeds the 21% national benchmark.`);
  }

  if (carrier.crashTotal !== undefined && carrier.crashTotal > 0) {
    parts.push(`${carrier.crashTotal} crash(es) recorded in the last 24 months.`);
  }

  if (carrier.basicScores && carrier.basicScores.length > 0) {
    const exceeding = carrier.basicScores.filter((b) => b.exceedThreshold);
    if (exceeding.length > 0) {
      parts.push(`${exceeding.length} BASIC category(ies) exceed intervention thresholds: ${exceeding.map((b) => b.basicName).join(', ')}.`);
    }
  }

  parts.push('This brief was generated from live FMCSA API data.');

  return parts.join(' ');
}

function buildAISummary(carrier: FmcsaCarrierRecord): string {
  const name = carrier.legalName || 'This carrier';
  const parts: string[] = [`${name} — live FMCSA API data.`];

  if (carrier.carrierOperation) {
    parts.push(`Operates ${carrier.carrierOperation.toLowerCase()}.`);
  }

  if (carrier.basicScores && carrier.basicScores.length > 0) {
    const sorted = [...carrier.basicScores].sort((a, b) => b.percentile - a.percentile);
    const top = sorted[0];
    if (top) {
      parts.push(`Highest BASIC: ${top.basicName} at ${top.percentile}th percentile.`);
    }
  }

  if (carrier.vehicleOosRate) {
    parts.push(`Vehicle OOS rate: ${carrier.vehicleOosRate.toFixed(1)}%.`);
  }

  return parts.join(' ');
}

export function buildBriefFromFmcsaApi(carrier: FmcsaCarrierRecord): CarrierBrief {
  const overallRisk = deriveRiskLevel(carrier);

  // Build BASIC-based risk drivers
  const riskDriverDetails: CarrierBrief['riskDriverDetails'] = [];
  const topRiskDrivers: string[] = [];

  if (carrier.basicScores && carrier.basicScores.length > 0) {
    const sorted = [...carrier.basicScores].sort((a, b) => b.percentile - a.percentile);
    for (const basic of sorted.slice(0, 3)) {
      topRiskDrivers.push(`${basic.basicName} (${basic.percentile}th %ile)`);
      riskDriverDetails.push({
        title: basic.basicName,
        description: `Percentile: ${basic.percentile}. Threshold: ${basic.threshold}. ${basic.exceedThreshold ? 'EXCEEDS intervention threshold.' : 'Below threshold.'}`,
        severity: basic.exceedThreshold ? 'high' : basic.percentile > 50 ? 'medium' : 'low',
      });
    }
  } else {
    topRiskDrivers.push('BASIC scores not available via API');
    riskDriverDetails.push({
      title: 'Limited BASIC Data',
      description: 'BASIC percentile scores were not returned by the FMCSA API for this carrier. Risk assessment is based on OOS rates and crash data.',
      severity: 'medium',
    });
  }

  // Build score contributions from BASIC scores or defaults
  const scoreContributions: CarrierBrief['scoreContributions'] = carrier.basicScores?.length
    ? carrier.basicScores.map((b) => ({
        category: b.basicName,
        weight: Math.round(100 / carrier.basicScores!.length),
        score: b.percentile,
        contribution: Math.round(b.percentile * (100 / carrier.basicScores!.length) / 100),
      }))
    : [
        { category: 'Maintenance', weight: 30, score: carrier.vehicleOosRate ? Math.min(100, carrier.vehicleOosRate * 2) : 50, contribution: 30 },
        { category: 'Crash', weight: 20, score: 50, contribution: 20 },
        { category: 'Driver', weight: 15, score: carrier.driverOosRate ? Math.min(100, carrier.driverOosRate * 5) : 50, contribution: 15 },
        { category: 'Hazmat', weight: 15, score: carrier.hazmatOosRate ? Math.min(100, carrier.hazmatOosRate * 3) : 50, contribution: 15 },
        { category: 'Trend', weight: 15, score: 50, contribution: 15 },
        { category: 'Admin', weight: 5, score: carrier.mcs150FormDate ? 25 : 75, contribution: 5 },
      ];

  const brief: CarrierBrief = {
    id: `fmcsa-${carrier.dotNumber}`,
    carrierName: carrier.legalName || carrier.dbaName || `USDOT ${carrier.dotNumber}`,
    usdot: String(carrier.dotNumber),
    mc: carrier.mcNumber || 'N/A',
    status: carrier.allowedToOperate === 'Y' ? 'Active' : 'Not Authorized',
    operationType: carrier.carrierOperation || carrier.operationClassification || 'Interstate',
    powerUnits: carrier.totalPowerUnits ?? 0,
    drivers: carrier.totalDrivers ?? 0,
    mcs150Updated: formatMcs150Date(carrier.mcs150FormDate),
    dataFreshness: 'Live FMCSA API',
    overallRisk,
    trend: 'Stable' as TrendDirection,
    confidence: carrier.basicScores?.length ? 'High' : 'Moderate',
    executiveMemo: buildExecutiveMemo(carrier),
    trendSummary: 'Trend data requires historical inspection records. This brief reflects a current-state snapshot from the FMCSA API.',
    aiSummary: buildAISummary(carrier),
    metrics: {
      overallOOS: ((carrier.vehicleOosRate || 0) + (carrier.driverOosRate || 0)) / 2,
      overallOOSDelta: 0,
      vehicleOOS: carrier.vehicleOosRate || 0,
      vehicleOOSDelta: 0,
      driverOOS: carrier.driverOosRate || 0,
      driverOOSDelta: 0,
      crashes24mo: carrier.crashTotal ?? 0,
      crashesTrend: 'Unknown',
      basicExposure: carrier.basicScores
        ? `${carrier.basicScores.filter((b) => b.exceedThreshold).length} categories above threshold`
        : 'BASIC data not available',
      mcs150Freshness: carrier.mcs150FormDate ? 'Current' : 'Unknown',
    },
    riskChips: {
      maintenance: chipFromOOS(carrier.vehicleOosRate),
      crash: carrier.crashTotal && carrier.crashTotal > 3 ? 'Elevated' : 'Moderate',
      hazmat: chipFromOOS(carrier.hazmatOosRate),
      driver: chipFromOOS(carrier.driverOosRate),
      admin: carrier.mcs150FormDate ? 'Low' : 'Moderate',
    },
    topRiskDrivers,
    riskDriverDetails,
    whatChanged: ['Live snapshot — historical change tracking requires ongoing monitoring'],
    whatChangedItems: [
      { label: 'Data Source', direction: 'stable', detail: 'Live FMCSA API snapshot' },
    ],
    scoreContributions,
    fixPlan: [
      {
        title: 'Review BASIC categories above threshold',
        description: carrier.basicScores?.filter((b) => b.exceedThreshold).length
          ? `Focus on: ${carrier.basicScores.filter((b) => b.exceedThreshold).map((b) => b.basicName).join(', ')}`
          : 'No categories currently exceed intervention thresholds.',
        impact: 'High',
        effort: 'Medium',
        expectedEffect: 'Reduce regulatory exposure and improve safety metrics',
      },
      {
        title: 'Add to monitoring watchlist',
        description: 'Enable ongoing monitoring to track changes in BASIC percentiles and OOS rates over time.',
        impact: 'High',
        effort: 'Low',
        expectedEffect: 'Detect deterioration before it triggers enforcement action',
      },
    ],
    trendData: {
      vehicleOOS: Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        value: carrier.vehicleOosRate || 0,
      })),
      driverOOS: Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        value: carrier.driverOosRate || 0,
      })),
      inspections: Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        value: Math.round((carrier.vehicleInsp || 0) / 12),
      })),
    },
    source: 'public-live',
    lastRefreshed: new Date().toISOString(),
    sourceNotes: [
      'Data sourced from FMCSA QC Web API with authorized API key',
      'BASIC percentile scores reflect current FMCSA Safety Measurement System data',
      'Trend analysis requires historical data points — this brief is a current snapshot',
    ],
    dataCoverage: [
      'Carrier identity, status, fleet size (FMCSA API)',
      'OOS rates: vehicle, driver, hazmat (FMCSA API)',
      'Crash totals (FMCSA API)',
      carrier.basicScores?.length ? 'BASIC percentile scores (FMCSA API)' : 'BASIC scores not available for this carrier',
    ],
  };

  return brief;
}
