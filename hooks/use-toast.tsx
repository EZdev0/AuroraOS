"use client"

import * as React from "react"
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_REMOVE_DELAY = 5000;

interface Toast extends Omit<ToasterToast, "id"> {}

interface ToasterToast extends Omit<ToastProps, "title"> {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

interface ToastContextValue {
  toasts: ToasterToast[]
  toast: (toast: Toast) => void
  showQueuedToasts: () => void;
  toastQueue: Toast[];
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);
  const [toastQueue, setToastQueue] = React.useState<Toast[]>([]);

  const toast = React.useCallback((props: Toast) => {
    setToastQueue((prev) => [...prev, props]);
  }, []);

  const showQueuedToasts = React.useCallback(() => {
    if (toastQueue.length > 0) {
      const newToasts: ToasterToast[] = toastQueue.map(t => ({
        ...t,
        id: crypto.randomUUID(),
      }));

      setToasts((prev) => [...prev, ...newToasts]);
      setToastQueue([]);

      newToasts.forEach(t => {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== t.id));
        }, TOAST_REMOVE_DELAY);
      });
    }
  }, [toastQueue]);

  return (
    <ToastContext.Provider value={{ toasts, toast, toastQueue, showQueuedToasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
