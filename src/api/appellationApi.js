// src/api/appellationApi.js
import { getAxiosClient } from "./axiosClient";

export const createAppellation = async (appellationData) => {
  const response = await getAxiosClient().post(
    "/appellations",
    appellationData,
  );
  return response.data;
};

export const fetchAppellations = async () => {
  const response = await getAxiosClient().get("/appellations");
  return response.data;
};

export const fetchAppellationById = async (id) => {
  const response = await getAxiosClient().get(`/appellations/${id}`);
  return response.data;
};

export const updateAppellation = async (id, data) => {
  const response = await getAxiosClient().put(`/appellations/${id}`, data);
  return response.data;
};

export const deleteAppellation = async (id) => {
  await getAxiosClient().delete(`/appellations/${id}`);
};
