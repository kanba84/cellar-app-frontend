import { useEffect, useState } from "react";
import { fetchWineTypes } from "../api/wineTypeApi";
import WineTypeList from "../components/WineType/WineTypeList";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

function WineTypeListPage() {
  const [wineTypes, setWineTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchWineTypes()
      .then((data) => {
        console.log("Fetched wineTypes:", data);
        setWineTypes(Array.isArray(data) ? data : []);
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
        ワインタイプ一覧
      </Typography>
      <WineTypeList wineTypes={wineTypes} onWineTypeChanged={handleReload} />
    </Box>
  );
}

export default WineTypeListPage;
