/**
 * Converts FMCSA API carrier records into CarrierBrief format
 * for display alongside mock/scraped data.
 */

import { CarrierBrief, RiskLevel, TrendDirection } from './types';
import { FmcsaCarrierRecord } from './fmcsa-api-service';

/**
 * Ensures a value is a plain string before it reaches React rendering.
 * The FMCSA API returns nested objects for many fields that TypeScript
 * types as string (e.g. carrierOperation → {carrierOperationCode, carrierOperationDesc}).
 */
function safeStr(val: unknown, fallback = ''): string {
  if (val == null) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    // Try common FMCSA API patterns: *Desc, *Description, *Name, *Code
    for (const key of Object.keys(obj)) {
      if (/desc|description|name/i.test(key) && typeof obj[key] === 'string') {
        return obj[key] as string;
      }
    }
    for (const key of Object.keys(obj)) {
      if (/code/i.test(key) && typeof obj[key] === 'string') {
        return obj[key] as string;
      }
    }
    // Last resort: first string value
    for (const v of Object.values(obj)) {
      if (typeof v === 'string') return v;
    }
    return fallback;
  }
  return String(val);
}

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

function safetyRatingLabel(code?: string): string {
  if (!code) return '';
  const map: Record<string, string> = {
    S: 'Satisfactory',
    C: 'Conditional',
    U: 'Unsatisfactory',
    N: 'Not Rated',
  };
  return map[code.toUpperCase()] || code;
}

function buildExecutiveMemo(carrier: FmcsaCarrierRecord): string {
  const name = carrier.legalName || carrier.dbaName || 'This carrier';
  const parts: string[] = [];

  parts.push(`${name} operates with ${carrier.totalPowerUnits ?? 'unknown'} power units and ${carrier.totalDrivers ?? 'unknown'} drivers.`);

  if (carrier.operationClasses && carrier.operationClasses.length > 0) {
    parts.push(`Operation classification: ${carrier.operationClasses.join(', ')}.`);
  }

  if (carrier.cargoCarried && carrier.cargoCarried.length > 0) {
    parts.push(`Cargo types: ${carrier.cargoCarried.join(', ')}.`);
  }

  if (carrier.allowedToOperate === 'Y') {
    parts.push('The carrier is currently authorized for operation.');
  } else {
    parts.push('The carrier is NOT currently authorized for operation.');
  }

  if (carrier.safetyRating) {
    const label = safetyRatingLabel(carrier.safetyRating);
    parts.push(`Safety rating: ${label}${carrier.safetyRatingDate ? ` (as of ${carrier.safetyRatingDate})` : ''}.`);
  }

  const vNatAvg = parseFloat(carrier.vehicleOosRateNationalAverage || '20.72');
  if (carrier.vehicleOosRate !== undefined) {
    if (carrier.vehicleOosRate > vNatAvg) {
      parts.push(`Vehicle out-of-service rate of ${carrier.vehicleOosRate.toFixed(1)}% exceeds the ${vNatAvg}% national average.`);
    } else {
      parts.push(`Vehicle out-of-service rate of ${carrier.vehicleOosRate.toFixed(1)}% is below the ${vNatAvg}% national average.`);
    }
  }

  const dNatAvg = parseFloat(carrier.driverOosRateNationalAverage || '5.51');
  if (carrier.driverOosRate !== undefined && carrier.driverOosRate > 0) {
    if (carrier.driverOosRate > dNatAvg) {
      parts.push(`Driver out-of-service rate of ${carrier.driverOosRate.toFixed(1)}% exceeds the ${dNatAvg}% national average.`);
    } else {
      parts.push(`Driver out-of-service rate of ${carrier.driverOosRate.toFixed(1)}% is below the ${dNatAvg}% national average.`);
    }
  }

  if (carrier.crashTotal !== undefined && carrier.crashTotal > 0) {
    const crashParts: string[] = [];
    if (carrier.fatalCrash) crashParts.push(`${carrier.fatalCrash} fatal`);
    if (carrier.injCrash) crashParts.push(`${carrier.injCrash} injury`);
    if (carrier.towawayCrash) crashParts.push(`${carrier.towawayCrash} towaway`);
    const detail = crashParts.length > 0 ? ` (${crashParts.join(', ')})` : '';
    parts.push(`${carrier.crashTotal} crash(es) recorded in the last 24 months${detail}.`);
  }

  if (carrier.basicScores && carrier.basicScores.length > 0) {
    const exceeding = carrier.basicScores.filter((b) => b.exceedThreshold);
    if (exceeding.length > 0) {
      parts.push(`${exceeding.length} BASIC category(ies) exceed intervention thresholds: ${exceeding.map((b) => b.basicName).join(', ')}.`);
    } else {
      parts.push('No BASIC categories currently exceed intervention thresholds.');
    }
  }

  if (carrier.bipdInsuranceOnFile && carrier.bipdRequiredAmount) {
    const onFile = parseInt(carrier.bipdInsuranceOnFile);
    const required = parseInt(carrier.bipdRequiredAmount);
    if (onFile > 0 && required > 0) {
      parts.push(`BIPD insurance: $${(onFile / 1).toLocaleString()}K on file vs $${(required / 1).toLocaleString()}K required.`);
    }
  }

  parts.push('This brief was generated from live FMCSA API data.');

  return parts.join(' ');
}

