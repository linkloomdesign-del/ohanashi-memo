'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import LargeButton from '@/components/ui/LargeButton';

export default function FamilyContactPage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  const { familyId } = use(params);
  const router = useRouter();
  const { profiles } = useApp();
  const profile = profiles.find((p) => p.id === familyId);

  if (!profile) {
    return (
      <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
        <BackButton href="/contact" />
        <p className="text-center text-gray-400 mt-8">見つかりませんでした</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href="/contact" />
      <PageHeader title={`${profile.displayName}に連絡`} />

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-main/20 flex items-center justify-center text-4xl font-bold text-main mb-2">
          {profile.displayName[0]}
        </div>
        <p className="text-gray-500">{profile.relationship}</p>
      </div>

      <div className="flex flex-col gap-4">
        {profile.phone && (
          <LargeButton
            onClick={() => window.location.href = `tel:${profile.phone}`}
            variant="primary"
          >
            電話する
          </LargeButton>
        )}
        <LargeButton
          onClick={() => router.push(`/contact/${familyId}/message`)}
          variant="secondary"
        >
          メッセージを送る
        </LargeButton>
      </div>
    </main>
  );
}
