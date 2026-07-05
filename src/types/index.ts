export interface User {
  id: string;
  name: string;
  role: 'mother' | 'family';
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  relationship: string;
  phone?: string;
  messageDestination?: string;
  isPrimaryContact: boolean;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'mother' | 'ai';
  content: string;
  inputType: 'voice' | 'text' | 'system';
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds?: number;
  mode: 'voice' | 'text';
  summaryForMother?: string;
  summaryForFamily?: string;
  mainTopics?: string[];
  mood?: string;
  concernNotes?: string;
  nextOpeningMessage?: string;
  familySuggestion?: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export interface ConversationCard {
  id: string;
  conversationId: string;
  title: string;
  body: string;
  category: MemoCategory;
  displayToMother: boolean;
  createdAt: Date;
}

export type MemoCategory = 'shopping' | 'todo' | 'schedule' | 'health' | 'family_message' | 'general';

export interface Memo {
  id: string;
  userId: string;
  conversationId?: string;
  memoType: MemoCategory;
  title: string;
  items?: string[];
  originalText?: string;
  status: 'open' | 'done' | 'deleted';
  familyConfirmRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyMessage {
  id: string;
  fromUserId: string;
  toProfileId: string;
  messageText: string;
  inputMethod: 'simple' | 'voice' | 'text';
  status: 'saved' | 'sent' | 'read';
  createdAt: Date;
}

export interface AppUsageLog {
  id: string;
  userId: string;
  feature: 'home' | 'today_talk' | 'previous_conversations' | 'family_contact';
  action: 'open' | 'start' | 'end' | 'click' | 'send';
  createdAt: Date;
}

export const MEMO_CATEGORY_LABELS: Record<MemoCategory, string> = {
  shopping: '買い物メモ',
  todo: 'やること',
  schedule: '予定',
  health: '体調メモ',
  family_message: '家族に伝えること',
  general: '普通の会話',
};

export const SIMPLE_MESSAGES = [
  '電話してほしい',
  '少し不安です',
  '元気です',
  'あとで来てほしい',
];
