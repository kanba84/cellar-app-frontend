/**
 * Region API の型定義
 */

import type { Country } from './country';

/**
 * Region レスポンス型
 */
export interface Region {
  id: number;
  name: string;
  code?: string | null;
  country_id: number;
  country?: Country;
  parent_id: number | null;  // 親地域のID
  sort_order: number;
}

/**
 * Region リクエスト型（新規作成）
 */
export interface CreateRegionRequest {
  name: string;
  country_id: number | null;
  parent_id?: number | null;
  code?: string | null;
  sort_order?: number;
}

/**
 * Region 更新リクエスト型
 */
export interface UpdateRegionRequest {
  name?: string;
  country_id?: number;
  parent_id?: number | null;
  code?: string | null;
  sort_order?: number;
}
