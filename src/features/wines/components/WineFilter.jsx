import FilterPanel from "../../../components/Filter/FilterPanel";

function WineFilter({
  filters,
  setFilterType,
  setFilterCountry,
  setFilterRegion,
  setFilterName,
  resetFilters,
  wines = [],
  isMobile,
}) {
  // FilterPanel用の統一的な onChange ハンドラ
  const handleFilterChange = (fieldName, value) => {
    switch (fieldName) {
      case "type":
        setFilterType(value);
        break;
      case "country":
        setFilterCountry(value);
        break;
      case "region":
        setFilterRegion(value);
        break;
      case "name":
        setFilterName(value);
        break;
      default:
        break;
    }
  };

  // フィルターフィールド定義
  const filterFields = [
    {
      name: "type",
      label: "ワインタイプ",
      type: "select",
      options: [
        { label: "すべて", value: "" },
        ...[
          ...new Set(wines.map((w) => w.wine_type_name).filter(Boolean)),
        ].map((type) => ({ label: type, value: type })),
      ],
      sx: { minWidth: 120 },
    },
    {
      name: "country",
      label: "生産国",
      type: "select",
      options: [
        { label: "すべて", value: "" },
        ...[
          ...new Set(wines.map((w) => w.country_name).filter(Boolean)),
        ].map((country) => ({ label: country, value: country })),
      ],
      sx: { minWidth: 120 },
    },
    {
      name: "region",
      label: "地域",
      type: "select",
      options: [
        { label: "すべて", value: "" },
        ...[...new Set(wines.map((w) => w.region_name).filter(Boolean))].map(
          (region) => ({ label: region, value: region })
        ),
      ],
      sx: { minWidth: 120 },
    },
    {
      name: "name",
      label: "ワイン名",
      type: "text",
      options: [
        { label: "すべて", value: "" },
        ...[...new Set(wines.map((w) => w.name).filter(Boolean))].map((name) => ({
          label: name,
          value: name,
        })),
      ],
      sx: { minWidth: 120 },
    },
  ];

  return (
    <FilterPanel
      filters={filters}
      onChange={handleFilterChange}
      filterFields={filterFields}
      onReset={resetFilters}
      isMobile={isMobile}
    />
  );
}

export default WineFilter;
