import { useEffect, useState } from 'react';
import type { Bottle } from '@/types/api/bottle';
import type { UseBottleListViewModelReturn } from '@/types/hook/bottle';

/**
 * ボトル一覧のグループ化と折りたたみ状態を管理するHook
 */
export function useBottleListViewModel(bottles: Bottle[]): UseBottleListViewModelReturn {
  // グループ化
  const rowGroups = bottles.reduce<Record<string | number, Bottle[]>>((acc, bottle) => {
    const row = bottle.row_number;
    if (!acc[row]) acc[row] = [];
    acc[row].push(bottle);
    return acc;
  }, {});

  const sortedRows = Object.keys(rowGroups)
    .sort((a, b) => Number(a) - Number(b))
    .map((row) => (isNaN(Number(row)) ? row : Number(row)));

  // 開閉状態
  const [openRows, setOpenRows] = useState<Record<string | number, boolean>>(
    Object.fromEntries(sortedRows.map((row) => [row, true]))
  );

  useEffect(() => {
    const saved = sessionStorage.getItem('bottleListOpenRows');
    if (saved) {
      const parsed = JSON.parse(saved) as Record<string | number, boolean>;
      setOpenRows(parsed);
    }
  }, []);

  const toggleRow = (row: string | number): void => {
    setOpenRows((prev) => {
      const next = { ...prev, [row]: !prev[row] };
      sessionStorage.setItem('bottleListOpenRows', JSON.stringify(next));
      return next;
    });
  };

  return {
    rowGroups,
    sortedRows,
    openRows,
    toggleRow,
  };
}
