import {
  Box,
  List,
  Typography,
  Divider,
  Collapse,
  IconButton,
} from "@mui/material";
import BottleItem from "./BottleItem";
import { useBottleListViewModel } from "../hooks/useBottleListViewModel";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import type { Bottle } from "@/types/api/bottle";

interface BottleListProps {
  bottles: Bottle[];
  isMobile?: boolean;
  onBottleDetail?: (bottle: Bottle) => void;
  editId: number | null;
  editForm: Partial<Bottle>;
  onEditStart: (bottle: Bottle) => void;
  onEditChange: (form: Partial<Bottle>) => void;
  onEditSave: (bottleId: number, form: Partial<Bottle>) => Promise<void>;
  onEditCancel: () => void;
  onDelete: (bottleId: number) => void;
}

function BottleList({
  bottles,
  isMobile,
  onBottleDetail,
  editId,
  editForm,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
}: BottleListProps) {
  const { rowGroups, sortedRows, openRows, toggleRow } =
    useBottleListViewModel(bottles);

  if (bottles.length === 0) {
    return <Typography>登録されているボトルはありません。</Typography>;
  }

  return (
    <List>
      {sortedRows.map((row, index) => {
        const bottlesInRow = rowGroups[row];
        const groupColor = index % 2 === 0 ? "#f5f5f5" : "#fff";
        return (
          <div key={row}>
            <Divider sx={{ my: 1 }} />
            {/* 行ヘッダー */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1,
                py: 0.5,
                background: groupColor,
                borderRadius: 1,
                cursor: "pointer",
              }}
              onClick={() => toggleRow(row)}
            >
              <Typography variant="subtitle1">
                {row}段目 ({bottlesInRow.length}本）
              </Typography>
              <IconButton size="small">
                {openRows[row] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>

            {/* 折りたたみ本体 */}
            <Collapse in={openRows[row]} timeout="auto" unmountOnExit>
              {rowGroups[row]
                .sort(
                  (a, b) => Number(a.column_number) - Number(b.column_number),
                )
                .map((bottle) => (
                  <Box
                    key={bottle.id}
                    sx={{
                      background: groupColor,
                      borderRadius: 2,
                      mb: 1,
                      mx: 1,
                      px: isMobile ? 0.5 : 1,
                      py: isMobile ? 0.5 : 1,
                      cursor: "pointer",
                      transition: "background 0.2s",
                      "&:hover": {
                        background: "#e0e0e0",
                      },
                    }}
                  >
                    <BottleItem
                      bottle={bottle}
                      editId={editId}
                      editForm={editForm}
                      onEditStart={onEditStart}
                      onEditChange={onEditChange}
                      onEditSave={onEditSave}
                      onEditCancel={onEditCancel}
                      onDelete={onDelete}
                      onBottleDetail={onBottleDetail}
                    />
                  </Box>
                ))}
            </Collapse>
          </div>
        );
      })}
    </List>
  );
}

export default BottleList;
