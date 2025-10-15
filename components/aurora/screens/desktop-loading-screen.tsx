'use client';

import { useAurora } from '@/context/aurora-context';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export default function DesktopLoadingScreen() {
  const { setOsState, userSettings } = useAurora();

  useEffect(() => {
    const timer = setTimeout(() => {
      setOsState('desktop');
    }, 3000); // Simulate loading time

    return () => clearTimeout(timer);
  }, [setOsState]);

  const T = userSettings.language === 'de' ? {
    loading: "Desktop wird geladen...",
  } : {
    loading: "Loading Desktop...",
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <Loader className="w-12 h-12 animate-spin text-primary" />
        <h1 className="font-headline text-4xl">{T.loading}</h1>
      </div>
    </div>
  );
}
