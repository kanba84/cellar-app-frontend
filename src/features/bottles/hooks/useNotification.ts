import { useState, useCallback } from 'react';
import type { NotificationState, NotificationType, UseNotificationReturn } from '@/types/hook/notification';

/**
 * 画面下部に表示する通知（Snackbar）の状態を管理するHook
 */
export function useNotification(): UseNotificationReturn {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showNotification = useCallback((message: string, severity: NotificationType = 'info'): void => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const closeNotification = useCallback((): void => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    notification,
    showNotification,
    closeNotification,
  };
}
