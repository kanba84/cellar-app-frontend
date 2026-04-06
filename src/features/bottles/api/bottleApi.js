// src/api/bottleApi.js
import { getAxiosClient } from "@/api/axiosClient";

export const fetchBottles = async () => {
  const response = await getAxiosClient().get("/bottles");
  return response.data;
};

export const createBottle = async (bottleData) => {
  const response = await getAxiosClient().post("/bottles", bottleData);
  return response.data;
};

export const updateBottle = async (id, bottleData) => {
  const response = await getAxiosClient().put(`/bottles/${id}`, bottleData);
  return response.data;
};

export const patchBottle = async (id, bottleData) => {
  const response = await getAxiosClient().patch(`/bottles/${id}`, bottleData);
  return response.data;
};

export const deleteBottle = async (id) => {
  await getAxiosClient().delete(`/bottles/${id}`);
};
