import type { Bottle } from "@/types/api/bottle";
import FilterPanel from "@/components/Filter/FilterPanel";

const TypedFilterPanel = FilterPanel as any;

interface BottleFilterProps {
  filters: {
    type: string;
    country: string;
    row: string;
    opened: string;
  };
  setFilterType: (value: string) => void;
  setFilterCountry: (value: string) => void;
  setFilterRow: (value: string) => void;
  setFilterOpened: (value: string) => void;
  resetFilters: () => void;
  bottles?: Bottle[];
  isMobile?: boolean;
}

function BottleFilter({
  filters,
  setFilterType,
  setFilterCountry,
  setFilterRow,
  setFilterOpened,
  resetFilters,
  bottles = [],
  isMobile,
}: BottleFilterProps) {
  // FilterPanel用の統一的な onChange ハンドラ
  const handleFilterChange = (fieldName: string, value: string): void => {
    switch (fieldName) {
      case "type":
        setFilterType(value);
        break;
      case "country":
        setFilterCountry(value);
        break;
      case "row":
        setFilterRow(value);
        break;
      case "opened":
        setFilterOpened(value);
        break;
      default:
        break;
    }
  };

  // フィルターフィールド定義
  const filterFields = [
    {
      name: "type",
      label: "タイプ",
      type: "select",
      options: [
        { label: "すべて", value: "" },
        ...[
          ...new Set(
            bottles.map((b) => b.wine?.wine_type_name).filter(Boolean),
          ),
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
          ...new Set(bottles.map((b) => b.wine?.country_name).filter(Boolean)),
        ].map((country) => ({ label: country, value: country })),
      ],
      sx: { minWidth: 120 },
    },
    {
      name: "row",
      label: "行",
      type: "number",
      placeholder: "例: 1",
      sx: { minWidth: 80 },
    },
    {
      name: "opened",
      label: "開封状態",
      type: "select",
      options: [
        { label: "すべて", value: "" },
        { label: "未開封", value: "unopened" },
        { label: "開封済み", value: "opened" },
      ],
      sx: { minWidth: 120 },
    },
  ];

  return (
    <TypedFilterPanel
      filters={filters}
      onChange={handleFilterChange}
      filterFields={filterFields}
      onReset={resetFilters}
      isMobile={isMobile}
    /> as any
  );
}

export default BottleFilter;
