'use client';
import { useAurora } from "@/context/aurora-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Power, PowerOff, RotateCcw, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Taskbar() {
  const { windows, focusWindow, reboot, shutdown, appRegistry } = useAurora();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="h-14 bg-black/20 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-2">
      <div className="flex items-center gap-1">
        {/* Start Menu */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-primary/30">
              <Power className="h-6 w-6 text-primary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="mb-2 w-48 bg-popover/80 backdrop-blur-lg border-border">
            <div className="grid gap-2">
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => reboot()}>
                <RotateCcw className="h-4 w-4" /> Restart
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={shutdown}>
                <PowerOff className="h-4 w-4" /> Shutdown
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Window Icons */}
        <div className="flex items-center gap-1">
          {windows.map(win => {
            const app = appRegistry.find(a => a.id === (win.data?.manifest?.id || win.appId));
            const Icon = app?.icon as LucideIcon;
            const appName = app?.name.en || "Unknown App";

            return (
              <Button
                key={win.id}
                variant="ghost"
                className={cn(
                  "h-10 w-10 p-2 transition-all duration-200 relative",
                  !win.isMinimized && "bg-primary/20 text-primary",
                  win.isMinimized && "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => focusWindow(win.id)}
                title={appName}
              >
                {Icon && <Icon className="h-6 w-6" />}
                 <div className={cn("absolute bottom-0 h-1 w-4 rounded-t-full", !win.isMinimized ? "bg-accent" : "bg-transparent")}/>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Clock */}
      <div className="font-code text-center text-sm px-4">
        <p>{currentTime}</p>
      </div>
    </footer>
  );
}
