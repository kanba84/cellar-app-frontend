import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import type { Wine } from "@/types/api/wine";
import type { BottleFormState } from "@/types/form/bottle";

interface BottleCreateFormProps {
  form: BottleFormState;
  wines: Wine[];
  creating: boolean;
  onChange: (form: BottleFormState) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  hideWineSelect?: boolean;
  showSubmitButton?: boolean;
}

function BottleCreateForm({
  form,
  wines,
  creating,
  onChange,
  onSubmit,
  hideWineSelect = false,
  showSubmitButton = true,
}: BottleCreateFormProps) {
  const inputFontSize = { xs: 13, sm: 16 };
  const selectedWine =
    wines.find((wine) => String(wine.id) === form.wine_id) ?? null;

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, minWidth: 320 }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontSize: inputFontSize }}>
        ボトル追加
      </Typography>
      <Stack spacing={2}>
        {/* ワイン選択欄（必要な場合のみ） */}
        {!hideWineSelect && (
          <Autocomplete<Wine, false, false, false>
            options={wines}
            value={selectedWine}
            onChange={(_, value) =>
              onChange({
                ...form,
                wine_id: value ? String(value.id) : "",
              })
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) =>
              `${option.name}${option.vintage ? ` (${option.vintage})` : ""}`
            }
            filterOptions={(options, state) => {
              const query = state.inputValue.trim().toLowerCase();
              if (!query) return options;
              return options.filter((wine) => {
                const name = wine.name?.toLowerCase() ?? "";
                const vintage = wine.vintage ? String(wine.vintage) : "";
                return (
                  name.includes(query) || vintage.toLowerCase().includes(query)
                );
              });
            }}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 1,
                }}
              >
                <Typography sx={{ fontSize: inputFontSize }}>
                  {option.name}
                </Typography>
                {option.vintage && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: inputFontSize }}
                  >
                    {option.vintage}
                  </Typography>
                )}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="ワイン"
                placeholder="ワイン名・ヴィンテージで検索"
                required
                size="small"
                InputProps={{
                  ...params.InputProps,
                  sx: { fontSize: inputFontSize },
                }}
                InputLabelProps={{ sx: { fontSize: inputFontSize } }}
              />
            )}
          />
        )}
        <TextField
          select
          label="棚 行"
          value={form.row_number}
          onChange={(e) => onChange({ ...form, row_number: e.target.value })}
          required
          size="small"
          InputProps={{ sx: { fontSize: inputFontSize } }}
          InputLabelProps={{ sx: { fontSize: inputFontSize } }}
        >
          {[...Array(9)].map((_, i) => (
            <MenuItem key={i + 1} value={String(i + 1)}>
              {i + 1}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="棚 列"
          value={form.column_number}
          onChange={(e) => onChange({ ...form, column_number: e.target.value })}
          required
          size="small"
          InputProps={{ sx: { fontSize: inputFontSize } }}
          InputLabelProps={{ sx: { fontSize: inputFontSize } }}
        >
          {[...Array(7)].map((_, i) => (
            <MenuItem key={i + 1} value={String(i + 1)}>
              {i + 1}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="メモ"
          value={form.note}
          size="small"
          onChange={(e) => onChange({ ...form, note: e.target.value })}
          InputProps={{ sx: { fontSize: inputFontSize } }}
          InputLabelProps={{ sx: { fontSize: inputFontSize } }}
        />
        {showSubmitButton && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={creating}
            sx={{ fontSize: inputFontSize }}
          >
            {creating ? "追加中..." : "追加"}
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default BottleCreateForm;
