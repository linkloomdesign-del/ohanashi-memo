'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import LargeButton from '@/components/ui/LargeButton';

export default function PreviousPage() {
  const router = useRouter();
  const { conversationCards } = useApp();
  const motherCards = conversationCards.filter((c) => c.displayToMother);

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href="/" />
      <PageHeader title="前の会話を振り返る" />

      {motherCards.length === 0 ? (
        <p className="text-center text-gray-400 mt-8 text-lg">
          まだおはなしがありません
        </p>
      ) : (
        <>
          <p className="text-lg text-gray-500 mb-4">前に話した内容があります。</p>
          <div className="flex flex-col gap-4">
            {motherCards.map((card) => (
              <Card key={card.id}>
                <p className="text-xl font-bold">{card.title}</p>
                <p className="text-base text-gray-600 mt-1">{card.body}</p>
                <div className="mt-3">
                  <LargeButton
                    onClick={() => router.push('/talk')}
                    variant="primary"
                  >
                    この話をする
                  </LargeButton>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
