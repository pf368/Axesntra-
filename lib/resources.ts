export interface Article {
  slug: string;
  title: string;
  headline: string;
  category: string;
  phase: 1 | 2 | 3;
  tags: string[];
  seo_description: string;
  cta_primary: string;
  featured: boolean;
  body: string;
}

export const CATEGORY_FILTERS = [
  'All',
  'Violation Guides',
  'CSA BASICs',
  'Audit Readiness',
  'Corrective Actions',
  'Templates',
  'AI Safety Advisor',
] as const;

export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export const CATEGORY_BADGE: Record<string, { bg: string; text: string; border: string }> = {
  'Violation Guide': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  'CSA BASICs':      { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
  'Audit Readiness': { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  'Templates':       { bg: '#ede9fe', text: '#5b21b6', border: '#ddd6fe' },
  'AI Safety Advisor': { bg: '#fce7f3', text: '#9d174d', border: '#fbcfe8' },
};

export function getPhase1Articles(): Article[] {
  return ARTICLES.filter(a => a.phase === 1);
}

export function filterByChip(articles: Article[], chip: string): Article[] {
  if (chip === 'All') return articles;
  if (chip === 'Violation Guides') return articles.filter(a => a.category === 'Violation Guide');
  if (chip === 'CSA BASICs') return articles.filter(a => a.category === 'CSA BASICs');
  if (chip === 'Audit Readiness') return articles.filter(a => a.category === 'Audit Readiness');
  if (chip === 'Templates') return articles.filter(a => a.category === 'Templates');
  if (chip === 'Corrective Actions') return articles.filter(a => a.tags.includes('Corrective Action') || a.tags.includes('CAP'));
  if (chip === 'AI Safety Advisor') return articles.filter(a => a.category === 'AI Safety Advisor');
  return articles;
}

export function searchArticles(articles: Article[], query: string): Article[] {
  const q = query.toLowerCase().trim();
  if (!q) return articles;
  return articles.filter(
    a =>
      a.headline.toLowerCase().includes(q) ||
      a.seo_description.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q),
  );
}

export function getRelatedArticles(current: Article, all: Article[], count = 3): Article[] {
  return all
    .filter(a => a.slug !== current.slug && a.category === current.category && a.phase === 1)
    .slice(0, count);
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLES
// ─────────────────────────────────────────────────────────────────────────────

export const ARTICLES: Article[] = [

  // ── PHASE 1 ──────────────────────────────────────────────────────────────

  {
    slug: '393-75-tire-violations',
    title: 'What Does 393.75(a)(3) Mean? DOT Tire Violation Explained',
    headline: 'What Does 393.75(a)(3) Mean?',
    category: 'Violation Guide',
    phase: 1,
    tags: ['Vehicle Maintenance', 'OOS', 'CSA', 'Tires'],
    seo_description: 'Learn what DOT violation 393.75(a)(3) means, why it triggers an out-of-service order, how it affects your CSA score, and what corrective action to take.',
    cta_primary: 'Get a Free Violation Review',
    featured: true,
    body: `## Direct Answer

49 CFR 393.75(a)(3) is a federal tire regulation requiring that no tire on a motor vehicle be operated when its tread depth is less than 2/32 of an inch on any major tread groove on a steering axle. A violation of this standard is an Out-of-Service (OOS) condition — the vehicle cannot move until the tire is replaced.

---

## What This Means

When a DOT roadside inspector finds a tire on your steering axle with a tread depth below 2/32 of an inch, they cite the driver under 393.75(a)(3). This is not a warning — it is an immediate Out-of-Service order. The vehicle stays parked until the defective tire is replaced and the driver is cleared to continue.

For non-steering axles (drive and trailer axles), the threshold is 1/32 inch under 393.75(b). Violations there are also cited but are not automatically OOS conditions — though inspectors may still place the vehicle OOS if multiple tires are near the threshold.

---

## Regulation Context

- **CFR Reference:** 49 CFR 393.75(a)(3)
- **Full Rule Name:** Part 393 — Parts and Accessories Necessary for Safe Operation, Subpart H — Tires
- **Enforced by:** FMCSA, in conjunction with state patrol officers during Level I, II, and III roadside inspections

The regulation covers all commercial motor vehicles (CMVs) operating in interstate commerce. It applies to every tire on the vehicle — including steer, drive, and trailer tires — with different thresholds depending on axle position.

---

## Severity & OOS Impact

| Axle Position | Minimum Tread Depth | OOS Condition? |
|---|---|---|
| Steering axle | 2/32 inch | Yes — immediate OOS |
| All other axles | 1/32 inch | Conditional (inspector discretion) |
| Any tire (flat/audible leak) | N/A | Yes — immediate OOS |
| Any tire (visible ply/cord showing) | N/A | Yes — immediate OOS |

An OOS violation is the most severe outcome of a roadside inspection. It stops your truck, costs hours or days of delay, and triggers mandatory review in the FMCSA's SMS (Safety Measurement System).

---

## CSA / BASIC Impact

393.75(a)(3) violations count against the **Vehicle Maintenance BASIC** in the FMCSA's CSA (Compliance, Safety, Accountability) program.

- **BASIC affected:** Vehicle Maintenance
- **Severity weight:** OOS tire violations carry a severity weight of **10** (highest tier on a 1–10 scale)
- **Time on record:** Violations stay on your BASIC score for **24 months** from the inspection date
- **Threshold:** FMCSA places carriers above 80% in Vehicle Maintenance under intervention consideration

Multiple tire violations across inspections will rapidly push your Vehicle Maintenance BASIC percentile into alert territory. A single OOS tire violation on a small fleet with few total inspections can cause a significant percentile jump.

---

## Corrective Action Steps

1. **Remove the vehicle from service immediately.** Do not allow the driver to continue operating with the cited tire.
2. **Replace the defective tire** with one meeting 49 CFR 393.75 standards before the vehicle moves.
3. **Complete a post-inspection repair order** documenting the tire replaced: size, brand, tread depth at time of replacement, technician name, and date/time.
4. **Conduct a fleet-wide tire audit** within 48 hours. Pull tread depth readings for all steering axles across your active vehicles.
5. **Document findings.** Record readings for every tire inspected. This creates audit-ready evidence even for tires that passed.
6. **Update your pre-trip inspection checklist** to require drivers to record tread depth readings, not just mark "OK."
7. **Create a tire replacement threshold.** Most fleets replace steering tires at 4/32 inch to stay well above the legal floor.
8. **Brief your drivers.** Ensure every driver understands that a tire violation at or below 2/32 on steer axles means OOS.

---

## Evidence Checklist

- [ ] Copy of the original inspection report (DataQ or paper form)
- [ ] Repair order showing the specific tire replaced (axle position, size, brand)
- [ ] Tread depth measurement at time of replacement
- [ ] Technician name, certification, and date of repair
- [ ] Post-repair vehicle inspection sign-off
- [ ] Fleet-wide tire audit results (all vehicles, all axles)
- [ ] Updated pre-trip inspection form showing tread depth field
- [ ] Driver training acknowledgment (if retraining was conducted)
- [ ] Any photos taken at time of inspection or replacement

---

## Prevention Tips

**Implement a tread depth program.** Set internal replacement thresholds at 4/32 inch for steer tires — 2/32 above the legal minimum. This creates a buffer and removes judgment calls from drivers on the road.

**Use calibrated tread depth gauges.** Issue one to every driver and require its use during pre-trip and post-trip inspections. Record readings in your inspection log.

**Schedule regular tire rotations and inspections.** High-mileage routes wear steer tires unevenly. Build tire inspection into your PM (preventive maintenance) schedule every 15,000–20,000 miles.

**Train drivers on what to look for.** Beyond tread depth, drivers should flag exposed cords, sidewall bulges, and audible air leaks immediately — all are OOS conditions under 393.75.

**Track violations by driver and vehicle.** If the same truck keeps generating tire violations, it may indicate a maintenance workflow problem, not just bad luck.

---

## Frequently Asked Questions

**Q: Does 393.75(a)(3) apply to trailer tires?**
Yes, the regulation applies to all tires on a commercial motor vehicle, including trailers. The threshold for non-steer trailer tires is 1/32 inch under 393.75(b), not 2/32.

**Q: Can the driver continue after a 393.75(a)(3) violation if the tread depth is close to 2/32?**
No. A tire at or below 2/32 inch on a steer axle is an automatic Out-of-Service condition. The vehicle cannot move until the tire is replaced and the driver is cleared by the inspector.

**Q: How much does this violation affect our CSA score?**
Tire violations carry a severity weight of 10 — the highest in the Vehicle Maintenance BASIC. A single OOS tire violation will have a meaningful impact on your percentile, especially for smaller fleets with fewer total inspections.

**Q: How long does a 393.75 violation stay on record?**
24 months from the date of inspection. After that it drops out of the 24-month SMS calculation, though it remains in the FMCSA inspection history.

**Q: What if we think the violation was issued in error?**
You can contest the violation through the FMCSA DataQs system at dataqs.fmcsa.dot.gov. Submit evidence including photos, inspection records, and repair documentation. Successful DataQs challenges remove the violation from your SMS record.`,
  },

  {
    slug: 'what-happens-after-oos-violation',
    title: 'What Happens After an Out-of-Service Violation? Fleet Safety Guide',
    headline: 'What Happens After an Out-of-Service (OOS) Violation?',
    category: 'Violation Guide',
    phase: 1,
    tags: ['OOS', 'CSA', 'Corrective Action', 'Inspection'],
    seo_description: 'What to do after your driver or vehicle receives an out-of-service order. Step-by-step response guide for fleet safety managers covering corrective action, CSA impact, and documentation.',
    cta_primary: 'Get a Free Violation Review',
    featured: true,
    body: `## Direct Answer

After an out-of-service (OOS) violation, the vehicle or driver cannot operate until the condition is corrected and cleared by an inspector. For your fleet, this triggers a mandatory corrective action response: document the violation, fix the underlying issue, retain evidence, brief the driver, and update your inspection and maintenance protocols to prevent recurrence.

---

## What This Means

An Out-of-Service order is the most severe outcome of a DOT roadside inspection. It means an inspector found a condition so unsafe — a defective brake, a tire below legal tread depth, a driver in violation of Hours of Service — that continuing to operate poses an immediate danger to public safety.

OOS orders are issued under the North American Standard Out-of-Service Criteria (NASOC), published by the Commercial Vehicle Safety Alliance (CVSA). There are two types:

- **Vehicle OOS:** The truck, trailer, or specific component is defective. The vehicle stays parked until repaired and re-inspected.
- **Driver OOS:** The driver is disqualified — typically for HOS violations, a positive drug/alcohol test, or a medical certificate issue. A different qualified driver can move the vehicle; the cited driver cannot operate until compliant.

---

## Regulation Context

- **Authority:** 49 CFR Part 390–399 (Federal Motor Carrier Safety Regulations)
- **OOS Criteria:** CVSA North American Standard Out-of-Service Criteria (updated annually)
- **Reporting:** All inspections, including OOS events, are reported to FMCSA and visible in SMS within 24–72 hours

Every OOS event is permanently recorded in your carrier's FMCSA inspection history and counts against your CSA BASIC scores for 24 months.

---

## Severity & OOS Impact

| OOS Type | Who Is Affected | Immediate Consequence |
|---|---|---|
| Vehicle OOS | The specific vehicle | Parked until repaired and cleared |
| Driver OOS (HOS) | The specific driver | Off-duty until compliant with rest requirements |
| Driver OOS (Medical) | The specific driver | Cannot operate until medical issue resolved |
| Driver OOS (Alcohol/Drugs) | The specific driver | Cannot operate; SAP process required |

An OOS event has the highest possible severity weight in the CSA SMS system. For fleets at or near FMCSA intervention thresholds, a single OOS event can trigger a warning letter or investigation.

---

## CSA / BASIC Impact

Which BASIC is affected depends on the type of violation that triggered the OOS:

| OOS Cause | BASIC Affected | Severity Weight |
|---|---|---|
| Brake defect | Vehicle Maintenance | 10 |
| Tire defect | Vehicle Maintenance | 10 |
| Lighting | Vehicle Maintenance | 5–8 |
| Hours of Service | Hours of Service Compliance | 10 |
| Medical certificate | Driver Fitness | 10 |
| Drug/alcohol | Controlled Substances/Alcohol | 10 |

OOS violations stay on your BASIC record for **24 months**. If the inspection resulted in a combination of OOS and non-OOS violations, each violation scores separately.

---

## Corrective Action Steps

1. **Confirm the vehicle or driver is secured.** Do not allow continued operation under any circumstances.
2. **Get a copy of the inspection report.** Your driver should receive a copy on-site. Request one from the inspection station if needed.
3. **Fix the defect immediately.** For vehicle OOS, repair and re-inspect before the vehicle moves. For driver OOS, follow the specific reinstatement process for the type of violation.
4. **Document every step.** Repair orders, technician sign-offs, photos, and timestamps.
5. **Notify your safety manager within 24 hours.** All OOS events should be reported up the chain, not just filed.
6. **Review the driver's pre-trip inspection log.** Did the driver miss the defect? Was it a pre-existing condition?
7. **Conduct a root cause analysis.** Was this a maintenance failure, driver failure, or inspection program failure?
8. **Update your PM schedule.** If a maintenance item failed between scheduled service intervals, tighten the interval.
9. **Brief your entire fleet.** Use OOS events as a learning moment — share what happened and what changed.
10. **Log everything in your corrective action file.** This is your audit-ready documentation.

---

## Evidence Checklist

- [ ] Original inspection report (paper copy and/or DataQ download)
- [ ] Vehicle repair order with specific defect, repair made, parts used
- [ ] Technician name and sign-off
- [ ] Pre-trip inspection log from the day of the violation
- [ ] Driver statement or incident report
- [ ] Root cause analysis document
- [ ] Fleet-wide inspection sweep results (especially for same defect type)
- [ ] Updated pre-trip checklist or PM schedule
- [ ] Driver training/retraining acknowledgment
- [ ] Corrective action plan document with follow-up assignments

---

## Prevention Tips

**Pre-trip inspection is your first line of defense.** An OOS condition that is found by your driver costs you nothing. The same condition found by a DOT inspector costs you a violation, a BASIC score hit, and potential downtime.

**Set internal standards above legal minimums.** Build in a safety buffer — replace brakes at 40% lining rather than waiting for 20%. Replace steer tires at 4/32 rather than 2/32.

**Track OOS rates by driver and vehicle.** Patterns reveal training gaps or chronic maintenance problems before they become repeat violations.

**Use a structured pre-trip inspection form.** A generic "all OK" checkbox provides no protection. Item-by-item inspection logs that require specific readings create accountability and documentation.

---

## Frequently Asked Questions

**Q: Can a driver keep driving after an OOS order if the condition is minor?**
No. An OOS order is absolute. The vehicle or driver cannot operate until the condition is corrected and cleared.

**Q: Who pays for the repair and downtime caused by an OOS violation?**
That depends on your carrier's policies and the cause of the violation. If the defect was present on departure, the carrier typically bears the cost.

**Q: Does an OOS violation go on the driver's record?**
OOS violations are recorded on the carrier's FMCSA record. Driver-specific violations (HOS, medical, drug/alcohol) also appear in driver inspection history and may affect their CDL standing.

**Q: Can we challenge an OOS violation we think was incorrect?**
Yes. Use the FMCSA DataQs system to request a review. Submit repair documentation, photos, and any evidence that disputes the inspector's finding.

**Q: How quickly does an OOS violation show up in our CSA score?**
Inspection data typically appears in the FMCSA SMS within 24–72 hours of the inspection date. BASIC scores update monthly.`,
  },

  {
    slug: 'driver-fitness-basic-violation-response',
    title: 'How to Respond to a Driver Fitness BASIC Violation',
    headline: 'How to Respond to a Driver Fitness BASIC Violation',
    category: 'Violation Guide',
    phase: 1,
    tags: ['Driver Fitness', 'CSA', 'BASIC', 'Corrective Action'],
    seo_description: 'Step-by-step guide for fleet safety managers on how to respond to a Driver Fitness BASIC violation — including corrective action, documentation, and FMCSA compliance steps.',
    cta_primary: 'Get a Free Violation Review',
    featured: false,
    body: `## Direct Answer

A Driver Fitness BASIC violation means a driver operated a CMV without the proper qualifications — typically an expired, invalid, or missing medical certificate, CDL, or required endorsement. Respond by immediately removing the driver from service, resolving the qualification deficiency, documenting corrective action, and auditing your full driver qualification file (DQ file) for every driver in your fleet.

---

## What This Means

The Driver Fitness BASIC measures whether carriers ensure their drivers are properly qualified to operate commercial motor vehicles. A violation occurs when a driver is found operating a CMV without meeting one or more of the following requirements:

- A valid Commercial Driver's License (CDL) with the correct class and endorsements for the vehicle
- A current FMCSA medical examiner's certificate (DOT physical) from a listed medical examiner
- A valid medical waiver, exemption, or Skill Performance Evaluation (SPE) certificate where applicable
- Completion of required entry-level driver training (ELDT) for new CDL holders

These are not technical or mechanical issues — they are administrative failures that indicate a breakdown in your driver qualification management process.

---

## Regulation Context

- **Primary CFR:** 49 CFR Part 391 — Qualifications of Drivers
- **Medical certification:** 49 CFR 391.41–391.49
- **CDL requirements:** 49 CFR 383
- **Driver qualification files:** 49 CFR 391.51

Every carrier is required to maintain a complete and current Driver Qualification (DQ) file for each driver. The DQ file must include a copy of the driver's CDL, medical certificate, employment application, road test results, and other documentation depending on the driver's history.

---

## Severity & OOS Impact

| Violation Type | Typical Severity Weight | OOS Condition? |
|---|---|---|
| No/expired medical certificate | 10 | Yes |
| Expired CDL | 10 | Yes |
| Missing required endorsement | 8–10 | Yes |
| Medical certificate about to expire | 5 | No (advisory) |
| Incomplete DQ file | 3–5 | No |

Expired medical certificates and CDLs are automatic OOS conditions. The driver cannot operate until the issue is resolved.

---

## CSA / BASIC Impact

- **BASIC affected:** Driver Fitness
- **BASIC measures:** Whether drivers are qualified and fit to operate CMVs
- **Severity weights:** 1–10 depending on specific violation; medical and CDL violations are the highest
- **Time on record:** 24 months
- **Intervention threshold:** Carriers above the Driver Fitness BASIC alert threshold face elevated FMCSA scrutiny

Driver Fitness violations point directly at your administrative and HR processes. FMCSA investigators treat a Driver Fitness BASIC alert as evidence of systemic carrier oversight failure, not just a single incident.

---

## Corrective Action Steps

1. **Remove the driver from service immediately** if the violation was an OOS condition (expired certificate or CDL).
2. **Identify the specific deficiency** — expired medical certificate, wrong CDL class, missing endorsement, or incomplete DQ file.
3. **Resolve the deficiency before the driver returns to duty:**
   - Expired medical certificate: Schedule immediate DOT physical with an FMCSA-listed medical examiner.
   - Expired/invalid CDL: Coordinate with the driver and state licensing authority.
   - Missing endorsement: Driver must obtain the endorsement before operating that vehicle type again.
4. **Pull every driver's DQ file** and audit for currency. Do not wait for another inspection.
5. **Update your DQ file tracking system.** Every driver's medical certificate and CDL expiration date should be in a calendar or fleet management system with advance alerts.
6. **Set 60-day and 30-day expiration alerts.** Medical certificates typically run 1–2 years. CDLs run 4–8 years by state.
7. **Document the corrective action** in writing with dates, driver name, deficiency corrected, and sign-offs.
8. **Brief your drivers.** Make clear that driving with an expired medical certificate is a federal violation — not a technicality.

---

## Evidence Checklist

- [ ] Copy of the inspection report citing the specific violation
- [ ] Updated, current medical examiner's certificate (if medical issue)
- [ ] Updated CDL copy showing correct class and endorsements (if CDL issue)
- [ ] Completed DQ file audit results for all drivers
- [ ] Screenshot or export of your expiration tracking system showing all active drivers
- [ ] Corrective action plan with signed acknowledgment
- [ ] Driver acknowledgment of retraining or briefing (if conducted)
- [ ] Documentation showing the deficiency was resolved before driver returned to service

---

## Prevention Tips

**Treat driver qualification files as live documents, not onboarding paperwork.** A DQ file that was complete at hire can become non-compliant the moment a medical certificate expires.

**Use calendar-based expiration tracking.** Load every driver's medical certificate and CDL expiration into a shared calendar or fleet management system. Set alerts at 90 days, 60 days, and 30 days before expiration.

**Assign a specific person to own DQ file compliance.** When it is everyone's responsibility, it is no one's responsibility.

**Audit DQ files quarterly.** A quarterly audit catches issues between inspections.

**Pre-screen drivers before dispatch.** Before assigning a driver to a vehicle type or route, confirm their CDL endorsements match the assignment.

---

## Frequently Asked Questions

**Q: Can a driver with an expired medical certificate drive at all?**
No. An expired DOT medical certificate is an OOS condition. The driver cannot operate a CMV until a new physical is completed and a current certificate is on file.

**Q: How long is a DOT medical certificate valid?**
Medical examiner's certificates are typically valid for up to 24 months. However, drivers with certain conditions may receive certificates for shorter periods.

**Q: Does the carrier get penalized if the driver didn't tell them about a medical issue?**
Yes. The carrier has a legal obligation to maintain current DQ files and verify driver qualification. Ignorance of the driver's status is not a defense.

**Q: What happens to the driver's CDL if they are caught driving OOS?**
Driver OOS violations can result in CDL suspension or disqualification depending on severity and state law.

**Q: How many Driver Fitness violations trigger an FMCSA investigation?**
There is no fixed number. FMCSA uses percentile rankings across all carriers. Carriers with high Driver Fitness BASIC percentiles are prioritized for intervention, especially if other BASICs are also elevated.`,
  },

  {
    slug: 'common-vehicle-maintenance-basic-violations',
    title: 'Common Vehicle Maintenance BASIC Violations: What They Mean and How to Fix Them',
    headline: 'Common Vehicle Maintenance BASIC Violations',
    category: 'Violation Guide',
    phase: 1,
    tags: ['Vehicle Maintenance', 'CSA', 'BASIC', 'Brakes', 'Lights', 'Tires'],
    seo_description: 'The most common Vehicle Maintenance BASIC violations found in DOT roadside inspections — what each means, severity, CSA impact, and corrective action steps for fleet safety managers.',
    cta_primary: 'Get a Free Violation Review',
    featured: false,
    body: `## Direct Answer

The most common Vehicle Maintenance BASIC violations are brake defects, lighting failures, and tire issues — all of which can trigger Out-of-Service orders. Each one counts against your Vehicle Maintenance BASIC score in the FMCSA's CSA system and stays on your record for 24 months.

---

## What This Means

The Vehicle Maintenance BASIC is the most-cited category in FMCSA roadside inspections. It covers the mechanical and physical condition of commercial motor vehicles — brakes, tires, lights, steering, suspension, coupling devices, frames, and more.

Violations range from a burned-out marker light (low severity, no OOS) to brake failure on a loaded axle (high severity, immediate OOS). Understanding which violations are most common — and which are most dangerous to your CSA score — lets you focus your preventive maintenance exactly where it counts.

---

## Regulation Context

- **Primary CFR:** 49 CFR Part 393 — Parts and Accessories Necessary for Safe Operation
- **Brakes:** 393.45–393.52
- **Tires:** 393.75
- **Lighting:** 393.9–393.33
- **Steering:** 393.209
- **Coupling devices:** 393.70–393.71

---

## Top 10 Vehicle Maintenance Violations by Inspection Frequency

| Rank | Violation | CFR Reference | OOS? | CSA Severity Weight |
|---|---|---|---|---|
| 1 | Inoperative/defective brakes | 393.45 | Often | 10 |
| 2 | Brake adjustment out of limits | 393.47 | Yes (if multiple axles) | 8–10 |
| 3 | Tires — tread depth below minimum | 393.75(a)(3) | Yes (steer axle) | 8–10 |
| 4 | Inoperative turn signal | 393.19 | No | 3 |
| 5 | Inoperative brake/tail light | 393.9 | No | 5 |
| 6 | Inoperative headlight | 393.9 | Conditional | 5–8 |
| 7 | Cracked/broken windshield (vision obstructed) | 393.60 | Conditional | 5–8 |
| 8 | Air brake system leakage | 393.45 | Yes | 10 |
| 9 | Failing coupling device / fifth wheel | 393.70 | Yes | 10 |
| 10 | Inoperative/defective wipers | 393.78 | No | 3 |

---

## Severity & OOS Impact

**Brake violations are the highest-risk category.** Brake defects account for the majority of OOS vehicle orders at roadside inspections. FMCSA uses the CVSA brake adjustment limits as the OOS threshold.

**Tire violations on the steer axle are automatic OOS.** Tread depth below 2/32 inch on a steering axle means the vehicle does not move.

**Lighting violations rarely trigger OOS but quickly accumulate severity.** Multiple lighting violations across inspections add up in your Vehicle Maintenance BASIC percentile and are often viewed as evidence of poor maintenance culture.

---

## CSA / BASIC Impact

- **BASIC affected:** Vehicle Maintenance
- **Severity range:** 1–10 (OOS violations always score 8–10)
- **Time on record:** 24 months
- **Alert threshold:** Carriers above 80th percentile are at risk for FMCSA intervention

Brake and tire OOS violations are the fastest way to push a carrier's Vehicle Maintenance BASIC into alert territory. Lighting violations, while lower severity individually, frequently appear in clusters.

---

## Corrective Action Steps

**For every Vehicle Maintenance violation:**

1. Fix the defect before the vehicle returns to service.
2. Document the repair with a work order: date, defect, parts replaced, technician.
3. Conduct a fleet-wide sweep for the same defect type within 48 hours.
4. Update your preventive maintenance schedule if the defect indicates a maintenance interval problem.
5. Review the driver's pre-trip inspection log for the day of the violation.
6. Brief the driver on what was found and why it matters.

**Specific steps by defect type:**

- **Brakes:** Perform full brake adjustment and lining inspection on all axles. Record readings. Set a recurring brake inspection interval.
- **Tires:** Full fleet tire audit with tread depth readings for every axle position recorded.
- **Lights:** Inspect all lights on all vehicles. Replace all burned-out bulbs. Check wiring and connectors on older vehicles.

---

## Evidence Checklist

- [ ] Original inspection report
- [ ] Repair work orders for each defect cited
- [ ] Fleet-wide sweep results for the same defect category
- [ ] Updated PM schedule showing revised inspection intervals
- [ ] Driver pre-trip inspection log from day of violation
- [ ] Technician certifications if brake repairs were performed

---

## Prevention Tips

**Brake inspections should be a standalone PM item, not just a checkbox.** Measure slack adjuster travel, record it, and compare to previous readings.

**Build a lighting inspection into every pre-trip.** Give drivers a specific checklist: headlights, taillights, brake lights, turn signals, marker lights, reflectors — each light, individually.

**Track violations by vehicle.** A truck that generates repeated violations is telling you it needs more frequent PM, not just reactive repairs.

---

## Frequently Asked Questions

**Q: How many brake violations trigger OOS?**
CVSA sets specific thresholds based on the number of brake chambers out of adjustment relative to the number of braking axles. Generally, if more than 20–25% of braking capacity is impaired, the vehicle is placed OOS.

**Q: Can we challenge a lighting violation if the light worked when we checked it?**
You can submit a DataQs challenge with documentation showing the light was functional at the last pre-trip inspection. Photographic evidence of a recent inspection helps.

**Q: Do lighting violations count less than brake violations in CSA?**
Yes. Brake and tire OOS violations have severity weights of 8–10. Inoperative turn signals and non-critical lighting violations score 3–5. But multiple low-severity violations in one inspection still add up.

**Q: How do we know which Vehicle Maintenance violations are hurting us the most?**
Review your FMCSA SMS data at ai.fmcsa.dot.gov. Your Vehicle Maintenance BASIC detail shows every violation by type and its contribution to your score.`,
  },

  {
    slug: 'post-inspection-documentation',
    title: 'What Documentation Is Needed After a DOT Inspection?',
    headline: 'What Documentation Is Needed After a DOT Inspection?',
    category: 'Violation Guide',
    phase: 1,
    tags: ['Inspection', 'Documentation', 'Audit Readiness', 'Corrective Action'],
    seo_description: 'Complete documentation checklist for fleet safety managers after a DOT roadside inspection. Know exactly what records to collect, retain, and organize to stay audit-ready.',
    cta_primary: 'Build Your Audit-Ready File',
    featured: false,
    body: `## Direct Answer

After a DOT roadside inspection, you need to retain the original inspection report, all repair documentation for cited defects, the driver's pre-trip inspection log from that day, a corrective action plan, and follow-up evidence showing defects were fixed. These documents form your corrective action file and are what FMCSA auditors look for if your carrier is ever reviewed.

---

## What This Means

A DOT roadside inspection generates a permanent record in the FMCSA's system. That record shows what was inspected, what was found, and whether any OOS conditions were identified. What it does not automatically show is what you did about it.

That is your job. The documentation you collect and retain after an inspection is what proves — to FMCSA auditors, to your insurance carrier, and to your own management — that your safety program is real and functioning.

Carriers that get investigated often fail not because violations occurred, but because they cannot demonstrate any corrective response. Good documentation is the difference between an investigation that closes quickly and one that escalates.

---

## Regulation Context

- **Record retention:** 49 CFR 396.3 requires carriers to retain records of inspections, repairs, and maintenance for 1 year from the date of inspection, or 6 months after the vehicle leaves the fleet
- **Driver vehicle inspection reports (DVIRs):** 49 CFR 396.11 requires drivers to submit post-trip DVIRs noting any defects, and 396.13 requires drivers to review the previous DVIR before operating
- **Corrective action evidence:** FMCSA auditors expect to see corrective action documentation during compliance reviews under 49 CFR Part 385

---

## Complete Post-Inspection Documentation Checklist

### Immediate (Within 24 Hours)
- [ ] **Original inspection report** — get a copy from the driver if not already on file; available via FMCSA DataQ portal
- [ ] **Driver Vehicle Inspection Report (DVIR)** from the day of inspection and the day before
- [ ] **Driver statement** — brief written account from the driver of what occurred at the inspection
- [ ] **Notification log** — record of when the safety manager was notified and by whom

### Repair Documentation (For Each Cited Defect)
- [ ] **Repair work order** showing: date, vehicle ID, specific defect, repair performed, parts used, technician name and signature
- [ ] **Pre-repair photos** where possible (especially for tire and brake defects)
- [ ] **Post-repair inspection sign-off** confirming the defect is resolved
- [ ] **Technician certification** if required (e.g., brake repairs in some states)

### Fleet-Wide Response Documentation
- [ ] **Fleet sweep results** — inspection of all vehicles for the same defect type, with findings for each vehicle
- [ ] **PM schedule update** — evidence that your maintenance intervals were reviewed and adjusted if needed

### Corrective Action Plan (CAP)
- [ ] **Written CAP** documenting: violation cited, root cause, corrective action taken, follow-up actions, responsible parties, and due dates
- [ ] **Sign-off by safety manager**
- [ ] **Driver training/retraining record** if driver error contributed to the violation

### Follow-Up Evidence
- [ ] **Post-repair inspection confirmation** (re-inspection of the vehicle or component after repair)
- [ ] **Updated pre-trip inspection checklist** if the standard form was found inadequate
- [ ] **DataQs challenge documentation** if you are contesting any violation

---

## CSA / BASIC Impact

Documentation does not directly affect BASIC scores — only DataQs challenges that result in violation removal do. However, documentation is critical for DataQs challenges and for demonstrating a pattern of compliance during FMCSA investigations, which can affect whether a carrier's safety rating is elevated or downgraded.

---

## Corrective Action Steps

1. **Create a dedicated folder for each inspection.** Physical or digital — label it by date, vehicle ID, and violation type.
2. **Collect documents in order:** Inspection report → DVIR → Driver statement → Repair orders → Fleet sweep → CAP.
3. **Assign a completion deadline for each document.** Repair orders should be closed within 24–48 hours. CAP within 72 hours. Fleet sweep within one week.
4. **Store everything in a central location.** A safety manager's email inbox is not a filing system.
5. **Retain for minimum 1 year** per 49 CFR 396.3, but consider retaining for 3 years given audit risk windows.

---

## Prevention Tips

**Build documentation into your response workflow, not after it.** The moment a violation is reported, open a corrective action file. Don't wait until you have everything to start documenting.

**Use templates.** Pre-built corrective action plan templates remove the burden of formatting and ensure nothing is missed.

**Assign document ownership.** Someone specific should be responsible for collecting and closing every document in the file before the file is marked complete.

---

## Frequently Asked Questions

**Q: Do we have to submit corrective action documentation to FMCSA after every inspection?**
No. FMCSA does not require proactive submission of corrective action files. But you must be able to produce this documentation if you are selected for a compliance review or investigation.

**Q: How long do we need to keep inspection and repair records?**
49 CFR 396.3 requires retention for at least 1 year from the inspection date, or 6 months after the vehicle leaves the fleet. Best practice is to retain for 3 years.

**Q: Does having good documentation remove the violation from our CSA score?**
No. The violation stays in your BASIC score unless you successfully challenge it through DataQs. Documentation supports your DataQs submission and protects you during any investigation.

**Q: What does FMCSA look for when they audit our documentation?**
Auditors look for complete DQ files, current inspection records, maintenance records showing defects were repaired, and evidence that violations generated a corrective response — not just a repair, but a review of the underlying cause.`,
  },

  {
    slug: 'vehicle-maintenance-basic-guide',
    title: 'Vehicle Maintenance BASIC Guide: CSA Scores, Violations & How to Improve',
    headline: 'Vehicle Maintenance BASIC Guide',
    category: 'CSA BASICs',
    phase: 1,
    tags: ['Vehicle Maintenance', 'CSA', 'BASIC', 'Brakes', 'Tires'],
    seo_description: 'Everything fleet safety managers need to know about the Vehicle Maintenance BASIC — what it measures, how it\'s scored, common violations, and how to reduce your percentile.',
    cta_primary: 'Analyze My Vehicle Maintenance BASIC',
    featured: true,
    body: `## Direct Answer

The Vehicle Maintenance BASIC measures how well a carrier maintains its vehicles based on roadside inspection violations. It is the most commonly cited BASIC and covers brakes, tires, lights, steering, and other mechanical systems. To reduce your Vehicle Maintenance BASIC score, fix inspection defects, implement a structured preventive maintenance program, and conduct fleet-wide sweeps whenever violations occur.

---

## What the Vehicle Maintenance BASIC Measures

The Vehicle Maintenance BASIC is one of seven safety behavior categories in the FMCSA's Compliance, Safety, Accountability (CSA) program. It reflects inspection violations related to the physical condition of commercial motor vehicles.

It does not measure how many miles you drive or how old your fleet is. It measures whether violations were found during roadside inspections — and if so, how serious they were.

**Violations in the Vehicle Maintenance BASIC come from:**
- Level I, II, and III roadside inspections
- Crash investigations where mechanical defects were contributing factors
- FMCSA compliance reviews

---

## What the BASIC Score Means

The BASIC score is a percentile ranking — not a raw score. It compares your carrier's violation history to other carriers with a similar number of inspections.

| Percentile | Meaning |
|---|---|
| 0–79% | Below intervention threshold (monitor) |
| 80–99% | Above threshold — FMCSA intervention possible |
| 100% | Highest risk ranking |

**Important:** The percentile changes as other carriers' scores change and as your own violations age off (after 24 months). The safest path is addressing root causes.

---

## Common Violations in This BASIC

| Violation Type | Frequency | Typical Severity Weight | OOS Risk |
|---|---|---|---|
| Brake adjustment out of limits | Very high | 8–10 | Yes |
| Inoperative brake component | High | 10 | Yes |
| Tires — tread below minimum | High | 8–10 | Yes (steer axle) |
| Inoperative lights | Very high | 3–5 | Rarely |
| Air brake leakage | Moderate | 10 | Yes |
| Coupling device defect | Moderate | 10 | Yes |
| Steering deficiency | Lower | 8–10 | Yes |
| Windshield obstruction | Lower | 5 | Conditional |

---

## How Vehicle Maintenance BASIC Scores Are Calculated

1. Each violation is assigned a **severity weight** (1–10) based on crash risk.
2. Violations are **time-weighted** — more recent violations score higher than older ones.
3. OOS violations receive an **additional multiplier**.
4. The carrier's total weighted score is compared to all other carriers with a similar inspection count to produce a **percentile ranking**.

A single high-severity OOS violation (like a brake defect) on a small fleet with few total inspections can push a carrier's percentile dramatically higher than a dozen minor lighting violations on a large fleet with hundreds of clean inspections.

---

## How Fleets Can Reduce Their Vehicle Maintenance BASIC

**Step 1: Pull your current FMCSA SMS data.** Go to ai.fmcsa.dot.gov and review your Vehicle Maintenance BASIC detail. Identify the specific violations driving your score.

**Step 2: Address the highest-severity violations first.** Brake and tire violations have the greatest impact. Fix them, document corrective action, and sweep the fleet.

**Step 3: Implement a structured PM program.** Schedule brake inspections, tire audits, and lighting checks at regular intervals — not just when something breaks.

**Step 4: Make pre-trip inspections real.** Train drivers to complete item-by-item inspections that record specific readings (brake stroke, tread depth), not just checkboxes.

**Step 5: Track violations by vehicle.** Identify repeat offenders and increase their PM frequency or retire them from active service.

**Step 6: Challenge incorrect violations via DataQs.** If any violation was issued in error, submit a DataQs request with evidence. Successful challenges remove the violation from your BASIC score.

---

## Corrective Action Steps

1. Review your FMCSA SMS Vehicle Maintenance BASIC detail
2. Export your violation list sorted by severity weight (highest first)
3. For each violation: repair, document, sweep fleet
4. Update PM schedule based on violation patterns
5. Brief drivers on the top defect categories found
6. Set up calendar alerts for brake and tire inspection intervals

---

## Evidence Checklist (for BASIC Improvement Documentation)

- [ ] Current FMCSA SMS Vehicle Maintenance BASIC printout
- [ ] Violation list with dates and severity weights
- [ ] Corrective action plan for each open violation
- [ ] Repair work orders
- [ ] Fleet-wide PM schedule (updated)
- [ ] Pre-trip inspection form (updated to include specific readings)

---

## Prevention Tips

**Brake maintenance is non-negotiable.** Brake violations account for the majority of OOS vehicle orders. Build brake adjustment checks into every PM cycle and into driver pre-trip procedures.

**Lighting is low-severity but high-frequency.** A fleet that consistently generates lighting violations at inspections signals to FMCSA that maintenance culture is weak — even if the violations themselves don't trigger OOS.

**Match your PM intervals to your operating environment.** High-mileage, long-haul routes wear brakes and tires faster. Short-haul, high-cycle operations wear lighting connectors and coupling devices faster.

---

## Frequently Asked Questions

**Q: What percentile is considered dangerous for Vehicle Maintenance BASIC?**
FMCSA's published intervention threshold is 80%. Above 80%, your carrier may receive a warning letter, be prioritized for roadside inspections, or be targeted for a compliance review.

**Q: Can we see our BASIC score before FMCSA does?**
Yes. Your BASIC scores are visible to the public at ai.fmcsa.dot.gov. Sign up for SMS email alerts to be notified when your score changes.

**Q: Does a clean inspection help our BASIC score?**
Clean inspections are tracked and can improve your SMS standing over time, as they increase your inspection count without adding violations. This can bring your percentile down even if existing violations remain on record.

**Q: How long until a violation drops off our Vehicle Maintenance BASIC?**
Violations stay in the 24-month SMS calculation window. After 24 months, they drop out of the BASIC calculation (though they remain in inspection history).`,
  },

  {
    slug: 'hours-of-service-basic-guide',
    title: 'Hours of Service BASIC Guide: HOS Violations, CSA Impact & Compliance',
    headline: 'Hours of Service (HOS) BASIC Guide',
    category: 'CSA BASICs',
    phase: 1,
    tags: ['Hours of Service', 'HOS', 'CSA', 'BASIC', 'ELD'],
    seo_description: 'Complete guide to the Hours of Service BASIC in FMCSA\'s CSA program — what HOS violations mean, how they affect your score, and how to bring your fleet into compliance.',
    cta_primary: 'Analyze My HOS BASIC',
    featured: false,
    body: `## Direct Answer

The Hours of Service BASIC measures violations related to driver fatigue regulations — specifically, whether drivers comply with FMCSA's limits on daily and weekly driving time. Common violations include falsified or missing logs, ELD malfunctions, and exceeding driving time limits. HOS violations are serious because they indicate driver fatigue risk, which is a primary factor in large truck fatal crashes.

---

## What the Hours of Service BASIC Measures

The HOS BASIC tracks violations of 49 CFR Part 395 — the federal Hours of Service regulations. These rules set maximum driving and on-duty times for CMV operators to manage driver fatigue.

The three core HOS rules:

| Rule | Property-Carrying Drivers |
|---|---|
| 11-Hour Driving Limit | May drive maximum 11 hours after 10 consecutive hours off duty |
| 14-Hour On-Duty Limit | May not drive beyond 14th hour after coming on duty |
| 60/70-Hour Limit | May not drive after 60/70 hours on duty in 7/8 consecutive days |

Additional rules cover the 30-minute break requirement, the 34-hour restart provision, and the sleeper berth split option.

---

## Regulation Context

- **Primary CFR:** 49 CFR Part 395 — Hours of Service of Drivers
- **ELD mandate:** 49 CFR Part 395.8 and 395.15 — Electronic Logging Devices (required for most CMV operators since 2019)
- **Record of Duty Status (RODS):** Drivers must maintain RODS for the current day and previous 7 days

---

## Common HOS Violations and Severity Weights

| Violation | CFR Reference | Severity Weight | OOS Condition? |
|---|---|---|---|
| ELD malfunction / not using required ELD | 395.8 | 7–10 | Conditional |
| Driving after 11-hour limit | 395.3(a)(1) | 10 | Yes |
| Driving beyond 14-hour window | 395.3(a)(2) | 8 | Yes |
| Exceeding 60/70-hour limit | 395.3(b) | 7 | Yes |
| Falsification of RODS | 395.8(e) | 10 | Yes |
| Missing or incomplete RODS | 395.8 | 5–7 | Conditional |
| No 30-minute break | 395.3(a)(3) | 5 | No |

Falsification is treated as the most serious HOS violation and can trigger CDL disqualification.

---

## CSA / BASIC Impact

- **BASIC affected:** Hours of Service Compliance
- **Severity weights:** 5–10; driving-time violations and falsification score highest
- **OOS conditions:** Driving after exceeding 11-hour or 14-hour limits triggers driver OOS
- **Time on record:** 24 months
- **Threshold:** Carriers above the HOS alert threshold face elevated FMCSA scrutiny

The HOS BASIC is particularly sensitive for carriers that operate long-haul routes where drivers push limits or where ELD data is not actively monitored by safety managers.

---

## Corrective Action Steps

1. **Pull the ELD data for the cited driver** and review the full duty-status log for the preceding 7 days.
2. **Identify whether the violation was an isolated incident or a pattern.** A single mistake is a training issue. A pattern is a process or culture issue.
3. **Brief the driver immediately.** Review the specific regulation violated and the consequences.
4. **Audit your ELD provider's settings.** Are HOS alerts configured? Are dispatchers notified when a driver is approaching their limit?
5. **Review dispatch practices.** Are loads being assigned in ways that pressure drivers to push HOS limits?
6. **Update your HOS policy** and have drivers sign an acknowledgment.
7. **For ELD malfunctions:** Follow the ELD malfunction procedure per 395.34 — annotate the record, revert to paper logs, and notify the ELD provider.
8. **Document all steps** in a corrective action file.

---

## Evidence Checklist

- [ ] Inspection report
- [ ] ELD data export for the cited driver (current day + 7 days prior)
- [ ] Driver statement
- [ ] Dispatcher log showing load assignment timeline
- [ ] HOS policy document (signed by driver)
- [ ] Driver retraining record
- [ ] ELD provider alert configuration screenshots
- [ ] Corrective action plan

---

## Prevention Tips

**Configure ELD alerts proactively.** Your ELD system can notify dispatch and safety managers when a driver is 60, 30, and 0 minutes from their driving time limit. If these alerts aren't active, turn them on today.

**Train dispatchers, not just drivers.** HOS violations often start at dispatch when unrealistic delivery windows are assigned. Dispatchers need to understand HOS rules as well as drivers do.

**Review ELD data weekly, not just after violations.** Active monitoring catches HOS drift before it becomes a violation.

**Don't treat the 14-hour rule as elastic.** Some drivers treat the 14-hour window as a driving limit rather than a hard cutoff. Make sure your fleet understands that on-duty-not-driving time counts toward the 14 hours.

---

## Frequently Asked Questions

**Q: Does the HOS BASIC apply to exempt short-haul drivers?**
Short-haul drivers who qualify for the short-haul exemption are not required to use an ELD and have different HOS rules. However, violations of the short-haul rules still count against the HOS BASIC if found during inspection.

**Q: What happens if our ELD has a malfunction during an inspection?**
Per 49 CFR 395.34, when an ELD malfunctions, the driver must note the malfunction and record RODS on paper. The carrier must repair or replace the ELD within 8 days. Inspectors can place the driver OOS if paper logs are also unavailable.

**Q: Can a carrier be penalized for violations the driver didn't report?**
Yes. Carriers have an obligation to monitor driver compliance and cannot claim ignorance when ELD data was available.`,
  },

  {
    slug: 'driver-fitness-basic-guide',
    title: 'Driver Fitness BASIC Guide: Qualifications, Violations & CSA Impact',
    headline: 'Driver Fitness BASIC Guide',
    category: 'CSA BASICs',
    phase: 1,
    tags: ['Driver Fitness', 'CSA', 'BASIC', 'CDL', 'Medical Certificate'],
    seo_description: 'Complete guide to the Driver Fitness BASIC — what it measures, common violations (expired medical certificates, CDL issues), CSA score impact, and how to maintain compliance.',
    cta_primary: 'Analyze My Driver Fitness BASIC',
    featured: false,
    body: `## Direct Answer

The Driver Fitness BASIC measures whether carriers ensure their drivers are legally qualified to operate commercial motor vehicles. Violations occur when drivers operate CMVs with expired, missing, or invalid medical certificates, CDLs, or required endorsements. Keeping this BASIC score low requires active management of driver qualification files with expiration tracking and regular audits.

---

## What the Driver Fitness BASIC Measures

The Driver Fitness BASIC tracks violations related to driver qualification under 49 CFR Part 391. It answers the question: does this carrier verify that its drivers are properly licensed, medically certified, and otherwise qualified before putting them in a CMV?

This BASIC is fundamentally different from Vehicle Maintenance or HOS — it is almost entirely an administrative compliance issue. The violations found here are not accidents or in-the-moment lapses. They are evidence that the carrier's driver qualification management process has broken down.

**What counts against Driver Fitness BASIC:**
- Operating with an expired or invalid medical certificate
- Operating with an expired or invalid CDL
- Missing required CDL endorsements for the vehicle being operated
- Incomplete or missing Driver Qualification (DQ) files
- Failure to conduct required entry-level driver training
- Driving while disqualified

---

## Regulation Context

- **Primary CFR:** 49 CFR Part 391 — Qualifications of Drivers
- **Medical requirements:** 391.41–391.49 — physical qualifications and medical exams
- **CDL requirements:** 49 CFR Part 383
- **DQ file requirements:** 391.51 — driver qualification file contents and retention
- **ELDT:** 49 CFR Part 380 — entry-level driver training (required for new CDL holders since 2022)

---

## Common Driver Fitness Violations

| Violation | Severity Weight | OOS Condition? |
|---|---|---|
| No/expired medical certificate | 10 | Yes |
| No valid CDL | 10 | Yes |
| Wrong CDL class for vehicle | 8–10 | Yes |
| Missing endorsement (tanker, doubles, HazMat) | 8–10 | Yes |
| CDL suspended/revoked | 10 | Yes |
| Incomplete DQ file | 3–5 | No |
| Missing entry-level driver training record | 3–5 | No |

---

## CSA / BASIC Impact

- **BASIC affected:** Driver Fitness
- **Severity:** Qualification and certification violations score 8–10; file violations score 3–5
- **OOS threshold:** Medical and CDL violations are automatic OOS
- **Record window:** 24 months
- **Investigative signal:** A high Driver Fitness BASIC percentile tells FMCSA investigators that the carrier is not adequately screening and monitoring driver qualifications

---

## How to Build a Compliant Driver Qualification Program

**Step 1: Audit every active driver's DQ file.** Pull files for all drivers and verify that every required document is present and current.

**Required DQ file contents under 49 CFR 391.51:**
- Employment application
- Motor vehicle record inquiry (at time of hire and annually)
- Previous employer safety performance history request
- CDL copy (current)
- Medical examiner's certificate (current)
- Road test certificate or equivalent
- ELDT completion certificate (for post-2022 CDL holders)

**Step 2: Build an expiration tracking system.** At minimum, track CDL expiration and medical certificate expiration for every driver. Load these into a shared calendar with 90/60/30-day alerts.

**Step 3: Assign DQ file ownership.** One person should own DQ file maintenance. Shared responsibility means no responsibility.

**Step 4: Set a policy that drivers may not be dispatched with expired qualifications.** This needs to be written, signed, and enforced — not just assumed.

**Step 5: Conduct annual DQ file audits.** Pull every file once a year and verify completeness and currency.

---

## Corrective Action Steps

1. Remove the non-compliant driver from service immediately
2. Resolve the specific deficiency (renew medical certificate, obtain CDL endorsement, etc.)
3. Audit all other driver DQ files within 48 hours
4. Update expiration tracking system
5. Document corrective action with dates and sign-offs
6. Brief all drivers on DQ requirements

---

## Evidence Checklist

- [ ] Inspection report
- [ ] Updated/renewed document (medical certificate, CDL copy)
- [ ] Complete DQ file audit results for all drivers
- [ ] Expiration tracking system export showing all active drivers
- [ ] Corrective action plan with sign-offs
- [ ] Driver acknowledgment of retraining/briefing

---

## Prevention Tips

**DQ files are a living compliance obligation, not a hiring checkbox.** The documents that were accurate at hire will expire. Only active tracking prevents violations.

**Run MVR checks annually.** 49 CFR 391.25 requires annual motor vehicle record inquiries. Missing these is itself a violation and may reveal CDL suspensions you don't know about.

**Know your endorsement requirements.** If you operate tankers, double/triple trailers, or carry HazMat, your drivers need T, N/doubles, or H endorsements respectively. Verify before dispatch.

---

## Frequently Asked Questions

**Q: Does a driver need a new DOT physical every time their medical certificate expires?**
Yes. The medical examiner's certificate must be renewed through a new DOT physical. Most certificates are issued for 1–2 years depending on the driver's health status.

**Q: Can a driver work in a non-driving capacity while their medical certificate is expired?**
Yes, as long as they are not operating a CMV in interstate commerce. Drivers with expired medical certificates may perform yard moves, administrative tasks, or other non-driving work.

**Q: What is the penalty for a carrier that allows an unqualified driver to operate?**
Civil penalties can reach thousands of dollars per violation, per day. Repeat offenses can result in operating authority revocation.`,
  },

  {
    slug: 'how-to-prepare-for-fmcsa-audit',
    title: 'How to Prepare for an FMCSA Compliance Review (Audit)',
    headline: 'How to Prepare for an FMCSA Compliance Review',
    category: 'Audit Readiness',
    phase: 1,
    tags: ['Audit', 'FMCSA', 'Compliance Review', 'Safety Rating'],
    seo_description: 'Step-by-step guide for fleet safety managers on how to prepare for an FMCSA compliance review — what auditors look for, what documents to have ready, and how to avoid common mistakes.',
    cta_primary: 'Build an Audit-Ready Corrective Action File',
    featured: true,
    body: `## Direct Answer

To prepare for an FMCSA compliance review, organize your Driver Qualification files, Hours of Service records, vehicle maintenance and inspection records, and corrective action documentation for any past violations. Auditors look for evidence that your safety management practices are real and functioning — not just that paperwork exists.

---

## What This Means

An FMCSA compliance review (formerly called a compliance audit) is an on-site examination of a motor carrier's records, practices, and safety management systems. Investigators evaluate your carrier against federal safety regulations.

The review results in one of three safety ratings:
- **Satisfactory:** Your safety management programs adequately prevent unsafe driving and unsafe vehicles.
- **Conditional:** Deficiencies were found in some areas but not a systemic failure.
- **Unsatisfactory:** Significant safety management failures found; may result in operations shutdown.

A carrier can also be reviewed without a rating change — resulting in violations, civil penalties, or consent orders.

---

## What Triggers a Compliance Review

- Elevated CSA BASIC scores (particularly above intervention thresholds in multiple BASICs)
- A serious crash involving fatalities or injuries
- A complaint filed with FMCSA
- A carrier that has been granted new authority and is selected for a new entrant safety audit
- Routine selection as part of FMCSA's compliance review program

You may receive advance notice (several days to a few weeks) or very little notice depending on the type of review.

---

## What FMCSA Auditors Evaluate

| Category | Key Documents Examined |
|---|---|
| Driver Qualifications (Part 391) | DQ files, medical certificates, CDL copies, MVR checks |
| Hours of Service (Part 395) | ELD records, RODS for last 6 months, time card/payroll cross-reference |
| Driver Fitness | DQ file completeness, drug/alcohol pre-employment and random testing records |
| Controlled Substances & Alcohol (Part 382) | Drug and alcohol testing program documentation |
| Vehicle Inspection / Maintenance (Part 396) | Inspection records, maintenance records, DVIR logs |
| Accident Register (Part 390) | Accident register for crashes meeting FMCSA thresholds in past 12 months |

---

## 30-Day Preparation Checklist

### Driver Qualification Files (Part 391)
- [ ] Pull DQ files for all drivers active in the past 12 months
- [ ] Verify: employment application, CDL copy (current), medical certificate (current), MVR (at hire + annual), previous employer contacts, road test certificate
- [ ] Flag and resolve any incomplete or expired documents before the review

### Hours of Service Records (Part 395)
- [ ] Pull ELD records for all drivers for the past 6 months
- [ ] Verify ELD device compliance (current mandate)
- [ ] Check for HOS violations your own system flagged — resolve and document
- [ ] Cross-reference ELD records with payroll/fuel receipts to verify accuracy

### Vehicle Maintenance (Part 396)
- [ ] Pull maintenance records for all vehicles active in the past 12 months
- [ ] Verify: annual inspection (every 12 months per 396.17), DVIR completion by drivers, repair orders for any defects noted
- [ ] Compile corrective action files for any past roadside violations

### Drug & Alcohol Testing (Part 382)
- [ ] Verify you have a compliant testing program with a certified FMCSA-registered C/TPA
- [ ] Pull testing records: pre-employment, random, post-accident, reasonable suspicion
- [ ] Verify random testing pool size and selection documentation
- [ ] Confirm MRO and SAP records are current for any positive tests

### Accident Register (Part 390.15)
- [ ] Compile accident register for last 12 months (crashes above threshold: fatality, injury requiring immediate medical attention, or disabled vehicle towed)
- [ ] Verify each entry includes: date, location, driver, injuries, fatalities, hazmat release, vehicles involved

---

## During the Review

- **Be cooperative but organized.** Produce documents promptly and in order.
- **Do not volunteer information beyond what is asked.** Answer questions directly and specifically.
- **If a document cannot be located, say so immediately.** Do not present substitutes or approximations.
- **Assign one person to accompany the investigator** at all times.
- **Take notes.** Document every document requested, every question asked, and every finding mentioned.

---

## After the Review

- **Request a copy of the preliminary findings** before the investigator leaves if possible.
- **Respond to any findings promptly** with corrective action documentation.
- **If you receive a Conditional or Unsatisfactory rating,** you have the right to petition FMCSA for a rating change after demonstrating corrective action.

---

## Evidence Checklist

- [ ] Complete, organized DQ files for all active drivers
- [ ] 6 months of ELD / RODS records
- [ ] 12 months of vehicle maintenance and inspection records
- [ ] Drug and alcohol testing program documentation
- [ ] Accident register (last 12 months)
- [ ] Corrective action files for any past violations

---

## Prevention Tips

**Treat every month like an audit is coming next month.** Carriers that maintain continuous document compliance are far less stressed when an actual review is scheduled — and far less likely to receive serious findings.

**Self-audit annually.** Use FMCSA's compliance review checklists (available at fmcsa.dot.gov) to audit your own records before an investigator does.

---

## Frequently Asked Questions

**Q: How much notice does FMCSA give before a compliance review?**
It varies. New entrant safety audits typically provide notice. Focused compliance reviews triggered by crashes or complaints may arrive with little to no advance notice.

**Q: Can we fail a compliance review even if we've never had an OOS violation?**
Yes. Compliance reviews evaluate your records and programs — not just your roadside history. Missing drug testing records, incomplete DQ files, or lack of a maintenance program can result in a Conditional or Unsatisfactory rating.

**Q: What happens if we get a Conditional rating?**
A Conditional rating means deficiencies were found but your safety management is not deemed inadequate overall. FMCSA will typically provide a corrective action opportunity. You can petition for a rating upgrade after demonstrating compliance.

**Q: Does a previous satisfactory rating protect us in a new review?**
No. Each compliance review is evaluated independently based on current records and practices.`,
  },

  {
    slug: 'dot-audit-checklist-small-fleets',
    title: 'DOT Audit Checklist for Small Fleets (1–25 Trucks)',
    headline: 'DOT Audit Checklist for Small Fleets',
    category: 'Audit Readiness',
    phase: 1,
    tags: ['Audit', 'Checklist', 'Small Fleet', 'FMCSA', 'Compliance'],
    seo_description: 'A complete DOT compliance audit checklist designed for small fleets (1–25 trucks). Use this to self-audit your records and find gaps before an FMCSA investigator does.',
    cta_primary: 'Build an Audit-Ready Corrective Action File',
    featured: false,
    body: `## Direct Answer

Small fleets face the same DOT compliance requirements as large carriers but with fewer administrative resources. This checklist covers every major area FMCSA auditors review: driver qualification files, HOS records, vehicle inspections, drug and alcohol testing, and crash documentation. Complete this checklist before any audit — or quarterly as a self-audit practice.

---

## What This Means

Small fleet operators — 1 to 25 trucks — are just as subject to FMCSA compliance reviews as large carriers. In fact, small carriers are often selected for new entrant safety audits within their first 12 months of operation, and carriers with elevated CSA BASIC scores are selected for compliance reviews regardless of size.

The most common failure point for small fleets during audits is not operational — it is administrative. Driver Qualification files missing key documents, drug testing programs not properly configured, and maintenance records that are incomplete or disorganized account for the majority of findings in small fleet compliance reviews.

This checklist is designed to be completed by a safety manager or owner-operator in a single sitting. Work through each section, note what is missing, and address gaps before your next inspection or audit.

---

## Section 1: Driver Qualification Files (49 CFR Part 391)

For each active driver:

- [ ] Employment application on file (signed, dated)
- [ ] Copy of current valid CDL (verify class and endorsements match vehicle assignments)
- [ ] Current medical examiner's certificate (verify expiration date)
- [ ] Motor vehicle record (MVR) from state of CDL issuance at time of hire
- [ ] Annual MVR review completed (required every 12 months)
- [ ] Previous employer contacts documented (safety performance history for last 3 years)
- [ ] Road test certificate or equivalent on file
- [ ] Entry-level driver training (ELDT) certificate if driver obtained CDL after 2/7/2022
- [ ] Annual review of driving record completed and documented

**Red flags:**
- Medical certificates expiring within 60 days (schedule renewal now)
- CDLs expiring within 90 days
- Missing annual MVR reviews
- No previous employer contact attempt documented

---

## Section 2: Hours of Service Records (49 CFR Part 395)

- [ ] All drivers who require an ELD are using a registered ELD device
- [ ] ELD provider is on the FMCSA registered ELD list (fmcsa.dot.gov/registration/eld)
- [ ] ELD data is being retained for minimum 6 months
- [ ] Drivers exempt from ELD (short-haul, pre-2000 vehicles) are maintaining paper logs correctly
- [ ] No unresolved HOS violations flagged by your ELD system in the last 90 days
- [ ] Drivers are not being dispatched in ways that require HOS violations to complete assigned loads

---

## Section 3: Vehicle Inspection & Maintenance (49 CFR Part 396)

For each active vehicle:

- [ ] Annual DOT inspection completed and current (required every 12 months, 49 CFR 396.17)
- [ ] Annual inspection report on file for each vehicle
- [ ] Driver Vehicle Inspection Reports (DVIRs) completed daily and retained (90-day minimum)
- [ ] All defects noted in DVIRs have repair orders showing they were addressed
- [ ] Repair and maintenance records retained for 1 year (or 6 months after vehicle leaves fleet)
- [ ] All roadside inspection violations have corrective action files

**Red flags:**
- Any vehicle with annual inspection expired or expiring within 30 days
- DVIRs not being completed daily
- DVIR defects not signed off with repair documentation

---

## Section 4: Drug & Alcohol Testing (49 CFR Part 382)

- [ ] Written drug and alcohol testing policy in place (signed by all drivers)
- [ ] Testing program operated through an FMCSA-compliant C/TPA
- [ ] Pre-employment drug test completed and negative result on file for all current drivers
- [ ] Random testing program active with correct annual testing rates (50% for drugs, 10% for alcohol)
- [ ] Random selection process is truly random (document your selection method)
- [ ] Post-accident testing completed within required timeframes for qualifying crashes
- [ ] Reasonable suspicion documentation training completed for supervisors
- [ ] All positive tests have Medical Review Officer (MRO) documentation on file
- [ ] Any driver who tested positive has completed SAP process before returning to duty

---

## Section 5: Accident Register (49 CFR Part 390.15)

- [ ] Accident register maintained for last 3 years
- [ ] Register includes all qualifying crashes: fatality, injury requiring immediate medical attention away from scene, or disabled vehicle requiring tow
- [ ] Each entry includes: date, location, driver name, number of injuries, number of fatalities, hazmat release (yes/no), vehicles involved

---

## Section 6: Required Cab Documents

Verify the following are in every active vehicle's cab:

- [ ] Driver's current CDL
- [ ] Driver's current medical certificate
- [ ] Vehicle registration
- [ ] Current IFTA/IRP credentials
- [ ] ELD instruction sheet (required per FMCSA ELD mandate)
- [ ] Motor carrier's DOT number and operating authority number displayed

---

## How to Use This Checklist

1. Work through each section for every driver and every vehicle.
2. Flag every unchecked item as a gap.
3. Assign each gap a responsible person and a due date.
4. Resolve all gaps within 30 days.
5. Re-run this checklist quarterly.

---

## Frequently Asked Questions

**Q: Do owner-operators (single-truck carriers) have to comply with all of these requirements?**
Yes. If you operate as a for-hire carrier in interstate commerce, all FMCSA regulations apply regardless of fleet size.

**Q: What is the penalty for missing drug testing records during an audit?**
Civil penalties can reach $16,000+ per violation per day for drug/alcohol testing program failures. Missing records for a single driver over 30 days can result in substantial fines.

**Q: How often should we self-audit?**
Quarterly at minimum. Monthly if your fleet is growing, you recently had roadside violations, or your CSA BASIC scores are elevated.`,
  },

  {
    slug: 'dot-corrective-action-plan-template',
    title: 'DOT Corrective Action Plan Template (Free Download)',
    headline: 'DOT Corrective Action Plan Template',
    category: 'Templates',
    phase: 1,
    tags: ['Template', 'Corrective Action', 'CAP', 'Documentation', 'FMCSA'],
    seo_description: 'Free DOT corrective action plan template for fleet safety managers. Use this structured CAP to document violation response, assign follow-up, and build an audit-ready file after any FMCSA roadside inspection.',
    cta_primary: 'Generate a Corrective Action Plan in Axesntra',
    featured: true,
    body: `## Direct Answer

A DOT corrective action plan (CAP) documents what steps your fleet took to fix a violation found during a roadside inspection, address the root cause, and prevent recurrence. Every violation should have a completed CAP on file. Use the template below to build an audit-ready corrective action file for any DOT violation.

---

## What This Means

A corrective action plan is not required by a single FMCSA regulation — but it is expected during every compliance review. FMCSA investigators look for evidence that your carrier identifies violations, fixes defects, and implements systemic changes to prevent repeat occurrences.

A carrier that produces organized, thorough corrective action files for past violations demonstrates that its safety program is active and functioning. A carrier that cannot produce evidence of corrective action signals to investigators that safety management is reactive at best, non-existent at worst.

---

## DOT Corrective Action Plan Template

**CORRECTIVE ACTION PLAN**

**Motor Carrier Name:** ___________________________________
**DOT Number:** ___________________________________
**Date of Inspection:** ___________________________________
**Inspection Location:** ___________________________________
**Driver Name:** ___________________________________
**Vehicle Unit Number:** ___________________________________
**Prepared by:** ___________________________________
**Date CAP Completed:** ___________________________________

---

### SECTION 1: VIOLATION SUMMARY

| Field | Details |
|---|---|
| Violation Code | (e.g., 393.75(a)(3)) |
| Violation Description | (e.g., Tire tread depth below 2/32 inch on steer axle) |
| OOS Condition? | Yes / No |
| BASIC Affected | (e.g., Vehicle Maintenance) |
| Severity Weight | (1–10) |
| Estimated BASIC Impact | High / Medium / Low |

---

### SECTION 2: IMMEDIATE CORRECTIVE ACTION

**What was done immediately to correct the violation:**

_________________________________

**Date defect corrected:** ___________________________________
**Repaired by (name/company):** ___________________________________
**Repair documentation reference:** ___________________________________

---

### SECTION 3: ROOT CAUSE ANALYSIS

**Why did this violation occur?**

Check all that apply:
- [ ] Driver failed to identify defect during pre-trip inspection
- [ ] Maintenance interval was too long (defect developed between scheduled PM)
- [ ] Defect was identified but repair was deferred
- [ ] Driver Qualification file lapse (for Driver Fitness violations)
- [ ] HOS tracking or dispatch process failure (for HOS violations)
- [ ] Equipment age/wear exceeded expected parameters
- [ ] Other: ___________________________________

---

### SECTION 4: CORRECTIVE ACTIONS — VEHICLE / EQUIPMENT

| Action Item | Responsible Party | Due Date | Completed Date |
|---|---|---|---|
| Repair cited defect | | | |
| Fleet-wide sweep for same defect type | | | |
| Update PM schedule/interval | | | |
| Replace/retire chronic problem vehicle | | | |

---

### SECTION 5: CORRECTIVE ACTIONS — DRIVER / TRAINING

| Action Item | Responsible Party | Due Date | Completed Date |
|---|---|---|---|
| Brief driver on specific violation | | | |
| Conduct pre-trip inspection retraining | | | |
| Update pre-trip inspection form | | | |
| Conduct HOS retraining | | | |
| Update DQ file / renew qualification | | | |

---

### SECTION 6: DOCUMENTATION ATTACHED

- [ ] Original inspection report
- [ ] Repair work order(s)
- [ ] Fleet sweep results
- [ ] Driver training record
- [ ] Updated PM schedule
- [ ] Updated pre-trip inspection form

---

### SECTION 7: SIGN-OFF

**Safety Manager Signature:** ___________________________________
**Date:** ___________________________________

**Driver Acknowledgment (if applicable):**
I have been briefed on this violation and the corrective actions taken.
**Driver Signature:** ___________________________________
**Date:** ___________________________________

---

## How to Use This Template

1. **Complete one CAP per violation**, not per inspection. A single inspection may generate multiple violations requiring separate CAPs.
2. **Complete Section 2 (immediate corrective action) within 24 hours** of receiving the inspection report.
3. **Complete the full CAP within 72 hours.** Root cause analysis should not wait.
4. **Collect all supporting documents** listed in Section 6 and attach them to this CAP.
5. **Store in a central, retrievable location.** File by date and violation type.
6. **Review open CAP items weekly** until all action items are closed.

---

## Why This Matters for FMCSA Compliance

During a compliance review, FMCSA investigators will ask to see how you responded to past violations. A completed CAP with supporting documentation shows:

- The defect was fixed promptly
- You identified the root cause
- You took systemic steps to prevent recurrence
- Your safety management program is active

A corrective action file with completed CAPs is also the foundation of any successful DataQs challenge.

---

## Frequently Asked Questions

**Q: Is there a standard FMCSA-required format for corrective action plans?**
No. FMCSA does not mandate a specific CAP format. What matters is that the documentation is complete, organized, and demonstrates a genuine corrective response.

**Q: Do we need a CAP for every single violation, even minor ones?**
Best practice is to document corrective action for every violation. For minor violations (e.g., a single burned-out turn signal), a brief work order and sweep log may suffice. For OOS violations or BASIC-impacting violations, a full CAP is essential.

**Q: Can our CAP help get a violation removed from our CSA score?**
A CAP does not directly remove a violation from your CSA score. DataQs challenges can remove violations if they were inaccurately recorded. The CAP supports your DataQs submission and protects you during any investigation.`,
  },

  {
    slug: 'post-inspection-evidence-checklist',
    title: 'Post-Inspection Evidence Checklist: What to Keep After a DOT Roadside Inspection',
    headline: 'Post-Inspection Evidence Checklist',
    category: 'Templates',
    phase: 1,
    tags: ['Template', 'Checklist', 'Evidence', 'Inspection', 'Audit Readiness'],
    seo_description: 'Exactly what evidence to collect and retain after a DOT roadside inspection. Use this checklist to build an audit-ready file for every violation your fleet receives.',
    cta_primary: 'Build Your Audit-Ready File',
    featured: true,
    body: `## Direct Answer

After a DOT roadside inspection, collect and retain the original inspection report, all repair work orders, the driver's DVIR from that day, a root cause analysis, training records if applicable, and a signed corrective action plan. These documents form the evidence file that protects your fleet during FMCSA compliance reviews, DataQs challenges, and insurance audits.

---

## What This Means

Every roadside inspection — whether clean or not — generates a permanent federal record. When violations are found, that record shows what was wrong. What it does not show is what you did about it.

The evidence you collect and retain after an inspection is what demonstrates your safety program is real. During an FMCSA compliance review, investigators pull your inspection history and then ask for your corrective action files. Carriers who can produce organized evidence files consistently receive better outcomes than those who cannot — even when the underlying violation history is similar.

This checklist is designed to be used immediately after any inspection that results in violations.

---

## Complete Post-Inspection Evidence Checklist

### PHASE 1: Immediate Collection (Within 24 Hours)

**Inspection Documentation**
- [ ] Original Driver Vehicle Inspection Report (DVIR) from day of inspection
- [ ] DVIR from the previous day (to show prior-trip inspection was completed)
- [ ] Copy of the roadside inspection report (your driver should receive one; also available via FMCSA DataQ portal)
- [ ] Inspection level (Level I, II, III, etc.) noted on your internal record
- [ ] OOS status confirmed (was vehicle or driver placed OOS? yes/no)

**Driver Documentation**
- [ ] Driver statement — brief written account of what happened at the inspection stop
- [ ] Driver notification record — when was the safety manager notified and by whom
- [ ] Driver's CDL copy (verify it is current)
- [ ] Driver's medical certificate (verify it is current) — especially if Driver Fitness violations were cited

---

### PHASE 2: Repair & Correction (Within 48 Hours)

**For each defect cited:**
- [ ] Work order showing: vehicle unit number, date of repair, specific defect repaired, parts used, labor performed, technician name and signature
- [ ] Pre-repair photograph(s) of defect (if practicable — especially valuable for tire, brake, structural defects)
- [ ] Post-repair vehicle inspection confirmation
- [ ] Technician certification number if required (e.g., brake work in regulated states)
- [ ] Confirmation that vehicle did not return to service before repair was complete (OOS vehicles)

---

### PHASE 3: Fleet Response (Within 1 Week)

**Fleet-Wide Sweep**
- [ ] Sweep log showing: date, all vehicles inspected, specific item inspected, reading or finding for each vehicle, action taken if any
- [ ] All vehicles passing sweep noted with readings on record
- [ ] Any additional defects found during sweep have their own repair work orders

**Process & Procedure Updates**
- [ ] Updated preventive maintenance schedule (if defect indicates interval was too long)
- [ ] Updated pre-trip inspection checklist (if form did not catch the defect)
- [ ] Updated dispatch or operational policy (if HOS or routing contributed to violation)

---

### PHASE 4: Training Documentation (If Applicable)

- [ ] Training content record — what was covered in driver briefing or retraining
- [ ] Date of training session
- [ ] Driver acknowledgment / signature confirming training was received
- [ ] Training method (in-person, video, written materials)
- [ ] Trainer name and qualification

---

### PHASE 5: Corrective Action Plan (Within 72 Hours)

- [ ] Completed corrective action plan (use Axesntra's CAP template or equivalent)
- [ ] Safety manager signature
- [ ] Driver signature (if driver-related violation)
- [ ] All action items from the CAP marked complete with dates

---

### PHASE 6: DataQs Challenge Documentation (If Contesting the Violation)

- [ ] DataQs submission confirmation number
- [ ] Specific grounds for challenge (factual error, administrative error, etc.)
- [ ] Evidence submitted: photographs, maintenance records, GPS data, ELD data
- [ ] Response received from inspecting agency
- [ ] Final resolution status noted

---

## Evidence File Organization

Organize your evidence file in this order for easy auditor access:

1. Inspection report (cover document)
2. Driver DVIR (day of and day before)
3. Driver statement
4. Repair work orders (one per defect)
5. Fleet sweep log
6. Training records (if applicable)
7. Updated procedures (PM schedule, inspection checklist)
8. Corrective action plan (signed)
9. DataQs documentation (if applicable)

**Label the file:** [Date] - [Vehicle ID] - [Violation Type] - Corrective Action File

---

## How Long to Retain Evidence Files

| Document Type | Minimum Retention (per CFR) | Recommended Retention |
|---|---|---|
| Inspection reports | 1 year (396.3) | 3 years |
| Repair/maintenance records | 1 year (396.3) | 3 years |
| DVIR records | 90 days (396.11) | 1 year |
| Corrective action files | Not specifically mandated | 3 years minimum |
| DataQs records | Not specifically mandated | Duration of carrier operation |

---

## Frequently Asked Questions

**Q: Do we need this level of documentation for clean inspections?**
For clean inspections, retain the inspection report. The detailed corrective action documentation is primarily for inspections with violations.

**Q: What if our driver didn't get a copy of the inspection report?**
Download it from the FMCSA DataQ portal at dataqs.fmcsa.dot.gov. All inspections are posted there within 24–72 hours.

**Q: Does this documentation help if we want to challenge a violation?**
Yes, significantly. A DataQs challenge supported by organized documentation — photos, repair records, GPS data — is far more likely to succeed than an undocumented claim that the violation was wrong.

**Q: Can insurance carriers access our inspection records?**
Yes. FMCSA inspection data is publicly available. Your insurance carrier may reference your CSA BASIC scores during underwriting or renewal.`,
  },

  // ── PHASE 2 (frontmatter only) ────────────────────────────────────────────

  {
    slug: 'unsafe-driving-basic-guide',
    title: 'Unsafe Driving BASIC Guide: Speeding, Reckless Driving & CSA Impact',
    headline: 'Unsafe Driving BASIC Guide',
    category: 'CSA BASICs',
    phase: 2,
    tags: ['Unsafe Driving', 'CSA', 'BASIC', 'Speeding', 'Reckless Driving'],
    seo_description: 'Complete guide to the Unsafe Driving BASIC in FMCSA\'s CSA program — what violations count, how speeding and reckless driving affect your score, and how fleets can reduce their percentile.',
    cta_primary: 'Analyze My Unsafe Driving BASIC',
    featured: false,
    body: '',
  },
  {
    slug: 'crash-indicator-basic-guide',
    title: 'Crash Indicator BASIC Guide: How Crashes Affect Your CSA Score',
    headline: 'Crash Indicator BASIC Guide',
    category: 'CSA BASICs',
    phase: 2,
    tags: ['Crash Indicator', 'CSA', 'BASIC', 'Crash', 'Safety Rating'],
    seo_description: 'How the FMCSA Crash Indicator BASIC works, what crashes are counted, how they affect your CSA percentile, and what fleet safety managers can do to reduce crash risk and improve their score.',
    cta_primary: 'Analyze My Crash Indicator BASIC',
    featured: false,
    body: '',
  },
  {
    slug: 'controlled-substances-alcohol-basic-guide',
    title: 'Controlled Substances & Alcohol BASIC Guide: Drug Testing & CSA Compliance',
    headline: 'Controlled Substances & Alcohol BASIC Guide',
    category: 'CSA BASICs',
    phase: 2,
    tags: ['Controlled Substances', 'Alcohol', 'CSA', 'BASIC', 'Drug Testing'],
    seo_description: 'Guide to the FMCSA Controlled Substances and Alcohol BASIC — what violations count, how drug and alcohol testing failures affect your CSA score, and how to maintain a compliant testing program.',
    cta_primary: 'Analyze My CS/A BASIC',
    featured: false,
    body: '',
  },
  {
    slug: 'hazmat-basic-guide',
    title: 'Hazmat BASIC Guide: HazMat Violations & CSA Compliance for Fleets',
    headline: 'Hazmat BASIC Guide',
    category: 'CSA BASICs',
    phase: 2,
    tags: ['Hazmat', 'CSA', 'BASIC', 'HazMat Compliance', 'Placarding'],
    seo_description: 'Complete guide to the FMCSA Hazmat BASIC — what violations are included, how HazMat transportation failures affect your CSA score, and how fleet safety managers can maintain compliance.',
    cta_primary: 'Analyze My Hazmat BASIC',
    featured: false,
    body: '',
  },
  {
    slug: 'fleet-document-retention-after-violations',
    title: 'What Documents Should Fleets Keep After DOT Violations?',
    headline: 'What Documents Should Fleets Keep After DOT Violations?',
    category: 'Audit Readiness',
    phase: 2,
    tags: ['Documentation', 'Record Retention', 'Audit', 'Compliance'],
    seo_description: 'Complete guide to document retention for fleet safety managers — what records to keep after DOT violations, how long to keep them, and how to organize them for FMCSA compliance reviews.',
    cta_primary: 'Build Your Audit-Ready File',
    featured: false,
    body: '',
  },
  {
    slug: 'how-to-prove-corrective-action-after-inspection',
    title: 'How to Prove Corrective Action After a DOT Inspection',
    headline: 'How to Prove Corrective Action After a DOT Inspection',
    category: 'Audit Readiness',
    phase: 2,
    tags: ['Corrective Action', 'Proof', 'Documentation', 'FMCSA', 'Audit'],
    seo_description: 'How fleet safety managers can prove corrective action after a DOT roadside inspection — what evidence FMCSA auditors accept, how to organize your documentation, and what a strong corrective action file looks like.',
    cta_primary: 'Build an Audit-Ready Corrective Action File',
    featured: false,
    body: '',
  },
  {
    slug: 'common-audit-mistakes-safety-managers',
    title: 'Common FMCSA Audit Mistakes Safety Managers Make (And How to Avoid Them)',
    headline: 'Common FMCSA Audit Mistakes Safety Managers Make',
    category: 'Audit Readiness',
    phase: 2,
    tags: ['Audit', 'Mistakes', 'FMCSA', 'Safety Manager', 'Compliance'],
    seo_description: 'The most common mistakes fleet safety managers make during FMCSA compliance reviews — and what to do instead. Avoid these errors to protect your safety rating and reduce audit findings.',
    cta_primary: 'Build an Audit-Ready Corrective Action File',
    featured: false,
    body: '',
  },
  {
    slug: 'vehicle-maintenance-corrective-action-template',
    title: 'Vehicle Maintenance Violation Corrective Action Template',
    headline: 'Vehicle Maintenance Violation Corrective Action Template',
    category: 'Templates',
    phase: 2,
    tags: ['Template', 'Vehicle Maintenance', 'Corrective Action', 'Brakes', 'Tires'],
    seo_description: 'Free corrective action plan template specifically for Vehicle Maintenance BASIC violations. Fill out this structured CAP after any brake, tire, lighting, or equipment violation to build an audit-ready file.',
    cta_primary: 'Generate a Corrective Action Plan in Axesntra',
    featured: false,
    body: '',
  },
  {
    slug: 'driver-fitness-corrective-action-template',
    title: 'Driver Fitness Violation Corrective Action Plan Template',
    headline: 'Driver Fitness Violation Corrective Action Plan Template',
    category: 'Templates',
    phase: 2,
    tags: ['Template', 'Driver Fitness', 'Corrective Action', 'DQ File', 'Medical Certificate'],
    seo_description: 'Corrective action plan template for Driver Fitness BASIC violations — expired medical certificates, CDL issues, and DQ file deficiencies. Build an audit-ready file for every driver qualification violation.',
    cta_primary: 'Generate a Corrective Action Plan in Axesntra',
    featured: false,
    body: '',
  },
  {
    slug: 'hos-violation-corrective-action-template',
    title: 'HOS Violation Corrective Action Plan Template',
    headline: 'HOS Violation Corrective Action Plan Template',
    category: 'Templates',
    phase: 2,
    tags: ['Template', 'Hours of Service', 'HOS', 'Corrective Action', 'ELD'],
    seo_description: 'Corrective action plan template for Hours of Service violations. Document your response to HOS citations, ELD issues, and driver log violations with this structured CAP template for fleet safety managers.',
    cta_primary: 'Generate a Corrective Action Plan in Axesntra',
    featured: false,
    body: '',
  },

  // ── PHASE 3 (frontmatter only) ────────────────────────────────────────────

  {
    slug: 'ai-reduce-repeat-dot-violations',
    title: 'How AI Can Help Safety Managers Reduce Repeat DOT Violations',
    headline: 'How AI Can Help Safety Managers Reduce Repeat DOT Violations',
    category: 'AI Safety Advisor',
    phase: 3,
    tags: ['AI', 'Safety Manager', 'DOT Violations', 'Fleet Compliance', 'Prevention'],
    seo_description: 'How AI tools help fleet safety managers identify patterns in DOT violations, generate corrective action plans, and prevent repeat violations — a practical guide for compliance teams.',
    cta_primary: 'Try the AI Safety Advisor',
    featured: false,
    body: '',
  },
  {
    slug: 'using-ai-to-analyze-fmcsa-inspection-data',
    title: 'Using AI to Analyze FMCSA Inspection Data: A Guide for Fleet Safety Teams',
    headline: 'Using AI to Analyze FMCSA Inspection Data',
    category: 'AI Safety Advisor',
    phase: 3,
    tags: ['AI', 'FMCSA Data', 'Inspection Analysis', 'CSA', 'Fleet Safety'],
    seo_description: 'How fleet safety teams can use AI to analyze FMCSA inspection data, identify violation trends, interpret CSA BASIC scores, and take targeted corrective action — a practical guide.',
    cta_primary: 'Try the AI Safety Advisor',
    featured: false,
    body: '',
  },
  {
    slug: 'ai-generate-corrective-action-plans-dot-violations',
    title: 'How AI Can Generate Corrective Action Plans for DOT Violations',
    headline: 'How AI Can Generate Corrective Action Plans for DOT Violations',
    category: 'AI Safety Advisor',
    phase: 3,
    tags: ['AI', 'Corrective Action Plan', 'DOT Violations', 'Automation', 'Fleet Compliance'],
    seo_description: 'How AI tools can automatically generate corrective action plans for DOT violations — reducing documentation time, ensuring consistency, and creating audit-ready files faster than manual processes.',
    cta_primary: 'Try the AI Safety Advisor',
    featured: false,
    body: '',
  },
  {
    slug: 'ai-safety-advisor-fleet-compliance-teams',
    title: 'AI Safety Advisor for Fleet Compliance Teams: What It Does and How It Helps',
    headline: 'AI Safety Advisor for Fleet Compliance Teams',
    category: 'AI Safety Advisor',
    phase: 3,
    tags: ['AI Safety Advisor', 'Fleet Compliance', 'Safety Management', 'Axesntra'],
    seo_description: 'What an AI Safety Advisor does for fleet compliance teams — analyzing violations, generating corrective action plans, monitoring CSA scores, and preparing for FMCSA audits. A practical overview for safety managers.',
    cta_primary: 'Try the AI Safety Advisor',
    featured: false,
    body: '',
  },
  {
    slug: '392-2-traffic-law-violations',
    title: 'What Does 392.2 Mean? DOT Traffic Law Violation Explained',
    headline: 'What Does 392.2 Mean? (Traffic Law Violations)',
    category: 'Violation Guide',
    phase: 3,
    tags: ['Unsafe Driving', '392.2', 'Traffic Violation', 'CSA', 'Speeding'],
    seo_description: 'Learn what DOT violation 392.2 means, how it affects your CSA Unsafe Driving BASIC score, and what corrective action fleet safety managers should take after a traffic law citation.',
    cta_primary: 'Get a Free Violation Review',
    featured: false,
    body: '',
  },
  {
    slug: 'how-to-fix-csa-score',
    title: 'How to Fix Your CSA Score: A Fleet Safety Manager\'s Guide',
    headline: 'How to Fix Your CSA Score',
    category: 'CSA BASICs',
    phase: 3,
    tags: ['CSA Score', 'BASIC', 'Fix', 'Improve', 'Fleet Safety'],
    seo_description: 'Practical guide for fleet safety managers on how to improve an elevated CSA score — from addressing specific violations and filing DataQs challenges to implementing preventive programs that build long-term BASIC score improvement.',
    cta_primary: 'Analyze My CSA Score',
    featured: false,
    body: '',
  },
  {
    slug: 'responding-to-vehicle-maintenance-basic-alert',
    title: 'Responding to a Vehicle Maintenance BASIC Alert: A Step-by-Step Guide',
    headline: 'Responding to a Vehicle Maintenance BASIC Alert',
    category: 'CSA BASICs',
    phase: 3,
    tags: ['Vehicle Maintenance', 'BASIC Alert', 'CSA', 'Intervention', 'Corrective Action'],
    seo_description: 'What to do when your fleet receives a Vehicle Maintenance BASIC alert from FMCSA — step-by-step response guide for safety managers including score analysis, corrective action, and investigation risk reduction.',
    cta_primary: 'Analyze My Vehicle Maintenance BASIC',
    featured: false,
    body: '',
  },
];
