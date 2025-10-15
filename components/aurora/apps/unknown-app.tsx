'use client';
import { HelpCircle } from "lucide-react";

export default function UnknownApp({ data }: { data?: { originalAppId?: string } }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <HelpCircle className="w-16 h-16 mb-4 text-destructive" />
      <h2 className="text-2xl font-bold">Unknown Application</h2>
      <p className="text-muted-foreground">
        The application "{data?.originalAppId || 'unknown'}" could not be found.
      </p>
    </div>
  );
}
