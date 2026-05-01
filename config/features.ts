/**
 * Feature flags — all default false.
 * Flip a flag to true only when the corresponding feature is fully wired.
 *
 * How to enable: set the value to `true` here.
 * Each P1/P2 task that lands should flip exactly one flag.
 */
export const FEATURES = {
  /** P1.9 — CSV export of filtered inspection rows */
  featureExport: false,

  /** P1.8 — Assign Task action in inspection detail (needs /tasks surface P3.22) */
  featureAssignTask: false,

  /** P1.8 — Mark as Reviewed action in inspection detail */
  featureMarkReviewed: false,

  /** P1.8 — Add Note action in inspection detail */
  featureAddNote: false,

  /** P1.7 — BASIC card drill-down panel */
  featureBasicDrilldown: false,

  /** P1.9 — Generate Safety Report quick-suggestion in AI Assistant */
  featureGenerateReport: false,

  /** P3.21 — Compare with Peer Group quick-suggestion in AI Assistant */
  featurePeerCompare: false,

  /** P1.9 — Export to PDF quick-suggestion in AI Assistant */
  featureExportPdf: false,

  /** P1.10 — Settings nav item and /settings route */
  featureSettings: false,

  /** P2.12 — Alerts bell-icon popover (replaces sidebar Alerts block) */
  featureAlertsPopover: false,

  /** P1.10 — Persona switch pill (Safety Manager / Compliance Officer / Ops Manager) */
  featurePersonaSwitch: false,
} as const;

export type FeatureFlags = typeof FEATURES;
