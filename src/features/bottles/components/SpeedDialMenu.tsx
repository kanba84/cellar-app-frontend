import { Box, Paper, IconButton, Backdrop, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface SpeedDialMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
}

export default function SpeedDialMenu({
  isOpen,
  onClose,
  items,
}: SpeedDialMenuProps) {
  return (
    <>
      {/* 半透明オーバーレイ */}
      <Backdrop
        sx={{
          zIndex: 999,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
        open={isOpen}
        onClick={onClose}
      />

      {/* メニューコンテナ */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        {/* メニューアイテム */}
        {items.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              animation: isOpen
                ? `slideUp 0.3s ease-out ${index * 0.1}s both`
                : "none",
              "@keyframes slideUp": {
                from: {
                  opacity: 0,
                  transform: "translateY(20px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            {/* ラベル背景 */}
            <Paper
              sx={{
                px: 2,
                py: 1,
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">{item.label}</Typography>
            </Paper>

            {/* メニューアイコンボタン */}
            <IconButton
              size="small"
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "primary.light",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "primary.main",
                  transform: "scale(1.1)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
              onClick={() => {
                item.onClick();
                onClose();
              }}
            >
              {item.icon}
            </IconButton>
          </Box>
        ))}
      </Box>
    </>
  );
}
