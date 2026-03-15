import { NextResponse } from 'next/server';
import { getCarrierByUsdot } from '@/lib/carrier-service';

export async function GET(
  request: Request,
  { params }: { params: { usdot: string } }
) {
  try {
    const result = await getCarrierByUsdot(params.usdot);

    if (result.status === 'success') {
      return NextResponse.json({
        data: result.brief,
        lookupStatus: result.lookupStatus,
        source: result.brief.source,
        sourceNotes: result.brief.sourceNotes,
        status: 200
      });
    }

    if (result.status === 'source_unavailable' || result.status === 'parse_failed') {
      if (result.fallbackBrief) {
        return NextResponse.json({
          data: result.fallbackBrief,
          lookupStatus: result.status,
          message: result.message,
          source: result.fallbackBrief.source,
          sourceNotes: result.fallbackBrief.sourceNotes,
          status: 200
        });
      }

      return NextResponse.json(
        {
          error: result.message,
          lookupStatus: result.status,
          usdot: result.usdot,
          status: 503
        },
        { status: 503 }
      );
    }

    if (result.status === 'not_found') {
      return NextResponse.json(
        {
          error: result.message,
          lookupStatus: 'not_found',
          usdot: result.usdot,
          status: 404
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown error', status: 500 },
      { status: 500 }
    );
  } catch (error) {
    console.error('[API] Error fetching carrier:', error);
    return NextResponse.json(
      { error: 'Internal server error', status: 500 },
      { status: 500 }
    );
  }
}
