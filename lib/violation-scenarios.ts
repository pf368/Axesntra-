export interface ViolationScenario {
  id: string;
  code: string;
  title: string;
  severity: 'OOS' | 'Non-OOS' | 'Warning';
  category: string;
  summary: string;
  aiResponses: Record<string, ViolationAiResponse>;
  occurrenceCount?: number;
  mostRecentDate?: string;
  mostRecentState?: string;
  occurrences?: import('./types').ViolationOccurrence[];
}

export interface ViolationAiResponse {
  promptKey: string;
  promptLabel: string;
  sections: ViolationResponseSection[];
  complianceProgram?: ComplianceProgramSummary;
  immediateActions?: string[];
  workflowSteps?: string[];
  workflowConclusion?: string;
}

export interface ViolationResponseSection {
  id: string;
  heading: string;
  icon: 'info' | 'regulation' | 'alert' | 'search' | 'shield' | 'checklist' | 'workflow';
  content: string | string[];
  table?: { headers: string[]; rows: string[][] };
  note?: string;
  subChecklist?: { title: string; items: string[] };
  highlighted?: boolean;
  highlightColor?: 'blue' | 'amber' | 'red' | 'emerald' | 'teal';
}

export interface ComplianceProgramSummary {
  title: string;
  items: string[];
}

// ─── Scenario 1: 391.11(b)(4) Medical Certificate / CDL Self-Certification Mismatch ───

