/**
 * Bottle 関連のカスタムフック戻り値の型定義
 */

import type { Bottle } from '../api/bottle';
import type { BottleFormState, BottleFormSubmitData } from '../form/bottle';

/**
 * useBottles フック戻り値
 */
export interface UseBottlesReturn {
  bottles: Bottle[];
  loading: boolean;
  error: string | null;
  handleDelete: (id: number) => Promise<boolean>;
  handleCreate: (data: BottleFormSubmitData) => Promise<Bottle>;
  handleUpdate: (id: number, data: Partial<Bottle>) => Promise<Bottle>;
  refresh: () => Promise<void>;
}

/**
 * useBottleForm フック戻り値
 */
export interface UseBottleFormReturn {
  form: BottleFormState;
  setForm: (form: BottleFormState) => void;
  creating: boolean;
  resetForm: () => void;
  handleCreate: (createFn: (data: BottleFormSubmitData) => Promise<unknown>) => Promise<boolean>;
}

/**
 * useBottleEdit フック戻り値
 */
export interface UseBottleEditReturn {
  editId: number | null;
  editForm: Partial<Bottle>;
  setEditForm: (form: Partial<Bottle>) => void;
  handleEditStart: (bottle: Bottle | null) => void;
  handleEditSave: (updateFn: (id: number, data: Partial<Bottle>) => Promise<void>, id: number, override?: Partial<Bottle>) => Promise<boolean>;
  handleEditCancel: () => void;
}

/**
 * useBottleFilter フック戻り値
 */
export interface UseBottleFilterReturn {
  filters: {
    type: string;
    country: string;
    row: string;
    opened: string;
  };
  setFilterType: (value: string) => void;
  setFilterCountry: (value: string) => void;
  setFilterRow: (value: string) => void;
  setFilterOpened: (value: string) => void;
  filteredBottles: Bottle[];
  resetFilters: () => void;
}

/**
 * useBottleListViewModel フック戻り値
 */
export interface UseBottleListViewModelReturn {
  rowGroups: Record<number | string, Bottle[]>;
  sortedRows: (string | number)[];
  openRows: Record<string | number, boolean>;
  toggleRow: (row: string | number) => void;
}

/**
 * useBottleActions フック戻り値
 */
export interface UseBottleActionsReturn {
  handleCreateBottleSubmit: (e?: React.FormEvent) => Promise<boolean | unknown>;
  handleEditSave: (id: number, override: Partial<Bottle>) => Promise<boolean | unknown>;
  handleCreateWineWithBottleSubmit: (e?: React.FormEvent) => Promise<boolean | unknown>;
}

/**
 * useBottleUI フック戻り値
 */
export interface UseBottleUIReturn {
  isMobile: boolean;
  viewMode: 'list' | 'visual';
  detailBottle: Bottle | null;
  setDetailBottle: (bottle: Bottle | null) => void;
  closeDetail: () => void;
  handleViewModeChange: (event: React.MouseEvent<HTMLElement>, newValue: 'list' | 'visual' | null) => void;
}

/**
 * BottleListView コンポーネント用 bottleProps の型
 */
export interface BottleListViewBottleProps {
  bottles: Bottle[];
  filteredBottles: Bottle[];
  wines: import('../api/wine').Wine[];
  form: BottleFormState;
  setForm: (form: BottleFormState) => void;
  creating: boolean;
  onCreateBottle: (e?: React.FormEvent) => Promise<boolean | unknown>;
  wineWithBottleForm: import('../form/wineWithBottle').WineWithBottleFormState;
  setWineWithBottleForm: (form: import('../form/wineWithBottle').WineWithBottleFormState) => void;
  creatingWineWithBottle: boolean;
  onCreateWine: (e?: React.FormEvent) => Promise<boolean | unknown>;
  editId: number | null;
  editForm: Partial<Bottle>;
  onEditStart: (bottle: Bottle | null) => void;
  onEditChange: (form: Partial<Bottle>) => void;
  onEditSave: (id: number, data: Partial<Bottle>) => Promise<void>;
  onEditCancel: () => void;
  onDelete: (id: number) => Promise<boolean>;
}

/**
 * BottleListView コンポーネント用 filterProps の型
 */
export interface BottleListViewFilterProps {
  filters: {
    type: string;
    country: string;
    row: string;
    opened: string;
  };
  onFilterTypeChange: (value: string) => void;
  onFilterCountryChange: (value: string) => void;
  onFilterRowChange: (value: string) => void;
  onFilterOpenedChange: (value: string) => void;
  onResetFilters: () => void;
}

/**
 * BottleListView コンポーネント用 modalProps の型
 */
export interface BottleListViewModalProps {
  showCreateBottleModal: boolean;
  closeCreateBottleModal: () => void;
  showCreateWineModal: boolean;
  closeCreateWineModal: () => void;
}

/**
 * BottleListView コンポーネント用 uiProps の型
 */
export interface BottleListViewUIProps {
  isMobile: boolean;
  viewMode: 'list' | 'visual';
  onViewModeChange: (event: React.MouseEvent<HTMLElement>, newValue: 'list' | 'visual' | null) => void;
  detailBottle: Bottle | null;
  setDetailBottle: (bottle: Bottle | null) => void;
  closeDetail: () => void;
  onAddBottle: () => void;
  onAddWine: () => void;
}
