import { Box, CircularProgress, Alert } from "@mui/material";

import {
  useBottles,
  useBottleFilter,
  useBottleForm,
  useBottleEdit,
  useBottleActions,
  useBottleUI,
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
    handleEditStart, //handleEditSave
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

  const {
    isMobile,
    viewMode,
    detailBottle,
    setDetailBottle,
    closeDetail,
    handleViewModeChange,
  } = useBottleUI();

  const {
    handleCreateBottleSubmit,
    handleEditSave: apiEditSave,
    handleCreateWineWithBottleSubmit,
  } = useBottleActions({
    createBottleApi: apiCreateBottle,
    updateBottleApi: handleUpdateBottle,
    submitCreateBottle: handleCreateBottle,
    submitCreateWineWithBottle: handleCreateWineWithBottle,
    closeCreateBottleModal,
    closeCreateWineModal,
  });

  // 保存処理のラッパー：API実行後に編集モードを終了させる
  const onEditSave = async (id, form) => {
    await apiEditSave(id, form);
    handleEditStart(null); // ここで editId を null にして元の表示に戻す
  };

  // props
  const bottleProps = {
    bottles,
    filteredBottles,
    wines,

    form,
    setForm,
    creating,
    onCreateBottle: handleCreateBottleSubmit,

    wineWithBottleForm,
    setWineWithBottleForm,
    creatingWineWithBottle,
    onCreateWine: handleCreateWineWithBottleSubmit,

    editId,
    editForm,
    onEditStart: handleEditStart,
    onEditChange: setEditForm,
    onEditSave: onEditSave,
    onEditCancel: () => handleEditStart(null),
    onDelete: handleDelete,
  };

  const filterProps = {
    filters,
    onFilterTypeChange: setFilterType,
    onFilterCountryChange: setFilterCountry,
    onFilterRowChange: setFilterRow,
    onFilterOpenedChange: setFilterOpened,
    onResetFilters: resetFilters,
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
    closeDetail,
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
      bottleProps={bottleProps}
      filterProps={filterProps}
      modalProps={modalProps}
      uiProps={uiProps}
    />
  );
}

export default BottleListPage;
