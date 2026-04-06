/**
 * Cellar（セラー）の管理に関する型定義
 */

import type { Bottle } from '../api/bottle';

/**
 * セラー内の1つのスロット
 */
export interface CellarSlot {
  row: number;
  column: number;
  bottle: Bottle | null;
}

/**
 * セラーの棚情報
 */
export interface CellarShelf {
  slots: (Bottle | null)[][];
}

/**
 * Cellar グリッドの構成
 */
export interface CellarGrid {
  rows: number;    // 9
  columns: number; // 7
  shelves: CellarShelf[];
}

/**
 * 空のスロット情報
 */
export interface EmptySlot {
  row: number;
  column: number;
}

/**
 * セラー全体の統計情報
 */
export interface CellarStats {
  totalCapacity: number;
  occupiedSlots: number;
  emptySlots: number;
  openedBottles: number;
  redWines: number;
  whiteWines: number;
  sparklingWines: number;
  // TODO: 他の統計情報があるか確認（例：ロゼワイン数）
}

/**
 * ボトルの視覚情報クラス（wineUtils で計算）
 */
export type WineVisualClass = 'red' | 'white' | 'sparkling' | 'rose' | 'empty';
