'use client';
import { useAurora } from "@/context/aurora-context";
import type { AppConfig } from "@/lib/aurora-types";
import { LucideIcon } from "lucide-react";

export default function PlaceholderApp({ data }: { data?: any }) {
  const { appRegistry } = useAurora();
  const appId = data?.appId || 'unknown_app';
  const app = appRegistry.find(a => a.id === appId) as AppConfig;

  const Icon = app.icon as LucideIcon;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <Icon className="w-16 h-16 mb-4 text-muted-foreground" />
      <h2 className="text-2xl font-bold">{app.name.en}</h2>
      <p className="text-muted-foreground">This application is not yet implemented.</p>
    </div>
  );
}
