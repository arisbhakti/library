"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastVariant = "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastOptions = {
  durationMs?: number;
};

type AppToastContextValue = {
  showSuccessToast: (message: string, options?: ToastOptions) => void;
  showErrorToast: (message: string, options?: ToastOptions) => void;
};

const AppToastContext = createContext<AppToastContextValue | null>(null);

function ToastCard({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: (id: number) => void;
}) {
  const variantClassName =
    item.variant === "success"
      ? "border-primary-300 bg-neutral-25 text-primary-300"
      : "border-danger-300 bg-neutral-25 text-danger-300";

  return (
    <div
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-card animate-in fade-in slide-in-from-top-2 duration-200 ${variantClassName}`}
      role="alert"
    >
      <p className="text-sm font-semibold">{item.message}</p>
      <button
        aria-label="Close toast"
        className="text-sm font-bold"
        onClick={() => onClose(item.id)}
        type="button"
      >
        Tutup
      </button>
    </div>
  );
}

export function AppToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, variant: ToastVariant, options?: ToastOptions) => {
      const nextId = idRef.current + 1;
      idRef.current = nextId;

      setToasts((current) => [...current, { id: nextId, message, variant }]);

      const durationMs =
        typeof options?.durationMs === "number" && options.durationMs > 0
          ? options.durationMs
          : 3000;

      window.setTimeout(() => {
        removeToast(nextId);
      }, durationMs);
    },
    [removeToast],
  );

  const contextValue = useMemo<AppToastContextValue>(
    () => ({
      showSuccessToast: (message: string, options?: ToastOptions) =>
        pushToast(message, "success", options),
      showErrorToast: (message: string, options?: ToastOptions) =>
        pushToast(message, "error", options),
    }),
    [pushToast],
  );

  return (
    <AppToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 lg:top-24">
        {toasts.map((item) => (
          <div className="pointer-events-auto" key={item.id}>
            <ToastCard item={item} onClose={removeToast} />
          </div>
        ))}
      </div>
    </AppToastContext.Provider>
  );
}

export function useAppToast(): AppToastContextValue {
  const context = useContext(AppToastContext);
  if (!context) {
    throw new Error("useAppToast must be used within AppToastProvider.");
  }

  return context;
}
