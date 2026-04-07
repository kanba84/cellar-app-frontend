import { useState } from "react";
import { createWineType, deleteWineType } from "../../api/wineTypeApi";

import {
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  TextField,
  Stack,
  Typography,
} from "@mui/material";

function WineTypeList({ wineTypes, onWineTypeChanged }: any) {
  const [form, setForm] = useState({
    name: "",
  });
  const [deletingId, setDeletingId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("このワインタイプを削除しますか？")) return;
    setDeletingId(id);
    try {
      await deleteWineType(id);
      if (onWineTypeChanged) onWineTypeChanged();
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createWineType(form);
      setForm({
        name: "",
      });
      setCreateModalOpen(false);
      if (onWineTypeChanged) onWineTypeChanged();
    } finally {
      setCreating(false);
    }
  };

  if (!wineTypes) {
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

      {createModalOpen && (
        <Box
          component="form"
          onSubmit={handleCreate}
          sx={{
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            minWidth: 320,
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            ワインタイプを追加
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="ワインタイプ名"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={creating}
              >
                {creating ? "追加中..." : "追加"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setCreateModalOpen(false)}
                sx={{ ml: 1 }}
              >
                キャンセル
              </Button>
            </Box>
          </Stack>
        </Box>
      )}

      <List>
        {wineTypes.map((wineType) => (
          <ListItem
            key={wineType.id}
            secondaryAction={
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(wineType.id)}
                disabled={deletingId === wineType.id}
              >
                {deletingId === wineType.id ? "削除中..." : "削除"}
              </Button>
            }
          >
            <ListItemText primary={wineType.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default WineTypeList;
