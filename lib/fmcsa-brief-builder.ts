/**
 * Converts FMCSA API carrier records into CarrierBrief format
 * for display alongside mock/scraped data.
 */

import { CarrierBrief, RiskLevel, TrendDirection, InspectionWithViolations, ViolationDetail } from './types';
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

// ── Inspection-based enrichment helpers ──

interface ViolationFrequency {
  code: string;
  description: string;
  count: number;
  oosCount: number;
  totalSeverity: number;
}

function analyzeViolations(inspections: InspectionWithViolations[]): {
  frequencies: ViolationFrequency[];
  totalInspections: number;
  totalViolations: number;
  oosInspections: number;
  avgSeverity: number;
  recentInspections: InspectionWithViolations[];
} {
  const freqMap = new Map<string, ViolationFrequency>();
  let totalViolations = 0;
  let totalSeverity = 0;
  const oosInspections = inspections.filter((i) => i.oos).length;

  for (const insp of inspections) {
    for (const v of insp.violations) {
      totalViolations++;
      totalSeverity += v.severityWeight;
      const existing = freqMap.get(v.code);
      if (existing) {
        existing.count++;
        if (v.oos) existing.oosCount++;
        existing.totalSeverity += v.severityWeight;
      } else {
        freqMap.set(v.code, {
          code: v.code,
          description: v.description,
          count: 1,
          oosCount: v.oos ? 1 : 0,
          totalSeverity: v.severityWeight,
        });
      }
    }
  }

  const frequencies = Array.from(freqMap.values()).sort((a, b) => b.count - a.count);

  // Recent = last 6 months (approximate)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentInspections = inspections.filter((i) => {
    if (!i.inspectionDate) return false;
    const d = new Date(i.inspectionDate);
    return !isNaN(d.getTime()) && d >= sixMonthsAgo;
  });

  return {
    frequencies,
    totalInspections: inspections.length,
    totalViolations,
    oosInspections,
    avgSeverity: totalViolations > 0 ? totalSeverity / totalViolations : 0,
    recentInspections,
  };
}

function buildInspectionRiskDrivers(
  inspections: InspectionWithViolations[],
  existingDrivers: CarrierBrief['riskDriverDetails']
): { riskDriverDetails: CarrierBrief['riskDriverDetails']; topRiskDrivers: string[] } {
  const analysis = analyzeViolations(inspections);
  if (analysis.totalViolations === 0) {
    return { riskDriverDetails: existingDrivers, topRiskDrivers: existingDrivers.map((d) => d.title) };
  }

  const riskDriverDetails: CarrierBrief['riskDriverDetails'] = [];
  const topRiskDrivers: string[] = [];

  // Top violation categories become risk drivers
  const topViolations = analysis.frequencies.slice(0, 3);
  for (const v of topViolations) {
    const oosNote = v.oosCount > 0 ? ` ${v.oosCount} resulted in out-of-service orders.` : '';
    const severity = v.oosCount > 0 ? 'high' as const : v.count >= 3 ? 'medium' as const : 'low' as const;

    topRiskDrivers.push(`${v.description} (${v.code})`);
    riskDriverDetails.push({
      title: `${v.description} (${v.code})`,
      description: `Found in ${v.count} inspection(s) over 24 months.${oosNote} Average severity weight: ${(v.totalSeverity / v.count).toFixed(1)}.`,
      severity,
    });
  }

  // Add overall inspection summary as a driver if we have enough data
  if (analysis.oosInspections > 0 && riskDriverDetails.length < 3) {
    riskDriverDetails.push({
      title: 'Out-of-Service Inspection History',
      description: `${analysis.oosInspections} of ${analysis.totalInspections} inspections resulted in out-of-service orders. Average violation severity: ${analysis.avgSeverity.toFixed(1)}.`,
      severity: analysis.oosInspections >= 3 ? 'high' : 'medium',
    });
    topRiskDrivers.push('Out-of-Service inspection history');
  }

  // Merge with existing BASIC-based drivers if we have fewer than 3
  if (riskDriverDetails.length < 3) {
    for (const existing of existingDrivers) {
      if (riskDriverDetails.length >= 3) break;
      if (!riskDriverDetails.some((d) => d.title === existing.title)) {
        riskDriverDetails.push(existing);
        topRiskDrivers.push(existing.title);
      }
    }
  }

  return { riskDriverDetails, topRiskDrivers };
}

