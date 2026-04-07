/**
 * ボトルフォーム関連の型定義
 */

/**
 * ボトル作成フォームの状態
 * HTML フォーム値は文字列のため、必要に応じて数値への変換が必要
 */
export interface BottleFormState {
  wine_id: string | number | '';  // 数値シリアライゼーション対応
  row_number: string | number | '';
  column_number: string | number | '';
  note: string;
  is_opened?: boolean;  // フォーム専用フィールド（編集時のトグル用）
  // フォーム専用フィールド（BottleFormSubmitData への変換時は除外）
}

/**
 * フォーム送信用（API リクエスト）
 * すべての値を適切な型に変換済み
 */
export interface BottleFormSubmitData {
  wine_id: number | null;
  row_number: number | null;
  column_number: number | null;
  note: string;
}

/**
 * フォーム検証エラー
 */
export interface BottleFormErrors {
  wine_id?: string;
  row_number?: string;
  column_number?: string;
  note?: string;
}
