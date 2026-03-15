import { CarrierBrief, RiskLevel } from './types';

export interface AiInsight {
  topSignal: string;
  whyItMatters: string;
  immediateActions: string[];
  operationalFix: string;
  estimatedImpact: string;
}

export interface IssueExplanation {
  issueType: string;
  rootCause: string;
  whyItMatters: string;
  recommendedActions: string[];
  suggestedControls: string[];
  bestNextStep: string;
}

export interface ComplianceProgram {
  category: string;
  title: string;
  description: string;
  components: string[];
  expectedOutcome: string;
}

export interface GuidedPromptResponse {
  prompt: string;
  title: string;
  sections: { heading: string; content: string | string[] }[];
}

export interface FixPlanExplanation {
  whyThisMatters: string;
  whatItAddresses: string;
  howToImplement: string[];
  systemsNeeded: string[];
}

const issueDatabase: Record<string, IssueExplanation> = {
  'vehicle-maintenance': {
    issueType: 'Vehicle Maintenance Deficiency',
    rootCause: 'Preventive maintenance program gaps or inconsistent defect closeout discipline. Vehicles are reaching the road with known or detectable defects that should have been caught during pre-trip inspection or shop review.',
    whyItMatters: 'High vehicle OOS rates directly correlate with roadside enforcement actions, increased liability exposure, and higher insurance costs. A pattern of brake, lighting, or tire defects signals systemic maintenance process failure, not isolated incidents.',
    recommendedActions: [
      'Implement daily pre-trip inspection verification with supervisor sign-off',
      'Audit shop defect closeout process for completeness and timeliness',
      'Establish mandatory repair completion before vehicle dispatch',
      'Review and update preventive maintenance intervals based on actual failure data',
    ],
    suggestedControls: [
      'Preventive maintenance schedule with compliance tracking',
      'DVIR enforcement and defect closeout documentation',
      'Shop defect closeout discipline with time-to-repair metrics',
      'Roadside inspection coaching for drivers',
      'Post-trip defect escalation process',
    ],
    bestNextStep: 'Conduct a fleet-wide inspection audit within 30 days to identify and correct all existing defects, then implement ongoing PM schedule compliance tracking.',
  },
  'driver-qualification': {
    issueType: 'Driver Qualification Risk',
    rootCause: 'Driver qualification monitoring gap. CDL status, medical certificate, and driver file completeness are not being tracked proactively, creating windows where drivers may operate without valid credentials.',
    whyItMatters: 'A driver operating with a suspended or expired CDL creates serious liability exposure and indicates broader compliance process gaps. Insurance carriers view DQ deficiencies as a leading indicator of organizational safety culture problems.',
    recommendedActions: [
      'Pull updated MVRs for all active drivers immediately',
      'Verify CDL status and endorsements for every active driver',
      'Audit all driver qualification files for completeness',
      'Add self-reporting rules for license suspensions or changes',
    ],
    suggestedControls: [
      'Continuous MVR monitoring service',
      'Driver qualification file audit schedule (quarterly)',
      'Automated CDL and medical card expiration alerts',
      'Annual driver file completeness review',
      'Pre-employment screening program',
    ],
    bestNextStep: 'Launch continuous MVR monitoring and conduct a complete audit of all active driver qualification files within 60 days.',
  },
  'hazmat-documentation': {
    issueType: 'Hazmat Documentation / Process Gap',
    rootCause: 'Hazmat shipping documentation and placarding procedures are not consistently followed or verified before departure. This may indicate training gaps, time pressure at dispatch, or lack of a formal release process.',
    whyItMatters: 'Hazmat violations carry higher severity weights in FMCSA scoring and can rapidly escalate BASIC percentiles toward intervention thresholds. Beyond regulatory risk, hazmat documentation errors create real safety hazards for first responders and the public.',
    recommendedActions: [
      'Implement pre-departure hazmat documentation review checklist',
      'Verify placarding accuracy before every hazmat load release',
      'Review emergency response information completeness',
      'Audit recent shipping paper accuracy against actual cargo',
    ],
    suggestedControls: [
      'Hazmat shipping paper quality assurance program',
      'Placarding verification checklist at dispatch',
      'Hazmat training recertification tracking (3-year cycle)',
      'Dispatch release review for hazmat loads',
      'Hazmat incident reporting and near-miss tracking',
    ],
    bestNextStep: 'Implement a mandatory pre-departure hazmat documentation review for all hazmat shipments, with dispatch sign-off required before load release.',
  },
  'crash-frequency': {
    issueType: 'Elevated Crash Frequency',
    rootCause: 'Multiple contributing factors may include driver training gaps, fatigue management issues, vehicle condition, route planning, and hiring practices. Crash patterns should be analyzed to identify whether incidents cluster around specific drivers, routes, times, or equipment.',
    whyItMatters: 'Crash frequency is the single most impactful factor for insurance pricing and regulatory scrutiny. The FMCSA Crash Indicator BASIC directly triggers compliance reviews and intervention when percentiles exceed thresholds. Each crash creates potential for lawsuits, DOT investigation, and nuclear verdicts.',
    recommendedActions: [
      'Analyze crash reports for common patterns (time, location, driver, equipment)',
      'Implement mandatory post-crash review process with root cause analysis',
      'Review hiring standards and driver screening criteria',
      'Evaluate fatigue management and HOS compliance practices',
    ],
    suggestedControls: [
      'Comprehensive driver training and defensive driving program',
      'Dash camera / telematics with proactive coaching',
      'Post-crash investigation protocol with corrective action tracking',
      'Speed management and route planning technology',
      'Enhanced driver screening and onboarding process',
    ],
    bestNextStep: 'Conduct a crash causation analysis on all incidents in the past 24 months to identify the top contributing factors, then build targeted interventions for each.',
  },
  'hos-compliance': {
    issueType: 'Hours-of-Service Compliance Gap',
    rootCause: 'ELD log management procedures may be inadequate, or dispatching practices may create pressure to exceed available hours. Drivers may lack clarity on specific HOS rules or documentation requirements.',
    whyItMatters: 'HOS violations indicate potential driver fatigue risk, which is a proven contributor to crash causation. The FMCSA HOS BASIC is a key enforcement focus area, and intervention-level percentiles can trigger compliance reviews.',
    recommendedActions: [
      'Review ELD data for systematic log editing or falsification patterns',
      'Audit dispatch practices for hours pressure or unrealistic scheduling',
      'Provide HOS refresher training for all drivers',
      'Implement real-time HOS monitoring at dispatch level',
    ],
    suggestedControls: [
      'Real-time HOS monitoring dashboard for dispatch',
      'Automated alerts for drivers approaching hours limits',
      'Weekly ELD compliance review',
      'Dispatch scheduling tools with HOS integration',
      'Driver HOS training and certification program',
    ],
    bestNextStep: 'Implement real-time HOS monitoring at the dispatch level so violations can be prevented rather than discovered at roadside.',
  },
  'admin-freshness': {
    issueType: 'Stale MCS-150 / Administrative Compliance',
    rootCause: 'The biennial MCS-150 update has not been filed on schedule, which may indicate broader administrative compliance process gaps or lack of awareness of regulatory filing requirements.',
    whyItMatters: 'Failure to update the MCS-150 results in USDOT number deactivation (INACTIVE status), which means the carrier is not authorized to operate. It also signals to insurers and brokers that the carrier may not be managing regulatory compliance proactively.',
    recommendedActions: [
      'File MCS-150 update immediately if overdue',
      'Verify all information is current and accurate',
      'Set calendar reminders for future filing deadlines',
      'Review other regulatory filings for currency (UCR, IFTA, IRP)',
    ],
    suggestedControls: [
      'Regulatory filing calendar with automated reminders',
      'Annual compliance audit covering all required filings',
      'Designated compliance officer or responsible party',
      'Filing completion verification process',
    ],
    bestNextStep: 'File the MCS-150 update today if overdue, then establish a regulatory filing calendar to prevent future lapses.',
  },
  'vehicle-oos-trend': {
    issueType: 'Worsening Vehicle OOS Trend',
    rootCause: 'Maintenance program effectiveness is declining over time. This may be caused by fleet growth outpacing maintenance capacity, shop staffing issues, parts availability problems, or relaxation of PM schedule adherence.',
    whyItMatters: 'A worsening trend is more concerning than a static elevated rate because it indicates the problem is getting worse, not stabilizing. Without intervention, the trajectory will continue toward critical levels and likely trigger regulatory attention.',
    recommendedActions: [
      'Compare current PM schedule adherence to 12 months ago',
      'Review shop capacity relative to fleet size',
      'Analyze which defect categories are driving the increase',
      'Check whether specific vehicles or vehicle types are disproportionately affected',
    ],
    suggestedControls: [
      'PM schedule compliance dashboard with alerts',
      'Shop capacity planning tied to fleet size',
      'Defect category trending and root cause analysis',
      'Vehicle lifecycle management program',
      'Third-party maintenance audit (annual)',
    ],
    bestNextStep: 'Identify the top 3 defect categories driving the OOS increase, then build targeted corrective action plans for each.',
  },
  'driver-oos-trend': {
    issueType: 'Driver OOS Trend Concern',
    rootCause: 'Driver-related out-of-service events may stem from qualification file gaps, medical certificate lapses, HOS violations, or substance/alcohol testing issues. A rising trend suggests the driver management program is not keeping pace with fleet operations.',
    whyItMatters: 'Driver OOS events are more disruptive than vehicle OOS because they immediately sideline the driver at roadside. They also indicate potential liability exposure if drivers are operating without proper qualifications.',
    recommendedActions: [
      'Audit driver qualification files for completeness and currency',
      'Review medical certificate expiration dates for all active drivers',
      'Analyze which driver OOS categories are most frequent',
      'Verify substance testing program compliance',
    ],
    suggestedControls: [
      'Continuous MVR monitoring',
      'Medical certificate tracking with 90-day advance alerts',
      'Pre-trip document verification checklist for drivers',
      'Quarterly DQ file audit program',
    ],
    bestNextStep: 'Pull the last 6 months of driver OOS events, categorize by type, and address the top category first.',
  },
};

