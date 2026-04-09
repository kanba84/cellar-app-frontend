import { getAxiosClient } from './axiosClient';
import type {
  Region,
  CreateRegionRequest,
  UpdateRegionRequest,
} from '@/types/api/region';

const API_BASE_URL = '/regions';

/**
 * 地域一覧を取得
 */
export const fetchRegions = async (): Promise<Region[]> => {
  const response = await getAxiosClient().get<Region[]>(API_BASE_URL);
  return response.data;
};

/**
 * 地域をIDで取得
 */
export const fetchRegionById = async (id: number): Promise<Region> => {
  const response = await getAxiosClient().get<Region>(
    `${API_BASE_URL}/${id}`,
  );
  return response.data;
};

/**
 * 地域を新規作成
 */
export const createRegion = async (
  regionData: CreateRegionRequest,
): Promise<Region> => {
  const response = await getAxiosClient().post<Region>(
    API_BASE_URL,
    regionData,
  );
  return response.data;
};

/**
 * 地域を更新
 */
export const updateRegion = async (
  id: number,
  regionData: UpdateRegionRequest,
): Promise<Region> => {
  const response = await getAxiosClient().put<Region>(
    `${API_BASE_URL}/${id}`,
    regionData,
  );
  return response.data;
};

/**
 * 地域を削除
 */
export const deleteRegion = async (id: number): Promise<Region> => {
  const response = await getAxiosClient().delete<Region>(
    `${API_BASE_URL}/${id}`,
  );
  return response.data;
};
