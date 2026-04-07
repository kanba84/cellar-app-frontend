import { useEffect, useState } from "react";
//import { fetchCountries } from '../../api/countryApi';
import { fetchRegions } from "../../api/regionApi";
import { fetchDesignationTypes } from "../../api/designationTypeApi";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function AppellationCreateForm({
  appellationForm,
  creating,
  onChange,
  onSubmit,
}: any) {
  const [designationTypes, setDesignationTypes] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  useEffect(() => {
    fetchDesignationTypes().then(setDesignationTypes);
    fetchRegions().then(setRegions);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // フォームの標準動作を防止
    onSubmit(e); // イベントを親に渡す
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, minWidth: 320 }}
    >
      <Typography variant="h6" gutterBottom>
        アペラシオン新規追加
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="アペラシオン名"
          value={appellationForm.name}
          onChange={(e) =>
            onChange({ ...appellationForm, name: e.target.value })
          }
          required
        />
        <TextField
          select
          label="原産地統制呼称タイプ"
          value={appellationForm.designation_type_id || ""}
          onChange={(e) =>
            onChange({
              ...appellationForm,
              designation_type_id: e.target.value,
            })
          }
          required
        >
          <MenuItem value="">選択してください</MenuItem>
          {designationTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="地域"
          value={appellationForm.region_id || ""}
          onChange={(e) =>
            onChange({ ...appellationForm, region_id: e.target.value })
          }
          required
        >
          <MenuItem value="">選択してください</MenuItem>
          {regions.map((country) => (
            <MenuItem key={country.id} value={country.id}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={creating}
        >
          {creating ? "追加中..." : "追加"}
        </Button>
      </Stack>
    </Box>
  );
}

export default AppellationCreateForm;
