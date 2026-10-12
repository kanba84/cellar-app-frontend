import { useEffect, useState } from 'react';
import type { Bottle } from '@/types/api/bottle';
import { MAX_CELLAR_ROWS } from '@/types/domain/cellar';
import type { UseBottleListViewModelReturn } from '@/types/hook/bottle';

/**
 * ボトル一覧のグループ化と折りたたみ状態を管理するHook
 */
export function useBottleListViewModel(bottles: Bottle[]): UseBottleListViewModelReturn {
  // グループ化
  const groupedBottles = bottles.reduce<Record<string | number, Bottle[]>>((acc, bottle) => {
    const row = bottle.row_number;
    if (row === null || row === undefined) return acc;
    if (!acc[row]) acc[row] = [];
    acc[row].push(bottle);
    return acc;
  }, {});

  const sortedRows = Array.from({ length: MAX_CELLAR_ROWS }, (_, index) => index + 1);
  const rowGroups = Object.fromEntries(
    sortedRows.map((row) => [row, groupedBottles[row] ?? []])
  );

  // 開閉状態
  const defaultOpenRows = Object.fromEntries(sortedRows.map((row) => [row, true]));
  const [openRows, setOpenRows] = useState<Record<string | number, boolean>>(defaultOpenRows);

  useEffect(() => {
    const saved = sessionStorage.getItem('bottleListOpenRows');
    if (saved) {
      const parsed = JSON.parse(saved) as Record<string | number, boolean>;
      setOpenRows({ ...defaultOpenRows, ...parsed });
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
