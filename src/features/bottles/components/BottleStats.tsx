import { Box, Typography, Stack } from "@mui/material";
import type { Bottle } from "@/types/api/bottle";

interface BottleStatsProps {
  bottles: Bottle[];
}

function BottleStats({ bottles }: BottleStatsProps) {
  const typeCounts = bottles.reduce((acc: Record<string, number>, bottle: Bottle) => {
    const type = bottle.wine?.wine_type_name || "不明";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        bgcolor: "#2a2a2a",
        borderRadius: 0,
        border: "1px solid #424242",
      }}
    >
      <Typography variant="body1" sx={{ color: "#ffffff", fontWeight: 600 }}>
        総本数: {bottles.length}本
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
        {Object.entries(typeCounts).map(([type, count]) => (
          <Typography key={type} variant="body2" sx={{ color: "#e0e0e0" }}>
            {type}: {count}本
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}
export default BottleStats;
