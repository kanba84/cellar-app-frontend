import { Box, List, Typography, Divider, Collapse, IconButton } from "@mui/material";
import React, { useState } from "react";
import BottleItem from "./BottleItem";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

function BottleList({ bottles, isMobile, ...editHandlers }) {
  // 行ごとにボトルをグループ化
  const rowGroups = bottles.reduce((acc, bottle) => {
    const row = bottle.row_number;
    if (!acc[row]) acc[row] = [];
    acc[row].push(bottle);
    return acc;
  }, {});

  const sortedRows = Object.keys(rowGroups).sort((a, b) => Number(a) - Number(b));


  // 折りたたみ状態
  const [openRows, setOpenRows] = useState(() =>
    Object.fromEntries(sortedRows.map((row) => [row, true])) // 全て開いた状態で初期化
  );

  React.useEffect(() => {
    const savedState = sessionStorage.getItem('bottleListOpenRows');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      const normalized = Object.fromEntries(
        Object.entries(parsed).map(([row, val]) => [row, Boolean(val)])
      );
      setOpenRows(normalized);
    }
  }, []); // 空配列でマウント時のみ実行


  const toggleRow = (row) => {
    setOpenRows((prev) => {
      const newState = { ...prev, [row]: !prev[row] };
      // 状態をsessionStorageに保存
      sessionStorage.setItem('bottleListOpenRows', JSON.stringify(newState));
      return newState;
    });
  };
  if (bottles.length === 0) {
    return <Typography>登録されているボトルはありません。</Typography>;
  }

  return (
    <List>
      {sortedRows.map((row, index) => {
        const bottlesInRow = rowGroups[row];
        const groupColor = index % 2 === 0 ? "#f5f5f5" : "#fff";
        return (
          <React.Fragment key={row}>
            <Divider sx={{ my: 1 }} />
            {/* 行ヘッダー */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1,
                py: 0.5,
                background: groupColor,
                borderRadius: 1,
                cursor: "pointer",
              }}
              onClick={() => toggleRow(row)}
            >
              <Typography variant="subtitle1">{row}段目 ({bottlesInRow.length}本）</Typography>
              <IconButton size="small">
                {openRows[row] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>

            {/* 折りたたみ本体 */}
            <Collapse in={openRows[row]} timeout="auto" unmountOnExit>
              {rowGroups[row]
                .sort((a, b) => Number(a.column_number) - Number(b.column_number))
                .map((bottle) => (
                  <Box
                    key={bottle.id}
                    sx={{
                      background: groupColor,
                      borderRadius: 2,
                      mb: 1,
                      mx: 1,
                      px: isMobile ? 0.5 : 1,
                      py: isMobile ? 0.5 : 1,
                      cursor: "pointer",
                      transition: "background 0.2s",
                      "&:hover": {
                        background: "#e0e0e0",
                      },
                    }}
                  >
                    <BottleItem bottle={bottle} {...editHandlers} />
                  </Box>
                ))}
            </Collapse>
          </React.Fragment>
        );
      })}
    </List>
  );
}

export default BottleList;
