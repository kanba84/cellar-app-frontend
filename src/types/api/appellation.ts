/**
 * Appellation API の型定義
 */

import type { Region } from './region';
import type { DesignationType } from './designationType';

/**
 * Appellation レスポンス型
 */
export interface Appellation {
  id: number;
  name: string;
  designation_type_id: number | null;
  designation_type?: DesignationType | null;
  region_id: number | null;
  region?: Region | null;
}

/**
 * Appellation リクエスト型（新規作成）
 */
export interface CreateAppellationRequest {
  name: string;
  designation_type_id?: number | null;
  region_id?: number | null;
}

/**
 * Appellation 更新リクエスト型
 */
export interface UpdateAppellationRequest {
  name?: string;
  designation_type_id?: number | null;
  region_id?: number | null;
}
