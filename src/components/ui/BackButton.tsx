'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ href }: { href?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => (href ? router.push(href) : router.back())}
      className="flex items-center gap-1 text-main text-lg font-medium py-2 cursor-pointer"
    >
      <span className="text-2xl">←</span>
      <span>もどる</span>
    </button>
  );
}
