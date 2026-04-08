/**
 * Violation AI Context
 *
 * Provides AI-generated explanations for any violation code based on
 * CFR section ranges and BASIC category mapping.
 */

export interface ViolationAiContextResult {
  meaning: string;
  risk: string;
  prevention: string;
}

// CFR Section → category guidance
const CFR_GUIDANCE: Record<string, { category: string; meaning: string; risk: string; prevention: string }> = {
  '390': {
    category: 'General',
    meaning: 'This is a general FMCSA regulatory violation related to carrier registration, insurance, or administrative requirements.',
    risk: 'Administrative violations can lead to operational shutdowns and indicate gaps in compliance management systems.',
    prevention: 'Maintain current MCS-150 filing, ensure proper insurance coverage, and conduct quarterly compliance audits.',
  },
  '391': {
    category: 'Driver Fitness',
    meaning: 'This violation relates to driver qualification — medical certificates, CDL validity, driving records, or employment eligibility.',
    risk: 'Driver fitness violations are OOS-triggering and indicate that unqualified drivers may be operating CMVs, creating significant liability.',
    prevention: 'Implement a driver qualification file (DQF) audit program, verify medical certificates before dispatch, and run MVR checks quarterly.',
  },
  '392': {
    category: 'Unsafe Driving',
    meaning: 'This violation involves on-road driving behavior — speeding, distracted driving, lane violations, seatbelt use, or following too closely.',
    risk: 'Unsafe driving violations directly correlate with crash probability. High percentile scores in this BASIC trigger FMCSA intervention.',
    prevention: 'Deploy telematics-based driver coaching, establish a progressive discipline policy for moving violations, and review dashcam footage weekly.',
  },
  '393': {
    category: 'Vehicle Maintenance',
    meaning: 'This violation relates to vehicle parts and accessories — brakes, tires, lights, coupling devices, cargo securement, or frame/body defects.',
    risk: 'Vehicle maintenance violations are the most common cause of OOS orders. Brake and tire defects are leading contributors to CMV crashes.',
    prevention: 'Enforce daily DVIR completion, shorten PM intervals to 90 days, conduct pre-trip gate audits, and address all defects before dispatch.',
  },
  '395': {
    category: 'HOS Compliance',
    meaning: 'This violation involves hours-of-service rules — driving beyond limits, false log entries, ELD malfunctions, or missing records of duty status.',
    risk: 'HOS violations indicate fatigued driving risk. False log entries are treated as deliberate fraud and carry severe penalties.',
    prevention: 'Monitor ELD compliance in real-time, eliminate dispatch pressure to exceed HOS limits, and audit log edits weekly for patterns.',
  },
  '396': {
    category: 'Vehicle Maintenance',
    meaning: 'This violation relates to inspection, repair, and maintenance programs — DVIR completion, maintenance records, or periodic inspection requirements.',
    risk: 'Systematic maintenance program failures lead to recurring OOS events and indicate that defects are not being identified or corrected.',
    prevention: 'Implement a PM scheduling system, require photographic evidence of defect repairs, and audit DVIR completion rates monthly.',
  },
  '397': {
    category: 'Hazmat Compliance',
    meaning: 'This violation involves hazardous materials transportation — placarding, shipping papers, emergency response information, or container integrity.',
    risk: 'Hazmat violations carry the lowest intervention thresholds. A single serious hazmat OOS can trigger an FMCSA comprehensive investigation.',
    prevention: 'Conduct pre-trip hazmat-specific inspections, verify shipping paper accuracy before loading, and train all drivers on hazmat emergency procedures.',
  },
};

/**
 * Get AI context for a violation code.
 * Tries exact CFR section match first, then falls back to basicCategory.
 */
