'use client';
import type { CustomAppManifest } from '@/lib/aurora-types';

export default function CustomAppRenderer({ data }: { data?: { manifest: CustomAppManifest } }) {
  if (!data || !data.manifest) {
    return <div>Error: No application manifest provided.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="font-bold text-lg">{data.manifest.name.en}</h1>
      <p className="text-sm text-muted-foreground">Custom app rendering is not yet fully implemented.</p>
      <pre className="mt-4 text-xs bg-secondary/30 p-2 rounded">
        {JSON.stringify(data.manifest, null, 2)}
      </pre>
    </div>
  )
}
