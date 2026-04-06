/**
 * Bottle API の型定義
 * バックエンドの BottleWithWineDTO をベースに定義
 */

import type { Wine } from './wine';

/**
 * Bottle レスポンス型（BottleWithWineDTO に基づく）
 * API から取得するボトル情報（ワイン情報を含む）
 */
export interface Bottle {
  id: number;
  wine_id: number;
  wine: Wine;
  is_opened: boolean;
  added_at: string | null;      // ISO 8601 date string
  removed_at: string | null;    // ISO 8601 date string
  row_number: number | null;
  column_number: number | null;
  note: string | null;
}

/**
 * Bottle リクエスト型（新規作成）
 */
export interface CreateBottleRequest {
  wine_id: number;
  row_number?: number | null;
  column_number?: number | null;
  note?: string | null;
  // TODO: is_opened, added_at の初期値設定の仕様確認が必要
}

/**
 * Bottle 更新リクエスト型（PUT）
 */
export interface UpdateBottleRequest {
  wine_id?: number;
  is_opened?: boolean;
  row_number?: number | null;
  column_number?: number | null;
  note?: string | null;
}

/**
 * Bottle 部分更新リクエスト型（PATCH）
 */
export interface PatchBottleRequest {
  is_opened?: boolean;
  row_number?: number | null;
  column_number?: number | null;
  note?: string | null;
}
