'use client';
import { useAurora } from '@/context/aurora-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function LoginScreen() {
  const { setOsState, userSettings } = useAurora();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (userSettings.password === password) {
      setOsState('desktop_loading');
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background">
      <div className="text-center">
        <img src={userSettings.avatar} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">{userSettings.username}</h1>
        <div className="w-64 mx-auto">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          <Button onClick={handleLogin} className="mt-4 w-full">Login</Button>
        </div>
      </div>
    </div>
  );
}
