import axios from "axios";

let axiosClient = null;

export async function initAxiosClient() {
  // 環境変数が未設定または空文字の場合はデフォルト値を使う
  let envBase = (process.env.REACT_APP_API_BASE_URL || "").trim();
  envBase = envBase.replace(/\/+$/, "");
  if (!envBase) {
    envBase = "https://cellar-app.local";
  }

  axiosClient = axios.create({
    baseURL: `${envBase}/api`,
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
