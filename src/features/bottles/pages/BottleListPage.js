import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Box, CircularProgress, Alert } from "@mui/material";

import { isPositionOccupiedError } from "../utils/apiError";
import {
  useBottles,
  useBottleFilter,
  useBottleForm,
  useBottleEdit,
  useWineWithBottleForm,
  useModal,
  useWines,
} from "../hooks";
import BottleListView from "../components/BottleListView";

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

  const handleApiError = (err) => {
    if (isPositionOccupiedError(err)) {
      alert("その棚位置はすでに使用されています");
      return true;
    }
    alert("更新に失敗しました");
    return false;
  };

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
      if (handleApiError(err)) return;
    }
  };

  // ボトル編集保存の完全な処理
  const handleEditSave = async (id, override) => {
    try {
      await hookHandleEditSave(handleUpdateBottle, id, override);
    } catch (err) {
      if (handleApiError(err)) return;
    }
  };

  // ワイン追加の完全な処理
  const handleCreateWineWithBottleSubmit = async (e) => {
    try {
      await handleCreateWineWithBottle(e);
      closeCreateWineModal();
    } catch (err) {
      if (handleApiError(err)) return;
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
    <BottleListView
      isMobile={isMobile}
      bottles={bottles}
      filteredBottles={filteredBottles}
      filters={filters}
      setFilterType={setFilterType}
      setFilterCountry={setFilterCountry}
      setFilterRow={setFilterRow}
      setFilterOpened={setFilterOpened}
      resetFilters={resetFilters}
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
      onAddBottle={openCreateBottleModal}
      onAddWine={openCreateWineModal}
      showCreateBottleModal={showCreateBottleModal}
      closeCreateBottleModal={closeCreateBottleModal}
      showCreateWineModal={showCreateWineModal}
      closeCreateWineModal={closeCreateWineModal}
      form={form}
      setForm={setForm}
      creating={creating}
      wines={wines}
      onCreateBottleSubmit={handleCreateBottleSubmit}
      wineWithBottleForm={wineWithBottleForm}
      setWineWithBottleForm={setWineWithBottleForm}
      creatingWineWithBottle={creatingWineWithBottle}
      onCreateWineSubmit={handleCreateWineWithBottleSubmit}
      detailBottle={detailBottle}
      setDetailBottle={setDetailBottle}
      editId={editId}
      editForm={editForm}
      onEditStart={handleEditStart}
      onEditChange={setEditForm}
      onEditSave={handleEditSave}
      onEditCancel={() => handleEditStart(null)}
      onDelete={handleDelete}
    />
  );
}

export default BottleListPage;
