'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import LargeButton from '@/components/ui/LargeButton';

export default function MessageMethodPage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  const { familyId } = use(params);
  const router = useRouter();
  const { profiles } = useApp();
  const profile = profiles.find((p) => p.id === familyId);

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href={`/contact/${familyId}`} />
      <PageHeader title={`${profile?.displayName || ''}にメッセージ`} />

      <p className="text-center text-lg text-gray-500 mb-8">
        どうやって送りますか？
      </p>

      <div className="flex flex-col gap-4">
        <LargeButton
          onClick={() => router.push(`/contact/${familyId}/message/simple`)}
          variant="primary"
        >
          かんたんメッセージ
        </LargeButton>
        <LargeButton
          onClick={() => router.push(`/contact/${familyId}/message/voice`)}
          variant="secondary"
        >
          声で入力する
        </LargeButton>
        <LargeButton
          onClick={() => router.push(`/contact/${familyId}/message/text`)}
          variant="orange"
        >
          文字で入力する
        </LargeButton>
      </div>
    </main>
  );
}
