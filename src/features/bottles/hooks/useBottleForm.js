import { useState } from "react";

export function useBottleForm() {
  const [form, setForm] = useState({
    wine_id: "",
    row_number: "",
    column_number: "",
    note: "",
  });
  const [creating, setCreating] = useState(false);

  const resetForm = () => {
    setForm({
      wine_id: "",
      row_number: "",
      column_number: "",
      note: "",
    });
  };

  const handleCreate = async (createFn) => {
    setCreating(true);
    try {
      const bottleData = {
        ...form,
        wine_id: form.wine_id ? Number(form.wine_id) : null,
        row_number: form.row_number ? Number(form.row_number) : null,
        column_number: form.column_number ? Number(form.column_number) : null,
      };
      await createFn(bottleData);
      resetForm();
      return true;
    } catch (err) {
      // 409エラー（棚位置重複）を特別処理
      if (
        err.response?.status === 409 &&
        err.response?.data?.error === "POSITION_OCCUPIED"
      ) {
        throw new Error("その棚位置はすでに使用されています");
      }
      throw new Error("追加に失敗しました");
    } finally {
      setCreating(false);
    }
  };

  return {
    form,
    setForm,
    creating,
    resetForm,
    handleCreate,
  };
}
