import { CarrierBrief, RiskLevel, TrendDirection } from './types';
import { PublicCarrierProfile, PublicSMSData } from './public-fmcsa-service';

function deriveRiskFromOOS(oosRate: number | undefined): RiskLevel {
  if (!oosRate) return 'Moderate';
  if (oosRate > 35) return 'Severe';
  if (oosRate > 25) return 'Elevated';
  if (oosRate > 15) return 'Moderate';
  return 'Low';
}

function deriveTrendFromData(profile: PublicCarrierProfile): TrendDirection {
  return 'Stable';
}

function generateExecutiveMemo(profile: PublicCarrierProfile, smsData?: PublicSMSData): string {
  const name = profile.carrierName || 'This carrier';
  const units = profile.powerUnits !== undefined ? profile.powerUnits : 'an unknown number of';
  const drivers = profile.drivers !== undefined ? profile.drivers : 'an unknown number of';

  let memo = `${name} operates with ${units} power units and ${drivers} drivers. `;

  if (profile.status === 'Active') {
    memo += 'The carrier is currently authorized for operation. ';
  } else if (profile.status === 'Out of Service') {
    memo += 'The carrier is currently out of service. ';
  } else if (profile.status === 'Inactive') {
    memo += 'The carrier is currently inactive. ';
  }

  if (profile.totalInspections !== undefined) {
    memo += `Public records show ${profile.totalInspections} total inspections. `;
  }

  if (profile.totalCrashes !== undefined) {
    memo += `Crash record shows ${profile.totalCrashes} total crashes in the last 24 months. `;
  }

  if (smsData?.vehicleOOS && smsData.vehicleOOS > 25) {
    memo += `Vehicle out-of-service rate of ${smsData.vehicleOOS.toFixed(1)}% indicates elevated maintenance risk. `;
  }

  memo += 'This brief combines live public carrier profile data with internal risk analysis. Risk scoring, trend assessment, and remediation guidance are derived outputs for screening purposes.';

  return memo;
}

function generateAISummary(profile: PublicCarrierProfile, smsData?: PublicSMSData): string {
  const name = profile.carrierName || 'This carrier';

  let summary = `${name} profile based on public FMCSA data. `;

  if (profile.operationType) {
    summary += `Operates ${profile.operationType.toLowerCase()} with `;
    if (profile.powerUnits !== undefined) {
      summary += `${profile.powerUnits} power units and `;
    }
    if (profile.drivers !== undefined) {
      summary += `${profile.drivers} drivers. `;
    }
  }

  if (profile.totalInspections !== undefined && profile.totalCrashes !== undefined) {
    summary += `Inspection and crash history shows ${profile.totalInspections} inspections and ${profile.totalCrashes} crashes over 24 months. `;
  }

  if (smsData?.vehicleOOS && smsData.vehicleOOS > 20) {
    summary += `Vehicle maintenance metrics show elevated out-of-service rates (${smsData.vehicleOOS.toFixed(1)}%). `;
  }

  if (smsData?.driverOOS && smsData.driverOOS > 10) {
    summary += `Driver-related indicators also show elevated rates (${smsData.driverOOS.toFixed(1)}%). `;
  }

  if (profile.safetyRating) {
    summary += `Current safety rating: ${profile.safetyRating}. `;
  }

  summary += 'Complete trend analysis and remediation guidance require deeper inspection-level data access.';

  return summary;
}

