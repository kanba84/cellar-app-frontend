import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCountries } from "../api/countryApi";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

function CountryListPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountries()
      .then(setCountries)
      .catch(() => setError("生産国一覧の取得に失敗しました"))
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
        生産国一覧
      </Typography>
      <List>
        {countries.map((country) => (
          <ListItem key={country.id} disablePadding>
            <ListItemButton
              component={Link}
              to={`/config/countries/${country.id}/regions`}
            >
              <ListItemText primary={country.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default CountryListPage;
