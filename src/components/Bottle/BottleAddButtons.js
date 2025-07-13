import { Button, Stack } from "@mui/material";

function BottleAddButtons({ isMobile, onAddBottle, onAddWine }) {
  return (
    <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ mb: 2 }}>
      <Button variant="contained" onClick={onAddWine} fullWidth={isMobile}>
        ワイン新規追加
      </Button>
      <Button variant="outlined" onClick={onAddBottle} fullWidth={isMobile}>
        ボトル追加
      </Button>
    </Stack>
  );
}

export default BottleAddButtons;
