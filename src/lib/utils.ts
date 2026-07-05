export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getMoodEmoji(score: number): string {
  if (score >= 4) return '😊';
  if (score >= 3) return '🙂';
  if (score >= 2) return '😐';
  return '😔';
}
