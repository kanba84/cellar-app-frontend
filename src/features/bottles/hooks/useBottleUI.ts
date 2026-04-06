import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import type { Bottle } from '@/types/api/bottle';
import type { UseBottleUIReturn } from '@/types/hook/bottle';

/**
 * ボトル一覧画面の表示状態（モード、モーダル開閉、レスポンシブ）を管理するHook
 */
export function useBottleUI(): UseBottleUIReturn {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 表示モード ('list' | 'visual')
  const [viewMode, setViewMode] = useState<'list' | 'visual'>('list');

  // 詳細表示するボトルのデータ (null なら閉じている)
  const [detailBottle, setDetailBottle] = useState<Bottle | null>(null);

  /**
   * 表示モードの切り替えハンドラ
   */
  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, next: 'list' | 'visual' | null): void => {
    if (next !== null) setViewMode(next);
  };

  /**
   * 詳細モーダルを閉じる
   */
  const closeDetail = (): void => setDetailBottle(null);

  return {
    isMobile,
    viewMode,
    detailBottle,
    setDetailBottle,
    closeDetail,
    handleViewModeChange,
  };
}
