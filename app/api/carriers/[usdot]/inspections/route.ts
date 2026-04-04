import { NextResponse } from 'next/server';
import { fetchFullInspectionHistory } from '@/lib/sms-inspection-service';

export async function GET(
  request: Request,
  { params }: { params: { usdot: string } }
) {
  const usdot = params.usdot?.replace(/\D/g, '');

  if (!usdot) {
    return NextResponse.json(
      { error: 'Invalid USDOT number', status: 400 },
      { status: 400 }
    );
  }

  try {
    const result = await fetchFullInspectionHistory(usdot);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch inspections', status: 503 },
        { status: 503 }
      );
    }

    return NextResponse.json({
      data: {
        inspections: result.inspections || [],
        inspectionDetails: result.inspectionDetails || [],
        totalCount: result.totalCount || 0,
        basicPercentile: result.basicPercentile,
      },
      status: 200,
    });
  } catch (error) {
    console.error('[API] Error fetching inspections:', error);
    return NextResponse.json(
      { error: 'Internal server error', status: 500 },
      { status: 500 }
    );
  }
}
