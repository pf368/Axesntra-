/**
 * SMS Inspection Scraper
 *
 * Scrapes the FMCSA Safety Measurement System (SMS) web pages to extract
 * inspection history and violation details across all BASIC categories.
 *
 * Pages scraped:
 *   - ai.fmcsa.dot.gov/SMS/Carrier/{usdot}/BASIC/{BasicSlug}.aspx (6 BASICs)
 *   - ai.fmcsa.dot.gov/SMS/Event/Inspection/{inspectionId}.aspx
 *
 * Rate-limited and cached (1-hour TTL) to be respectful of FMCSA servers.
 */

import * as cheerio from 'cheerio';
import {
  InspectionRecord,
  ViolationDetail,
  VehicleInfo,
  InspectionWithViolations,
  SMSInspectionResult,
} from './types';

// ── BASIC category definitions ──

export const BASIC_PAGES: { slug: string; category: string }[] = [
  { slug: 'UnsafeDriving', category: 'Unsafe Driving' },
  { slug: 'HOSCompliance', category: 'HOS Compliance' },
  { slug: 'VehicleMaint', category: 'Vehicle Maintenance' },
  { slug: 'ControlledSubstances', category: 'Controlled Substances' },
  { slug: 'HazMat', category: 'Hazmat Compliance' },
  { slug: 'DriverFitness', category: 'Driver Fitness' },
];

const SMS_BASE = 'https://ai.fmcsa.dot.gov/SMS';
const isDev = process.env.NODE_ENV === 'development';

// ── Cache ──

const cache = new Map<string, { data: SMSInspectionResult; expires: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCached(key: string): SMSInspectionResult | null {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.data;
  if (entry) cache.delete(key);
  return null;
}

function setCache(key: string, data: SMSInspectionResult) {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

// ── Fetch utility ──

async function fetchPage(url: string, timeoutMs = 15000): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      if (isDev) console.log(`[SMS Scraper] HTTP ${response.status} for ${url}`);
      return null;
    }

    const html = await response.text();
    if (html.length < 200) return null;
    return html;
  } catch (error) {
    clearTimeout(timeout);
    if (isDev) console.log(`[SMS Scraper] Fetch error for ${url}:`, error);
    return null;
  }
}

// ── Inspection list parser ──

function parseInspectionList(html: string): {
  inspections: InspectionRecord[];
  basicPercentile?: number;
} {
  const $ = cheerio.load(html);
  const inspections: InspectionRecord[] = [];

  // Try to extract BASIC percentile from the page
  let basicPercentile: number | undefined;
  const percentileText = $('span:contains("Percentile")').text() ||
    $('td:contains("Percentile")').text() ||
    $('div:contains("percentile")').text();
  const percentileMatch = percentileText.match(/(\d+)\s*(?:th|st|nd|rd)?\s*[Pp]ercentile/);
  if (percentileMatch) {
    basicPercentile = parseInt(percentileMatch[1], 10);
  }

  // Parse inspection table rows
  // The SMS page uses tables with inspection data — look for rows with report numbers
  $('table tr, .table tr, #tblInspections tr, .dataTable tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 4) return; // Skip header rows or rows with too few cells

    const rowText = cells.map((__, cell) => $(cell).text().trim()).get();

    // Look for rows where we can identify inspection data patterns:
    // Typically: Report# | Date | State | Violations | Severity | OOS
    // Or some subset thereof

    // Try to find a report number (alphanumeric, often state prefix + numbers)
    const reportCell = cells.eq(0);
    const reportNumber = reportCell.text().trim();

    // Skip if first cell doesn't look like a report number
    if (!reportNumber || reportNumber.length < 5 || /^[A-Z ]+$/i.test(reportNumber)) return;

    // Extract inspection ID from any link in the row
    let inspectionId: string | undefined;
    const link = $(row).find('a[href*="Inspection"]').attr('href');
    if (link) {
      const idMatch = link.match(/Inspection\/(\d+)/);
      if (idMatch) inspectionId = idMatch[1];
    }

    // Parse the remaining cells
    let inspectionDate = '';
    let state = '';
    let violationCount = 0;
    let totalSeverityWeight = 0;
    let oos = false;

    // Try to detect column layout by checking cell content patterns
    for (let i = 0; i < cells.length; i++) {
      const text = $(cells[i]).text().trim();

      // Date pattern (MM/DD/YYYY or similar)
      if (!inspectionDate && /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(text)) {
        inspectionDate = text;
        continue;
      }

      // State abbreviation (2 uppercase letters)
      if (!state && /^[A-Z]{2}$/.test(text)) {
        state = text;
        continue;
      }

      // OOS indicator
      if (/^(yes|y|oos)$/i.test(text)) {
        oos = true;
        continue;
      }
      if (/^(no|n)$/i.test(text) && i > 2) {
        // "No" in later columns likely means not OOS
        continue;
      }

      // Numeric values — could be violation count or severity
      if (/^\d+$/.test(text)) {
        const num = parseInt(text, 10);
        if (i > 0 && !violationCount && num < 50) {
          violationCount = num;
        } else if (violationCount > 0 && !totalSeverityWeight) {
          totalSeverityWeight = num;
        }
      }
    }

    // Only add if we have a reasonable inspection record
    if (inspectionDate || inspectionId) {
      inspections.push({
        reportNumber,
        inspectionDate,
        state,
        violationCount,
        totalSeverityWeight,
        oos,
        inspectionId,
      });
    }
  });

  // Fallback: try regex-based extraction if cheerio table parsing found nothing
  if (inspections.length === 0) {
    if (isDev) console.log('[SMS Scraper] Table parsing found 0 inspections, trying regex fallback');

    // Look for inspection links with IDs
    const inspLinkRegex = /Inspection\/(\d+)\.aspx[^>]*>([^<]+)/g;
    let match;
    while ((match = inspLinkRegex.exec(html)) !== null) {
      const id = match[1];
      const linkText = match[2].trim();

      // Try to find surrounding context for date, state, etc.
      const contextStart = Math.max(0, match.index - 500);
      const contextEnd = Math.min(html.length, match.index + 500);
      const context = html.substring(contextStart, contextEnd);

      const dateMatch = context.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
      const stateMatch = context.match(/>([A-Z]{2})</);

      inspections.push({
        reportNumber: linkText || id,
        inspectionDate: dateMatch ? dateMatch[1] : '',
        state: stateMatch ? stateMatch[1] : '',
        violationCount: 0,
        totalSeverityWeight: 0,
        oos: false,
        inspectionId: id,
      });
    }
  }

  if (isDev) console.log(`[SMS Scraper] Parsed ${inspections.length} inspections`);
  return { inspections, basicPercentile };
}

