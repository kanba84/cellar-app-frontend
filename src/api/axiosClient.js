import axios from "axios";
import { loadConfig } from "../config";

let axiosClient = null;

export async function initAxiosClient() {
  const config = await loadConfig();
  axiosClient = axios.create({
    baseURL: config.REACT_APP_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 5000,
    // クレデンシャルを含めない設定
    withCredentials: false,
  });

  // オフライン時のエラーハンドリングを追加
  axiosClient.interceptors.response.use(
    response => response,
    error => {
      if (!navigator.onLine) {
        // オフライン時のエラーメッセージを設定
        error.message = "You are currently offline. Please check your internet connection.";
      }
      return Promise.reject(error);
    }
  );
}

export function getAxiosClient() {
  if (!axiosClient) throw new Error("axiosClient is not initialized");
  return axiosClient;
}
