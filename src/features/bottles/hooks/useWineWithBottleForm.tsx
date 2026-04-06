import { useState } from "react";
import { createWineWithBottle } from "@/api/wineApi";

/**
 * ワインとボトルを同時に作成するためのフォーム状態管理Hook
 */
export function useWineWithBottleForm() {
  const [wineWithBottleForm, setWineWithBottleForm] = useState({
    wine: {
      name: "",
      vintage: "",
      wine_type_id: "",
      country_id: "",
      region_id: "",
      producer: "",
    },
    bottle: {
      row_number: "",
      column_number: "",
      note: "",
    },
  });
  const [creatingWineWithBottle, setCreatingWineWithBottle] = useState(false);

  /**
   * フォームの状態を初期値にリセットする
   */
  const resetForm = () => {
    setWineWithBottleForm({
      wine: {
        name: "",
        vintage: "",
        wine_type_id: "",
        country_id: "",
        region_id: "",
        producer: "",
      },
      bottle: {
        row_number: "",
        column_number: "",
        note: "",
      },
    });
  };

  /**
   * 作成処理の実行
   * @param {Object} e - イベントオブジェクト（省略可能）
   * @returns {Promise<Object|null>} 成功時はレスポンスデータ、失敗時はエラーをスロー
   */
  const handleCreate = async (e) => {
    // イベントオブジェクトが正しく渡された場合のみ preventDefault を実行
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    setCreatingWineWithBottle(true);

    try {
      const { wine, bottle } = wineWithBottleForm;

      // リクエストデータの整形（数値変換など）
      const requestData = {
        wine: {
          name: wine.name,
          vintage: wine.vintage ? Number(wine.vintage) : null,
          wine_type_id: wine.wine_type_id ? Number(wine.wine_type_id) : null,
          country_id: wine.country_id ? Number(wine.country_id) : null,
          region_id: wine.region_id ? Number(wine.region_id) : null,
          producer: wine.producer,
        },
        bottle: {
          row_number: bottle.row_number ? Number(bottle.row_number) : null,
          column_number: bottle.column_number
            ? Number(bottle.column_number)
            : null,
          note: bottle.note || "",
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
