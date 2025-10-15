'use client';

import { useAurora } from '@/context/aurora-context';
import { useEffect, useState } from 'react';

const bootSteps = [
  "AuroraOS BIOS v3.0.0",
  "Initializing quantum core...",
  "Calibrating neural network...",
  "Detecting storage devices...",
  "  - Found: Aurora Virtual Drive (512GB)",
  "Checking file system integrity...",
  "Loading kernel (aurora_kernel.core)...",
  "Mounting virtual file system...",
  "Starting system services...",
  "All systems nominal.",
  "Handing over to OS...",
];

export default function BootScreen() {
  const { setOsState, isInstalled, userSettings } = useAurora();
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);

  useEffect(() => {
    const timeouts = bootSteps.map((step, index) => {
      return setTimeout(() => {
        setVisibleSteps(prev => [...prev, step]);
      }, index * 150);
    });

    const finalTimeout = setTimeout(() => {
      if (userSettings.crashedFiles && userSettings.crashedFiles.length > 0) {
        setOsState('bsod');
      } else if (!isInstalled) {
        setOsState('bios');
      } else {
        setOsState('login');
      }
    }, bootSteps.length * 150 + 500);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finalTimeout);
    };
  }, [setOsState, isInstalled, userSettings.crashedFiles]);

  return (
    <div className="flex h-full w-full flex-col items-start justify-start bg-black p-4 font-code text-lg text-green-400">
      {visibleSteps.map((step, index) => (
        <div key={index} className="flex">
          <span className="flex-shrink-0">&gt;</span>
          <p className="ml-2 whitespace-pre-wrap">{step}</p>
        </div>
      ))}
    </div>
  );
}
