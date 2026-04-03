import { useState } from "react";

export function useBottleEdit() {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    row_number: "",
    column_number: "",
    is_opened: false,
    note: "",
  });

  const handleEditStart = (bottle) => {
    if (!bottle) {
      setEditId(null);
      return;
    }
    setEditId(bottle.id);
    setEditForm({
      row_number: bottle.row_number,
      column_number: bottle.column_number,
      is_opened: bottle.is_opened,
      note: bottle.note || "",
    });
  };

  const handleEditSave = async (updateFn, id, override) => {
    try {
      const updateData = override || editForm;
      await updateFn(id, updateData);
      setEditId(null);
      return true;
    } catch (err) {
      throw err;
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  return {
    editId,
    editForm,
    setEditForm,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
  };
}
