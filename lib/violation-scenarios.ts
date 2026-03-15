export interface ViolationScenario {
  id: string;
  code: string;
  title: string;
  severity: 'OOS' | 'Non-OOS' | 'Warning';
  category: string;
  summary: string;
  aiResponses: Record<string, ViolationAiResponse>;
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

export const VIOLATION_SCENARIOS: ViolationScenario[] = [medicalCertScenario];

export function getViolationScenario(id: string): ViolationScenario | undefined {
  return VIOLATION_SCENARIOS.find((s) => s.id === id);
}

export function getFeaturedScenario(): ViolationScenario {
  return medicalCertScenario;
}
