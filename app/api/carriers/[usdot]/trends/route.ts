import { NextResponse } from 'next/server';
import { getCarrierTrends, getCarrierByUsdot } from '@/lib/carrier-service';

export async function GET(
  request: Request,
  { params }: { params: { usdot: string } }
) {
  try {
    const trends = getCarrierTrends(params.usdot);

    if (!trends) {
      const result = await getCarrierByUsdot(params.usdot);

      if (result.status === 'success' && result.brief) {
        return NextResponse.json({
          data: {
            usdot: result.brief.usdot,
            trendData: result.brief.trendData,
            trend: result.brief.trend,
            trendSummary: result.brief.trendSummary,
          },
          status: 200,
        });
      }

      if ((result.status === 'source_unavailable' || result.status === 'parse_failed') && result.fallbackBrief) {
        return NextResponse.json({
          data: {
            usdot: result.fallbackBrief.usdot,
            trendData: result.fallbackBrief.trendData,
            trend: result.fallbackBrief.trend,
            trendSummary: result.fallbackBrief.trendSummary,
          },
          status: 200,
        });
      }

      const errorMessage = result.status !== 'success' ? result.message : 'Carrier not found';
      return NextResponse.json(
        { error: errorMessage, status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: trends, status: 200 });
  } catch (error) {
    console.error('Error fetching carrier trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carrier trends', status: 500 },
      { status: 500 }
    );
  }
}
