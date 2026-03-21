import React, { useState } from "react";
import { createAppellation, deleteAppellation } from "../../api/appellationApi";

import {
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
} from "@mui/material";

import AppellationCreateForm from "./AppellationCreateForm";

function AppellationList({ appellations, onAppellationChanged }) {
  const [appellationForm, setAppellationForm] = useState({
    name: "",
    designation_type_id: "",
    region_id: "",
  });
  const [deletingId, setDeletingId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("このアペラシオンを削除しますか？")) return;
    setDeletingId(id);
    try {
      await deleteAppellation(id);
      if (onAppellationChanged) onAppellationChanged();
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async (data) => {
    setAdding(true);
    try {
      await createAppellation(data);
      setAppellationForm({
        name: "",
        designation_type_id: "",
        region_id: "",
      });
      setCreateModalOpen(false);
      if (onAppellationChanged) onAppellationChanged();
    } finally {
      setAdding(false);
    }
  };

  if (!appellations) {
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateModalOpen(true)}
        >
          追加
        </Button>
      </Box>

      <List>
        {appellations.map((appellation) => (
          <ListItem
            key={appellation.id}
            secondaryAction={
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(appellation.id)}
                disabled={deletingId === appellation.id}
              >
                {deletingId === appellation.id ? "削除中..." : "削除"}
              </Button>
            }
          >
            <ListItemText primary={appellation.name} />
          </ListItem>
        ))}
      </List>

      {createModalOpen && (
        <AppellationCreateForm
          appellationForm={appellationForm}
          creatingWine={adding}
          onChange={setAppellationForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate(appellationForm);
          }}
        />
      )}
    </Box>
  );
}

export default AppellationList;
