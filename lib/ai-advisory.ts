import { CarrierBrief, RiskLevel } from './types';

// Canonical 6-section AI guidance structure per spec
export interface AiIssueGuidance {
  title: string;
  issueType: string;
  summary: string;
  meaning: string;
  whyItMatters: string;
  rootCause: string;
  preventionSteps: string[];
  suggestedControls: string[];
  immediateActions: string[];
  recommendedProgram?: string;
  workflowSteps?: string[];
}

export interface AiInsight {
  topSignal: string;
  whyItMatters: string;
  immediateActions: string[];
  operationalFix: string;
  estimatedImpact: string;
}

// Extended with all 6 sections
export interface IssueExplanation {
  issueType: string;
  summary: string;
  meaning: string;
  rootCause: string;
  whyItMatters: string;
  preventionSteps: string[];
  recommendedActions: string[]; // kept for backward compat — equals preventionSteps
  suggestedControls: string[];
  immediateActions: string[];
  bestNextStep: string;
  recommendedProgram?: string;
  workflowSteps?: string[];
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
    summary: 'Vehicle OOS rate significantly exceeds the 21% national benchmark.',
    meaning:
      'Vehicles operated by this carrier are being placed out of service at roadside inspection stops because they have mechanical defects that inspectors can detect. The most common causes are brake deficiencies, lighting failures, and tire conditions. A rate above 30% means more than 1 in 3 inspected vehicles has an OOS-level defect — a level that signals systemic maintenance failure, not isolated incidents.',
    rootCause:
      'Preventive maintenance program gaps or inconsistent defect closeout discipline. Vehicles are reaching the road with known or detectable defects that should have been caught during pre-trip inspection or shop review.',
    whyItMatters:
      'High vehicle OOS rates directly correlate with roadside enforcement actions, increased liability exposure, and higher insurance costs. A pattern of brake, lighting, or tire defects signals systemic maintenance process failure, not isolated incidents.',
    preventionSteps: [
      'Implement daily pre-trip inspection verification with supervisor sign-off',
      'Audit shop defect closeout process for completeness and timeliness',
      'Establish mandatory repair completion before vehicle dispatch',
      'Review and update preventive maintenance intervals based on actual failure data',
      'Train drivers on thorough pre-trip inspection techniques covering top OOS categories',
    ],
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
      'Third-party maintenance audit (annual)',
    ],
    immediateActions: [
      'Pull the last 90 days of inspection reports and categorize top defect types',
      'Audit the shop defect closeout log — identify any open defects on active vehicles',
      'Conduct a walk-around inspection of at least 20% of the active fleet today',
      'Place any vehicle with an unresolved known defect on a "no dispatch" hold',
      'Schedule a fleet-wide inspection audit within 30 days',
    ],
    bestNextStep:
      'Conduct a fleet-wide inspection audit within 30 days to identify and correct all existing defects, then implement ongoing PM schedule compliance tracking.',
    recommendedProgram: 'Vehicle Maintenance Compliance Program with gate audit and defect closeout tracking',
    workflowSteps: [
      'Driver completes pre-trip DVIR',
      'Defects reported to maintenance supervisor',
      'Work order created — vehicle held if OOS-level defect',
      'Repairs completed and verified by shop supervisor',
      'DVIR signed off with repair documentation',
      'Vehicle cleared for dispatch',
      'Post-trip DVIR submitted at end of shift',
    ],
  },

  'vehicle-oos-trend': {
    issueType: 'Worsening Vehicle OOS Trend',
    summary: 'Vehicle OOS rate is worsening — maintenance controls are losing effectiveness.',
    meaning:
      'Beyond the current OOS rate being elevated, the trajectory over the past 12 months shows a consistent deterioration. This indicates the maintenance program is under growing stress — not a static problem, but one that is accelerating without intervention.',
    rootCause:
      'Maintenance program effectiveness is declining over time. This may be caused by fleet growth outpacing maintenance capacity, shop staffing issues, parts availability problems, or relaxation of PM schedule adherence.',
    whyItMatters:
      'A worsening trend is more concerning than a static elevated rate because it indicates the problem is getting worse, not stabilizing. Without intervention, the trajectory will continue toward critical levels and likely trigger regulatory attention.',
    preventionSteps: [
      'Compare current PM schedule adherence to 12 months ago',
      'Review shop capacity relative to fleet size',
      'Analyze which defect categories are driving the increase',
      'Check whether specific vehicles or vehicle types are disproportionately affected',
      'Set monthly OOS-rate targets with accountability at the shop supervisor level',
    ],
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
    immediateActions: [
      'Pull the 12-month inspection history and chart vehicle OOS rate by month',
      'Identify the top 3 defect categories driving OOS events over that period',
      'Review PM schedule completion rates for the same period',
      'Flag any fleet expansion or staffing changes that correlate with the trend start',
    ],
    bestNextStep:
      'Identify the top 3 defect categories driving the OOS increase, then build targeted corrective action plans for each.',
  },

  'driver-qualification': {
    issueType: 'Driver Qualification Risk',
    summary: 'Driver qualification monitoring gap puts drivers and the carrier at risk.',
    meaning:
      'One or more drivers may be operating commercial motor vehicles without valid or properly documented credentials. This can include expired CDLs, expired or missing medical certificates, incorrect self-certification categories, or incomplete driver qualification files. When a driver is found to be unqualified at a roadside stop, it triggers an OOS order and creates immediate liability exposure.',
    rootCause:
      'Driver qualification monitoring gap. CDL status, medical certificate, and driver file completeness are not being tracked proactively, creating windows where drivers may operate without valid credentials.',
    whyItMatters:
      'A driver operating with a suspended or expired CDL creates serious liability exposure and indicates broader compliance process gaps. Insurance carriers view DQ deficiencies as a leading indicator of organizational safety culture problems.',
    preventionSteps: [
      'Pull updated MVRs for all active drivers immediately',
      'Verify CDL status and endorsements for every active driver',
      'Audit all driver qualification files for completeness',
      'Add self-reporting rules for license suspensions or changes',
      'Verify medical certificate expiration dates and SDLA submission status',
    ],
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
      'CDL self-certification category verification at hire and renewal',
    ],
    immediateActions: [
      'Pull fresh MVRs for all active CDL drivers',
      'Verify each driver\'s medical certificate is current and submitted to the SDLA',
      'Confirm CDL self-certification category shows Non-Excepted Interstate (NI) for interstate operations',
      'Flag any driver with an expired CDL, medical card, or incorrect self-certification — suspend from duty until resolved',
    ],
    bestNextStep:
      'Launch continuous MVR monitoring and conduct a complete audit of all active driver qualification files within 60 days.',
    recommendedProgram: 'Driver Qualification & Compliance Program with continuous MVR monitoring',
    workflowSteps: [
      'Driver application received',
      'Pre-employment MVR pulled and reviewed',
      'CDL self-certification verified (must show NI)',
      'Medical certificate collected and SDLA confirmation obtained',
      'DQF completed and filed',
      'Driver enrolled in continuous MVR monitoring',
      'Annual DQF review cycle begins',
    ],
  },

  'driver-oos-trend': {
    issueType: 'Driver OOS Trend Concern',
    summary: 'Driver OOS rate is trending upward, signaling growing qualification gaps.',
    meaning:
      'The rate at which drivers are being placed out of service at roadside is increasing over the past 12 months. This pattern typically indicates that driver qualification monitoring is not keeping pace with fleet operations — either files are not being updated, MVR monitoring is absent, or medical certificate tracking is inadequate.',
    rootCause:
      'Driver-related out-of-service events may stem from qualification file gaps, medical certificate lapses, HOS violations, or substance/alcohol testing issues. A rising trend suggests the driver management program is not keeping pace with fleet operations.',
    whyItMatters:
      'Driver OOS events are more disruptive than vehicle OOS because they immediately sideline the driver at roadside. They also indicate potential liability exposure if drivers are operating without proper qualifications.',
    preventionSteps: [
      'Audit driver qualification files for completeness and currency',
      'Review medical certificate expiration dates for all active drivers',
      'Analyze which driver OOS categories are most frequent',
      'Verify substance testing program compliance',
      'Implement monthly driver OOS rate tracking with category breakdown',
    ],
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
      'Real-time HOS monitoring at dispatch level',
    ],
    immediateActions: [
      'Pull the last 6 months of driver OOS events and categorize by violation type',
      'Identify the top category and conduct a targeted audit in that area',
      'Pull MVRs for all active drivers and review for status changes',
      'Verify medical certificate status for all active CDL drivers',
    ],
    bestNextStep:
      'Pull the last 6 months of driver OOS events, categorize by type, and address the top category first.',
  },

  'hazmat-documentation': {
    issueType: 'Hazmat Documentation / Process Gap',
    summary: 'Hazmat documentation and placarding errors are creating regulatory exposure.',
    meaning:
      'Hazmat shipments are leaving without proper documentation or with incorrect placarding. This includes shipping paper errors, missing emergency response information, incorrect hazard class markings, or placard selection failures. These violations carry significantly higher severity weights in FMCSA scoring than standard violations.',
    rootCause:
      'Hazmat shipping documentation and placarding procedures are not consistently followed or verified before departure. This may indicate training gaps, time pressure at dispatch, or lack of a formal release process.',
    whyItMatters:
      'Hazmat violations carry higher severity weights in FMCSA scoring and can rapidly escalate BASIC percentiles toward intervention thresholds. Beyond regulatory risk, hazmat documentation errors create real safety hazards for first responders and the public.',
    preventionSteps: [
      'Implement pre-departure hazmat documentation review checklist',
      'Verify placarding accuracy before every hazmat load release',
      'Review emergency response information completeness',
      'Audit recent shipping paper accuracy against actual cargo',
      'Establish dispatch "no release" policy until hazmat paperwork is verified',
    ],
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
    immediateActions: [
      'Pull the last 12 months of inspection records and identify all hazmat-related violations',
      'Review current shipping paper templates for accuracy and completeness',
      'Verify all active hazmat-certified drivers have current training documentation',
      'Implement a dispatch sign-off checklist for all hazmat loads immediately',
    ],
    bestNextStep:
      'Implement a mandatory pre-departure hazmat documentation review for all hazmat shipments, with dispatch sign-off required before load release.',
    recommendedProgram: 'Hazmat Safety & Documentation Program with dispatch release controls',
  },

  'crash-frequency': {
    issueType: 'Elevated Crash Frequency',
    summary: 'Crash frequency is elevated relative to fleet size and industry benchmarks.',
    meaning:
      'This carrier has experienced a higher-than-expected number of crashes relative to miles operated or power units in service. Each crash creates regulatory, legal, and insurance exposure. The FMCSA Crash Indicator BASIC directly tracks this data, and elevated percentiles trigger compliance reviews and targeted enforcement.',
    rootCause:
      'Multiple contributing factors may include driver training gaps, fatigue management issues, vehicle condition, route planning, and hiring practices. Crash patterns should be analyzed to identify whether incidents cluster around specific drivers, routes, times, or equipment.',
    whyItMatters:
      'Crash frequency is the single most impactful factor for insurance pricing and regulatory scrutiny. The FMCSA Crash Indicator BASIC directly triggers compliance reviews and intervention when percentiles exceed thresholds. Each crash creates potential for lawsuits, DOT investigation, and nuclear verdicts.',
    preventionSteps: [
      'Analyze crash reports for common patterns (time, location, driver, equipment)',
      'Implement mandatory post-crash review process with root cause analysis',
      'Review hiring standards and driver screening criteria',
      'Evaluate fatigue management and HOS compliance practices',
      'Deploy telematics or dash cameras for proactive driver coaching',
    ],
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
    immediateActions: [
      'Pull all crash reports from the past 24 months and review each for contributing factors',
      'Map crashes by driver, time of day, route, and equipment to identify patterns',
      'Verify post-crash drug and alcohol testing was completed for each DOT-reportable accident',
      'Review whether any crash drivers had prior incidents or MVR concerns',
    ],
    bestNextStep:
      'Conduct a crash causation analysis on all incidents in the past 24 months to identify the top contributing factors, then build targeted interventions for each.',
    recommendedProgram: 'Crash Prevention & Response Program with telematics and post-crash investigation protocol',
  },

  'hos-compliance': {
    issueType: 'Hours-of-Service Compliance Gap',
    summary: 'HOS violations indicate driver fatigue exposure and dispatch pressure.',
    meaning:
      'Drivers are logging time incorrectly, operating outside of legal HOS limits, or the ELD records show patterns that suggest falsification. This creates both a driver fatigue safety risk and a regulatory violation. HOS violations can result from drivers not understanding the rules, pressure from dispatch to exceed available hours, or deliberate manipulation of ELD records.',
    rootCause:
      'ELD log management procedures may be inadequate, or dispatching practices may create pressure to exceed available hours. Drivers may lack clarity on specific HOS rules or documentation requirements.',
    whyItMatters:
      'HOS violations indicate potential driver fatigue risk, which is a proven contributor to crash causation. The FMCSA HOS BASIC is a key enforcement focus area, and intervention-level percentiles can trigger compliance reviews.',
    preventionSteps: [
      'Review ELD data for systematic log editing or falsification patterns',
      'Audit dispatch practices for hours pressure or unrealistic scheduling',
      'Provide HOS refresher training for all drivers',
      'Implement real-time HOS monitoring at dispatch level',
      'Establish a dispatcher certification requirement for HOS rules',
    ],
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
    immediateActions: [
      'Pull ELD logs for the past 90 days and identify the most common violation types',
      'Review dispatch logs to check if route assignments correlate with HOS violations',
      'Identify any drivers with more than 2 HOS violations — review individually',
      'Implement real-time HOS monitoring at the dispatch dashboard level immediately',
    ],
    bestNextStep:
      'Implement real-time HOS monitoring at the dispatch level so violations can be prevented rather than discovered at roadside.',
    recommendedProgram: 'HOS Compliance Program with dispatch-level monitoring and ELD review cadence',
  },

  'admin-freshness': {
    issueType: 'Stale MCS-150 / Administrative Compliance',
    summary: 'MCS-150 biennial update is overdue, risking USDOT deactivation.',
    meaning:
      'The FMCSA requires carriers to file an updated MCS-150 form every 24 months. An overdue MCS-150 causes the USDOT number to be deactivated — meaning the carrier is not legally authorized to operate in interstate commerce. Brokers, shippers, and insurers routinely check this status, and an inactive USDOT number will disqualify a carrier from loads and coverage.',
    rootCause:
      'The biennial MCS-150 update has not been filed on schedule, which may indicate broader administrative compliance process gaps or lack of awareness of regulatory filing requirements.',
    whyItMatters:
      'Failure to update the MCS-150 results in USDOT number deactivation (INACTIVE status), which means the carrier is not authorized to operate. It also signals to insurers and brokers that the carrier may not be managing regulatory compliance proactively.',
    preventionSteps: [
      'File MCS-150 update immediately if overdue',
      'Verify all information is current and accurate',
      'Set calendar reminders for future filing deadlines',
      'Review other regulatory filings for currency (UCR, IFTA, IRP)',
    ],
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
    immediateActions: [
      'Log in to the FMCSA registration portal and check the MCS-150 due date',
      'If overdue, file the update today — it takes approximately 15 minutes online',
      'Verify that the company information (power units, drivers, operation type) is accurate',
      'Set a recurring calendar reminder for the next biennial filing date',
    ],
    bestNextStep:
      'File the MCS-150 update today if overdue, then establish a regulatory filing calendar to prevent future lapses.',
  },

  'controlled-substance-testing': {
    issueType: 'Controlled Substance / Alcohol Testing Compliance Gap',
    summary: 'Drug and alcohol testing program has compliance deficiencies.',
    meaning:
      "The carrier's DOT-regulated drug and alcohol testing program has gaps that create regulatory violations and liability exposure. This may include missing pre-employment tests, incomplete random testing participation, procedural failures in post-accident testing, or inadequate return-to-duty processes. A single missing test result can be grounds for a driver disqualification or carrier violation during a compliance review.",
    rootCause:
      'Testing program administration gaps — either the carrier lacks a compliant testing protocol, the third-party administrator is not properly managing random selections, or post-accident testing procedures are not being followed consistently.',
    whyItMatters:
      'Drug and alcohol testing compliance is a federally mandated requirement for CMV operations. In the event of an accident, missing test records create catastrophic liability exposure. Carriers with testing program failures face significant regulatory penalties and are viewed as high-risk by underwriters.',
    preventionSteps: [
      'Verify pre-employment testing records are on file for all current drivers',
      'Confirm annual random testing participation meets the minimum percentage requirement',
      'Review post-accident testing procedures for every DOT-reportable accident in the past 24 months',
      'Audit the substance abuse professional (SAP) return-to-duty process for any triggered drivers',
      'Ensure all supervisors have completed required reasonable suspicion training',
    ],
    recommendedActions: [
      'Verify pre-employment testing records are on file for all current drivers',
      'Confirm annual random testing participation meets the minimum percentage requirement',
      'Review post-accident testing procedures',
      'Audit SAP return-to-duty documentation',
    ],
    suggestedControls: [
      'Third-party drug and alcohol testing program administrator (C/TPA)',
      'Random selection tracking with participation confirmation',
      'Post-accident testing decision tree posted at dispatch',
      'Annual program compliance audit',
      'Supervisor reasonable suspicion training tracking',
    ],
    immediateActions: [
      'Pull the driver roster and verify pre-employment test documentation for each driver',
      'Pull the annual random testing participation log and confirm required percentage was met',
      'Review the last 24 months of accident reports — confirm post-accident testing was performed where required',
      'Identify any driver removed from service for testing failure and verify proper SAP process was followed',
    ],
    bestNextStep:
      'Conduct an immediate audit of pre-employment and random testing records for all active drivers, then engage a qualified C/TPA if not already in place.',
    recommendedProgram: 'DOT Drug & Alcohol Testing Compliance Program with C/TPA administration and annual audit',
  },

  'dvir-compliance': {
    issueType: 'DVIR / Driver Vehicle Inspection Report Compliance Gap',
    summary: 'DVIRs are not being completed or defects are not being closed out properly.',
    meaning:
      'Drivers are failing to complete required pre-trip or post-trip Driver Vehicle Inspection Reports (DVIRs), or defects identified on DVIRs are being documented but not repaired before the vehicle is dispatched again. This leads directly to vehicles with known defects reaching public roads — one of the most preventable causes of vehicle OOS events.',
    rootCause:
      'Inadequate DVIR enforcement and defect closeout discipline. Drivers may not understand the inspection requirements, defects may be noted but not repaired, or repair completion is not being verified before redispatch. Shop supervisors may not be reviewing DVIR logs for outstanding items.',
    whyItMatters:
      'DVIR violations are among the most common vehicle-related OOS findings. Beyond the regulatory violation itself, failed DVIRs represent vehicles with known defects reaching public roads. When a driver documents a defect and the vehicle is dispatched without repair, it creates direct regulatory and liability exposure for the carrier.',
    preventionSteps: [
      'Implement a mandatory DVIR completion verification before dispatch',
      'Establish a defect closeout workflow with shop supervisor sign-off',
      'Train drivers on DVIR requirements and what constitutes a reportable defect',
      'Review open DVIRs daily and confirm all defects are resolved before vehicle reuse',
      'Implement a "no dispatch" hold for any vehicle with an unresolved defect',
    ],
    recommendedActions: [
      'Implement a mandatory DVIR completion verification before dispatch',
      'Establish a defect closeout workflow with shop supervisor sign-off',
      'Train drivers on DVIR requirements',
      'Review open DVIRs daily',
    ],
    suggestedControls: [
      'Electronic DVIR system with automated defect alerts',
      'Shop supervisor defect closeout verification process',
      'Daily DVIR compliance report for operations management',
      'Gate audit: no vehicle dispatched without verified clean DVIR or documented repair',
      'DVIR completion rate tracking with accountability at driver and shop level',
    ],
    immediateActions: [
      'Pull the last 30 days of DVIRs and identify any open defects on currently active vehicles',
      'Place any vehicle with an unresolved documented defect on a no-dispatch hold',
      'Verify that shop repair orders correspond to all documented DVIR defects',
      'Check DVIR completion rates — identify drivers who are not completing required inspections',
    ],
    bestNextStep:
      'Implement a daily DVIR audit process where a maintenance supervisor reviews all open defects each morning before dispatch begins.',
    recommendedProgram: 'DVIR Compliance & Defect Closeout Program with electronic tracking and gate audit',
  },

  'speed-management': {
    issueType: 'Speed Management / Unsafe Driving Violation',
    summary: 'Speed-related violations indicate unsafe driving practices or inadequate monitoring.',
    meaning:
      'Drivers are operating at speeds that violate posted limits or are unsafe for conditions. Speed-related violations include exceeding posted limits, driving too fast for conditions, and speeding in construction zones. These violations directly contribute to crash severity and are a leading indicator of overall driver behavior quality.',
    rootCause:
      'Inadequate speed management policies, lack of telematics monitoring for speed events, driver culture that prioritizes delivery speed over safety, or dispatch pressure that incentivizes faster driving.',
    whyItMatters:
      'Speed is a primary contributing factor in crash severity. Carriers with speed-related violations face higher crash risk, elevated insurance premiums, and regulatory scrutiny under the Unsafe Driving BASIC. Speed violations are also visible to shippers and brokers who monitor carrier safety profiles.',
    preventionSteps: [
      'Deploy telematics or dash cameras with real-time speed monitoring',
      'Establish speed policy limits by road type and enforce consistently',
      'Implement proactive driver coaching for speed events',
      'Review dispatch scheduling for unrealistic delivery expectations',
      'Create a progressive discipline policy for repeat speed violations',
    ],
    recommendedActions: [
      'Deploy telematics with speed monitoring',
      'Establish and communicate speed policy limits',
      'Implement driver coaching for speed events',
      'Review dispatch scheduling practices',
    ],
    suggestedControls: [
      'Telematics with real-time speed alerts and driver scoring',
      'Speed limiter (governor) on all vehicles',
      'Monthly driver behavior scorecard with speed metrics',
      'Dispatch scheduling review to eliminate unrealistic time pressure',
      'Progressive discipline policy for repeat speed events',
    ],
    immediateActions: [
      'Pull telematics or ELD speed data for the past 30 days — identify top violators',
      'Review dispatch scheduling to confirm it does not create unrealistic delivery pressure',
      'Conduct a driver meeting to communicate speed policy and consequences',
      'Identify any driver with more than 2 speed violations and address individually',
    ],
    bestNextStep:
      'Deploy telematics with real-time speed alerts and implement a monthly driver behavior scorecard with speed as a primary metric.',
    recommendedProgram: 'Safe Driving Program with telematics monitoring and driver behavior scoring',
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

  const hasDvirIssue = data.riskDriverDetails.some(d =>
    d.title.toLowerCase().includes('dvir') || d.description.toLowerCase().includes('dvir') || d.description.toLowerCase().includes('inspection report')
  );
  if (hasDvirIssue) {
    issues.push('dvir-compliance');
  }

  return issues;
}

