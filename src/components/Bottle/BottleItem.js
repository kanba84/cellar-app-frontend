import React from "react";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import wineTypeColor from "../../utils/wineUtils";
import { useNavigate } from "react-router-dom";
import "flag-icons/css/flag-icons.min.css";
import MenuItem from "@mui/material/MenuItem";

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
}) {
  const nameColor = wineTypeColor[bottle.wine?.wine_type_name] || "inherit";
  const itemBgColor = bottle.is_opened ? "#e0e0e0" : "#fafafa";
  const navigate = useNavigate();

  const handleOpenedToggle = async (e) => {
    e.stopPropagation();
    if (editId === bottle.id) {
      onEditChange({ ...editForm, is_opened: e.target.checked });
    } else {
      await onEditSave(bottle.id, { is_opened: e.target.checked });
    }
  };

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        mb: 2,
        bgcolor: itemBgColor,
        borderRadius: 2,
        boxShadow: 1,
        flexDirection: "column", // 縦並びに
        p: 2,
      }}
    >
      {/* --- 1段目：画像とワイン情報 --- */}
      <Stack direction="row" spacing={2} alignItems="flex-start" width="100%">
        <Box
          component="img"
          src={bottle.wine?.label_image_url || "/labels/sample_thumbnail.png"}
          alt={`${bottle.wine?.name} ラベル`}
          onClick={(e) => {
            if (onBottleDetail) {
              e.stopPropagation();
              onBottleDetail(bottle);
            }
          }}
          sx={{
            width: 100,
            height: "auto",
            borderRadius: 2,
            boxShadow: 1,
            flexShrink: 0,
            cursor: onBottleDetail ? "pointer" : "default",
          }}
        />

        <Box flex={1}>
          <Typography
            fontWeight="bold"
            sx={{ color: nameColor, cursor: "pointer" }}
            onClick={() => {
              if (bottle.wine?.id) navigate(`/wines/${bottle.wine.id}`);
            }}
          >
            {bottle.wine?.name || "ワイン名不明"}
            {bottle.wine?.vintage && <>（{bottle.wine.vintage}年）</>}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            タイプ: {bottle.wine?.wine_type_name || "-"} / 生産国:{" "}
            {bottle.wine?.country_name || "-"}
            {bottle.wine?.region_name && (
              <> / 地域: {bottle.wine.region_name}</>
            )}
            <br />
            生産者: {bottle.wine?.producer || "-"}
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
              value={editForm.row_number || ""}
              onChange={(e) =>
                onEditChange({ ...editForm, row_number: e.target.value })
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
              value={editForm.column_number || ""}
              onChange={(e) =>
                onEditChange({ ...editForm, column_number: e.target.value })
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
          <Typography variant="body2">
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
          <Typography variant="body2">
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
                onClick={async (e) => {
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
                onClick={(e) => {
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
                onClick={(e) => {
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
                onClick={(e) => {
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
