import React from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

import BottleStats from "./BottleStats";
import BottleFilter from "./BottleFilter";
import BottleAddButtons from "./BottleAddButtons";
import BottleList from "./BottleList";
import CellarVisualizer from "./CellarVisualizer";
import BottleDetailModal from "./BottleDetailModal";
import { Modal } from "./Modal";
import BottleCreateForm from "./BottleCreateForm";
import WineWithBottleCreateForm from "../../../components/Wine/WineWithBottleCreateForm";

export default function BottleListView({
  dataProps,
  filterProps,
  createProps,
  editProps,
  modalProps,
  uiProps,
}) {
  /* データ系 */
  const { bottles, filteredBottles, wines } = dataProps;

  /* フィルター系 */
  const {
    filters,
    setFilterType,
    setFilterCountry,
    setFilterRow,
    setFilterOpened,
    resetFilters,
  } = filterProps;

  /* 作成系 */
  const {
    form,
    setForm,
    creating,
    onCreateBottleSubmit,
    wineWithBottleForm,
    setWineWithBottleForm,
    creatingWineWithBottle,
    onCreateWineSubmit,
  } = createProps;

  /* 編集系 */
  const {
    editId,
    editForm,
    onEditStart,
    onEditChange,
    onEditSave,
    onEditCancel,
    onDelete,
  } = editProps;

  /* モーダル系 */
  const {
    showCreateBottleModal,
    closeCreateBottleModal,
    showCreateWineModal,
    closeCreateWineModal,
  } = modalProps;

  /* UI状態 */
  const {
    isMobile,
    viewMode,
    onViewModeChange,
    detailBottle,
    setDetailBottle,
    onAddBottle,
    onAddWine,
  } = uiProps;

  return (
    <Box px={isMobile ? 0.5 : 2}>
      {/* ヘッダー */}
      <Typography variant="h4" gutterBottom fontSize={isMobile ? 22 : 32}>
        ボトル一覧
      </Typography>

      {/* 統計 */}
      <BottleStats bottles={bottles} />

      {/* フィルター */}
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

      {/* 表示モード切替 */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
          my: 1.5,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          表示
        </Typography>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={onViewModeChange}
          size={isMobile ? "small" : "medium"}
        >
          <ToggleButton value="list">
            <ViewListIcon sx={{ mr: 0.5, fontSize: 20 }} />
            リスト
          </ToggleButton>

          <ToggleButton value="visual">
            <ViewModuleIcon sx={{ mr: 0.5, fontSize: 20 }} />
            セラー
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* 追加ボタン */}
      <BottleAddButtons
        isMobile={isMobile}
        onAddBottle={onAddBottle}
        onAddWine={onAddWine}
      />

      {/* モーダル群 */}

      {/* ワイン + ボトル作成モーダル */}
      <Modal open={showCreateWineModal} onClose={closeCreateWineModal}>
        <WineWithBottleCreateForm
          form={wineWithBottleForm}
          creating={creatingWineWithBottle}
          onChange={setWineWithBottleForm}
          onSubmit={onCreateWineSubmit}
        />
      </Modal>

      {/* ボトル作成モーダル */}
      <Modal open={showCreateBottleModal} onClose={closeCreateBottleModal}>
        <BottleCreateForm
          form={form}
          wines={wines}
          creating={creating}
          onChange={setForm}
          onSubmit={onCreateBottleSubmit}
        />
      </Modal>

      {/* 詳細モーダル */}
      <BottleDetailModal
        open={!!detailBottle}
        bottle={detailBottle}
        onClose={() => setDetailBottle(null)}
      />

      {/* メイン表示 */}
      {viewMode === "list" ? (
        <BottleList
          bottles={filteredBottles}
          isMobile={isMobile}
          onBottleDetail={setDetailBottle}
          editId={editId}
          editForm={editForm}
          onEditStart={onEditStart}
          onEditChange={onEditChange}
          onEditSave={onEditSave}
          onEditCancel={onEditCancel}
          onDelete={onDelete}
        />
      ) : (
        <CellarVisualizer
          bottles={filteredBottles}
          onBottleSelect={setDetailBottle}
        />
      )}
    </Box>
  );
}
