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
  showNotification,
}) {
  /**
   * APIエラー処理
   */
  const handleApiError = (err) => {
    console.error("Caught API Error:", err);
    if (isPositionOccupiedError(err)) {
      showNotification("その棚位置はすでに使用されています", "error");
    } else {
      showNotification(
        "処理に失敗しました。通信状況を確認してください",
        "error",
      );
    }
  };

  /**
   * 共通エラーハンドリング付き実行関数
   */
  const executeWithErrorHandling = async (fn, onSuccess, successMessage) => {
    try {
      const result = await fn();
      if (successMessage) showNotification(successMessage, "success");
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
  const handleCreateBottleSubmit = async (e) => {
    // フォームイベントをここで止める
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    return await executeWithErrorHandling(
      () => submitCreateBottle(createBottleApi),
      closeCreateBottleModal,
      "ボトルを登録しました",
    );
  };

  /**
   * ボトル編集保存
   */
  const handleEditSave = async (id, override) => {
    return await executeWithErrorHandling(
      () => updateBottleApi(id, override),
      null,
      "ボトル情報を更新しました",
    );
  };

  /**
   * ワイン＋ボトル同時作成
   */
  const handleCreateWineWithBottleSubmit = async (e) => {
    // 1. まずここでイベントを確実に止める
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    // 2. submitCreateWineWithBottle は内部で handleCreate を呼ぶ際、
    // 期待する引数の形式（API関数, イベント）に合わせて呼び出す必要がある。
    // ここでは、フォーム側の handleCreate に e が渡って壊れるのを防ぐため、
    // 関数のみを確実に渡すようにラップします。
    return await executeWithErrorHandling(
      () => submitCreateWineWithBottle(createBottleApi),
      closeCreateWineModal,
      "ワインとボトルを登録しました",
    );
  };

  return {
    handleCreateBottleSubmit,
    handleEditSave,
    handleCreateWineWithBottleSubmit,
  };
}
