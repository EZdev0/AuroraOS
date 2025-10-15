'use client';
import { useAurora } from '@/context/aurora-context';
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck } from 'lucide-react';
import { initialFileSystem } from '@/lib/filesystem';
import { useToast } from '@/hooks/use-toast';

export default function RepairScreen() {
  const { setOsState, setFileSystem, setUserSettings, userSettings, reboot } = useAurora();
  const [progress, setProgress] = useState(0);
  const [repairComplete, setRepairComplete] = useState(false);
  const { toast } = useToast();

  const T = userSettings.language === 'de' ? {
    title: "Automatische Reparatur",
    subtitle: "AuroraOS versucht, Probleme auf Ihrem PC zu diagnostizieren und zu beheben.",
    checking: "Überprüfe Systemdateien...",
    repairSuccess: "Reparatur erfolgreich",
    repairSuccessDesc: "Systemdateien wiederhergestellt. Das System wird neu gestartet.",
  } : {
    title: "Automatic Repair",
    subtitle: "AuroraOS is attempting to diagnose and fix problems on your PC.",
    checking: "Scanning system files...",
    repairSuccess: "Repair successful",
    repairSuccessDesc: "System files restored. The system will now restart.",
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setRepairComplete(true);
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (repairComplete) {
      setTimeout(() => {
        setFileSystem(initialFileSystem);
        setUserSettings(s => ({ ...s, crashedFiles: [] }));
        toast({ title: T.repairSuccess, description: T.repairSuccessDesc });
        reboot();
      }, 2000);
    }
  }, [repairComplete, setFileSystem, setUserSettings, toast, T, reboot]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-lg text-center">
        <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h1 className="font-headline text-5xl mb-4">{T.title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{T.subtitle}</p>

        <Progress value={progress} className="h-2" />
        <p className="mt-4 text-lg font-code">{T.checking} {progress}%</p>
      </div>
    </div>
  );
}
