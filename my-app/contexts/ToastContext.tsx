"use client";

import { createContext, useContext, useCallback, useState } from "react";

type ToastMessage = string;

type ToastContextValue = {
  toast: (message: ToastMessage) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<ToastMessage | null>(null);

  const toast = useCallback((msg: ToastMessage) => {
    setMessage(msg);
    const t = setTimeout(() => setMessage(null), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {message && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[110] px-4 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-sm font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx ?? { toast: () => {} };
}
