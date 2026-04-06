import type { Bottle } from '@/types/api/bottle';
import type { UseBottleActionsReturn } from '@/types/hook/bottle';
import { isPositionOccupiedError } from '../utils/apiError';

interface UseBottleActionsProps {
  createBottleApi: (data: any) => Promise<any>;
  updateBottleApi: (id: number, data: any) => Promise<any>;
  submitCreateBottle: (createFn: (data: any) => Promise<any>) => Promise<boolean>;
  submitCreateWineWithBottle: (createFn: (data: any) => Promise<any>) => Promise<any>;
  closeCreateBottleModal: () => void;
  closeCreateWineModal: () => void;
  showNotification: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

/**
 * ボトル関連のユースケース（作成・更新・ワイン同時作成）をまとめるhook
 */
export function useBottleActions({
  createBottleApi,
  updateBottleApi,
  submitCreateBottle,
  submitCreateWineWithBottle,
  closeCreateBottleModal,
  closeCreateWineModal,
  showNotification,
}: UseBottleActionsProps): UseBottleActionsReturn {
  /**
   * APIエラー処理
   */
  const handleApiError = (err: unknown): void => {
    console.error('Caught API Error:', err);
    if (isPositionOccupiedError(err)) {
      showNotification('その棚位置はすでに使用されています', 'error');
    } else {
      showNotification(
        '処理に失敗しました。通信状況を確認してください',
        'error'
      );
    }
  };

  /**
   * 共通エラーハンドリング付き実行関数
   */
  const executeWithErrorHandling = async (
    fn: () => Promise<unknown>,
    onSuccess: (() => void) | null,
    successMessage: string | null
  ): Promise<any> => {
    try {
      const result = await fn();
      if (successMessage) showNotification(successMessage, 'success');
      if (onSuccess) onSuccess();
      return result || true;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  /**
   * ボトル作成（submit）
   */
  const handleCreateBottleSubmit = async (e?: React.FormEvent): Promise<any> => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    return await executeWithErrorHandling(
      () => submitCreateBottle(createBottleApi),
      closeCreateBottleModal,
      'ボトルを登録しました'
    );
  };

  /**
   * ボトル編集保存
   */
  const handleEditSave = async (id: number, override: Partial<Bottle>): Promise<any> => {
    return await executeWithErrorHandling(
      () => updateBottleApi(id, override),
      null,
      'ボトル情報を更新しました'
    );
  };

  /**
   * ワイン＋ボトル同時作成
   */
  const handleCreateWineWithBottleSubmit = async (e?: React.FormEvent): Promise<any> => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    return await executeWithErrorHandling(
      () => submitCreateWineWithBottle(createBottleApi),
      closeCreateWineModal,
      'ワインとボトルを登録しました'
    );
  };

  return {
    handleCreateBottleSubmit,
    handleEditSave,
    handleCreateWineWithBottleSubmit,
  };
}
