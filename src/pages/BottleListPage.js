import { useEffect, useState } from "react";
import {
  fetchBottles,
  deleteBottle,
  createBottle,
  patchBottle,
} from "../api/bottleApi";
import { createWineWithBottle, fetchWines } from "../api/wineApi";

import BottleCreateForm from "../components/Bottle/BottleCreateForm";
import WineWithBottleCreateForm from "../components/Wine/WineWithBottleCreateForm";
import BottleStats from "../components/Bottle/BottleStats";
import BottleFilter from "../components/Bottle/BottleFilter";
import BottleAddButtons from "../components/Bottle/BottleAddButtons";
import BottleList from "../components/Bottle/BottleList";

import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Modalコンポーネントは共通利用のためここに残します
function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          padding: { xs: 2, sm: 3 },
          borderRadius: 2,
          minWidth: 320,
          width: { xs: "90%", sm: "auto" },
          fontSize: { xs: 14, sm: 16 }, // ← ここでフォントサイズが効く！
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            minWidth: 0,
            padding: 0,
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ×
        </Button>

        {children}
      </Paper>
    </Box>
  );
}

function BottleListPage() {
  const [bottles, setBottles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 編集用のstate
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    row_number: "",
    column_number: "",
    is_opened: false,
    note: "",
  });

  // 追加フォーム用のstate
  const [form, setForm] = useState({
    wine_id: "",
    row_number: "",
    column_number: "",
    note: "",
  });
  const [creating, setCreating] = useState(false);

  // ワイン＋ボトル同時追加フォーム
  const [wineWithBottleForm, setWineWithBottleForm] = useState({
    wine: {
      name: "",
      vintage: "",
      wine_type_id: "",
      country_id: "",
      region_id: "",
      producer: "",
    },
    bottle: {
      row_number: "",
      column_number: "",
      note: "",
    },
  });
  const [creatingWineWithBottle, setCreatingWineWithBottle] = useState(false);
  const [wines, setWines] = useState([]);

  const [showCreateBottleModal, setShowCreateBottleModal] = useState(false);
  const [showCreateWineModal, setShowCreateWineModal] = useState(false);

  // フィルター用のstate
  const [filterType, setFilterType] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterRow, setFilterRow] = useState("");
  const [filterOpened, setFilterOpened] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 一覧を取得
  const loadBottles = async () => {
    try {
      setLoading(true);
      const data = await fetchBottles();
      setBottles(data);
      setError(null);
    } catch (err) {
      setError("ボトル一覧の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBottles();
    fetchWines()
      .then(setWines)
      .catch(() => setWines([]));
  }, []);

  // 削除処理
  const handleDelete = async (id) => {
    if (!window.confirm("このボトルを削除しますか？")) return;
    try {
      await deleteBottle(id);
      await loadBottles();
      setBottles((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert("削除に失敗しました");
    }
  };

  // 追加処理
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const bottleData = {
        ...form,
        wine_id: form.wine_id ? Number(form.wine_id) : null,
        row_number: form.row_number ? Number(form.row_number) : null,
        column_number: form.column_number ? Number(form.column_number) : null,
      };
      const newBottle = await createBottle(bottleData);
      setBottles((prev) => [...prev, newBottle]);
      setForm({
        wine_id: "",
        row_number: "",
        column_number: "",
        is_opened: false,
        note: "",
      });
      await loadBottles();
    } catch (err) {
      alert("追加に失敗しました");
    } finally {
      setCreating(false);
    }
  };

  // 編集開始
  const handleEditStart = (bottle) => {
    setEditId(bottle.id);
    setEditForm({
      row_number: bottle.row_number,
      column_number: bottle.column_number,
      is_opened: bottle.is_opened,
      note: bottle.note || "",
    });
  };

  // 編集保存
  const handleEditSave = async (id, override) => {
    try {
      const updateData = override || editForm;
      const updated = await patchBottle(id, updateData);
      setBottles((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updated } : b)),
      );
      setEditId(null);
      await loadBottles();
    } catch (err) {
      alert("更新に失敗しました");
    }
  };

  // 編集キャンセル
  const handleEditCancel = () => {
    setEditId(null);
  };

  // ワイン追加処理
  const handleCreateWineWithBottle = async (e) => {
    e.preventDefault();
    setCreatingWineWithBottle(true); // 既存のstate名がこれなので流用

    try {
      const wine = wineWithBottleForm.wine;
      const bottle = wineWithBottleForm.bottle;

      const requestData = {
        wine: {
          name: wine.name,
          vintage: wine.vintage ? Number(wine.vintage) : null,
          wine_type_id: wine.wine_type_id ? Number(wine.wine_type_id) : null,
          country_id: wine.country_id ? Number(wine.country_id) : null,
          region_id: wine.region_id ? Number(wine.region_id) : null,
          producer: wine.producer,
        },
        bottle: {
          row_number: bottle.row_number ? Number(bottle.row_number) : null,
          column_number: bottle.column_number
            ? Number(bottle.column_number)
            : null,
          note: bottle.note || "",
        },
      };

      await createWineWithBottle(requestData); // API呼び出し

      alert("ワインとボトルを追加しました");

      // フォーム初期化
      setWineWithBottleForm({
        wine: {
          name: "",
          vintage: "",
          wine_type_id: "",
          country_id: "",
          region_id: "",
          producer: "",
        },
        bottle: {
          row_number: "",
          column_number: "",
          note: "",
        },
      });

      // ボトル一覧を更新
      await loadBottles();
    } catch (err) {
      alert("ワインとボトルの追加に失敗しました");
    } finally {
      setCreatingWineWithBottle(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) return <Alert severity="error">{error}</Alert>;

  const filteredBottles = bottles.filter((bottle) => {
    let ok = true;
    if (filterType) ok = ok && bottle.wine?.wine_type_name === filterType;
    if (filterCountry) ok = ok && bottle.wine?.country_name === filterCountry;
    if (filterRow) ok = ok && String(bottle.row_number) === String(filterRow);
    if (filterOpened === "opened") ok = ok && bottle.is_opened;
    if (filterOpened === "unopened") ok = ok && !bottle.is_opened;
    return ok;
  });

  return (
    <Box px={isMobile ? 0.5 : 2}>
      <Typography variant="h4" gutterBottom fontSize={isMobile ? 22 : 32}>
        ボトル一覧
      </Typography>
      {/* ボトル総数・タイプごとの本数表示 */}
      <BottleStats bottles={bottles} />

      {/* フィルターUI */}
      <BottleFilter
        bottles={bottles}
        isMobile={isMobile}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCountry={filterCountry}
        setFilterCountry={setFilterCountry}
        filterRow={filterRow}
        setFilterRow={setFilterRow}
        filterOpened={filterOpened}
        setFilterOpened={setFilterOpened}
      />

      {/* 追加ボタン */}
      <BottleAddButtons
        isMobile={isMobile}
        onAddBottle={() => setShowCreateBottleModal(true)}
        onAddWine={() => setShowCreateWineModal(true)}
      />

      {/* ワイン追加モーダル */}
      <Modal
        open={showCreateWineModal}
        onClose={() => setShowCreateWineModal(false)}
      >
        <WineWithBottleCreateForm
          form={wineWithBottleForm}
          creating={creatingWineWithBottle}
          onChange={setWineWithBottleForm}
          onSubmit={async (e) => {
            await handleCreateWineWithBottle(e);
            setShowCreateWineModal(false);
          }}
        />
      </Modal>

      {/* ボトル追加モーダル */}
      <Modal
        open={showCreateBottleModal}
        onClose={() => setShowCreateBottleModal(false)}
      >
        <BottleCreateForm
          form={form}
          wines={wines}
          creating={creating}
          onChange={setForm}
          onSubmit={async (e) => {
            await handleCreate(e);
            setShowCreateBottleModal(false);
          }}
        />
      </Modal>

      {/* ボトル一覧 */}
      <BottleList
        bottles={filteredBottles}
        isMobile={isMobile}
        editId={editId}
        editForm={editForm}
        onEditStart={handleEditStart}
        onEditChange={setEditForm}
        onEditSave={handleEditSave}
        onEditCancel={handleEditCancel}
        onDelete={handleDelete}
      />
    </Box>
  );
}

export default BottleListPage;
