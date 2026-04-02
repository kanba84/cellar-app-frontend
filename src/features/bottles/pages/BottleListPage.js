import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  useMediaQuery,
  Box,
  Typography,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

import BottleCreateForm from "../../../components/Bottle/BottleCreateForm";
import WineWithBottleCreateForm from "../../../components/Wine/WineWithBottleCreateForm";
import BottleStats from "../../../components/Bottle/BottleStats";
import BottleFilter from "../../../components/Bottle/BottleFilter";
import BottleAddButtons from "../../../components/Bottle/BottleAddButtons";
import BottleList from "../../../components/Bottle/BottleList";
import CellarVisualizer from "../../../components/Bottle/CellarVisualizer";
import BottleDetailModal from "../../../components/Bottle/BottleDetailModal";

import { Modal } from "../components/Modal";
import {
  useBottles,
  useBottleFilter,
  useBottleForm,
  useBottleEdit,
  useWineWithBottleForm,
  useModal,
  useWines,
} from "../hooks";

function BottleListPage() {
  // カスタムフックの使用
  const {
    bottles,
    loading,
    error,
    handleDelete,
    handleCreate: apiCreateBottle,
    handleUpdate: handleUpdateBottle,
  } = useBottles();

  const {
    filters,
    setFilterType,
    setFilterCountry,
    setFilterRow,
    setFilterOpened,
    filteredBottles,
    resetFilters,
  } = useBottleFilter(bottles);

  const {
    form,
    setForm,
    creating,
    handleCreate: handleCreateBottle,
  } = useBottleForm();

  const {
    editId,
    editForm,
    setEditForm,
    handleEditStart,
    handleEditSave: hookHandleEditSave,
  } = useBottleEdit();

  const {
    wineWithBottleForm,
    setWineWithBottleForm,
    creatingWineWithBottle,
    handleCreate: handleCreateWineWithBottle,
  } = useWineWithBottleForm();

  const {
    showCreateBottleModal,
    openCreateBottleModal,
    closeCreateBottleModal,
    showCreateWineModal,
    openCreateWineModal,
    closeCreateWineModal,
  } = useModal();

  const { wines } = useWines();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [viewMode, setViewMode] = useState("list");
  const [detailBottle, setDetailBottle] = useState(null);

  const handleViewModeChange = (_event, next) => {
    if (next !== null) setViewMode(next);
  };

  // ボトル追加の完全な処理
  const handleCreateBottleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleCreateBottle(apiCreateBottle);
      closeCreateBottleModal();
    } catch (err) {
      alert(err.message);
    }
  };

  // ボトル編集保存の完全な処理
  const handleEditSave = async (id, override) => {
    try {
      await hookHandleEditSave(handleUpdateBottle, id, override);
    } catch (err) {
      alert(err.message);
    }
  };

  // ワイン追加の完全な処理
  const handleCreateWineWithBottleSubmit = async (e) => {
    try {
      await handleCreateWineWithBottle(e);
      closeCreateWineModal();
    } catch (err) {
      alert(err.message);
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

  return (
    <Box px={isMobile ? 0.5 : 2}>
      <Typography variant="h4" gutterBottom fontSize={isMobile ? 22 : 32}>
        ボトル一覧
      </Typography>

      {/* ボトル総数・タイプごとの本数表示 */}
      <BottleStats bottles={bottles} />

      {/* フィルターUI */}
      <BottleFilter
        filters={filters}
        setFilterType={setFilterType}
        setFilterCountry={setFilterCountry}
        setFilterRow={setFilterRow}
        setFilterOpened={setFilterOpened}
        resetFilters={resetFilters}
        bottles={bottles}
        isMobile={isMobile}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
          my: 1.5,
        }}
      >
        <Typography variant="body2" color="text.secondary" component="span">
          表示
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="ボトル一覧の表示モード"
          size={isMobile ? "small" : "medium"}
        >
          <ToggleButton value="list" aria-label="リスト表示">
            <ViewListIcon sx={{ mr: 0.5, fontSize: 20 }} />
            リスト
          </ToggleButton>
          <ToggleButton value="visual" aria-label="セラー外観">
            <ViewModuleIcon sx={{ mr: 0.5, fontSize: 20 }} />
            セラー
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* 追加ボタン */}
      <BottleAddButtons
        isMobile={isMobile}
        onAddBottle={openCreateBottleModal}
        onAddWine={openCreateWineModal}
      />

      {/* ワイン追加モーダル */}
      <Modal open={showCreateWineModal} onClose={closeCreateWineModal}>
        <WineWithBottleCreateForm
          form={wineWithBottleForm}
          creating={creatingWineWithBottle}
          onChange={setWineWithBottleForm}
          onSubmit={handleCreateWineWithBottleSubmit}
        />
      </Modal>

      {/* ボトル追加モーダル */}
      <Modal open={showCreateBottleModal} onClose={closeCreateBottleModal}>
        <BottleCreateForm
          form={form}
          wines={wines}
          creating={creating}
          onChange={setForm}
          onSubmit={handleCreateBottleSubmit}
        />
      </Modal>

      <BottleDetailModal
        open={!!detailBottle}
        bottle={detailBottle}
        onClose={() => setDetailBottle(null)}
      />

      {/* ボトル一覧 / セラー外観 */}
      {viewMode === "list" ? (
        <BottleList
          bottles={filteredBottles}
          isMobile={isMobile}
          onBottleDetail={(b) => setDetailBottle(b)}
          editId={editId}
          editForm={editForm}
          onEditStart={handleEditStart}
          onEditChange={setEditForm}
          onEditSave={handleEditSave}
          onEditCancel={() => handleEditStart(null)}
          onDelete={handleDelete}
        />
      ) : (
        <CellarVisualizer
          bottles={filteredBottles}
          onBottleSelect={(b) => setDetailBottle(b)}
        />
      )}
    </Box>
  );
}

export default BottleListPage;
