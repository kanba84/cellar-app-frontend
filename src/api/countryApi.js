import { getAxiosClient } from "./axiosClient";

const BASE_URL = "/countries";

export const fetchCountries = async () => {
  const response = await getAxiosClient().get(BASE_URL);
  return response.data;
};

export const fetchCountryById = async (id) => {
  const response = await getAxiosClient().get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createCountry = async (countryData) => {
  const response = await getAxiosClient().post(BASE_URL, countryData);
  return response.data;
};

export const updateCountry = async (id, countryData) => {
  const response = await getAxiosClient().put(`${BASE_URL}/${id}`, countryData);
  return response.data;
};

export const deleteCountry = async (id) => {
  const response = await getAxiosClient().delete(`${BASE_URL}/${id}`);
  return response.data;
};
