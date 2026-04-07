// src/components/CellarVisualizer.jsx
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Bottle } from '@/types/api/bottle';
import './CellarVisualizer.css';

/** BottleItem の棚 UI と同じ（行 1–9、列 1–7） */
const SHELF_ROW_COUNT = 9;
const SHELF_COL_COUNT = 7;

function getWineVisualClass(bottle: Bottle | null): string {
  const raw = bottle?.wine?.wine_type_name;
  if (raw == null || raw === '') return 'red';
  const t = String(raw).trim().toLowerCase();
  if (t === 'white' || t.includes('白') || t.includes('ホワイト')) return 'white';
  if (
    t === 'sparkling' ||
    t.includes('spark') ||
    t.includes('泡') ||
    t.includes('シャンパン') ||
    t.includes('スパーク')
  ) {
    return 'sparkling';
  }
  if (t.includes('rose') || t.includes('ロゼ') || t.includes('rosé')) return 'rose';
  if (t === 'red' || t.includes('赤')) return 'red';
  return 'red';
}

function buildShelfGrid(bottles: Bottle[]): (Bottle | null)[][] {
  const grid = Array.from({ length: SHELF_ROW_COUNT }, () =>
    Array(SHELF_COL_COUNT).fill(null)
  );
  for (const bottle of bottles) {
    const r = Number(bottle.row_number);
    const c = Number(bottle.column_number);
    if (
      !Number.isFinite(r) ||
      !Number.isFinite(c) ||
      r < 1 ||
      r > SHELF_ROW_COUNT ||
      c < 1 ||
      c > SHELF_COL_COUNT
    ) {
      continue;
    }
    grid[r - 1][c - 1] = bottle;
  }
  return grid;
}

interface BottleComponentProps {
  position: 'front' | 'back';
}

const Bottle = ({ position }: BottleComponentProps) => (
  <div className="bottle-body">
    {position === 'front' ? (
      <div className="bottle-bottom">
        <div className="punt" />
      </div>
    ) : (
      <div className="cap-top" />
    )}
  </div>
);

interface SlotProps {
  bottle: Bottle | null;
  position: 'front' | 'back';
  onBottleSelect?: (bottle: Bottle) => void;
}

const Slot = ({ bottle, position, onBottleSelect }: SlotProps) => {
  const visualClass = bottle ? getWineVisualClass(bottle) : 'empty';
  return (
    <div
      className={`slot ${visualClass} ${position}`}
      onClick={(e: React.MouseEvent) => {
        if (bottle && onBottleSelect) {
          e.stopPropagation();
          onBottleSelect(bottle);
        }
      }}
      style={bottle && onBottleSelect ? { cursor: 'pointer' } : undefined}
    >
      {bottle ? <Bottle position={position} /> : null}
    </div>
  );
};

interface DetailedBottleProps {
  bottle: Bottle | null;
  isReverse: boolean;
  onBottleSelect?: (bottle: Bottle) => void;
}