const medicalCertScenario: ViolationScenario = {
  id: 'medical-cert-cdl-mismatch',
  code: '391.11(b)(4)',
  title: 'Medical (Certificate) — Operating a CDL vehicle (non-excepted) while driver self-certified as excepted with SDLA',
  severity: 'OOS',
  category: 'Driver Qualification / Medical Certification',
  summary:
    'Driver operated a non-excepted CDL operation while self-certified with the state under an excepted category that does not meet medical certification requirements.',
  aiResponses: {
    prevent: {
      promptKey: 'prevent',
      promptLabel: 'Ask AI: How do I prevent this?',
      sections: [
        {
          id: 'what-it-means',
          heading: 'What this violation means',
          icon: 'info',
          content: [
            'The driver was operating a non-excepted CDL commercial motor vehicle — meaning the operation requires a valid medical certificate.',
            "However, the driver's CDL self-certification on file with the state licensing agency (SDLA) was listed as Excepted Interstate or Excepted Intrastate.",
            'That mismatch means the driver was not correctly medically qualified for the type of operation being performed.',
            'Because the medical qualification status does not match the actual operation, this creates an out-of-service condition. The driver cannot continue operating until the issue is resolved.',
          ],
        },
        {
          id: 'regulatory-context',
          heading: 'Regulatory context — 49 CFR §391.11(b)(4)',
          icon: 'regulation',
          content: [
            '49 CFR §391.11(b)(4) requires that CDL drivers in non-excepted interstate or intrastate operations be medically qualified.',
            'If the driver self-certified incorrectly with the SDLA, the CDL medical qualification status will not match the real operation being performed.',
            'The state CDL record reflects whatever self-certification category the driver selected. If that category is "excepted," the state may not require or track the medical certificate — even though the actual operation demands it.',
          ],
        },
        {
          id: 'why-it-matters',
          heading: 'Why this matters',
          icon: 'alert',
          content: [
            'Driver qualification failure — the driver was not legally qualified to perform the operation at the time of inspection.',
            'Major roadside and liability exposure — if the driver is involved in an incident while improperly certified, the carrier faces significant legal risk.',
            'Can indicate weak onboarding and MVR review controls — this mismatch should have been caught before the driver was dispatched.',
            'Can point to gaps in DQF (Driver Qualification File) and CDL medical verification workflows that may affect other drivers in the fleet.',
          ],
        },
        {
          id: 'root-cause',
          heading: 'Root cause',
          icon: 'search',
          content: [
            "Mismatch between the actual operation type and the CDL self-certification category on file with the state.",
            "State medical certification record not aligned with the carrier's operation requirements.",
            'Onboarding or MVR review process failed to catch the discrepancy.',
            'No recurring monitoring process in place to detect changes in CDL self-certification status.',
          ],
        },
        {
          id: 'prevent-step-1',
          heading: '1. Verify CDL self-certification status at hire',
          icon: 'checklist',
          content:
            "Confirm the driver's CDL self-certification category with the state licensing agency before the driver is dispatched. For most interstate carriers, drivers should be classified as Non-Excepted Interstate (NI).",
          table: {
            headers: ['Self-Certification Type', 'Description', 'Acceptable?'],
            rows: [
              ['Non-Excepted Interstate (NI)', 'Interstate CMV operation requiring medical card', 'Required for most CDL drivers'],
              ['Excepted Interstate (EI)', 'Certain exempt federal operations', 'Not acceptable for most carriers'],
              ['Non-Excepted Intrastate (NA)', 'Intrastate only', 'Acceptable only for intrastate operations'],
              ['Excepted Intrastate (EA)', 'State exemptions', 'Not acceptable for most carriers'],
            ],
          },
          note: "Require drivers to provide: CDL, MVR showing NI status, and Medical Examiner's Certificate.",
        },
        {
          id: 'prevent-step-2',
          heading: '2. Review the Motor Vehicle Record (MVR)',
          icon: 'checklist',
          content: [
            'The MVR should be checked for:',
            'Self-certification type (must match operation)',
            'Medical certificate expiration date',
            'Medical status (certified / not certified)',
          ],
          note: 'Preventive policy: Reject or hold any driver whose CDL shows EI or EA if the role requires non-excepted interstate operation.',
        },
        {
          id: 'prevent-step-3',
          heading: '3. Require medical certificate submission to the state',
          icon: 'checklist',
          content: [
            'The driver must submit the medical certificate to the SDLA after each physical examination.',
            'If the state does not have the certificate on record, the CDL may show "not certified" or the driver may be at risk of CDL downgrade.',
          ],
          note: 'Carrier practice: Collect medical card copy, long form if required, and confirm the state record has been updated.',
        },
        {
          id: 'prevent-step-4',
          heading: '4. Add a DQF verification step',
          icon: 'checklist',
          content:
            'Create a formal verification checkpoint in the Driver Qualification File process specifically for CDL medical certification alignment.',
          subChecklist: {
            title: 'CDL Medical Certification Verification Checklist',
            items: [
              'CDL type confirmed',
              'Self-certification category verified (must be NI for interstate)',
              'Medical certificate valid and on file',
              'State CDL record matches medical status',
              'Operation type matches certification category',
            ],
          },
        },
        {
          id: 'prevent-step-5',
          heading: '5. Conduct periodic MVR monitoring',
          icon: 'checklist',
          content: [
            'Monitor for certificate expiration, CDL downgrades, and self-certification changes.',
            'At hire — mandatory',
            'Annually — minimum',
            'Continuous monitoring — preferred for proactive compliance',
          ],
        },
        {
          id: 'prevent-step-6',
          heading: '6. Driver training',
          icon: 'checklist',
          content: [
            'Drivers often select the wrong self-certification category when renewing their CDL at the DMV.',
            'Drivers should be trained to always choose Non-Excepted Interstate (NI) unless they are truly exempt.',
            'Include this instruction in onboarding materials and in pre-renewal reminders.',
          ],
        },
        {
          id: 'best-practice-rule',
          heading: 'Pre-Dispatch Compliance Rule',
          icon: 'shield',
          highlighted: true,
          highlightColor: 'blue',
          content: [
            'A driver cannot operate a CDL CMV unless all three conditions match:',
            'CDL self-certification = Non-Excepted Interstate (NI)',
            'Medical card = valid and on file',
            'State CDL record = medically certified',
          ],
        },
      ],
      complianceProgram: {
        title: 'Recommended Compliance Program',
        items: [
          'MVR review at hire',
          'Continuous or annual MVR monitoring',
          'CDL self-certification verification',
          'Medical card collection and SDLA confirmation',
          'DQF compliance checklist',
          'Driver renewal / self-certification training',
        ],
      },
      immediateActions: [
        'Audit all active CDL driver self-certification statuses',
        'Pull updated MVRs for all CDL drivers',
        'Validate state medical certification records match operation type',
        'Add a DQF medical verification step to your onboarding process',
        'Implement MVR monitoring if not already in place',
      ],
      workflowSteps: [
        'Driver hired',
        'Pull MVR',
        'Verify NI self-certification',
        'Collect medical certificate',
        'Confirm state CDL medical status',
        'Place documents in DQF',
        'Enroll driver in MVR monitoring',
      ],
      workflowConclusion:
        'If these checks are performed consistently, this OOS violation becomes extremely unlikely to occur.',
    },

    'why-oos': {
      promptKey: 'why-oos',
      promptLabel: 'Ask AI: Why is this OOS?',
      sections: [
        {
          id: 'oos-definition',
          heading: 'Why this is an out-of-service condition',
          icon: 'alert',
          content: [
            'An out-of-service (OOS) order means the driver cannot continue operating until the condition is corrected.',
            "This violation is OOS because the driver is not medically qualified for the type of operation being performed. The self-certification mismatch means the state CDL record does not reflect valid medical qualification for non-excepted operation.",
            'Under FMCSA rules, a driver who is not medically qualified cannot legally operate a CMV. This is not a paperwork technicality — it is a disqualifying condition.',
          ],
        },
        {
          id: 'oos-consequences',
          heading: 'Consequences of this OOS event',
          icon: 'info',
          content: [
            'Driver is immediately placed out of service — cannot drive until resolved.',
            'The carrier must arrange for another qualified driver or alternative transportation.',
            'The violation is recorded in FMCSA SMS and contributes to Driver Fitness BASIC percentile.',
            'Pattern of similar violations can trigger a FMCSA compliance investigation.',
            'Creates significant liability exposure if an incident occurs while the driver is improperly certified.',
          ],
        },
        {
          id: 'oos-resolution',
          heading: 'How to resolve at roadside',
          icon: 'workflow',
          content: [
            'The driver cannot simply produce a medical card at the scene — the underlying self-certification with the state must also be corrected.',
            'Immediately: dispatch a qualified replacement driver for the current load.',
            'Within 24 hours: have the driver visit the SDLA to correct the self-certification to Non-Excepted Interstate (NI).',
            'Within 48 hours: obtain an updated MVR confirming the correction and place it in the DQF.',
          ],
        },
        {
          id: 'oos-fleet-risk',
          heading: 'Fleet-wide risk',
          icon: 'alert',
          highlighted: true,
          highlightColor: 'red',
          content: [
            'If one driver has this issue, others likely do too.',
            'Drivers frequently make the wrong self-certification choice at CDL renewal without realizing it.',
            'A single roadside OOS finding is often a signal of a systemic gap in driver qualification controls.',
          ],
        },
      ],
      immediateActions: [
        'Dispatch a qualified replacement driver for the current load',
        'Instruct the cited driver to visit the SDLA to correct self-certification to NI',
        'Obtain updated MVR after correction is made',
        'Audit all remaining CDL drivers for the same self-certification issue',
        'Document corrective actions in the DQF',
      ],
    },

    'internal-control': {
      promptKey: 'internal-control',
      promptLabel: 'Ask AI: What internal control would catch this?',
      sections: [
        {
          id: 'control-overview',
          heading: 'The control that prevents this violation',
          icon: 'shield',
          content:
            "A single verification checkpoint at hire and at each MVR review cycle can catch this before dispatch. The control confirms that the driver's CDL self-certification category matches the carrier's operation type.",
        },
        {
          id: 'control-design',
          heading: 'Control design',
          icon: 'checklist',
          content: [
            "Trigger: driver is hired, annual MVR review is due, or CDL renewal occurs.",
            'Action: pull MVR and check the self-certification field — must show "NI" (Non-Excepted Interstate) for interstate operations.',
            'If NI confirmed: proceed with onboarding or clearance.',
            'If EI, NA, or EA: HOLD — driver cannot be dispatched until corrected.',
            'Escalation: notify compliance manager. Driver must visit SDLA to update self-certification before operating.',
          ],
        },
        {
          id: 'control-frequency',
          heading: 'Control frequency',
          icon: 'info',
          content: [
            'At hire — mandatory before first dispatch',
            'Annually — during MVR review cycle',
            'At CDL renewal — drivers sometimes inadvertently change category at the DMV',
            'Continuous MVR monitoring — catches mid-cycle changes before a roadside inspection does',
          ],
        },
        {
          id: 'control-ownership',
          heading: 'Control ownership',
          icon: 'workflow',
          content: [
            'Primary owner: Safety or Compliance Manager',
            'Secondary owner: HR or Recruiting (at hire)',
            'Audit responsibility: Safety Director (quarterly review of all active drivers)',
          ],
        },
        {
          id: 'control-callout',
          heading: 'Why this control is rarely in place',
          icon: 'alert',
          highlighted: true,
          highlightColor: 'amber',
          content: [
            'Most MVR reviews check license validity and violations — they do not specifically look at the self-certification field.',
            'Carriers often assume the driver selected the correct category. That assumption is wrong often enough to create real OOS exposure.',
            'Adding one line to your MVR review checklist eliminates this risk entirely.',
          ],
        },
      ],
      complianceProgram: {
        title: 'Minimum Controls Required',
        items: [
          'MVR self-certification field check at hire',
          'Annual MVR review with explicit self-certification verification',
          'CDL renewal notification process for drivers',
          'Automated MVR monitoring with alert on status change',
        ],
      },
      immediateActions: [
        'Add self-certification check to your onboarding MVR review checklist',
        'Audit all current drivers for self-certification status today',
        'Set up MVR monitoring with alerts for status changes',
        'Document this control in your compliance procedures manual',
      ],
    },

    workflow: {
      promptKey: 'workflow',
      promptLabel: 'Ask AI: Show a compliance workflow',
      sections: [
        {
          id: 'workflow-overview',
          heading: 'CDL Medical Certification Compliance Workflow',
          icon: 'workflow',
          content:
            'This workflow ensures every CDL driver is properly self-certified and medically qualified before operating. Follow it at hire and repeat at every MVR review cycle.',
        },
        {
          id: 'workflow-steps-detail',
          heading: 'Detailed step descriptions',
          icon: 'checklist',
          content: [
            'Step 1 — Hire: Collect CDL copy and signed application.',
            'Step 2 — Pull MVR: Order through your MVR provider or state portal.',
            'Step 3 — Check self-certification: Must show "NI" (Non-Excepted Interstate) for interstate operations.',
            'Step 4 — If not NI: STOP. Driver must correct self-certification at SDLA before dispatch.',
            'Step 5 — Collect medical certificate: Verify it is current and matches the driver.',
            "Step 6 — Confirm state record: Verify the SDLA has the medical certificate and CDL shows 'medically certified.'",
            'Step 7 — Complete DQF: File CDL copy, MVR, medical certificate, and self-certification verification.',
            'Step 8 — Enroll in MVR monitoring: Set up continuous or annual monitoring for status changes.',
          ],
        },
        {
          id: 'workflow-gates',
          heading: 'Decision gates',
          icon: 'shield',
          highlighted: true,
          highlightColor: 'amber',
          content: [
            'Gate 1 (Hire): MVR shows NI + valid medical → CLEAR TO DISPATCH',
            'Gate 1 (Hire): MVR shows EI / EA / NA for interstate op → DO NOT DISPATCH',
            'Gate 2 (Annual): MVR still shows NI + medical current → CLEAR TO CONTINUE',
            'Gate 2 (Annual): Any change in status → SUSPEND OPERATIONS UNTIL RESOLVED',
          ],
        },
      ],
      workflowSteps: [
        'Driver hired',
        'Pull MVR from state or provider',
        'Verify NI self-certification field',
        'Collect medical certificate',
        'Confirm state CDL medical status',
        'Complete DQF with all documents',
        'Enroll in MVR monitoring',
        'Annual review cycle repeats from Step 2',
      ],
      workflowConclusion:
        'Following this workflow at every hire and review cycle eliminates the conditions that lead to this OOS violation.',
      immediateActions: [
        'Map this workflow against your current onboarding process',
        'Identify which steps are missing or not documented',
        'Assign ownership for each step',
        'Implement and test the workflow on your next new hire',
      ],
    },
  },
};

// ─── Scenario 2: 395.8 — HOS / ELD False Record of Duty Status ───

