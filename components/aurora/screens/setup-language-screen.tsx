'use client';

import { useAurora } from '@/context/aurora-context';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function SetupLanguageScreen() {
  const { setOsState, userSettings, setUserSettings } = useAurora();

  const T = userSettings.language === 'de' ? {
    title: "Sprache auswählen",
    description: "Bitte wählen Sie Ihre bevorzugte Sprache für das System.",
    continue: "Weiter",
  } : {
    title: "Select Language",
    description: "Please select your preferred language for the system.",
    continue: "Continue",
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-background animate-fade-in">
      <div className="w-full max-w-md text-center">
        <h1 className="font-headline text-5xl text-primary mb-4">{T.title}</h1>
        <p className="text-lg text-muted-foreground mb-12">{T.description}</p>

        <RadioGroup
          defaultValue={userSettings.language}
          onValueChange={(value: 'de' | 'en') => setUserSettings(prev => ({ ...prev, language: value }))}
          className="grid grid-cols-1 gap-4 mb-12"
        >
          <Label htmlFor="lang-en" className="flex items-center justify-start p-4 rounded-md border-2 gap-4 border-border/50 bg-secondary/30 hover:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/20">
            <RadioGroupItem value="en" id="lang-en" />
            <span className="text-lg">English</span>
          </Label>
          <Label htmlFor="lang-de" className="flex items-center justify-start p-4 rounded-md border-2 gap-4 border-border/50 bg-secondary/30 hover:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/20">
            <RadioGroupItem value="de" id="lang-de" />
            <span className="text-lg">Deutsch</span>
          </Label>
        </RadioGroup>

        <Button size="lg" onClick={() => setOsState('setup_account')}>
          {T.continue} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
