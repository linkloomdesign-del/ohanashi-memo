import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ memos: [] });
    }

    const userMessages = messages
      .filter((m: { sender: string }) => m.sender === 'mother')
      .map((m: { content: string }) => m.content)
      .join('\n');

    if (!userMessages.trim()) {
      return NextResponse.json({ memos: [] });
    }

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `会話から重要なメモを抽出してください。以下のJSON配列形式で返してください。
メモがない場合は空配列 [] を返してください。

各メモのフォーマット:
{
  "memoType": "shopping" | "todo" | "schedule" | "health" | "family_message" | "general",
  "title": "メモのタイトル（短く）",
  "items": ["アイテム1", "アイテム2"] (shopping の場合のみ、それ以外はnull),
  "originalText": "元の発言",
  "familyConfirmRequired": true/false (scheduleやhealthの場合true)
}

分類基準:
- shopping: 買い物に関する発言（「買う」「買い物」など）
- todo: やることに関する発言（「しなきゃ」「取り込む」「やる」など）
- schedule: 予定に関する発言（「明日」「病院」「約束」など）
- health: 体調に関する発言（「痛い」「だるい」「薬」など）
- family_message: 家族に伝えたいこと
- general: 上記以外の重要な情報

普通の会話（あいさつ、感想など）はメモにしないでください。
JSON配列のみ返してください。他のテキストは不要です。`,
        },
        {
          role: 'user',
          content: `以下の会話からメモを抽出してください：\n\n${userMessages}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '[]';
    try {
      const memos = JSON.parse(content);
      return NextResponse.json({ memos: Array.isArray(memos) ? memos : [] });
    } catch {
      return NextResponse.json({ memos: [] });
    }
  } catch (error) {
    console.error('Memo extraction error:', error);
    return NextResponse.json({ memos: [] });
  }
}
