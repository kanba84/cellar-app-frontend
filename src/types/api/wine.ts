/**
 * Wine API の型定義
 * バックエンドの WineDTO をベースに定義
 */

/**
 * Wine のレスポンス型（WineDTO に基づく）
 * API から取得するワイン情報
 */
export interface Wine {
  id: number;
  name: string;
  country_id: number;
  country_name: string;
  country_iso_code: string;
  wine_type_id: number;
  wine_type_name: string;
  vintage: number | null;
  region_id: number | null;
  region_name: string | null;
  producer: string | null;
  appellation_id: number | null;
  appellation_name: string | null;
  designation_type_id: number | null;
  designation_type_name: string | null;
  label_image_url: string | null;
}

/**
 * Wine リクエスト型（新規作成）
 */
export interface CreateWineRequest {
  name: string;
  wine_type_id: number;
  country_id: number;
  vintage?: number | null;
  region_id?: number | null;
  producer?: string | null;
  appellation_id?: number | null;
  // TODO: label_image_url の送信方法の確認が必要（multipart/form-data か？）
}

/**
 * Wine 更新リクエスト型
 */
export interface UpdateWineRequest {
  name?: string;
  wine_type_id?: number;
  country_id?: number;
  vintage?: number | null;
  region_id?: number | null;
  producer?: string | null;
  appellation_id?: number | null;
  label_image_url?: string | null;
}
