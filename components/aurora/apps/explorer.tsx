'use client';
import { useAurora } from '@/context/aurora-context';
import type { FileSystemItem } from '@/lib/aurora-types';
import { findFolderByPath } from '@/lib/filesystem-utils';
import { Folder, FileText, LucideIcon } from 'lucide-react';
import { useState } from 'react';

export default function ExplorerApp({ data }: { data?: { path?: string } }) {
  const { fileSystem, userSettings, appRegistry, openWindow } = useAurora();
  const [currentPath, setCurrentPath] = useState(data?.path || `/Users/${userSettings.username}`);

  const currentFolder = findFolderByPath(fileSystem, currentPath.replace(/^\//, '').split('/'));

  const navigateTo = (path: string) => {
    // Basic path resolution
    const newPath = path.startsWith('/') ? path : `${currentPath}/${path}`;
    // TODO: Add proper path resolution (e.g. for '..')
    setCurrentPath(newPath);
  }

  const handleItemOpen = (item: FileSystemItem) => {
    const fullPath = `${currentPath}/${item.name}`;
    if (item.type === 'folder') {
      navigateTo(fullPath);
    } else if (item.type === 'shortcut') {
      openWindow(item.targetAppId);
    } else {
      openWindow('notepad', { filePath: fullPath });
    }
  }

  const getIcon = (item: FileSystemItem) => {
    if (item.type === 'shortcut') {
      const app = appRegistry.find(a => a.id === item.targetAppId);
      const Icon = app?.icon as LucideIcon;
      return Icon ? <Icon className="w-6 h-6" /> : <FileText className="w-6 h-6" />;
    }
    if (item.type === 'folder') {
      return <Folder className="w-6 h-6 text-primary" />;
    }
    return <FileText className="w-6 h-6 text-muted-foreground" />;
  };


  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <div className="w-48 bg-secondary/30 p-2 border-r border-border">
        <h2 className="font-bold p-2">Favorites</h2>
        <button onClick={() => setCurrentPath(`/Users/${userSettings.username}/Desktop`)} className="w-full text-left p-2 rounded hover:bg-primary/20">Desktop</button>
        <button onClick={() => setCurrentPath(`/Users/${userSettings.username}/Documents`)} className="w-full text-left p-2 rounded hover:bg-primary/20">Documents</button>
        <button onClick={() => setCurrentPath(`/Users/${userSettings.username}/Downloads`)} className="w-full text-left p-2 rounded hover:bg-primary/20">Downloads</button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Address bar */}
        <div className="p-2 border-b border-border">
          <input type="text" value={currentPath} readOnly className="w-full bg-input rounded p-1 text-sm"/>
        </div>

        {/* File list */}
        <div className="flex-1 p-2 overflow-y-auto">
          {currentFolder ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {currentFolder.children.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-primary/20 cursor-pointer"
                  onDoubleClick={() => handleItemOpen(item)}
                >
                  {getIcon(item)}
                  <span className="text-sm truncate">{item.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Folder not found: {currentPath}</p>
          )}
        </div>
      </div>
    </div>
  );
}
