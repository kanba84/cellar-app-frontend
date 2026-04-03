import { useEffect, useState } from "react";

export function useBottleListViewModel(bottles) {
  // グループ化
  const rowGroups = bottles.reduce((acc, bottle) => {
    const row = bottle.row_number;
    if (!acc[row]) acc[row] = [];
    acc[row].push(bottle);
    return acc;
  }, {});

  const sortedRows = Object.keys(rowGroups).sort(
    (a, b) => Number(a) - Number(b),
  );

  // 開閉状態
  const [openRows, setOpenRows] = useState(
    Object.fromEntries(sortedRows.map((row) => [row, true])),
  );

  useEffect(() => {
    const saved = sessionStorage.getItem("bottleListOpenRows");
    if (saved) {
      const parsed = JSON.parse(saved);
      setOpenRows(parsed);
    }
  }, []);

  const toggleRow = (row) => {
    setOpenRows((prev) => {
      const next = { ...prev, [row]: !prev[row] };
      sessionStorage.setItem("bottleListOpenRows", JSON.stringify(next));
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
