import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import {
  Conversation,
  ChatMessage,
  ConversationCard,
  Memo,
  FamilyMessage,
  AppUsageLog,
  Profile,
} from '@/types';

function toDate(val: string | Date): Date {
  return val instanceof Date ? val : new Date(val);
}

function db() {
  return getSupabaseClient()!;
}

// ============ Profiles ============

export async function fetchProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await db().from('profiles').select('*').order('is_primary_contact', { ascending: false });
  if (error) { console.error('fetchProfiles', error); return []; }
  return (data || []).map((r) => ({
    id: r.id, userId: r.user_id, displayName: r.display_name, relationship: r.relationship,
    phone: r.phone, messageDestination: r.message_destination, isPrimaryContact: r.is_primary_contact,
    createdAt: toDate(r.created_at),
  }));
}

// ============ Conversations ============

export async function fetchConversations(): Promise<Conversation[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await db().from('conversations')
    .select('*, conversation_messages:conversation_messages(*)')
    .order('started_at', { ascending: false });
  if (error) { console.error('fetchConversations', error); return []; }
  return (data || []).map((r) => ({
    id: r.id, userId: r.user_id, startedAt: toDate(r.started_at),
    endedAt: r.ended_at ? toDate(r.ended_at) : undefined, durationSeconds: r.duration_seconds,
    mode: r.mode, summaryForMother: r.summary_for_mother, summaryForFamily: r.summary_for_family,
    mainTopics: r.main_topics, mood: r.mood, concernNotes: r.concern_notes,
    nextOpeningMessage: r.next_opening_message, familySuggestion: r.family_suggestion,
    createdAt: toDate(r.created_at),
    messages: (r.conversation_messages || []).map((m: Record<string, unknown>) => ({
      id: m.id as string, conversationId: m.conversation_id as string,
      sender: m.sender as 'mother' | 'ai', content: m.content as string,
      inputType: m.input_type as 'voice' | 'text' | 'system', createdAt: toDate(m.created_at as string),
    })).sort((a: ChatMessage, b: ChatMessage) => a.createdAt.getTime() - b.createdAt.getTime()),
  }));
}

export async function insertConversation(conv: Conversation): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await db().from('conversations').insert({
    id: conv.id, user_id: conv.userId, started_at: conv.startedAt.toISOString(),
    ended_at: conv.endedAt?.toISOString(), duration_seconds: conv.durationSeconds,
    mode: conv.mode, summary_for_mother: conv.summaryForMother, summary_for_family: conv.summaryForFamily,
    main_topics: conv.mainTopics, mood: conv.mood, concern_notes: conv.concernNotes,
    next_opening_message: conv.nextOpeningMessage, family_suggestion: conv.familySuggestion,
  });
  if (error) console.error('insertConversation', error);
  if (conv.messages.length > 0) {
    const { error: msgError } = await db().from('conversation_messages').insert(
      conv.messages.map((m) => ({
        id: m.id, conversation_id: conv.id, sender: m.sender, content: m.content,
        input_type: m.inputType, created_at: m.createdAt.toISOString(),
      }))
    );
    if (msgError) console.error('insertConversationMessages', msgError);
  }
}

// ============ Conversation Cards ============

export async function fetchConversationCards(): Promise<ConversationCard[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await db().from('conversation_cards').select('*').order('created_at', { ascending: false });
  if (error) { console.error('fetchConversationCards', error); return []; }
  return (data || []).map((r) => ({
    id: r.id, conversationId: r.conversation_id, title: r.title, body: r.body,
    category: r.category, displayToMother: r.display_to_mother, createdAt: toDate(r.created_at),
  }));
}

export async function insertConversationCard(card: ConversationCard): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await db().from('conversation_cards').insert({
    id: card.id, conversation_id: card.conversationId, title: card.title,
    body: card.body, category: card.category, display_to_mother: card.displayToMother,
  });
  if (error) console.error('insertConversationCard', error);
}

// ============ Memos ============

export async function fetchMemos(): Promise<Memo[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await db().from('memos').select('*').order('created_at', { ascending: false });
  if (error) { console.error('fetchMemos', error); return []; }
  return (data || []).map((r) => ({
    id: r.id, userId: r.user_id, conversationId: r.conversation_id, memoType: r.memo_type,
    title: r.title, items: r.items, originalText: r.original_text, status: r.status,
    familyConfirmRequired: r.family_confirm_required, createdAt: toDate(r.created_at), updatedAt: toDate(r.updated_at),
  }));
}

export async function insertMemo(memo: Memo): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await db().from('memos').insert({
    id: memo.id, user_id: memo.userId, conversation_id: memo.conversationId,
    memo_type: memo.memoType, title: memo.title, items: memo.items,
    original_text: memo.originalText, status: memo.status, family_confirm_required: memo.familyConfirmRequired,
  });
  if (error) console.error('insertMemo', error);
}

export async function updateMemo(memoId: string, status: Memo['status']): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await db().from('memos').update({ status, updated_at: new Date().toISOString() }).eq('id', memoId);
  if (error) console.error('updateMemo', error);
}

// ============ Family Messages ============

export async function fetchFamilyMessages(): Promise<FamilyMessage[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await db().from('family_messages').select('*').order('created_at', { ascending: false });
  if (error) { console.error('fetchFamilyMessages', error); return []; }
  return (data || []).map((r) => ({
    id: r.id, fromUserId: r.from_user_id, toProfileId: r.to_profile_id,
    messageText: r.message_text, inputMethod: r.input_method, status: r.status, createdAt: toDate(r.created_at),
  }));
}

export async function insertFamilyMessage(msg: FamilyMessage): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await db().from('family_messages').insert({
    id: msg.id, from_user_id: msg.fromUserId, to_profile_id: msg.toProfileId,
    message_text: msg.messageText, input_method: msg.inputMethod, status: msg.status,
  });
  if (error) console.error('insertFamilyMessage', error);
}

// ============ Usage Logs ============

export async function fetchUsageLogs(): Promise<AppUsageLog[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await db().from('app_usage_logs').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) { console.error('fetchUsageLogs', error); return []; }
  return (data || []).map((r) => ({
    id: r.id, userId: r.user_id, feature: r.feature, action: r.action, createdAt: toDate(r.created_at),
  }));
}

export async function insertUsageLog(log: AppUsageLog): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await db().from('app_usage_logs').insert({
    id: log.id, user_id: log.userId, feature: log.feature, action: log.action,
  });
  if (error) console.error('insertUsageLog', error);
}
