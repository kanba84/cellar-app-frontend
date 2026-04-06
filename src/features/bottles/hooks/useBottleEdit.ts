import { useState } from 'react';
import type { Bottle } from '@/types/api/bottle';
import type { UseBottleEditReturn } from '@/types/hook/bottle';

/**
 * ボトル編集フォームの状態を管理するHook
 */
export function useBottleEdit(): UseBottleEditReturn {
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Bottle>>({
    row_number: undefined,
    column_number: undefined,
    is_opened: false,
    note: undefined,
  });

  const handleEditStart = (bottle: Bottle | null): void => {
    if (!bottle) {
      setEditId(null);
      return;
    }
    setEditId(bottle.id);
    setEditForm({
      row_number: bottle.row_number,
      column_number: bottle.column_number,
      is_opened: bottle.is_opened,
      note: bottle.note || '',
    });
  };

  const handleEditSave = async (
    updateFn: (id: number, data: Partial<Bottle>) => Promise<void>,
    id: number,
    override?: Partial<Bottle>
  ): Promise<boolean> => {
    try {
      const updateData = override || editForm;
      await updateFn(id, updateData);
      setEditId(null);
      return true;
    } catch (err) {
      throw err;
    }
  };

  const handleEditCancel = (): void => {
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
