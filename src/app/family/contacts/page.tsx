'use client';

import { useApp } from '@/context/AppContext';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import { formatTime } from '@/lib/utils';

const INPUT_METHOD_LABELS: Record<string, string> = {
  simple: 'かんたんメッセージ',
  voice: '音声入力',
  text: '文字入力',
};

export default function FamilyContactsPage() {
  const { profiles, familyMessages } = useApp();

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href="/family" />
      <PageHeader title="家族連絡先管理" />

      <h3 className="font-bold text-lg mb-3">登録済みの家族</h3>
      <div className="flex flex-col gap-4">
        {profiles.map((profile) => {
          const messages = familyMessages
            .filter((m) => m.toProfileId === profile.id)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

          return (
            <Card key={profile.id}>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full bg-main/20 flex items-center justify-center text-xl font-bold text-main">
                  {profile.displayName[0]}
                </div>
                <div>
                  <p className="text-xl font-bold">{profile.displayName}</p>
                  <p className="text-sm text-gray-500">
                    {profile.relationship}
                    {profile.messageDestination ? ` / ${profile.messageDestination}` : ''}
                  </p>
                </div>
                {profile.isPrimaryContact && (
                  <span className="ml-auto text-xs bg-main text-white px-2 py-1 rounded-full">
                    代表
                  </span>
                )}
              </div>
              {profile.phone && (
                <p className="text-sm text-gray-400 ml-16">電話番号: {profile.phone}</p>
              )}

              {messages.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-500 mb-1">連絡履歴</p>
                  {messages.slice(0, 3).map((msg) => (
                    <p key={msg.id} className="text-sm text-gray-600 py-0.5">
                      {formatTime(msg.createdAt)}　{profile.displayName}へ「{msg.messageText}」（{INPUT_METHOD_LABELS[msg.inputMethod]}）
                    </p>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </main>
  );
}
