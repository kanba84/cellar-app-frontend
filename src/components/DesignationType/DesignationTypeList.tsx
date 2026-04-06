import React, { useState } from "react";
import {
  createDesignationType,
  deleteDesignationType,
} from "../../api/designationTypeApi";

import {
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
} from "@mui/material";

import DesignationTypeCreateForm from "./DesignationTypeCreateForm";

function DesignationTypeList({ designationTypes, onDesignationTypeChanged }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    rank: "",
    country_id: "",
  });
  const [deletingId, setDeletingId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("この原産地統制呼称タイプを削除しますか？")) return;
    setDeletingId(id);
    try {
      await deleteDesignationType(id);
      if (onDesignationTypeChanged) onDesignationTypeChanged();
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async (data) => {
    setCreating(true);
    try {
      await createDesignationType(data);
      setForm({
        name: "",
        code: "",
        rank: "",
        country_id: "",
      });
      setCreateModalOpen(false);
      if (onDesignationTypeChanged) onDesignationTypeChanged();
    } finally {
      setCreating(false);
    }
  };

  if (!designationTypes) {
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
        {designationTypes.map((designationType) => (
          <ListItem
            key={designationType.id}
            secondaryAction={
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(designationType.id)}
                disabled={deletingId === designationType.id}
              >
                {deletingId === designationType.id ? "削除中..." : "削除"}
              </Button>
            }
          >
            <ListItemText
              primary={designationType.name}
              secondary={`${designationType.code} (ランク: ${designationType.rank})`}
            />
          </ListItem>
        ))}
      </List>

      {createModalOpen && (
        <DesignationTypeCreateForm
          form={form}
          creating={creating}
          onChange={setForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate(form);
          }}
        />
      )}
    </Box>
  );
}

export default DesignationTypeList;
