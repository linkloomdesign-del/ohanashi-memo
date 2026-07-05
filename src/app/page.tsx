'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import LargeButton from '@/components/ui/LargeButton';
import Card from '@/components/ui/Card';
import { MEMO_CATEGORY_LABELS } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const { memos } = useApp();

  const [now, setNow] = useState<Date | null>(null);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  useEffect(() => {
    setNow(new Date());
  }, []);

  const openMemos = memos.filter((m) => m.status === 'open');
  const memosByType = openMemos.reduce((acc, m) => {
    acc[m.memoType] = (acc[m.memoType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <div className="text-center mb-6 mt-4">
        {now ? (
          <>
            <p className="text-xl text-gray-500">今日は</p>
            <p className="text-4xl font-bold text-foreground mt-1">
              {now.getMonth() + 1}月{now.getDate()}日
            </p>
            <p className="text-2xl font-medium text-foreground">
              {weekdays[now.getDay()]}曜日です
            </p>
          </>
        ) : (
          <p className="text-xl text-gray-500">&nbsp;</p>
        )}
      </div>

      {openMemos.length > 0 && (
        <Card className="mb-6" onClick={() => router.push('/memos')}>
          <h2 className="text-lg font-bold mb-2">今日のメモがあります</h2>
          {Object.entries(memosByType).map(([type, count]) => (
            <p key={type} className="text-base text-gray-600 py-0.5">
              ・{MEMO_CATEGORY_LABELS[type as keyof typeof MEMO_CATEGORY_LABELS]} {count}件
            </p>
          ))}
          <p className="text-sm text-main mt-2 font-medium">タップして確認 →</p>
        </Card>
      )}

      <div className="flex flex-col gap-4 mt-auto">
        <LargeButton onClick={() => router.push('/talk')} variant="primary">
          今日のおはなし
        </LargeButton>
        <LargeButton onClick={() => router.push('/memos')} variant="secondary">
          メモをみる
        </LargeButton>
        <LargeButton onClick={() => router.push('/previous')} variant="secondary">
          前の会話を振り返る
        </LargeButton>
        <LargeButton onClick={() => router.push('/contact')} variant="orange">
          家族に連絡
        </LargeButton>
      </div>
    </main>
  );
}
