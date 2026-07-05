'use client';

import { Conversation } from '@/types';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';

const MOOD_MAP: Record<string, string> = {
  '良い': '😊',
  '普通': '🙂',
  'やや疲れ気味': '😐',
  '不安': '😟',
};

export default function ConversationCard({
  conversation,
  onClick,
}: {
  conversation: Conversation;
  onClick?: () => void;
}) {
  const moodEmoji = conversation.mood ? (MOOD_MAP[conversation.mood] || '🙂') : '';
  const minutes = conversation.durationSeconds
    ? Math.ceil(conversation.durationSeconds / 60)
    : undefined;

  return (
    <Card onClick={onClick}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-gray-500">{formatDate(conversation.startedAt)}</p>
          {conversation.mainTopics && conversation.mainTopics.length > 0 && (
            <p className="text-base text-gray-400 mt-0.5">
              主な話題: {conversation.mainTopics.join('、')}
            </p>
          )}
          <p className="text-lg mt-1 font-medium">
            {conversation.summaryForMother || 'お話の記録'}
          </p>
        </div>
        {moodEmoji && (
          <span className="text-3xl ml-3">{moodEmoji}</span>
        )}
      </div>
      {minutes && (
        <p className="text-sm text-gray-400 mt-2">
          {minutes}分間のお話
        </p>
      )}
    </Card>
  );
}
