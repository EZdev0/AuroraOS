'use client';
import { useAurora } from '@/context/aurora-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudCog, HardDrive, RefreshCcw, Power, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function RecoveryScreen() {
  const { setOsState, shutdown, userSettings, reboot } = useAurora();

  const T = userSettings.language === 'de' ? {
    title: "Erweiterte Wiederherstellung",
    subtitle: "Ihr PC wurde nicht korrekt gestartet. Wählen Sie eine Option, um fortzufahren.",
    cloudRepair: "Von der Cloud reparieren",
    cloudRepairDesc: "Empfohlen. Stellt beschädigte Systemdateien wieder her. Ihre persönlichen Daten bleiben erhalten.",
    seeMoreOptions: "Weitere Optionen anzeigen",
    reinstall: "AuroraOS neu installieren",
    reinstallDesc: "ACHTUNG: Alle Ihre Daten und Apps werden gelöscht.",
    restart: "Neu starten",
    shutdown: "Herunterfahren",
  } : {
    title: "Advanced Recovery",
    subtitle: "Your PC did not start correctly. Choose an option to continue.",
    cloudRepair: "Repair from Cloud",
    cloudRepairDesc: "Recommended. Restore corrupted system files using the cloud. Your personal data will be preserved.",
    seeMoreOptions: "See more options",
    reinstall: "Reinstall AuroraOS",
    reinstallDesc: "WARNING: All your data and apps will be deleted.",
    restart: "Restart",
    shutdown: "Shut Down",
  };

  const handleCloudRepair = () => {
    setOsState('cloud_repair');
  };

  const handleReinstall = () => {
    setOsState('installing');
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-4xl text-center relative z-20">
          <h1 className="font-headline text-5xl text-primary mb-4">{T.title}</h1>
          <p className="text-muted-foreground text-lg mb-12">{T.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <Card onClick={handleCloudRepair} className="bg-secondary/30 border-primary border-2 shadow-lg shadow-primary/20 hover:bg-primary/10 cursor-pointer transition-all duration-300 transform hover:scale-105">
                <CardHeader className="flex-row items-center gap-4">
                    <CloudCog className="w-12 h-12 text-primary" />
                    <CardTitle className="text-2xl">{T.cloudRepair}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>{T.cloudRepairDesc}</CardDescription>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
                <Card onClick={() => reboot()} className="bg-secondary/30 hover:bg-secondary/70 border border-border cursor-pointer transition-colors">
                     <CardHeader className="flex-row items-center gap-4 p-4">
                        <RefreshCcw className="w-8 h-8 text-muted-foreground" />
                        <CardTitle className="text-xl">{T.restart}</CardTitle>
                    </CardHeader>
                </Card>
                 <Card onClick={shutdown} className="bg-secondary/30 hover:bg-secondary/70 border border-border cursor-pointer transition-colors">
                     <CardHeader className="flex-row items-center gap-4 p-4">
                        <Power className="w-8 h-8 text-muted-foreground" />
                        <CardTitle className="text-xl">{T.shutdown}</CardTitle>
                    </CardHeader>
                </Card>
                <Separator className="my-2" />
                <Card onClick={handleReinstall} className="bg-destructive/10 border-destructive/50 hover:bg-destructive/20 border cursor-pointer transition-colors">
                     <CardHeader className="flex-row items-center gap-4 p-4">
                        <AlertTriangle className="w-8 h-8 text-destructive" />
                        <CardTitle className="text-xl">{T.reinstall}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                       <CardDescription>{T.reinstallDesc}</CardDescription>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
