import type { LucideIcon } from 'lucide-react';
import { z } from 'zod';

export type OSState =
  | 'off'
  | 'booting'
  | 'bios'
  | 'installing'
  | 'setup_welcome'
  | 'setup_language'
  | 'setup_account'
  | 'setup_updates'
  | 'restarting'
  | 'updating'
  | 'login'
  | 'desktop_loading'
  | 'desktop'
  | 'bsod'
  | 'repairing'
  | 'recovery'
  | 'cloud_repair'
  | 'shutdown'
  | 'no_os_found'
  | 'boot_device_not_found'
  | 'run_command_in_terminal';

export type Theme = 'light' | 'dark';

export interface File {
  id: string;
  name: string;
  type: 'file';
  extension: 'txt' | 'sys' | 'dll' | 'cfg' | 'log' | 'core' | 'kernel' | 'engine' | 'host' | 'zip' | 'aur';
  content: string;
  isSystem: boolean;
  owner: 'system' | 'user';
}

export interface Folder {
  id: string;
  name: string;
  type: 'folder';
  children: FileSystemItem[];
  isSystem: boolean;
  owner: 'system' | 'user';
}

export interface Shortcut {
  id: string;
  name: string;
  type: 'shortcut';
  targetAppId: string;
  isSystem: boolean;
  owner: 'user';
}

export type FileSystemItem = File | Folder | Shortcut;

export interface BiosSettings {
  bootPriority: 'ssd' | 'usb' | 'net';
}

export interface DeveloperSettings {
  enabled: boolean;
  installerEnabled: boolean;
  allowExtraCommands: boolean;
}

export interface UserSettings {
  language: 'de' | 'en';
  username: string;
  password?: string;
  crashedFiles: string[];
  avatar: string;
  autoFullscreen: boolean;
  fullscreenTimeout: number;
  biosSettings: BiosSettings;
  developerSettings: DeveloperSettings;
  shortcutsNeedRestore?: boolean;
  pendingDevSettingsChange: 'enable' | 'disable' | null;
}

export type AppError = {
  error: Error;
  errorInfo: React.ErrorInfo;
}

export const EditImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to edit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('The user prompt describing the desired edit.'),
});
export type EditImageInput = z.infer<typeof EditImageInputSchema>;

export const EditImageOutputSchema = z.object({
  editedPhotoDataUri: z.string().describe("The edited photo as a data URI."),
});
export type EditImageOutput = z.infer<typeof EditImageOutputSchema>;

export const AvailableFlows = z.enum(['imageEdit']);
export type FlowName = z.infer<typeof AvailableFlows>;

const ApiActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('REBOOT') }),
  z.object({ type: z.literal('SHUTDOWN') }),
  z.object({ type: z.literal('CREATE_FILE'), payload: z.object({ path: z.string(), content: z.string().optional() }) }),
  z.object({ type: z.literal('CREATE_FOLDER'), payload: z.object({ path: z.string() }) }),
  z.object({ type: z.literal('DELETE_FILE'), payload: z.object({ path: z.string() }) }),
  z.object({ type: z.literal('RUN_COMMAND'), payload: z.object({ command: z.string() }) }),
  z.object({
    type: z.literal('RUN_FLOW'),
    payload: z.object({
      flow: AvailableFlows,
      input: z.record(z.any()),
    }),
  }),
  z.object({
    type: z.literal('SET_STATE'),
    payload: z.object({
      widgetId: z.string().describe("The ID of the widget whose state should be updated."),
      key: z.string().describe("The key in the widget's state object to set (e.g., 'value')."),
      value: z.any().describe("The new value to set. Can be a literal or a handlebars expression like '{{state.my-function.result}}'."),
    }),
  }),
]);

const WidgetBaseSchema = z.object({
  id: z.string().describe("Unique identifier for the widget within the app."),
  label: z.string().optional().describe("Label text for the widget (e.g., for inputs, switches)."),
});

const HeaderWidgetSchema = WidgetBaseSchema.extend({
  type: z.literal('header'),
  text: z.string().describe("The main heading text."),
  description: z.string().optional().describe("Optional subheading text."),
});

const ParagraphWidgetSchema = WidgetBaseSchema.extend({
  type: z.literal('paragraph'),
  text: z.string().describe("The paragraph text content. Can contain state references like '{{state.widgetId.property}}'."),
});

const SwitchWidgetSchema = WidgetBaseSchema.extend({
  type: z.literal('switch'),
});

