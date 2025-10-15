'use client';
import { useAurora } from '@/context/aurora-context';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CrashReason = 'update_failed' | 'kernel_panic' | 'unknown';

export default function BSODScreen({ data }: { data?: { reason?: CrashReason }}) {
  const { reboot, userSettings } = useAurora();

  const T = userSettings.language === 'de' ? {
    title: "Ein kritisches Problem ist in AuroraOS aufgetreten.",
    subtitle: "Das System wurde angehalten, um Schäden an Ihrem Computer zu vermeiden.",
    errorCode: "FEHLERCODE",
    cause: "URSACHE",
    updateFailedCause: "Ein kritisches System-Update konnte nicht abgeschlossen werden.",
    kernelPanicCause: "Mindestens eine kritische Systemdatei konnte nicht geladen werden.",
    affectedFiles: "Betroffene Dateien:",
    instructions: "Starten Sie das System neu. Wenn dieser Bildschirm erneut angezeigt wird, starten Sie im Wiederherstellungsmodus, um das System zu reparieren.",
    reboot: "System neu starten"
  } : {
    title: "A critical problem has occurred in AuroraOS.",
    subtitle: "The system has been halted to prevent damage to your computer.",
    errorCode: "ERROR CODE",
    cause: "CAUSE",
    updateFailedCause: "A critical system update failed to complete.",
    kernelPanicCause: "At least one critical system file failed to load.",
    affectedFiles: "Affected files:",
    instructions: "Restart the system. If this screen appears again, start in recovery mode to repair the system.",
    reboot: "Restart System"
  };

  const reason = data?.reason || 'kernel_panic';

  const getErrorDetails = () => {
    switch(reason) {
      case 'update_failed':
        return { code: '0xCF0004_UPDATE_FAILED', text: T.updateFailedCause };
      case 'kernel_panic':
      default:
        return { code: '0x0001A5E_KERNEL_DATA_INPAGE_ERROR', text: T.kernelPanicCause };
    }
  }

  const errorDetails = getErrorDetails();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-[#1A0038] text-white font-code">
      <div className="w-full max-w-2xl text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-8 text-yellow-400" />
        <h1 className="text-2xl mb-4">{T.title}</h1>
        <p className="text-lg mb-8">{T.subtitle}</p>

        <div className="text-left bg-black/20 p-4 rounded-md mb-8">
          <p>{T.errorCode}: <span className="font-bold">{errorDetails.code}</span></p>
          <p>{T.cause}: {errorDetails.text}</p>

          {userSettings.crashedFiles.length > 0 && (
            <div className="mt-4">
              <p>{T.affectedFiles}</p>
              <div className="overflow-y-auto bg-black/30 p-2 mt-2 rounded max-h-24">
                <ul className="list-disc list-inside">
                    {userSettings.crashedFiles.map(file => <li key={file} className="break-words">{file}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        <p className="mb-8">{T.instructions}</p>
        <Button onClick={() => reboot(true)} variant="secondary" size="lg">
          {T.reboot}
        </Button>
      </div>
    </div>
  );
}
