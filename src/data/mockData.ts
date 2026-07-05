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

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    userId: 'mother-1',
    startedAt: new Date('2026-06-10T10:00:00'),
    endedAt: new Date('2026-06-10T10:03:00'),
    durationSeconds: 180,
    mode: 'text',
    summaryForMother: '買い物と庭のバラの話をしました。',
    summaryForFamily: '朝ごはんにパンとたまごを食べた。庭のバラが咲いたと嬉しそうに話していた。人参と卵を買うメモを残した。',
    mainTopics: ['買い物', '庭のバラ'],
    mood: '普通',
    concernNotes: undefined,
    nextOpeningMessage: '前回は、人参と卵を買う話をしました。前の話でも、今日のことでも大丈夫です。',
    familySuggestion: '庭のバラが咲いたそうです。「バラきれいだね」と声をかけてみては？',
    createdAt: new Date('2026-06-10T10:03:00'),
    messages: [
      { id: 'msg-1', conversationId: 'conv-1', sender: 'ai', content: 'おはようございます。今日も元気にお話ししましょう。最近、どんなことがありましたか？', inputType: 'system', createdAt: new Date('2026-06-10T10:00:00') },
      { id: 'msg-2', conversationId: 'conv-1', sender: 'mother', content: '今日はパンとたまごを食べたよ。おいしかった。', inputType: 'text', createdAt: new Date('2026-06-10T10:00:30') },
      { id: 'msg-3', conversationId: 'conv-1', sender: 'ai', content: 'パンとたまご、おいしそうですね！体にいい朝ごはんですね。最近、何か楽しいことはありましたか？', inputType: 'system', createdAt: new Date('2026-06-10T10:01:00') },
      { id: 'msg-4', conversationId: 'conv-1', sender: 'mother', content: '庭のバラが咲いたんだよ。きれいでねえ。', inputType: 'text', createdAt: new Date('2026-06-10T10:01:30') },
      { id: 'msg-5', conversationId: 'conv-1', sender: 'ai', content: 'バラが咲いたんですね！きれいでしょうね。何色のバラですか？', inputType: 'system', createdAt: new Date('2026-06-10T10:02:00') },
      { id: 'msg-6', conversationId: 'conv-1', sender: 'mother', content: '赤いバラだよ。あと、後で人参と卵買わなきゃ。', inputType: 'text', createdAt: new Date('2026-06-10T10:02:30') },
      { id: 'msg-7', conversationId: 'conv-1', sender: 'ai', content: 'わかりました。人参と卵を買うものに入れておきますね。', inputType: 'system', createdAt: new Date('2026-06-10T10:02:45') },
    ],
  },
  {
    id: 'conv-2',
    userId: 'mother-1',
    startedAt: new Date('2026-06-09T14:00:00'),
    endedAt: new Date('2026-06-09T14:04:00'),
    durationSeconds: 240,
    mode: 'text',
    summaryForMother: 'スーパーに行った話をしました。',
    summaryForFamily: '近所のスーパーに行った話。昔よくカレーを作っていたことを楽しそうに回想。洗濯物を取り込む必要がある。少し頭が痛いとのこと。明日病院の予定。',
    mainTopics: ['スーパー', 'カレー', '体調'],
    mood: 'やや疲れ気味',
    concernNotes: '少し頭が痛いとの発言あり。明日病院の予定を確認要。',
    nextOpeningMessage: '前回は、近所のスーパーへ行った話をしました。少し頭が痛いとおっしゃっていましたが、今日はいかがですか？',
    familySuggestion: '「頭痛は大丈夫？」と確認してみてください。明日の病院の予定も確認を。',
    createdAt: new Date('2026-06-09T14:04:00'),
    messages: [
      { id: 'msg-8', conversationId: 'conv-2', sender: 'ai', content: 'こんにちは！今日はどんな一日ですか？', inputType: 'system', createdAt: new Date('2026-06-09T14:00:00') },
      { id: 'msg-9', conversationId: 'conv-2', sender: 'mother', content: '今日は近所のスーパーに行ったよ。', inputType: 'text', createdAt: new Date('2026-06-09T14:00:30') },
      { id: 'msg-10', conversationId: 'conv-2', sender: 'ai', content: 'スーパーに行ったんですね。何かおいしいものはありましたか？', inputType: 'system', createdAt: new Date('2026-06-09T14:01:00') },
      { id: 'msg-11', conversationId: 'conv-2', sender: 'mother', content: '昔はよくカレーを作ってたなあ。子どもたちが喜んでたよ。', inputType: 'text', createdAt: new Date('2026-06-09T14:01:30') },
      { id: 'msg-12', conversationId: 'conv-2', sender: 'ai', content: 'カレー、おいしそうですね。お子さんたちも喜んでいたんですね。すてきな思い出ですね。', inputType: 'system', createdAt: new Date('2026-06-09T14:02:00') },
      { id: 'msg-13', conversationId: 'conv-2', sender: 'mother', content: '洗濯物取り込まなきゃ。あと少し頭が痛いんだよね。明日病院に行く予定なんだけど。', inputType: 'text', createdAt: new Date('2026-06-09T14:02:30') },
      { id: 'msg-14', conversationId: 'conv-2', sender: 'ai', content: 'わかりました。洗濯物を取り込むことを覚えておきますね。頭が痛いのは心配ですね。明日、病院に行く予定ですね。覚えておきます。', inputType: 'system', createdAt: new Date('2026-06-09T14:03:00') },
    ],
  },
];

export const mockConversationCards: ConversationCard[] = [
  {
    id: 'card-1',
    conversationId: 'conv-1',
    title: '買い物の話',
    body: '人参と卵を買う話をしました。',
    category: 'shopping',
    displayToMother: true,
    createdAt: new Date('2026-06-10T10:03:00'),
  },
  {
    id: 'card-2',
    conversationId: 'conv-2',
    title: 'スーパーの話',
    body: '近所のスーパーへ行った話をしました。',
    category: 'general',
    displayToMother: true,
    createdAt: new Date('2026-06-09T14:04:00'),
  },
  {
    id: 'card-3',
    conversationId: 'conv-2',
    title: 'カレーの話',
    body: '昔よくカレーを作っていた話をしました。',
    category: 'general',
    displayToMother: true,
    createdAt: new Date('2026-06-09T14:04:00'),
  },
];

export const mockMemos: Memo[] = [];

export const mockFamilyMessages: FamilyMessage[] = [
  {
    id: 'fmsg-1',
    fromUserId: 'mother-1',
    toProfileId: 'profile-1',
    messageText: '元気です',
    inputMethod: 'simple',
    status: 'read',
    createdAt: new Date('2026-06-10T11:00:00'),
  },
  {
    id: 'fmsg-2',
    fromUserId: 'mother-1',
    toProfileId: 'profile-3',
    messageText: '今日は庭のバラがきれいに咲いたよ',
    inputMethod: 'text',
    status: 'saved',
    createdAt: new Date('2026-06-10T11:30:00'),
  },
];

export const mockUsageLogs: AppUsageLog[] = [
  { id: 'log-1', userId: 'mother-1', feature: 'home', action: 'open', createdAt: new Date('2026-06-10T09:55:00') },
  { id: 'log-2', userId: 'mother-1', feature: 'today_talk', action: 'start', createdAt: new Date('2026-06-10T10:00:00') },
  { id: 'log-3', userId: 'mother-1', feature: 'today_talk', action: 'end', createdAt: new Date('2026-06-10T10:03:00') },
  { id: 'log-4', userId: 'mother-1', feature: 'family_contact', action: 'send', createdAt: new Date('2026-06-10T11:00:00') },
];

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