const hosEldScenario: ViolationScenario = {
  id: 'hos-eld-false-record',
  code: '395.8(e)(1)',
  title: 'False Record of Duty Status — ELD log does not accurately reflect driver hours or on-duty time',
  severity: 'OOS',
  category: 'Hours-of-Service / ELD Compliance',
  summary:
    'Driver\'s electronic record of duty status contains inaccurate entries or has been edited in a way that does not reflect actual hours driven or on-duty time. Inspector determined the log does not accurately represent the driver\'s activities.',
  aiResponses: {
    prevent: {
      promptKey: 'prevent',
      promptLabel: 'Ask AI: How do I prevent this?',
      sections: [
        {
          id: 'what-it-means',
          heading: 'What this violation means',
          icon: 'info',
          content: [
            'The driver\'s record of duty status (RODS) — whether on an ELD or paper log — does not accurately reflect the actual activities, hours driven, or on-duty time.',
            'This can mean: log edits not supported by documentation, time-of-day discrepancies between ELD data and GPS or fuel records, driving time recorded as off-duty, or missing entries for known on-duty periods.',
            'A false record of duty status is one of the most serious HOS violations because it indicates either deliberate falsification or a fundamental failure in log management training.',
            'When an inspector finds that the log does not match the truck\'s actual movement (GPS, odometer, fuel receipts), this is cited as a false record and results in an immediate OOS order.',
          ],
        },
        {
          id: 'regulatory-context',
          heading: 'Regulatory context — 49 CFR §395.8(e)(1)',
          icon: 'regulation',
          content: [
            '49 CFR §395.8 requires drivers to maintain a record of duty status that accurately reflects all on-duty, driving, and off-duty time.',
            'Section 395.8(e)(1) specifically prohibits false reports — any log entry that does not accurately represent actual driver activity.',
            'The ELD mandate (49 CFR §395.22) requires most CMV drivers to use certified electronic logging devices. ELD data is harder to falsify than paper logs, but edits, malfunctions, and data gaps can still create false-record violations.',
            'FMCSA inspectors cross-reference ELD data against GPS records, fuel receipts, toll records, and shipper/receiver timestamps to detect inconsistencies.',
          ],
        },
        {
          id: 'why-it-matters',
          heading: 'Why this matters',
          icon: 'alert',
          content: [
            'HOS violations are a direct safety issue — fatigue is one of the leading causes of serious truck crashes.',
            'A false-record finding is treated more seriously than a routine HOS violation because it implies intent.',
            'Multiple false-record violations can trigger an FMCSA compliance review or targeted investigation.',
            'If a crash occurs while a driver is operating with a false log, the carrier faces substantially elevated liability exposure.',
            'The HOS Compliance BASIC tracks this data — elevated percentiles increase insurance costs and regulatory scrutiny.',
          ],
        },
        {
          id: 'root-cause',
          heading: 'Likely root cause',
          icon: 'search',
          content: [
            'Dispatch pressure: driver was expected to complete a run that exceeded available hours, leading to log manipulation to avoid refusal.',
            'Training gap: driver does not understand when and how to properly edit ELD entries, or how annotations must match supporting documentation.',
            'Cultural tolerance: if other drivers or management implicitly accept log fudging, it becomes normalized.',
            'ELD unfamiliarity: driver is manipulating the device due to confusion about how it works, not deliberate falsification.',
          ],
        },
        {
          id: 'prevent-step-1',
          heading: '1. Audit ELD data against GPS and fuel records',
          icon: 'checklist',
          content: [
            'Cross-reference ELD driving time against GPS position history for each driver on a weekly basis.',
            'Flag any discrepancies — particularly driving time recorded as off-duty, gaps in movement records, or edits without annotations.',
            'Use telematics reports to identify drivers whose logs do not align with physical records.',
          ],
          note: 'Regular audits show drivers that compliance is monitored and create a deterrent against deliberate falsification.',
        },
        {
          id: 'prevent-step-2',
          heading: '2. Eliminate dispatch pressure on hours',
          icon: 'checklist',
          content: [
            'Review dispatch scheduling practices — are loads being assigned that require more hours than are legally available?',
            'Implement a dispatcher HOS visibility tool so dispatchers can see driver available hours before assigning loads.',
            'Create a formal policy: dispatchers are prohibited from assigning loads that a driver cannot legally complete.',
            'Establish a culture where drivers can refuse an assignment on HOS grounds without fear of retaliation.',
          ],
        },
        {
          id: 'prevent-step-3',
          heading: '3. Train drivers on ELD edit procedures',
          icon: 'checklist',
          content: [
            'Drivers must understand that ELD edits are not violations — but edits must be accurate, annotated, and supported by documentation.',
            'Common legitimate edits: correcting duty status during an unloading delay, logging personal conveyance, or correcting a missed login.',
            'Training should cover: when edits are appropriate, how to annotate, and why GPS-log consistency matters.',
          ],
          subChecklist: {
            title: 'ELD Training Topics',
            items: [
              'How to log all duty statuses correctly',
              'When and how to make proper annotated edits',
              'Understanding personal conveyance rules',
              'What inspectors check during a roadside inspection',
              'How to handle ELD malfunctions properly',
            ],
          },
        },
        {
          id: 'prevent-step-4',
          heading: '4. Implement real-time HOS monitoring',
          icon: 'checklist',
          content: [
            'Deploy a dispatch-level HOS dashboard that shows each driver\'s available hours in real time.',
            'Set automated alerts when drivers are within 2 hours of their limit.',
            'Designate a compliance officer to review flagged ELD events each day.',
          ],
        },
        {
          id: 'prevent-step-5',
          heading: '5. Weekly ELD compliance review',
          icon: 'checklist',
          content: [
            'Assign a safety manager or compliance officer to review ELD logs weekly.',
            'Look for: gaps in driving records, repeated same-day edits, unusual off-duty periods during known delivery windows.',
            'Use the review findings to coach individual drivers proactively.',
          ],
        },
        {
          id: 'best-practice-rule',
          heading: 'The standard to hold',
          icon: 'shield',
          highlighted: true,
          highlightColor: 'blue',
          content: [
            'Every driver\'s ELD log should be explainable by their actual day.',
            'If a log cannot be validated against GPS, fuel receipts, and known stops — it should not be submitted.',
            'Dispatchers must plan runs that fit within legal hours. If the run is too long, the load gets two drivers or a relay — not a falsified log.',
          ],
        },
      ],
      complianceProgram: {
        title: 'Recommended HOS Compliance Program',
        items: [
          'Real-time dispatch-level HOS monitoring dashboard',
          'Weekly ELD audit with GPS cross-reference',
          'Driver HOS and ELD training (annual)',
          'Dispatcher HOS planning certification',
          'ELD edit review and annotation policy',
          'No-retaliation policy for HOS refusals',
        ],
      },
      immediateActions: [
        'Pull ELD logs for all drivers for the past 30 days and cross-reference against GPS data',
        'Identify any drivers with unexplained edit patterns or GPS-log discrepancies',
        'Review dispatch logs to determine if scheduling practices created hours pressure',
        'Brief all drivers and dispatchers on false-record consequences and proper ELD procedure',
        'Implement real-time HOS monitoring at the dispatch level if not already in place',
      ],
      workflowSteps: [
        'Load assigned — dispatcher verifies driver has sufficient available hours',
        'Driver logs on duty and begins trip',
        'ELD records driving and on-duty time automatically',
        'Driver makes annotated edit if an error occurred (with supporting documentation)',
        'Compliance officer reviews ELD logs weekly vs. GPS records',
        'Discrepancies flagged and addressed with driver',
        'Monthly pattern report reviewed by Safety Director',
      ],
      workflowConclusion:
        'When dispatchers plan within legal hours and drivers maintain accurate logs, false-record violations become essentially preventable.',
    },

    'why-oos': {
      promptKey: 'why-oos',
      promptLabel: 'Ask AI: Why is this OOS?',
      sections: [
        {
          id: 'oos-definition',
          heading: 'Why a false record creates an OOS condition',
          icon: 'alert',
          content: [
            'A false record of duty status results in an OOS order because the inspector cannot verify how many hours the driver has actually worked.',
            'If the log has been falsified, the inspector has no reliable basis to determine whether the driver is fatigued. The driver could be many hours beyond their legal driving limit.',
            'FMCSA regulations treat an unverifiable or false log the same as exceeding hours — the driver cannot continue until the situation is resolved.',
            'The OOS order protects other road users from a driver who may be operating in a deeply fatigued state with no reliable record to establish otherwise.',
          ],
        },
        {
          id: 'oos-consequences',
          heading: 'Consequences of this OOS event',
          icon: 'info',
          content: [
            'Driver is placed out of service — cannot drive until the HOS situation is resolved (typically until the driver has accumulated enough off-duty time to restart).',
            'The citation is recorded in FMCSA SMS — contributes to the HOS Compliance BASIC.',
            'False record violations are flagged at a higher severity level than standard HOS violations.',
            'Carrier may be referred for targeted compliance review if pattern continues.',
            'Load must be handed off or delayed — direct operational cost to the carrier.',
          ],
        },
        {
          id: 'severity-distinction',
          heading: 'False record vs. standard HOS violation',
          icon: 'info',
          highlighted: true,
          highlightColor: 'red',
          content: [
            'Standard HOS violation: driver exceeded hours limits — log accurately records what happened.',
            'False record: the log does not reflect what actually happened — inaccurate or edited to obscure actual hours.',
            'False records carry a higher FMCSA severity weight and are treated as evidence of intent to evade compliance — not just an operational mistake.',
            'From an underwriting and liability perspective, false records are treated as a major red flag.',
          ],
        },
        {
          id: 'oos-resolution',
          heading: 'How to resolve at roadside',
          icon: 'workflow',
          content: [
            'The driver must stop driving immediately.',
            'The carrier should dispatch a replacement driver if the load must continue.',
            'The driver typically must take enough off-duty time to reset before resuming operation.',
            'The cited ELD data and inspection report should be retained for follow-up and any potential DataQs challenge.',
          ],
        },
      ],
      immediateActions: [
        'Dispatch a qualified replacement driver for the load',
        'Retain all ELD records, GPS data, and the inspection report from this incident',
        'Brief the cited driver on the violation and conduct a root cause conversation',
        'Pull that driver\'s last 30 days of logs for a compliance review',
        'Review dispatch records to determine if scheduling contributed to the falsification',
      ],
    },

    'internal-control': {
      promptKey: 'internal-control',
      promptLabel: 'Ask AI: What internal control would catch this?',
      sections: [
        {
          id: 'control-overview',
          heading: 'The control that prevents false records',
          icon: 'shield',
          content:
            'A weekly ELD-vs-GPS audit, combined with a dispatch hours-visibility tool, catches false records before they reach a roadside inspection — and eliminates the pressure that typically causes them.',
        },
        {
          id: 'control-1',
          heading: 'Control 1: ELD-GPS cross-reference audit',
          icon: 'checklist',
          content: [
            'Weekly: pull each driver\'s ELD driving time and cross-reference against GPS location history.',
            'Flag: any period where GPS shows movement but ELD shows off-duty or sleeper.',
            'Flag: any ELD edits without clear annotations or supporting documentation.',
            'Escalate: all flagged records to the Safety Director for review within 48 hours.',
          ],
          note: 'Most ELD platforms and telematics systems can generate this report automatically.',
        },
        {
          id: 'control-2',
          heading: 'Control 2: Dispatch hours visibility',
          icon: 'checklist',
          content: [
            'Dispatchers should see each driver\'s available hours before assigning a load.',
            'System should flag any load assignment that exceeds the driver\'s available hours.',
            'Policy: dispatchers cannot override this flag without Safety Director approval.',
          ],
        },
        {
          id: 'control-3',
          heading: 'Control 3: ELD edit review workflow',
          icon: 'checklist',
          content: [
            'All ELD edits are reviewed by the compliance officer within 24 hours.',
            'Each edit must have an annotation explaining the reason.',
            'Repeated edits by the same driver trigger a coaching conversation.',
            'More than 3 unexplained or unsupported edits in 30 days triggers formal review.',
          ],
        },
        {
          id: 'control-callout',
          heading: 'The real root cause of false records',
          icon: 'alert',
          highlighted: true,
          highlightColor: 'amber',
          content: [
            'False records rarely happen in a vacuum. They almost always follow a pattern where a driver feels they must complete an assignment that exceeds their legal hours.',
            'Fixing the detection control (weekly audit) prevents the violation from reaching a roadside inspection.',
            'Fixing the root cause (dispatch pressure) prevents the falsification from happening at all.',
            'Both controls are needed.',
          ],
        },
      ],
      complianceProgram: {
        title: 'Minimum HOS Controls',
        items: [
          'Weekly ELD-vs-GPS cross-reference review',
          'Dispatch hours visibility tool (real-time)',
          'ELD edit review and annotation policy',
          'Driver HOS training (annual)',
          'Dispatcher HOS planning certification',
        ],
      },
      immediateActions: [
        'Set up a weekly ELD audit process with GPS cross-reference',
        'Give dispatchers real-time visibility into driver available hours',
        'Create an ELD edit annotation policy and brief all drivers',
        'Review the last 30 days of logs for all drivers for patterns',
      ],
    },

    workflow: {
      promptKey: 'workflow',
      promptLabel: 'Ask AI: Show a compliance workflow',
      sections: [
        {
          id: 'workflow-overview',
          heading: 'HOS / ELD Compliance Workflow',
          icon: 'workflow',
          content:
            'This workflow covers the full HOS compliance cycle — from load assignment through weekly log audit — to prevent false records from occurring or going undetected.',
        },
        {
          id: 'workflow-steps-detail',
          heading: 'Step-by-step process',
          icon: 'checklist',
          content: [
            'Step 1 — Load assigned: Dispatcher checks driver available hours before assigning.',
            'Step 2 — Driver logs on: ELD records login time and duty status.',
            'Step 3 — Trip in progress: ELD automatically logs driving and on-duty time.',
            'Step 4 — Any edits: Driver makes annotated edit with reason; compliance officer notified.',
            'Step 5 — End of day: Driver certifies log; compliance officer reviews flagged events.',
            'Step 6 — Weekly audit: ELD records compared to GPS history for all drivers.',
            'Step 7 — Discrepancies: Flagged records escalated to Safety Director within 48 hours.',
            'Step 8 — Coaching or action: Driver receives coaching; repeated issues trigger formal process.',
          ],
        },
        {
          id: 'workflow-gates',
          heading: 'Decision gates',
          icon: 'shield',
          highlighted: true,
          highlightColor: 'teal',
          content: [
            'Gate 1 (Dispatch): Driver hours available for load → ASSIGN. Insufficient hours → REASSIGN or SPLIT.',
            'Gate 2 (Edit review): Edit annotated with valid reason → CLEAR. Unannotated or suspicious edit → ESCALATE.',
            'Gate 3 (Weekly audit): ELD matches GPS → CLEAR. ELD-GPS discrepancy → INVESTIGATE.',
          ],
        },
      ],
      workflowSteps: [
        'Dispatcher verifies driver available hours',
        'Load assigned within legal hours',
        'Driver logs on and ELD records trip',
        'Any edits annotated and reviewed within 24 hours',
        'End-of-day log certified by driver',
        'Weekly ELD audit vs. GPS completed',
        'Discrepancies escalated and addressed',
      ],
      workflowConclusion:
        'When dispatchers plan within legal hours and logs are audited weekly, false-record violations are preventable.',
      immediateActions: [
        'Map this workflow against your current dispatch and compliance process',
        'Identify which gates are missing or not enforced',
        'Assign ownership for the weekly ELD audit',
        'Implement the dispatch hours-check gate before the next load assignment cycle',
      ],
    },
  },
};

