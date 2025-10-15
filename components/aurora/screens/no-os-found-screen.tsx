'use client';
import { useAurora } from '@/context/aurora-context';
import { useEffect } from 'react';

export default function NoOsFoundScreen() {
  const { setOsState } = useAurora();

  useEffect(() => {
    const timer = setTimeout(() => {
      setOsState('bios');
    }, 4000);

    return () => clearTimeout(timer);
  }, [setOsState]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-black font-code text-lg text-white">
      <p>No operating system found. Entering BIOS setup...</p>
    </div>
  );
}
