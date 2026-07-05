'use client';

import { ChatMessage as ChatMessageType } from '@/types';
import { formatTime } from '@/lib/utils';

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.sender === 'mother';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3 text-lg
          ${isUser
            ? 'bg-main text-white rounded-br-sm'
            : 'bg-white text-foreground shadow-sm rounded-bl-sm'
          }
        `}
      >
        <p>{message.content}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-green-100' : 'text-gray-400'}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
