'use client';

import { useState } from 'react';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';

export default function FamilySettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [conversationDuration, setConversationDuration] = useState(3);

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href="/family" />
      <PageHeader title="設定" />

      <div className="flex flex-col gap-4 mt-4">
        <Card>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-medium">通知</p>
              <p className="text-sm text-gray-400">お話の完了やメモの通知</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-14 h-8 rounded-full transition-colors cursor-pointer ${
                notificationsEnabled ? 'bg-main' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>

        <Card>
          <p className="text-lg font-medium mb-2">会話の時間（分）</p>
          <div className="flex gap-3">
            {[1, 3, 5, 10].map((min) => (
              <button
                key={min}
                onClick={() => setConversationDuration(min)}
                className={`px-4 py-2 rounded-xl font-medium cursor-pointer ${
                  conversationDuration === min
                    ? 'bg-main text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {min}分
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-lg font-medium">アプリバージョン</p>
          <p className="text-sm text-gray-400">おはなしメモ v0.1.0 (MVP)</p>
        </Card>
      </div>
    </main>
  );
}
