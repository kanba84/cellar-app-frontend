import { useEffect, useState } from "react";
import { fetchDesignationTypes } from "../api/designationTypeApi";
import DesignationTypeList from "../components/DesignationType/DesignationTypeList";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

function DesignationTypeListPage() {
  const [designationTypes, setDesignationTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchDesignationTypes()
      .then((data) => {
        console.log("Fetched designationTypes:", data);
        setDesignationTypes(Array.isArray(data) ? data : []);
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
        原産地統制呼称タイプ一覧
      </Typography>
      <DesignationTypeList
        designationTypes={designationTypes}
        onDesignationTypeChanged={handleReload}
      />
    </Box>
  );
}

export default DesignationTypeListPage;