function buildInspectionWhatChanged(
  inspections: InspectionWithViolations[]
): CarrierBrief['whatChangedItems'] {
  const analysis = analyzeViolations(inspections);
  const items: CarrierBrief['whatChangedItems'] = [];

  // Recent vs older inspection comparison
  const olderInspections = inspections.filter((i) => {
    if (!i.inspectionDate) return false;
    const d = new Date(i.inspectionDate);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return !isNaN(d.getTime()) && d < sixMonthsAgo;
  });

  const recentCount = analysis.recentInspections.length;
  const olderCount = olderInspections.length;
  const recentOOS = analysis.recentInspections.filter((i) => i.oos).length;

  items.push({
    label: 'Recent Inspections',
    direction: recentCount > olderCount ? 'up' : recentCount < olderCount ? 'down' : 'stable',
    detail: `${recentCount} in last 6 months${olderCount > 0 ? ` vs ${olderCount} in prior period` : ''}`,
  });

  items.push({
    label: 'OOS Events',
    direction: recentOOS > 0 ? 'up' : 'stable',
    detail: recentOOS > 0 ? `${recentOOS} OOS in last 6 months` : 'No OOS events in last 6 months',
  });

  items.push({
    label: 'Avg Violation Severity',
    direction: analysis.avgSeverity > 6 ? 'up' : analysis.avgSeverity > 3 ? 'stable' : 'down',
    detail: `${analysis.avgSeverity.toFixed(1)} avg severity weight across ${analysis.totalViolations} violations`,
  });

  // Most common violation trend
  if (analysis.frequencies.length > 0) {
    const top = analysis.frequencies[0];
    items.push({
      label: `Top Violation: ${top.code}`,
      direction: top.oosCount > 0 ? 'up' : 'stable',
      detail: `${top.description} — ${top.count} occurrence(s)`,
    });
  }

  return items;
}

function enrichFixPlanWithInspections(
  basePlan: CarrierBrief['fixPlan'],
  inspections: InspectionWithViolations[]
): CarrierBrief['fixPlan'] {
  const analysis = analyzeViolations(inspections);
  if (analysis.totalViolations === 0) return basePlan;

  const items: CarrierBrief['fixPlan'] = [];

  // Generate violation-specific fix items for top violations
  for (const v of analysis.frequencies.slice(0, 3)) {
    items.push({
      title: `Address ${v.code} violations`,
      description: `${v.description} — found in ${v.count} inspection(s).${v.oosCount > 0 ? ` ${v.oosCount} resulted in OOS.` : ''} Focus pre-trip and maintenance protocols on this area.`,
      impact: v.oosCount > 0 ? 'High' : 'Medium',
      effort: 'Medium',
      expectedEffect: `Reduce ${v.code} violations and associated severity weight`,
    });
  }

  // Append base plan items that aren't redundant
  for (const item of basePlan) {
    if (!items.some((i) => i.title === item.title)) {
      items.push(item);
    }
  }

  return items.slice(0, 6); // Cap at 6 items
}

/**
 * Builds whatChanged items from QC API aggregate data when SMS inspection data is unavailable.
 */
function buildApiWhatChanged(carrier: FmcsaCarrierRecord): CarrierBrief['whatChangedItems'] {
  const items: CarrierBrief['whatChangedItems'] = [];
  const vNatAvg = parseFloat(carrier.vehicleOosRateNationalAverage || '20.72');
  const dNatAvg = parseFloat(carrier.driverOosRateNationalAverage || '5.51');

  if (carrier.vehicleOosRate !== undefined) {
    items.push({
      label: 'Vehicle OOS Rate',
      direction: carrier.vehicleOosRate > vNatAvg ? 'up' : carrier.vehicleOosRate < vNatAvg * 0.5 ? 'down' : 'stable',
      detail: `${carrier.vehicleOosRate.toFixed(1)}% vs ${vNatAvg}% national avg — ${carrier.vehicleInsp || 0} inspections, ${carrier.vehicleOosInsp || 0} OOS`,
    });
  }

  if (carrier.driverOosRate !== undefined) {
    items.push({
      label: 'Driver OOS Rate',
      direction: carrier.driverOosRate > dNatAvg ? 'up' : carrier.driverOosRate < dNatAvg * 0.5 ? 'down' : 'stable',
      detail: `${carrier.driverOosRate.toFixed(1)}% vs ${dNatAvg}% national avg — ${carrier.driverInsp || 0} inspections, ${carrier.driverOosInsp || 0} OOS`,
    });
  }

  if (carrier.crashTotal !== undefined) {
    items.push({
      label: 'Crash Frequency',
      direction: carrier.crashTotal > 3 ? 'up' : carrier.crashTotal === 0 ? 'down' : 'stable',
      detail: `${carrier.crashTotal} crash(es) in 24 months${carrier.fatalCrash ? ` (${carrier.fatalCrash} fatal)` : ''}`,
    });
  }

  if (carrier.basicScores?.length) {
    const exceeding = carrier.basicScores.filter((b) => b.exceedThreshold);
    items.push({
      label: 'BASIC Exposure',
      direction: exceeding.length > 0 ? 'up' : 'down',
      detail: exceeding.length > 0
        ? `${exceeding.length} category(ies) above threshold: ${exceeding.map((b) => b.basicName).join(', ')}`
        : `All ${carrier.basicScores.length} BASIC categories below intervention thresholds`,
    });
  }

  if (items.length === 0) {
    items.push({
      label: 'Data Source',
      direction: 'stable' as const,
      detail: 'Live FMCSA API snapshot — limited aggregate data available',
    });
  }

  return items;
}

