'use client';

'use client';

import type { AuroraContextType, OSState, Theme, Folder, UserSettings, WindowInstance, FileSystemItem, Shortcut, BiosSettings, DeveloperSettings, AppConfig, CustomAppManifest, File as FileType } from '@/lib/aurora-types';
import { initialFileSystem } from '@/lib/filesystem';
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useToast as useRadixToast } from "@/hooks/use-toast";
import { getAppRegistry, standardApps } from '@/lib/app-registry';
import { findFolderByPath } from '@/lib/filesystem-utils';
import * as LucideIcons from 'lucide-react';

const AuroraContext = createContext<AuroraContextType | null>(null);

const TASKBAR_HEIGHT = 56; // height of the taskbar in pixels

const defaultBiosSettings: BiosSettings = {
  bootPriority: 'ssd',
};

const defaultDeveloperSettings: DeveloperSettings = {
  enabled: false,
  installerEnabled: false,
  allowExtraCommands: false,
};

const defaultSettings: UserSettings = {
  language: 'de',
  username: 'User',
  password: '',
  crashedFiles: [],
  avatar: 'https://placehold.co/128x128/7738f8/ffffff.png?text=A',
  autoFullscreen: true,
  fullscreenTimeout: 15,
  biosSettings: defaultBiosSettings,
  developerSettings: defaultDeveloperSettings,
  shortcutsNeedRestore: false,
  pendingDevSettingsChange: null,
};

