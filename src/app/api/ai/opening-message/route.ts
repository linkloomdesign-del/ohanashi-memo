import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { lastConversation, openMemos, daysSinceLastUse } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      // Fallback: simple rule-based opening
      if (!lastConversation) {
        return NextResponse.json({
          message: 'こんにちは。\n今日は少しだけお話しましょう。\n最近、どんなことがありましたか？',
        });
      }
      return NextResponse.json({
        message: `前回は、${lastConversation.summaryForMother || 'お話をしました'}。\n前の話でも、今日のことでも大丈夫です。`,
      });
    }

    let context = '';
    if (lastConversation) {
      context += `前回の会話要約: ${lastConversation.summaryForFamily || '不明'}\n`;
      if (lastConversation.mainTopics?.length > 0) {
        context += `前回の話題: ${lastConversation.mainTopics.join('、')}\n`;
      }
    }
    if (openMemos?.length > 0) {
      context += `未完了メモ: ${openMemos.map((m: { title: string }) => m.title).join('、')}\n`;
    }
    if (daysSinceLastUse > 1) {
      context += `前回利用から${daysSinceLastUse}日経過\n`;
    }

    const hour = new Date().getHours();
    const timeGreeting = hour < 11 ? 'おはようございます。' : hour < 17 ? 'こんにちは。' : 'こんばんは。';

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `あなたは高齢者向けAIアシスタント「おはなしメモ」です。
会話の冒頭のあいさつを生成してください。

ルール：
- 2〜4文の短い挨拶にする
- 前回の会話内容に触れる（ある場合）
- 未完了メモがあれば軽く触れる
- 久しぶりの場合は「お久しぶりです」と言う
- 初回の場合は自己紹介的に
- 最後は「前の話でも、今日のことでも大丈夫です。」で締める
- やさしい口調で

時間帯の挨拶: ${timeGreeting}`,
        },
        {
          role: 'user',
          content: context || '初回利用です。',
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const message = response.choices[0]?.message?.content || `${timeGreeting}\n今日も少しお話しましょう。`;
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Opening message error:', error);
    return NextResponse.json({
      message: 'こんにちは。\n今日も少しお話しましょう。\n最近、どんなことがありましたか？',
    });
  }
}
