import React, { useEffect, useState } from "react";
import { fetchAppellations } from "../api/appellationApi";
import AppellationList from "../components/Appellation/AppellationList";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

function AppellationListPage() {
  const [appellations, setAppellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchAppellations()
      .then((data) => {
        console.log("Fetched appellations:", data);
        setAppellations(Array.isArray(data) ? data : []);
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
        アペラシオン一覧
      </Typography>
      <AppellationList
        appellations={appellations}
        onAppellationChanged={handleReload}
      />
    </Box>
  );
}

export default AppellationListPage;
