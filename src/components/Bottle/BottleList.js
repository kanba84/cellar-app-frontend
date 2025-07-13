import { Box, List, Typography, Divider } from "@mui/material";
import React from "react";
import BottleItem from "./BottleItem";

function BottleList({ bottles, isMobile, ...editHandlers }) {
  if (bottles.length === 0) {
    return <Typography>登録されているボトルはありません。</Typography>;
  }

  const sorted = [...bottles].sort(
    (a, b) =>
      Number(a.row_number) - Number(b.row_number) ||
      Number(a.column_number) - Number(b.column_number),
  );

  let prevRow = null;
  let groupColor = false;

  return (
    <List>
      {sorted.map((bottle) => {
        const rowChanged = prevRow !== null && prevRow !== bottle.row_number;
        if (rowChanged) groupColor = !groupColor;
        prevRow = bottle.row_number;

        return (
          <React.Fragment key={bottle.id}>
            {rowChanged && <Divider sx={{ my: 1 }} />}
            <Box
              sx={{
                background: groupColor ? "#f5f5f5" : "#fff",
                borderRadius: 2,
                mb: 1,
                px: isMobile ? 0.5 : 1,
                py: isMobile ? 0.5 : 1,
                cursor: "pointer",
              }}
            >
              <BottleItem bottle={bottle} {...editHandlers} />
            </Box>
          </React.Fragment>
        );
      })}
    </List>
  );
}

export default BottleList;
