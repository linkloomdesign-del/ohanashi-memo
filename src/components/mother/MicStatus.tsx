'use client';

export default function MicStatus({ isRecording }: { isRecording: boolean }) {
  return (
    <div className="flex items-center gap-2 text-lg">
      <div
        className={`w-4 h-4 rounded-full ${
          isRecording ? 'bg-danger animate-pulse' : 'bg-gray-300'
        }`}
      />
      <span className="text-gray-500">
        {isRecording ? '録音中...' : '待機中'}
      </span>
    </div>
  );
}
