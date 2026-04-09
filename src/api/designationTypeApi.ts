import { getAxiosClient } from './axiosClient';
import type {
  DesignationType,
  CreateDesignationTypeRequest,
  UpdateDesignationTypeRequest,
} from '@/types/api/designationType';

/**
 * デジネーションタイプ情報を新規作成する
 */
export const createDesignationType = async (
  wineData: CreateDesignationTypeRequest,
): Promise<DesignationType> => {
  const response = await getAxiosClient().post<DesignationType>(
    '/designation_types',
    wineData,
  );
  return response.data;
};

/**
 * すべてのデジネーションタイプ情報を取得する
 */
export const fetchDesignationTypes = async (): Promise<DesignationType[]> => {
  const response = await getAxiosClient().get<DesignationType[]>(
    '/designation_types',
  );
  return response.data;
};

/**
 * IDでデジネーションタイプ情報を取得する
 */
export const fetchDesignationTypeById = async (
  id: number,
): Promise<DesignationType> => {
  const response = await getAxiosClient().get<DesignationType>(
    `/designation_types/${id}`,
  );
  return response.data;
};

/**
 * デジネーションタイプ情報を更新する
 */
export const updateDesignationType = async (
  id: number,
  data: UpdateDesignationTypeRequest,
): Promise<DesignationType> => {
  const response = await getAxiosClient().put<DesignationType>(
    `/designation_types/${id}`,
    data,
  );
  return response.data;
};

/**
 * デジネーションタイプ情報を削除する
 */
export const deleteDesignationType = async (id: number): Promise<void> => {
  await getAxiosClient().delete(`/designation_types/${id}`);
};
