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
    <Box
      component="div"
      sx={{
        bgcolor: "#FDFCF0",
        borderRadius: 0,
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
      }}
    >
      <List sx={{ p: 0 }}>
        {sortedRows.map((row) => {
          const bottlesInRow = rowGroups[row];
          return (
          <div key={row}>
            <Divider sx={{ my: 0, borderColor: "#E0DCCF", borderBottomWidth: "1px" }} />
            {/* 行ヘッダー */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                background: "#FDFCF0",
                borderRadius: 0,
                cursor: "pointer",
                borderBottom: "1px solid #E0DCCF",
                "&:hover": {
                  bgcolor: "#FAF8ED",
                },
              }}
              onClick={() => toggleRow(row)}
            >
              <Typography variant="subtitle1" sx={{ color: "#2C2C2C", fontWeight: 600 }}>
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
                      background: "#FDFCF0",
                      borderRadius: 0,
                      mb: 0,
                      mx: 0,
                      px: isMobile ? 1 : 2,
                      py: isMobile ? 1 : 1.5,
                      cursor: "pointer",
                      transition: "background 0.2s",
                      borderBottom: "1px solid #E0DCCF",
                      "&:hover": {
                        background: "#FAF8ED",
                      },
                      "&:last-child": {
                        borderBottom: "1px solid #E0DCCF",
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
    </Box>
  );
}

export default BottleList;
