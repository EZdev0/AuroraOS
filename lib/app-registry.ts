import type { AppConfig } from './aurora-types';
import { Settings, FolderKanban, Terminal, Tv, FileArchive, Trash, HelpCircle, Wrench, Package, FileText } from 'lucide-react';
import SettingsApp from '@/components/aurora/apps/settings';
import ExplorerApp from '@/components/aurora/apps/explorer';
import TerminalApp from '@/components/aurora/screens/terminal';
import PlaceholderApp from '@/components/aurora/apps/placeholder-app';
import ZipManagerApp from '@/components/aurora/apps/zip-manager';
import CleanerApp from '@/components/aurora/apps/cleaner';
import UnknownApp from '@/components/aurora/apps/unknown-app';
import InstallerApp from '@/components/aurora/apps/installer';
import CustomAppRenderer from '@/components/aurora/apps/custom-app-renderer';
import NotepadApp from '@/components/aurora/apps/notepad';

export const standardApps: AppConfig[] = [
  {
    id: 'explorer',
    name: { de: 'Explorer', en: 'Explorer' },
    icon: FolderKanban,
    component: ExplorerApp,
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'settings',
    name: { de: 'Einstellungen', en: 'Settings' },
    icon: Settings,
    component: SettingsApp,
    defaultSize: { width: 640, height: 700 },
  },
  {
    id: 'terminal',
    name: { de: 'Terminal', en: 'Terminal' },
    icon: Terminal,
    component: TerminalApp,
    defaultSize: { width: 720, height: 480 },
  },
  {
    id: 'cleaner',
    name: { de: 'Reiniger', en: 'Cleaner' },
    icon: Trash,
    component: CleanerApp,
    defaultSize: { width: 550, height: 650 },
  },
  {
    id: 'notepad',
    name: { de: 'Editor', en: 'Notepad' },
    icon: FileText,
    component: NotepadApp,
    defaultSize: { width: 600, height: 450 },
    isUtility: true,
  },
  {
    id: 'media_player',
    name: { de: 'Media Player', en: 'Media Player' },
    icon: Tv,
    component: PlaceholderApp,
    defaultSize: { width: 500, height: 400 },
  },
  {
    id: 'zip_manager',
    name: { de: 'Zip-Archivierer', en: 'Zip Archiver' },
    icon: FileArchive,
    component: ZipManagerApp,
    defaultSize: { width: 400, height: 200 },
    isUtility: true,
  },
  {
    id: 'unknown_app',
    name: { de: 'Unbekannte App', en: 'Unknown App' },
    icon: HelpCircle,
    component: UnknownApp,
    defaultSize: { width: 400, height: 300 },
    isUtility: true,
  },
  {
    id: 'installer',
    name: { de: 'Installer', en: 'Installer' },
    icon: Wrench,
    component: InstallerApp,
    defaultSize: { width: 450, height: 500 },
    isUtility: true,
  },
  {
    id: 'custom_app_renderer',
    name: { de: 'Custom App', en: 'Custom App' },
    icon: Package,
    component: CustomAppRenderer,
    defaultSize: { width: 500, height: 400 },
    isUtility: true,
  }
];

export const getAppRegistry = (customApps: AppConfig[] = []): AppConfig[] => {
  return [...standardApps, ...customApps];
}
