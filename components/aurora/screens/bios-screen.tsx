'use client';
import { useAurora } from '@/context/aurora-context';
import { Button } from '@/components/ui/button';
import { Thermometer, SlidersHorizontal, Cpu, Zap, PowerOff, Languages, ShieldQuestion, ArrowRight, Fan, Cog, Disc } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { BiosSettings } from '@/lib/aurora-types';

const translations = {
  en: {
    title: "AuroraBIOS Setup Utility",
    version: "Version 3.0.0",
    dashboard: "Dashboard",
    performance: "Performance",
    boot: "Boot",
    system: "System",
    exit: "Exit",
    sysInfo: "System Information",
    cpu: "CPU",
    memory: "Memory",
    biosVer: "BIOS Version",
    sysDate: "System Date",
    sysTime: "System Time",
    bootConfig: "Boot Configuration",
    bootPrio: "Boot priority",
    prio1: "1. SSD: Aurora Virtual Drive (512GB)",
    prio2: "2. USB: Generic USB Device",
    prio3: "3. Network: PXE Boot",
    cpuOverclock: "CPU Overclocking",
    cpuMultiplier: "CPU Multiplier",
    memProfile: "Memory Profile",
    virtualization: "Virtualization",
    enabled: "Enabled",
    disabled: "Disabled",
    auto: "Auto",
    healthStatus: "PC Health Status",
    cpuTemp: "CPU Temperature",
    fanSpeed: "System Fan RPM",
    voltage: "VCORE Voltage",
    langSelect: "Language Selection",
    langDesc: "Select the language for the BIOS interface.",
    saveAndInstall: "Save & Install AuroraOS",
    saveAndInstallDesc: "Do you want to start the installation on the primary drive?",
    note: "All data on the target drive will be erased.",
    ocWarning: "Overclocking can lead to system instability. Proceed with caution.",
    xmp1: "XMP Profile I (7600MHz)",
    xmp2: "XMP Profile II (8000MHz)",
    manual: "Manual",
    targetFreq: "Target Freq",
    exitAndSave: "Save Changes and Reboot",
    exitAndSaveDesc: "Your settings will be saved and the system will restart.",
    exitAndSaveInstall: "Save Changes and Install",
    exitAndSaveInstallDesc: "Your settings will be saved and AuroraOS installation will begin.",
    discardAndReboot: "Discard Changes and Reboot",
    discardAndRebootDesc: "Your settings will not be saved. The system will reboot.",
  },
  de: {
    title: "AuroraBIOS Einrichtungs-Dienstprogramm",
    version: "Version 3.0.0",
    dashboard: "Dashboard",
    performance: "Leistung",
    boot: "Boot",
    system: "System",
    exit: "Beenden",
    sysInfo: "Systeminformationen",
    cpu: "CPU",
    memory: "Speicher",
    biosVer: "BIOS-Version",
    sysDate: "Systemdatum",
    sysTime: "Systemzeit",
    bootConfig: "Boot-Konfiguration",
    bootPrio: "Boot-Priorität",
    prio1: "1. SSD: Aurora Virtuelles Laufwerk (512GB)",
    prio2: "2. USB: Generisches USB-Gerät",
    prio3: "3. Netzwerk: PXE-Boot",
    cpuOverclock: "CPU-Übertaktung",
    cpuMultiplier: "CPU-Multiplikator",
    memProfile: "Speicherprofil",
    virtualization: "Virtualisierung",
    enabled: "Aktiviert",
    disabled: "Deaktiviert",
    auto: "Auto",
    healthStatus: "PC-Systemzustand",
    cpuTemp: "CPU-Temperatur",
    fanSpeed: "Systemlüfter U/min",
    voltage: "VCORE-Spannung",
    langSelect: "Sprachauswahl",
    langDesc: "Wählen Sie die Sprache für die BIOS-Oberfläche.",
    note: "Alle Daten auf dem Ziellaufwerk werden gelöscht.",
    ocWarning: "Übertakten kann zu Systeminstabilität führen. Vorsicht ist geboten.",
    xmp1: "XMP Profil I (7600MHz)",
    xmp2: "XMP Profil II (8000MHz)",
    manual: "Manuell",
    targetFreq: "Zielfrequenz",
    exitAndSave: "Änderungen speichern & Neustarten",
    exitAndSaveDesc: "Ihre Einstellungen werden gespeichert und das System wird neu gestartet.",
    exitAndSaveInstall: "Änderungen speichern & installieren",
    exitAndSaveInstallDesc: "Ihre Einstellungen werden gespeichert und die Installation von AuroraOS wird gestartet.",
    discardAndReboot: "Änderungen verwerfen & neustarten",
    discardAndRebootDesc: "Ihre Einstellungen werden nicht gespeichert. Das System wird neu gestartet.",
  }
}

