import { getAxiosClient } from './axiosClient';
import type {
  Country,
  CreateCountryRequest,
  UpdateCountryRequest,
} from '@/types/api/country';

const BASE_URL = '/countries';

/**
 * すべての国情報を取得する
 */
export const fetchCountries = async (): Promise<Country[]> => {
  const response = await getAxiosClient().get<Country[]>(BASE_URL);
  return response.data;
};

/**
 * IDで国情報を取得する
 */
export const fetchCountryById = async (id: number): Promise<Country> => {
  const response = await getAxiosClient().get<Country>(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * 国情報を新規作成する
 */
export const createCountry = async (
  countryData: CreateCountryRequest,
): Promise<Country> => {
  const response = await getAxiosClient().post<Country>(BASE_URL, countryData);
  return response.data;
};

/**
 * 国情報を更新する
 */
export const updateCountry = async (
  id: number,
  countryData: UpdateCountryRequest,
): Promise<Country> => {
  const response = await getAxiosClient().put<Country>(
    `${BASE_URL}/${id}`,
    countryData,
  );
  return response.data;
};

/**
 * 国情報を削除する
 */
export const deleteCountry = async (id: number): Promise<Country> => {
  const response = await getAxiosClient().delete<Country>(`${BASE_URL}/${id}`);
  return response.data;
};
