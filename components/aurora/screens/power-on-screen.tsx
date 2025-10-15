'use client';
import { useAurora } from '@/context/aurora-context';
import { Power } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function PowerOnScreen() {
  const { setOsState } = useAurora();
  const isMobile = useIsMobile();

  const handlePowerOn = () => {
    // The fullscreen logic is now handled globally in page.tsx,
    // so we just need to change the OS state here.
    setOsState('booting');
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12 bg-black text-foreground">
      <h1 className="font-headline text-7xl text-primary" style={{ textShadow: '0 0 20px hsl(var(--primary))' }}>
        AuroraOS
      </h1>
      <button
        onClick={handlePowerOn}
        aria-label="Power on AuroraOS"
        className="group relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/50 text-primary/70 transition-all duration-300 hover:border-primary hover:text-primary active:scale-95 animate-glow"
        style={{'--glow-color': 'hsl(var(--primary))'} as React.CSSProperties}
      >
        <Power className="h-16 w-16 transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute -bottom-10 text-center text-sm text-muted-foreground transition-opacity duration-300 group-hover:opacity-100 sm:opacity-0">
          {isMobile ? 'Tap to boot' : 'Click to boot'}
        </div>
      </button>
    </div>
  );
}
