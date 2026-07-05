'use client';

import Card from '@/components/ui/Card';

interface UsageSummaryProps {
  conversationCount: number;
  memoCount: number;
  messageCount: number;
  lastActive?: Date;
}

export default function UsageSummary({
  conversationCount,
  memoCount,
  messageCount,
  lastActive,
}: UsageSummaryProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-3">今日のようす</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-3xl font-bold text-main">{conversationCount}</p>
          <p className="text-sm text-gray-500">お話</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-sub-blue">{memoCount}</p>
          <p className="text-sm text-gray-500">メモ</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-sub-orange">{messageCount}</p>
          <p className="text-sm text-gray-500">連絡</p>
        </div>
      </div>
      {lastActive && (
        <p className="text-sm text-gray-400 mt-3 text-center">
          最終利用: {lastActive.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </Card>
  );
}
