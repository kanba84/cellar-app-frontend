import React from "react";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
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
    <Box width="100%">
      <Stack direction="row" spacing={2} alignItems="flex-start">
        {/* 左側：サムネイル画像 */}
        <Box
          component="img"
          src={bottle.wine?.label_image_url || "/labels/sample_thumbnail.png"}
          alt={`${bottle.wine?.name} ラベル`}
          sx={{
            width: 100,
            height: "auto",
            borderRadius: 2,
            boxShadow: 1,
            flexShrink: 0,
          }}
        />

        {/* 右側：ワイン情報 */}
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

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            タイプ: {bottle.wine?.wine_type_name || "-"} / 生産国:{" "}
            {bottle.wine?.country_name || "-"}
            {bottle.wine?.region_name && <> / 地域: {bottle.wine.region_name}</>}
            <br />
            生産者: {bottle.wine?.producer || "-"}
          </Typography>
        </Box>
      </Stack>

      {/* 下段：国旗 + 状態・操作エリア */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 1 }}
      >
        {/* 国旗アイコン */}
        {bottle.wine?.country_iso_code && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <span
              className={`fi fi-${bottle.wine.country_iso_code.toLowerCase()}`}
              style={{ fontSize: "24px", borderRadius: "4px" }}
            ></span>
          </Box>
        )}

        {/* ボトル状態・ボタンなど */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* ここにSwitchや変更/削除ボタンなどをそのまま残す */}
          {/* 例： */}
          <Switch
            checked={editId === bottle.id ? editForm.is_opened : bottle.is_opened}
            onChange={handleOpenedToggle}
            color="primary"
          />
          <Typography variant="body2">
            開封:{" "}
            {(editId === bottle.id ? editForm.is_opened : bottle.is_opened)
              ? "済"
              : "未"}
          </Typography>

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
    </Box>
  </ListItem>
  );
}

export default BottleItem;
