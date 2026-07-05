import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchWineById, updateWine, fetchWineLLMInfo, type WineInfoResult } from "../api/wineApi";
import { fetchWineTypes } from "../api/wineTypeApi";
import { fetchCountries } from "../api/countryApi";
import { fetchRegions } from "../api/regionApi";
import { fetchAppellations } from "../api/appellationApi";
import type { Wine, WineGrape } from "../types/api/wine";
import wineTypeColor, { wineTypeColorLight } from "../utils/wineUtils";
import { buildImageUrl } from "@/utils/imageUtils";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";

function WineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const wineId = id ? Number(id) : undefined;
  const [wine, setWine] = useState<Wine | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<any>(null);

  const [wineTypes, setWineTypes] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [appellations, setAppellations] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // LLM補完関連のstate
  const [llmDialogOpen, setLlmDialogOpen] = useState(false);
  const [llmInfo, setLlmInfo] = useState<WineInfoResult | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<{
    producer: boolean;
    grapes: boolean;
    reference_price: boolean;
  }>({
    producer: false,
    grapes: false,
    reference_price: false,
  });

  const editFieldSx = {
    "& .MuiOutlinedInput-input": {
      color: "#2C2C2C",
      fontWeight: 500,
    },
    "& .MuiInputLabel-root": {
      color: "#665E5E",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#C8C1B5",
    },
  };

  useEffect(() => {
    if (!wineId) return;
    fetchWineById(wineId)
      .then((data) => {
        setWine(data);
        setEditForm(data);
      })
      .catch(() => setError("ワイン情報の取得に失敗しました"));
    fetchWineTypes().then(setWineTypes);
    fetchCountries().then(setCountries);
    fetchRegions().then(setRegions);
    fetchAppellations().then(setAppellations);
  }, [wineId]);

  // --- ポーリング監視用 useEffect ---
  useEffect(() => {
    if (!wine?.label_image_url) return;

    const isDummy = wine.label_image_url.includes("temp_thumbnail");
    if (isDummy && !pollingRef.current) {
      // まだ本物URLでないならポーリング開始
      pollingRef.current = setInterval(async () => {
        try {
          if (!wineId) return;
          const updated = await fetchWineById(wineId);
          setWine(updated);

          const nowReal = updated.label_image_url && !updated.label_image_url.includes("temp_thumbnail");
          if (nowReal) {
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
            }
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
  }, [wine?.label_image_url, wineId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const parsedValue = [
      "wine_type_id",
      "country_id",
      "region_id",
      "vintage",
      "appellation_id",
      "reference_price",
    ].includes(name)
      ? value
        ? (["reference_price"].includes(name) ? parseFloat(value) : Number(value))
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

  const handleSubmit = async (e: any) => {
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
      reference_price: editForm.reference_price != null && editForm.reference_price !== "" ? parseFloat(String(editForm.reference_price)) : null,
      wine_grapes: editForm.wine_grapes && editForm.wine_grapes.length > 0 ? editForm.wine_grapes : undefined,
    };

    try {
      if (!wineId) throw new Error("Wine ID is not available");
      await updateWine(wineId, payload);
      const updated = await fetchWineById(wineId);
      setWine(updated);
      setEditForm(updated);
      setEditing(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("更新に失敗しました");
    }
  };

  const handleLabelImageChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // --- JPEGに変換 ---
      const jpegBlob = await convertToJpeg(file, 0.85); // 品質85%

      // --- FormDataを作成 ---
      const formData = new FormData();
      formData.append("label_image", jpegBlob, "label.jpg");

      // --- PATCH送信 ---
      if (!wineId) throw new Error("Wine ID is not available");
      const response = await fetch(`https://cellar-app.local/api/wines/${wineId}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) throw new Error("画像アップロードに失敗しました");

      // ダミーURLが返るため一度再取得
      const updated = await fetchWineById(wineId);
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
  async function convertToJpeg(file: File, quality = 0.9): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }
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
        img.onerror = (e) => {
          console.error("Image load error:", e);
          reject(e);
        };
        img.src = (event.target?.result as string) || "";
      };

      reader.onerror = (e) => {
        console.error("FileReader error:", e);
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  }

  const handleSelectImageSource = () => {
    // モバイルでは "capture" 属性でカメラ選択が可能
    const input = fileInputRef.current;
    if (input) input.click();
  };

  // LLM補完ボタンのハンドラ
  const handleOpenLLMDialog = async () => {
    if (!wineId) return;

    setLlmLoading(true);
    setLlmError(null);
    setLlmInfo(null);
    setLlmDialogOpen(true);

    try {
      const info = await fetchWineLLMInfo(wineId);
      setLlmInfo(info);
    } catch (err) {
      console.error("LLM情報取得エラー:", err);
      setLlmError("AI補完情報の取得に失敗しました");
    } finally {
      setLlmLoading(false);
    }
  };

  // LLM情報取得をリトライ
  const handleRetryLLMInfo = async () => {
    if (!wineId) return;

    setLlmLoading(true);
    setLlmError(null);
    setLlmInfo(null);

    try {
      const info = await fetchWineLLMInfo(wineId);
      setLlmInfo(info);
    } catch (err) {
      console.error("LLM情報取得エラー:", err);
      setLlmError("AI補完情報の取得に失敗しました");
    } finally {
      setLlmLoading(false);
    }
  };

  // チェックボックス変更ハンドラ
  const handleLLMFieldChange = (field: keyof typeof selectedFields) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // LLM補完結果を適用
  const handleApplyLLMInfo = () => {
    if (!llmInfo) return;

    const updated = { ...editForm };

    if (selectedFields.producer && llmInfo.producer) {
      updated.producer = llmInfo.producer;
    }

    if (selectedFields.grapes && llmInfo.grapes && llmInfo.grapes.length > 0) {
      // LLMから返ってくるGrapeInfoを、WineGrapeDTO形式に変換
      updated.wine_grapes = llmInfo.grapes.map((grape, index) => ({
        name: grape.name,
        percentage: grape.percentage || null,
        display_order: index,
      }));
    }

    if (selectedFields.reference_price && llmInfo.reference_price_jpy) {
      updated.reference_price = llmInfo.reference_price_jpy;
    }

    setEditForm(updated);
    setLlmDialogOpen(false);
    setSelectedFields({
      producer: false,
      grapes: false,
      reference_price: false,
    });
  };

  // ブドウ品種を表示用文字列に変換
  const formatGrapes = (grapes: WineGrape[] | undefined): string => {
    if (!grapes || grapes.length === 0) return "—";
    return grapes
      .sort((a, b) => a.display_order - b.display_order)
      .map((grape) => {
        if (grape.percentage) {
          return `${grape.name} (${grape.percentage}%)`;
        }
        return grape.name;
      })
      .join(", ");
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
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#FDFCF0" }}>
        {/* ワイン名 + カラーバー */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: "4px",
              height: "1.5em",
              backgroundColor: wineTypeColor[wine.wine_type_name] || "#cccccc",
              flexShrink: 0,
              borderRadius: "1px",
              mt: "2px",
            }}
          />
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "#2C2C2C",
              fontWeight: "bold",
              mb: 0,
              flex: 1,
            }}
          >
            {wine.name}
          </Typography>
        </Box>
        {!editing ? (
          <Box>
            {/* 画像と右側情報を横並びに配置 */}
            <Box display="flex" alignItems="flex-start" mb={2} gap={3}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* ラベル画像 */}
                <Box
                  component="img"
                  src={
                    buildImageUrl(wine.label_image_url) ||
                    buildImageUrl("/labels/sample_thumbnail.png") ||
                    ""
                  }
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
                    color: "#665E5E",
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
                  accept="image/jpeg,image/png"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleLabelImageChange}
                />
              </Box>

              {/* ラベル画像の右に並ぶ項目 */}
              <Box>
                <Typography sx={{ mb: 1, color: "#665E5E" }}>
                  ヴィンテージ:{" "}
                  <Box component="span" sx={{ color: "#2C2C2C", fontWeight: 600 }}>
                    {wine.vintage ?? "—"}
                  </Box>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Typography sx={{ color: "#665E5E" }}>タイプ</Typography>
                  {wine.wine_type_name ? (
                    <Chip
                      label={wine.wine_type_name}
                      size="small"
                      sx={{
                        backgroundColor: wineTypeColorLight[wine.wine_type_name] || "#f0f0f0",
                        color: wineTypeColor[wine.wine_type_name] || "#666",
                        fontWeight: 600,
                        height: "24px",
                      }}
                    />
                  ) : (
                    <Typography sx={{ color: "#2C2C2C" }}>—</Typography>
                  )}
                </Box>

                <Typography sx={{ mb: 1, color: "#665E5E" }}>
                  生産国:{" "}
                  <Box component="span" sx={{ color: "#2C2C2C", fontWeight: 600 }}>
                    {wine.country_name ?? "—"}
                  </Box>
                </Typography>
                <Typography sx={{ mb: 1, color: "#665E5E" }}>
                  地域:{" "}
                  <Box component="span" sx={{ color: "#2C2C2C", fontWeight: 600 }}>
                    {wine.region_name ?? "—"}
                  </Box>
                </Typography>
              </Box>
            </Box>

            {/* 下段（地域・アペラシオン・生産者・参考価格・ブドウ品種） */}
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1, color: "#665E5E" }}>
                アペラシオン:{" "}
                <Box component="span" sx={{ color: "#2C2C2C", fontWeight: 600 }}>
                  {wine.appellation_name ?? "—"}
                </Box>
              </Typography>
              <Typography sx={{ mb: 1, color: "#665E5E" }}>
                生産者:{" "}
                <Box component="span" sx={{ color: "#2C2C2C", fontWeight: 600 }}>
                  {wine.producer ?? "—"}
                </Box>
              </Typography>
              <Typography sx={{ mb: 1, color: "#665E5E" }}>
                参考価格:{" "}
                <Box component="span" sx={{ color: "#2C2C2C", fontWeight: 600 }}>
                  {wine.reference_price ? `¥${wine.reference_price.toLocaleString()}` : "—"}
                </Box>
              </Typography>
              <Typography sx={{ mb: 1, color: "#665E5E" }}>
                ブドウ品種:{" "}
                <Box component="span" sx={{ color: "#2C2C2C", fontWeight: 600 }}>
                  {formatGrapes(wine.wine_grapes)}
                </Box>
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Typography sx={{ color: "#665E5E" }}>在庫</Typography>
                {typeof wine.has_stock !== "boolean" || typeof wine.stock_count !== "number" ? (
                  <Chip
                    label="在庫情報取得中"
                    size="small"
                    sx={{ bgcolor: "#EFE7DA", color: "#2C2C2C", fontWeight: 600 }}
                  />
                ) : wine.has_stock ? (
                  <Chip
                    label={`在庫 ${wine.stock_count}本`}
                    size="small"
                    sx={{ bgcolor: "#EFE7DA", color: "#2C2C2C", fontWeight: 600 }}
                  />
                ) : (
                  <Chip
                    label="在庫なし"
                    size="small"
                    sx={{ bgcolor: "#EFE7DA", color: "#2C2C2C", fontWeight: 600 }}
                  />
                )}
              </Box>
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
                sx={editFieldSx}
              />
              <TextField
                label="ヴィンテージ"
                name="vintage"
                type="number"
                value={editForm.vintage || ""}
                onChange={handleChange}
                variant="outlined"
                sx={editFieldSx}
              />
              <TextField
                select
                label="タイプ"
                name="wine_type_id"
                value={editForm.wine_type_id || ""}
                onChange={handleChange}
                variant="outlined"
                sx={editFieldSx}
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
                sx={editFieldSx}
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
                sx={editFieldSx}
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
                sx={editFieldSx}
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
                sx={editFieldSx}
              />
              <TextField
                label="参考価格（円）"
                name="reference_price"
                type="number"
                inputProps={{ step: "0.01" }}
                value={editForm.reference_price || ""}
                onChange={handleChange}
                variant="outlined"
                sx={editFieldSx}
              />
              <TextField
                label="ブドウ品種"
                name="wine_grapes_display"
                value={formatGrapes(editForm.wine_grapes)}
                disabled
                variant="outlined"
                sx={editFieldSx}
                helperText="下のボタンで自動補完またはAIで補完を使用して編集してください"
              />

              <Button
                type="button"
                variant="outlined"
                onClick={handleOpenLLMDialog}
                disabled={llmLoading}
              >
                {llmLoading ? <CircularProgress size={24} /> : "AIで情報を補完"}
              </Button>

              <Button type="submit" variant="contained">
                保存
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setEditForm(wine);
                  setEditing(false);
                  setError(null);
                }}
                variant="outlined"
              >
                キャンセル
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>

      {/* LLM補完ダイアログ */}
      <Dialog open={llmDialogOpen} onClose={() => setLlmDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>AIで情報を補完</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {llmError && (
            <Alert
              severity="error"
              action={
                <Button
                  size="small"
                  onClick={handleRetryLLMInfo}
                  disabled={llmLoading}
                  sx={{ color: "inherit" }}
                >
                  {llmLoading ? "再試行中..." : "再試行"}
                </Button>
              }
              sx={{ mb: 2 }}
            >
              {llmError}
            </Alert>
          )}
          {llmInfo && (
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFields.producer}
                    onChange={() => handleLLMFieldChange("producer")}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      生産者
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {llmInfo.producer || "未取得"}
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFields.grapes}
                    onChange={() => handleLLMFieldChange("grapes")}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ブドウ品種
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {llmInfo.grapes && llmInfo.grapes.length > 0
                        ? llmInfo.grapes
                          .map((g) => (g.percentage ? `${g.name} (${g.percentage}%)` : g.name))
                          .join(", ")
                        : "未取得"}
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFields.reference_price}
                    onChange={() => handleLLMFieldChange("reference_price")}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      参考価格（日本円）
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {llmInfo.reference_price_jpy
                        ? `¥${llmInfo.reference_price_jpy.toLocaleString()}`
                        : "未取得"}
                    </Typography>
                  </Box>
                }
              />

              {llmInfo.tasting_note && (
                <Box sx={{ pt: 1, borderTop: "1px solid #ddd" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    テイスティングノート
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic" }}>
                    {llmInfo.tasting_note}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLlmDialogOpen(false)}>キャンセル</Button>
          <Button
            onClick={handleApplyLLMInfo}
            variant="contained"
            disabled={!selectedFields.producer && !selectedFields.grapes && !selectedFields.reference_price}
          >
            適用
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WineDetailPage;
