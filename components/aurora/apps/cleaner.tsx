'use client';
import { Button } from '@/components/ui/button';

export default function CleanerApp() {
  return (
    <div className="p-4">
      <h1 className="font-bold text-lg">System Cleaner</h1>
      <p className="text-sm text-muted-foreground">This feature is not yet implemented.</p>
      <Button className="mt-4" disabled>Scan for junk</Button>
    </div>
  )
}
