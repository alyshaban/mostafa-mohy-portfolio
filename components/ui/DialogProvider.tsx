"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import styles from "./DialogProvider.module.css";

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: "danger" | "default";
};

type DialogState = ConfirmOptions & {
  resolve: (confirmed: boolean) => void;
};

const DialogContext = createContext<{
  confirm: (options: ConfirmOptions) => Promise<boolean>;
} | null>(null);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const close = useCallback(
    (confirmed: boolean) => {
      if (!dialog) return;
      dialog.resolve(confirmed);
      setDialog(null);
    },
    [dialog],
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        confirmText: "تأكيد",
        cancelText: "إلغاء",
        tone: "default",
        ...options,
        resolve,
      });
    });
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      {dialog && (
        <div className={styles.backdrop} role="presentation">
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <button
              type="button"
              className={styles.close}
              onClick={() => close(false)}
              aria-label="إغلاق"
            >
              <X size={18} />
            </button>

            <div className={`${styles.iconWrap} ${styles[dialog.tone || "default"]}`}>
              <AlertTriangle size={22} />
            </div>

            <div className={styles.content}>
              <h2 id="dialog-title">{dialog.title}</h2>
              {dialog.description && <p>{dialog.description}</p>}
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancel}
                onClick={() => close(false)}
              >
                {dialog.cancelText}
              </button>
              <button
                type="button"
                className={`${styles.confirm} ${
                  dialog.tone === "danger" ? styles.confirmDanger : ""
                }`}
                onClick={() => close(true)}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used inside DialogProvider");
  }

  return context;
}
