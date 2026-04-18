import { useState, useEffect, useRef } from "react";
import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface FloatingActionButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  isModalOpen?: boolean;
}

export default function FloatingActionButton({
  isOpen,
  onToggle,
  isModalOpen = false,
}: FloatingActionButtonProps) {
  const [isVisible, setIsVisible] = useState(true);
  // Remove unused isScrolling state
  // const [isScrolling, setIsScrolling] = useState(false);
  // Use number for setTimeout ref to avoid NodeJS namespace error
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(false);

      // 前のタイマーをクリア
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // debounce 150ms
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        opacity: isVisible && !isOpen && !isModalOpen ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
        pointerEvents: isVisible && !isOpen && !isModalOpen ? "auto" : "none",
      }}
    >
      <Fab
        color="primary"
        aria-label="add"
        onClick={onToggle}
        sx={{
          width: 56,
          height: 56,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>
    </Box>
  );
}
