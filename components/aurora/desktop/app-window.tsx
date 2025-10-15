'use client';

import { useAurora } from "@/context/aurora-context";
import { AppConfig, WindowInstance } from "@/lib/aurora-types";
import { X, Minimize, Maximize, LucideIcon } from "lucide-react";
import React, { useRef } from "react";

type AppWindowProps = WindowInstance;

export default function AppWindow(props: AppWindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow, resizeWindow, appRegistry } = useAurora();
  const app = appRegistry.find(a => a.id === props.appId);

  const headerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (props.isMaximized) return;
    focusWindow(props.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = props.position.x;
    const startTop = props.position.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = startLeft + e.clientX - startX;
      const newY = startTop + e.clientY - startY;
      moveWindow(props.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!app) {
    return null;
  }

  const Icon = app.icon as LucideIcon;
  const AppComponent = app.component;

  return (
    <div
      className="absolute bg-card/80 backdrop-blur-lg border border-border/50 rounded-lg shadow-2xl flex flex-col"
      style={{
        top: props.position.y,
        left: props.position.x,
        width: props.isMaximized ? '100%' : props.size.width,
        height: props.isMaximized ? 'calc(100% - 3.5rem)' : props.size.height,
        zIndex: props.zIndex,
        transition: props.isMaximized ? 'top 0.2s ease-out, left 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out' : 'none',
      }}
      onClick={() => focusWindow(props.id)}
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="flex items-center justify-between h-10 px-2 border-b border-border/50 flex-shrink-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <span className="text-sm font-medium">{app.name.en}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => minimizeWindow(props.id)} className="p-1 rounded hover:bg-white/10"><Minimize className="w-4 h-4" /></button>
          <button onClick={() => maximizeWindow(props.id)} className="p-1 rounded hover:bg-white/10"><Maximize className="w-4 h-4" /></button>
          <button onClick={() => closeWindow(props.id)} className="p-1 rounded hover:bg-destructive/50"><X className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-auto">
        <AppComponent windowId={props.id} closeWindow={() => closeWindow(props.id)} data={props.data} />
      </div>
    </div>
  );
}
