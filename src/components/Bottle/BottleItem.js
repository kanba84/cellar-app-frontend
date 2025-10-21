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


function BottleItem({
  bottle,
  editId,
  editForm,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
}) {
  const nameColor = wineTypeColor[bottle.wine?.wine_type_name] || "inherit";
  const itemBgColor = bottle.is_opened ? "#e0e0e0" : "#fafafa";
  const navigate = useNavigate();

  // 開封状態を即時反映するためのハンドラ
  const handleOpenedToggle = (e) => {
    e.stopPropagation(); // イベントの伝播を停止
    // 編集中ならeditFormを、そうでなければis_openedのみ送信
    if (editId === bottle.id) {
      onEditChange({ ...editForm, is_opened: e.target.checked });
    } else {
      // is_openedだけをPATCH
      onEditSave(bottle.id, { is_opened: e.target.checked });
    }
  };

  return (
    <ListItem
      alignItems="flex-start"
      sx={{ mb: 2, bgcolor: itemBgColor, borderRadius: 2, boxShadow: 1 }}
    >
      <Box width="100%" sx={{ position: "relative" }}>
        <Typography
          fontWeight="bold"
          sx={{ color: nameColor }}
          onClick={() => {
            if (bottle.wine?.id) {
              navigate(`/wines/${bottle.wine.id}`);
            }
          }}
        >
          {bottle.wine?.name || "ワイン名不明"}
          {bottle.wine?.vintage && <>（{bottle.wine.vintage}年）</>}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          タイプ: {bottle.wine?.wine_type_name || "-"} / 生産国:{" "}
          {bottle.wine?.country_name || "-"}
          {bottle.wine?.region_name && <> / 地域: {bottle.wine.region_name}</>}
          <br />
          生産者: {bottle.wine?.producer || "-"}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          {/* 棚 行・列は編集時のみ入力可 */}
          {editId === bottle.id ? (
            <>
              <TextField
                label="棚 行"
                type="number"
                size="small"
                value={editForm.row_number}
                onChange={(e) => {
                  e.stopPropagation();
                  onEditChange({ ...editForm, row_number: e.target.value });
                }}
                onClick={(e) => e.stopPropagation()}
                sx={{ width: 80 }}
              />
              <TextField
                label="棚 列"
                type="number"
                size="small"
                value={editForm.column_number}
                onChange={(e) => {
                  e.stopPropagation();
                  onEditChange({ ...editForm, column_number: e.target.value });
                }}
                onClick={(e) => e.stopPropagation()}
                sx={{ width: 80 }}
              />
            </>
          ) : (
            <Typography variant="body2">
              棚位置: {bottle.row_number}行 {bottle.column_number}列
            </Typography>
          )}
          {/* トグルスイッチは常に表示・操作可能 */}
          <Switch
            checked={
              editId === bottle.id ? editForm.is_opened : bottle.is_opened
            }
            onChange={handleOpenedToggle}
            color="primary"
            inputProps={{ "aria-label": "開封状態トグル" }}
          />
          <Typography variant="body2">
            開封:{" "}
            {(editId === bottle.id ? editForm.is_opened : bottle.is_opened)
              ? "済"
              : "未"}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          追加日: {new Date(bottle.added_at).toLocaleDateString()}
        </Typography>
        {/* メモは編集時のみ入力可 */}
        {editId === bottle.id ? (
          <TextField
            label="メモ"
            size="small"
            value={editForm.note}
            onChange={(e) =>
              onEditChange({ ...editForm, note: e.target.value })
            }
            sx={{ width: 250, mb: 1 }}
          />
        ) : (
          bottle.note && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              メモ: {bottle.note}
            </Typography>
          )
        )}
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {editId === bottle.id ? (
            <>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditSave(bottle.id);
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
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => onDelete(bottle.id)}
              >
                削除
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
        {/* 国旗アイコン（右下に表示） */}
        {bottle.wine?.country_iso_code && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
            }}
          >
            <span
              className={`fi fi-${bottle.wine.country_iso_code.toLowerCase()}`}
              style={{ fontSize: "24px", borderRadius: "4px" }}
            ></span>
          </Box>
        )}
      </Box>
    </ListItem>
  );
}

export default BottleItem;
