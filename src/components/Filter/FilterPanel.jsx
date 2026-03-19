import { Button, MenuItem, Stack, TextField } from "@mui/material";

/**
 * 汎用フィルターパネルコンポーネント
 *
 * @param {Object} filters - フィルター値のオブジェクト { key: value, ... }
 * @param {function} onChange - フィルター値を更新するコールバック (fieldName, value) => void
 * @param {Array<Object>} filterFields - フィルターフィールド定義の配列
 *   [
 *     {
 *       name: "type",
 *       label: "タイプ",
 *       type: "select", // "text" | "select" | "number"
 *       options: [ { label: "すべて", value: "" }, { label: "赤ワイン", value: "red" }, ... ],
 *       sx: { minWidth: 120 }  // オプション
 *     },
 *     ...
 *   ]
 * @param {function} onReset - リセットボタンのコールバック () => void
 * @param {boolean} isMobile - モバイル表示用のフラグ
 */
function FilterPanel({
  filters = {},
  onChange,
  filterFields = [],
  onReset,
  isMobile = false,
}) {
  const handleFieldChange = (fieldName, value) => {
    if (onChange) {
      onChange(fieldName, value);
    }
  };

  return (
    <Stack spacing={1} sx={{ mb: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          overflowX: "auto",
          pb: 1,
          mb: 0,
          width: "100%",
          flexWrap: "nowrap",
        }}
      >
        {filterFields.map((field) => {
          const { name, label, type = "text", options = [], sx = {} } = field;
          const value = filters[name] || "";

          if (type === "select") {
            return (
              <TextField
                key={name}
                select
                label={label}
                value={value}
                onChange={(e) => handleFieldChange(name, e.target.value)}
                size="small"
                sx={{
                  minWidth: 120,
                  mb: 0,
                  ...sx,
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            );
          } else if (type === "number") {
            return (
              <TextField
                key={name}
                label={label}
                value={value}
                onChange={(e) => handleFieldChange(name, e.target.value)}
                size="small"
                type="number"
                placeholder="例: 1"
                sx={{
                  minWidth: 80,
                  mb: 0,
                  ...sx,
                }}
              />
            );
          } else {
            // type === "text"
            return (
              <TextField
                key={name}
                label={label}
                value={value}
                onChange={(e) => handleFieldChange(name, e.target.value)}
                size="small"
                placeholder={field.placeholder || ""}
                sx={{
                  minWidth: 120,
                  mb: 0,
                  ...sx,
                }}
              />
            );
          }
        })}
      </Stack>

      {onReset && (
        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          onClick={onReset}
          sx={{ mt: 1 }}
        >
          フィルター解除
        </Button>
      )}
    </Stack>
  );
}

export default FilterPanel;
