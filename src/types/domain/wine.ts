/**
 * Wine ドメインモデルの型定義
 */

import type { Wine as WineAPI } from '../api/wine';

/**
 * Wine のドメインモデル
 */
export type WineDTO = WineAPI;

/**
 * Wine 一覧取得時の型
 */
export type WineList = WineAPI[];

// TODO: Wine の「お気に入り」機能など、フロントエンド固有のプロパティがあるか確認
