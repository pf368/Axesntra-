import { mockCarriers } from './mock-carriers';
import { CarrierBrief, CarrierListItem, CarrierTrends, ApiResponse, CarrierLookupResult } from './types';
import { getPublicCarrierProfileByUsdot, getPublicSmsSummary } from './public-fmcsa-service';
import { buildHybridCarrierBrief } from './hybrid-assembly-service';

const isDev = process.env.NODE_ENV === 'development';

export function getAllCarriers(): CarrierListItem[] {
  return mockCarriers.map((carrier) => ({
    id: carrier.id,
    carrierName: carrier.carrierName,
    usdot: carrier.usdot,
    overallRisk: carrier.overallRisk,
    trend: carrier.trend,
  }));
}

export async function getCarrierByUsdot(usdot: string): Promise<CarrierLookupResult> {
  if (isDev) console.log('[Carrier Service] Looking up USDOT:', usdot);

  const mockCarrier = mockCarriers.find((c) => c.usdot === usdot);

  if (mockCarrier) {
    if (isDev) console.log('[Carrier Service] Found in mock database, skipping public lookup');
    return {
      status: 'success',
      brief: mockCarrier,
      lookupStatus: 'Using demonstration data'
    };
  }

  const lookupResult = await getPublicCarrierProfileByUsdot(usdot);

  if (lookupResult.success && lookupResult.profile) {
    if (isDev) console.log('[Carrier Service] Public lookup succeeded');

    try {
      const smsData = await getPublicSmsSummary(usdot);
      const hybridBrief = buildHybridCarrierBrief(lookupResult.profile, smsData || undefined);

      return {
        status: 'success',
        brief: hybridBrief,
        lookupStatus: 'Live public FMCSA data retrieved successfully'
      };
    } catch (smsError) {
      if (isDev) console.log('[Carrier Service] SMS fetch failed, using profile only');

      const hybridBrief = buildHybridCarrierBrief(lookupResult.profile);

      return {
        status: 'success',
        brief: hybridBrief,
        lookupStatus: 'Carrier profile retrieved, SMS data unavailable'
      };
    }
  }

  if (lookupResult.error === 'not_found') {
    if (isDev) console.log('[Carrier Service] Carrier not found in public records');

    return {
      status: 'not_found',
      message: lookupResult.message || 'Carrier not found in public FMCSA records',
      usdot
    };
  }

  if (lookupResult.error === 'fetch_failed' || lookupResult.error === 'timeout' || lookupResult.error === 'blocked') {
    if (isDev) console.log('[Carrier Service] Source unavailable:', lookupResult.error);

    return {
      status: 'source_unavailable',
      message: lookupResult.message || 'Public FMCSA source temporarily unavailable',
      usdot
    };
  }

  if (lookupResult.error === 'parse_failed') {
    if (isDev) console.log('[Carrier Service] Parse failed');

    if (lookupResult.partialProfile) {
      if (isDev) console.log('[Carrier Service] Using partial profile data');
      try {
        const hybridBrief = buildHybridCarrierBrief(lookupResult.partialProfile);
        hybridBrief.sourceNotes = [
          'Partial public data extracted from FMCSA source',
          'Some fields could not be parsed and use fallback values',
          ...(hybridBrief.sourceNotes || [])
        ];

        return {
          status: 'success',
          brief: hybridBrief,
          lookupStatus: 'parse_failed'
        };
      } catch (buildError) {
        if (isDev) console.log('[Carrier Service] Failed to build brief from partial data');
      }
    }

    return {
      status: 'parse_failed',
      message: lookupResult.message || 'Could not parse public source response',
      usdot
    };
  }

  return {
    status: 'not_found',
    message: 'No carrier found with this USDOT number',
    usdot
  };
}

export function getCarrierByUsdotSync(usdot: string): CarrierBrief | null {
  return mockCarriers.find((c) => c.usdot === usdot) || null;
}

export function getCarrierById(id: string): CarrierBrief | null {
  return mockCarriers.find((c) => c.id === id) || null;
}

export function getCarrierTrends(usdot: string): CarrierTrends | null {
  const carrier = mockCarriers.find((c) => c.usdot === usdot);
  if (!carrier) return null;

  return {
    usdot: carrier.usdot,
    trendData: carrier.trendData,
    trend: carrier.trend,
    trendSummary: carrier.trendSummary,
  };
}

export function searchCarriers(query: string): CarrierListItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return mockCarriers
    .filter(
      (carrier) =>
        carrier.usdot.includes(normalizedQuery) ||
        carrier.carrierName.toLowerCase().includes(normalizedQuery) ||
        carrier.mc.includes(normalizedQuery)
    )
    .map((carrier) => ({
      id: carrier.id,
      carrierName: carrier.carrierName,
      usdot: carrier.usdot,
      overallRisk: carrier.overallRisk,
      trend: carrier.trend,
    }));
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return { data, status: 200 };
}

export function createErrorResponse(error: string, status: number = 404): ApiResponse<never> {
  return { error, status };
}
