/**
 * WineType API の型定義
 */

/**
 * WineType レスポンス型
 */
export interface WineType {
  id: number;
  name: string;
}

/**
 * WineType リクエスト型（新規作成）
 */
export interface CreateWineTypeRequest {
  name: string;
}

/**
 * WineType 更新リクエスト型
 */
export interface UpdateWineTypeRequest {
  name?: string;
}
