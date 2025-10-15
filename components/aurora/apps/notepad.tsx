'use client';
import { useAurora } from '@/context/aurora-context';
import { useState, useEffect } from 'react';
import { findFileByPath } from '@/lib/filesystem-utils'; // Assuming this function will be created

export default function NotepadApp({ data }: { data?: { filePath?: string } }) {
  const { fileSystem } = useAurora();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (data?.filePath) {
      // This is a simplified lookup. A real implementation would be more robust.
      const pathParts = data.filePath.replace(/^\//, '').split('/');
      const fileName = pathParts.pop();
      // const folder = findFolderByPath(fileSystem, pathParts);
      // const file = folder?.children.find(f => f.name === fileName && f.type === 'file');
      // if (file && file.type === 'file') {
      //   setContent(file.content);
      // }
      setContent(`Content of ${data.filePath} would be here.`);
    }
  }, [data, fileSystem]);

  return (
    <textarea
      className="w-full h-full bg-background text-foreground p-2 resize-none border-none outline-none font-code"
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  );
}
