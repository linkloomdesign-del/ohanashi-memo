'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import LargeButton from '@/components/ui/LargeButton';
import MicStatus from '@/components/mother/MicStatus';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { generateId } from '@/lib/utils';

export default function VoiceMessagePage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  const { familyId } = use(params);
  const router = useRouter();
  const { addFamilyMessage, addUsageLog, profiles } = useApp();
  const profile = profiles.find((p) => p.id === familyId);
  const [sent, setSent] = useState(false);
  const [finalText, setFinalText] = useState('');
  const { isListening, transcript, interimTranscript, isSupported, startListening, stopListening } = useSpeechRecognition();

  // Capture transcript when recording stops
  useEffect(() => {
    if (!isListening && transcript) {
      setFinalText(transcript);
    }
  }, [isListening, transcript]);

  const handleToggleRecord = () => {
    if (isListening) {
      stopListening();
    } else {
      setFinalText('');
      startListening();
    }
  };

  const displayText = !isListening ? (finalText || transcript) : '';

  const handleSend = () => {
    const text = finalText || transcript;
    if (!text) return;
    addFamilyMessage({
      id: generateId(),
      fromUserId: 'mother-1',
      toProfileId: familyId,
      messageText: text,
      inputMethod: 'voice',
      status: 'saved',
      createdAt: new Date(),
    });
    addUsageLog('family_contact', 'send');
    setSent(true);
  };

  const handleRetry = () => {
    setFinalText('');
    startListening();
  };

  if (sent) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
        <div className="text-center">
          <p className="text-6xl mb-4">✉️</p>
          <p className="text-2xl font-bold text-main mb-2">送りました！</p>
          <p className="text-lg text-gray-500 mb-8">
            {profile?.displayName}さんにメッセージを送りました
          </p>
          <button
            onClick={() => router.push('/')}
            className="text-main text-lg underline cursor-pointer"
          >
            ホームにもどる
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href={`/contact/${familyId}/message`} />
      <PageHeader title="声でメッセージ" />

      <div className="flex flex-col items-center gap-6 mt-8">
        <MicStatus isRecording={isListening} />

        <p className="text-lg text-gray-500">
          {isListening ? 'もう一度タップで止める' : isSupported ? '話してください' : '音声入力に対応していません'}
        </p>

        <button
          onClick={handleToggleRecord}
          disabled={!isSupported}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl shadow-lg transition-all cursor-pointer ${
            isListening
              ? 'bg-danger text-white animate-pulse'
              : 'bg-main text-white'
          } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isListening ? '■' : '🎤'}
        </button>

        {isListening && interimTranscript && (
          <p className="text-base text-gray-400 animate-pulse">{interimTranscript}</p>
        )}

        {displayText && !isListening && (
          <>
            <div className="w-full bg-white rounded-2xl shadow-md p-4 mt-4">
              <p className="text-sm text-gray-400 mb-1">この内容で送りますか？</p>
              <p className="text-xl font-medium">「{displayText}」</p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <LargeButton onClick={handleSend} variant="primary">
                送る
              </LargeButton>
              <LargeButton onClick={handleRetry} variant="secondary">
                もう一度話す
              </LargeButton>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
