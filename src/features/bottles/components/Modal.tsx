import { Box, Button, Paper } from "@mui/material";

export function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          padding: { xs: 2, sm: 3 },
          borderRadius: 2,
          minWidth: 320,
          width: { xs: "90%", sm: "auto" },
          fontSize: { xs: 14, sm: 16 },
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            minWidth: 0,
            padding: 0,
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ×
        </Button>

        {children}
      </Paper>
    </Box>
  );
}