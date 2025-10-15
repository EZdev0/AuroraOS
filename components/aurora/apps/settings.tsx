'use client';
import { useAurora } from '@/context/aurora-context';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SettingsApp() {
  const { theme, toggleTheme, userSettings, setUserSettings, rebootToBios } = useAurora();

  const T = userSettings.language === 'de' ? {
    title: "Einstellungen",
    appearance: "Erscheinungsbild",
    theme: "Thema",
    light: "Hell",
    dark: "Dunkel",
    language: "Sprache",
    devOptions: "Entwickleroptionen",
    devMode: "Entwicklermodus",
    devModeDesc: "Erlaubt die Installation von benutzerdefinierten Apps.",
    rebootToBios: "Neustart ins BIOS",
  } : {
    title: "Settings",
    appearance: "Appearance",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",
    devOptions: "Developer Options",
    devMode: "Developer Mode",
    devModeDesc: "Allows installation of custom applications.",
    rebootToBios: "Reboot to BIOS",
  };

  const handleDevModeChange = (enabled: boolean) => {
    setUserSettings(s => ({
      ...s,
      pendingDevSettingsChange: enabled ? 'enable' : 'disable',
    }));
    // Trigger the update process
    // This will eventually call applyPendingDevSettings after the animation
    rebootToBios(); // Simplified for now, should go to an 'updating' state
  };

  return (
    <div className="p-4 md:p-6 space-y-8">
      <h1 className="font-headline text-2xl text-primary">{T.title}</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4">{T.appearance}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-switch">{T.theme}</Label>
            <div className="flex items-center gap-2">
              <span>{T.light}</span>
              <Switch
                id="theme-switch"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
              <span>{T.dark}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>{T.language}</Label>
            <RadioGroup
              defaultValue={userSettings.language}
              onValueChange={(value: 'de' | 'en') => setUserSettings(prev => ({ ...prev, language: value }))}
              className="flex gap-4"
            >
              <Label htmlFor="lang-en" className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="en" id="lang-en" />
                English
              </Label>
              <Label htmlFor="lang-de" className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="de" id="lang-de" />
                Deutsch
              </Label>
            </RadioGroup>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">{T.devOptions}</h2>
         <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
           <div>
             <Label htmlFor="dev-mode-switch">{T.devMode}</Label>
             <p className="text-sm text-muted-foreground">{T.devModeDesc}</p>
           </div>
           <Switch
             id="dev-mode-switch"
             checked={userSettings.developerSettings.enabled}
             onCheckedChange={handleDevModeChange}
           />
         </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">System</h2>
        <Button onClick={rebootToBios}>
          {T.rebootToBios}
        </Button>
      </section>

    </div>
  );
}
