/**
 * Wine 関連のカスタムフック戻り値の型定義
 */

import type { Wine } from '../api/wine';
import type { Bottle } from '../api/bottle';
import type {
  WineWithBottleFormState,
} from '../form/wineWithBottle';

/**
 * useWineWithBottleForm フック戻り値
 */
export interface UseWineWithBottleFormReturn {
  wineWithBottleForm: WineWithBottleFormState;
  setWineWithBottleForm: (form: WineWithBottleFormState) => void;
  creatingWineWithBottle: boolean;
  resetForm: () => void;
  handleCreate: (e?: React.FormEvent) => Promise<{ wine: Wine; bottle: Bottle } | null>;
}

/**
 * useWines フック戻り値
 */
export interface UseWinesReturn {
  wines: Wine[];
}

// TODO: useWineFilter, その他 Wine 関連フック定義の確認
