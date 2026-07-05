'use client';

import { useApp } from '@/context/AppContext';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import { MEMO_CATEGORY_LABELS, MemoCategory } from '@/types';

const CATEGORY_ICONS: Record<MemoCategory, string> = {
  shopping: '🛒',
  todo: '✅',
  schedule: '📅',
  health: '💊',
  family_message: '💬',
  general: '📝',
};

export default function MemosPage() {
  const { memos, updateMemoStatus } = useApp();
  const openMemos = memos.filter((m) => m.status === 'open');
  const doneMemos = memos.filter((m) => m.status === 'done');

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href="/" />
      <PageHeader title="メモをみる" />

      {openMemos.length === 0 && doneMemos.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-xl text-gray-400">メモはまだありません</p>
          <p className="text-base text-gray-400 mt-2">
            おはなしの中で出てきた内容が<br />自動でメモになります
          </p>
        </div>
      )}

      {openMemos.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-main mb-3">
            やること・覚えておくこと ({openMemos.length}件)
          </h2>
          <div className="flex flex-col gap-3">
            {openMemos.map((memo) => (
              <Card key={memo.id}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">
                    {CATEGORY_ICONS[memo.memoType]}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">
                      {MEMO_CATEGORY_LABELS[memo.memoType]}
                    </p>
                    <p className="text-xl font-bold mt-0.5">{memo.title}</p>
                    {memo.items && memo.items.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {memo.items.map((item, i) => (
                          <li key={i} className="text-lg text-gray-700">
                            ・{item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => updateMemoStatus(memo.id, 'done')}
                    className="flex-1 bg-main text-white rounded-xl py-2 text-lg font-bold cursor-pointer"
                  >
                    できた！
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {doneMemos.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-400 mb-3">
            おわったメモ ({doneMemos.length}件)
          </h2>
          <div className="flex flex-col gap-3">
            {doneMemos.map((memo) => (
              <Card key={memo.id} className="opacity-60">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">
                    {CATEGORY_ICONS[memo.memoType]}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">
                      {MEMO_CATEGORY_LABELS[memo.memoType]}
                    </p>
                    <p className="text-xl font-bold mt-0.5 line-through text-gray-400">
                      {memo.title}
                    </p>
                  </div>
                  <span className="text-2xl">✅</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
