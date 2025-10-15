'use client';

import { useAurora } from '@/context/aurora-context';
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function SetupUpdatesScreen() {
  const { finishSetup, userSettings } = useAurora();
  const [status, setStatus] = useState("checking");

  const T = userSettings.language === 'de' ? {
    title: "Einrichtung wird abgeschlossen",
    checking: "Suche nach finalen Konfigurationen...",
    ready: "Alles bereit!",
    restarting: "Das System wird in Kürze neu gestartet...",
  } : {
    title: "Finalizing Setup",
    checking: "Checking for final configurations...",
    ready: "All set!",
    restarting: "The system will restart shortly...",
  };

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatus("ready");
    }, 2000);

    const timer2 = setTimeout(() => {
      finishSetup();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [finishSetup]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-background animate-fade-in">
      <div className="text-center">
        <h1 className="font-headline text-5xl text-primary mb-4">{T.title}</h1>
        {status === "checking" ? (
          <div className="flex items-center justify-center gap-4">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-muted-foreground">{T.checking}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-xl">{T.ready}</p>
            <p className="text-muted-foreground">{T.restarting}</p>
          </div>
        )}
      </div>
    </div>
  );
}
