// src/api/designationTypeApi.js
import { getAxiosClient } from "./axiosClient";

export const createDesignationType = async (wineData) => {
  const response = await getAxiosClient().post("/designation_types", wineData);
  return response.data;
};

export const fetchDesignationTypes = async () => {
  const response = await getAxiosClient().get("/designation_types");
  return response.data;
};

export const fetchDesignationTypeById = async (id) => {
  const response = await getAxiosClient().get(`/designation_types/${id}`);
  return response.data;
};

export const updateDesignationType = async (id, data) => {
  const response = await getAxiosClient().put(`/designation_types/${id}`, data);
  return response.data;
};

export const deleteDesignationType = async (id) => {
  await getAxiosClient().delete(`/designation_types/${id}`);
};
