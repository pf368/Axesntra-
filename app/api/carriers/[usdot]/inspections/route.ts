import { NextResponse } from 'next/server';
import { fetchFullInspectionHistory } from '@/lib/sms-inspection-service';
import { SEED_INSPECTIONS_862406 } from '@/lib/seed-inspections-862406';

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
      // Fallback to seed data for Johnsonville demo carrier
      if (usdot === '862406') {
        return NextResponse.json({
          data: {
            inspections: SEED_INSPECTIONS_862406.map(({ violations, ...rest }) => rest),
            inspectionDetails: SEED_INSPECTIONS_862406,
            totalCount: SEED_INSPECTIONS_862406.length,
            basicPercentile: undefined,
          },
          status: 200,
        });
      }

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
