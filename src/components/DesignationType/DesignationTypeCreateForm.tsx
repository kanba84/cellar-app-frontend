import React, { useEffect, useState } from "react";
import { fetchCountries } from "../../api/countryApi";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function DesignationTypeCreateForm({ form, creating, onChange, onSubmit }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, minWidth: 320 }}
    >
      <Typography variant="h6" gutterBottom>
        原産地統制呼称タイプの追加
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="名称"
          value={form.name || ""}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          required
        />
        <TextField
          label="コード"
          value={form.code || ""}
          onChange={(e) => onChange({ ...form, code: e.target.value })}
          required
        />
        <TextField
          label="ランク"
          type="number"
          value={form.rank || ""}
          onChange={(e) =>
            onChange({ ...form, rank: parseInt(e.target.value, 10) || "" })
          }
          required
        />
        <TextField
          select
          label="生産国"
          value={form.country_id || ""}
          onChange={(e) => onChange({ ...form, country_id: e.target.value })}
          required
        >
          <MenuItem value="">選択してください</MenuItem>
          {countries.map((country) => (
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

export default DesignationTypeCreateForm;
