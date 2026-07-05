import { AI_RESPONSES } from '@/data/mockData';
import { ChatMessage, Conversation, Memo } from '@/types';

let responseIndex = 0;

export async function getAIResponse(
  userMessage: string,
  conversationHistory: { sender: string; content: string }[]
): Promise<string> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          ...conversationHistory,
          { sender: 'mother', content: userMessage },
        ],
      }),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.reply;
  } catch {
    // Fallback to mock
    const response = AI_RESPONSES[responseIndex % AI_RESPONSES.length];
    responseIndex++;
    return response;
  }
}

export async function getOpeningMessage(
  lastConversation: Conversation | null,
  openMemos: Memo[],
  daysSinceLastUse: number
): Promise<string> {
  try {
    const res = await fetch('/api/ai/opening-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lastConversation: lastConversation
          ? {
              summaryForMother: lastConversation.summaryForMother,
              summaryForFamily: lastConversation.summaryForFamily,
              mainTopics: lastConversation.mainTopics,
            }
          : null,
        openMemos: openMemos.map((m) => ({ title: m.title, memoType: m.memoType })),
        daysSinceLastUse,
      }),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.message;
  } catch {
    return getFallbackGreeting(lastConversation, openMemos);
  }
}

export async function summarizeConversation(
  messages: ChatMessage[]
): Promise<{
  summaryForMother: string;
  summaryForFamily: string;
  mainTopics: string[];
  mood: string;
  concernNotes: string | null;
  nextOpeningMessage: string | null;
  familySuggestion: string | null;
  cardTitle: string;
  cardBody: string;
}> {
  try {
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map((m) => ({ sender: m.sender, content: m.content })),
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    const userTexts = messages.filter((m) => m.sender === 'mother').map((m) => m.content);
    return {
      summaryForMother: userTexts.join('。') || 'お話しました。',
      summaryForFamily: userTexts.join('。') || 'お話しました。',
      mainTopics: userTexts.slice(0, 3).map((t) => t.slice(0, 10)),
      mood: '普通',
      concernNotes: null,
      nextOpeningMessage: userTexts.length > 0
        ? `前回は、${userTexts[0]}の話をしました。前の話でも、今日のことでも大丈夫です。`
        : null,
      familySuggestion: null,
      cardTitle: userTexts.length > 0 ? `${userTexts[0].slice(0, 10)}の話` : 'お話',
      cardBody: userTexts.length > 0 ? `${userTexts[0].slice(0, 30)}の話をしました。` : 'お話をしました。',
    };
  }
}

function getFallbackGreeting(lastConversation: Conversation | null, openMemos: Memo[]): string {
  if (!lastConversation) {
    return 'こんにちは。\n今日は少しだけお話しましょう。\n最近、どんなことがありましたか？';
  }

  const hour = new Date().getHours();
  let opening = hour < 11 ? 'おはようございます。\n' : hour < 17 ? 'こんにちは。\n' : 'こんばんは。\n';

  if (lastConversation.nextOpeningMessage) {
    opening += lastConversation.nextOpeningMessage;
  } else if (lastConversation.summaryForMother) {
    opening += `前回は、${lastConversation.summaryForMother}`;
  }

  if (openMemos.length > 0) {
    const memoText = openMemos.slice(0, 2).map((m) => m.title).join('と');
    opening += `\n前回、${memoText}のメモがありました。必要なら一緒に確認できます。`;
  }

  return opening;
}