function detectIssueTypes(data: CarrierBrief): string[] {
  const issues: string[] = [];

  if (data.metrics.vehicleOOS > 25 || data.riskChips.maintenance === 'Elevated' || data.riskChips.maintenance === 'Severe') {
    issues.push('vehicle-maintenance');
  }

  if (data.metrics.vehicleOOSDelta > 5) {
    issues.push('vehicle-oos-trend');
  }

  if (data.riskChips.driver === 'Elevated' || data.riskChips.driver === 'Severe' || data.metrics.driverOOS > 8) {
    issues.push('driver-qualification');
  }

  if (data.metrics.driverOOSDelta > 3) {
    issues.push('driver-oos-trend');
  }

  if (data.riskChips.hazmat === 'Elevated' || data.riskChips.hazmat === 'Severe') {
    issues.push('hazmat-documentation');
  }

  if (data.metrics.crashes24mo >= 4 || data.riskChips.crash === 'Elevated' || data.riskChips.crash === 'Severe') {
    issues.push('crash-frequency');
  }

  if (data.metrics.mcs150Freshness === 'Overdue' || data.riskChips.admin === 'Elevated') {
    issues.push('admin-freshness');
  }

  const hasHOSIssue = data.riskDriverDetails.some(d =>
    d.title.toLowerCase().includes('hours') || d.title.toLowerCase().includes('hos') || d.description.toLowerCase().includes('hos')
  );
  if (hasHOSIssue) {
    issues.push('hos-compliance');
  }

  return issues;
}

