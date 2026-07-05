'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import LargeButton from '@/components/ui/LargeButton';
import { generateId } from '@/lib/utils';

export default function TextMessagePage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  const { familyId } = use(params);
  const router = useRouter();
  const { addFamilyMessage, addUsageLog, profiles } = useApp();
  const profile = profiles.find((p) => p.id === familyId);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    addFamilyMessage({
      id: generateId(),
      fromUserId: 'mother-1',
      toProfileId: familyId,
      messageText: text.trim(),
      inputMethod: 'text',
      status: 'saved',
      createdAt: new Date(),
    });
    addUsageLog('family_contact', 'send');
    setSent(true);
  };

  if (sent) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
        <div className="text-center">
          <p className="text-6xl mb-4">✉️</p>
          <p className="text-2xl font-bold text-main mb-2">送りました！</p>
          <p className="text-lg text-gray-500 mb-8">
            {profile?.displayName}さんにメッセージを送りました
          </p>
          <button
            onClick={() => router.push('/')}
            className="text-main text-lg underline cursor-pointer"
          >
            ホームにもどる
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href={`/contact/${familyId}/message`} />
      <PageHeader title="文字でメッセージ" />

      <div className="flex flex-col gap-4 mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ここに入力してください"
          rows={5}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-lg focus:outline-none focus:border-main resize-none"
        />
        <LargeButton onClick={handleSend} disabled={!text.trim()}>
          送る
        </LargeButton>
      </div>
    </main>
  );
}
