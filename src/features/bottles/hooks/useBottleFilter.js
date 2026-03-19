import { useState } from "react";

export function useBottleFilter() {
  const [filterType, setFilterType] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterRow, setFilterRow] = useState("");
  const [filterOpened, setFilterOpened] = useState("");

  const getFilteredBottles = (bottles) => {
    return bottles.filter((bottle) => {
      let ok = true;
      if (filterType) ok = ok && bottle.wine?.wine_type_name === filterType;
      if (filterCountry)
        ok = ok && bottle.wine?.country_name === filterCountry;
      if (filterRow) ok = ok && String(bottle.row_number) === String(filterRow);
      if (filterOpened === "opened") ok = ok && bottle.is_opened;
      if (filterOpened === "unopened") ok = ok && !bottle.is_opened;
      return ok;
    });
  };

  const resetFilters = () => {
    setFilterType("");
    setFilterCountry("");
    setFilterRow("");
    setFilterOpened("");
  };

  return {
    filterType,
    setFilterType,
    filterCountry,
    setFilterCountry,
    filterRow,
    setFilterRow,
    filterOpened,
    setFilterOpened,
    getFilteredBottles,
    resetFilters,
  };
}