export function buildHybridCarrierBrief(
  profile: PublicCarrierProfile,
  smsData?: PublicSMSData
): CarrierBrief {
  const overallOOS = smsData?.vehicleOOS && smsData?.driverOOS
    ? (smsData.vehicleOOS + smsData.driverOOS) / 2
    : (smsData?.vehicleOOS || smsData?.driverOOS || 0);

  const overallRisk = deriveRiskFromOOS(overallOOS);
  const trend = deriveTrendFromData(profile);

  const sourceNotes = [
    'Carrier profile data sourced from public FMCSA records',
    'Basic company information and fleet size are live public data',
  ];

  if (smsData?.vehicleOOS || smsData?.driverOOS) {
    sourceNotes.push('SMS out-of-service rates from public safety measurement system');
  }

  sourceNotes.push('Risk score, trend assessment, and fix plan are internally derived for screening purposes');

  const dataCoverage = [
    'Company name, USDOT, MC, status (public FMCSA)',
    'Power units and driver count (public census data)',
    'MCS-150 update date (public filing records)',
  ];

  if (smsData?.vehicleOOS || smsData?.driverOOS) {
    dataCoverage.push('Out-of-service rates (public SMS summary)');
  }

  dataCoverage.push('Detailed inspection/violation data not available via public sources');
  dataCoverage.push('Historical trend charts and crash details require API access');

  const brief: CarrierBrief = {
    id: `carrier-${profile.usdot}`,
    carrierName: profile.carrierName || `USDOT ${profile.usdot}`,
    usdot: profile.usdot,
    mc: profile.mc || 'N/A',
    status: profile.status || 'Unknown',
    operationType: profile.operationType || 'Interstate',
    powerUnits: profile.powerUnits !== undefined ? profile.powerUnits : 0,
    drivers: profile.drivers !== undefined ? profile.drivers : 0,
    mcs150Updated: profile.mcs150Updated || 'Unknown',
    dataFreshness: 'Public snapshot',
    overallRisk,
    trend,
    confidence: 'Moderate',
    executiveMemo: generateExecutiveMemo(profile, smsData),
    aiSummary: generateAISummary(profile, smsData),
    metrics: {
      overallOOS: overallOOS || 0,
      overallOOSDelta: 0,
      vehicleOOS: smsData?.vehicleOOS || 0,
      vehicleOOSDelta: 0,
      driverOOS: smsData?.driverOOS || 0,
      driverOOSDelta: 0,
      crashes24mo: profile.totalCrashes !== undefined ? profile.totalCrashes : (smsData?.crashes || 0),
      crashesTrend: 'Unknown',
      basicExposure: 'Data not available via public source',
      mcs150Freshness: profile.mcs150Updated ? 'Current' : 'Unknown',
    },
    riskChips: {
      maintenance: deriveRiskFromOOS(smsData?.vehicleOOS),
      crash: 'Moderate',
      hazmat: 'Moderate',
      driver: deriveRiskFromOOS(smsData?.driverOOS),
      admin: profile.mcs150Updated ? 'Low' : 'Moderate',
    },
    topRiskDrivers: [
      'Limited public data availability',
      'Analysis based on summary metrics only',
    ],
    riskDriverDetails: [
      {
        title: 'Public Data Limitations',
        description: 'This report is based on publicly available FMCSA data. Detailed inspection and violation records require API access.',
        severity: 'medium',
      },
      {
        title: 'SMS Summary Data Only',
        description: 'Out-of-service rates and safety scores are from public SMS summaries. Granular BASIC percentiles and trend data not available.',
        severity: 'medium',
      },
    ],
    whatChanged: [
      'Historical trend data not available via public sources',
    ],
    whatChangedItems: [
      {
        label: 'Trend Analysis',
        direction: 'stable',
        detail: 'Requires historical inspection data',
      },
    ],
    scoreContributions: [
      { category: 'Maintenance', weight: 30, score: 50, contribution: 30 },
      { category: 'Crash', weight: 20, score: 50, contribution: 20 },
      { category: 'Driver', weight: 15, score: 50, contribution: 15 },
      { category: 'Hazmat', weight: 15, score: 50, contribution: 15 },
      { category: 'Trend', weight: 15, score: 50, contribution: 15 },
      { category: 'Admin Freshness', weight: 5, score: 25, contribution: 5 },
    ],
    fixPlan: [
      {
        title: 'Obtain detailed FMCSA data access',
        description: 'For comprehensive risk assessment, obtain official FMCSA API access to retrieve detailed inspection and violation records.',
        impact: 'High',
        effort: 'Low',
        expectedEffect: 'Enable full trend analysis and granular risk scoring',
      },
      {
        title: 'Verify carrier profile directly',
        description: 'Contact carrier directly to verify operational details and obtain certificate of insurance.',
        impact: 'High',
        effort: 'Low',
        expectedEffect: 'Confirm accuracy of public records',
      },
    ],
    trendData: {
      vehicleOOS: [
        { month: 'Jan', value: smsData?.vehicleOOS || 0 },
        { month: 'Feb', value: smsData?.vehicleOOS || 0 },
        { month: 'Mar', value: smsData?.vehicleOOS || 0 },
        { month: 'Apr', value: smsData?.vehicleOOS || 0 },
        { month: 'May', value: smsData?.vehicleOOS || 0 },
        { month: 'Jun', value: smsData?.vehicleOOS || 0 },
        { month: 'Jul', value: smsData?.vehicleOOS || 0 },
        { month: 'Aug', value: smsData?.vehicleOOS || 0 },
        { month: 'Sep', value: smsData?.vehicleOOS || 0 },
        { month: 'Oct', value: smsData?.vehicleOOS || 0 },
        { month: 'Nov', value: smsData?.vehicleOOS || 0 },
        { month: 'Dec', value: smsData?.vehicleOOS || 0 },
      ],
      driverOOS: [
        { month: 'Jan', value: smsData?.driverOOS || 0 },
        { month: 'Feb', value: smsData?.driverOOS || 0 },
        { month: 'Mar', value: smsData?.driverOOS || 0 },
        { month: 'Apr', value: smsData?.driverOOS || 0 },
        { month: 'May', value: smsData?.driverOOS || 0 },
        { month: 'Jun', value: smsData?.driverOOS || 0 },
        { month: 'Jul', value: smsData?.driverOOS || 0 },
        { month: 'Aug', value: smsData?.driverOOS || 0 },
        { month: 'Sep', value: smsData?.driverOOS || 0 },
        { month: 'Oct', value: smsData?.driverOOS || 0 },
        { month: 'Nov', value: smsData?.driverOOS || 0 },
        { month: 'Dec', value: smsData?.driverOOS || 0 },
      ],
      inspections: [
        { month: 'Jan', value: 0 },
        { month: 'Feb', value: 0 },
        { month: 'Mar', value: 0 },
        { month: 'Apr', value: 0 },
        { month: 'May', value: 0 },
        { month: 'Jun', value: 0 },
        { month: 'Jul', value: 0 },
        { month: 'Aug', value: 0 },
        { month: 'Sep', value: 0 },
        { month: 'Oct', value: 0 },
        { month: 'Nov', value: 0 },
        { month: 'Dec', value: 0 },
      ],
    },
    source: 'hybrid',
    lastRefreshed: new Date().toISOString(),
    sourceNotes,
    dataCoverage,
  };

  return brief;
}
