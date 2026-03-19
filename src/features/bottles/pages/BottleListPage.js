import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Box, Typography, CircularProgress, Alert } from "@mui/material";

import BottleCreateForm from "../../../components/Bottle/BottleCreateForm";
import WineWithBottleCreateForm from "../../../components/Wine/WineWithBottleCreateForm";
import BottleStats from "../../../components/Bottle/BottleStats";
import BottleFilter from "../../../components/Bottle/BottleFilter";
import BottleAddButtons from "../../../components/Bottle/BottleAddButtons";
import BottleList from "../../../components/Bottle/BottleList";

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
    handleUpdate: apiUpdateBottle,
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

  const { form, setForm, creating, handleCreate: handleCreateBottle } =
    useBottleForm();

  const {
    editId,
    editForm,
    setEditForm,
    handleEditStart,
    handleEditSave: handleEditSaveHook,
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

  // ボトル追加の完全な処理
  const handleCreateBottleSubmit = async (e) => {
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
      await handleEditSaveHook(apiUpdateBottle, id, override);
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

      {/* ボトル一覧 */}
      <BottleList
        bottles={filteredBottles}
        isMobile={isMobile}
        editId={editId}
        editForm={editForm}
        onEditStart={handleEditStart}
        onEditChange={setEditForm}
        onEditSave={handleEditSave}
        onEditCancel={() => handleEditStart(null)}
        onDelete={handleDelete}
      />
    </Box>
  );
}

export default BottleListPage;
