/**
 * Country API の型定義
 */

/**
 * Country レスポンス型
 */
export interface Country {
  id: number;
  name: string;
  iso_code: string;  // ISO 3166-1 alpha-2
}

/**
 * Country リクエスト型（新規作成）
 */
export interface CreateCountryRequest {
  name: string;
  iso_code: string;
}

/**
 * Country 更新リクエスト型
 */
export interface UpdateCountryRequest {
  name?: string;
  iso_code?: string;
}
