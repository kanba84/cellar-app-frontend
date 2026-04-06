/**
 * ワイン＋ボトル同時作成フォーム関連の型定義
 */

import type {
  WineFormState,
  WineFormSubmitData,
  WineFormErrors,
} from './wine';
import type {
  BottleFormState,
  BottleFormSubmitData,
  BottleFormErrors,
} from './bottle';

/**
 * ワイン＋ボトルフォーム全体の状態
 */
export interface WineWithBottleFormState {
  wine: WineFormState;
  bottle: BottleFormState;
}

/**
 * フォーム送信用
 */
export interface WineWithBottleFormSubmitData {
  wine: WineFormSubmitData;
  bottle: BottleFormSubmitData;
}

/**
 * フォーム検証エラー
 */
export interface WineWithBottleFormErrors {
  wine?: WineFormErrors;
  bottle?: BottleFormErrors;
}

/**
 * API リクエストボディ（バックエンドの CreateWineWithBottleRequest に合わせる）
 */
export interface CreateWineWithBottleRequest {
  wine: WineFormSubmitData;
  bottle: BottleFormSubmitData;
}