// ─── Scenario 3: 396.3(a)(1) — Brakes Out of Adjustment / Defective Brakes ───

const brakeDefectScenario: ViolationScenario = {
  id: 'brake-defect-out-of-adjustment',
  code: '396.3(a)(1)',
  title: 'Brakes Out of Adjustment — Vehicle placed OOS for brake deficiency detected at roadside inspection',
  severity: 'OOS',
  category: 'Vehicle Maintenance / Brake Systems',
  summary:
    'One or more brakes on the vehicle were found to be out of adjustment, defective, or otherwise not meeting the performance standards required by federal regulations. Brakes are the single most common cause of vehicle out-of-service orders.',
  aiResponses: {
    prevent: {
      promptKey: 'prevent',
      promptLabel: 'Ask AI: How do I prevent this?',
      sections: [
        {
          id: 'what-it-means',
          heading: 'What this violation means',
          icon: 'info',
          content: [
            'The inspector found one or more brakes that did not meet the federal brake performance standard — most commonly: brakes out of adjustment (pushrod travel exceeded allowed stroke), cracked or worn drums, defective brake linings, or inoperative slack adjusters.',
            'Brake defects are the #1 cause of vehicle OOS conditions nationally. This is not an obscure or technical violation — it is the most frequent finding at roadside inspection.',
            'An out-of-adjustment brake means the braking force applied at that wheel is reduced or absent. In an emergency stop, the vehicle\'s stopping distance increases significantly.',
            'Brake defects are typically caught during pre-trip inspection — if a vehicle reaches roadside with a brake OOS defect, it means the pre-trip inspection missed it or was not performed thoroughly.',
          ],
        },
        {
          id: 'regulatory-context',
          heading: 'Regulatory context — 49 CFR §396.3(a)(1)',
          icon: 'regulation',
          content: [
            '49 CFR §396.3(a)(1) requires that all parts and accessories of a commercial motor vehicle be in safe and proper operating condition at all times.',
            'The brake performance standard is found in 49 CFR §393.52. Brakes must meet minimum stopping distance requirements.',
            'The Commercial Vehicle Safety Alliance (CVSA) Out-of-Service Criteria specifies exact conditions that result in immediate OOS orders for brake defects — pushrod stroke limits, drum condition, lining thickness, etc.',
            'Carriers are responsible for ensuring vehicles are not dispatched with known or detectable brake defects — even if the defect developed after the last maintenance service.',
          ],
        },
        {
          id: 'why-it-matters',
          heading: 'Why this matters',
          icon: 'alert',
          content: [
            'Brake defects are the leading cause of vehicle OOS orders — a single inspection with multiple brake findings can significantly impact BASIC percentiles.',
            'Recurring brake violations signal a systemic preventive maintenance failure — not just a one-time miss.',
            'A brake failure in a crash scenario creates catastrophic liability exposure for the carrier. Brake condition is one of the first things plaintiff attorneys examine.',
            'Insurers view carriers with elevated brake-related OOS rates as high-risk — brake defects are a primary driver of vehicle OOS rate concerns.',
          ],
        },
        {
          id: 'root-cause',
          heading: 'Likely root cause',
          icon: 'search',
          content: [
            'Pre-trip inspection failure: the driver did not check brake adjustment during pre-trip, or performed a cursory check without properly evaluating pushrod stroke.',
            'PM interval too long: brake adjustment intervals are not set tightly enough for the operating environment and mileage.',
            'Automatic slack adjuster (ASA) failure: ASAs are supposed to maintain brake adjustment automatically — if they are defective or not maintained, manual adjustment intervals are needed.',
            'Shop defect closeout gap: brake issues reported on DVIRs were not fully corrected before the vehicle was dispatched.',
          ],
        },
        {
          id: 'prevent-step-1',
          heading: '1. Train drivers on brake inspection technique',
          icon: 'checklist',
          content: [
            'Drivers must perform a proper brake check during every pre-trip inspection.',
            'The standard brake check: with brakes released, measure pushrod stroke; apply full brake pressure and measure again. Difference must be within CVSA limits.',
            'Drivers should also check: brake lining condition (visible through spoke wheels), drum condition, hose routing, and slack adjuster function.',
          ],
          note: 'A 10-minute brake inspection before departure catches the same defects an inspector would find at roadside.',
        },
        {
          id: 'prevent-step-2',
          heading: '2. Set PM intervals based on actual brake wear',
          icon: 'checklist',
          content: [
            'Standard practice: brake adjustment included at every PM service and every tire rotation.',
            'High-duty cycles (local/regional, frequent stops): shorter PM intervals and more frequent brake-specific checks.',
            'Review brake adjustment history for each unit to determine whether the interval is appropriate.',
          ],
        },
        {
          id: 'prevent-step-3',
          heading: '3. Inspect and maintain automatic slack adjusters',
          icon: 'checklist',
          content: [
            'Automatic slack adjusters (ASAs) should maintain brake adjustment automatically — but they fail, wear, and require maintenance.',
            'Inspect ASA function at every PM: verify the adjuster is self-adjusting correctly.',
            'Replace ASAs that are failing to maintain adjustment — do not simply re-adjust and ignore the underlying problem.',
          ],
          note: 'An ASA that keeps going out of adjustment is telling you it needs to be replaced, not re-adjusted.',
        },
        {
          id: 'prevent-step-4',
          heading: '4. Implement a gate audit for brake condition',
          icon: 'checklist',
          content: [
            'Before vehicles depart, maintenance supervisor performs a visual gate audit.',
            'Brake check is a mandatory gate audit item — not optional.',
            'Any vehicle with a brake defect identified at the gate is held for repair before dispatch.',
          ],
          subChecklist: {
            title: 'Gate Audit Brake Checklist',
            items: [
              'Push rod stroke within CVSA limits (brakes applied)',
              'Brake lining thickness adequate (visible check or measurement)',
              'Drum condition — no cracks, heat checking, or excessive wear',
              'Brake hoses — no cracks, chafing, or improper routing',
              'Slack adjuster condition and function',
              'Air pressure build-up rate and governor cut-in/cut-out normal',
            ],
          },
        },
        {
          id: 'prevent-step-5',
          heading: '5. Use post-inspection reports to prioritize brake work',
          icon: 'checklist',
          content: [
            'After any roadside inspection, pull the report and review all brake-related findings.',
            'Use inspection data to identify whether specific units or axle positions are repeat problems.',
            'Build targeted corrective action: if steer axle brakes are a recurring finding, evaluate steer axle PM intervals specifically.',
          ],
        },
        {
          id: 'best-practice-rule',
          heading: 'The maintenance standard to hold',
          icon: 'shield',
          highlighted: true,
          highlightColor: 'emerald',
          content: [
            'No vehicle leaves the yard with a brake condition that would fail a CVSA inspection.',
            'Brake check is the first inspection item — not a formality.',
            'An ASA that requires re-adjustment at every PM is defective and should be replaced.',
            'If roadside finds a brake defect, find out why pre-trip missed it — and fix the process.',
          ],
        },
      ],
      complianceProgram: {
        title: 'Brake System Compliance Program',
        items: [
          'Driver brake inspection training (pre-trip technique)',
          'PM schedule with brake adjustment at every service',
          'Automatic slack adjuster inspection and replacement program',
          'Gate audit with mandatory brake check before dispatch',
          'Post-inspection data review for brake-specific pattern analysis',
          'Brake inspection tools at all terminals (pushrod gauges)',
        ],
      },
      immediateActions: [
        'Conduct a fleet-wide brake inspection on all active vehicles within 72 hours',
        'Place any vehicle with an out-of-adjustment brake on a no-dispatch hold until repaired',
        'Pull the last 12 months of inspection reports and count brake-related OOS events by unit',
        'Review PM schedule for brake adjustment frequency — compare to actual brake wear data',
        'Provide a driver brake inspection refresher covering pushrod stroke measurement technique',
      ],
      workflowSteps: [
        'Driver performs pre-trip brake inspection (pushrod stroke, lining, drum, hoses)',
        'Defect found → vehicle held, work order opened, dispatch notified',
        'No defect found → gate supervisor verifies brake check was performed',
        'Vehicle dispatched with clean DVIR',
        'PM service includes brake adjustment check and ASA inspection',
        'Post-inspection reports reviewed for brake findings monthly',
        'Recurring brake issues on specific units escalated for root cause review',
      ],
      workflowConclusion:
        'Consistent pre-trip inspection combined with PM-based brake maintenance makes brake OOS violations highly preventable.',
    },

    'why-oos': {
      promptKey: 'why-oos',
      promptLabel: 'Ask AI: Why is this OOS?',
      sections: [
        {
          id: 'oos-definition',
          heading: 'Why brake defects result in an immediate OOS order',
          icon: 'alert',
          content: [
            'Brake defects are classified as OOS conditions because they directly impair the vehicle\'s ability to stop safely.',
            'Under CVSA Out-of-Service Criteria, a brake that is out of adjustment, has defective linings, or has a cracked drum creates a condition where the vehicle\'s stopping distance may be substantially increased.',
            'A vehicle with defective brakes cannot be safely operated on public roads. The inspector is required to place it out of service immediately — the carrier cannot argue the defect is "minor."',
            'The OOS order means the vehicle must be towed or repaired at roadside before it can resume operation.',
          ],
        },
        {
          id: 'brake-oos-criteria',
          heading: 'Common brake OOS conditions',
          icon: 'regulation',
          content: [
            'Out of adjustment: pushrod stroke exceeds CVSA maximum allowable stroke for the brake chamber size.',
            'Defective lining or pad: worn below minimum thickness, cracked, saturated with oil, or loose.',
            'Cracked drum: heat-related cracks or structural cracks in brake drum.',
            'Defective or missing component: inoperative slack adjuster, broken spring, missing brake hardware.',
            'Air leak: audible air leak in the brake system affecting system pressure.',
          ],
          table: {
            headers: ['Condition', 'OOS Threshold', 'Most Common Cause'],
            rows: [
              ['Out of adjustment', 'Stroke exceeds chamber size limit', 'Failed ASA or missed PM'],
              ['Defective lining', 'Worn below 1/4" (drum), 1/8" (disc)', 'PM interval too long'],
              ['Cracked drum', 'Any structural crack', 'Heat cycling, overloading'],
              ['Air leak', 'Audible at 90 PSI', 'Worn fittings, damaged hose'],
            ],
          },
        },
        {
          id: 'oos-consequences',
          heading: 'Consequences of a brake OOS event',
          icon: 'info',
          content: [
            'Vehicle is placed out of service immediately — cannot move under its own power until repaired.',
            'Carrier must arrange roadside repair or tow to nearest repair facility.',
            'The violation is recorded in FMCSA SMS — contributes to Vehicle Maintenance BASIC.',
            'Multiple brake OOS events push the BASIC percentile toward intervention thresholds.',
            'Creates direct carrier liability: if the vehicle was previously inspected and the brake defect went undetected, the carrier may face negligence claims.',
          ],
        },
        {
          id: 'oos-resolution',
          heading: 'How to resolve at roadside',
          icon: 'workflow',
          content: [
            'Arrange a roadside repair with a qualified mobile mechanic if adjustment is the only issue.',
            'For more serious defects (cracked drum, defective lining), the vehicle must be towed to a repair facility.',
            'Inspector will re-inspect after repair before releasing the vehicle from OOS status.',
            'Document all repairs with work orders and retain for DQ file and potential DataQs challenge.',
          ],
        },
        {
          id: 'brake-oos-callout',
          heading: 'The pre-trip inspection failure',
          icon: 'alert',
          highlighted: true,
          highlightColor: 'red',
          content: [
            'If an inspector found a brake defect at roadside, a thorough pre-trip inspection should have found it first.',
            'Brake OOS findings at roadside are nearly always a sign that pre-trip inspection quality is inadequate.',
            'The vehicle was likely in the same condition when it left the yard. The pre-trip process failed to catch it.',
          ],
        },
      ],
      immediateActions: [
        'Arrange immediate roadside repair or tow for the vehicle',
        'Document the defect, repair, and inspector release',
        'Pull all recent DVIR records for this unit — was the defect previously noted?',
        'Inspect all other vehicles in the fleet for the same defect category',
        'Review pre-trip inspection training for all drivers',
      ],
    },

    'internal-control': {
      promptKey: 'internal-control',
      promptLabel: 'Ask AI: What internal control would catch this?',
      sections: [
        {
          id: 'control-overview',
          heading: 'The control that prevents brake OOS events',
          icon: 'shield',
          content:
            'A comprehensive pre-trip brake inspection by the driver, combined with PM-based brake adjustment and a gate audit, creates multiple opportunities to catch brake defects before an inspector does.',
        },
        {
          id: 'control-1',
          heading: 'Control 1: Driver pre-trip brake inspection',
          icon: 'checklist',
          content: [
            'Every driver performs a pushrod stroke check during pre-trip using a brake stroke indicator or ruler.',
            'Driver checks lining condition through spoke wheels where visible.',
            'Driver inspects brake hoses for chafing, cracks, or improper routing.',
            'Any finding is documented on DVIR and reported to maintenance before dispatch.',
          ],
          note: 'Drivers need proper training and tools to perform this check correctly. A ruler and basic brake training are all that is required.',
        },
        {
          id: 'control-2',
          heading: 'Control 2: PM-based brake maintenance',
          icon: 'checklist',
          content: [
            'Brake adjustment is performed at every scheduled PM service — not only when a defect is found.',
            'ASA function is verified at every PM — not just lubricated.',
            'Brake lining measurements are recorded at PM and tracked over time to predict replacement intervals.',
          ],
        },
        {
          id: 'control-3',
          heading: 'Control 3: Gate audit',
          icon: 'checklist',
          content: [
            'Before first dispatch of the day, maintenance supervisor performs a visual brake check on all outbound vehicles.',
            'Any vehicle with a brake finding is held — no exceptions.',
            'Gate audit log is maintained as documentation of the inspection.',
          ],
        },
        {
          id: 'control-4',
          heading: 'Control 4: Post-inspection data review',
          icon: 'checklist',
          content: [
            'After any roadside inspection, the inspection report is pulled and reviewed by the maintenance manager.',
            'Brake findings are tracked by vehicle unit number.',
            'Units with recurring brake findings trigger a root cause review — is the PM interval wrong? Is the ASA defective?',
          ],
        },
        {
          id: 'control-callout',
          heading: 'Why brake OOS events are preventable',
          icon: 'alert',
          highlighted: true,
          highlightColor: 'emerald',
          content: [
            'Brake out-of-adjustment conditions develop over time — they are detectable before they reach OOS threshold.',
            'A driver who knows how to check brake adjustment will find the same condition an inspector finds.',
            'The only difference between a pre-trip catch and a roadside OOS is whether the driver looked.',
          ],
        },
      ],
      complianceProgram: {
        title: 'Brake System Control Requirements',
        items: [
          'Driver brake inspection training with pushrod measurement technique',
          'Brake adjustment at every PM service (minimum)',
          'ASA inspection and replacement program',
          'Gate audit with mandatory brake check',
          'Post-inspection brake finding tracking by unit',
        ],
      },
      immediateActions: [
        'Train all drivers on proper brake pushrod stroke measurement',
        'Provide pushrod stroke gauges at all terminals and in truck cabs',
        'Implement a gate audit with mandatory brake check before dispatch',
        'Pull the last 12 months of brake-related OOS events and identify top units',
        'Verify PM intervals include brake adjustment as a mandatory item',
      ],
    },

    workflow: {
      promptKey: 'workflow',
      promptLabel: 'Ask AI: Show a compliance workflow',
      sections: [
        {
          id: 'workflow-overview',
          heading: 'Brake System Inspection & Maintenance Workflow',
          icon: 'workflow',
          content:
            'This workflow creates a layered inspection process so brake defects are caught before dispatch — not at roadside.',
        },
        {
          id: 'workflow-steps-detail',
          heading: 'Step-by-step process',
          icon: 'checklist',
          content: [
            'Step 1 — Pre-trip (daily): Driver performs brake inspection per FMCSA requirements — stroke, lining, drums, hoses.',
            'Step 2 — Defect found: Driver documents on DVIR and notifies maintenance. Vehicle held.',
            'Step 3 — No defect found: Driver completes DVIR and vehicle proceeds to gate audit.',
            'Step 4 — Gate audit: Maintenance supervisor verifies pre-trip was completed and performs visual brake check.',
            'Step 5 — Gate clear: Vehicle dispatched. DVIR retained.',
            'Step 6 — PM service: Brake adjustment performed, ASA inspected, lining measurements recorded.',
            'Step 7 — Post-inspection review: After any roadside inspection, brake findings reviewed and tracked by unit.',
            'Step 8 — Trend analysis: Units with recurring brake findings reviewed for root cause (PM interval, ASA failure, driver technique).',
          ],
        },
        {
          id: 'workflow-gates',
          heading: 'Decision gates',
          icon: 'shield',
          highlighted: true,
          highlightColor: 'emerald',
          content: [
            'Gate 1 (Pre-trip): No brake defect found → proceed to gate audit.',
            'Gate 1 (Pre-trip): Brake defect found → HOLD for repair, no dispatch.',
            'Gate 2 (Gate audit): Supervisor confirms pre-trip complete + brake visually clear → dispatch.',
            'Gate 2 (Gate audit): Any brake concern → HOLD for maintenance review.',
            'Gate 3 (PM): Brake adjustment within spec → clear. Out of spec → adjust and document.',
          ],
        },
      ],
      workflowSteps: [
        'Driver performs pre-trip brake inspection',
        'Defect? → HOLD for repair. No defect? → Gate audit',
        'Gate supervisor checks brake condition',
        'Vehicle dispatched with clean DVIR',
        'PM service includes brake adjustment and ASA check',
        'Post-inspection reports reviewed for brake findings',
        'Recurring brake issues on specific units escalated',
      ],
      workflowConclusion:
        'Layered inspection — driver pre-trip, gate audit, and PM-based maintenance — makes brake OOS events preventable.',
      immediateActions: [
        'Map this workflow against current pre-trip and PM processes',
        'Identify which gates are missing (gate audit, post-inspection review)',
        'Provide brake inspection training and tools for all drivers',
        'Implement the gate audit process starting with next dispatch cycle',
      ],
    },
  },
};

