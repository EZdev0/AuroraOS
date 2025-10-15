import type { Folder } from './aurora-types';
import { standardApps } from './app-registry';

const BINARY_CONTENT_DLL = `[simulated binary content]`;
const BINARY_CONTENT_SYS = `[simulated system data]`;

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
            ] },
            { id: 'pics', name: 'Pictures', type: 'folder', isSystem: true, owner: 'user', children: [] },
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
          { id: `${app.id}.dll`, name: `${app.id}.dll`, type: 'file' as const, extension: 'dll' as const, content: BINARY_CONTENT_DLL, isSystem: true, owner: 'system' as const },
        ]
      }))
    }
  ],
};
