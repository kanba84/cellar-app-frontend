import type { Bottle, CreateBottleRequest, UpdateBottleRequest, PatchBottleRequest } from '@/types/api/bottle';
import type { BottleFormSubmitData } from '@/types/form/bottle';

export function toCreateBottleRequest(
  data: BottleFormSubmitData
): CreateBottleRequest {
  if (data.wine_id == null) {
    throw new Error("wine_id is required");
  }

  return {
    wine_id: data.wine_id,
    row_number: data.row_number,
    column_number: data.column_number,
    note: data.note?.trim() || null,
  };
}

/**
 * Partial<Bottle> を PatchBottleRequest に変換
 * 部分更新用：指定されたフィールドのみをAPI側に送信
 */
export function toPatchBottleRequest(
  data: Partial<Bottle>
): PatchBottleRequest {
  const patchData: PatchBottleRequest = {};

  // row_number: null から数値への変換、またはnullに
  if (data.row_number !== undefined) {
    patchData.row_number = data.row_number === null 
      ? null 
      : Number(data.row_number);
  }

  // column_number: null から数値への変換、またはnullに
  if (data.column_number !== undefined) {
    patchData.column_number = data.column_number === null
      ? null
      : Number(data.column_number);
  }

  // is_opened: 値が設定されていれば追加
  if (data.is_opened !== undefined) {
    patchData.is_opened = data.is_opened;
  }

  // note: 値が設定されていれば追加
  if (data.note !== undefined) {
    patchData.note = data.note ? data.note.trim() : null;
  }

  return patchData;
}

/**
 * Partial<Bottle> を UpdateBottleRequest に変換
 * 完全更新用：必要なすべてのフィールドを指定
 */
export function toUpdateBottleRequest(
  data: Partial<Bottle>
): UpdateBottleRequest {
  const updateData: UpdateBottleRequest = {};

  // wine_id: 値が設定されていれば追加
  if (data.wine_id !== undefined) {
    updateData.wine_id = data.wine_id;
  }

  // row_number: nullから数値への変換、またはnullに
  if (data.row_number !== undefined) {
    updateData.row_number = data.row_number === null 
      ? null 
      : Number(data.row_number);
  }

  // column_number: nullから数値への変換、またはnullに
  if (data.column_number !== undefined) {
    updateData.column_number = data.column_number === null
      ? null
      : Number(data.column_number);
  }

  // is_opened: 値が設定されていれば追加
  if (data.is_opened !== undefined) {
    updateData.is_opened = data.is_opened;
  }

  // note: 値が設定されていれば追加
  if (data.note !== undefined) {
    updateData.note = data.note ? data.note.trim() : null;
  }

  return updateData;
}
