import type { Folder, FileSystemItem } from './aurora-types';

export const findFolderByPath = (root: Folder, path: string[]): Folder | null => {
  if (!path || path.length === 0) {
    return root;
  }

  let current: Folder | null = root;
  for (const part of path) {
    if (!current) return null;

    const nextNode: FileSystemItem | undefined = current.children.find(
        item => item.name.toLowerCase() === part.toLowerCase() && item.type === 'folder'
    );

    if (nextNode && nextNode.type === 'folder') {
        current = nextNode;
    } else {
        return null;
    }
  }
  return current;
};

export const findFileByPath = (root: Folder, path: string[]) => {
    // Simplified version
    const fileName = path.pop();
    if (!fileName) return null;
    const folder = findFolderByPath(root, path);
    return folder?.children.find(item => item.name.toLowerCase() === fileName.toLowerCase() && item.type === 'file');
}
