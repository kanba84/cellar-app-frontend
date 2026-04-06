import { useState } from 'react';
import type { BottleFormState, BottleFormSubmitData } from '@/types/form/bottle';
import type { UseBottleFormReturn } from '@/types/hook/bottle';

/**
 * ボトル作成フォームの状態を管理するHook
 */
export function useBottleForm(): UseBottleFormReturn {
  const [form, setForm] = useState<BottleFormState>({
    wine_id: '',
    row_number: '',
    column_number: '',
    note: '',
  });
  const [creating, setCreating] = useState<boolean>(false);

  const resetForm = (): void => {
    setForm({
      wine_id: '',
      row_number: '',
      column_number: '',
      note: '',
    });
  };

  const handleCreate = async (
    createFn: (data: BottleFormSubmitData) => Promise<unknown>
  ): Promise<boolean> => {
    setCreating(true);
    try {
      const bottleData: BottleFormSubmitData = {
        wine_id: form.wine_id ? Number(form.wine_id) : null,
        row_number: form.row_number ? Number(form.row_number) : null,
        column_number: form.column_number ? Number(form.column_number) : null,
        note: form.note,
      };
      await createFn(bottleData);
      resetForm();
      return true;
    } catch (err) {
      throw err;
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
