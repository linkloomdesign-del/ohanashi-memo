'use client';

import { Profile } from '@/types';
import Card from '@/components/ui/Card';

export default function ContactCard({
  profile,
  onClick,
}: {
  profile: Profile;
  onClick?: () => void;
}) {
  return (
    <Card onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-main/20 flex items-center justify-center text-2xl font-bold text-main">
          {profile.displayName[0]}
        </div>
        <div>
          <p className="text-xl font-bold">{profile.displayName}</p>
          <p className="text-sm text-gray-500">{profile.relationship}</p>
          {profile.phone && (
            <p className="text-sm text-gray-400">{profile.phone}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
