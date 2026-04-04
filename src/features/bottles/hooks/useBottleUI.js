import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

/**
 * ボトル一覧画面の表示状態（モード、モーダル開閉、レスポンシブ）を管理するHook
 */
export function useBottleUI() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 表示モード ('list' | 'visual')
  const [viewMode, setViewMode] = useState("list");

  // 詳細表示するボトルのデータ (null なら閉じている)
  const [detailBottle, setDetailBottle] = useState(null);

  /**
   * 表示モードの切り替えハンドラ
   */
  const handleViewModeChange = (_event, next) => {
    if (next !== null) setViewMode(next);
  };

  /**
   * 詳細モーダルを閉じる
   */
  const closeDetail = () => setDetailBottle(null);

  return {
    isMobile,
    viewMode,
    detailBottle,
    setDetailBottle,
    closeDetail,
    handleViewModeChange,
  };
}
