import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWines } from "../api/wineApi";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function WineListPage() {
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <Box>
      <Typography variant="h4" gutterBottom>
        ワイン一覧
      </Typography>
      {wines.length === 0 ? (
        <Typography>登録されているワインはありません。</Typography>
      ) : (
        <List>
          {wines.map((wine) => (
            <ListItem key={wine.id} disablePadding>
              <ListItemButton component={Link} to={`/wines/${wine.id}`}>
                <ListItemText
                  primary={
                    <>
                      {wine.name}
                      {wine.vintage && ` (${wine.vintage})`}
                      {wine.country_name && ` - ${wine.country_name}`}
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default WineListPage;
