import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, SYSTEM_PROMPT } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: { sender: string; content: string }) => ({
          role: m.sender === 'mother' ? 'user' : 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || 'すみません、もう一度教えてください。';
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'AI response failed' }, { status: 500 });
  }
}