function buildAISummary(carrier: FmcsaCarrierRecord): string {
  const name = carrier.legalName || 'This carrier';
  const risk = deriveRiskLevel(carrier);
  const parts: string[] = [`${risk} risk profile for ${name} based on live FMCSA API data.`];

  if (carrier.operationClasses && carrier.operationClasses.length > 0) {
    parts.push(`Operates as: ${carrier.operationClasses.join(', ')}.`);
  } else if (carrier.carrierOperation) {
    parts.push(`Operates ${safeStr(carrier.carrierOperation).toLowerCase()}.`);
  }

  if (carrier.cargoCarried && carrier.cargoCarried.length > 0) {
    parts.push(`Hauls: ${carrier.cargoCarried.join(', ')}.`);
  }

  if (carrier.safetyRating) {
    parts.push(`Safety rating: ${safetyRatingLabel(carrier.safetyRating)}.`);
  }

  const vNatAvg = parseFloat(carrier.vehicleOosRateNationalAverage || '20.72');
  if (carrier.vehicleOosRate !== undefined) {
    const comparison = carrier.vehicleOosRate > vNatAvg ? 'above' : 'below';
    parts.push(`Vehicle OOS rate: ${carrier.vehicleOosRate.toFixed(1)}% (${comparison} ${vNatAvg}% national average).`);
  }

  if (carrier.basicScores && carrier.basicScores.length > 0) {
    const sorted = [...carrier.basicScores].sort((a, b) => b.percentile - a.percentile);
    const top = sorted[0];
    if (top) {
      parts.push(`Highest BASIC: ${top.basicName} at ${top.percentile}th percentile.`);
    }
    const exceeding = carrier.basicScores.filter((b) => b.exceedThreshold);
    if (exceeding.length === 0) {
      parts.push('No BASIC categories exceed intervention thresholds.');
    }
  }

  if (carrier.crashTotal !== undefined && carrier.crashTotal > 0) {
    parts.push(`${carrier.crashTotal} crash(es) in 24 months.`);
  } else if (carrier.crashTotal === 0) {
    parts.push('Zero crashes in 24-month window.');
  }

  return parts.join(' ');
}

