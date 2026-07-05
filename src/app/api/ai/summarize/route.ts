import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        summaryForMother: 'お話しました。',
        summaryForFamily: 'お話しました。',
        mainTopics: [],
        mood: '普通',
        concernNotes: null,
        nextOpeningMessage: null,
        familySuggestion: null,
        cardTitle: 'お話',
        cardBody: 'お話をしました。',
      });
    }

    const conversationText = messages
      .map((m: { sender: string; content: string }) =>
        `${m.sender === 'mother' ? 'お母さん' : 'AI'}: ${m.content}`
      )
      .join('\n');

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `会話を分析して以下のJSON形式で要約を返してください。JSONのみ返してください。

{
  "summaryForMother": "母向けの短い要約（1文）",
  "summaryForFamily": "家族向けの詳しい要約（2-3文）",
  "mainTopics": ["話題1", "話題2"],
  "mood": "良い" | "普通" | "やや疲れ気味" | "不安",
  "concernNotes": "気になる発言があればここに（なければnull）",
  "nextOpeningMessage": "次回の会話冒頭文（前回は〜の話をしました。前の話でも、今日のことでも大丈夫です。）",
  "familySuggestion": "家族への声かけ提案（1文）",
  "cardTitle": "〜の話（短いタイトル）",
  "cardBody": "〜の話をしました。（1文の説明）"
}`,
        },
        {
          role: 'user',
          content: `以下の会話を分析してください：\n\n${conversationText}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '{}';
    try {
      const summary = JSON.parse(content);
      return NextResponse.json(summary);
    } catch {
      return NextResponse.json({
        summaryForMother: 'お話しました。',
        summaryForFamily: 'お話しました。',
        mainTopics: [],
        mood: '普通',
        concernNotes: null,
        nextOpeningMessage: null,
        familySuggestion: null,
        cardTitle: 'お話',
        cardBody: 'お話をしました。',
      });
    }
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json({ error: 'Summarization failed' }, { status: 500 });
  }
}
