import { NextRequest, NextResponse } from 'next/server';
import { fetchCarrierFromFmcsaApi } from '@/lib/fmcsa-api-service';
import { buildBriefFromFmcsaApi } from '@/lib/fmcsa-brief-builder';

export async function GET(request: NextRequest) {
  const usdot = request.nextUrl.searchParams.get('usdot');

  if (!usdot || !/^\d+$/.test(usdot)) {
    return NextResponse.json(
      { error: 'Missing or invalid usdot query parameter' },
      { status: 400 }
    );
  }

  if (!process.env.FMCSA_API_KEY) {
    return NextResponse.json(
      { error: 'FMCSA API key not configured. Add FMCSA_API_KEY to your .env file.' },
      { status: 500 }
    );
  }

  const result = await fetchCarrierFromFmcsaApi(usdot);

  if (!result.success || !result.carrier) {
    return NextResponse.json(
      { error: result.error || 'Failed to fetch carrier from FMCSA API' },
      { status: 404 }
    );
  }

  const brief = buildBriefFromFmcsaApi(result.carrier);

  return NextResponse.json({
    data: brief,
    source: 'fmcsa-api',
    raw: result.carrier,
    status: 200,
  });
}
