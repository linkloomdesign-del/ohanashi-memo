'use client';

import { Memo, MEMO_CATEGORY_LABELS } from '@/types';
import Card from '@/components/ui/Card';

interface MemoCardProps {
  memo: Memo;
  onDone?: () => void;
  onKeep?: () => void;
  onDelete?: () => void;
}

const categoryColors: Record<string, string> = {
  shopping: 'bg-green-100 text-green-700',
  todo: 'bg-blue-100 text-blue-700',
  schedule: 'bg-purple-100 text-purple-700',
  health: 'bg-red-100 text-red-700',
  family_message: 'bg-yellow-100 text-yellow-700',
  general: 'bg-gray-100 text-gray-700',
};

export default function MemoCard({ memo, onDone, onKeep, onDelete }: MemoCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-2 flex-wrap">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[memo.memoType]}`}
        >
          {MEMO_CATEGORY_LABELS[memo.memoType]}
        </span>
        {memo.familyConfirmRequired && (
          <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white font-medium">
            確認が必要
          </span>
        )}
      </div>
      <p className="text-lg font-medium mt-2">{memo.title}</p>
      {memo.items && memo.items.length > 0 && (
        <ul className="mt-1 text-base text-gray-600">
          {memo.items.map((item, i) => (
            <li key={i}>・{item}</li>
          ))}
        </ul>
      )}
      <p className="text-sm text-gray-400 mt-1">
        {memo.createdAt.toLocaleDateString('ja-JP')}
      </p>
      {memo.status === 'open' && (onDone || onKeep || onDelete) && (
        <div className="flex gap-2 mt-3">
          {onDone && (
            <button
              onClick={onDone}
              className="px-4 py-2 bg-main text-white rounded-xl text-sm font-medium cursor-pointer"
            >
              {memo.familyConfirmRequired ? '確認' : '完了'}
            </button>
          )}
          {onKeep && (
            <button
              onClick={onKeep}
              className="px-4 py-2 bg-sub-blue text-white rounded-xl text-sm font-medium cursor-pointer"
            >
              残す
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl text-sm font-medium cursor-pointer"
            >
              削除
            </button>
          )}
        </div>
      )}
      {memo.status === 'done' && (
        <span className="inline-block mt-2 text-xs text-main font-medium">完了</span>
      )}
    </Card>
  );
}
