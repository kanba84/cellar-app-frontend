import { getAxiosClient } from './axiosClient';
import type {
  Appellation,
  CreateAppellationRequest,
  UpdateAppellationRequest,
} from '@/types/api/appellation';

/**
 * アペラシオン情報を新規作成する
 */
export const createAppellation = async (
  appellationData: CreateAppellationRequest,
): Promise<Appellation> => {
  const response = await getAxiosClient().post<Appellation>(
    '/appellations',
    appellationData,
  );
  return response.data;
};

/**
 * すべてのアペラシオン情報を取得する
 */
export const fetchAppellations = async (): Promise<Appellation[]> => {
  const response = await getAxiosClient().get<Appellation[]>('/appellations');
  return response.data;
};

/**
 * IDでアペラシオン情報を取得する
 */
export const fetchAppellationById = async (id: number): Promise<Appellation> => {
  const response = await getAxiosClient().get<Appellation>(
    `/appellations/${id}`,
  );
  return response.data;
};

/**
 * アペラシオン情報を更新する
 */
export const updateAppellation = async (
  id: number,
  data: UpdateAppellationRequest,
): Promise<Appellation> => {
  const response = await getAxiosClient().put<Appellation>(
    `/appellations/${id}`,
    data,
  );
  return response.data;
};

/**
 * アペラシオン情報を削除する
 */
export const deleteAppellation = async (id: number): Promise<void> => {
  await getAxiosClient().delete(`/appellations/${id}`);
};