export function getAiSafetyInsight(data: CarrierBrief): AiInsight {
  const issues = detectIssueTypes(data);
  const primaryIssue = issues[0] || 'vehicle-maintenance';
  const issueInfo = issueDatabase[primaryIssue];
  const name = data.carrierName;

  const signalMap: Record<string, string> = {
    'vehicle-maintenance': `Vehicle Maintenance Risk - ${data.metrics.vehicleOOS.toFixed(1)}% OOS rate`,
    'vehicle-oos-trend': `Deteriorating Vehicle Maintenance Trend - +${data.metrics.vehicleOOSDelta.toFixed(1)} pts`,
    'driver-qualification': `Driver Qualification Risk - ${data.metrics.driverOOS.toFixed(1)}% driver OOS rate`,
    'driver-oos-trend': `Worsening Driver Compliance - +${data.metrics.driverOOSDelta.toFixed(1)} pts`,
    'hazmat-documentation': `Hazmat Documentation / Process Gap - ${data.metrics.basicExposure}`,
    'crash-frequency': `Elevated Crash Frequency - ${data.metrics.crashes24mo} crashes in 24 months`,
    'admin-freshness': `Administrative Compliance Gap - MCS-150 ${data.metrics.mcs150Freshness}`,
    'hos-compliance': 'Hours-of-Service Compliance Deficiency',
  };

  const impactMap: Record<string, string> = {
    'vehicle-maintenance': `Addressing top vehicle defect categories could reduce OOS rate by 8-12 points within 6 months, improving ${name}'s insurability and reducing roadside enforcement risk.`,
    'vehicle-oos-trend': `Reversing the maintenance trend could prevent escalation to intervention-level BASIC percentiles and reduce insurance premium pressure.`,
    'driver-qualification': `Comprehensive DQ file cleanup and monitoring can eliminate driver-related OOS events and reduce liability exposure from unqualified driver operations.`,
    'driver-oos-trend': `Stopping the driver OOS increase early prevents compounding regulatory exposure and avoids potential enforcement actions.`,
    'hazmat-documentation': `Reducing hazmat violations could lower the BASIC percentile below the 80% intervention threshold, avoiding targeted FMCSA enforcement.`,
    'crash-frequency': `Systematic crash reduction could meaningfully impact insurance pricing, regulatory posture, and litigation exposure within 12-18 months.`,
    'admin-freshness': `Filing the MCS-150 immediately restores active status and signals administrative competence to brokers and insurers.`,
    'hos-compliance': `Improved HOS compliance reduces fatigue-related crash risk and lowers the probability of targeted FMCSA enforcement.`,
  };

  return {
    topSignal: signalMap[primaryIssue] || issueInfo.issueType,
    whyItMatters: issueInfo.whyItMatters,
    immediateActions: issueInfo.recommendedActions.slice(0, 4),
    operationalFix: issueInfo.bestNextStep,
    estimatedImpact: impactMap[primaryIssue] || issueInfo.bestNextStep,
  };
}

