'use client';

import { useApp } from '@/context/AppContext';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import { formatDate, formatTime } from '@/lib/utils';

export default function FamilyConversationsPage() {
  const { conversations } = useApp();

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href="/family" />
      <PageHeader title="会話の記録" />

      {conversations.length === 0 ? (
        <p className="text-center text-gray-400 mt-8 text-lg">
          まだ会話の記録がありません
        </p>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {conversations.map((conv) => {
            const minutes = conv.durationSeconds
              ? Math.ceil(conv.durationSeconds / 60)
              : 0;
            return (
              <Card key={conv.id}>
                <p className="text-sm text-gray-400">
                  {formatDate(conv.startedAt)} {formatTime(conv.startedAt)}
                </p>
                <p className="text-sm text-gray-400">会話時間: {minutes}分</p>

                {conv.mainTopics && conv.mainTopics.length > 0 && (
                  <p className="text-base mt-2">
                    <span className="font-bold">主な話題：</span>
                    {conv.mainTopics.join('、')}
                  </p>
                )}
                {conv.mood && (
                  <p className="text-base">
                    <span className="font-bold">気分：</span>{conv.mood}
                  </p>
                )}
                {conv.concernNotes && (
                  <p className="text-base text-danger">
                    <span className="font-bold">気になる点：</span>{conv.concernNotes}
                  </p>
                )}
                {conv.summaryForFamily && (
                  <p className="text-base mt-2 text-gray-600">
                    {conv.summaryForFamily}
                  </p>
                )}
                {conv.familySuggestion && (
                  <div className="mt-2 p-3 bg-green-50 rounded-xl">
                    <p className="text-sm font-bold text-main">家族の声かけ案</p>
                    <p className="text-base">{conv.familySuggestion}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
