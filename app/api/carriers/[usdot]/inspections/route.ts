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

  // Optional BASIC category filter
  const url = new URL(request.url);
  const basicFilter = url.searchParams.get('basic');

  try {
    const result = await fetchFullInspectionHistory(usdot);

    if (!result.success) {
      // Fallback to seed data for Johnsonville demo carrier
      if (usdot === '862406') {
        const details = basicFilter
          ? SEED_INSPECTIONS_862406.filter((insp) =>
              insp.violations.some((v) =>
                v.basicCategory.toLowerCase().includes(basicFilter.toLowerCase())
              )
            )
          : SEED_INSPECTIONS_862406;

        return NextResponse.json({
          data: {
            inspections: details.map(({ violations, ...rest }) => rest),
            inspectionDetails: details,
            totalCount: details.length,
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

    let inspectionDetails = result.inspectionDetails || [];
    let inspections = result.inspections || [];

    // Apply BASIC filter if specified
    if (basicFilter) {
      const filterLower = basicFilter.toLowerCase();
      inspectionDetails = inspectionDetails.filter((insp) =>
        insp.basicCategory?.toLowerCase().includes(filterLower) ||
        insp.violations.some((v) => v.basicCategory.toLowerCase().includes(filterLower))
      );
      inspections = inspections.filter((insp) =>
        insp.basicCategory?.toLowerCase().includes(filterLower)
      );
    }

    return NextResponse.json({
      data: {
        inspections,
        inspectionDetails,
        totalCount: inspections.length,
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
