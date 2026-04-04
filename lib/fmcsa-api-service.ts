/**
 * FMCSA Web API Service
 *
 * Uses the official FMCSA QC API (mobile.fmcsa.dot.gov) with API key
 * to fetch carrier data. This is the structured JSON API — not HTML scraping.
 *
 * API docs: https://mobile.fmcsa.dot.gov/QCDevsite/docs/qcApi
 */

const FMCSA_API_BASE = 'https://mobile.fmcsa.dot.gov/qc/services';

function getApiKey(): string {
  const key = process.env.FMCSA_API_KEY;
  if (!key) {
    throw new Error('FMCSA_API_KEY not set in environment variables');
  }
  return key;
}

export interface FmcsaCarrierRecord {
  // Identity
  dotNumber: number;
  legalName: string;
  dbaName?: string;
  mcNumber?: string;
  // Status
  allowedToOperate: string;        // 'Y' or 'N'
  statusCode: string;              // 'A' = Active
  safetyRating?: string;
  safetyRatingDate?: string;
  // Operations
  carrierOperation?: string;
  operationClassification?: string;
  // Fleet
  totalPowerUnits?: number;
  totalDrivers?: number;
  // Address
  phyStreet?: string;
  phyCity?: string;
  phyState?: string;
  phyZipcode?: string;
  phyCountry?: string;
  // Dates
  mcs150FormDate?: string;
  addDate?: string;
  // Inspections / safety
  crashTotal?: number;
  driverInsp?: number;
  driverOosInsp?: number;
  driverOosRate?: number;
  vehicleInsp?: number;
  vehicleOosInsp?: number;
  vehicleOosRate?: number;
  hazmatInsp?: number;
  hazmatOosInsp?: number;
  hazmatOosRate?: number;
  // BASIC scores (from /basics endpoint)
  basicScores?: FmcsaBasicScore[];
}

export interface FmcsaBasicScore {
  basicName: string;
  measure: number;
  percentile: number;
  threshold: number;
  exceedThreshold: boolean;
}

export interface FmcsaApiResult {
  success: boolean;
  carrier?: FmcsaCarrierRecord;
  error?: string;
}

const isDev = process.env.NODE_ENV === 'development';

export async function fetchCarrierFromFmcsaApi(usdot: string): Promise<FmcsaApiResult> {
  const cleanUsdot = usdot.replace(/\D/g, '');
  if (!cleanUsdot) {
    return { success: false, error: 'Invalid USDOT number' };
  }

  try {
    const apiKey = getApiKey();
    const url = `${FMCSA_API_BASE}/carriers/${cleanUsdot}?webKey=${apiKey}`;

    if (isDev) console.log('[FMCSA API] Fetching carrier:', cleanUsdot);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      if (isDev) console.log('[FMCSA API] HTTP error:', response.status);
      if (response.status === 404) {
        return { success: false, error: 'Carrier not found in FMCSA records' };
      }
      return { success: false, error: `FMCSA API returned ${response.status}` };
    }

    const data = await response.json();

    // The API wraps the result in a content array
    const content = data?.content;
    const record = Array.isArray(content) ? content[0]?.carrier : content?.carrier;

    if (!record) {
      if (isDev) console.log('[FMCSA API] No carrier record in response');
      return { success: false, error: 'No carrier data in API response' };
    }

    const carrier: FmcsaCarrierRecord = {
      dotNumber: record.dotNumber,
      legalName: record.legalName || '',
      dbaName: record.dbaName,
      mcNumber: record.mcNumber,
      allowedToOperate: record.allowedToOperate || 'N',
      statusCode: record.statusCode || '',
      safetyRating: record.safetyRating,
      safetyRatingDate: record.safetyRatingDate,
      carrierOperation: record.carrierOperation,
      operationClassification: record.operationClassification,
      totalPowerUnits: record.totalPowerUnits,
      totalDrivers: record.totalDrivers,
      phyStreet: record.phyStreet,
      phyCity: record.phyCity,
      phyState: record.phyState,
      phyZipcode: record.phyZipcode,
      phyCountry: record.phyCountry,
      mcs150FormDate: record.mcs150FormDate,
      addDate: record.addDate,
      crashTotal: record.crashTotal,
      driverInsp: record.driverInsp,
      driverOosInsp: record.driverOosInsp,
      driverOosRate: record.driverOosRate,
      vehicleInsp: record.vehicleInsp,
      vehicleOosInsp: record.vehicleOosInsp,
      vehicleOosRate: record.vehicleOosRate,
      hazmatInsp: record.hazmatInsp,
      hazmatOosInsp: record.hazmatOosInsp,
      hazmatOosRate: record.hazmatOosRate,
    };

    if (isDev) console.log('[FMCSA API] Success:', carrier.legalName);

    // Try to fetch BASIC scores
    try {
      const basicsUrl = `${FMCSA_API_BASE}/carriers/${cleanUsdot}/basics?webKey=${apiKey}`;
      const basicsResp = await fetch(basicsUrl, {
        headers: { Accept: 'application/json' },
      });
      if (basicsResp.ok) {
        const basicsData = await basicsResp.json();
        const basicsContent = basicsData?.content;
        if (Array.isArray(basicsContent)) {
          carrier.basicScores = basicsContent.map((b: Record<string, unknown>) => ({
            basicName: (b.basicsName || b.basicName || '') as string,
            measure: (b.basicsValue || b.measure || 0) as number,
            percentile: (b.basicsPercentile || b.percentile || 0) as number,
            threshold: (b.basicsThreshold || b.threshold || 0) as number,
            exceedThreshold: ((b.basicsExceedThreshold || b.exceedThreshold) === 'Y' || (b.basicsExceedThreshold || b.exceedThreshold) === true) as boolean,
          }));
          if (isDev) console.log('[FMCSA API] BASIC scores loaded:', carrier.basicScores.length);
        }
      }
    } catch {
      if (isDev) console.log('[FMCSA API] BASIC scores fetch failed (non-fatal)');
    }

    return { success: true, carrier };
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    if (isDev) console.error('[FMCSA API] Error:', error);
    return {
      success: false,
      error: isTimeout ? 'FMCSA API request timed out' : 'Failed to fetch from FMCSA API',
    };
  }
}
