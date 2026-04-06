import { Box, Typography, Stack } from "@mui/material";

function BottleStats({ bottles }) {
  const typeCounts = bottles.reduce((acc, bottle) => {
    const type = bottle.wine?.wine_type_name || "不明";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1">総本数: {bottles.length}本</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
        {Object.entries(typeCounts).map(([type, count]) => (
          <Typography key={type} variant="body2">
            {type}: {count}本
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}
export default BottleStats;
