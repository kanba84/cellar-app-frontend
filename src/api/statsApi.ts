import { getAxiosClient } from './axiosClient';
import type { StatsData } from '@/types/api/stats';

/**
 * 統計情報を取得する
 */
export const fetchStats = async (): Promise<StatsData> => {
  const response = await getAxiosClient().get<StatsData>('/stats');
  return response.data;
};