// ── Vehicle info parser ──

function parseVehicleInfo($: cheerio.CheerioAPI): VehicleInfo[] {
  const vehicles: VehicleInfo[] = [];

  // Look for the Vehicle Information table
  $('table').each((_, table) => {
    const headerText = $(table).prev().text() + ' ' + $(table).find('th, td.header').text();
    if (!/vehicle\s*information/i.test(headerText)) return;

    $(table).find('tr').each((__, row) => {
      const cells = $(row).find('td');
      if (cells.length < 4) return;

      const rowTexts = cells.map((___, cell) => $(cell).text().trim()).get();
      // Typical layout: Unit | Type | Make | Plate State | Plate Number | VIN
      const unitNum = parseInt(rowTexts[0], 10);
      if (isNaN(unitNum)) return;

      vehicles.push({
        unit: unitNum,
        type: rowTexts[1] || '',
        make: rowTexts[2] || '',
        plateState: rowTexts[3] || '',
        plateNumber: rowTexts[4] || '',
        vin: rowTexts[5] || '',
      });
    });
  });

  return vehicles;
}

// ── Inspection metadata parser ──

function parseInspectionMetadata($: cheerio.CheerioAPI): {
  level?: string;
  facility?: string;
} {
  let level: string | undefined;
  let facility: string | undefined;

  // Look for Level and Facility in the inspection detail page
  $('td, th').each((_, el) => {
    const text = $(el).text().trim();
    if (/^Level:/i.test(text) || text === 'Level') {
      const val = $(el).next('td').text().trim() || $(el).parent().find('td').last().text().trim();
      if (val && val !== text) level = val;
    }
    if (/^Facility:/i.test(text) || text === 'Facility') {
      const val = $(el).next('td').text().trim() || $(el).parent().find('td').last().text().trim();
      if (val && val !== text) facility = val;
    }
  });

  // Regex fallback
  if (!level) {
    const m = $('body').html()?.match(/Level[:\s]*<[^>]*>([^<]+)/i);
    if (m) level = m[1].trim();
  }
  if (!facility) {
    const m = $('body').html()?.match(/Facility[:\s]*<[^>]*>([^<]+)/i);
    if (m) facility = m[1].trim();
  }

  return { level, facility };
}

// ── Individual inspection detail parser ──

