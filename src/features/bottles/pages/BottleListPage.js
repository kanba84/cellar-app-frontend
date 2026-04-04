import { useState, useMemo } from "react";
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

  const handleViewModeChange = (_event, next) => {
    if (next !== null) setViewMode(next);
  };

  const executeWithErrorHandling = async (fn, onSuccess) => {
    try {
      await fn();
      if (onSuccess) onSuccess();
    } catch (err) {
      handleApiError(err);
    }
  };
  const handleApiError = (err) => {
    if (isPositionOccupiedError(err)) {
      alert("その棚位置はすでに使用されています");
      return true;
    }
    alert("更新に失敗しました");
    return false;
  };

  // ボトル追加の完全な処理
  const handleCreateBottleSubmit = async (e) => {
    e.preventDefault();
    executeWithErrorHandling(
      () => handleCreateBottle(apiCreateBottle),
      closeCreateBottleModal,
    );
  };

  // ボトル編集保存の完全な処理
  const handleEditSave = async (id, override) => {
    executeWithErrorHandling(() =>
      hookHandleEditSave(handleUpdateBottle, id, override),
    );
  };

  // ワイン追加の完全な処理
  const handleCreateWineWithBottleSubmit = async (e) => {
    executeWithErrorHandling(
      () => handleCreateWineWithBottle(e),
      closeCreateWineModal,
    );
  };

  // props
  const dataProps = useMemo(
    () => ({
      bottles,
      filteredBottles,
      wines,
    }),
    [bottles, filteredBottles, wines],
  );

  const filterProps = {
    filters,
    setFilterType,
    setFilterCountry,
    setFilterRow,
    setFilterOpened,
    resetFilters,
  };

  const createProps = {
    form,
    setForm,
    creating,
    onCreateBottleSubmit: handleCreateBottleSubmit,
    wineWithBottleForm,
    setWineWithBottleForm,
    creatingWineWithBottle,
    onCreateWineSubmit: handleCreateWineWithBottleSubmit,
  };

  const editProps = {
    editId,
    editForm,
    onEditStart: handleEditStart,
    onEditChange: setEditForm,
    onEditSave: handleEditSave,
    onEditCancel: () => handleEditStart(null),
    onDelete: handleDelete,
  };

  const modalProps = {
    showCreateBottleModal,
    closeCreateBottleModal,
    showCreateWineModal,
    closeCreateWineModal,
  };

  const uiProps = {
    isMobile,
    viewMode,
    onViewModeChange: handleViewModeChange,
    detailBottle,
    setDetailBottle,
    onAddBottle: openCreateBottleModal,
    onAddWine: openCreateWineModal,
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
      dataProps={dataProps}
      filterProps={filterProps}
      createProps={createProps}
      editProps={editProps}
      modalProps={modalProps}
      uiProps={uiProps}
    />
  );
}

export default BottleListPage;
