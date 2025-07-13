// src/api/bottleApi.js
import { getAxiosClient } from "./axiosClient";

export const createWine = async (wineData) => {
  const response = await getAxiosClient().post("/wines", wineData);
  return response.data;
};

export const createWineWithBottle = async (data) => {
  const response = await getAxiosClient().post("/wines/with_bottle", data);
  return response.data;
};

export const fetchWines = async () => {
  const response = await getAxiosClient().get("/wines");
  return response.data;
};

export const fetchWineById = async (id) => {
  const response = await getAxiosClient().get(`/wines/${id}`);
  return response.data;
};

export const updateWine = async (id, data) => {
  const response = await getAxiosClient().put(`/wines/${id}`, data);
  return response.data;
};
