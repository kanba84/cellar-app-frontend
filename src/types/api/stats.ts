/**
 * 統計情報の型定義
 */

export interface StatsData {
  wineTypes: WineTypeStat[];
  countries: CountryStat[];
  inventoryTrend: InventoryTrendPoint[];
}

export interface WineTypeStat {
  name: string;
  count: number;
}

export interface CountryStat {
  name: string;
  count: number;
}

export interface InventoryTrendPoint {
  date: string;
  count: number;
}
