/**
 * Bottle API 通信関数
 */

import type { Bottle, CreateBottleRequest, UpdateBottleRequest, PatchBottleRequest } from '@/types/api/bottle';
import { getAxiosClient } from '@/api/axiosClient';

/**
 * ボトル一覧取得
 */
export const fetchBottles = async (): Promise<Bottle[]> => {
  const response = await getAxiosClient().get('/bottles');
  return response.data;
};

/**
 * ボトル作成
 */
export const createBottle = async (bottleData: CreateBottleRequest): Promise<Bottle> => {
  const response = await getAxiosClient().post('/bottles', bottleData);
  return response.data;
};

/**
 * ボトル更新（PUT）
 */
export const updateBottle = async (id: number, bottleData: UpdateBottleRequest): Promise<Bottle> => {
  const response = await getAxiosClient().put(`/bottles/${id}`, bottleData);
  return response.data;
};

/**
 * ボトル部分更新（PATCH）
 */
export const patchBottle = async (id: number, bottleData: PatchBottleRequest): Promise<Bottle> => {
  const response = await getAxiosClient().patch(`/bottles/${id}`, bottleData);
  return response.data;
};

/**
 * ボトル削除
 */
export const deleteBottle = async (id: number): Promise<void> => {
  await getAxiosClient().delete(`/bottles/${id}`);
};