export function AuroraProvider({ children }: { children: React.ReactNode }) {
  const [osState, setOsState] = useState<OSState>('off');
  const [theme, setTheme] = useState<Theme>('dark');
  const [fileSystem, setFileSystem] = useState<Folder>(initialFileSystem);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultSettings);
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [history, setHistory] = useState<string[]>(['System initialized.']);
  const [isInstalled, setIsInstalled] = useState(false);
  const [systemLoad, setSystemLoad] = useState(0);
  const [customApps, setCustomApps] = useState<AppConfig[]>([]);

  const { toast, showQueuedToasts } = useRadixToast();

  const log = useCallback((message: string) => {
    setHistory(prev => [...prev, message]);
  }, []);

  const appRegistry = useMemo(() => getAppRegistry(customApps), [customApps]);

  useEffect(() => {
    if (osState === 'desktop') {
      showQueuedToasts();
    }
  }, [osState, showQueuedToasts]);

  useEffect(() => {
    try {
      const installed = localStorage.getItem('aurora_os_installed');
      if (installed === 'true') {
        let parsedSettings: UserSettings = defaultSettings;

        const storedSettings = localStorage.getItem('aurora_user_settings');
        if (storedSettings) {
          const loadedSettings = JSON.parse(storedSettings);
          parsedSettings = {
              ...defaultSettings,
              ...loadedSettings,
              biosSettings: {...defaultBiosSettings, ...loadedSettings.biosSettings},
              developerSettings: {...defaultDeveloperSettings, ...loadedSettings.developerSettings},
              pendingDevSettingsChange: null, // Always reset pending changes on load
          };
        }
        setUserSettings(parsedSettings);

        const storedFs = localStorage.getItem('aurora_filesystem');
        if (storedFs) setFileSystem(JSON.parse(storedFs));
        else localStorage.setItem('aurora_filesystem', JSON.stringify(initialFileSystem));

        const storedCustomApps = localStorage.getItem('aurora_custom_apps');
        if (storedCustomApps) {
            const manifests: CustomAppManifest[] = JSON.parse(storedCustomApps);
            const loadedCustomApps = manifests.map(manifestToAppConfig);
            setCustomApps(loadedCustomApps);
        }

        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      localStorage.clear();
      setIsInstalled(false);
      setFileSystem(initialFileSystem);
      setUserSettings(defaultSettings);
      setCustomApps([]);
    }
  }, []);

  useEffect(() => {
    try {
      if (isInstalled) {
        localStorage.setItem('aurora_user_settings', JSON.stringify(userSettings));
      }
    } catch (error) {
      console.error('Failed to save user settings to localStorage:', error);
    }
  }, [userSettings, isInstalled]);

  useEffect(() => {
    try {
      if (isInstalled) {
        localStorage.setItem('aurora_filesystem', JSON.stringify(fileSystem));
      }
    } catch (error) {
      console.error('Failed to save file system to localStorage:', error);
    }
  }, [fileSystem, isInstalled]);

  useEffect(() => {
    try {
      if (isInstalled) {
        const manifests = customApps.map(app => app.data as CustomAppManifest);
        localStorage.setItem('aurora_custom_apps', JSON.stringify(manifests));
      }
    } catch(error) {
      console.error('Failed to save custom apps to localStorage:', error);
    }
  }, [customApps, isInstalled]);

  const toggleTheme = useCallback(() => {
    setTheme(current => (current === 'light' ? 'dark' : 'light'));
    log(`Theme switched to ${theme === 'light' ? 'dark' : 'light'}.`);
  }, [theme, log]);

  const focusWindow = useCallback((id: string) => {
    setWindows(prevWindows => {
      const win = prevWindows.find(w => w.id === id);
      if (!win) return prevWindows;

      const maxZIndex = Math.max(...prevWindows.map(w => w.zIndex), 0);

      if (win.zIndex < maxZIndex || win.isMinimized) {
        return prevWindows.map(w =>
          w.id === id ? { ...w, zIndex: maxZIndex + 1, isMinimized: false } : w
        );
      }
      return prevWindows;
    });
  }, []);

  const openWindow = useCallback((appId: string, data?: any) => {
    if (appId === 'installer') {
      openWindow('settings', { scrollTo: 'developer' });
      log(`Intercepted direct call to Installer. Redirecting to Settings.`);
      return;
    }

    setWindows(prevWindows => {
        const app = appRegistry.find(a => a.id === appId);

        if (!app) {
            log(`Attempted to open non-existent app: ${appId}. Opening fallback.`);
            const unknownAppId = 'unknown_app';
            const unknownApp = appRegistry.find(a => a.id === unknownAppId)!;
            const maxZIndex = Math.max(...prevWindows.map(w => w.zIndex), 0);
            const newWindow: WindowInstance = {
                id: `win-${Date.now()}`,
                appId: unknownAppId,
                zIndex: maxZIndex + 1,
                isMinimized: false,
                isMaximized: false,
                position: { x: 50, y: 50 },
                size: unknownApp.defaultSize,
                data: { originalAppId: appId },
            };
            return [...prevWindows, newWindow];
        }

        const existingWindow = prevWindows.find(w => w.appId === appId && w.appId !== 'custom_app_renderer');

        if (existingWindow && !app.isUtility) {
            const maxZIndex = Math.max(...prevWindows.map(w => w.zIndex), 0);
            if (existingWindow.zIndex < maxZIndex || existingWindow.isMinimized) {
                log(`App ${appId} focused.`);
                return prevWindows.map(w =>
                    w.id === existingWindow.id ? { ...w, zIndex: maxZIndex + 1, isMinimized: false, data: data || w.data } : w
                );
            }
            return prevWindows;
        }

        const isMobile = window.innerWidth < 768;
        const newWindowId = `win-${Date.now()}`;
        const cascadeOffset = (prevWindows.length % 10) * 20;
        let size = app.defaultSize;
        let position = { x: 50 + cascadeOffset, y: 50 + cascadeOffset };
        let isMaximized = false;

        if (isMobile) {
            isMaximized = true;
            size = { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT };
            position = { x: 0, y: 0 };
        }

        const maxZIndex = Math.max(...prevWindows.map(w => w.zIndex), 0);

        const targetAppId = app.isCustom ? 'custom_app_renderer' : app.id;
        const windowData = app.isCustom ? { manifest: app.data } : data;

        const newWindow: WindowInstance = {
            id: newWindowId,
            appId: targetAppId,
            zIndex: maxZIndex + 1,
            isMinimized: false,
            isMaximized: isMaximized,
            position: position,
            size: size,
            data: windowData,
            restoreSize: size,
        };

        log(`App ${appId} opened.`);
        return [...prevWindows, newWindow];
    });
  }, [log, appRegistry]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    log(`Window ${id} closed.`);
  }, [log]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    log(`Window ${id} minimized.`);
  }, [log]);

  const maximizeWindow = useCallback((id:string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        const wasMaximized = w.isMaximized;

        if (wasMaximized) {
            return {
                ...w,
                isMaximized: false,
                isMinimized: false,
                size: w.restoreSize || appRegistry.find(a => a.id === w.appId)?.defaultSize || { width: 600, height: 400},
            };
        } else {
            return {
                ...w,
                isMaximized: true,
                isMinimized: false,
                restoreSize: w.size,
                position: {x: 0, y: 0},
                size: { width: window.innerWidth, height: window.innerHeight }
            };
        }
      }
      return w;
    }));
    log(`Window ${id} maximized/restored.`);
  }, [log, appRegistry]);

  const moveWindow = useCallback((id: string, newPos: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        const x = Math.max(-w.size.width + 100, Math.min(newPos.x, window.innerWidth - 100));
        const y = Math.max(0, Math.min(newPos.y, window.innerHeight - TASKBAR_HEIGHT - 30));
        return { ...w, position: { x, y } };
      }
      return w;
    }));
  }, []);

  const resizeWindow = useCallback((id: string, newSize: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, size: { width: newSize.width, height: newSize.height } };
      }
      return w;
    }));
  }, []);

  const shutdown = useCallback(() => {
    log('System is shutting down...');
    try {
      if (isInstalled) {
        localStorage.setItem('aurora_user_settings', JSON.stringify(userSettings));
        localStorage.setItem('aurora_filesystem', JSON.stringify(fileSystem));
        log('System state saved.');
      }
    } catch (error) {
      console.error('Failed to save state on shutdown:', error);
      toast({ variant: 'destructive', title: 'Save Error', description: 'Could not save system state.' });
    }
    setOsState('shutdown');
    setTimeout(() => {
      setOsState('off');
      setSystemLoad(0);
      setWindows([]);
    }, 3000);
  }, [log, isInstalled, userSettings, fileSystem, toast]);

  const reboot = useCallback(async (goToRecovery = false) => {
    log('System reboot initiated...');
    setWindows([]);
    setOsState('restarting');
    await new Promise(res => setTimeout(res, 4000));

    log('System shutting down...');
    setOsState('shutdown');
    await new Promise(res => setTimeout(res, 3000));

    log('System powered off briefly.');
    setOsState('off');
    await new Promise(res => setTimeout(res, 2000));

    if (goToRecovery) {
      setOsState('recovery');
    } else {
      setOsState('booting');
    }
  }, [log]);

  const rebootToBios = useCallback(async () => {
    log('System reboot to BIOS initiated...');
    setSystemLoad(0);
    setWindows([]);
    setOsState('restarting');
    await new Promise(res => setTimeout(res, 4000));

    log('System shutting down...');
    setOsState('shutdown');
    await new Promise(res => setTimeout(res, 3000));

    log('System powered off briefly.');
    setOsState('off');
    await new Promise(res => setTimeout(res, 2000));

    log('Entering BIOS setup...');
    setOsState('bios');
  }, [log]);

  const finishSetup = useCallback(() => {
    log('Setup finished. System will restart.');
    try {
      const finalSettings = { ...userSettings, ...defaultSettings, language: userSettings.language, username: userSettings.username, password: userSettings.password };
      const finalFileSystem = JSON.parse(JSON.stringify(initialFileSystem));
      const usersFolder = findFolderByPath(finalFileSystem, ['Users']);
      if (usersFolder) {
        const defaultUserFolder = usersFolder.children.find(f => f.name === 'User');
        if(defaultUserFolder && defaultUserFolder.type === 'folder') {
          defaultUserFolder.name = finalSettings.username;
        }
      }

      localStorage.setItem('aurora_os_installed', 'true');
      localStorage.setItem('aurora_user_settings', JSON.stringify(finalSettings));
      localStorage.setItem('aurora_filesystem', JSON.stringify(finalFileSystem));
      localStorage.setItem('aurora_custom_apps', JSON.stringify([]));
      setIsInstalled(true);
      setFileSystem(finalFileSystem);
      setUserSettings(finalSettings);
      setCustomApps([]);
    } catch (error) {
      console.error('Failed to save installation status to localStorage:', error);
    }
    reboot();
  }, [log, userSettings, reboot]);

  const modifyFileSystem = useCallback((callback: (fs: Folder) => void) => {
    setFileSystem(currentFs => {
      const newFs = JSON.parse(JSON.stringify(currentFs));
      callback(newFs);
      return newFs;
    });
  }, []);

  const createFile = useCallback((path: string, content: string) => {
    modifyFileSystem(fs => {
      const pathParts = path.replace(/^\//, '').split('/');
      const fileName = pathParts.pop();
      if (!fileName) return;
      const parent = findFolderByPath(fs, pathParts);
      if (!parent) {
        toast({ variant: 'destructive', title: 'Error', description: `Parent folder for path '${path}' not found.` });
        return;
      }
      if (parent.children.some(c => c.name.toLowerCase() === fileName.toLowerCase())) {
        toast({ variant: 'destructive', title: 'Error', description: `Item '${fileName}' already exists.` });
        return;
      }

      const newFile: FileType = {
          id: `file-api-${Date.now()}`,
          name: fileName,
          type: 'file',
          extension: 'txt', // Default to txt
          content: content,
          isSystem: false,
          owner: 'user',
      };
      parent.children.push(newFile);
      toast({ title: 'Success', description: `File '${fileName}' created.` });
    });
  }, [modifyFileSystem, toast]);

  const createFolder = useCallback((path: string) => {
    modifyFileSystem(fs => {
      const pathParts = path.replace(/^\//, '').split('/');
      const folderName = pathParts.pop();
      if (!folderName) return;
      const parent = findFolderByPath(fs, pathParts);

      if (!parent) {
        toast({ variant: 'destructive', title: 'Error', description: `Parent folder for path '${path}' not found.` });
        return;
      }
      if (parent.children.some(c => c.name.toLowerCase() === folderName.toLowerCase())) {
        toast({ variant: 'destructive', title: 'Error', description: `Item '${folderName}' already exists.` });
        return;
      }
      const newFolder: Folder = {
        id: `folder-api-${Date.now()}`,
        name: folderName,
        type: 'folder',
        children: [],
        isSystem: false,
        owner: 'user',
      };
      parent.children.push(newFolder);
      toast({ title: 'Success', description: `Folder '${folderName}' created.` });
    });
  }, [modifyFileSystem, toast]);

  const deleteFile = useCallback((path: string) => {
    modifyFileSystem(fs => {
      const pathParts = path.replace(/^\//, '').split('/');
      const itemName = pathParts.pop();
      if (!itemName) return;
      const parent = findFolderByPath(fs, pathParts);

      if (!parent) {
        toast({ variant: 'destructive', title: 'Error', description: `Parent folder for '${path}' not found.` });
        return;
      }

      const itemIndex = parent.children.findIndex(c => c.name.toLowerCase() === itemName.toLowerCase());
      if (itemIndex === -1) {
          toast({ variant: 'destructive', title: 'Error', description: `Item '${itemName}' not found.` });
          return;
      }

      const itemToDelete = parent.children[itemIndex];
      if (itemToDelete.isSystem && itemToDelete.owner === 'system') {
          toast({ variant: 'destructive', title: 'Permission Denied' });
          return;
      }

      parent.children.splice(itemIndex, 1);

      if (itemToDelete.isSystem) {
          setUserSettings(s => ({ ...s, crashedFiles: [...(s.crashedFiles || []), path] }));
      }
      toast({ title: 'Success', description: `Item '${itemName}' deleted.` });
    });
  }, [modifyFileSystem, toast, setUserSettings]);

  const runTerminalCommand = useCallback((command: string) => {
    openWindow('terminal', { commandToRun: command });
  }, [openWindow]);

  const addFolderToDesktop = useCallback((name: string) => {
    createFolder(`/Users/${userSettings.username}/Desktop/${name}`);
  }, [createFolder, userSettings.username]);

  const createDesktopFolderAndCombine = useCallback((name: string, item1: FileSystemItem, item2: FileSystemItem) => {
    modifyFileSystem(fs => {
      const desktopPath = ['Users', userSettings.username, 'Desktop'];
      const desktopFolder = findFolderByPath(fs, desktopPath);
      if (!desktopFolder) return;

      const newFolder: Folder = {
          id: `folder-stack-${Date.now()}`,
          name: name,
          type: 'folder',
          children: [item1, item2],
          isSystem: false,
          owner: 'user'
      };

      desktopFolder.children.push(newFolder);
      desktopFolder.children = desktopFolder.children.filter(c => c.id !== item1.id && c.id !== item2.id);
    });
  }, [modifyFileSystem, userSettings.username]);

  const moveItemToDesktopFolder = useCallback((sourceItem: FileSystemItem, targetFolderItem: FileSystemItem) => {
    modifyFileSystem(fs => {
      const desktopFolder = findFolderByPath(fs, ['Users', userSettings.username, 'Desktop']);
      if (!desktopFolder || targetFolderItem.type !== 'folder') return;

      const targetFolder = desktopFolder.children.find(c => c.id === targetFolderItem.id) as Folder | undefined;
      if (!targetFolder) return;

      targetFolder.children.push(sourceItem);
      desktopFolder.children = desktopFolder.children.filter(c => c.id !== sourceItem.id);
    });
  }, [modifyFileSystem, userSettings.username]);

  const deleteDesktopFolder = useCallback((folderId: string) => {
    modifyFileSystem(fs => {
      const desktopFolder = findFolderByPath(fs, ['Users', userSettings.username, 'Desktop']);
      if (!desktopFolder) return;

      const folderToDelete = desktopFolder.children.find(c => c.id === folderId) as Folder | undefined;
      if (!folderToDelete || folderToDelete.type !== 'folder') return;

      desktopFolder.children.push(...folderToDelete.children);
      desktopFolder.children = desktopFolder.children.filter(c => c.id !== folderId);
    });
  }, [modifyFileSystem, userSettings.username]);

  const manifestToAppConfig = (manifest: CustomAppManifest): AppConfig => {
    const IconComponent = (LucideIcons as any)[manifest.icon] || LucideIcons.Package;
    return {
      id: manifest.id,
      name: manifest.name,
      icon: IconComponent,
      component: () => null, // The renderer is used instead
      defaultSize: { width: 500, height: 600 },
      isCustom: true,
      data: manifest,
    };
  };

  const installCustomApp = useCallback((manifest: CustomAppManifest) => {
    const appName = manifest.name[userSettings.language] || manifest.name.en;

    modifyFileSystem(fs => {
        const programFiles = findFolderByPath(fs, ['Program Files']);
        if (programFiles) {
            programFiles.children = programFiles.children.filter(c => c.id !== `progs_${manifest.id}`);
            const newProgramFolder: Folder = {
                id: `progs_${manifest.id}`, name: appName, type: 'folder', isSystem: true, owner: 'system', children: [
                    { id: `${manifest.id}.dll`, name: `${manifest.id}.dll`, type: 'file', extension: 'dll', content: 'app library', isSystem: true, owner: 'system' },
                    { id: `${manifest.id}.cfg`, name: 'config.cfg', type: 'file', extension: 'cfg', content: 'config file', isSystem: true, owner: 'system' },
                ]
            };
            programFiles.children.push(newProgramFolder);
        }

        const desktop = findFolderByPath(fs, ['Users', userSettings.username, 'Desktop']);
        if (desktop) {
            desktop.children = desktop.children.filter(c => !(c.type === 'shortcut' && c.targetAppId === manifest.id));
            const newShortcut: Shortcut = {
                id: `desktop_shortcut_${manifest.id}`, name: appName, type: 'shortcut', targetAppId: manifest.id, isSystem: true, owner: 'user',
            };
            desktop.children.push(newShortcut);
        }
    });

    setCustomApps(prev => {
        const newApp = manifestToAppConfig(manifest);
        const existingIndex = prev.findIndex(a => a.id === newApp.id);
        if (existingIndex > -1) {
            const updatedApps = [...prev];
            updatedApps[existingIndex] = newApp;
            return updatedApps;
        }
        return [...prev, newApp];
    });
  }, [userSettings.language, userSettings.username, modifyFileSystem]);

  const uninstallCustomApp = useCallback((appId: string) => {
    const appToUninstall = appRegistry.find(app => app.id === appId);
    if (!appToUninstall) return;

    modifyFileSystem(fs => {
      const desktop = findFolderByPath(fs, ['Users', userSettings.username, 'Desktop']);
      if (desktop) {
        desktop.children = desktop.children.filter(item => !(item.type === 'shortcut' && item.targetAppId === appId));
      }
      const programFiles = findFolderByPath(fs, ['Program Files']);
      if (programFiles) {
        programFiles.children = programFiles.children.filter(folder => folder.id !== `progs_${appId}`);
      }
    });

    if (appToUninstall.isCustom) {
        setCustomApps(prev => prev.filter(app => app.id !== appId));
    }
  }, [appRegistry, userSettings.username, modifyFileSystem]);

  const applyPendingDevSettings = useCallback(() => {
    const change = userSettings.pendingDevSettingsChange;
    if (!change) {
      reboot();
      return;
    };

    if (change === 'disable') {
        const installerApp = standardApps.find(a => a.id === 'installer');
        if (installerApp) uninstallCustomApp(installerApp.id);
        customApps.forEach(app => uninstallCustomApp(app.id));
    } else if (change === 'enable') {
        const installerApp = standardApps.find(a => a.id === 'installer');
        if (installerApp) {
            const installerManifest: CustomAppManifest = {
                id: 'installer',
                version: 1,
                name: { en: 'Installer', de: 'Installer' },
                icon: 'Wrench',
                content: [] // Installer has its own UI
            };
            installCustomApp(installerManifest);
        }
    }

    setUserSettings(s => ({
        ...s,
        developerSettings: {
            ...s.developerSettings,
            enabled: change === 'enable',
            installerEnabled: change === 'enable',
        },
        pendingDevSettingsChange: null,
    }));

    reboot();
  }, [userSettings.pendingDevSettingsChange, customApps, reboot, installCustomApp, uninstallCustomApp]);

  const reportError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    log(`ERROR: ${error.message}`);
  }, [log]);


  const value: AuroraContextType = {
    osState, setOsState,
    theme, toggleTheme,
    fileSystem, setFileSystem,
    userSettings, setUserSettings,
    windows, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow, resizeWindow,
    reboot, shutdown,
    log, history,
    finishSetup,
    isInstalled,
    rebootToBios,
    applyPendingDevSettings,
    createFile,
    createFolder,
    deleteFile,
    runTerminalCommand,
    addFolderToDesktop,
    createDesktopFolderAndCombine,
    moveItemToDesktopFolder,
    deleteDesktopFolder,
    systemLoad, setSystemLoad,
    appRegistry,
    customApps,
    installCustomApp,
    uninstallCustomApp,
    reportError,
  };

  return (
    <AuroraContext.Provider value={value}>
      {children}
    </AuroraContext.Provider>
  );
}

export function useAurora() {
  const context = useContext(AuroraContext);
  if (!context) {
    throw new Error('useAurora must be used within an AuroraProvider');
  }
  return context;
}
