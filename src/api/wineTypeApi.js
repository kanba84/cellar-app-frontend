import { getAxiosClient } from "./axiosClient";

// ワインタイプ一覧を取得
export const fetchWineTypes = async () => {
  const response = await getAxiosClient().get("/wine_types");
  return response.data;
};

// ワインタイプをIDで取得
export const fetchWineTypeById = async (id) => {
  const response = await getAxiosClient().get(`/wine_types/${id}`);
  return response.data;
};

// ワインタイプを新規作成
export const createWineType = async (data) => {
  const response = await getAxiosClient().post("/wine_types", data);
  return response.data;
};

// ワインタイプを更新
export const updateWineType = async (id, data) => {
  const response = await getAxiosClient().put(`/wine_types/${id}`, data);
  return response.data;
};

// ワインタイプを削除
export const deleteWineType = async (id) => {
  const response = await getAxiosClient().delete(`/wine_types/${id}`);
  return response.data;
};
