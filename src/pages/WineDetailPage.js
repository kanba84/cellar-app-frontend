import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWineById, updateWine } from "../api/wineApi";
import { fetchWineTypes } from "../api/wineTypeApi";
import { fetchCountries } from "../api/countryApi";
import { fetchRegions } from "../api/regionApi";
import { fetchAppellations } from "../api/appellationApi";
import wineTypeColor from "../utils/wineUtils";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";

function WineDetailPage() {
  const { id } = useParams();
  const [wine, setWine] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  const [wineTypes, setWineTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [appellations, setAppellations] = useState([]);

  useEffect(() => {
    fetchWineById(id)
      .then((data) => {
        setWine(data);
        setEditForm(data);
      })
      .catch(() => setError("ワイン情報の取得に失敗しました"));
    fetchWineTypes().then(setWineTypes);
    fetchCountries().then(setCountries);
    fetchRegions().then(setRegions);
    fetchAppellations().then(setAppellations);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = [
      "wine_type_id",
      "country_id",
      "region_id",
      "vintage",
      "appellation_id",
    ].includes(name)
      ? value
        ? Number(value)
        : null
      : value;

    setEditForm((prev) => {
      const updated = { ...prev, [name]: parsedValue };

      // 国が変更されたら地域・アペラシオンをリセット
      if (name === "country_id") {
        updated.region_id = null;
        updated.appellation_id = null;
      }

      // 地域が変更されたらアペラシオンをリセット
      if (name === "region_id") {
        updated.appellation_id = null;
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 必要なフィールドだけを抽出
    const payload = {
      name: editForm.name || null,
      vintage: editForm.vintage ? Number(editForm.vintage) : null,
      wine_type_id: editForm.wine_type_id || null,
      country_id: editForm.country_id || null,
      region_id: editForm.region_id || null,
      appellation_id: editForm.appellation_id || null,
      producer: editForm.producer || null,
    };

    try {
      await updateWine(id, payload);
      const updated = await fetchWineById(id);
      setWine(updated);
      setEditForm(updated);
      setEditing(false);
      setError(null);
    } catch (err) {
      console.error(err); // デバッグ用
      setError("更新に失敗しました");
    }
  };

  const filteredRegions = editForm
    ? regions.filter((region) => region.country_id === editForm.country_id)
    : [];
  const filteredAppellations = editForm
    ? appellations.filter(
        (appellation) => appellation.region_id === editForm.region_id,
      )
    : [];

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!wine || !editForm) return <Typography>読み込み中...</Typography>;

  return (
    <Box maxWidth={500} mx="auto" mt={4}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* 見出しの色をタイプに応じて変更 */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: wineTypeColor[wine.wine_type_name] || "inherit",
            fontWeight: "bold",
          }}
        >
          {wine.name}
        </Typography>
        {!editing ? (
          <Box>
            {/* <Typography sx={{ mb: 1 }}>名前: {wine.name}</Typography> ← 削除 */}
            <Typography sx={{ mb: 1 }}>ヴィンテージ: {wine.vintage}</Typography>
            <Typography sx={{ mb: 1 }}>
              タイプ: {wine.wine_type_name}
            </Typography>
            <Typography sx={{ mb: 1 }}>生産国: {wine.country_name}</Typography>
            <Typography sx={{ mb: 1 }}>地域: {wine.region_name}</Typography>
            <Typography sx={{ mb: 1 }}>
              アペラシオン: {wine.appellation_name}
            </Typography>
            <Typography sx={{ mb: 2 }}>生産者: {wine.producer}</Typography>
            <Button variant="contained" onClick={() => setEditing(true)}>
              編集
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="名前"
                name="name"
                value={editForm.name || ""}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                label="ヴィンテージ"
                name="vintage"
                type="number"
                value={editForm.vintage || ""}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                select
                label="タイプ"
                name="wine_type_id"
                value={editForm.wine_type_id || ""}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="">
                  <em>選択してください</em>
                </MenuItem>
                {wineTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="生産国"
                name="country_id"
                value={editForm.country_id || ""}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="">
                  <em>選択してください</em>
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="地域"
                name="region_id"
                value={editForm.region_id || ""}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="">
                  <em>選択してください</em>
                </MenuItem>
                {filteredRegions.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="アペラシオン"
                name="appellation_id"
                value={editForm.appellation_id || ""}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="">
                  <em>選択してください</em>
                </MenuItem>
                {filteredAppellations.map((appellation) => (
                  <MenuItem key={appellation.id} value={appellation.id}>
                    {appellation.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="生産者"
                name="producer"
                value={editForm.producer || ""}
                onChange={handleChange}
                variant="outlined"
              />
              <Button type="submit" variant="contained">
                保存
              </Button>
              <Button
                type="button"
                onClick={() => setEditing(false)}
                variant="outlined"
              >
                キャンセル
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default WineDetailPage;