// ─── Export ───

export const VIOLATION_SCENARIOS: ViolationScenario[] = [
  medicalCertScenario,
  hosEldScenario,
  brakeDefectScenario,
];

export function getViolationScenario(id: string): ViolationScenario | undefined {
  return VIOLATION_SCENARIOS.find((s) => s.id === id);
}

export function getFeaturedScenario(): ViolationScenario {
  return medicalCertScenario;
}

export function getAllViolationScenarios(): ViolationScenario[] {
  return VIOLATION_SCENARIOS;
}

/**
 * Enriches existing ViolationScenario[] with occurrence data from inspection records.
 * Matches violations by code prefix (e.g. scenario code "396.3(a)(1)" matches
 * inspection violation code "396.3(a)(1)" or any code starting with that prefix).
 * Returns new scenario objects — does not mutate the originals.
 */
export function enrichScenariosWithOccurrences(
  scenarios: ViolationScenario[],
  inspections: import('./types').InspectionWithViolations[]
): ViolationScenario[] {
  type ViolOccurrence = import('./types').ViolationOccurrence;

  // Build a map of scenario code → occurrences from inspection data
  const codeOccurrences = new Map<string, ViolOccurrence[]>();

  for (const insp of inspections) {
    for (const v of insp.violations) {
      const occurrence: ViolOccurrence = {
        inspectionId: insp.inspectionId,
        reportNumber: insp.reportNumber,
        inspectionDate: insp.inspectionDate,
        state: insp.state,
        violation: v,
      };

      // Match against each scenario code
      for (const scenario of scenarios) {
        // Exact match or prefix match (e.g. "396.3(a)(1)" matches "396.3(a)(1)")
        if (v.code === scenario.code || v.code.startsWith(scenario.code)) {
          const existing = codeOccurrences.get(scenario.code) || [];
          existing.push(occurrence);
          codeOccurrences.set(scenario.code, existing);
        }
      }
    }
  }

  return scenarios.map((scenario): ViolationScenario => {
    const occurrences = codeOccurrences.get(scenario.code);
    if (!occurrences || occurrences.length === 0) {
      return scenario;
    }

    // Sort by date descending
    const sorted = [...occurrences].sort((a, b) => {
      const da = new Date(a.inspectionDate);
      const db = new Date(b.inspectionDate);
      return db.getTime() - da.getTime();
    });

    const mostRecentDate = sorted[0]?.inspectionDate;
    const mostRecentState = sorted[0]?.state;
    const oosCount = sorted.filter((o) => o.violation.oos).length;

    return {
      ...scenario,
      occurrenceCount: sorted.length,
      mostRecentDate,
      mostRecentState,
      occurrences: sorted,
      summary: `${scenario.summary} Found in ${sorted.length} inspection(s). ${oosCount > 0 ? `${oosCount} resulted in OOS. ` : ''}Most recent: ${mostRecentDate} in ${mostRecentState}.`,
    };
  });
}