export function getAiSafetyInsight(data: CarrierBrief): AiInsight {
  const issues = detectIssueTypes(data);
  const primaryIssue = issues[0] || 'vehicle-maintenance';
  const issueInfo = issueDatabase[primaryIssue];
  const name = data.carrierName;

  const signalMap: Record<string, string> = {
    'vehicle-maintenance': `Vehicle Maintenance Risk — ${data.metrics.vehicleOOS.toFixed(1)}% OOS rate`,
    'vehicle-oos-trend': `Deteriorating Vehicle Maintenance Trend — +${data.metrics.vehicleOOSDelta.toFixed(1)} pts`,
    'driver-qualification': `Driver Qualification Risk — ${data.metrics.driverOOS.toFixed(1)}% driver OOS rate`,
    'driver-oos-trend': `Worsening Driver Compliance — +${data.metrics.driverOOSDelta.toFixed(1)} pts`,
    'hazmat-documentation': `Hazmat Documentation / Process Gap — ${data.metrics.basicExposure}`,
    'crash-frequency': `Elevated Crash Frequency — ${data.metrics.crashes24mo} crashes in 24 months`,
    'admin-freshness': `Administrative Compliance Gap — MCS-150 ${data.metrics.mcs150Freshness}`,
    'hos-compliance': 'Hours-of-Service Compliance Deficiency',
    'controlled-substance-testing': 'Drug & Alcohol Testing Program Gap',
    'dvir-compliance': 'DVIR / Inspection Report Compliance Gap',
    'speed-management': 'Speed Management / Unsafe Driving Pattern',
  };

  const impactMap: Record<string, string> = {
    'vehicle-maintenance': `Addressing top vehicle defect categories could reduce OOS rate by 8–12 points within 6 months, improving ${name}'s insurability and reducing roadside enforcement risk.`,
    'vehicle-oos-trend': `Reversing the maintenance trend could prevent escalation to intervention-level BASIC percentiles and reduce insurance premium pressure.`,
    'driver-qualification': `Comprehensive DQ file cleanup and monitoring can eliminate driver-related OOS events and reduce liability exposure from unqualified driver operations.`,
    'driver-oos-trend': `Stopping the driver OOS increase early prevents compounding regulatory exposure and avoids potential enforcement actions.`,
    'hazmat-documentation': `Reducing hazmat violations could lower the BASIC percentile below the 80% intervention threshold, avoiding targeted FMCSA enforcement.`,
    'crash-frequency': `Systematic crash reduction could meaningfully impact insurance pricing, regulatory posture, and litigation exposure within 12–18 months.`,
    'admin-freshness': `Filing the MCS-150 immediately restores active status and signals administrative competence to brokers and insurers.`,
    'hos-compliance': `Improved HOS compliance reduces fatigue-related crash risk and lowers the probability of targeted FMCSA enforcement.`,
    'controlled-substance-testing': `Full testing program compliance eliminates a significant liability gap and removes a key underwriting concern for insurance carriers.`,
    'dvir-compliance': `Effective DVIR enforcement is the most direct way to reduce vehicle OOS events — catching defects before roadside inspection does.`,
    'speed-management': `Reducing speed violations improves the Unsafe Driving BASIC and lowers crash severity risk across the fleet.`,
  };

  return {
    topSignal: signalMap[primaryIssue] || issueInfo.issueType,
    whyItMatters: issueInfo.whyItMatters,
    immediateActions: issueInfo.immediateActions.slice(0, 4),
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

  if (title.includes('dvir') || title.includes('inspection report')) {
    return issueDatabase['dvir-compliance'];
  }
  if (title.includes('maintenance') || title.includes('vehicle') || title.includes('brake') || title.includes('lighting') || title.includes('tire')) {
    return issueDatabase['vehicle-maintenance'];
  }
  if (title.includes('driver') || title.includes('cdl') || title.includes('qualification') || title.includes('fitness') || title.includes('medical')) {
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
  if (title.includes('drug') || title.includes('alcohol') || title.includes('substance') || title.includes('testing')) {
    return issueDatabase['controlled-substance-testing'];
  }
  if (title.includes('speed') || title.includes('unsafe driving')) {
    return issueDatabase['speed-management'];
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
      expectedOutcome: 'Reduce vehicle OOS rate below 21% national benchmark within 6–9 months. Establish sustainable maintenance processes that prevent regression.',
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
      expectedOutcome: 'Reduce crash frequency by 30–50% over 12–18 months through systematic identification and elimination of crash contributing factors.',
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
          heading: 'Immediate Actions (0–30 days)',
          content: primaryIssue.immediateActions,
        },
        {
          heading: 'Short-Term Controls (30–90 days)',
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
            data.metrics.vehicleOOS > 21
              ? `Vehicle OOS rate of ${data.metrics.vehicleOOS.toFixed(1)}% exceeds the 21% national benchmark, indicating elevated mechanical failure risk`
              : 'Vehicle maintenance metrics are within acceptable ranges',
            data.metrics.crashes24mo > 3
              ? `${data.metrics.crashes24mo} crashes in 24 months signals elevated loss frequency`
              : 'Crash frequency is within normal parameters',
            data.metrics.driverOOS > 5.5
              ? `Driver OOS rate suggests driver qualification or compliance monitoring gaps`
              : 'Driver compliance metrics are acceptable',
            data.trend === 'Worsening'
              ? 'Deteriorating trend increases probability of future losses'
              : data.trend === 'Improving'
                ? 'Improving trend is a positive indicator for future performance'
                : 'Stable trend suggests predictable risk profile',
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
          content: primaryIssue.immediateActions,
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
          content: issueDatabase['driver-qualification'].immediateActions,
        },
        {
          heading: 'Ongoing Controls',
          content: issueDatabase['driver-qualification'].suggestedControls,
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
            'Brake systems — most common and highest severity OOS category',
            'Lighting / signals — frequent finding, usually quick to repair',
            'Tires — tread depth, inflation, damage are common findings',
            'Coupling devices — fifth wheel, pintle hook, safety chains',
          ],
        },
        {
          heading: 'Implementation Steps',
          content: issueDatabase['vehicle-maintenance'].immediateActions,
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
      whyThisMatters: `With a vehicle OOS rate of ${data.metrics.vehicleOOS.toFixed(1)}%, this carrier is sending vehicles to the road with detectable defects. Each roadside OOS event costs an average of $1,200–2,500 in direct costs plus lost revenue.`,
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
        'Request proposals from 2–3 qualified consultants',
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