type BiosTab = 'dashboard' | 'performance' | 'boot' | 'system' | 'exit';
type HealthMetricType = 'temp' | 'fan' | 'voltage';

export default function BiosScreen() {
  const { setOsState, isInstalled, reboot, userSettings, setUserSettings } = useAurora();
  const [biosLang, setBiosLang] = useState<'en' | 'de'>(userSettings.language);
  const [activeTab, setActiveTab] = useState<BiosTab>('dashboard');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const [healthStatus, setHealthStatus] = useState({
    cpuTemp: 33.5,
    fanSpeed: 1175,
    voltage: 1.251
  });

  const [localBiosSettings, setLocalBiosSettings] = useState(userSettings.biosSettings);

  const T = translations[biosLang];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentTime(new Date());
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    const healthTimer = setInterval(() => {
      setHealthStatus(prev => ({
        cpuTemp: Math.max(30, Math.min(90, prev.cpuTemp + (Math.random() - 0.45) * 2)),
        fanSpeed: Math.max(800, Math.min(3000, prev.fanSpeed + (Math.random() - 0.5) * 50)),
        voltage: Math.max(1.1, Math.min(1.45, prev.voltage + (Math.random() - 0.5) * 0.01))
      }));
    }, 2000);
    return () => clearInterval(healthTimer);
  }, []);

  const handleSaveAndExit = () => {
    setUserSettings(prev => ({
      ...prev,
      biosSettings: localBiosSettings,
      language: biosLang
    }));
    if (isInstalled) {
      reboot();
    } else {
      setOsState('installing');
    }
  };

  const handleDiscardAndExit = () => {
    reboot();
  }

  const NavButton = ({ tab, icon: Icon, label }: { tab: BiosTab, icon: React.ElementType, label: string }) => (
    <Button
      variant="ghost"
      onClick={() => setActiveTab(tab)}
      className={cn(
        "w-full justify-start text-base md:text-lg gap-2 md:gap-4 px-4 py-4 md:px-6 md:py-8 rounded-none border-l-4",
        activeTab === tab
          ? "bg-primary/10 text-primary border-primary"
          : "text-muted-foreground border-transparent hover:bg-secondary/50 hover:text-foreground"
      )}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
      {label}
    </Button>
  )

  const HealthMetric = ({icon: Icon, value, unit, label, type}: {icon: React.ElementType, value: number, unit: string, label: string, type: HealthMetricType}) => {
    const getTempColorClass = (temp: number) => {
        if (temp > 75) return 'text-red-500';
        if (temp > 55) return 'text-yellow-400';
        return 'text-green-400';
    }

    const iconColorClass = {
        temp: getTempColorClass(value),
        fan: 'text-cyan-400',
        voltage: 'text-yellow-400'
    }[type];

    const iconAnimationClass = {
        temp: '',
        fan: 'animate-spin-slow',
        voltage: ''
    }[type];

    const displayValue = {
        temp: value.toFixed(1),
        fan: value.toFixed(0),
        voltage: value.toFixed(3),
    }[type];


    return (
      <div className="bg-secondary/30 p-2 sm:p-4 rounded-lg flex gap-2 sm:gap-4 items-center border border-transparent hover:border-primary/50 transition-colors">
          <div className={cn("p-2 sm:p-3 rounded-lg bg-secondary", iconColorClass)}>
              <Icon className={cn("w-6 h-6 sm:w-8 sm:h-8", iconAnimationClass)} style={{ animationDuration: '3s' }}/>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-light text-foreground transition-colors duration-500">{displayValue}<span className="text-lg sm:text-xl text-muted-foreground ml-1">{unit}</span></div>
            <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
          </div>
      </div>
    )}

  return (
    <div className="flex h-full w-full flex-col bg-background p-2 sm:p-4 font-body text-foreground">
      <header className="flex-shrink-0 flex items-center justify-between border-b-2 border-primary/20 pb-2 mb-4 px-2">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl text-primary">{T.title}</h1>
          <p className="text-xs text-muted-foreground">{T.version}</p>
        </div>
        <div className="text-right">
          <p className="font-code text-lg md:text-xl">{currentTime ? currentTime.toLocaleTimeString(biosLang, {hour: '2-digit', minute: '2-digit'}) : '--:--'}</p>
          <p className="text-xs text-muted-foreground">{currentTime ? currentTime.toLocaleDateString(biosLang) : '...'}</p>
        </div>
      </header>

      <div className="flex-grow flex flex-col lg:flex-row gap-2 sm:gap-4 overflow-hidden">
        <aside className="w-full lg:w-64 flex-shrink-0 bg-secondary/30 border border-border rounded-lg flex flex-col justify-between">
            <nav className="flex flex-col">
                <NavButton tab="dashboard" icon={SlidersHorizontal} label={T.dashboard} />
                <NavButton tab="performance" icon={Zap} label={T.performance} />
                <NavButton tab="boot" icon={Disc} label={T.boot} />
                <NavButton tab="system" icon={Cog} label={T.system} />
            </nav>
             <nav>
                <NavButton tab="exit" icon={PowerOff} label={T.exit} />
             </nav>
        </aside>

        <main className="flex-grow bg-secondary/30 border border-border rounded-lg p-4 md:p-8 overflow-y-auto">
            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 gap-8 md:gap-12 animate-fade-in">
                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-primary/80 flex items-center gap-2"><Cpu/> {T.sysInfo}</h2>
                        <div className="space-y-3 text-base lg:text-lg">
                            <p><span className="font-bold w-28 md:w-32 inline-block text-muted-foreground">{T.cpu}:</span> Quantum Core QX-9 (16 Cores)</p>
                            <p><span className="font-bold w-28 md:w-32 inline-block text-muted-foreground">{T.targetFreq}:</span> 3600 MHz</p>
                            <p><span className="font-bold w-28 md:w-32 inline-block text-muted-foreground">{T.memory}:</span> 16384 MB DDR6 @ 7200MHz</p>
                            <p><span className="font-bold w-28 md:w-32 inline-block text-muted-foreground">{T.biosVer}:</span> {T.version}</p>
                        </div>
                    </section>
                     <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-primary/80 flex items-center gap-2"><Thermometer/> {T.healthStatus}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                           <HealthMetric type="temp" icon={Cpu} value={healthStatus.cpuTemp} unit="°C" label={T.cpuTemp} />
                           <HealthMetric type="fan" icon={Fan} value={healthStatus.fanSpeed} unit="RPM" label={T.fanSpeed} />
                           <HealthMetric type="voltage" icon={Zap} value={healthStatus.voltage} unit="V" label={T.voltage} />
                        </div>
                    </section>
                </div>
            )}
            {activeTab === 'performance' && (
                 <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-primary/80 flex items-center gap-2"><SlidersHorizontal/> {T.performance}</h2>
                        <div className="bg-secondary/30 p-4 md:p-6 rounded-lg border border-border">
                            <h3 className="text-lg md:text-xl font-medium mb-4">{T.cpuOverclock}</h3>
                            <div className="flex items-center justify-between mb-4">
                                <Label htmlFor="oc-switch" className="text-base md:text-lg">{T.cpuOverclock}</Label>
                                <Switch id="oc-switch" disabled />
                            </div>
                            <Alert variant="destructive"><AlertDescription>{T.ocWarning}</AlertDescription></Alert>
                        </div>
                    </section>
                    <section>
                        <div className="bg-secondary/30 p-4 md:p-6 rounded-lg border border-border">
                            <h3 className="text-lg md:text-xl font-medium mb-4">{T.memProfile}</h3>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <Label htmlFor="mem-profile" className="text-base md:text-lg">{T.memProfile}</Label>
                                <Select defaultValue="auto" disabled>
                                    <SelectTrigger className="w-full sm:w-[250px]" id="mem-profile">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="auto">{T.auto}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </section>
                 </div>
            )}
             {activeTab === 'boot' && (
                 <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
                     <h2 className="text-xl md:text-2xl font-semibold text-primary/80 flex items-center gap-2"><Disc/> {T.bootConfig}</h2>
                     <div className="bg-secondary/30 p-4 md:p-6 rounded-lg border border-border">
                         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Label className="text-base md:text-lg">{T.bootPrio}:</Label>
                            <Select value={localBiosSettings.bootPriority} onValueChange={(v: BiosSettings['bootPriority']) => setLocalBiosSettings(s => ({...s, bootPriority: v}))}>
                                <SelectTrigger className="w-full max-w-md">
                                    <SelectValue placeholder="Select boot device" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ssd">{T.prio1}</SelectItem>
                                    <SelectItem value="usb">{T.prio2}</SelectItem>
                                    <SelectItem value="net">{T.prio3}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                     </div>
                 </div>
            )}
             {activeTab === 'system' && (
                <div className="space-y-8 animate-fade-in max-w-xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary/80 flex items-center gap-2"><Cog/> {T.system}</h2>
                    <div className="bg-secondary/30 p-4 md:p-6 rounded-lg border border-border">
                        <h3 className="text-lg md:text-xl font-medium mb-2 flex items-center gap-2"><Languages/> {T.langSelect}</h3>
                        <p className="text-muted-foreground mb-6">{T.langDesc}</p>
                        <RadioGroup defaultValue={biosLang} onValueChange={(v: 'en' | 'de') => setBiosLang(v)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Label htmlFor="lang-en" className="flex items-center justify-start p-3 rounded-md border-2 gap-3 border-border/50 bg-transparent hover:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/20">
                                <RadioGroupItem value="en" id="lang-en" />
                                <span>English</span>
                            </Label>
                            <Label htmlFor="lang-de" className="flex items-center justify-start p-3 rounded-md border-2 gap-3 border-border/50 bg-transparent hover:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/20">
                                <RadioGroupItem value="de" id="lang-de" />
                                <span>Deutsch</span>
                            </Label>
                        </RadioGroup>
                    </div>
                </div>
            )}
             {activeTab === 'exit' && (
                 <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-semibold text-primary/80 flex items-center gap-2"><PowerOff/> {T.exit}</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Button onClick={handleSaveAndExit} variant="default" className="h-auto p-4 flex flex-col items-start text-left gap-1" size="lg">
                            <div className="flex justify-between w-full items-center">
                                <span className="text-lg font-semibold">{isInstalled ? T.exitAndSave : T.exitAndSaveInstall}</span>
                                <ArrowRight />
                            </div>
                            <p className="font-normal text-primary-foreground/80 text-sm">{isInstalled ? T.exitAndSaveDesc : T.exitAndSaveInstallDesc}</p>
                            {!isInstalled && <p className="font-normal text-destructive-foreground/50 text-xs mt-2">{T.note}</p>}
                        </Button>
                         <Button onClick={handleDiscardAndExit} variant="destructive" className="h-auto p-4 flex flex-col items-start text-left gap-1" size="lg">
                            <div className="flex justify-between w-full items-center">
                                <span className="text-lg font-semibold">{T.discardAndReboot}</span>
                                <ArrowRight />
                            </div>
                            <p className="font-normal text-destructive-foreground/80 text-sm">{T.discardAndRebootDesc}</p>
                         </Button>
                    </div>
                 </div>
            )}
        </main>
      </div>
    </div>
  );
}