function parseInspectionDetail(
  html: string,
  base: InspectionRecord,
  basicCategory = 'Vehicle Maintenance'
): InspectionWithViolations {
  const $ = cheerio.load(html);
  const violations: ViolationDetail[] = [];

  // Extract vehicle info and metadata
  const vehicles = parseVehicleInfo($);
  const metadata = parseInspectionMetadata($);

  // Parse violation table rows
  $('table tr, .table tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 3) return;

    const rowTexts = cells.map((__, cell) => $(cell).text().trim()).get();

    // Look for CFR code pattern (e.g., "393.45(b)(1)" or "392.2")
    let code = '';
    let description = '';
    let severityWeight = 0;
    let timeWeight = 0;
    let violOos = false;
    let violBasic = '';

    for (const text of rowTexts) {
      // CFR code
      if (!code && /^\d{3}\.\d+/.test(text)) {
        code = text;
        continue;
      }
      // Severity weight (1-10, plus potential +2 OOS bonus)
      if (code && !severityWeight && /^\d{1,2}$/.test(text)) {
        const num = parseInt(text, 10);
        if (num <= 12) {
          severityWeight = num;
          continue;
        }
      }
      // Time weight (1, 2, or 3)
      if (code && severityWeight && !timeWeight && /^[123]$/.test(text)) {
        timeWeight = parseInt(text, 10);
        continue;
      }
      // OOS
      if (/^(yes|y|oos)$/i.test(text)) {
        violOos = true;
        continue;
      }
      // BASIC category from table cell (e.g., "Unsafe Driving", "Vehicle Maintenance")
      if (code && !violBasic && BASIC_PAGES.some((b) => text === b.category)) {
        violBasic = text;
        continue;
      }
      // Description (longer text, not a number)
      if (code && !description && text.length > 10 && !/^\d+$/.test(text)) {
        description = text;
      }
    }

    if (code) {
      violations.push({
        code,
        description: description || `Violation ${code}`,
        severityWeight,
        timeWeight,
        oos: violOos,
        basicCategory: violBasic || basicCategory,
      });
    }
  });

  // Regex fallback for violations
  if (violations.length === 0) {
    const violRegex = /(\d{3}\.\d+(?:\([^)]+\))*)\s*[-–]\s*([^<\n]+)/g;
    let match;
    while ((match = violRegex.exec(html)) !== null) {
      violations.push({
        code: match[1],
        description: match[2].trim(),
        severityWeight: 0,
        timeWeight: 0,
        oos: false,
        basicCategory,
      });
    }
  }

  // Update the base record's violation count if we found more
  const updatedBase = { ...base };
  if (violations.length > 0 && updatedBase.violationCount === 0) {
    updatedBase.violationCount = violations.length;
  }
  const oosViolations = violations.filter((v) => v.oos);
  if (oosViolations.length > 0) {
    updatedBase.oos = true;
  }

  if (isDev) console.log(`[SMS Scraper] Parsed ${violations.length} violations for inspection ${base.reportNumber}`);

  return {
    ...updatedBase,
    violations,
    vehicles: vehicles.length > 0 ? vehicles : undefined,
    level: metadata.level,
    facility: metadata.facility,
  };
}

// ── Public API ──

/**
 * Fetch inspections for a single BASIC category.
 */
export async function fetchBasicInspections(
  usdot: string,
  basicSlug: string,
  basicCategory: string
): Promise<SMSInspectionResult> {
  const cleanUsdot = usdot.replace(/\D/g, '');
  const cacheKey = `${basicSlug}-${cleanUsdot}`;

  const cached = getCached(cacheKey);
  if (cached) {
    if (isDev) console.log(`[SMS Scraper] Cache hit for ${basicCategory}`, cleanUsdot);
    return cached;
  }

  if (isDev) console.log(`[SMS Scraper] Fetching ${basicCategory} inspections for`, cleanUsdot);

  const url = `${SMS_BASE}/Carrier/${cleanUsdot}/BASIC/${basicSlug}.aspx`;
  const html = await fetchPage(url);

  if (!html) {
    return {
      success: false,
      error: `Failed to fetch SMS ${basicCategory} page`,
    };
  }

  const { inspections, basicPercentile } = parseInspectionList(html);

  // Tag each inspection with its BASIC category
  for (const insp of inspections) {
    insp.basicCategory = basicCategory;
  }

  const result: SMSInspectionResult = {
    success: true,
    inspections,
    totalCount: inspections.length,
    basicPercentile,
  };

  setCache(cacheKey, result);
  return result;
}

