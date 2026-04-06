/**
 * Modal 関連のカスタムフック戻り値の型定義
 */

/**
 * useModal フック戻り値
 */
export interface UseModalReturn {
  showCreateBottleModal: boolean;
  openCreateBottleModal: () => void;
  closeCreateBottleModal: () => void;
  showCreateWineModal: boolean;
  openCreateWineModal: () => void;
  closeCreateWineModal: () => void;
}