function buildFixPlan(carrier: FmcsaCarrierRecord): CarrierBrief['fixPlan'] {
  const items: CarrierBrief['fixPlan'] = [];
  const vNatAvg = parseFloat(carrier.vehicleOosRateNationalAverage || '20.72');
  const dNatAvg = parseFloat(carrier.driverOosRateNationalAverage || '5.51');

  // BASIC-specific items
  if (carrier.basicScores?.length) {
    const exceeding = carrier.basicScores.filter((b) => b.exceedThreshold);
    if (exceeding.length > 0) {
      for (const b of exceeding.slice(0, 2)) {
        items.push({
          title: `Address ${b.basicName} BASIC (${b.percentile}th %ile)`,
          description: `This category exceeds the ${b.threshold}% intervention threshold. Focus remediation efforts on reducing violations in this area.`,
          impact: 'High',
          effort: 'Medium',
          expectedEffect: `Reduce ${b.basicName} percentile below ${b.threshold}% threshold`,
        });
      }
    } else {
      items.push({
        title: 'Maintain current BASIC compliance',
        description: 'No BASIC categories currently exceed intervention thresholds. Continue current safety programs.',
        impact: 'High',
        effort: 'Low',
        expectedEffect: 'Sustain below-threshold BASIC performance',
      });
    }
  }

  // Vehicle OOS
  if (carrier.vehicleOosRate !== undefined && carrier.vehicleOosRate > vNatAvg) {
    items.push({
      title: 'Reduce vehicle out-of-service rate',
      description: `Vehicle OOS rate of ${carrier.vehicleOosRate.toFixed(1)}% exceeds the ${vNatAvg}% national average. Strengthen pre-trip inspections, focusing on brake systems, lighting, and tire conditions.`,
      impact: 'High',
      effort: 'Medium',
      expectedEffect: `Bring vehicle OOS rate below ${vNatAvg}% national average`,
    });
  }

  // Driver OOS
  if (carrier.driverOosRate !== undefined && carrier.driverOosRate > dNatAvg) {
    items.push({
      title: 'Improve driver compliance',
      description: `Driver OOS rate of ${carrier.driverOosRate.toFixed(1)}% exceeds the ${dNatAvg}% national average. Review HOS documentation, medical certificate currency, and CDL requirements.`,
      impact: 'High',
      effort: 'Medium',
      expectedEffect: `Bring driver OOS rate below ${dNatAvg}% national average`,
    });
  }

  // Crash history
  if (carrier.crashTotal && carrier.crashTotal > 3) {
    items.push({
      title: 'Crash reduction program',
      description: `${carrier.crashTotal} crashes in 24 months. Implement defensive driving training, telematics-based coaching, and post-incident root cause analysis.`,
      impact: 'High',
      effort: 'High',
      expectedEffect: 'Reduce crash frequency and severity indicators',
    });
  }

  // Always add monitoring
  items.push({
    title: 'Add to monitoring watchlist',
    description: 'Enable ongoing monitoring to track changes in BASIC percentiles and OOS rates over time.',
    impact: 'High',
    effort: 'Low',
    expectedEffect: 'Detect deterioration before it triggers enforcement action',
  });

  // MCS-150 freshness
  if (!carrier.mcs150FormDate) {
    items.push({
      title: 'Update MCS-150 filing',
      description: 'MCS-150 form date is missing or unknown. Ensure biennial update is current to avoid administrative compliance issues.',
      impact: 'Medium',
      effort: 'Low',
      expectedEffect: 'Resolve administrative freshness gap',
    });
  }

  return items;
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
    carrierName: safeStr(carrier.legalName) || safeStr(carrier.dbaName) || `USDOT ${carrier.dotNumber}`,
    usdot: String(carrier.dotNumber),
    mc: safeStr(carrier.mcNumber, 'N/A'),
    status: safeStr(carrier.allowedToOperate) === 'Y' ? 'Active' : 'Not Authorized',
    operationType: carrier.operationClasses?.length
      ? carrier.operationClasses.join(' / ')
      : safeStr(carrier.carrierOperation) || safeStr(carrier.operationClassification) || 'Interstate',
    powerUnits: typeof carrier.totalPowerUnits === 'number' ? carrier.totalPowerUnits : 0,
    drivers: typeof carrier.totalDrivers === 'number' ? carrier.totalDrivers : 0,
    mcs150Updated: formatMcs150Date(safeStr(carrier.mcs150FormDate)),
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
    fixPlan: buildFixPlan(carrier),
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
      'OOS rates: vehicle, driver, hazmat with national averages (FMCSA API)',
      `Crash totals with breakdown: ${carrier.crashTotal ?? 0} total, ${carrier.fatalCrash ?? 0} fatal, ${carrier.injCrash ?? 0} injury, ${carrier.towawayCrash ?? 0} towaway (FMCSA API)`,
      carrier.basicScores?.length ? `BASIC percentile scores: ${carrier.basicScores.length} categories (FMCSA API)` : 'BASIC scores not available for this carrier',
      carrier.cargoCarried?.length ? `Cargo carried: ${carrier.cargoCarried.join(', ')} (FMCSA API)` : 'Cargo carried data not available',
      carrier.operationClasses?.length ? `Operation classification: ${carrier.operationClasses.join(', ')} (FMCSA API)` : 'Operation classification not available',
      carrier.authorityDetails?.length ? `Authority: ${carrier.authorityDetails.map(a => `${a.type} (${a.status})`).join(', ')} (FMCSA API)` : 'Authority details not available',
      carrier.safetyRating ? `Safety rating: ${safetyRatingLabel(carrier.safetyRating)} (FMCSA API)` : 'No safety rating on file',
    ],
  };

  return brief;
}
