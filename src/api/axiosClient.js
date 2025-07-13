import axios from "axios";
import { loadConfig } from "../config";

let axiosClient = null;

export async function initAxiosClient() {
  const config = await loadConfig();
  axiosClient = axios.create({
    baseURL: config.REACT_APP_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 5000,
  });
}

export function getAxiosClient() {
  if (!axiosClient) throw new Error("axiosClient is not initialized");
  return axiosClient;
}