const DetailedBottle = ({ bottle, isReverse, onBottleSelect }: DetailedBottleProps) => {
  if (!bottle) {
    return <div className="detailed-bottle-empty" aria-hidden />;
  }
  const visualClass = getWineVisualClass(bottle);
  const label = bottle.wine?.name || '';
  return (
    <div
      className={`bottle-col ${visualClass} ${isReverse ? 'reverse' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onBottleSelect?.(bottle);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onBottleSelect?.(bottle);
        }
      }}
    >
      <div className="bottle-container">
        <div className="bottle-main">
          <div className="label">
            <span
              style={{
                fontSize: '8px',
                display: 'block',
                textAlign: 'center',
                marginTop: '20px',
              }}
            >
              {label.substring(0, 10)}
            </span>
          </div>
        </div>
        <div className="bottle-neck" />
        <div className="bottle-cap-side" />
      </div>
    </div>
  );
};

function useFitWidthScale(grid: (Bottle | null)[][], selectedShelf: number | null, bottleCount: number | undefined) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ scale: 1, ih: 0, iw: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;
      const cw = outer.clientWidth;
      const iw = inner.scrollWidth;
      const ih = inner.scrollHeight;
      if (iw === 0 || ih === 0) return;
      const scale = cw > 0 ? Math.min(1, cw / iw) : 1;
      setLayout({ scale, ih, iw });
    };

    requestAnimationFrame(() => {
      measure();
      requestAnimationFrame(measure);
    });

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (outer) ro.observe(outer);
    if (inner) ro.observe(inner);

    window.addEventListener('orientationchange', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', measure);
    };
  }, [grid, selectedShelf, bottleCount]);

  return { outerRef, innerRef, scale: layout.scale, ih: layout.ih };
}

interface CellarVisualizerProps {
  bottles: Bottle[];
  onBottleSelect?: (bottle: Bottle) => void;
}

const CellarVisualizer = ({ bottles, onBottleSelect }: CellarVisualizerProps) => {
  const [selectedShelf, setSelectedShelf] = useState<number | null>(null);

  const grid = useMemo(() => buildShelfGrid(bottles ?? []), [bottles]);

  const { outerRef, innerRef, scale, ih } = useFitWidthScale(
    grid,
    selectedShelf,
    bottles?.length
  );

  const scaledHeight = ih > 0 ? ih * scale : undefined;

  return (
    <Box
      sx={{
        /* BottleListPage の横パディングを相殺し、スマホではビューポート幅いっぱいに近づける */
        width: { xs: 'calc(100% + 8px)', sm: 'calc(100% + 32px)' },
        maxWidth: { xs: '100vw', sm: 'none' },
        mx: { xs: -0.5, sm: -2 },
        minHeight: '80vh',
        position: 'relative',
        bgcolor: '#0a0a0a',
        p: { xs: 0, sm: 2 },
        boxSizing: 'border-box',
      }}
    >
      <div
        ref={outerRef}
        style={{
          width: '100%',
          maxWidth: '100%',
          height: scaledHeight ?? 'auto',
          minHeight: scaledHeight ? undefined : 'min(80vh, 480px)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          ref={innerRef}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: 'top center',
            willChange: 'transform',
          }}
        >
          <AnimatePresence mode="wait">
            {selectedShelf === null ? (
              <motion.div
                key="cellar"
                className="cellar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                  セラー外観表示
                </Typography>
                {grid.map((rowSlots, rowIdx) => (
                  <motion.div
                    key={rowIdx}
                    className="shelf-row"
                    onClick={() => setSelectedShelf(rowIdx)}
                    layoutId={`shelf-${rowIdx}`}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: '#bbb', display: 'block', mb: 0.5, textAlign: 'center' }}
                    >
                      {rowIdx + 1}段目
                    </Typography>
                    <div className="slots">
                      {rowSlots.map((b, colIdx) => (
                        <Slot
                          key={colIdx}
                          bottle={b}
                          position={colIdx % 2 === 0 ? 'front' : 'back'}
                          onBottleSelect={onBottleSelect}
                        />
                      ))}
                    </div>
                    <div className="wire" />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="detail" className="shelf-top-view" layoutId={`shelf-${selectedShelf}`}>
                <IconButton
                  onClick={() => setSelectedShelf(null)}
                  sx={{ color: '#fff', mb: 2 }}
                  aria-label="棚一覧に戻る"
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="subtitle2" sx={{ color: '#eee', mb: 1 }}>
                  {selectedShelf + 1}段目
                </Typography>
                <div className="shelf-base">
                  {grid[selectedShelf].map((b, i) => (
                    <DetailedBottle
                      key={i}
                      bottle={b}
                      isReverse={i % 2 !== 0}
                      onBottleSelect={onBottleSelect}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Box>
  );
};

export default CellarVisualizer;