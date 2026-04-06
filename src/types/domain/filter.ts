/**
 * フィルター関連の型定義
 */

/**
 * ボトル一覧のフィルター条件
 */
export interface BottleFilterCondition {
  wineTypeId?: number | null;
  countryId?: number | null;
  regionId?: number | null;
  appellationId?: number | null;
  isOpened?: boolean | null;
  producer?: string | null;
  vintageMin?: number | null;
  vintageMax?: number | null;
  // TODO: ラベル画像の有無フィルターが必要か確認
}

/**
 * ワイン一覧のフィルター条件
 */
export interface WineFilterCondition {
  wineTypeId?: number | null;
  countryId?: number | null;
  regionId?: number | null;
  appellationId?: number | null;
  producer?: string | null;
  vintageMin?: number | null;
  vintageMax?: number | null;
}

/**
 * フィルター結果
 */
export interface FilterResult<T> {
  items: T[];
  total: number;
  appliedFilters: {
    key: string;
    value: unknown;
  }[];
}
