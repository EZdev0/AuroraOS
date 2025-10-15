'use client';

import { useAurora } from '@/context/aurora-context';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export default function SetupAccountScreen() {
  const { setOsState, userSettings, setUserSettings } = useAurora();

  const T = userSettings.language === 'de' ? {
    title: "Benutzerkonto erstellen",
    description: "Legen Sie Ihren Benutzernamen und ein optionales Passwort fest.",
    username: "Benutzername",
    password: "Password (optional)",
    continue: "Konto erstellen",
    usernameRequired: "Benutzername ist erforderlich.",
  } : {
    title: "Create your Account",
    description: "Set your username and an optional password.",
    username: "Username",
    password: "Password (optional)",
    continue: "Create Account",
    usernameRequired: "Username is required.",
  };

  const schema = z.object({
    username: z.string().min(1, T.usernameRequired),
    password: z.string().optional(),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: userSettings.username,
      password: userSettings.password,
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    setUserSettings(prev => ({
      ...prev,
      username: data.username,
      password: data.password,
    }));
    setOsState('setup_updates');
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-background animate-fade-in">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-headline text-5xl text-primary mb-4">{T.title}</h1>
        <p className="text-lg text-muted-foreground mb-12">{T.description}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div className="space-y-2">
            <Label htmlFor="username">{T.username}</Label>
            <Input id="username" {...register("username")} />
            {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{T.password}</Label>
            <Input id="password" type="password" {...register("password")} />
          </div>
          <Button size="lg" type="submit" className="w-full">
            {T.continue} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
