import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import wineTypeColor, { wineTypeColorLight } from "@/utils/wineUtils";
import { buildImageUrl } from "@/utils/imageUtils";
import type { Bottle } from "@/types/api/bottle";
import type { Wine } from "@/types/api/wine";
import "./BottleDetailModal.css";

function formatVintage(wine: Wine | undefined): string {
  if (wine?.vintage == null) return "—";
  return `${wine.vintage}年`;
}

interface BottleDetailModalProps {
  open: boolean;
  bottle: Bottle | null;
  onClose: () => void;
}

/**
 * セラー／リスト共通のボトル詳細モーダル（cellar-ui のモーダル相当）
 */
function BottleDetailModal({ open, bottle, onClose }: BottleDetailModalProps) {
  const wine = bottle?.wine;
  const wineTypeName = wine?.wine_type_name;
  const wineTypeBarColor = wineTypeName
    ? wineTypeColor[wineTypeName as keyof typeof wineTypeColor]
    : undefined;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const modal = (
    <AnimatePresence>
      {open && bottle && (
        <motion.div
          className="cellar-bottle-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="cellar-bottle-modal-content cellar-bottle-modal"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <button
              type="button"
              className="cellar-bottle-modal-close"
              onClick={onClose}
              aria-label="閉じる"
            >
              ✕
            </button>
            <div className="wine-card">
              <div className="wine-card-label">
                {wine?.label_image_url ? (
                  <img
                    src={buildImageUrl(wine.label_image_url) || undefined}
                    alt={`${wine?.name || "ワイン"} ラベル`}
                  />
                ) : (
                  "Wine"
                )}
              </div>
              <div className="wine-card-info">
                <div className="wine-card-title-row">
                  <span
                    className="wine-type-bar"
                    style={{
                      backgroundColor: wineTypeBarColor ?? "#cccccc",
                    }}
                    aria-hidden
                  />
                  <h3>{wine?.name || "ワイン名不明"}</h3>
                </div>
                <p>
                  タイプ{" "}
                  {wineTypeName ? (
                    <span
                      className="wine-type-chip"
                      style={{
                        backgroundColor:
                          wineTypeColorLight[wineTypeName as keyof typeof wineTypeColorLight] ||
                          "#f0f0f0",
                        color:
                          wineTypeColor[wineTypeName as keyof typeof wineTypeColor] || "#666",
                      }}
                    >
                      {wineTypeName}
                    </span>
                  ) : (
                    <span>—</span>
                  )}
                </p>
                <p>
                  生産国 <span>{wine?.country_name || "—"}</span>
                </p>
                <p>
                  地域 <span>{wine?.region_name || "—"}</span>
                </p>
                <p>
                  ヴィンテージ <span>{formatVintage(wine)}</span>
                </p>
                <p>
                  生産者 <span>{wine?.producer || "—"}</span>
                </p>
                <p>
                  棚位置{" "}
                  <span>
                    {bottle.row_number}行 {bottle.column_number}列
                  </span>
                </p>
                <p>
                  開封 <span>{bottle.is_opened ? "済" : "未"}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}

export default BottleDetailModal;
