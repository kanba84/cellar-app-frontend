import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import wineTypeColor, { wineTypeColorLight } from "@/utils/wineUtils";
import "flag-icons/css/flag-icons.min.css";
import MenuItem from "@mui/material/MenuItem";
import type { Bottle } from "@/types/api/bottle";

interface BottleItemProps {
  bottle: Bottle;
  editId: number | null;
  editForm: Partial<Bottle>;
  onEditStart: (bottle: Bottle) => void;
  onEditChange: (form: Partial<Bottle>) => void;
  onEditSave: (bottleId: number, form: Partial<Bottle>) => Promise<void>;
  onEditCancel: () => void;
  onDelete: (bottleId: number) => void;
  onBottleDetail?: (bottle: Bottle) => void;
}

function BottleItem({
  bottle,
  editId,
  editForm,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
  onBottleDetail,
}: BottleItemProps) {
  const navigate = useNavigate();

  const handleOpenedToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (editId === bottle.id) {
      onEditChange({ ...editForm, is_opened: e.target.checked });
    } else {
      // トグルのみなので、is_opened だけを送信（PATCH で処理）
      await onEditSave(bottle.id, { is_opened: e.target.checked });
    }
  };

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        mb: 0,
        bgcolor: "#FDFCF0",
        borderRadius: 0,
        boxShadow: "none",
        borderBottom: "1px solid #E0DCCF",
        flexDirection: "column", // 縦並びに
        p: 2,
        "&:first-of-type": {
          borderTop: "1px solid #E0DCCF",
        },
      }}
    >
      {/* --- 1段目：画像とワイン情報 --- */}
      <Stack direction="row" spacing={2} alignItems="flex-start" width="100%">
        <Box
          component="img"
          src={bottle.wine?.label_image_url || "/labels/sample_thumbnail.png"}
          alt={`${bottle.wine?.name} ラベル`}
          onClick={(e: React.MouseEvent) => {
            if (onBottleDetail) {
              e.stopPropagation();
              onBottleDetail(bottle);
            }
          }}
          sx={{
            width: 100,
            height: "auto",
            borderRadius: 0,
            boxShadow: "none",
            border: "1px solid #E0DCCF",
            flexShrink: 0,
            cursor: onBottleDetail ? "pointer" : "default",
          }}
        />

        <Box flex={1}>
          {/* ワイン名 + カラーバー */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              mb: 1,
            }}
          >
            {/* ワインタイプカラーバー */}
            <Box
              sx={{
                width: "4px",
                height: "1.5em",
                backgroundColor:
                  wineTypeColor[bottle.wine?.wine_type_name as keyof typeof wineTypeColor] || "#cccccc",
                flexShrink: 0,
                borderRadius: "1px",
              }}
            />

            <Typography
              fontWeight="bold"
              sx={{ color: "#2C2C2C", cursor: "pointer", flex: 1 }}
              onClick={() => {
                if (bottle.wine?.id) navigate(`/wines/${bottle.wine.id}`);
              }}
            >
              {bottle.wine?.name || "ワイン名不明"}
              {bottle.wine?.vintage && <>（{bottle.wine.vintage}年）</>}
            </Typography>
          </Box>

          {/* ワイン詳細情報 */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: "wrap" }}>
            {/* ワインタイプChip */}
            {bottle.wine?.wine_type_name && (
              <Chip
                label={bottle.wine.wine_type_name}
                size="small"
                sx={{
                  backgroundColor:
                    wineTypeColorLight[bottle.wine.wine_type_name as keyof typeof wineTypeColorLight] || "#f0f0f0",
                  color: wineTypeColor[bottle.wine.wine_type_name as keyof typeof wineTypeColor] || "#666",
                  fontWeight: 600,
                  height: "24px",
                }}
              />
            )}

            {/* 生産国 */}
            {bottle.wine?.country_name && (
              <Typography variant="body2" sx={{ color: "#665E5E" }}>
                {bottle.wine.country_name}
              </Typography>
            )}
          </Stack>

          {/* その他の情報 */}
          <Typography variant="body2" sx={{ color: "#665E5E", lineHeight: 1.4 }}>
            {bottle.wine?.region_name && (
              <>地域: {bottle.wine.region_name}</>
            )}
            {bottle.wine?.region_name && bottle.wine?.producer && <> / </>}
            {bottle.wine?.producer && (
              <>生産者: {bottle.wine.producer}</>
            )}
          </Typography>
        </Box>
      </Stack>

      {/* --- 2段目：棚位置・開封状態・トグル --- */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        sx={{ mt: 2 }}
      >
        {/* 棚位置 */}
        {editId === bottle.id ? (
          <Stack direction="row" spacing={1}>
            <TextField
              select
              label="棚 行"
              size="small"
              value={String(editForm.row_number || "")}
              onChange={(e) =>
                onEditChange({ ...editForm, row_number: e.target.value ? Number(e.target.value) : undefined })
              }
              sx={{ width: 80 }}
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
              size="small"
              value={String(editForm.column_number || "")}
              onChange={(e) =>
                onEditChange({ ...editForm, column_number: e.target.value ? Number(e.target.value) : undefined })
              }
              sx={{ width: 80 }}
            >
              {[...Array(7)].map((_, i) => (
                <MenuItem key={i + 1} value={String(i + 1)}>
                  {i + 1}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        ) : (
          <Typography variant="body2" sx={{ color: "#2C2C2C" }}>
            棚位置: {bottle.row_number}行 {bottle.column_number}列
          </Typography>
        )}

        {/* 開封状態 + トグル */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Switch
            checked={
              editId === bottle.id ? editForm.is_opened : bottle.is_opened
            }
            onChange={handleOpenedToggle}
            color="primary"
          />
          <Typography variant="body2" sx={{ color: "#2C2C2C" }}>
            開封:{" "}
            {(editId === bottle.id ? editForm.is_opened : bottle.is_opened)
              ? "済"
              : "未"}
          </Typography>
        </Stack>
      </Stack>

      {/* --- 3段目：国旗 + 操作ボタン --- */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        sx={{ mt: 2 }}
      >
        {/* 国旗 */}
        {bottle.wine?.country_iso_code && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <span
              className={`fi fi-${bottle.wine.country_iso_code.toLowerCase()}`}
              style={{ fontSize: "24px", borderRadius: "4px" }}
            ></span>
          </Box>
        )}

        {/* 操作ボタン */}
        <Stack direction="row" spacing={1}>
          {editId === bottle.id ? (
            <>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={async (e: React.MouseEvent) => {
                  e.stopPropagation();
                  await onEditSave(bottle.id, editForm);
                }}
              >
                保存
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onEditCancel();
                }}
              >
                キャンセル
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onEditStart(bottle);
                }}
              >
                変更
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onDelete(bottle.id);
                }}
              >
                削除
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </ListItem>
  );
}

export default BottleItem;
