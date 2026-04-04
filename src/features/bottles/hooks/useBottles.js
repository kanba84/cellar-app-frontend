import { useState, useEffect, useCallback } from "react";
import {
  fetchBottles as fetchBottlesApi, // API側のfetchBottlesと名前が衝突しないように別名をつける
  deleteBottle,
  createBottle,
  updateBottle,
} from "../api/bottleApi";

/**
 * ボトル一覧のデータ取得と基本操作を管理するHook
 */
export function useBottles() {
  const [bottles, setBottles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * データを取得する内部関数
   * useCallback を使うことで、初回や再取得（refresh）時に安定して呼び出せるようにする
   */
  const loadBottles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchBottlesApi();
      setBottles(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch bottles:", err);
      setError("ボトルの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  // コンポーネントのマウント時に実行
  useEffect(() => {
    loadBottles();
  }, [loadBottles]);

  /**
   * ボトルの削除
   */
  const handleDelete = async (id) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      await deleteBottle(id);
      // 削除は一覧から消すだけで良いため、再フェッチせずステート更新のみ
      setBottles((prev) => prev.filter((b) => b.id !== id));
      return true;
    } catch (err) {
      console.error("Delete error:", err);
      return false;
    }
  };

  /**
   * ボトルの作成（単体）
   */
  const handleCreate = async (data) => {
    const res = await createBottle(data);
    // 作成後はワイン情報などを含めた最新状態をサーバーから取得し直す
    await loadBottles();
    return res;
  };

  /**
   * ボトルの更新
   */
  const handleUpdate = async (id, data) => {
    const res = await updateBottle(id, data);
    await loadBottles();
    return res;
  };

  return {
    bottles,
    loading,
    error,
    handleDelete,
    handleCreate,
    handleUpdate,
    refresh: loadBottles, // 外部（Page）からは refresh という名前で呼べるようにする
  };
}
