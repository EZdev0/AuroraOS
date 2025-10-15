'use client';

import { useAurora } from '@/context/aurora-context';
import AppWindow from './app-window';
import Taskbar from './taskbar';
import AppIcon from './app-icon';
import { findFolderByPath } from '@/lib/filesystem-utils';
import type { FileSystemItem } from '@/lib/aurora-types';

export default function DesktopEnvironment() {
  const { windows, fileSystem, userSettings } = useAurora();

  const desktopPath = ['Users', userSettings.username, 'Desktop'];
  const desktopFolder = findFolderByPath(fileSystem, desktopPath);
  const desktopItems = desktopFolder ? desktopFolder.children : [];

  return (
    <div className="h-full w-full bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:2rem_2rem] animate-pulse" />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-background via-background/80 to-background" />

      {/* Desktop Icons */}
      <main className="absolute inset-0 z-20 p-4 pt-6 pb-20">
        <div className="flex flex-col flex-wrap content-start gap-4">
          {desktopItems.map((item: FileSystemItem) => (
            <AppIcon key={item.id} item={item} />
          ))}
        </div>
      </main>

      {/* Windows */}
      <div className="absolute inset-0 z-30">
        {windows.map(window => (
          !window.isMinimized && <AppWindow key={window.id} {...window} />
        ))}
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <Taskbar />
      </div>
    </div>
  );
}