/** Backwards-compatible wrapper. */
export async function fetchVehicleMaintenanceInspections(
  usdot: string
): Promise<SMSInspectionResult> {
  return fetchBasicInspections(usdot, 'VehicleMaint', 'Vehicle Maintenance');
}

/**
 * Fetch inspections across ALL BASIC categories (rate-limited, sequential).
 * Deduplicates by reportNumber — an inspection may appear under multiple BASICs.
 */
export async function fetchAllBasicInspections(
  usdot: string
): Promise<{ inspections: InspectionRecord[]; basicPercentiles: Record<string, number | undefined> }> {
  const cleanUsdot = usdot.replace(/\D/g, '');
  const allInspections = new Map<string, InspectionRecord>();
  const basicPercentiles: Record<string, number | undefined> = {};

  for (let i = 0; i < BASIC_PAGES.length; i++) {
    const { slug, category } = BASIC_PAGES[i];

    // Rate limit: 1s delay between requests (except first)
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const result = await fetchBasicInspections(cleanUsdot, slug, category);
    basicPercentiles[category] = result.basicPercentile;

    if (result.success && result.inspections) {
      for (const insp of result.inspections) {
        const key = insp.reportNumber || insp.inspectionId || `${insp.inspectionDate}-${insp.state}`;
        if (!allInspections.has(key)) {
          allInspections.set(key, insp);
        }
      }
    }
  }

  return {
    inspections: Array.from(allInspections.values()),
    basicPercentiles,
  };
}

export async function fetchInspectionViolations(
  inspectionId: string,
  basicCategory = 'Vehicle Maintenance'
): Promise<InspectionWithViolations | null> {
  const url = `${SMS_BASE}/Event/Inspection/${inspectionId}.aspx`;
  const html = await fetchPage(url);

  if (!html) return null;

  const base: InspectionRecord = {
    reportNumber: inspectionId,
    inspectionDate: '',
    state: '',
    violationCount: 0,
    totalSeverityWeight: 0,
    oos: false,
    inspectionId,
  };

  return parseInspectionDetail(html, base, basicCategory);
}

export async function fetchFullInspectionHistory(
  usdot: string,
  maxDetailFetches = 5
): Promise<SMSInspectionResult> {
  const cleanUsdot = usdot.replace(/\D/g, '');
  const cacheKey = `full-${cleanUsdot}`;

  const cached = getCached(cacheKey);
  if (cached) {
    if (isDev) console.log('[SMS Scraper] Full history cache hit for', cleanUsdot);
    return cached;
  }

  // Step 1: Get inspection lists from ALL BASIC categories
  const { inspections: allListInspections, basicPercentiles } =
    await fetchAllBasicInspections(cleanUsdot);

  if (allListInspections.length === 0) {
    // Fall back to Vehicle Maintenance only
    const vmResult = await fetchVehicleMaintenanceInspections(cleanUsdot);
    if (!vmResult.success || !vmResult.inspections?.length) {
      return vmResult;
    }
    return vmResult;
  }

  // Step 2: Fetch top N inspection details (rate-limited)
  const toFetch = allListInspections
    .filter((i) => i.inspectionId)
    .slice(0, maxDetailFetches);

  if (isDev) console.log(`[SMS Scraper] Fetching details for ${toFetch.length} inspections`);

  const detailResults = await Promise.all(
    toFetch.map(async (insp, idx) => {
      await new Promise((resolve) => setTimeout(resolve, idx * 500));
      const detail = await fetchInspectionViolations(
        insp.inspectionId!,
        insp.basicCategory || 'Vehicle Maintenance'
      );
      if (detail) {
        return {
          ...insp,
          ...detail,
          violations: detail.violations,
        };
      }
      return { ...insp, violations: [] as ViolationDetail[] };
    })
  );

  // Merge: inspections with details get violation data, rest stay as-is
  const detailMap = new Map(detailResults.map((d) => [d.inspectionId, d]));
  const allInspections: InspectionWithViolations[] = allListInspections.map((insp) => {
    const detail = insp.inspectionId ? detailMap.get(insp.inspectionId) : undefined;
    return detail || { ...insp, violations: [] };
  });

  // Use Vehicle Maintenance percentile as the primary (backwards compat)
  const primaryPercentile = basicPercentiles['Vehicle Maintenance'];

  const result: SMSInspectionResult = {
    success: true,
    inspections: allListInspections,
    inspectionDetails: allInspections,
    totalCount: allListInspections.length,
    basicPercentile: primaryPercentile,
  };

  setCache(cacheKey, result);
  return result;
}
