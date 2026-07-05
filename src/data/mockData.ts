import { User, Profile, Conversation, ConversationCard, Memo, FamilyMessage, AppUsageLog } from '@/types';

export const motherUser: User = {
  id: 'mother-1',
  name: 'お母さん',
  role: 'mother',
  createdAt: new Date('2026-06-01'),
};

export const familyProfiles: Profile[] = [
  {
    id: 'profile-1',
    userId: 'family-1',
    displayName: '大介',
    relationship: '長男',
    phone: '080-3737-5609',
    messageDestination: 'SMS / メール / アプリ通知',
    isPrimaryContact: true,
    createdAt: new Date('2026-06-01'),
  },
  {
    id: 'profile-2',
    userId: 'family-2',
    displayName: 'お父さん',
    relationship: '父',
    phone: '090-0000-0000',
    isPrimaryContact: false,
    createdAt: new Date('2026-06-01'),
  },
  {
    id: 'profile-3',
    userId: 'family-3',
    displayName: '愛',
    relationship: '長女',
    phone: '090-1111-1111',
    messageDestination: 'アプリ通知 / メール',
    isPrimaryContact: false,
    createdAt: new Date('2026-06-01'),
  },
];

export const mockConversations: Conversation[] = [];

export const mockConversationCards: ConversationCard[] = [];

export const mockMemos: Memo[] = [];

export const mockFamilyMessages: FamilyMessage[] = [];

export const mockUsageLogs: AppUsageLog[] = [];

export const AI_RESPONSES = [
  'なるほど、それはいいですね！もう少し教えてください。',
  'すてきなお話ですね。ほかにはどんなことがありましたか？',
  'そうだったんですね。それはうれしいですね！',
  'いいですねえ。毎日をたのしんでいますね。',
  'おもしろいお話をありがとうございます。もっと聞かせてください。',
  'そうですか。お体の調子はいかがですか？',
  'すてきですね！その話をご家族にも伝えましょうか？',
  'なるほど。それは大切な思い出ですね。',
];
