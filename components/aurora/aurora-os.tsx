'use client';

import { useAurora } from '@/context/aurora-context';
import PowerOnScreen from './screens/power-on-screen';
import BootScreen from './screens/boot-screen';
import BiosScreen from './screens/bios-screen';
import InstallScreen from './screens/install-screen';
import SetupWelcomeScreen from './screens/setup-welcome-screen';
import SetupLanguageScreen from './screens/setup-language-screen';
import SetupAccountScreen from './screens/setup-account-screen';
import SetupUpdatesScreen from './screens/setup-updates-screen';
import RestartScreen from './screens/restart-screen';
import LoginScreen from './screens/login-screen';
import DesktopLoadingScreen from './screens/desktop-loading-screen';
import DesktopEnvironment from './desktop/desktop-environment';
import BSODScreen from './screens/bsod-screen';
import RepairScreen from './screens/repair-screen';
import RecoveryScreen from './screens/recovery-screen';
import ShutdownScreen from './screens/shutdown-screen';
import NoOsFoundScreen from './screens/no-os-found-screen';
import CloudRepairScreen from './screens/cloud-repair-screen';
import { cn } from '@/lib/utils';
import BootDeviceNotFoundScreen from './screens/boot-device-not-found-screen';
import UpdateScreen from './screens/update-screen';
import TerminalApp from './screens/terminal';

// Placeholder for screens that are not yet created
const PlaceholderScreen = ({ state }: { state: string }) => (
  <div className="flex h-full w-full items-center justify-center bg-black text-white">
    <div className="text-center">
      <h1 className="text-2xl font-bold">AuroraOS</h1>
      <p>Current State: <span className="font-mono">{state}</span></p>
      <p>(This screen is not yet implemented)</p>
    </div>
  </div>
);


export function AuroraOS() {
  const { osState, theme, systemLoad } = useAurora();

  const renderScreen = () => {
    switch (osState) {
      case 'off':
        return <PowerOnScreen />;
      case 'booting':
        return <BootScreen />;
      case 'bios':
        return <BiosScreen />;
      case 'installing':
        return <InstallScreen />;
      case 'setup_welcome':
        return <SetupWelcomeScreen />;
       case 'setup_language':
        return <SetupLanguageScreen />;
       case 'setup_account':
         return <SetupAccountScreen />;
       case 'setup_updates':
         return <SetupUpdatesScreen />;
       case 'restarting':
         return <RestartScreen />;
       case 'updating':
         return <UpdateScreen />;
       case 'shutdown':
         return <ShutdownScreen />;
      case 'login':
        return <LoginScreen />;
       case 'desktop_loading':
         return <DesktopLoadingScreen />;
      case 'desktop':
        return <DesktopEnvironment />;
       case 'run_command_in_terminal':
         return <TerminalApp/>;
      case 'bsod':
        return <BSODScreen />;
       case 'repairing':
         return <RepairScreen />;
       case 'cloud_repair':
         return <CloudRepairScreen />;
       case 'recovery':
         return <RecoveryScreen />;
       case 'no_os_found':
         return <NoOsFoundScreen />;
       case 'boot_device_not_found':
         return <BootDeviceNotFoundScreen />;
      default:
        return <PlaceholderScreen state={osState} />;
    }
  };

  const instabilityClass = systemLoad > 50 ? 'system-instability' : '';

  return (
    <div className={cn(
        `h-screen w-screen overflow-hidden font-body`,
        osState === 'desktop' ? theme : 'dark',
        instabilityClass
      )}
      style={{'--system-load': systemLoad} as React.CSSProperties}
    >
      {renderScreen()}
    </div>
  );
}
