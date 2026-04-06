import { useState, useEffect, useCallback } from 'react';
import type { Bottle } from '@/types/api/bottle';
import type { BottleFormSubmitData } from '@/types/form/bottle';
import type { UseBottlesReturn } from '@/types/hook/bottle';
import {
  fetchBottles as fetchBottlesApi,
  deleteBottle,
  createBottle,
  patchBottle,
} from '../api/bottleApi';
import { toCreateBottleRequest, toPatchBottleRequest } from '../utils/bottleMapper';

/**
 * ボトル一覧のデータ取得と基本操作を管理するHook
 */
export function useBottles(): UseBottlesReturn {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * データを取得する内部関数
   */
  const loadBottles = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await fetchBottlesApi();
      setBottles(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bottles:', err);
      setError('ボトルの取得に失敗しました');
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
  const handleDelete = async (id: number): Promise<boolean> => {
    if (!window.confirm('本当に削除しますか？')) return false;
    try {
      await deleteBottle(id);
      setBottles((prev) => prev.filter((b) => b.id !== id));
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      return false;
    }
  };

  /**
   * ボトルの作成（単体）
   */
  const handleCreate = async (data: BottleFormSubmitData): Promise<Bottle> => {
    const createRequest = toCreateBottleRequest(data);
    const res = await createBottle(createRequest);
    await loadBottles();
    return res;
  };

  /**
   * ボトルの部分更新（PATCH）
   * 棚位置、開封状態、備考のみの更新に使用
   * wine_id は不要
   */
  const handleUpdate = async (id: number, data: Partial<Bottle>): Promise<Bottle> => {
    const patchRequest = toPatchBottleRequest(data);
    const res = await patchBottle(id, patchRequest);
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
    refresh: loadBottles,
  };
}
