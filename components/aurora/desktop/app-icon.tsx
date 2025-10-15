'use client';
import type { FileSystemItem } from '@/lib/aurora-types';
import { useAurora } from '@/context/aurora-context';
import { getAppRegistry } from '@/lib/app-registry';
import { Folder, FileText, LucideIcon } from 'lucide-react';

export default function AppIcon({ item }: { item: FileSystemItem }) {
  const { openWindow, appRegistry } = useAurora();

  const handleOpen = () => {
    if (item.type === 'shortcut') {
      openWindow(item.targetAppId);
    } else if (item.type === 'folder') {
      openWindow('explorer', { path: `/Users/User/Desktop/${item.name}` });
    } else {
      // You could open a default app based on file extension here
      openWindow('notepad', { filePath: `/Users/User/Desktop/${item.name}` });
    }
  };

  const getIcon = () => {
    if (item.type === 'shortcut') {
      const app = appRegistry.find(a => a.id === item.targetAppId);
      const Icon = app?.icon as LucideIcon;
      return Icon ? <Icon className="w-10 h-10" /> : <FileText className="w-10 h-10" />;
    }
    if (item.type === 'folder') {
      return <Folder className="w-10 h-10" />;
    }
    return <FileText className="w-10 h-10" />;
  };

  const getName = () => {
    if (item.type === 'shortcut') {
        const app = appRegistry.find(a => a.id === item.targetAppId);
        return app?.name.en || item.name;
    }
    return item.name;
  }

  return (
    <div
      className="flex flex-col items-center justify-center text-center w-24 h-24 p-2 rounded-md hover:bg-white/10 transition-colors"
      onDoubleClick={handleOpen}
      onTouchEnd={handleOpen} // Basic mobile support
    >
      <div className="mb-1 text-primary">
        {getIcon()}
      </div>
      <p className="text-xs text-white break-words">
        {getName()}
      </p>
    </div>
  );
}
