import { useState, useCallback } from "react";

/**
 * 画面下部に表示する通知（Snackbar）の状態を管理するHook
 */
export function useNotification() {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info", // 'success' | 'error' | 'warning' | 'info'
  });

  const showNotification = useCallback((message, severity = "info") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    notification,
    showNotification,
    closeNotification,
  };
}
