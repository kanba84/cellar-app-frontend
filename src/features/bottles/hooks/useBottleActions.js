import { isPositionOccupiedError } from "../utils/apiError";

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
}) {
  /**
   * 共通エラーハンドリング付き実行関数
   */
  const executeWithErrorHandling = async (fn, onSuccess) => {
    try {
      const result = await fn();
      if (onSuccess) onSuccess();
      return result;
    } catch (err) {
      handleApiError(err);
      throw err; // 呼び出し元でもエラーをキャッチできるように再スロー
    }
  };

  /**
   * APIエラー処理
   */
  const handleApiError = (err) => {
    if (isPositionOccupiedError(err)) {
      alert("その棚位置はすでに使用されています");
      return true;
    }
    alert("更新に失敗しました");
    return false;
  };

  /**
   * ボトル作成（submit）
   */
  const handleCreateBottleSubmit = async (e) => {
    e.preventDefault();

    executeWithErrorHandling(
      () => submitCreateBottle(createBottleApi),
      closeCreateBottleModal,
    );
  };

  /**
   * ボトル編集保存
   */
  const handleEditSave = async (id, override) => {
    return await executeWithErrorHandling(() => updateBottleApi(id, override));
  };

  /**
   * ワイン＋ボトル同時作成
   */
  const handleCreateWineWithBottleSubmit = async (e) => {
    executeWithErrorHandling(
      () => submitCreateWineWithBottle(e),
      closeCreateWineModal,
    );
  };

  return {
    handleCreateBottleSubmit,
    handleEditSave,
    handleCreateWineWithBottleSubmit,
  };
}