export function getIssueExplanations(data: CarrierBrief): IssueExplanation[] {
  const issues = detectIssueTypes(data);
  return issues
    .map(key => issueDatabase[key])
    .filter(Boolean);
}

export function getIssueForRiskDriver(driverTitle: string, data: CarrierBrief): IssueExplanation | null {
  const title = driverTitle.toLowerCase();

  if (title.includes('maintenance') || title.includes('vehicle') || title.includes('brake') || title.includes('lighting') || title.includes('tire')) {
    return issueDatabase['vehicle-maintenance'];
  }
  if (title.includes('driver') || title.includes('cdl') || title.includes('qualification') || title.includes('fitness')) {
    return issueDatabase['driver-qualification'];
  }
  if (title.includes('hazmat') || title.includes('haz') || title.includes('placard') || title.includes('shipping')) {
    return issueDatabase['hazmat-documentation'];
  }
  if (title.includes('crash') || title.includes('accident') || title.includes('collision')) {
    return issueDatabase['crash-frequency'];
  }
  if (title.includes('hos') || title.includes('hours') || title.includes('fatigue') || title.includes('eld')) {
    return issueDatabase['hos-compliance'];
  }
  if (title.includes('mcs') || title.includes('admin') || title.includes('filing') || title.includes('freshness')) {
    return issueDatabase['admin-freshness'];
  }
  if (title.includes('enforcement') || title.includes('basic') || title.includes('intervention')) {
    const issues = detectIssueTypes(data);
    const key = issues[0] || 'vehicle-maintenance';
    return issueDatabase[key];
  }

  return null;
}

export function getCompliancePrograms(data: CarrierBrief): ComplianceProgram[] {
  const programs: ComplianceProgram[] = [];
  const chips = data.riskChips;

  if (chips.maintenance === 'Elevated' || chips.maintenance === 'Severe' || data.metrics.vehicleOOS > 21) {
    programs.push({
      category: 'Maintenance',
      title: 'Vehicle Maintenance Compliance Program',
      description: 'A structured program to bring vehicle maintenance performance below national benchmarks and sustain compliance.',
      components: [
        'Preventive maintenance schedule with compliance tracking',
        'DVIR enforcement and defect closeout documentation',
        'Shop defect closeout discipline with time-to-repair metrics',
        'Roadside inspection coaching for drivers',
        'Fleet lifecycle management and replacement planning',
        'Third-party maintenance audit (annual)',
      ],
      expectedOutcome: 'Reduce vehicle OOS rate below 21% national benchmark within 6-9 months. Establish sustainable maintenance processes that prevent regression.',
    });
  }

  if (chips.driver === 'Elevated' || chips.driver === 'Severe' || data.metrics.driverOOS > 7) {
    programs.push({
      category: 'Driver',
      title: 'Driver Qualification & Compliance Program',
      description: 'Ensure all drivers maintain valid credentials and the carrier proactively monitors qualification status.',
      components: [
        'Continuous MVR monitoring service',
        'Driver qualification file audit schedule (quarterly)',
        'Automated CDL and medical card expiration alerts',
        'Annual driver file completeness review',
        'Pre-employment screening program',
        'Driver self-reporting policy for license changes',
      ],
      expectedOutcome: 'Eliminate driver qualification-related OOS events and maintain clean DQ files for all active drivers.',
    });
  }

  if (chips.hazmat === 'Elevated' || chips.hazmat === 'Severe') {
    programs.push({
      category: 'Hazmat',
      title: 'Hazmat Safety & Documentation Program',
      description: 'Structured controls to ensure hazmat shipments are properly documented, placarded, and handled.',
      components: [
        'Pre-departure hazmat documentation review checklist',
        'Placarding verification at dispatch',
        'Hazmat training recertification tracking (3-year cycle)',
        'Dispatch release review for hazmat loads',
        'Hazmat incident reporting and near-miss tracking',
        'Emergency response information verification',
      ],
      expectedOutcome: 'Reduce hazmat BASIC percentile below intervention threshold and eliminate documentation-related violations.',
    });
  }

  if (chips.crash === 'Elevated' || chips.crash === 'Severe' || data.metrics.crashes24mo >= 4) {
    programs.push({
      category: 'Crash',
      title: 'Crash Prevention & Response Program',
      description: 'Comprehensive approach to reducing crash frequency through prevention, analysis, and corrective action.',
      components: [
        'Defensive driving training program',
        'Dash camera / telematics with proactive coaching',
        'Post-crash investigation protocol with root cause analysis',
        'Speed management and route planning technology',
        'Fatigue management and HOS compliance monitoring',
        'Enhanced driver screening and onboarding process',
      ],
      expectedOutcome: 'Reduce crash frequency by 30-50% over 12-18 months through systematic identification and elimination of crash contributing factors.',
    });
  }

  if (programs.length === 0) {
    programs.push({
      category: 'General',
      title: 'Compliance Maintenance Program',
      description: 'Sustain current compliance posture and proactively address emerging risks before they become problems.',
      components: [
        'Quarterly compliance self-audit',
        'Regulatory filing calendar with automated reminders',
        'Driver and vehicle compliance dashboards',
        'Annual third-party safety audit',
      ],
      expectedOutcome: 'Maintain low-risk profile and proactively identify emerging compliance gaps.',
    });
  }

  return programs;
}

