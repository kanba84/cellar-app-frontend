import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWines } from "../api/wineApi";
import { useWineFilter } from "../features/wines/hooks/useWineFilter";
import WineFilter from "../features/wines/components/WineFilter";
import wineTypeColor from "../utils/wineUtils";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import "flag-icons/css/flag-icons.min.css";

function WineListPage() {
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    filters,
    setFilterType,
    setFilterCountry,
    setFilterRegion,
    filteredWines,
    resetFilters,
  } = useWineFilter(wines);

  useEffect(() => {
    fetchWines()
      .then(setWines)
      .catch(() => setError("ワイン一覧の取得に失敗しました"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box px={isMobile ? 0.5 : 2}>
      <Typography
        variant="h4"
        gutterBottom
        fontSize={isMobile ? 22 : 32}
      >
        ワイン一覧
      </Typography>

      {/* フィルターUI */}
      <WineFilter
        filters={filters}
        setFilterType={setFilterType}
        setFilterCountry={setFilterCountry}
        setFilterRegion={setFilterRegion}
        resetFilters={resetFilters}
        wines={wines}
        isMobile={isMobile}
      />

      {filteredWines.length === 0 ? (
        <Typography>
          {wines.length === 0
            ? "登録されているワインはありません。"
            : "条件に合うワインはありません。"}
        </Typography>
      ) : (
        <List>
          {filteredWines.map((wine) => {
            const nameColor = wineTypeColor[wine.wine_type_name] || "inherit";

            return (
              <ListItem key={wine.id} disablePadding>
                <ListItemButton component={Link} to={`/wines/${wine.id}`}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    width="100%"
                  >
                    {wine.country_iso_code && (
                      <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <span
                          className={`fi fi-${wine.country_iso_code.toLowerCase()}`}
                          style={{ fontSize: "24px", borderRadius: "4px" }}
                        />
                      </Box>
                    )}
                    <Typography
                      sx={{ color: nameColor }}
                    >
                      {wine.name}
                      {wine.vintage && ` (${wine.vintage})`}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}

export default WineListPage;
