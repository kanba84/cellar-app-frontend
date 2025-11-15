import { Button, MenuItem, Stack, TextField } from "@mui/material";

function BottleFilter({
  filterType,
  setFilterType,
  filterCountry,
  setFilterCountry,
  filterRow,
  setFilterRow,
  filterOpened,
  setFilterOpened,
  bottles,
  isMobile,
}) {
  const resetFilters = () => {
    setFilterType("");
    setFilterCountry("");
    setFilterRow("");
    setFilterOpened("");
  };

  return (
    <Stack spacing={1} sx={{ mb: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          overflowX: 'auto',
          pb: 1,
          mb: 0,
          width: '100%',
          flexWrap: 'nowrap',
        }}
      >
        <TextField
          select
          label="タイプ"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          size="small"
          sx={{
            minWidth: 120,
            mb: 0,
          }}
        >
          <MenuItem value="">すべて</MenuItem>
          {[
            ...new Set(
              bottles.map((b) => b.wine?.wine_type_name).filter(Boolean),
            ),
          ].map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="生産国"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          size="small"
          sx={{
            minWidth: 120,
            mb: 0,
          }}
        >
          <MenuItem value="">すべて</MenuItem>
          {[
            ...new Set(bottles.map((b) => b.wine?.country_name).filter(Boolean)),
          ].map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="行"
          value={filterRow}
          onChange={(e) => setFilterRow(e.target.value)}
          size="small"
          sx={{
            minWidth: 80,
            mb: 0,
          }}
          type="number"
          placeholder="例: 1"
        ></TextField>
        <TextField
          select
          label="開封状態"
          value={filterOpened}
          onChange={(e) => setFilterOpened(e.target.value)}
          size="small"
          sx={{
            minWidth: 120,
            mb: 0,
          }}
        >
          <MenuItem value="">すべて</MenuItem>
          <MenuItem value="unopened">未開封</MenuItem>
          <MenuItem value="opened">開封済み</MenuItem>
        </TextField>
      </Stack>
      <Button
        variant="outlined"
        color="inherit"
        fullWidth
        onClick={resetFilters}
        sx={{ mt: 1 }}
      >
        フィルター解除
      </Button>
    </Stack>
  );
}
export default BottleFilter;
