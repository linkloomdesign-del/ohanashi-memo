import { Memo, MemoCategory } from '@/types';

export async function extractMemosFromConversation(
  conversationId: string,
  messages: { sender: string; content: string }[]
): Promise<Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>[]> {
  try {
    const res = await fetch('/api/ai/extract-memo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();

    return (data.memos || []).map((m: {
      memoType: MemoCategory;
      title: string;
      items?: string[];
      originalText?: string;
      familyConfirmRequired?: boolean;
    }) => ({
      userId: 'mother-1',
      conversationId,
      memoType: m.memoType || 'general',
      title: m.title,
      items: m.items || undefined,
      originalText: m.originalText,
      status: 'open' as const,
      familyConfirmRequired: m.familyConfirmRequired || false,
    }));
  } catch {
    return fallbackExtraction(conversationId, messages);
  }
}

function fallbackExtraction(
  conversationId: string,
  messages: { sender: string; content: string }[]
): Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>[] {
  const userMessages = messages
    .filter((m) => m.sender === 'mother')
    .map((m) => m.content);

  const memos: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  for (const msg of userMessages) {
    let memoType: MemoCategory = 'general';
    let title = msg;
    let items: string[] | undefined;
    let familyConfirmRequired = false;

    if (/買う|買い物|買わ/.test(msg)) {
      memoType = 'shopping';
      title = '買い物メモ';
      const itemMatches = msg.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]+/g);
      items = itemMatches?.filter((w) => !['買う', '買い物', '買わ', '後で', '明日', '今日'].includes(w));
    } else if (/取り込|やる|しなきゃ|しないと|やらなきゃ/.test(msg)) {
      memoType = 'todo';
      title = msg.replace(/なきゃ|しないと/, '');
    } else if (/病院|予定|明日|来週|約束/.test(msg)) {
      memoType = 'schedule';
      familyConfirmRequired = true;
    } else if (/痛い|つらい|だるい|熱|咳|体調|薬/.test(msg)) {
      memoType = 'health';
      familyConfirmRequired = true;
    } else if (/伝えて|言って|連絡して/.test(msg)) {
      memoType = 'family_message';
    } else {
      continue;
    }

    memos.push({
      userId: 'mother-1',
      conversationId,
      memoType,
      title,
      items,
      originalText: msg,
      status: 'open',
      familyConfirmRequired,
    });
  }

  return memos;
}
