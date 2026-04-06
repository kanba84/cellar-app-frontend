import { useState } from 'react';
import type { Wine } from '@/types/api/wine';
import type { Bottle } from '@/types/api/bottle';
import type {
  WineWithBottleFormState,
  WineWithBottleFormSubmitData,
  CreateWineWithBottleRequest,
} from '@/types/form/wineWithBottle';
import type { UseWineWithBottleFormReturn } from '@/types/hook/wine';
import { createWineWithBottle } from '@/api/wineApi';

/**
 * ワインとボトルを同時に作成するためのフォーム状態管理Hook
 */
export function useWineWithBottleForm(): UseWineWithBottleFormReturn {
  const [wineWithBottleForm, setWineWithBottleForm] = useState<WineWithBottleFormState>({
    wine: {
      name: '',
      vintage: '',
      wine_type_id: '',
      country_id: '',
      region_id: '',
      producer: '',
    },
    bottle: {
      row_number: '',
      column_number: '',
      note: '',
    },
  });
  const [creatingWineWithBottle, setCreatingWineWithBottle] = useState<boolean>(false);

  /**
   * フォームの状態を初期値にリセットする
   */
  const resetForm = (): void => {
    setWineWithBottleForm({
      wine: {
        name: '',
        vintage: '',
        wine_type_id: '',
        country_id: '',
        region_id: '',
        producer: '',
      },
      bottle: {
        row_number: '',
        column_number: '',
        note: '',
      },
    });
  };

  /**
   * 作成処理の実行
   */
  const handleCreate = async (e?: React.FormEvent): Promise<{ wine: Wine; bottle: Bottle } | null> => {
    // イベントオブジェクトが正しく渡された場合のみ preventDefault を実行
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    setCreatingWineWithBottle(true);

    try {
      const { wine, bottle } = wineWithBottleForm;

      // リクエストデータの整形（数値変換など）
      const requestData: CreateWineWithBottleRequest = {
        wine: {
          name: wine.name,
          vintage: wine.vintage ? Number(wine.vintage) : null,
          wine_type_id: wine.wine_type_id ? Number(wine.wine_type_id) : null,
          country_id: wine.country_id ? Number(wine.country_id) : null,
          region_id: wine.region_id ? Number(wine.region_id) : null,
          producer: wine.producer || null,
        },
        bottle: {
          wine_id: 0, // TODO: API側の仕様確認 - ワイン作成後の自動割り当てか
          row_number: bottle.row_number ? Number(bottle.row_number) : null,
          column_number: bottle.column_number ? Number(bottle.column_number) : null,
          note: bottle.note || '',
        },
      };

      // API実行
      const response = await createWineWithBottle(requestData);

      // 成功時にフォームをリセット
      resetForm();

      // 呼び出し元で再フェッチ等の処理を行えるよう、レスポンスを返す
      return response;
    } catch (err) {
      // エラーは useBottleActions 側の executeWithErrorHandling でキャッチさせるため再スロー
      throw err;
    } finally {
      setCreatingWineWithBottle(false);
    }
  };

  return {
    wineWithBottleForm,
    setWineWithBottleForm,
    creatingWineWithBottle,
    resetForm,
    handleCreate,
  };
}
