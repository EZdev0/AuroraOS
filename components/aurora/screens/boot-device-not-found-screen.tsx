'use client';
import { useAurora } from '@/context/aurora-context';
import { useEffect } from 'react';

export default function BootDeviceNotFoundScreen() {
  const { setOsState } = useAurora();

  useEffect(() => {
    const timer = setTimeout(() => {
      setOsState('bios');
    }, 4000);

    return () => clearTimeout(timer);
  }, [setOsState]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-black p-4 font-code text-lg text-white">
      <div className="text-center">
        <p>Reboot and Select proper Boot device</p>
        <p>or Insert Boot Media in selected Boot device and press a key</p>
        <br />
        <p>No bootable device -- Please restart system</p>
      </div>
    </div>
  );
}