export function getViolationAiContext(
  code: string,
  basicCategory: string
): ViolationAiContextResult {
  // Extract CFR section prefix (e.g., "393" from "393.45(b)(1)")
  const sectionMatch = code.match(/^(\d{3})/);
  const section = sectionMatch?.[1];

  if (section && CFR_GUIDANCE[section]) {
    return CFR_GUIDANCE[section];
  }

  // Fall back to basicCategory mapping
  const categoryMap: Record<string, ViolationAiContextResult> = {
    'Unsafe Driving': CFR_GUIDANCE['392'],
    'HOS Compliance': CFR_GUIDANCE['395'],
    'Vehicle Maintenance': CFR_GUIDANCE['393'],
    'Driver Fitness': CFR_GUIDANCE['391'],
    'Controlled Substances': {
      meaning: 'This violation relates to controlled substances and alcohol testing requirements for CMV drivers.',
      risk: 'Controlled substance violations indicate serious safety failures and can result in driver disqualification and carrier investigation.',
      prevention: 'Maintain a compliant random testing program, conduct pre-employment testing, and ensure proper SAP return-to-duty procedures.',
    },
    'Hazmat Compliance': CFR_GUIDANCE['397'],
    'Crash Indicator': {
      meaning: 'This record relates to a reportable crash involving a commercial motor vehicle.',
      risk: 'Crash history is a strong predictor of future crashes. Multiple crashes in 24 months significantly increase FMCSA scrutiny.',
      prevention: 'Implement post-crash root cause analysis, deploy forward-facing cameras, and establish a driver safety bonus program.',
    },
  };

  const byCategory = categoryMap[basicCategory];
  if (byCategory) return byCategory;

  return {
    meaning: `This violation (${code}) is a federal motor carrier safety regulation citation found during a roadside inspection.`,
    risk: 'Violations contribute to BASIC percentile scores and can trigger FMCSA intervention when thresholds are exceeded.',
    prevention: 'Review the specific CFR section, train drivers on compliance requirements, and implement preventive controls.',
  };
}

/**
 * Get a BASIC category description for drill-down views.
 */
export function getBasicDescription(basicLabel: string): {
  fullName: string;
  description: string;
  safetyEventGroup: string;
  threshold: number;
} {
  const basics: Record<string, { fullName: string; description: string; safetyEventGroup: string; threshold: number }> = {
    'Unsafe Driving': {
      fullName: 'Unsafe Driving',
      description: 'Operation of commercial motor vehicles by drivers in a dangerous or careless manner. This BASIC includes speeding, reckless driving, improper lane change, and inattention.',
      safetyEventGroup: 'Driver inspections with unsafe driving-related violations and crashes with unsafe driving as a contributing factor.',
      threshold: 65,
    },
    'HOS Compliance': {
      fullName: 'Hours-of-Service Compliance',
      description: 'Operation of commercial motor vehicles by drivers who are ill, fatigued, or in non-compliance with HOS regulations. This BASIC includes driving beyond limits and falsifying logs.',
      safetyEventGroup: 'Driver inspections with HOS-related violations.',
      threshold: 65,
    },
    'Vehicle Maintenance': {
      fullName: 'Vehicle Maintenance',
      description: 'Failure to properly maintain commercial motor vehicles. This includes brakes, tires, lights, and other mechanical defects that can render vehicles unsafe.',
      safetyEventGroup: 'Vehicle inspections with vehicle maintenance-related violations.',
      threshold: 80,
    },
    'Driver Fitness': {
      fullName: 'Driver Fitness',
      description: 'Operation of commercial motor vehicles by drivers who are unfit to operate due to lack of training, experience, or medical issues. Includes CDL and medical certificate violations.',
      safetyEventGroup: 'Driver inspections with driver fitness-related violations.',
      threshold: 80,
    },
    'Controlled Subs': {
      fullName: 'Controlled Substances / Alcohol',
      description: 'Operation of commercial motor vehicles by drivers under the influence of drugs or alcohol. This BASIC tracks violations related to substance use and testing program compliance.',
      safetyEventGroup: 'Driver inspections with controlled substance/alcohol-related violations.',
      threshold: 80,
    },
    'Crash Indicator': {
      fullName: 'Crash Indicator',
      description: 'Histories or patterns of high crash involvement, including frequency and severity. This BASIC uses crash reports rather than inspection data.',
      safetyEventGroup: 'DOT-reportable crashes involving fatalities, injuries, or vehicle tow-aways.',
      threshold: 65,
    },
    'Hazmat Compliance': {
      fullName: 'Hazardous Materials Compliance',
      description: 'Unsafe handling of hazardous materials on a commercial motor vehicle. This includes improper placarding, shipping papers, and container integrity.',
      safetyEventGroup: 'Inspections with hazardous materials-related violations.',
      threshold: 80,
    },
    'Safety Management': {
      fullName: 'Insurance / Other',
      description: 'Overall safety management practices including insurance coverage, administrative compliance, and general regulatory adherence.',
      safetyEventGroup: 'Carrier-level safety management assessment.',
      threshold: 80,
    },
  };

  return basics[basicLabel] || {
    fullName: basicLabel,
    description: `Safety performance in the ${basicLabel} category as measured by the FMCSA Safety Measurement System.`,
    safetyEventGroup: 'Inspections with related violations.',
    threshold: 65,
  };
}
