import { useReducer, useMemo } from "react";

const initialFilters = {
  type: "",
  country: "",
  row: "",
  opened: "",
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_COUNTRY":
      return { ...state, country: action.payload };
    case "SET_ROW":
      return { ...state, row: action.payload };
    case "SET_OPENED":
      return { ...state, opened: action.payload };
    case "RESET":
      return initialFilters;
    default:
      return state;
  }
};

export function useBottleFilter(bottles = []) {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  // useMemo を使ってフィルタ結果をメモ化
  // bottles と filter条件が変わった時だけ再計算する
  const filteredBottles = useMemo(() => {
    // bottlesが配列であることを確認
    if (!Array.isArray(bottles)) {
      console.warn("useBottleFilter: bottles is not an array", bottles);
      return [];
    }
    return bottles.filter((bottle) => {
      let ok = true;
      if (filters.type) ok = ok && bottle.wine?.wine_type_name === filters.type;
      if (filters.country)
        ok = ok && bottle.wine?.country_name === filters.country;
      if (filters.row) ok = ok && String(bottle.row_number) === String(filters.row);
      if (filters.opened === "opened") ok = ok && bottle.is_opened;
      if (filters.opened === "unopened") ok = ok && !bottle.is_opened;
      return ok;
    });
  }, [bottles, filters]);

  const setFilterType = (value) => dispatch({ type: "SET_TYPE", payload: value });
  const setFilterCountry = (value) => dispatch({ type: "SET_COUNTRY", payload: value });
  const setFilterRow = (value) => dispatch({ type: "SET_ROW", payload: value });
  const setFilterOpened = (value) => dispatch({ type: "SET_OPENED", payload: value });
  const resetFilters = () => dispatch({ type: "RESET" });

  return {
    filters,
    setFilterType,
    setFilterCountry,
    setFilterRow,
    setFilterOpened,
    filteredBottles,
    resetFilters,
  };
}