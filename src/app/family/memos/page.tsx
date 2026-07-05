'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import MemoCard from '@/components/family/MemoCard';
import { Memo } from '@/types';

type FilterStatus = 'all' | 'open' | 'done' | 'confirm';

const TABS: { label: string; status: FilterStatus }[] = [
  { label: 'すべて', status: 'all' },
  { label: '未完了', status: 'open' },
  { label: '確認が必要', status: 'confirm' },
  { label: '完了', status: 'done' },
];

export default function FamilyMemosPage() {
  const { memos, updateMemoStatus } = useApp();
  const [activeTab, setActiveTab] = useState<FilterStatus>('all');

  const filteredMemos = memos.filter((m: Memo) => {
    if (m.status === 'deleted') return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'confirm') return m.familyConfirmRequired && m.status === 'open';
    return m.status === activeTab;
  });

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href="/family" />
      <PageHeader title="メモ確認" />

      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.status}
            onClick={() => setActiveTab(tab.status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.status
                ? 'bg-main text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredMemos.length === 0 ? (
        <p className="text-center text-gray-400 mt-8 text-lg">
          メモがありません
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredMemos.map((memo) => (
            <MemoCard
              key={memo.id}
              memo={memo}
              onDone={() => updateMemoStatus(memo.id, 'done')}
              onKeep={() => {/* keep as open */}}
              onDelete={() => updateMemoStatus(memo.id, 'deleted')}
            />
          ))}
        </div>
      )}
    </main>
  );
}
