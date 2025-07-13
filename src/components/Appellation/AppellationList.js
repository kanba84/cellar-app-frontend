import React, { useState } from "react";
import { createAppellation, deleteAppellation } from "../../api/appellationApi";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

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
      <AppellationCreateForm
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreate}
        appellationForm={appellationForm}
        onChange={setAppellationForm}
      />
    </Box>
  );
}

export default AppellationList;