export function getGuidedPromptResponse(promptKey: string, data: CarrierBrief): GuidedPromptResponse {
  const name = data.carrierName;
  const issues = detectIssueTypes(data);
  const primaryIssueKey = issues[0] || 'vehicle-maintenance';
  const primaryIssue = issueDatabase[primaryIssueKey];

  const responses: Record<string, GuidedPromptResponse> = {
    'biggest-risks': {
      prompt: 'What are the biggest risks for this carrier?',
      title: `Risk Assessment for ${name}`,
      sections: [
        {
          heading: 'Primary Risk Areas',
          content: data.riskDriverDetails.map(d => `${d.title}: ${d.description}`),
        },
        {
          heading: 'Key Metrics of Concern',
          content: [
            `Vehicle OOS Rate: ${data.metrics.vehicleOOS.toFixed(1)}% (national benchmark: 21%)`,
            `Driver OOS Rate: ${data.metrics.driverOOS.toFixed(1)}% (national benchmark: 5.5%)`,
            `Crashes (24 months): ${data.metrics.crashes24mo}`,
            `BASIC Exposure: ${data.metrics.basicExposure}`,
          ],
        },
        {
          heading: 'Overall Assessment',
          content: `${name} presents ${data.overallRisk.toLowerCase()} risk with a ${data.trend.toLowerCase()} trend. The primary concern is ${primaryIssue.issueType.toLowerCase()}, which requires immediate attention to prevent escalation.`,
        },
      ],
    },
    'improve-safety': {
      prompt: 'How could this carrier improve its safety profile?',
      title: `Safety Improvement Roadmap for ${name}`,
      sections: [
        {
          heading: 'Immediate Actions (0-30 days)',
          content: primaryIssue.recommendedActions,
        },
        {
          heading: 'Short-Term Controls (30-90 days)',
          content: primaryIssue.suggestedControls.slice(0, 3),
        },
        {
          heading: 'Sustained Improvement (90+ days)',
          content: `Build a culture of proactive compliance by implementing systematic monitoring, regular audits, and continuous improvement processes. The goal is to move from reactive correction to preventive controls that catch issues before they become violations.`,
        },
      ],
    },
    'underwriter-concerns': {
      prompt: 'What should an underwriter worry about?',
      title: `Underwriting Risk Factors for ${name}`,
      sections: [
        {
          heading: 'Primary Underwriting Concerns',
          content: [
            data.metrics.vehicleOOS > 21 ? `Vehicle OOS rate of ${data.metrics.vehicleOOS.toFixed(1)}% exceeds the 21% national benchmark, indicating elevated mechanical failure risk` : 'Vehicle maintenance metrics are within acceptable ranges',
            data.metrics.crashes24mo > 3 ? `${data.metrics.crashes24mo} crashes in 24 months signals elevated loss frequency` : 'Crash frequency is within normal parameters',
            data.metrics.driverOOS > 5.5 ? `Driver OOS rate suggests driver qualification or compliance monitoring gaps` : 'Driver compliance metrics are acceptable',
            data.trend === 'Worsening' ? 'Deteriorating trend increases probability of future losses' : data.trend === 'Improving' ? 'Improving trend is a positive indicator for future performance' : 'Stable trend suggests predictable risk profile',
          ],
        },
        {
          heading: 'Risk Trajectory',
          content: `Based on 12-month trend data, ${name}'s risk profile is ${data.trend.toLowerCase()}. ${data.trend === 'Worsening' ? 'Without intervention, metrics are likely to continue deteriorating, increasing loss probability.' : data.trend === 'Improving' ? 'Current trajectory suggests continued improvement if operational controls are maintained.' : 'Current controls are maintaining status quo but not driving measurable improvement.'}`,
        },
        {
          heading: 'Recommended Underwriting Conditions',
          content: data.overallRisk === 'Severe' || data.overallRisk === 'Elevated'
            ? [
              'Request documented corrective action plan before binding',
              'Consider higher deductibles or premium surcharges',
              'Require quarterly safety metric reporting',
              'Include safety improvement milestones in policy terms',
            ]
            : [
              'Standard underwriting terms appropriate',
              'Annual safety metric review recommended',
              'Monitor for trend changes at renewal',
            ],
        },
      ],
    },
    'safety-director-first': {
      prompt: 'What would a safety director do first?',
      title: `Safety Director Action Plan for ${name}`,
      sections: [
        {
          heading: 'Day 1 Priority',
          content: primaryIssue.bestNextStep,
        },
        {
          heading: 'First Week Actions',
          content: primaryIssue.recommendedActions,
        },
        {
          heading: 'First 30 Days',
          content: [
            'Complete initial audit and assessment of all identified risk areas',
            'Establish baseline metrics for tracking improvement',
            'Implement first-priority corrective actions',
            'Set up monitoring dashboards for key compliance indicators',
            'Communicate expectations to all drivers and maintenance staff',
          ],
        },
        {
          heading: 'Success Metrics',
          content: `Target measurable improvement within 90 days. For ${name}, the primary metric to watch is ${data.metrics.vehicleOOS > data.metrics.driverOOS ? `vehicle OOS rate (currently ${data.metrics.vehicleOOS.toFixed(1)}%, target: below 21%)` : `driver OOS rate (currently ${data.metrics.driverOOS.toFixed(1)}%, target: below 5.5%)`}.`,
        },
      ],
    },
    'compliance-controls': {
      prompt: 'Which compliance controls would help most?',
      title: `Priority Compliance Controls for ${name}`,
      sections: (() => {
        const programs = getCompliancePrograms(data);
        return programs.map(p => ({
          heading: p.title,
          content: p.components,
        }));
      })(),
    },
    'reduce-driver-violations': {
      prompt: 'How can this carrier reduce driver-related violations?',
      title: `Driver Violation Reduction Plan for ${name}`,
      sections: [
        {
          heading: 'Root Cause Analysis',
          content: 'Driver-related violations typically stem from qualification file gaps, medical certificate lapses, HOS non-compliance, or inadequate pre-trip procedures. The first step is categorizing recent violations to identify which area drives the most findings.',
        },
        {
          heading: 'Immediate Actions',
          content: [
            'Pull MVRs for all active drivers and flag any license issues',
            'Verify medical certificate dates and CDL endorsements',
            'Review ELD data for HOS compliance patterns',
            'Audit driver qualification files for completeness',
          ],
        },
        {
          heading: 'Ongoing Controls',
          content: [
            'Continuous MVR monitoring with automated alerts',
            'Medical certificate expiration tracking (90-day advance notice)',
            'Real-time HOS monitoring at dispatch level',
            'Quarterly driver file audit program',
            'Pre-trip document verification checklist',
          ],
        },
      ],
    },
    'reduce-maintenance-violations': {
      prompt: 'How can this carrier reduce maintenance-related violations?',
      title: `Maintenance Violation Reduction Plan for ${name}`,
      sections: [
        {
          heading: 'Root Cause Analysis',
          content: `${name}'s vehicle OOS rate of ${data.metrics.vehicleOOS.toFixed(1)}% indicates ${data.metrics.vehicleOOS > 30 ? 'systemic maintenance program failures' : data.metrics.vehicleOOS > 21 ? 'gaps in the preventive maintenance program' : 'minor maintenance process improvements needed'}. Common root causes include inconsistent PM schedule adherence, inadequate pre-trip inspections, and slow defect closeout.`,
        },
        {
          heading: 'Priority Defect Categories',
          content: [
            'Brake systems - most common and highest severity OOS category',
            'Lighting / signals - frequent finding, usually quick to repair',
            'Tires - tread depth, inflation, damage are common findings',
            'Coupling devices - fifth wheel, pintle hook, safety chains',
          ],
        },
        {
          heading: 'Implementation Steps',
          content: [
            'Audit PM schedule adherence for past 90 days',
            'Review shop work order completion rates and time-to-repair',
            'Implement gate audit (no vehicle leaves with known defects)',
            'Train drivers on thorough pre-trip inspection techniques',
            'Establish weekly fleet condition review process',
          ],
        },
      ],
    },
  };

  return responses[promptKey] || responses['biggest-risks'];
}

