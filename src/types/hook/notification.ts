/**
 * 通知関連のカスタムフック戻り値の型定義
 */

/**
 * 通知のタイプ
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * 通知の状態オブジェクト
 */
export interface NotificationState {
  open: boolean;
  message: string;
  severity: NotificationType;
}

/**
 * useNotification フック戻り値
 */
export interface UseNotificationReturn {
  notification: NotificationState;
  showNotification: (message: string, severity?: NotificationType) => void;
  closeNotification: () => void;
}
