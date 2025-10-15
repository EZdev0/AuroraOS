'use client';

import { useAurora } from '@/context/aurora-context';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function SetupWelcomeScreen() {
  const { setOsState, userSettings } = useAurora();

  const T = userSettings.language === 'de' ? {
    welcome: "Willkommen bei AuroraOS",
    tagline: "Erleben Sie die Zukunft. Heute.",
    getStarted: "Los geht's",
  } : {
    welcome: "Welcome to AuroraOS",
    tagline: "Experience the future. Today.",
    getStarted: "Get Started",
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-background animate-fade-in">
      <div className="text-center">
        <h1 className="font-headline text-7xl text-primary mb-4" style={{ textShadow: '0 0 20px hsl(var(--primary))' }}>
          {T.welcome}
        </h1>
        <p className="text-2xl text-muted-foreground mb-12">{T.tagline}</p>
        <Button size="lg" onClick={() => setOsState('setup_language')}>
          {T.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
