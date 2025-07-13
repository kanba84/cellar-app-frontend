// DesignationTypeListPage.js
import React, { useEffect, useState } from "react";
import {
  fetchDesignationTypes,
  createDesignationType,
  deleteDesignationType,
} from "../api/designationTypeApi";
import DesignationTypeCreateForm from "../components/DesignationType/DesignationTypeCreateForm";

import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
//import DeleteIcon from '@mui/icons-material/Delete';

// Modal共通コンポーネント
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          minWidth: 320,
          position: "relative",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            minWidth: 0,
            padding: 0,
          }}
        >
          ×
        </Button>
        {children}
      </div>
    </div>
  );
}

function DesignationTypeListPage() {
  const [designationTypes, setDesignationTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchDesignationTypes();
      setDesignationTypes(data);
      setError(null);
    } catch (err) {
      setError("一覧の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("このDesignationTypeを削除しますか？")) return;
    try {
      await deleteDesignationType(id);
      await loadData();
    } catch (err) {
      alert("削除に失敗しました");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createDesignationType(form);
      setForm({ name: "" });
      setShowCreateModal(false);
      await loadData();
    } catch (err) {
      alert("追加に失敗しました");
    } finally {
      setCreating(false);
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
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        DesignationType一覧
      </Typography>

      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowCreateModal(true)}
        >
          追加
        </Button>
      </Box>

      {/* 追加モーダル */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <DesignationTypeCreateForm
          form={form}
          creating={creating}
          onChange={setForm}
          onSubmit={handleCreate}
        />
      </Modal>

      {designationTypes.length === 0 ? (
        <Typography>登録されているDesignationTypeはありません。</Typography>
      ) : (
        <List>
          {designationTypes.map((dt) => (
            <React.Fragment key={dt.id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(dt.id)}
                  ></IconButton>
                }
              >
                <ListItemText primary={dt.name} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

export default DesignationTypeListPage;
