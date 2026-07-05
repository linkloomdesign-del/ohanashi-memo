'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { getAIResponse, getOpeningMessage, summarizeConversation } from '@/services/ai/chatService';
import { extractMemosFromConversation } from '@/services/ai/memoExtractionService';
import { speakText, stopSpeaking } from '@/services/ai/textToSpeechService';
import ChatMessageComponent from '@/components/mother/ChatMessage';
import LargeButton from '@/components/ui/LargeButton';
import BackButton from '@/components/ui/BackButton';
import MicStatus from '@/components/mother/MicStatus';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { ChatMessage, Conversation } from '@/types';
import { generateId } from '@/lib/utils';

type TalkStatus = 'speaking' | 'listening' | 'thinking' | 'finished';

export default function TalkPage() {
  const router = useRouter();
  const { conversations, memos, addConversation, addConversationCard, addMemo, addUsageLog } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [status, setStatus] = useState<TalkStatus>('speaking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef(generateId());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishingRef = useRef(false);
  const { isListening, transcript, interimTranscript, isSupported, startListening, stopListening } = useSpeechRecognition();
  const wasListeningRef = useRef(false);

  // When voice transcript is ready, put it in the input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Pause mic while AI is speaking, resume when done
  const prevStatusRef = useRef<TalkStatus>(status);
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = status;

    // When entering speaking/thinking, stop mic if it was on
    if ((status === 'speaking' || status === 'thinking') && prev === 'listening') {
      if (isListening) {
        wasListeningRef.current = true;
        stopListening();
      }
    }
    // When returning to listening after speaking, resume mic if it was on
    if (status === 'listening' && (prev === 'speaking' || prev === 'thinking')) {
      if (wasListeningRef.current) {
        wasListeningRef.current = false;
        // Small delay to avoid picking up tail-end of speech synthesis
        setTimeout(() => startListening(), 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    async function init() {
      const lastConv = conversations[0] || null;
      const openMemos = memos.filter((m) => m.status === 'open');
      const daysSinceLastUse = lastConv
        ? Math.floor((Date.now() - lastConv.startedAt.getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      const openingText = await getOpeningMessage(lastConv, openMemos, daysSinceLastUse);
      const greeting: ChatMessage = {
        id: generateId(),
        conversationId: conversationId.current,
        sender: 'ai',
        content: openingText,
        inputType: 'system',
        createdAt: new Date(),
      };
      setMessages([greeting]);
      setStatus('speaking');
      await speakText(openingText);
      setStatus('listening');
    }

    init();
    addUsageLog('today_talk', 'start');

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (timeLeft === 0 && status !== 'finished') {
      handleFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || status === 'finished') return;

    const userMessage: ChatMessage = {
      id: generateId(),
      conversationId: conversationId.current,
      sender: 'mother',
      content: input.trim(),
      inputType: 'text',
      createdAt: new Date(),
    };

    const currentInput = input.trim();
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStatus('thinking');

    const history = messages.map((m) => ({ sender: m.sender, content: m.content }));
    const aiText = await getAIResponse(currentInput, history);

    const aiMessage: ChatMessage = {
      id: generateId(),
      conversationId: conversationId.current,
      sender: 'ai',
      content: aiText,
      inputType: 'system',
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
    setStatus('speaking');
    await speakText(aiText);
    setStatus('listening');
  }, [input, isLoading, status, messages]);

  const handleFinish = useCallback(async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    stopSpeaking();
    if (timerRef.current) clearInterval(timerRef.current);

    const endText = '今日はここまでにしましょう。\nお話できてよかったです。\nまた少しお話しましょうね。';
    const endMessage: ChatMessage = {
      id: generateId(),
      conversationId: conversationId.current,
      sender: 'ai',
      content: endText,
      inputType: 'system',
      createdAt: new Date(),
    };

    setMessages((prev) => {
      const allMessages = [...prev, endMessage];
      processConversationEnd(allMessages);
      return allMessages;
    });

    setStatus('speaking');
    await speakText(endText);
    setStatus('finished');

    addUsageLog('today_talk', 'end');
  }, [addUsageLog]);

  async function processConversationEnd(allMessages: ChatMessage[]) {
    // Summarize
    const summary = await summarizeConversation(allMessages);

    const conversation: Conversation = {
      id: conversationId.current,
      userId: 'mother-1',
      startedAt: allMessages[0].createdAt,
      endedAt: new Date(),
      durationSeconds: 180 - timeLeft,
      mode: 'text',
      summaryForMother: summary.summaryForMother,
      summaryForFamily: summary.summaryForFamily,
      mainTopics: summary.mainTopics,
      mood: summary.mood,
      concernNotes: summary.concernNotes || undefined,
      nextOpeningMessage: summary.nextOpeningMessage || undefined,
      familySuggestion: summary.familySuggestion || undefined,
      messages: allMessages,
      createdAt: new Date(),
    };
    addConversation(conversation);

    // Create conversation card
    addConversationCard({
      id: generateId(),
      conversationId: conversationId.current,
      title: summary.cardTitle,
      body: summary.cardBody,
      category: 'general',
      displayToMother: true,
      createdAt: new Date(),
    });

    // Extract memos
    const extractedMemos = await extractMemosFromConversation(
      conversationId.current,
      allMessages.map((m) => ({ sender: m.sender, content: m.content }))
    );
    const now = new Date();
    for (const m of extractedMemos) {
      addMemo({ ...m, id: generateId(), createdAt: now, updatedAt: now });
    }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const statusLabels: Record<TalkStatus, string> = {
    speaking: 'AIがお話しています',
    listening: '聞いています',
    thinking: '少し考えています',
    finished: 'お話が終わりました',
  };

  return (
    <main className="flex-1 flex flex-col max-w-lg mx-auto w-full h-screen">
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <BackButton href="/" />
        <div className="text-center">
          <p className="text-xs text-gray-400">{statusLabels[status]}</p>
          <span className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-danger' : 'text-main'}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <span className="text-gray-400 animate-pulse">少し考えています...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {status === 'finished' ? (
        <div className="p-4 border-t border-gray-100">
          <p className="text-center text-lg mb-3 text-main font-medium">
            おつかれさまでした！
          </p>
          <LargeButton onClick={() => router.push('/')}>
            ホームにもどる
          </LargeButton>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-100">
          {isSupported && (
            <div className="flex flex-col items-center mb-3">
              <MicStatus isRecording={isListening} />
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-md transition-all cursor-pointer mt-2 ${
                  isListening
                    ? 'bg-danger text-white animate-pulse'
                    : 'bg-main text-white'
                }`}
              >
                {isListening ? '■' : '🎤'}
              </button>
              {isListening && interimTranscript && (
                <p className="text-sm text-gray-400 mt-1">{interimTranscript}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {isListening ? 'タップで止める' : '話してください'}
              </p>
            </div>
          )}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ここに書いてね..."
              className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-lg focus:outline-none focus:border-main"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-main text-white rounded-2xl px-6 py-3 text-lg font-bold disabled:opacity-50 cursor-pointer"
            >
              送る
            </button>
          </div>
          <LargeButton onClick={handleFinish} variant="danger">
            お話を終わる
          </LargeButton>
        </div>
      )}
    </main>
  );
}
