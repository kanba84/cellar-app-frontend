import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
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
          <TextField
            select
            label="ワイン"
            value={form.wine_id}
            onChange={(e) => onChange({ ...form, wine_id: e.target.value })}
            required
            size="small"
            InputProps={{ sx: { fontSize: inputFontSize } }}
            InputLabelProps={{ sx: { fontSize: inputFontSize } }}
          >
            <MenuItem value="" sx={{ fontSize: inputFontSize }}>
              選択してください
            </MenuItem>
            {wines.map((wine) => (
              <MenuItem
                key={wine.id}
                value={wine.id}
                sx={{ fontSize: inputFontSize }}
              >
                {wine.name} {wine.vintage && `- ${wine.vintage}`}
              </MenuItem>
            ))}
          </TextField>
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