/**
 * Generates ViolationScenario objects from real inspection data.
 * Preserves linkage back to individual inspection records via ViolationOccurrence.
 */
export function buildViolationScenariosFromInspections(
  inspections: import('./types').InspectionWithViolations[]
): ViolationScenario[] {
  type ViolOccurrence = import('./types').ViolationOccurrence;

  // Aggregate violations by code, preserving full occurrence data
  const violMap = new Map<string, {
    code: string;
    description: string;
    count: number;
    oosCount: number;
    occurrences: ViolOccurrence[];
  }>();

  for (const insp of inspections) {
    for (const v of insp.violations) {
      const occurrence: ViolOccurrence = {
        inspectionId: insp.inspectionId,
        reportNumber: insp.reportNumber,
        inspectionDate: insp.inspectionDate,
        state: insp.state,
        violation: v,
      };

      const existing = violMap.get(v.code);
      if (existing) {
        existing.count++;
        if (v.oos) existing.oosCount++;
        existing.occurrences.push(occurrence);
      } else {
        violMap.set(v.code, {
          code: v.code,
          description: v.description,
          count: 1,
          oosCount: v.oos ? 1 : 0,
          occurrences: [occurrence],
        });
      }
    }
  }

  // Sort by frequency, take top 5
  const topViolations = Array.from(violMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return topViolations.map((v): ViolationScenario => {
    const severity: 'OOS' | 'Non-OOS' = v.oosCount > 0 ? 'OOS' : 'Non-OOS';

    // Sort occurrences by date descending (most recent first)
    const sorted = [...v.occurrences].sort((a, b) => {
      const da = new Date(a.inspectionDate);
      const db = new Date(b.inspectionDate);
      return db.getTime() - da.getTime();
    });

    const mostRecentDate = sorted[0]?.inspectionDate || 'Unknown date';
    const mostRecentState = sorted[0]?.state || 'Unknown';
    const uniqueStates = Array.from(new Set(sorted.map((o) => o.state).filter(Boolean)));
    const stateList = uniqueStates.join(', ') || 'Unknown';

    // Build occurrence-aware summary referencing actual report numbers
    const reportRefs = sorted
      .slice(0, 3)
      .map((o) => `${o.reportNumber} (${o.state}, ${o.inspectionDate})`)
      .join('; ');
    const moreText = sorted.length > 3 ? ` and ${sorted.length - 3} more` : '';

    return {
      id: `live-${v.code.replace(/[^a-zA-Z0-9]/g, '-')}`,
      code: v.code,
      title: v.description,
      severity,
      category: 'Vehicle Maintenance',
      summary: `Found in ${v.count} inspection(s) over 24 months. ${v.oosCount > 0 ? `${v.oosCount} resulted in OOS. ` : ''}Most recent: ${mostRecentDate} in ${mostRecentState}.`,
      occurrenceCount: sorted.length,
      mostRecentDate,
      mostRecentState,
      occurrences: sorted,
      aiResponses: {
        prevent: {
          promptKey: 'prevent',
          promptLabel: 'Ask AI: How do I prevent this?',
          sections: [
            {
              id: 'what-it-means',
              heading: 'What this violation means',
              icon: 'info',
              content: `CFR ${v.code} — ${v.description}. This violation was cited ${v.count} time(s) across inspections in ${stateList}.`,
            },
            {
              id: 'frequency',
              heading: 'Occurrence pattern',
              icon: 'search',
              content: [
                `Found in ${v.count} inspection(s) over the 24-month SMS window.`,
                v.oosCount > 0
                  ? `${v.oosCount} of these resulted in out-of-service orders, meaning the vehicle was removed from service until the defect was corrected.`
                  : 'None of these occurrences resulted in out-of-service orders.',
                `Inspection reports: ${reportRefs}${moreText}.`,
                `Most recent occurrence: ${mostRecentDate} in ${mostRecentState}.`,
              ],
            },
            {
              id: 'prevention',
              heading: 'How to prevent this',
              icon: 'shield',
              content: [
                `Add CFR ${v.code} to your pre-trip inspection checklist as a specific check item.`,
                'Ensure drivers are trained to identify and document this type of defect before departure.',
                'Implement a defect closeout tracking system to verify repairs are completed.',
                v.oosCount > 0
                  ? 'Given OOS history, consider adding a gate-check verification before dispatch.'
                  : 'Continue monitoring for any increase in frequency.',
              ],
            },
          ],
          immediateActions: [
            `Review all current equipment for ${v.code} compliance`,
            'Brief drivers on this specific violation during next safety meeting',
            'Document corrective actions and track closure',
          ],
        },
        ...(v.oosCount > 0
          ? {
              'why-oos': {
                promptKey: 'why-oos',
                promptLabel: 'Ask AI: Why was this OOS?',
                sections: [
                  {
                    id: 'oos-explanation',
                    heading: 'Why this violation triggers Out-of-Service',
                    icon: 'alert',
                    content: `Violations under CFR ${v.code} can result in out-of-service orders when the defect is severe enough to present an imminent hazard. The vehicle must be repaired before it can return to service. This carrier had ${v.oosCount} OOS event(s) for this violation type.`,
                    highlighted: true,
                    highlightColor: 'red',
                  },
                  {
                    id: 'impact',
                    heading: 'Impact on carrier record',
                    icon: 'info',
                    content: [
                      'OOS violations receive a +2 severity weight bonus in BASIC calculations.',
                      'They contribute more heavily to the Vehicle Maintenance BASIC percentile.',
                      'Multiple OOS events can push a carrier above intervention thresholds.',
                    ],
                  },
                ],
              },
            }
          : {}),
      },
    };
  });
}

/**
 * Generates ViolationScenario objects from QC API aggregate data (OOS rates, BASIC scores,
 * inspection counts) when individual SMS inspection records are unavailable.
 *
 * Uses the carrier's aggregate safety profile to generate scenarios for the most likely
 * violation categories based on OOS rates and BASIC percentiles.
 */
export function buildViolationScenariosFromApiData(carrier: {
  vehicleOosRate?: number;
  vehicleOosRateNationalAverage?: string;
  vehicleInsp?: number;
  vehicleOosInsp?: number;
  driverOosRate?: number;
  driverOosRateNationalAverage?: string;
  driverInsp?: number;
  driverOosInsp?: number;
  hazmatOosRate?: number;
  hazmatOosRateNationalAverage?: string;
  hazmatInsp?: number;
  hazmatOosInsp?: number;
  crashTotal?: number;
  fatalCrash?: number;
  injCrash?: number;
  basicScores?: { basicName: string; percentile: number; threshold: number; exceedThreshold: boolean }[];
}): ViolationScenario[] {
  const scenarios: ViolationScenario[] = [];
  const vNatAvg = parseFloat(carrier.vehicleOosRateNationalAverage || '20.72');
  const dNatAvg = parseFloat(carrier.driverOosRateNationalAverage || '5.51');

  // Vehicle Maintenance violations (most common OOS category)
  if (carrier.vehicleInsp && carrier.vehicleInsp > 0) {
    const oosRate = carrier.vehicleOosRate || 0;
    const aboveAvg = oosRate > vNatAvg;
    const oosCount = carrier.vehicleOosInsp || 0;

    // Brake system defects — #1 most common vehicle OOS violation nationally
    scenarios.push({
      id: 'live-api-393-45',
      code: '393.45',
      title: 'Brake System — Inoperative / Defective Service Brakes',
      severity: oosCount > 0 ? 'OOS' : 'Non-OOS',
      category: 'Vehicle Maintenance',
      summary: `Based on ${carrier.vehicleInsp} vehicle inspections (${oosCount} OOS, ${oosRate.toFixed(1)}% OOS rate${aboveAvg ? ` — above ${vNatAvg}% national average` : ''}). Brake defects are the #1 vehicle OOS violation nationally, accounting for ~25% of all vehicle OOS orders.`,
      aiResponses: {
        prevent: {
          promptKey: 'prevent',
          promptLabel: 'Ask AI: How do I prevent this?',
          sections: [
            {
              id: 'what-it-means',
              heading: 'What this violation means',
              icon: 'info',
              content: `CFR 393.45 covers brake system pressure/vacuum loss, air leaks, pushrod travel, and overall brake effectiveness. With ${carrier.vehicleInsp} vehicle inspections and a ${oosRate.toFixed(1)}% OOS rate, brake defects are a significant risk factor.`,
            },
            {
              id: 'carrier-context',
              heading: 'Your carrier profile',
              icon: 'search',
              content: [
                `${carrier.vehicleInsp} vehicle inspections in the 24-month SMS window.`,
                `${oosCount} out-of-service events (${oosRate.toFixed(1)}% OOS rate).`,
                aboveAvg
                  ? `Your vehicle OOS rate exceeds the ${vNatAvg}% national average, indicating higher-than-typical maintenance deficiency risk.`
                  : `Your vehicle OOS rate is below the ${vNatAvg}% national average.`,
              ],
            },
            {
              id: 'prevention',
              heading: 'Prevention strategy',
              icon: 'shield',
              content: [
                'Implement daily brake stroke measurements during pre-trip inspections.',
                'Schedule quarterly brake system audits with certified technicians.',
                'Install automatic slack adjusters on all units and verify proper function.',
                'Track pushrod travel limits and replace components before failure threshold.',
                'Create a brake defect closeout log to ensure all reported issues are resolved within 24 hours.',
              ],
            },
          ],
          immediateActions: [
            'Audit all current equipment for brake system compliance',
            'Brief drivers on brake-specific pre-trip inspection procedures',
            'Review maintenance records for brake repair frequency and patterns',
          ],
        },
        ...(oosCount > 0 ? {
          'why-oos': {
            promptKey: 'why-oos',
            promptLabel: 'Ask AI: Why does this cause OOS?',
            sections: [
              {
                id: 'oos-explanation',
                heading: 'Why brake defects trigger Out-of-Service',
                icon: 'alert',
                content: `Brake system defects are the most common cause of vehicle out-of-service orders. Under CVSA criteria, a vehicle is placed OOS when 20% or more of its brake components are defective. This carrier had ${oosCount} vehicle OOS event(s) out of ${carrier.vehicleInsp} inspections.`,
                highlighted: true,
                highlightColor: 'red',
              },
              {
                id: 'impact',
                heading: 'Impact on safety record',
                icon: 'info',
                content: [
                  'Each OOS event adds severity weight to the Vehicle Maintenance BASIC calculation.',
                  'OOS violations receive a +2 severity weight bonus in BASIC percentile scoring.',
                  aboveAvg
                    ? `At ${oosRate.toFixed(1)}% OOS rate (above ${vNatAvg}% national average), this carrier faces elevated scrutiny.`
                    : `Current OOS rate of ${oosRate.toFixed(1)}% is below the national average but still requires monitoring.`,
                ],
              },
            ],
          },
        } : {}),
      },
    });

    // Lighting violations — #2 most common vehicle violation
    if (carrier.vehicleInsp >= 3) {
      scenarios.push({
        id: 'live-api-393-9',
        code: '393.9',
        title: 'Lamps / Lighting — Inoperable Required Lamps',
        severity: 'Non-OOS',
        category: 'Vehicle Maintenance',
        summary: `Lighting violations are the #2 most cited vehicle defect nationally. With ${carrier.vehicleInsp} vehicle inspections, this carrier should prioritize lighting system checks in pre-trip procedures.`,
        aiResponses: {
          prevent: {
            promptKey: 'prevent',
            promptLabel: 'Ask AI: How do I prevent this?',
            sections: [
              {
                id: 'what-it-means',
                heading: 'What this violation means',
                icon: 'info',
                content: 'CFR 393.9 requires all required lamps (headlamps, tail lamps, stop lamps, turn signals, clearance lamps) to be operational. Inoperable lamps are consistently one of the top vehicle violations found during roadside inspections.',
              },
              {
                id: 'prevention',
                heading: 'Prevention strategy',
                icon: 'shield',
                content: [
                  'Include specific lamp function checks in pre-trip inspection checklist.',
                  'Carry spare bulbs and fuses on all units.',
                  'Replace dim or intermittent bulbs proactively during scheduled maintenance.',
                  'Consider upgrading to LED lighting for longer service life.',
                  'Train drivers to perform walk-around light checks with a partner.',
                ],
              },
            ],
            immediateActions: [
              'Verify all required lamps on each unit during next pre-trip',
              'Stock spare bulbs and fuses in all tractors',
              'Add lighting check to driver pre-trip sign-off form',
            ],
          },
        },
      });
    }

    // Tire violations — #3 most common
    if (carrier.vehicleInsp >= 5) {
      scenarios.push({
        id: 'live-api-393-75',
        code: '393.75',
        title: 'Tires — Flat / Audible Air Leak / Tread Depth',
        severity: oosCount > 2 ? 'OOS' : 'Non-OOS',
        category: 'Vehicle Maintenance',
        summary: `Tire violations are among the top 3 vehicle defects nationally. Carriers with ${carrier.vehicleInsp}+ inspections should have robust tire maintenance programs.`,
        aiResponses: {
          prevent: {
            promptKey: 'prevent',
            promptLabel: 'Ask AI: How do I prevent this?',
            sections: [
              {
                id: 'what-it-means',
                heading: 'What this violation means',
                icon: 'info',
                content: 'CFR 393.75 covers tire inflation, tread depth (minimum 4/32" steer, 2/32" other), visible damage, and audible air leaks. Tire defects can result in OOS when multiple tires are affected or when steer tires fail minimum tread requirements.',
              },
              {
                id: 'prevention',
                heading: 'Prevention strategy',
                icon: 'shield',
                content: [
                  'Require tire pressure checks with a calibrated gauge during pre-trip inspections.',
                  'Implement a tire tread depth measurement program — replace at 5/32" steer, 3/32" drive/trailer.',
                  'Schedule quarterly professional tire inspections for all units.',
                  'Track tire age and replace tires over 7 years regardless of tread depth.',
                ],
              },
            ],
            immediateActions: [
              'Measure tread depth on all steer tires fleet-wide',
              'Check inflation pressure on all units',
              'Replace any tires approaching minimum legal tread depth',
            ],
          },
        },
      });
    }
  }

  // Driver-related violations
  if (carrier.driverInsp && carrier.driverInsp > 0) {
    const dOosRate = carrier.driverOosRate || 0;
    const dAboveAvg = dOosRate > dNatAvg;
    const dOosCount = carrier.driverOosInsp || 0;

    // HOS violations — most common driver OOS
    scenarios.push({
      id: 'live-api-395-8',
      code: '395.8',
      title: 'Hours of Service — Log / ELD Violation',
      severity: dOosCount > 0 ? 'OOS' : 'Non-OOS',
      category: 'Driver Fitness / HOS',
      summary: `Based on ${carrier.driverInsp} driver inspections (${dOosCount} OOS, ${dOosRate.toFixed(1)}% OOS rate${dAboveAvg ? ` — above ${dNatAvg}% national average` : ''}). HOS/ELD violations are the leading driver OOS cause nationally.`,
      aiResponses: {
        prevent: {
          promptKey: 'prevent',
          promptLabel: 'Ask AI: How do I prevent this?',
          sections: [
            {
              id: 'what-it-means',
              heading: 'What this violation means',
              icon: 'info',
              content: `CFR 395.8 requires drivers to maintain accurate records of duty status. Violations include failure to maintain logs, falsified records, and ELD malfunctions. With ${carrier.driverInsp} driver inspections and ${dOosCount} OOS events, HOS compliance is a key focus area.`,
            },
            {
              id: 'carrier-context',
              heading: 'Your carrier profile',
              icon: 'search',
              content: [
                `${carrier.driverInsp} driver inspections in the 24-month SMS window.`,
                `${dOosCount} driver out-of-service events (${dOosRate.toFixed(1)}% OOS rate).`,
                dAboveAvg
                  ? `Driver OOS rate exceeds the ${dNatAvg}% national average.`
                  : `Driver OOS rate is at or below the ${dNatAvg}% national average.`,
              ],
            },
            {
              id: 'prevention',
              heading: 'Prevention strategy',
              icon: 'shield',
              content: [
                'Verify ELD functionality and compliance daily before dispatch.',
                'Train all drivers on proper ELD operation and RODS requirements.',
                'Implement real-time HOS monitoring to prevent violations before they occur.',
                'Conduct monthly audits of driver logs for accuracy and completeness.',
                'Establish a corrective action process for drivers with repeated HOS violations.',
              ],
            },
          ],
          immediateActions: [
            'Audit all current driver ELD records for compliance',
            'Verify ELD devices are registered and functioning on all units',
            'Review dispatch practices to ensure adequate drive time margins',
          ],
        },
      },
    });
  }

  return scenarios;
}
