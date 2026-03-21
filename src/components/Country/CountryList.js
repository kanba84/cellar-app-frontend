import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createCountry, deleteCountry } from "../../api/countryApi";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  CircularProgress,
  TextField,
  Stack,
  Typography,
} from "@mui/material";

function CountryList({ countries, onCountryChanged }) {
  const [form, setForm] = useState({
    name: "",
    iso_code: "",
  });
  const [deletingId, setDeletingId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("この国を削除しますか？")) return;
    setDeletingId(id);
    try {
      await deleteCountry(id);
      if (onCountryChanged) onCountryChanged();
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createCountry(form);
      setForm({
        name: "",
        iso_code: "",
      });
      setCreateModalOpen(false);
      if (onCountryChanged) onCountryChanged();
    } finally {
      setCreating(false);
    }
  };

  if (!countries) {
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
            国を追加
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="国名"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <TextField
              label="ISOコード"
              value={form.iso_code}
              onChange={(e) => setForm({ ...form, iso_code: e.target.value })}
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
        {countries.map((country) => (
          <ListItem
            key={country.id}
            disablePadding
            secondaryAction={
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(country.id)}
                disabled={deletingId === country.id}
              >
                {deletingId === country.id ? "削除中..." : "削除"}
              </Button>
            }
          >
            <ListItemButton
              component={Link}
              to={`/config/countries/${country.id}/regions`}
            >
              <ListItemText
                primary={country.name}
                secondary={country.iso_code}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default CountryList;
