'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import BackButton from '@/components/ui/BackButton';
import PageHeader from '@/components/ui/PageHeader';
import ContactCard from '@/components/family/ContactCard';

export default function ContactPage() {
  const router = useRouter();
  const { profiles } = useApp();

  return (
    <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <BackButton href="/" />
      <PageHeader title="家族に連絡" />
      <p className="text-lg text-gray-500 text-center mb-4">誰に連絡しますか？</p>

      <div className="flex flex-col gap-4">
        {profiles.map((profile) => (
          <ContactCard
            key={profile.id}
            profile={profile}
            onClick={() => router.push(`/contact/${profile.id}`)}
          />
        ))}
      </div>
    </main>
  );
}
