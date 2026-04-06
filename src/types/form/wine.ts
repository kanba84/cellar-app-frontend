/**
 * ワインフォーム関連の型定義
 */

/**
 * ワイン作成フォームの状態
 * HTML フォーム値は文字列のため、必要に応じて数値への変換が必要
 */
export interface WineFormState {
  name: string;
  vintage: string | number | '';
  wine_type_id: string | number | '';
  country_id: string | number | '';
  region_id: string | number | '';
  producer: string;
  appellation_id: string | number | '';
  // TODO: label_image_url の挙動確認（アップロード or URL入力か）
}

/**
 * フォーム送信用（API リクエスト）
 * すべての値を適切な型に変換済み
 */
export interface WineFormSubmitData {
  name: string;
  vintage: number | null;
  wine_type_id: number;
  country_id: number;
  region_id: number | null;
  producer: string | null;
  appellation_id: number | null;
}

/**
 * フォーム検証エラー
 */
export interface WineFormErrors {
  name?: string;
  vintage?: string;
  wine_type_id?: string;
  country_id?: string;
  region_id?: string;
  producer?: string;
  appellation_id?: string;
}
