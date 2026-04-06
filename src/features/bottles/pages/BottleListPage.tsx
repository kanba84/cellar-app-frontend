import { Box, CircularProgress, Alert, Snackbar } from "@mui/material";

import {
  useBottles,
  useBottleFilter,
  useBottleForm,
  useBottleEdit,
  useBottleActions,
  useBottleUI,
  useWineWithBottleForm,
  useNotification,
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
    refresh,
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

  const { notification, showNotification, closeNotification } =
    useNotification();

  const {
    handleCreateBottleSubmit,
    handleEditSave: apiEditSave,
    handleCreateWineWithBottleSubmit,
  } = useBottleActions({
    // 単体作成: 保存後に refresh を呼ぶ
    createBottleApi: async (data) => {
      const res = await apiCreateBottle(data);
      await refresh();
      return res;
    },
    // 更新: 保存後に refresh を呼ぶ
    updateBottleApi: async (id, data) => {
      const res = await handleUpdateBottle(id, data);
      await refresh();
      return res;
    },
    submitCreateBottle: handleCreateBottle,
    // ワイン＋ボトル同時作成: 成功後に refresh を呼ぶ
    submitCreateWineWithBottle: async () => {
      // handleCreateWineWithBottle は FormEvent 不要で直接呼び出す
      const res = await handleCreateWineWithBottle(undefined as any);
      if (res) await refresh();
      return res;
    },
    closeCreateBottleModal,
    closeCreateWineModal,
    showNotification,
  });

  // 保存処理の完了後に編集モードを閉じるための調整
  const onEditSave = async (id: number, data: Partial<import('@/types/api/bottle').Bottle>) => {
    // 修正後の handleEditSave は成功時に値、失敗時に null を返します
    const result = await apiEditSave(id, data);

    // 成功した場合のみ編集モードを終了（editId を null に）する
    if (result !== null) {
      handleEditStart(null);
    }
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
    <>
      <BottleListView
        bottleProps={bottleProps}
        filterProps={filterProps}
        modalProps={modalProps}
        uiProps={uiProps}
      />
      {/* 通知を表示するコンポーネントを追加 */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default BottleListPage;
