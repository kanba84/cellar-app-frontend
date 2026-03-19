import { useReducer, useMemo } from "react";

const initialFilters = {
  type: "",
  country: "",
  region: "",
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_COUNTRY":
      return { ...state, country: action.payload };
    case "SET_REGION":
      return { ...state, region: action.payload };
    case "RESET":
      return initialFilters;
    default:
      return state;
  }
};

export function useWineFilter(wines = []) {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  // useMemo を使ってフィルタ結果をメモ化
  // wines と filter条件が変わった時だけ再計算する
  const filteredWines = useMemo(() => {
    return wines.filter((wine) => {
      let ok = true;
      if (filters.type) ok = ok && wine.wine_type_name === filters.type;
      if (filters.country) ok = ok && wine.country_name === filters.country;
      if (filters.region) ok = ok && wine.region_name === filters.region;
      return ok;
    });
  }, [wines, filters]);

  const setFilterType = (value) => dispatch({ type: "SET_TYPE", payload: value });
  const setFilterCountry = (value) => dispatch({ type: "SET_COUNTRY", payload: value });
  const setFilterRegion = (value) => dispatch({ type: "SET_REGION", payload: value });
  const resetFilters = () => dispatch({ type: "RESET" });

  return {
    filters,
    setFilterType,
    setFilterCountry,
    setFilterRegion,
    filteredWines,
    resetFilters,
  };
}
