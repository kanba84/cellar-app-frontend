import { useState, useEffect } from 'react';
import type { Wine } from '@/types/api/wine';
import type { UseWinesReturn } from '@/types/hook/wine';
import { fetchWines } from '@/api/wineApi';

/**
 * ワイン一覧のデータを取得・管理するHook
 */
export function useWines(): UseWinesReturn {
  const [wines, setWines] = useState<Wine[]>([]);

  useEffect(() => {
    fetchWines()
      .then(setWines)
      .catch(() => setWines([]));
  }, []);

  return { wines };
}
