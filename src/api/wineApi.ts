import { getAxiosClient } from './axiosClient';
import type { Wine, CreateWineRequest, UpdateWineRequest } from '@/types/api/wine';
import type { CreateWineWithBottleRequest } from '@/types/form/wineWithBottle';
import type { Bottle } from '@/types/api/bottle';

/**
 * ワイン情報を新規作成する
 */
export const createWine = async (wineData: CreateWineRequest): Promise<Wine> => {
  const response = await getAxiosClient().post<Wine>('/wines', wineData);
  return response.data;
};

/**
 * ワインとボトルを同時に作成する
 */
export const createWineWithBottle = async (
  data: CreateWineWithBottleRequest,
): Promise<{ wine: Wine; bottle: Bottle }> => {
  const response = await getAxiosClient().post<{ wine: Wine; bottle: Bottle }>(
    '/wines/with_bottle',
    data,
  );
  return response.data;
};

/**
 * すべてのワイン情報を取得する
 */
export const fetchWines = async (): Promise<Wine[]> => {
  const response = await getAxiosClient().get<Wine[]>('/wines');
  return response.data;
};

/**
 * IDでワイン情報を取得する
 */
export const fetchWineById = async (id: number): Promise<Wine> => {
  const response = await getAxiosClient().get<Wine>(`/wines/${id}`);
  return response.data;
};

/**
 * ワイン情報を更新する
 */
export const updateWine = async (
  id: number,
  data: UpdateWineRequest,
): Promise<Wine> => {
  // 部分更新にしたいので PATCH を使用する（未送信フィールドを null で上書きしない）
  const response = await getAxiosClient().patch<Wine>(`/wines/${id}`, data);
  return response.data;
};
