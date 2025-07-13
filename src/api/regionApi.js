import { getAxiosClient } from "./axiosClient";

const API_BASE_URL = "/regions";

// 地域一覧を取得
export const fetchRegions = async () => {
  const response = await getAxiosClient().get(API_BASE_URL);
  return response.data;
};

// 地域をIDで取得
export const fetchRegionById = async (id) => {
  const response = await getAxiosClient().get(`${API_BASE_URL}/${id}`);
  return response.data;
};

// 地域を新規作成
export const createRegion = async (regionData) => {
  const response = await getAxiosClient().post(API_BASE_URL, regionData);
  return response.data;
};

// 地域を更新
export const updateRegion = async (id, regionData) => {
  const response = await getAxiosClient().put(
    `${API_BASE_URL}/${id}`,
    regionData,
  );
  return response.data;
};

// 地域を削除
export const deleteRegion = async (id) => {
  const response = await getAxiosClient().delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