const ButtonWidgetSchema = WidgetBaseSchema.extend({
  type: z.literal('button'),
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).optional(),
  action: ApiActionSchema.optional(),
  actions: z.array(ApiActionSchema).optional().describe("An array of actions to be executed in sequence."),
});

const InputWidgetSchema = WidgetBaseSchema.extend({
  type: z.literal('input'),
  placeholder: z.string().optional(),
  readonly: z.boolean().optional().describe("If true, the input field is not editable by the user."),
});

const FileWidgetSchema = WidgetBaseSchema.extend({
  type: z.literal('file'),
  accept: z.string().optional().describe("MIME type for file input (e.g., 'image/*')."),
});

const ImageWidgetSchema = WidgetBaseSchema.extend({
  type: z.literal('image'),
  src: z.string().optional().describe("Image source URL or dynamic state reference like '{{state.widgetId.property}}'."),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

const FunctionWidgetSchema = WidgetBaseSchema.extend({
  type: z.literal('function'),
  function: z.string().describe("A string containing a self-contained JavaScript function body. It receives 'state' as an argument and must return a value. Example: 'return parseInt(state.input1.value) + parseInt(state.input2.value);'"),
});

export const CustomAppWidgetSchema: z.ZodType<any> = z.lazy(() => z.discriminatedUnion('type', [
  HeaderWidgetSchema,
  ParagraphWidgetSchema,
  SwitchWidgetSchema,
  ButtonWidgetSchema,
  InputWidgetSchema,
  FileWidgetSchema,
  ImageWidgetSchema,
  FunctionWidgetSchema,
  WidgetBaseSchema.extend({
    type: z.literal("tabs"),
    tabs: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
        content: z.array(CustomAppWidgetSchema),
      })
    ),
  }),
]));

export const CustomAppManifestSchema = z.object({
  id: z.string().describe("Unique app ID in reverse-domain format, e.g., 'com.example.myapp'."),
  version: z.number().describe("The version number of the app."),
  name: z.object({
    en: z.string().describe("English name of the app."),
    de: z.string().optional().describe("Optional German name of the app."),
  }),
  icon: z.string().describe("A valid icon name from the Lucide React library."),
  content: z.array(CustomAppWidgetSchema).describe("An array of widgets defining the app's UI."),
});

export type ApiAction = z.infer<typeof ApiActionSchema>;
export type CustomAppWidget = z.infer<typeof CustomAppWidgetSchema>;
export type CustomAppManifest = z.infer<typeof CustomAppManifestSchema>;

export interface AppConfig {
  id: string;
  name: { en: string; de?: string };
  icon: LucideIcon;
  component: React.ComponentType<{ windowId: string; closeWindow: () => void; data?: any; }>;
  defaultSize: { width: number; height: number };
  isUtility?: boolean;
  isCustom?: boolean;
  data?: any;
}

export interface WindowInstance {
  id: string;
  appId: string;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number, height: number };
  restoreSize?: { width: number, height: number };
  data?: any;
}

export type AuroraContextType = {
  osState: OSState;
  setOsState: React.Dispatch<React.SetStateAction<OSState>>;
  theme: Theme;
  toggleTheme: () => void;
  fileSystem: Folder;
  setFileSystem: React.Dispatch<React.SetStateAction<Folder>>;
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  windows: WindowInstance[];
  openWindow: (appId: string, data?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, newPos: { x: number; y: number }) => void;
  resizeWindow: (id: string, newSize: { width: number; height: number }) => void;
  reboot: (goToRecovery?: boolean) => Promise<void>;
  shutdown: () => void;
  log: (message: string) => void;
  history: string[];
  finishSetup: () => void;
  isInstalled: boolean;
  rebootToBios: () => Promise<void>;
  applyPendingDevSettings: () => void;
  createFile: (path: string, content: string) => void;
  createFolder: (path: string) => void;
  deleteFile: (path: string) => void;
  runTerminalCommand: (command: string) => void;
  addFolderToDesktop: (name: string) => void;
  createDesktopFolderAndCombine: (name: string, item1: FileSystemItem, item2: FileSystemItem) => void;
  moveItemToDesktopFolder: (sourceItem: FileSystemItem, targetFolder: FileSystemItem) => void;
  deleteDesktopFolder: (folderId: string) => void;
  systemLoad: number;
  setSystemLoad: React.Dispatch<React.SetStateAction<number>>;
  appRegistry: AppConfig[];
  customApps: AppConfig[];
  installCustomApp: (manifest: CustomAppManifest) => void;
  uninstallCustomApp: (appId: string) => void;
  reportError: (error: Error, errorInfo: React.ErrorInfo) => void;
};
