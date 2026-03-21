import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { CarrierBrief } from '@/lib/types';

const isConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

export async function POST(request: Request) {
  if (!isConfigured) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 });
  }

  let body: { question: string; carrier: CarrierBrief };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { question, carrier } = body;
  if (!question || !carrier) {
    return NextResponse.json({ error: 'Missing question or carrier data' }, { status: 400 });
  }

  const client = new Anthropic();

  const systemPrompt = `You are an expert carrier risk analyst helping insurance underwriters, freight brokers, and risk managers understand a carrier's safety profile. You have deep knowledge of FMCSA regulations, CSA scores, OOS rates, and carrier safety programs.

Your answers should be:
- Concise and actionable (3-5 sentences max per section)
- Structured with clear headings
- Specific to the carrier data provided
- Written for a risk professional audience`;

  const carrierContext = `
Carrier: ${carrier.carrierName} (USDOT ${carrier.usdot})
Overall Risk: ${carrier.overallRisk}
Trend: ${carrier.trend}
Confidence: ${carrier.confidence}

Key Metrics:
- Overall OOS Rate: ${carrier.metrics.overallOOS}% (${carrier.metrics.overallOOSDelta > 0 ? '+' : ''}${carrier.metrics.overallOOSDelta}% vs avg)
- Vehicle OOS Rate: ${carrier.metrics.vehicleOOS}%
- Driver OOS Rate: ${carrier.metrics.driverOOS}%
- Crashes (24mo): ${carrier.metrics.crashes24mo}
- BASIC Exposure: ${carrier.metrics.basicExposure}
- MCS-150 Freshness: ${carrier.metrics.mcs150Freshness}

Risk Chips: Maintenance=${carrier.riskChips.maintenance}, Crash=${carrier.riskChips.crash}, Driver=${carrier.riskChips.driver}, Hazmat=${carrier.riskChips.hazmat}, Admin=${carrier.riskChips.admin}

Top Risk Drivers:
${carrier.riskDriverDetails.map((d, i) => `${i + 1}. [${d.severity.toUpperCase()}] ${d.title}: ${d.description}`).join('\n')}

Executive Summary: ${carrier.executiveMemo}
AI Summary: ${carrier.aiSummary}`;

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `${carrierContext}\n\nQuestion: ${question}\n\nProvide a structured answer with 2-3 labeled sections. Keep each section to 2-3 sentences. Be specific and actionable.`,
        },
      ],
    });

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as Anthropic.TextBlock).text)
      .join('');

    return NextResponse.json({ answer: text });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
