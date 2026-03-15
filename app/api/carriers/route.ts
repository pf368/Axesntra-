import { NextResponse } from 'next/server';
import { getAllCarriers, searchCarriers } from '@/lib/carrier-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (query) {
    const results = searchCarriers(query);
    return NextResponse.json({ data: results, status: 200 });
  }

  const carriers = getAllCarriers();
  return NextResponse.json({ data: carriers, status: 200 });
}