export function buildBriefFromFmcsaApi(carrier: FmcsaCarrierRecord): CarrierBrief {
  const overallRisk = deriveRiskLevel(carrier);

  // Build BASIC-based risk drivers
  const riskDriverDetails: CarrierBrief['riskDriverDetails'] = [];
  const topRiskDrivers: string[] = [];

  const vNatAvgBrief = parseFloat(carrier.vehicleOosRateNationalAverage || '20.72');
  const dNatAvgBrief = parseFloat(carrier.driverOosRateNationalAverage || '5.51');

  if (carrier.basicScores && carrier.basicScores.length > 0) {
    const sorted = [...carrier.basicScores].sort((a, b) => b.percentile - a.percentile);
    for (const basic of sorted.slice(0, 3)) {
      topRiskDrivers.push(`${basic.basicName} (${basic.percentile}th %ile)`);

      // Build a rich description using all available data
      const descParts: string[] = [];
      descParts.push(`${basic.percentile}th percentile (threshold: ${basic.threshold}%).`);
      if (basic.exceedThreshold) {
        descParts.push('EXCEEDS FMCSA intervention threshold — this carrier is prioritized for enforcement review.');
      }

      // Add context based on the BASIC category
      const name = basic.basicName.toLowerCase();
      if (name.includes('vehicle') || name.includes('maintenance')) {
        if (carrier.vehicleInsp !== undefined) {
          descParts.push(`${carrier.vehicleInsp} vehicle inspection(s) in 24 months with ${carrier.vehicleOosInsp || 0} out-of-service.`);
        }
        if (carrier.vehicleOosRate !== undefined) {
          const cmp = carrier.vehicleOosRate > vNatAvgBrief ? 'above' : 'below';
          descParts.push(`Vehicle OOS rate: ${carrier.vehicleOosRate.toFixed(1)}% (${cmp} ${vNatAvgBrief}% national average).`);
        }
      } else if (name.includes('driver')) {
        if (carrier.driverInsp !== undefined) {
          descParts.push(`${carrier.driverInsp} driver inspection(s) in 24 months with ${carrier.driverOosInsp || 0} out-of-service.`);
        }
        if (carrier.driverOosRate !== undefined) {
          const cmp = carrier.driverOosRate > dNatAvgBrief ? 'above' : 'below';
          descParts.push(`Driver OOS rate: ${carrier.driverOosRate.toFixed(1)}% (${cmp} ${dNatAvgBrief}% national average).`);
        }
      } else if (name.includes('crash')) {
        if (carrier.crashTotal !== undefined) {
          const parts: string[] = [];
          if (carrier.fatalCrash) parts.push(`${carrier.fatalCrash} fatal`);
          if (carrier.injCrash) parts.push(`${carrier.injCrash} injury`);
          if (carrier.towawayCrash) parts.push(`${carrier.towawayCrash} towaway`);
          descParts.push(`${carrier.crashTotal} crash(es) in 24 months${parts.length ? `: ${parts.join(', ')}` : ''}.`);
        }
      } else if (name.includes('hazmat') || name.includes('hm')) {
        if (carrier.hazmatInsp !== undefined) {
          descParts.push(`${carrier.hazmatInsp} HazMat inspection(s) with ${carrier.hazmatOosInsp || 0} out-of-service.`);
        }
      }

      riskDriverDetails.push({
        title: basic.basicName,
        description: descParts.join(' '),
        severity: basic.exceedThreshold ? 'high' : basic.percentile > 50 ? 'medium' : 'low',
      });
    }
  } else {
    // No BASIC scores — build risk drivers from aggregate OOS data
    if (carrier.vehicleInsp !== undefined && carrier.vehicleInsp > 0) {
      topRiskDrivers.push(`Vehicle Maintenance (${carrier.vehicleOosRate?.toFixed(1) || '0'}% OOS)`);
      const cmp = (carrier.vehicleOosRate || 0) > vNatAvgBrief ? 'above' : 'below';
      riskDriverDetails.push({
        title: 'Vehicle Maintenance',
        description: `${carrier.vehicleInsp} vehicle inspections in 24 months. ${carrier.vehicleOosInsp || 0} resulted in out-of-service orders (${carrier.vehicleOosRate?.toFixed(1) || '0'}% OOS rate, ${cmp} ${vNatAvgBrief}% national average).`,
        severity: (carrier.vehicleOosRate || 0) > vNatAvgBrief ? 'high' : 'medium',
      });
    }
    if (carrier.driverInsp !== undefined && carrier.driverInsp > 0) {
      topRiskDrivers.push(`Driver Fitness (${carrier.driverOosRate?.toFixed(1) || '0'}% OOS)`);
      const cmp = (carrier.driverOosRate || 0) > dNatAvgBrief ? 'above' : 'below';
      riskDriverDetails.push({
        title: 'Driver Fitness',
        description: `${carrier.driverInsp} driver inspections in 24 months. ${carrier.driverOosInsp || 0} resulted in out-of-service orders (${carrier.driverOosRate?.toFixed(1) || '0'}% OOS rate, ${cmp} ${dNatAvgBrief}% national average).`,
        severity: (carrier.driverOosRate || 0) > dNatAvgBrief ? 'high' : 'medium',
      });
    }
    if (carrier.crashTotal !== undefined && carrier.crashTotal > 0) {
      const crashParts: string[] = [];
      if (carrier.fatalCrash) crashParts.push(`${carrier.fatalCrash} fatal`);
      if (carrier.injCrash) crashParts.push(`${carrier.injCrash} injury`);
      if (carrier.towawayCrash) crashParts.push(`${carrier.towawayCrash} towaway`);
      topRiskDrivers.push(`Crash History (${carrier.crashTotal} in 24mo)`);
      riskDriverDetails.push({
        title: 'Crash History',
        description: `${carrier.crashTotal} crash(es) recorded in the last 24 months${crashParts.length ? ` (${crashParts.join(', ')})` : ''}. Crash indicators are a key factor in FMCSA enforcement prioritization.`,
        severity: carrier.crashTotal > 3 ? 'high' : carrier.crashTotal > 1 ? 'medium' : 'low',
      });
    }
    if (riskDriverDetails.length === 0) {
      topRiskDrivers.push('Limited safety data available');
      riskDriverDetails.push({
        title: 'Limited Data',
        description: 'BASIC percentile scores and detailed inspection data were not available for this carrier. Risk assessment is based on available OOS rates and crash data.',
        severity: 'medium',
      });
    }
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
    topRiskDrivers: carrier.inspections?.length
      ? buildInspectionRiskDrivers(carrier.inspections, riskDriverDetails).topRiskDrivers
      : topRiskDrivers,
    riskDriverDetails: carrier.inspections?.length
      ? buildInspectionRiskDrivers(carrier.inspections, riskDriverDetails).riskDriverDetails
      : riskDriverDetails,
    whatChanged: carrier.inspections?.length
      ? buildInspectionWhatChanged(carrier.inspections).map((i) => `${i.label}: ${i.detail}`)
      : buildApiWhatChanged(carrier).map((i) => `${i.label}: ${i.detail}`),
    whatChangedItems: carrier.inspections?.length
      ? buildInspectionWhatChanged(carrier.inspections)
      : buildApiWhatChanged(carrier),
    scoreContributions,
    fixPlan: carrier.inspections?.length
      ? enrichFixPlanWithInspections(buildFixPlan(carrier), carrier.inspections)
      : buildFixPlan(carrier),
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
      ...(carrier.inspections?.length
        ? [`Vehicle maintenance inspection history with violation details scraped from SMS (${carrier.inspections.length} inspections)`]
        : ['Trend analysis requires historical data points — this brief is a current snapshot']),
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
      carrier.inspections?.length ? `Inspection history: ${carrier.inspections.length} inspections with violation details (SMS scrape)` : 'Inspection details not available',
    ],
    rawInspectionCounts: {
      vehicleInsp: carrier.vehicleInsp,
      vehicleOosInsp: carrier.vehicleOosInsp,
      driverInsp: carrier.driverInsp,
      driverOosInsp: carrier.driverOosInsp,
      hazmatInsp: carrier.hazmatInsp,
      hazmatOosInsp: carrier.hazmatOosInsp,
      fatalCrash: carrier.fatalCrash,
      injCrash: carrier.injCrash,
      towawayCrash: carrier.towawayCrash,
    },
  };

  return brief;
}
