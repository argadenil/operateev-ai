"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  createdAt: number;
  dismissAt?: number;
  duration: number; // ms
}

interface ToastContextValue {
  push: (
    message: string,
    opts?: { title?: string; variant?: ToastVariant; duration?: number }
  ) => string;
  success: (
    message: string,
    opts?: Omit<Parameters<ToastContextValue["push"]>[1], "variant">
  ) => string;
  error: (
    message: string,
    opts?: Omit<Parameters<ToastContextValue["push"]>[1], "variant">
  ) => string;
  info: (
    message: string,
    opts?: Omit<Parameters<ToastContextValue["push"]>[1], "variant">
  ) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// Helper to generate IDs
const makeId = () => Math.random().toString(36).slice(2, 10);

export function ToastProvider({
  children,
  max = 5,
}: {
  children: ReactNode;
  max?: number;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeRef = useRef<number>(Date.now());

  // House-keeping timer
  useEffect(() => {
    const interval = setInterval(() => {
      timeRef.current = Date.now();
      setToasts((prev) =>
        prev.filter((t) => !t.dismissAt || t.dismissAt > timeRef.current)
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const push = useCallback<ToastContextValue["push"]>(
    (message, opts) => {
      const id = makeId();
      setToasts((prev) => {
        const variant = opts?.variant || "info";
        const duration = opts?.duration ?? 4000;
        const now = Date.now();
        const item: ToastItem = {
          id,
          message,
          title: opts?.title,
          variant,
          createdAt: now,
          duration,
          dismissAt: duration > 0 ? now + duration : undefined,
        };
        const next = [...prev, item];
        return next.slice(-max);
      });
      return id;
    },
    [max]
  );

  const dismiss = useCallback<ToastContextValue["dismiss"]>((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  // Stable helper wrappers so consuming components can safely use them in deps
  const success: ToastContextValue["success"] = useCallback(
    (m, opts) => push(m, { ...opts, variant: "success" }),
    [push]
  );
  const error: ToastContextValue["error"] = useCallback(
    (m, opts) => push(m, { ...opts, variant: "error" }),
    [push]
  );
  const info: ToastContextValue["info"] = useCallback(
    (m, opts) => push(m, { ...opts, variant: "info" }),
    [push]
  );

  const value: ToastContextValue = { push, success, error, info, dismiss, clear };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
      <ToastStyles />
    </ToastContext.Provider>
  );
}

function variantClasses(v: ToastVariant): string {
  switch (v) {
    case "success":
      return "border-green-400/20 bg-gradient-to-r from-emerald-500/90 to-green-600/90 text-white shadow-lg shadow-emerald-700/30";
    case "error":
      return "border-red-400/20 bg-gradient-to-r from-rose-500/90 to-red-600/90 text-white shadow-lg shadow-rose-700/30";
    default:
      return "border-slate-300/20 bg-gradient-to-r from-slate-700/90 to-slate-900/90 text-white shadow-lg shadow-slate-900/40";
  }
}

function ToastViewport({
  toasts,
  dismiss,
}: {
  toasts: ToastItem[];
  dismiss: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      role="region"
      className="fixed z-[99999] top-4 right-4 w-full max-w-sm flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`group relative overflow-hidden pointer-events-auto rounded-2xl border backdrop-blur-xl px-4 py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${variantClasses(
            t.variant
          )}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              {t.title && (
                <p className="font-semibold text-sm leading-tight mb-0.5">
                  {t.title}
                </p>
              )}
              <p className="text-sm leading-snug break-words opacity-90">
                {t.message}
              </p>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="hover:cursor-pointer inline-flex items-center justify-center rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/20 transition"
            >
              <X size={16} />
            </button>
          </div>
          {t.duration > 0 && <ProgressBar key={t.id} duration={t.duration} />}
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ duration }: { duration: number }) {
  return (
    <span
      className="absolute left-0 bottom-0 h-1 bg-gradient-to-r from-white/80 via-white/40 to-transparent animate-progress-bar"
      style={{ animationDuration: `${duration}ms` }}
    />
  );
}

// Modern animation styles
export function ToastStyles() {
  return (
    <style>{`
      @keyframes toast-slide-in-from-right {
        from { transform: translateX(calc(100% + 1rem)); opacity: 0;}
        to { transform: translateX(0); opacity: 1;}
      }
      .animate-slide-in-from-right {
        animation: toast-slide-in-from-right 0.35s cubic-bezier(.4,0,.2,1);
      }
      @keyframes toast-progress {
        from { width: 100%; }
        to { width: 0%; }
      }
      .animate-progress-bar {
        animation: toast-progress linear forwards;
      }
    `}</style>
  );
}
