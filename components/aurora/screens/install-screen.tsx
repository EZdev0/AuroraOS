'use client';
import { useAurora } from '@/context/aurora-context';
import { useEffect, useState } from 'react';
import { Loader, ShieldCheck } from 'lucide-react';

const steps = [
  "Partitioning quantum drive...",
  "Calibrating neural network...",
  "Injecting core kernel (aurora_kernel.core)...",
  "Initializing psychic interface drivers...",
  "Syncing with chronos beacon...",
  "Compiling reality shaders...",
  "Finalizing system integrity matrix...",
];

export default function InstallScreen() {
  const { setOsState } = useAurora();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(timer);
          setCompletedSteps(s => [...s, steps.length -1]);
          setTimeout(() => setOsState('setup_welcome'), 2000);
          return 100;
        }

        const stepProgress = Math.floor(newProgress / (100 / steps.length));
        if (stepProgress > currentStep) {
            setCompletedSteps(s => [...s, currentStep]);
            setCurrentStep(stepProgress);
        }

        return newProgress;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [setOsState, currentStep]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:2rem_2rem] animate-pulse"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-background via-background/80 to-background"></div>

      <div className="relative z-20 w-full max-w-3xl text-center">
        <h1 className="font-headline text-5xl md:text-6xl text-primary mb-2" style={{ textShadow: '0 0 15px hsl(var(--primary))' }}>
            Installing AuroraOS
        </h1>
        <p className="text-muted-foreground text-base md:text-lg mb-8 md:mb-12 animate-[fade-in_1s_ease-out]">
            Your reality is being upgraded. Please remain calm.
        </p>

        <div className="space-y-3 text-left mb-8 md:mb-12 backdrop-blur-sm bg-black/20 border border-primary/20 p-4 md:p-6 rounded-lg shadow-xl shadow-primary/10">
            {steps.map((step, index) => (
                <div
                    key={step}
                    className={`flex items-center gap-4 transition-all duration-500 ease-out ${index <= currentStep ? 'opacity-100' : 'opacity-40'}`}
                    style={{ transform: index <= currentStep ? 'translateX(0)' : 'translateX(-20px)' }}
                >
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                     {completedSteps.includes(index) && <ShieldCheck className="text-green-400 animate-[fade-in_0.5s_ease-out]" />}
                     {index === currentStep && !completedSteps.includes(index) && <Loader className="text-primary animate-spin" />}
                     {index > currentStep && <div className="w-3 h-3 rounded-full bg-primary/30"></div>}
                    </div>
                    <span className={`transition-colors duration-500 text-sm md:text-base ${completedSteps.includes(index) ? 'text-green-400' : index === currentStep ? 'text-primary' : 'text-muted-foreground'}`}>{step}</span>
                </div>
            ))}
        </div>

        <div className="w-full bg-primary/10 border-2 border-primary/20 rounded-full h-8 p-1 relative overflow-hidden">
            <div
                className="bg-primary h-full rounded-full transition-all duration-300 ease-linear shadow-[0_0_15px_hsl(var(--primary)),inset_0_0_5px_hsl(var(--primary-foreground)/0.5)]"
                style={{ width: `${progress}%`}}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-sm mix-blend-lighten">
                {Math.min(progress, 100)}% COMPLETE
            </div>
        </div>
      </div>
    </div>
  );
}
