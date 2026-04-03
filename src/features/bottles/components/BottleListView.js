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

export default function BottleListView(props) {
  const {
    isMobile,
    bottles,
    filteredBottles,
    filters,
    setFilterType,
    setFilterCountry,
    setFilterRow,
    setFilterOpened,
    resetFilters,
    viewMode,
    onViewModeChange: handleViewModeChange,
    onAddBottle: openCreateBottleModal,
    onAddWine: openCreateWineModal,
    showCreateBottleModal,
    closeCreateBottleModal,
    showCreateWineModal,
    closeCreateWineModal,
    form,
    setForm,
    creating,
    wines,
    onCreateBottleSubmit: handleCreateBottleSubmit,
    wineWithBottleForm,
    setWineWithBottleForm,
    creatingWineWithBottle,
    onCreateWineSubmit: handleCreateWineWithBottleSubmit,
    detailBottle,
    setDetailBottle,
    editId,
    editForm,
    onEditStart: handleEditStart,
    onEditChange: setEditForm,
    onEditSave: handleEditSave,
    onEditCancel,
    onDelete: handleDelete,
  } = props;

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
          onEditCancel={onEditCancel}
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
