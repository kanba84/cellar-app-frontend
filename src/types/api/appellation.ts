/**
 * Appellation API の型定義
 */

import type { Region } from './region';
import type { DesignationType } from './designationType';
import type { Country } from './country';

/**
 * Appellation レスポンス型
 */
export interface Appellation {
  id: number;
  name: string;
  code?: string | null;
  country_id?: number | null;
  country?: Country | null;
  designation_type_id: number | null;
  designation_type?: DesignationType | null;
  region_id: number | null;
  region?: Region | null;
  regions?: Region[];
  sort_order: number;
}

/**
 * Appellation リクエスト型（新規作成）
 */
export interface CreateAppellationRequest {
  name: string;
  code?: string | null;
  country_id?: number | null;
  designation_type_id?: number | null;
  region_id?: number | null;
  regions?: Region[];
  sort_order?: number;
}

/**
 * Appellation 更新リクエスト型
 */
export interface UpdateAppellationRequest {
  name?: string;
  code?: string | null;
  country_id?: number | null;
  designation_type_id?: number | null;
  region_id?: number | null;
  regions?: Region[];
  sort_order?: number;
}
