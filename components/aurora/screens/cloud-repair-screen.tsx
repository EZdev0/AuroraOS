'use client';
import { useAurora } from '@/context/aurora-context';
import { useEffect, useState } from 'react';
import { Cloud, Server, Download, PackageCheck, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const Packet = ({ id, onComplete }: { id: number, onComplete: (id: number) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(id), 1500); // travel time
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  return (
      <div className="absolute top-1/2 left-[25%] -translate-y-1/2 w-3 h-3 bg-primary/80 rounded-sm animate-packet-fly" />
  );
};

export default function CloudRepairScreen() {
  const { userSettings, reboot, setFileSystem, setUserSettings } = useAurora();
  const [status, setStatus] = useState<'CONNECTING' | 'DOWNLOADING' | 'INSTALLING' | 'FINALIZING'>('CONNECTING');
  const [packets, setPackets] = useState<number[]>([]);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [installProgress, setInstallProgress] = useState(0);
  let packetCounter = 0;

  const T = userSettings.language === 'de' ? {
      title: "Cloud-Reparatur",
      statusConnecting: "Verbindung zum Aurora-Wiederherstellungs-Server...",
      statusDownloading: "Systemdateien werden heruntergeladen...",
      statusInstalling: "Dateien werden überprüft und installiert...",
      statusFinalizing: "Änderungen werden abgeschlossen...",
      complete: "Reparatur abgeschlossen!",
  } : {
      title: "Cloud Repair",
      statusConnecting: "Connecting to Aurora Recovery Server...",
      statusDownloading: "Downloading system files...",
      statusInstalling: "Verifying and installing files...",
      statusFinalizing: "Finalizing changes...",
      complete: "Repair Complete!",
  };

  const getStatusText = () => {
      switch(status) {
          case 'CONNECTING': return T.statusConnecting;
          case 'DOWNLOADING': return T.statusDownloading;
          case 'INSTALLING': return T.statusInstalling;
          case 'FINALIZING': return T.statusFinalizing;
          default: return '';
      }
  };

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    const timeouts: NodeJS.Timeout[] = [];

    timeouts.push(setTimeout(() => {
        setStatus('DOWNLOADING');
        intervals.push(setInterval(() => setPackets(p => [...p, packetCounter++]), 200));
        intervals.push(setInterval(() => setDownloadProgress(p => Math.min(p + 4, 100)), 250));
    }, 2000));

    timeouts.push(setTimeout(() => {
        clearInterval(intervals[0]);
        clearInterval(intervals[1]);
        setDownloadProgress(100);
        setStatus('INSTALLING');
        intervals.push(setInterval(() => setInstallProgress(p => Math.min(p + 5, 100)), 200));
    }, 8000));

    timeouts.push(setTimeout(() => {
        clearInterval(intervals[2]);
        setInstallProgress(100);
        setStatus('FINALIZING');
    }, 12000));

    timeouts.push(setTimeout(() => {
        setUserSettings(s => ({ ...s, crashedFiles: [] }));
        // In a real scenario, you'd fetch and apply the correct filesystem.
        // For simulation, we just reset it.
        // setFileSystem(initialFileSystem);
        reboot();
    }, 14000));


    return () => {
        intervals.forEach(clearInterval);
        timeouts.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reboot, setFileSystem, setUserSettings]);


  const handlePacketComplete = (id: number) => {
      setPackets(p => p.filter(pId => pId !== id));
  };

  return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
          <div className="relative z-20 w-full max-w-xl text-center">
              <h1 className="font-headline text-5xl text-primary mb-4">{T.title}</h1>
              <p key={status} className="text-muted-foreground text-lg mb-16 animate-fade-in">{getStatusText()}</p>
              <div className="relative h-24 w-full flex items-center justify-between">
                  <div className="flex flex-col items-center gap-2 w-24">
                      <Cloud className="w-16 h-16 text-primary" />
                      <span className="font-semibold">Aurora Cloud</span>
                  </div>
                  <div className="flex-grow h-2 bg-secondary/50 mx-4 relative rounded-full overflow-hidden">
                     <Progress value={downloadProgress} className="absolute inset-0 h-full w-full bg-transparent [&>div]:bg-primary/30" />
                     <Progress value={installProgress} className="absolute inset-0 h-full w-full bg-transparent" />
                     {packets.map(id => <Packet key={id} id={id} onComplete={handlePacketComplete} />)}
                  </div>
                  <div className="flex flex-col items-center gap-2 w-24">
                      <Server className={cn("w-16 h-16 transition-colors", status === 'FINALIZING' ? 'text-green-500' : 'text-primary')} />
                      <span className="font-semibold">{userSettings.username}'s PC</span>
                  </div>
              </div>

              <div className="mt-16 flex items-center justify-center gap-4">
                  {status !== 'FINALIZING' ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                      <CheckCircle2 className="w-8 h-8 text-green-500 animate-checkmark-in" />
                  )}
                   <p className="text-lg">{status !== 'FINALIZING' ? getStatusText() : T.complete}</p>
              </div>
          </div>
      </div>
  );
}
