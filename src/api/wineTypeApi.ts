import { getAxiosClient } from './axiosClient';
import type {
  WineType,
  CreateWineTypeRequest,
  UpdateWineTypeRequest,
} from '@/types/api/wineType';

/**
 * ワインタイプ一覧を取得
 */
export const fetchWineTypes = async (): Promise<WineType[]> => {
  const response = await getAxiosClient().get<WineType[]>('/wine_types');
  return response.data;
};

/**
 * ワインタイプをIDで取得
 */
export const fetchWineTypeById = async (id: number): Promise<WineType> => {
  const response = await getAxiosClient().get<WineType>(
    `/wine_types/${id}`,
  );
  return response.data;
};

/**
 * ワインタイプを新規作成
 */
export const createWineType = async (
  data: CreateWineTypeRequest,
): Promise<WineType> => {
  const response = await getAxiosClient().post<WineType>('/wine_types', data);
  return response.data;
};

/**
 * ワインタイプを更新
 */
export const updateWineType = async (
  id: number,
  data: UpdateWineTypeRequest,
): Promise<WineType> => {
  const response = await getAxiosClient().put<WineType>(
    `/wine_types/${id}`,
    data,
  );
  return response.data;
};

/**
 * ワインタイプを削除
 */
export const deleteWineType = async (id: number): Promise<WineType> => {
  const response = await getAxiosClient().delete<WineType>(
    `/wine_types/${id}`,
  );
  return response.data;
};
