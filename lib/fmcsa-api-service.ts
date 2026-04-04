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
  fatalCrash?: number;
  injCrash?: number;
  towawayCrash?: number;
  driverInsp?: number;
  driverOosInsp?: number;
  driverOosRate?: number;
  driverOosRateNationalAverage?: string;
  vehicleInsp?: number;
  vehicleOosInsp?: number;
  vehicleOosRate?: number;
  vehicleOosRateNationalAverage?: string;
  hazmatInsp?: number;
  hazmatOosInsp?: number;
  hazmatOosRate?: number;
  hazmatOosRateNationalAverage?: string;
  // Insurance
  bipdInsuranceOnFile?: string;
  bipdRequiredAmount?: string;
  // BASIC scores (from /basics endpoint)
  basicScores?: FmcsaBasicScore[];
  // Sub-endpoint data
  cargoCarried?: string[];
  operationClasses?: string[];
  authorityDetails?: { type: string; status: string }[];
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

    // Helper: FMCSA API sometimes returns objects instead of primitives
    const str = (val: unknown): string | undefined => {
      if (val == null) return undefined;
      if (typeof val === 'string') return val;
      if (typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        // Try common desc/code patterns from FMCSA API
        return (obj.desc || obj.description || obj.code || obj.name || Object.values(obj).find(v => typeof v === 'string') || JSON.stringify(val)) as string;
      }
      return String(val);
    };

    const carrier: FmcsaCarrierRecord = {
      dotNumber: record.dotNumber,
      legalName: str(record.legalName) || '',
      dbaName: str(record.dbaName),
      mcNumber: str(record.mcNumber),
      allowedToOperate: str(record.allowedToOperate) || 'N',
      statusCode: str(record.statusCode) || '',
      safetyRating: str(record.safetyRating),
      safetyRatingDate: str(record.safetyRatingDate),
      carrierOperation: typeof record.carrierOperation === 'string'
        ? record.carrierOperation
        : record.carrierOperation?.carrierOperationDesc || record.carrierOperation?.carrierOperationCode || undefined,
      operationClassification: typeof record.operationClassification === 'string'
        ? record.operationClassification
        : record.operationClassification?.operationClassificationDesc || record.operationClassification?.operationClassificationCode || undefined,
      totalPowerUnits: typeof record.totalPowerUnits === 'number' ? record.totalPowerUnits : parseInt(record.totalPowerUnits) || undefined,
      totalDrivers: typeof record.totalDrivers === 'number' ? record.totalDrivers : parseInt(record.totalDrivers) || undefined,
      phyStreet: str(record.phyStreet),
      phyCity: str(record.phyCity),
      phyState: str(record.phyState),
      phyZipcode: str(record.phyZipcode),
      phyCountry: str(record.phyCountry),
      mcs150FormDate: str(record.mcs150FormDate),
      addDate: str(record.addDate),
      crashTotal: record.crashTotal,
      fatalCrash: record.fatalCrash,
      injCrash: record.injCrash,
      towawayCrash: record.towawayCrash,
      driverInsp: record.driverInsp,
      driverOosInsp: record.driverOosInsp,
      driverOosRate: record.driverOosRate,
      driverOosRateNationalAverage: str(record.driverOosRateNationalAverage),
      vehicleInsp: record.vehicleInsp,
      vehicleOosInsp: record.vehicleOosInsp,
      vehicleOosRate: record.vehicleOosRate,
      vehicleOosRateNationalAverage: str(record.vehicleOosRateNationalAverage),
      hazmatInsp: record.hazmatInsp,
      hazmatOosInsp: record.hazmatOosInsp,
      hazmatOosRate: record.hazmatOosRate,
      hazmatOosRateNationalAverage: str(record.hazmatOosRateNationalAverage),
      bipdInsuranceOnFile: str(record.bipdInsuranceOnFile),
      bipdRequiredAmount: str(record.bipdRequiredAmount),
    };

    if (isDev) console.log('[FMCSA API] Success:', carrier.legalName);

    // Fetch all sub-endpoints in parallel (all non-fatal)
    const subFetcher = async (path: string) => {
      try {
        const resp = await fetch(`${FMCSA_API_BASE}/carriers/${cleanUsdot}/${path}?webKey=${apiKey}`, {
          headers: { Accept: 'application/json' },
        });
        if (resp.ok) return await resp.json();
      } catch { /* non-fatal */ }
      return null;
    };

    const [basicsData, cargoData, opsData, authData] = await Promise.all([
      subFetcher('basics'),
      subFetcher('cargo-carried'),
      subFetcher('operation-classification'),
      subFetcher('authority'),
    ]);

    // BASIC scores
    if (basicsData) {
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

    // Cargo carried
    if (cargoData) {
      const cargoContent = cargoData?.content;
      if (Array.isArray(cargoContent)) {
        carrier.cargoCarried = cargoContent
          .map((c: Record<string, unknown>) => str(c.cargoClassDesc) || str(c.cargoDesc) || str(c.description) || '')
          .filter((s: string) => s.length > 0);
        if (isDev) console.log('[FMCSA API] Cargo carried loaded:', carrier.cargoCarried.length);
      }
    }

    // Operation classification
    if (opsData) {
      const opsContent = opsData?.content;
      if (Array.isArray(opsContent)) {
        carrier.operationClasses = opsContent
          .map((o: Record<string, unknown>) => str(o.operationClassDesc) || str(o.operationClassificationDesc) || str(o.description) || '')
          .filter((s: string) => s.length > 0);
        if (isDev) console.log('[FMCSA API] Operation classes loaded:', carrier.operationClasses.length);
      }
    }

    // Authority
    if (authData) {
      const authContent = authData?.content;
      if (Array.isArray(authContent)) {
        carrier.authorityDetails = authContent.map((a: Record<string, unknown>) => ({
          type: str(a.authorityType) || str(a.authTypDesc) || 'Unknown',
          status: str(a.authorityStatus) || str(a.authStatusDesc) || 'Unknown',
        }));
        if (isDev) console.log('[FMCSA API] Authority details loaded:', carrier.authorityDetails.length);
      }
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
