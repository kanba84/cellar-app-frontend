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
  country_id: number;
  country?: Country;
  parent_id: number | null;  // 親地域のID
}

/**
 * Region リクエスト型（新規作成）
 */
export interface CreateRegionRequest {
  name: string;
  country_id: number | null;
  parent_id?: number | null;
}

/**
 * Region 更新リクエスト型
 */
export interface UpdateRegionRequest {
  name?: string;
  country_id?: number;
  parent_id?: number | null;
}
