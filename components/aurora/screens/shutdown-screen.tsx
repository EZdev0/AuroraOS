'use client';

import { useAurora } from '@/context/aurora-context';
import { PowerOff } from 'lucide-react';

export default function ShutdownScreen() {
  const { userSettings } = useAurora();

  const T = userSettings.language === 'de' ? {
    shuttingDown: "Wird heruntergefahren...",
  } : {
    shuttingDown: "Shutting down...",
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-black text-white animate-fade-out">
      <div className="flex flex-col items-center gap-4">
        <PowerOff className="w-12 h-12 text-muted-foreground" />
        <h1 className="font-headline text-4xl text-muted-foreground">{T.shuttingDown}</h1>
      </div>
    </div>
  );
}
