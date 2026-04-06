import React, { useEffect, useState } from "react";
import { fetchCountries } from "../api/countryApi";
import CountryList from "../components/Country/CountryList";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

function CountryListPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchCountries()
      .then((data) => {
        console.log("Fetched countries:", data);
        setCountries(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, [reloadKey]);

  const handleReload = () => {
    setReloadKey((k) => k + 1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        生産国一覧
      </Typography>
      <CountryList countries={countries} onCountryChanged={handleReload} />
    </Box>
  );
}

export default CountryListPage;
