/**
 * Bottle ドメインモデルの型定義
 */

import type { Bottle } from '../api/bottle';

/**
 * Bottle のドメインモデル（API型と同じ）
 */
export type BottleDTO = Bottle;

/**
 * ボトルのステータス
 */
export type BottleStatus = 'stored' | 'opened' | 'removed';

/**
 * ボトルとそのステータスを含むモデル
 */
export interface BottleWithStatus extends Bottle {
  status: BottleStatus;
}

/**
 * Bottle の一覧取得時の型
 */
export type BottleList = Bottle[];

// TODO: 実装側で「未開封・開封済・削除済」などのステータス判定がどう行われているか確認
