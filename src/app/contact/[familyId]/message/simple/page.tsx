'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import LargeButton from '@/components/ui/LargeButton';
import { SIMPLE_MESSAGES } from '@/types';
import { generateId } from '@/lib/utils';

export default function SimpleMessagePage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  const { familyId } = use(params);
  const router = useRouter();
  const { addFamilyMessage, addUsageLog, profiles } = useApp();
  const profile = profiles.find((p) => p.id === familyId);
  const [selected, setSelected] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSelect = (message: string) => {
    setSelected(message);
    setConfirming(true);
  };

  const handleSend = () => {
    addFamilyMessage({
      id: generateId(),
      fromUserId: 'mother-1',
      toProfileId: familyId,
      messageText: selected,
      inputMethod: 'simple',
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
          <p className="text-lg text-gray-500 mb-2">
            {profile?.displayName}さんに
          </p>
          <p className="text-xl font-medium mb-8">「{selected}」</p>
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

  if (confirming) {
    return (
      <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
        <BackButton href={`/contact/${familyId}/message/simple`} />
        <PageHeader title={`${profile?.displayName}に送ります`} />

        <div className="text-center my-8">
          <p className="text-2xl font-medium">「{selected}」</p>
        </div>

        <div className="flex flex-col gap-4">
          <LargeButton onClick={handleSend} variant="primary">
            送る
          </LargeButton>
          <LargeButton onClick={() => setConfirming(false)} variant="secondary">
            もどる
          </LargeButton>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href={`/contact/${familyId}/message`} />
      <PageHeader title="かんたんメッセージ" />

      <div className="flex flex-col gap-3 mt-4">
        {SIMPLE_MESSAGES.map((msg) => (
          <button
            key={msg}
            onClick={() => handleSelect(msg)}
            className="bg-white rounded-2xl shadow-md p-5 text-xl font-medium text-foreground hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer text-left"
          >
            {msg}
          </button>
        ))}
      </div>
    </main>
  );
}
