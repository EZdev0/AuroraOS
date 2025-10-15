'use client';

import { useAurora } from '@/context/aurora-context';
import { Loader } from 'lucide-react';

export default function RestartScreen() {
  const { userSettings } = useAurora();

  const T = userSettings.language === 'de' ? {
    restarting: "Wird neu gestartet...",
  } : {
    restarting: "Restarting...",
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <Loader className="w-12 h-12 animate-spin text-primary" />
        <h1 className="font-headline text-4xl">{T.restarting}</h1>
      </div>
    </div>
  );
}
