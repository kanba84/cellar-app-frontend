import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWines } from "../api/wineApi";
import { useWineFilter } from "../features/wines/hooks/useWineFilter";
import WineFilter from "../features/wines/components/WineFilter";
import wineTypeColor from "../utils/wineUtils";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import "flag-icons/css/flag-icons.min.css";

function WineListPage() {
  const [wines, setWines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    filters,
    setFilterType,
    setFilterCountry,
    setFilterRegion,
    setFilterName,
    filteredWines: filteredWinesRaw,
    resetFilters,
  } = useWineFilter(wines);
  
  const filteredWines: any[] = (filteredWinesRaw as any[]) || [];

  useEffect(() => {
    fetchWines()
      .then((data) => {
        setWines(Array.isArray(data) ? data : []);
      })
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
      <Typography variant="h4" gutterBottom fontSize={isMobile ? 22 : 32}>
        ワイン一覧
      </Typography>

      {/* フィルターUI */}
      <div>{(WineFilter as any)({
        filters,
        setFilterType,
        setFilterCountry,
        setFilterRegion,
        setFilterName,
        resetFilters,
        wines,
        isMobile,
      })}</div>

      {filteredWines.length === 0 ? (
        <Typography>
          {wines.length === 0
            ? "登録されているワインはありません。"
            : "条件に合うワインはありません。"}
        </Typography>
      ) : (
        <Box
          component="div"
          sx={{
            bgcolor: "#FDFCF0",
            borderRadius: 0,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
            overflow: "hidden",
          }}
        >
          <List sx={{ p: 0 }}>
            {filteredWines.map((wine) => {
              return (
                <ListItem
                  key={wine.id}
                  disablePadding
                  sx={{
                    background: "#FDFCF0",
                    borderRadius: 0,
                    mb: 0,
                    mx: 0,
                    px: isMobile ? 1 : 2,
                    py: isMobile ? 1 : 1.5,
                    borderBottom: "1px solid #E0DCCF",
                    "&:first-of-type": {
                      borderTop: "1px solid #E0DCCF",
                    },
                    "&:hover": {
                      background: "#FAF8ED",
                    },
                  }}
                >
                  <ListItemButton component={Link} to={`/wines/${wine.id}`} sx={{ p: 0 }}>
                    <Box display="flex" alignItems="flex-start" gap={1.5} width="100%">
                      {/* カラーバー */}
                      <Box
                        sx={{
                          width: "4px",
                          height: "1.5em",
                          backgroundColor:
                            wineTypeColor[wine.wine_type_name as keyof typeof wineTypeColor] || "#cccccc",
                          flexShrink: 0,
                          borderRadius: "1px",
                        }}
                      />

                      {/* 国旗 */}
                      {wine.country_iso_code && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span
                            className={`fi fi-${wine.country_iso_code.toLowerCase()}`}
                            style={{ fontSize: "24px", borderRadius: "4px" }}
                          />
                        </Box>
                      )}

                      {/* ワイン名 + ヴィンテージ */}
                      <Typography sx={{ fontWeight: 600, color: "#2C2C2C", flex: 1 }}>
                        {wine.name}
                        {wine.vintage && ` (${wine.vintage})`}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default WineListPage;
