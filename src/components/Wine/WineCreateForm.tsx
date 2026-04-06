import React, { useEffect, useState } from "react";
import { fetchCountries } from "../../api/countryApi";
import { fetchRegions } from "../../api/regionApi";
import { fetchWineTypes } from "../../api/wineTypeApi";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function WineCreateForm({
  wineForm,
  creatingWine,
  onChange,
  onSubmit,
  showSubmitButton = true,
}) {
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [wineTypes, setWineTypes] = useState([]);

  const filteredRegions = regions.filter(
    (region) => region.country_id === wineForm.country_id,
  );

  useEffect(() => {
    fetchCountries().then(setCountries);
    fetchRegions().then(setRegions);
    fetchWineTypes().then(setWineTypes);
  }, []);

  const inputFontSize = { xs: 13, sm: 16 };

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, minWidth: 320 }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontSize: inputFontSize }}>
        ワイン新規追加
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="ワイン名"
          value={wineForm.name}
          onChange={(e) => onChange({ ...wineForm, name: e.target.value })}
          required
          size="small"
          InputProps={{ sx: { fontSize: inputFontSize } }}
          InputLabelProps={{ sx: { fontSize: inputFontSize } }}
        />
        <TextField
          select
          label="ヴィンテージ"
          value={wineForm.vintage || ""}
          size="small"
          onChange={(e) => onChange({ ...wineForm, vintage: e.target.value })}
          InputProps={{ sx: { fontSize: inputFontSize } }}
          InputLabelProps={{ sx: { fontSize: inputFontSize } }}
        >
          <MenuItem value="" sx={{ fontSize: inputFontSize }}>
            選択してください
          </MenuItem>
          {Array.from(
            { length: new Date().getFullYear() - 1900 + 1 },
            (_, i) => new Date().getFullYear() - i,
          ).map((year) => (
            <MenuItem key={year} value={year} sx={{ fontSize: inputFontSize }}>
              {year}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="タイプ"
          value={wineForm.wine_type_id || ""}
          onChange={(e) =>
            onChange({ ...wineForm, wine_type_id: e.target.value })
          }
          required
          size="small"
          InputProps={{ sx: { fontSize: inputFontSize } }}
          InputLabelProps={{ sx: { fontSize: inputFontSize } }}
        >
          <MenuItem value="" sx={{ fontSize: inputFontSize }}>
            選択してください
          </MenuItem>
          {wineTypes.map((type) => (
            <MenuItem
              key={type.id}
              value={type.id}
              sx={{ fontSize: inputFontSize }}
            >
              {type.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="生産国"
          value={wineForm.country_id || ""}
          onChange={(e) => {
            const newCountryId = e.target.value;
            onChange({
              ...wineForm,
              country_id: newCountryId,
              region_id: "", // 国を変更したら地域をリセット
            });
          }}
          required
          size="small"
          InputProps={{ sx: { fontSize: inputFontSize } }}
          InputLabelProps={{ sx: { fontSize: inputFontSize } }}
        >
          <MenuItem value="" sx={{ fontSize: inputFontSize }}>
            選択してください
          </MenuItem>
          {countries.map((country) => (
            <MenuItem
              key={country.id}
              value={country.id}
              sx={{ fontSize: inputFontSize }}
            >
              {country.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="地域"
          value={wineForm.region_id || ""}
          onChange={(e) => onChange({ ...wineForm, region_id: e.target.value })}
          disabled={!wineForm.country_id}
          size="small"
          InputProps={{ sx: { fontSize: inputFontSize } }}
          InputLabelProps={{ sx: { fontSize: inputFontSize } }}
        >
          <MenuItem value="" sx={{ fontSize: inputFontSize }}>
            選択してください
          </MenuItem>
          {filteredRegions.map((region) => (
            <MenuItem
              key={region.id}
              value={region.id}
              sx={{ fontSize: inputFontSize }}
            >
              {region.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="生産者"
          value={wineForm.producer}
          size="small"
          onChange={(e) => onChange({ ...wineForm, producer: e.target.value })}
          InputProps={{ sx: { fontSize: inputFontSize } }}
          InputLabelProps={{ sx: { fontSize: inputFontSize } }}
        />
        {showSubmitButton && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={creatingWine}
            sx={{ fontSize: inputFontSize }}
          >
            {creatingWine ? "追加中..." : "追加"}
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default WineCreateForm;
