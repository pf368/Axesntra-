export interface PublicCarrierProfile {
  carrierName?: string;
  usdot: string;
  mc?: string;
  status?: string;
  operationType?: string;
  powerUnits?: number;
  drivers?: number;
  mcs150Updated?: string;
  physicalAddress?: string;
  phoneNumber?: string;
  safetyRating?: string;
  totalInspections?: number;
  totalCrashes?: number;
  oosRate?: number;
}

export interface PublicLookupResult {
  success: boolean;
  profile?: PublicCarrierProfile;
  partialProfile?: PublicCarrierProfile;
  error?: 'not_found' | 'fetch_failed' | 'parse_failed' | 'blocked' | 'timeout';
  statusCode?: number;
  message?: string;
  rawContentLength?: number;
  isPartial?: boolean;
}

export interface PublicSMSData {
  vehicleOOS?: number;
  driverOOS?: number;
  inspections?: number;
  crashes?: number;
}

async function fetchWithTimeout(url: string, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

function parseCompanySnapshot(html: string, usdot: string, isDev: boolean = false): PublicCarrierProfile | null {
  try {
    const profile: PublicCarrierProfile = { usdot };
    const fieldsFound: string[] = [];
    const extractionDetails: Record<string, string> = {};

    // Helper function to try multiple extraction patterns
    const tryExtract = (field: string, patterns: RegExp[]): string | null => {
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          let value = match[1].trim();
          // Clean up HTML entities
          value = value.replace(/&nbsp;/g, '').trim();
          if (value && value !== '') {
            extractionDetails[field] = `Matched pattern: ${pattern.source.substring(0, 50)}...`;
            return value;
          }
        }
      }
      return null;
    };

    // Extract Legal Name
    const legalName = tryExtract('carrierName', [
      /Legal Name[:\s]*<\/[^>]+>\s*<[^>]+>([^<]+)/i,
      /Legal Name:<\/A><\/TH>\s*<TD[^>]*>([^<]+)/i,
      /Legal Name:\s*<\/[^>]+>\s*<TD[^>]*>([^<]+)/i,
      /Legal Name[:\s]*([A-Z][A-Z0-9\s&,.\-']+(?:LLC|INC|CORP|LTD|CO|COMPANY))/i
    ]);
    if (legalName) {
      profile.carrierName = legalName;
      fieldsFound.push('carrierName');
    }

    // Try DBA Name if Legal Name not found
    if (!profile.carrierName) {
      const dbaName = tryExtract('carrierName (DBA)', [
        /DBA Name[:\s]*<\/[^>]+>\s*<[^>]+>([^<]+)/i,
        /DBA Name:<\/A><\/TH>\s*<TD[^>]*>([^<]+)/i
      ]);
      if (dbaName) {
        profile.carrierName = dbaName;
        fieldsFound.push('carrierName (DBA)');
      }
    }

    // Extract USDOT Status
    const status = tryExtract('status', [
      /USDOT Status[:\s]*<\/[^>]+>\s*<[^>]*>(ACTIVE|INACTIVE|OUT-OF-SERVICE|OUT OF SERVICE)/i,
      /USDOT Status:<\/A><\/TH>\s*<TD[^>]*>\s*(?:<!--[^>]*-->)?\s*(ACTIVE|INACTIVE|OUT-OF-SERVICE|OUT OF SERVICE)/i,
      /USDOT Status:\s*<\/[^>]+>\s*<TD[^>]*>([^<]+)/i
    ]);
    if (status) {
      const statusText = status.toUpperCase().trim();
      if (statusText.includes('ACTIVE')) {
        profile.status = 'Active';
      } else if (statusText.includes('INACTIVE')) {
        profile.status = 'Inactive';
      } else if (statusText.includes('OUT')) {
        profile.status = 'Out of Service';
      } else {
        profile.status = statusText;
      }
      fieldsFound.push('status');
    }

    // Extract MC/MX Number
    const mc = tryExtract('mc', [
      /(?:MC|MX)[#\s-]*(\d{6,7})/i
    ]);
    if (mc) {
      profile.mc = mc;
      fieldsFound.push('mc');
    }

    // Extract MCS-150 Form Date
    const mcs150 = tryExtract('mcs150Updated', [
      /MCS-?150\s+Form Date[:\s]*<\/[^>]+>\s*<[^>]*>([0-9\/]+)/i,
      /MCS-?150\s+Form Date:<\/A><\/TH>\s*<TD[^>]*>([0-9\/]+)/i,
      /MCS-?150\s+Form Date:\s*([0-9\/]+)/i
    ]);
    if (mcs150) {
      profile.mcs150Updated = mcs150;
      fieldsFound.push('mcs150Updated');
    }

    // Extract Power Units
    const powerUnits = tryExtract('powerUnits', [
      /Power Units?[:\s]*<\/[^>]+>\s*<[^>]*>(\d+)/i,
      /Power Units?:<\/A><\/TH>\s*<TD[^>]*>(\d+)/i,
      /Power Units?:\s*(\d+)/i
    ]);
    if (powerUnits) {
      profile.powerUnits = parseInt(powerUnits, 10);
      fieldsFound.push('powerUnits');
    }

    // Extract Drivers
    const drivers = tryExtract('drivers', [
      /Drivers?[:\s]*<\/[^>]+>\s*<[^>]*>(\d+)/i,
      /Drivers?:<\/A><\/TH>\s*<TD[^>]*>[^>]*>[^>]*>[^>]*>(\d+)/i,
      /Drivers?:\s*<\/[^>]+>\s*<[^>]*>\s*<[^>]*>\s*<[^>]*>\s*<[^>]*>(\d+)/i,
      /Drivers?:\s*(\d+)/i
    ]);
    if (drivers) {
      profile.drivers = parseInt(drivers, 10);
      fieldsFound.push('drivers');
    }

    // Extract Carrier Operation (Interstate/Intrastate)
    // Check for Interstate (with flexible whitespace/newlines between TD tags)
    if (html.match(/<TD[^>]*>\s*X\s*<\/TD>\s*<TD[^>]*>[\s\S]*?Interstate/i)) {
      profile.operationType = 'Interstate';
      fieldsFound.push('operationType');
      extractionDetails['operationType'] = 'Found Interstate with X marker';
    } else if (html.match(/<TD[^>]*>\s*X\s*<\/TD>\s*<TD[^>]*>[\s\S]*?Intrastate/i)) {
      profile.operationType = 'Intrastate';
      fieldsFound.push('operationType');
      extractionDetails['operationType'] = 'Found Intrastate with X marker';
    }

    // Extract Total Inspections
    const inspections = tryExtract('totalInspections', [
      /Total Inspections?:\s*<[^>]*>\s*(\d+)/i,
      /Total Inspections?:[^>]*>(\d+)<\/FONT>/i
    ]);
    if (inspections) {
      profile.totalInspections = parseInt(inspections, 10);
      fieldsFound.push('totalInspections');
    }

    // Extract Total Crashes (from the crash table)
    const crashes = tryExtract('totalCrashes', [
      /<TH[^>]*>Crashes<\/TH>\s*<TD[^>]*>\d+<\/TD>\s*<TD[^>]*>\d+<\/TD>\s*<TD[^>]*>\d+<\/TD>\s*<TD[^>]*>(\d+)<\/TD>/i,
      /Crashes<\/TH>\s*<TD[^>]*>(\d+)<\/TD>\s*<TD[^>]*>(\d+)<\/TD>\s*<TD[^>]*>(\d+)<\/TD>\s*<TD[^>]*>(\d+)<\/TD>/i
    ]);
    if (crashes) {
      // For the second pattern which captures all 4 columns, use the last one (total)
      const match = html.match(/Crashes<\/TH>\s*<TD[^>]*>(\d+)<\/TD>\s*<TD[^>]*>(\d+)<\/TD>\s*<TD[^>]*>(\d+)<\/TD>\s*<TD[^>]*>(\d+)<\/TD>/i);
      if (match && match[4]) {
        profile.totalCrashes = parseInt(match[4], 10);
        fieldsFound.push('totalCrashes');
      } else {
        profile.totalCrashes = parseInt(crashes, 10);
        fieldsFound.push('totalCrashes');
      }
    }

    // Extract Safety Rating
    const safetyRating = tryExtract('safetyRating', [
      /Safety Rating[:\s]*<\/[^>]+>\s*<[^>]+>([^<]+)/i,
      /Safety Rating:<\/A><\/TH>\s*<TD[^>]*>([^<]+)/i
    ]);
    if (safetyRating && safetyRating !== '&nbsp;' && safetyRating.length > 0) {
      profile.safetyRating = safetyRating;
      fieldsFound.push('safetyRating');
    }

    if (isDev) {
      console.log('[Parser] USDOT:', usdot);
      console.log('[Parser] Fields found:', fieldsFound.join(', ') || 'none');
      console.log('[Parser] Extraction confidence:');
      for (const [field, detail] of Object.entries(extractionDetails)) {
        console.log(`  - ${field}: ${detail}`);
      }
      if (fieldsFound.length > 0) {
        console.log('[Parser] Extracted data:', JSON.stringify(profile, null, 2));
      } else {
        console.log('[Parser] No fields extracted - showing first 2000 chars of HTML for debugging:');
        console.log(html.substring(0, 2000));
      }
    }

    // Return profile if we have carrier name or at least 2 other fields
    if (profile.carrierName) {
      return profile;
    }

    if (fieldsFound.length >= 2) {
      if (isDev) console.log('[Parser] Returning partial profile without carrier name');
      return profile;
    }

    return null;
  } catch (error) {
    console.error('[Parser] Error parsing company snapshot:', error);
    return null;
  }
}

function parsePublicSMS(html: string): PublicSMSData {
  const smsData: PublicSMSData = {};

  try {
    const vehicleOOSMatch = html.match(/Vehicle\s+(?:Maint\.|Maintenance)[^>]*>\s*[^>]*>([0-9.]+)%/i);
    if (vehicleOOSMatch) {
      smsData.vehicleOOS = parseFloat(vehicleOOSMatch[1]);
    }

    const driverOOSMatch = html.match(/Driver\s+(?:Fitness|HOS)[^>]*>\s*[^>]*>([0-9.]+)%/i);
    if (driverOOSMatch) {
      smsData.driverOOS = parseFloat(driverOOSMatch[1]);
    }

    const inspectionsMatch = html.match(/Inspections[:\s]*<\/[^>]+>\s*<[^>]+>(\d+)/i);
    if (inspectionsMatch) {
      smsData.inspections = parseInt(inspectionsMatch[1], 10);
    }

    const crashesMatch = html.match(/Crashes[:\s]*<\/[^>]+>\s*<[^>]+>(\d+)/i);
    if (crashesMatch) {
      smsData.crashes = parseInt(crashesMatch[1], 10);
    }
  } catch (error) {
    console.error('Error parsing SMS data:', error);
  }

  return smsData;
}

export async function getPublicCarrierProfileByUsdot(usdot: string): Promise<PublicLookupResult> {
  const isDev = process.env.NODE_ENV === 'development';

  try {
    const cleanUsdot = usdot.replace(/\D/g, '');

    if (!cleanUsdot || cleanUsdot.length < 1) {
      if (isDev) console.log('[Public Lookup] Invalid USDOT format:', usdot);
      return {
        success: false,
        error: 'not_found',
        message: 'Invalid USDOT format'
      };
    }

    const saferUrl = `https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${cleanUsdot}`;

    if (isDev) {
      console.log('[Public Lookup] Fetching USDOT:', cleanUsdot);
      console.log('[Public Lookup] URL:', saferUrl);
    }

    const response = await fetchWithTimeout(saferUrl);

    if (isDev) {
      console.log('[Public Lookup] HTTP Status:', response.status);
      console.log('[Public Lookup] Content-Type:', response.headers.get('content-type'));
    }

    if (!response.ok) {
      const message = `SAFER API returned status ${response.status}`;
      console.error('[Public Lookup]', message);

      if (response.status === 404) {
        return {
          success: false,
          error: 'not_found',
          statusCode: response.status,
          message: 'Carrier not found in public records'
        };
      }

      if (response.status >= 500) {
        return {
          success: false,
          error: 'fetch_failed',
          statusCode: response.status,
          message: 'FMCSA source temporarily unavailable'
        };
      }

      return {
        success: false,
        error: 'fetch_failed',
        statusCode: response.status,
        message
      };
    }

    const html = await response.text();
    const contentLength = html.length;
    const finalUrl = response.url;

    if (isDev) {
      console.log('[Public Lookup] Response length:', contentLength);
      if (finalUrl !== saferUrl) {
        console.log('[Public Lookup] Redirected to:', finalUrl);
      }
      console.log('[Public Lookup] First 1000 chars of HTML:', html.substring(0, 1000));
    }

    if (contentLength < 100) {
      if (isDev) console.log('[Public Lookup] Response too short, likely empty or blocked');
      return {
        success: false,
        error: 'blocked',
        statusCode: response.status,
        rawContentLength: contentLength,
        message: 'Received empty or blocked response from source'
      };
    }

    if (html.toLowerCase().includes('no records') ||
        html.toLowerCase().includes('not found') ||
        html.toLowerCase().includes('no results')) {
      if (isDev) console.log('[Public Lookup] Carrier not found in public records');
      return {
        success: false,
        error: 'not_found',
        statusCode: response.status,
        message: 'Carrier not found in public records'
      };
    }

    const profile = parseCompanySnapshot(html, cleanUsdot, isDev);

    if (!profile) {
      if (isDev) console.log('[Public Lookup] Parse failed - no usable data extracted');
      return {
        success: false,
        error: 'parse_failed',
        statusCode: response.status,
        rawContentLength: contentLength,
        message: 'Could not parse carrier profile from public source'
      };
    }

    const hasMinimalData = profile.carrierName || (profile.mc && profile.status);
    if (!hasMinimalData) {
      if (isDev) console.log('[Public Lookup] Partial data extracted but insufficient for profile');
      return {
        success: false,
        error: 'parse_failed',
        statusCode: response.status,
        rawContentLength: contentLength,
        partialProfile: profile,
        message: 'Partial carrier data extracted but incomplete',
        isPartial: true
      };
    }

    if (isDev) {
      console.log('[Public Lookup] Success:', profile.carrierName || `USDOT ${profile.usdot}`);
    }

    return {
      success: true,
      profile,
      statusCode: response.status,
      rawContentLength: contentLength,
      isPartial: !profile.carrierName
    };
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    console.error('[Public Lookup] Error:', error);

    if (isTimeout) {
      return {
        success: false,
        error: 'timeout',
        message: 'Request to public source timed out'
      };
    }

    return {
      success: false,
      error: 'fetch_failed',
      message: error instanceof Error ? error.message : 'Unknown error fetching public data'
    };
  }
}

export async function getPublicSmsSummary(usdot: string): Promise<PublicSMSData | null> {
  try {
    const cleanUsdot = usdot.replace(/\D/g, '');

    if (!cleanUsdot || cleanUsdot.length < 1) {
      return null;
    }

    const smsUrl = `https://ai.fmcsa.dot.gov/SMS/Carrier/${cleanUsdot}/Overview.aspx`;

    const response = await fetchWithTimeout(smsUrl);

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const smsData = parsePublicSMS(html);

    return smsData;
  } catch (error) {
    console.error('Error fetching SMS data:', error);
    return null;
  }
}
