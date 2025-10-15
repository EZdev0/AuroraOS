import type { Folder } from './aurora-types';
import { standardApps } from './app-registry';

const BINARY_CONTENT_DLL = `ý•V(¥Lš²š²›êí<binary_data_placeholder_for_realism> ´µS¶š®š›³B›²š®©ž›®š²š®Éš›®š²š®›®š²š®š›®š²š®›®š²š®›®š²š®š›®š²š®›®š²š®›®š²š®›®š²š®›®š²š®›®š²š®`;
const BINARY_CONTENT_SYS = `; SYS File - For System Use Only
; Contains low-level driver information for hardware components.
; Modifying this file can lead to hardware failure or total system crash.
[Driver.Config]
Version=3.0.0
Vendor=AuroraSystems
Target=KernelMode`;
const BOOT_CFG_CONTENT = `[boot loader]
timeout=10
default=multi(0)disk(0)rdisk(0)partition(1)\\AURORA
[operating systems]
multi(0)disk(0)rdisk(0)partition(1)\\AURORA="AuroraOS v2.1" /fastdetect /NEURAL_LINK`;


export const initialFileSystem: Folder = {
  id: 'root',
  name: 'C:',
  type: 'folder',
  isSystem: true,
  owner: 'system',
  children: [
    {
      id: 'users',
      name: 'Users',
      type: 'folder',
      isSystem: true,
      owner: 'system',
      children: [
        {
          id: 'user_profile',
          name: 'User',
          type: 'folder',
          isSystem: false,
          owner: 'user',
          children: [
            {
              id: 'desktop',
              name: 'Desktop',
              type: 'folder',
              isSystem: true,
              owner: 'user',
              children: standardApps
                .filter(app => !app.isUtility)
                .map(app => ({
                  id: `desktop_shortcut_${app.id}`,
                  name: app.name.en,
                  type: 'shortcut' as const,
                  targetAppId: app.id,
                  isSystem: true as const,
                  owner: 'user' as const,
                }))
            },
            { id: 'docs', name: 'Documents', type: 'folder', isSystem: true, owner: 'user', children: [
              { id: 'welcome.txt', name: 'welcome.txt', type: 'file', extension: 'txt', content: 'Welcome to AuroraOS! We hope you enjoy your experience.', isSystem: false, owner: 'user' },
              { id: 'project_notes.txt', name: 'project_notes.txt', type: 'file', extension: 'txt', content: 'Project Aurora:\n- Finalize UI mockups\n- Test kernel stability\n- Prepare for launch', isSystem: false, owner: 'user' },
            ] },
            { id: 'pics', name: 'Pictures', type: 'folder', isSystem: true, owner: 'user', children: [
                { id: 'aurora_wallpaper.jpg', name: 'aurora_wallpaper.jpg', type: 'file', extension: 'txt', content: '[Image Data Placeholder]', isSystem: false, owner: 'user' },
            ] },
            { id: 'downloads', name: 'Downloads', type: 'folder', isSystem: true, owner: 'user', children: [] },
          ]
        }
      ],
    },
    {
      id: 'aurora',
      name: 'Aurora',
      type: 'folder',
      isSystem: true,
      owner: 'system',
      children: [
        {
          id: 'systemcore',
          name: 'SystemCore',
          type: 'folder',
          isSystem: true,
          owner: 'system',
          children: [
            { id: 'kernel.core', name: 'kernel.core', type: 'file', extension: 'core', content: BINARY_CONTENT_SYS, isSystem: true, owner: 'system' },
            { id: 'aurora.kernel', name: 'aurora.kernel', type: 'file', extension: 'kernel', content: BINARY_CONTENT_SYS, isSystem: true, owner: 'system' },
            { id: 'ui.core', name: 'ui.core', type: 'file', extension: 'dll', content: BINARY_CONTENT_DLL, isSystem: true, owner: 'system' },
            { id: 'graphics.engine', name: 'graphics.engine', type: 'file', extension: 'engine', content: BINARY_CONTENT_DLL, isSystem: true, owner: 'system' },
            { id: 'shell.host', name: 'shell.host', type: 'file', extension: 'host', content: BINARY_CONTENT_DLL, isSystem: true, owner: 'system' },
          ],
        },
        {
          id: 'boot',
          name: 'Boot',
          type: 'folder',
          isSystem: true,
          owner: 'system',
          children: [
            { id: 'boot.cfg', name: 'boot.cfg', type: 'file', extension: 'cfg', content: BOOT_CFG_CONTENT, isSystem: true, owner: 'system' },
          ]
        },
        {
          id: 'drivers',
          name: 'Drivers',
          type: 'folder',
          isSystem: true,
          owner: 'system',
          children: [
            { id: 'gpu.sys', name: 'gpu.sys', type: 'file', extension: 'sys', content: BINARY_CONTENT_SYS, isSystem: true, owner: 'system' },
            { id: 'net.sys', name: 'net.sys', type: 'file', extension: 'sys', content: BINARY_CONTENT_SYS, isSystem: true, owner: 'system' },
          ]
        },
        {
          id: 'logs',
          name: 'Logs',
          type: 'folder',
          isSystem: false,
          owner: 'system',
          children: [
            { id: 'system.log', name: 'system.log', type: 'file', extension: 'log', content: 'AuroraOS System Log\n--- BOOT (SUCCESS) ---\n', isSystem: false, owner: 'system' },
            { id: 'events.log', name: 'events.log', type: 'file', extension: 'log', content: 'Event Log\n', isSystem: false, owner: 'system' },
          ],
        },
      ],
    },
    {
      id: 'program_files',
      name: 'Program Files',
      type: 'folder',
      isSystem: true,
      owner: 'system',
      children: standardApps.map(app => ({
        id: `progs_${app.id}`,
        name: app.name.en,
        type: 'folder' as const,
        isSystem: true,
        owner: 'system' as const,
        children: [
          { id: `${app.id}.dll`, name: `${app.id}.dll`, type: 'file' as const, extension: 'dll' as const, content: `[Library for ${app.name.en}]\n${BINARY_CONTENT_DLL}`, isSystem: true, owner: 'system' as const },
          { id: `${app.id}.cfg`, name: 'config.cfg', type: 'file' as const, extension: 'cfg' as const, content: `[Config]\nVersion=1.0\nLanguage=${app.name.de ? 'de,en' : 'en'}`, isSystem: true, owner: 'system' as const },
        ]
      }))
    }
  ],
};
