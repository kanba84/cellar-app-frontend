import { useState, useEffect } from "react";
import {
  fetchBottles,
  deleteBottle,
  createBottle,
  patchBottle,
} from "../api/bottleApi";

export function useBottles() {
  const [bottles, setBottles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBottles = async () => {
    try {
      setLoading(true);
      const data = await fetchBottles();
      setBottles(data);
      setError(null);
    } catch (err) {
      setError("ボトル一覧の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("このボトルを削除しますか？")) return;
    try {
      await deleteBottle(id);
      setBottles((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert("削除に失敗しました");
    }
  };

  const handleCreate = async (bottleData) => {
    try {
      const newBottle = await createBottle(bottleData);
      setBottles((prev) => [...prev, newBottle]);
      return newBottle;
    } catch (err) {
      // エラーレスポンス情報を保持したまま throw
      throw err;
    }
  };

  const handleUpdate = async (id, updateData) => {
    try {
      await patchBottle(id, updateData);

      setBottles((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updateData } : b)),
      );
    } catch (err) {
      // axios エラーオブジェクトをそのまま throw（レスポンス情報を保持）
      throw err;
    }
  };

  useEffect(() => {
    loadBottles();
  }, []);

  return {
    bottles,
    loading,
    error,
    loadBottles,
    handleDelete,
    handleCreate,
    handleUpdate,
  };
}
