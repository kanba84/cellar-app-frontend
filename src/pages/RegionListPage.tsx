import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCountries } from "../api/countryApi";
import { fetchRegions } from "../api/regionApi";
import RegionList from "../components/Region/RegionList";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

function RegionListPage() {
  const { countryId, regionId } = useParams();
  const [country, setCountry] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries().then((data: any) => {
      const countryData = data.find((c: any) => c.id === Number(countryId));
      setCountry(countryData);
    });
    if (regionId) {
      fetchRegions().then((data: any) => {
        const regionData = data.find((r: any) => r.id === Number(regionId));
        setRegion(regionData);
      });
    } else {
      setRegion(null);
    }
  }, [countryId, regionId, reloadKey]);

  if (!country) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // 親リージョンへの戻る
  const handleBack = () => {
    if (region && region.parent_id) {
      navigate(`/config/countries/${countryId}/regions/${region.parent_id}`);
    } else {
      navigate(`/config/countries/${countryId}/regions`);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {region
          ? `${region.name} のリージョン一覧`
          : `${country.name} のリージョン一覧`}
      </Typography>
      <RegionList
        parentId={region ? region.id : null}
        countryId={country.id}
        onRegionAddedOrDeleted={() => setReloadKey((k) => k + 1)}
        reloadKey={reloadKey}
      />
      {(region || regionId) && (
        <Button variant="outlined" onClick={handleBack} sx={{ mt: 2 }}>
          親リージョンへ戻る
        </Button>
      )}
    </Box>
  );
}

export default RegionListPage;
