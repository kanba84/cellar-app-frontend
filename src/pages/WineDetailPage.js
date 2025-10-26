import React, { useEffect, useState, useRef} from "react";
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

  const fileInputRef = useRef(null); // ファイル入力を制御するref
  const pollingRef = useRef(null); // ポーリング用のref

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

  // --- ポーリング監視用 useEffect ---
useEffect(() => {
    if (!wine?.label_image_url) return;

    const isDummy = wine.label_image_url.includes("temp_thumbnail");
    if (isDummy && !pollingRef.current) {
      // まだ本物URLでないならポーリング開始
      pollingRef.current = setInterval(async () => {
        try {
          const updated = await fetchWineById(id);
          setWine(updated);

          const nowReal = updated.label_image_url && !updated.label_image_url.includes("temp_thumbnail");
          if (nowReal) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        } catch (err) {
          console.warn("Polling failed:", err);
        }
      }, 3000); // 3秒ごとに再取得
    }

    // クリーンアップ
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [wine?.label_image_url, id]);

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

  const handleLabelImageChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // --- JPEGに変換 ---
    const jpegBlob = await convertToJpeg(file, 0.85); // 品質85%

    // --- FormDataを作成 ---
    const formData = new FormData();
    formData.append("label_image", jpegBlob, "label.jpg");

    // --- PATCH送信 ---
    const response = await fetch(`https://192.168.11.26:8443/wines/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) throw new Error("画像アップロードに失敗しました");

    // ダミーURLが返るため一度再取得
    const updated = await fetchWineById(id);
    setWine(updated);
  } catch (err) {
    console.error(err);
    setError("画像アップロードに失敗しました");
  }
};

/**
 * 画像ファイルをJPEGに変換するユーティリティ
 * @param {File} file - 入力ファイル
 * @param {number} quality - 0〜1 (JPEG圧縮品質)
 * @returns {Promise<Blob>} JPEG Blob
 */
async function convertToJpeg(file, quality = 0.9) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("JPEG変換に失敗しました"));
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = reject;
      img.src = event.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


  const handleSelectImageSource = () => {
    // モバイルでは "capture" 属性でカメラ選択が可能
    const input = fileInputRef.current;
    if (input) input.click();
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
            {/* 画像と右側情報を横並びに配置 */}
            <Box display="flex" alignItems="flex-start" mb={2} gap={3}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* ラベル画像 */}
                <Box
                  component="img"
                  src={wine.label_image_url || "https://192.168.11.26/labels/sample_thumbnail.png"}
                  alt={`${wine.name} label`}
                  sx={{
                    width: 120,
                    height: "auto",
                    borderRadius: 2,
                    objectFit: "cover",
                    boxShadow: 1,
                  }}
                />

                {/* 画像変更リンク */}
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontSize: "0.8rem",
                    color: "text.secondary",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={handleSelectImageSource}
                >
                  ラベル画像を変更
                </Typography>

                {/* 非表示のファイル入力 */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleLabelImageChange}
                />
              </Box>

              {/* ラベル画像の右に並ぶ項目 */}
              <Box>
                <Typography sx={{ mb: 1 }}>ヴィンテージ: {wine.vintage}</Typography>
                <Typography sx={{ mb: 1 }}>タイプ: {wine.wine_type_name}</Typography>
                <Typography sx={{ mb: 1 }}>生産国: {wine.country_name}</Typography>
                <Typography sx={{ mb: 1 }}>地域: {wine.region_name}</Typography>
              </Box>
            </Box>

            {/* 下段（地域・アペラシオン・生産者） */}
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1 }}>アペラシオン: {wine.appellation_name}</Typography>
              <Typography sx={{ mb: 2 }}>生産者: {wine.producer}</Typography>
            </Box>

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
