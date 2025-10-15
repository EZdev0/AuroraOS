'use client';
import type { AppProps } from 'next/app';
import { Inter, Space_Grotesk, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { AuroraProvider, useAurora } from "@/context/aurora-context";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/hooks/use-toast";
import { useEffect } from 'react';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], variable: "--font-source-code-pro" });

function FullscreenEffect() {
  const { userSettings } = useAurora();
  useEffect(() => {
    const requestFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      }
    };

    let timeoutId: NodeJS.Timeout;
    if (userSettings.autoFullscreen) {
       timeoutId = setTimeout(requestFullscreen, userSettings.fullscreenTimeout * 1000);
    }

    const earlyFullscreen = () => {
      if (userSettings.autoFullscreen) {
        clearTimeout(timeoutId);
        requestFullscreen();
      }
      window.removeEventListener('click', earlyFullscreen);
      window.removeEventListener('touchend', earlyFullscreen);
    }

    window.addEventListener('click', earlyFullscreen);
    window.addEventListener('touchend', earlyFullscreen);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('click', earlyFullscreen);
      window.removeEventListener('touchend', earlyFullscreen);
    };
  }, [userSettings.autoFullscreen, userSettings.fullscreenTimeout]);

  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.variable} ${spaceGrotesk.variable} ${sourceCodePro.variable} font-body`}>
      <ToastProvider>
        <AuroraProvider>
          <FullscreenEffect />
          <Component {...pageProps} />
          <Toaster />
        </AuroraProvider>
      </ToastProvider>
    </main>
  );
}

export default MyApp;
