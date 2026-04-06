import { useReducer, useMemo } from 'react';
import type { Bottle } from '@/types/api/bottle';
import type { UseBottleFilterReturn } from '@/types/hook/bottle';

interface FilterState {
  type: string;
  country: string;
  row: string;
  opened: string;
}

interface FilterAction {
  type: 'SET_TYPE' | 'SET_COUNTRY' | 'SET_ROW' | 'SET_OPENED' | 'RESET';
  payload?: string;
}

const initialFilters: FilterState = {
  type: '',
  country: '',
  row: '',
  opened: '',
};

const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_TYPE':
      return { ...state, type: action.payload ?? '' };
    case 'SET_COUNTRY':
      return { ...state, country: action.payload ?? '' };
    case 'SET_ROW':
      return { ...state, row: action.payload ?? '' };
    case 'SET_OPENED':
      return { ...state, opened: action.payload ?? '' };
    case 'RESET':
      return initialFilters;
    default:
      return state;
  }
};

/**
 * ボトル一覧のフィルタリング機能を管理するHook
 */
export function useBottleFilter(bottles?: Bottle[]): UseBottleFilterReturn {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  // useMemo を使ってフィルタ結果をメモ化
  const filteredBottles = useMemo(() => {
    // bottles が undefined/null の場合は空配列で安全に filter
    return (bottles ?? []).filter((bottle) => {
      let ok = true;
      if (filters.type) ok = ok && bottle.wine?.wine_type_name === filters.type;
      if (filters.country) ok = ok && bottle.wine?.country_name === filters.country;
      if (filters.row) ok = ok && String(bottle.row_number) === String(filters.row);
      if (filters.opened === 'opened') ok = ok && bottle.is_opened;
      if (filters.opened === 'unopened') ok = ok && !bottle.is_opened;
      return ok;
    });
  }, [bottles, filters]);

  const setFilterType = (value: string): void => dispatch({ type: 'SET_TYPE', payload: value });
  const setFilterCountry = (value: string): void => dispatch({ type: 'SET_COUNTRY', payload: value });
  const setFilterRow = (value: string): void => dispatch({ type: 'SET_ROW', payload: value });
  const setFilterOpened = (value: string): void => dispatch({ type: 'SET_OPENED', payload: value });
  const resetFilters = (): void => dispatch({ type: 'RESET' });

  return {
    filters,
    setFilterType,
    setFilterCountry,
    setFilterRow,
    setFilterOpened,
    filteredBottles,
    resetFilters,
  };
}