export function getFixPlanExplanation(fixTitle: string, data: CarrierBrief): FixPlanExplanation {
  const title = fixTitle.toLowerCase();

  if (title.includes('maintenance') || title.includes('gate audit') || title.includes('pre-trip') || title.includes('inspection')) {
    return {
      whyThisMatters: `With a vehicle OOS rate of ${data.metrics.vehicleOOS.toFixed(1)}%, this carrier is sending vehicles to the road with detectable defects. Each roadside OOS event costs an average of $1,200-2,500 in direct costs plus lost revenue.`,
      whatItAddresses: 'Reduces the probability of vehicles being placed out of service at roadside by catching and correcting defects before departure.',
      howToImplement: [
        'Designate a maintenance supervisor responsible for gate audits',
        'Create a standardized inspection checklist covering top OOS categories',
        'Implement a "no dispatch with defects" policy with enforcement',
        'Track pre-trip completion rates and findings daily',
        'Review and correct defects found before end of shift',
      ],
      systemsNeeded: [
        'Pre-trip inspection verification tool or checklist',
        'Defect tracking and work order system',
        'Maintenance supervisor with gate audit authority',
        'PM schedule tracking dashboard',
      ],
    };
  }

  if (title.includes('brake') || title.includes('lighting') || title.includes('tire') || title.includes('trailer') || title.includes('defect')) {
    return {
      whyThisMatters: 'Brake, lighting, and tire defects are the top three categories driving vehicle OOS rates nationally. Targeting these specific defect types yields the fastest improvement in roadside inspection outcomes.',
      whatItAddresses: 'Directly targets the most common and impactful vehicle defect categories that lead to out-of-service events.',
      howToImplement: [
        'Audit current brake inspection and adjustment procedures',
        'Implement daily lighting check as part of pre-trip process',
        'Establish tire tread depth and inflation standards with measurement tools',
        'Create repair priority system: OOS-capable defects get immediate attention',
        'Track defect resolution time from identification to completion',
      ],
      systemsNeeded: [
        'Brake measurement tools and training for technicians',
        'Tire tread depth gauges at every terminal',
        'Defect prioritization and escalation process',
        'Parts inventory management for high-frequency repair items',
      ],
    };
  }

  if (title.includes('hazmat') || title.includes('shipping paper') || title.includes('placard')) {
    return {
      whyThisMatters: 'Hazmat violations carry significantly higher severity weights in FMCSA scoring. A single hazmat documentation error can increase BASIC percentiles more than multiple non-hazmat violations.',
      whatItAddresses: 'Eliminates the most common hazmat violations: shipping paper errors, placarding mistakes, and emergency response information gaps.',
      howToImplement: [
        'Create a pre-departure hazmat checklist that dispatch must complete',
        'Train dispatch staff on shipping paper verification requirements',
        'Implement a "no release" policy until hazmat paperwork is verified',
        'Conduct monthly spot-checks on hazmat documentation accuracy',
      ],
      systemsNeeded: [
        'Hazmat documentation verification checklist',
        'Dispatch training program for hazmat paperwork',
        'Spot-check audit schedule',
        'Hazmat training records tracking system',
      ],
    };
  }

  if (title.includes('driver') || title.includes('coaching') || title.includes('training') || title.includes('mvr') || title.includes('qualification')) {
    return {
      whyThisMatters: 'Driver-related violations and OOS events directly impact both FMCSA BASIC scores and real-world safety outcomes. Well-trained, properly qualified drivers are the foundation of a safe operation.',
      whatItAddresses: 'Improves driver compliance, reduces driver-related violations, and strengthens the overall safety culture of the operation.',
      howToImplement: [
        'Schedule training sessions (classroom or online) for all active drivers',
        'Focus on top violation categories specific to this carrier',
        'Include roadside inspection best practices and professional conduct',
        'Document all training with sign-off sheets for DQ files',
      ],
      systemsNeeded: [
        'Training curriculum covering top violation areas',
        'Training completion tracking system',
        'Driver meeting schedule (monthly recommended)',
        'Training materials and resources',
      ],
    };
  }

  if (title.includes('mcs-150') || title.includes('filing') || title.includes('update') || title.includes('admin')) {
    return {
      whyThisMatters: 'An overdue MCS-150 leads to USDOT deactivation and signals administrative neglect. Brokers and insurers check this status routinely.',
      whatItAddresses: 'Restores and maintains active USDOT status, demonstrates administrative competence to business partners.',
      howToImplement: [
        'Access the FMCSA registration portal and file the update',
        'Verify all company information is current and accurate',
        'Set calendar reminders for the next biennial filing date',
        'Review other regulatory filings (UCR, IFTA, IRP) for currency',
      ],
      systemsNeeded: [
        'FMCSA portal access credentials',
        'Regulatory filing calendar',
        'Compliance tracking spreadsheet or system',
      ],
    };
  }

  if (title.includes('consultant') || title.includes('engage') || title.includes('external')) {
    return {
      whyThisMatters: 'When multiple BASIC categories are at or above intervention thresholds, the complexity of remediation may exceed internal capabilities. External expertise can accelerate improvement and provide structured methodology.',
      whatItAddresses: 'Provides expert assessment and remediation planning across all compliance areas simultaneously.',
      howToImplement: [
        'Research safety consulting firms with FMCSA compliance expertise',
        'Request proposals from 2-3 qualified consultants',
        'Define scope: comprehensive safety audit + remediation plan',
        'Establish clear milestones and success metrics',
      ],
      systemsNeeded: [
        'Budget allocation for consulting engagement',
        'Internal point of contact for consultant coordination',
        'Access to all safety and compliance records for consultant review',
      ],
    };
  }

  if (title.includes('dataq') || title.includes('dispute') || title.includes('challenge')) {
    return {
      whyThisMatters: 'Some violations and inspection results may contain errors that can be corrected through the FMCSA DataQs system. Removing even one invalid record can measurably improve BASIC percentiles.',
      whatItAddresses: 'Corrects inaccurate data in FMCSA records that may be unfairly inflating BASIC scores.',
      howToImplement: [
        'Pull all inspection and violation records from the past 24 months',
        'Review each record for potential errors or disputable items',
        'File DataQs challenges for records with clear factual errors',
        'Track challenge status and follow up on pending reviews',
      ],
      systemsNeeded: [
        'Access to FMCSA DataQs portal',
        'Copies of all inspection reports',
        'Supporting documentation for challenges (repair records, photos)',
      ],
    };
  }

  return {
    whyThisMatters: 'This action addresses a specific compliance or safety gap identified in the carrier risk assessment. Taking action reduces regulatory exposure and improves overall safety posture.',
    whatItAddresses: 'Targets identified compliance gaps that contribute to the carrier\'s current risk score.',
    howToImplement: [
      'Review the specific issue in detail using carrier records',
      'Develop a corrective action plan with clear ownership',
      'Set a target date for implementation',
      'Track progress and verify effectiveness',
    ],
    systemsNeeded: [
      'Access to relevant carrier records and data',
      'Designated responsible person for implementation',
      'Follow-up tracking mechanism',
    ],
  };
}

export function getGuidedPrompts(data: CarrierBrief): { key: string; label: string }[] {
  const prompts: { key: string; label: string }[] = [
    { key: 'biggest-risks', label: 'What are the biggest risks for this carrier?' },
    { key: 'improve-safety', label: 'How could this carrier improve its safety profile?' },
    { key: 'underwriter-concerns', label: 'What should an underwriter worry about?' },
    { key: 'safety-director-first', label: 'What would a safety director do first?' },
    { key: 'compliance-controls', label: 'Which compliance controls would help most?' },
  ];

  if (data.metrics.driverOOS > 5.5 || data.riskChips.driver !== 'Low') {
    prompts.push({ key: 'reduce-driver-violations', label: 'How can this carrier reduce driver-related violations?' });
  }

  if (data.metrics.vehicleOOS > 21 || data.riskChips.maintenance !== 'Low') {
    prompts.push({ key: 'reduce-maintenance-violations', label: 'How can this carrier reduce maintenance-related violations?' });
  }

  return prompts;
}
