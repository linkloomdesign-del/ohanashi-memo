'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';

export default function FamilyDashboard() {
  const router = useRouter();
  const { conversations, memos, familyMessages, usageLogs } = useApp();

  const today = new Date().toDateString();

  const todayLogs = usageLogs.filter((l) => l.createdAt.toDateString() === today);
  const todayTalkCount = todayLogs.filter((l) => l.feature === 'today_talk' && l.action === 'start').length;
  const todayPreviousCount = todayLogs.filter((l) => l.feature === 'previous_conversations' && l.action === 'open').length;
  const todayContactCount = todayLogs.filter((l) => l.feature === 'family_contact' && l.action === 'send').length;
  const totalUsage = todayTalkCount + todayPreviousCount + todayContactCount;

  const lastLog = usageLogs[0];
  const lastUsedText = lastLog
    ? `${lastLog.createdAt.toLocaleDateString('ja-JP')} ${lastLog.createdAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`
    : 'なし';

  const todayConversations = conversations.filter((c) => c.startedAt.toDateString() === today);
  const totalTalkMinutes = todayConversations.reduce(
    (sum, c) => sum + Math.ceil((c.durationSeconds || 0) / 60), 0
  );

  const pendingMemos = memos.filter((m) => m.status === 'open');
  const hasUsage = totalUsage > 0;

  const navItems = [
    { label: '会話の記録', href: '/family/conversations', count: conversations.length },
    { label: 'メモ確認', href: '/family/memos', count: pendingMemos.length, badge: true },
    { label: '家族連絡先管理', href: '/family/contacts' },
    { label: '設定', href: '/family/settings' },
  ];

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <PageHeader title="今日の様子" />

      <Card className="mb-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">本日の利用回数</span>
            <span className="font-bold">{totalUsage}回</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">最後の利用</span>
            <span className="font-bold">{lastUsedText}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">合計会話時間</span>
            <span className="font-bold">{totalTalkMinutes}分</span>
          </div>
        </div>
      </Card>

      <Card className="mb-4">
        <h3 className="font-bold mb-2">利用状況</h3>
        <p className="text-base text-gray-600">・今日のお話 {todayTalkCount}回</p>
        <p className="text-base text-gray-600">・前の会話を振り返る {todayPreviousCount}回</p>
        <p className="text-base text-gray-600">・家族に連絡 {todayContactCount}回</p>
      </Card>

      <Card className={`mb-6 ${hasUsage ? '!bg-green-50' : '!bg-orange-50'}`}>
        {hasUsage ? (
          <>
            <p className="text-lg font-bold text-main">今日は利用できています</p>
            <p className="text-base text-gray-600">積極的に会話ができていますね</p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold text-sub-orange">今日はまだ利用がありません</p>
            <p className="text-base text-gray-600">お声がけをおすすめします</p>
          </>
        )}
      </Card>

      <div className="flex flex-col gap-3">
        {navItems.map((item) => (
          <Card key={item.href} onClick={() => router.push(item.href)} className="!p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                {item.count !== undefined && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      item.badge && item.count > 0
                        ? 'bg-danger text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                <span className="text-gray-400 text-xl">→</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <button
        onClick={() => router.push('/')}
        className="mt-8 text-center text-main text-lg underline cursor-pointer"
      >
        母側の画面へ
      </button>
    </main>
  );
}
