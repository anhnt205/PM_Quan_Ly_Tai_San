// src/components/common/DraftIndicator.tsx
import { EditNote } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function DraftIndicator({ onClick }: { onClick: () => void }) {
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
    const timer = setTimeout(() => {
      const pagination = document.querySelector(".MuiTablePagination-root");
      if (!pagination) return;

      const observer = new IntersectionObserver(
        ([entry]) => setIsNearBottom(entry.isIntersecting),
        { threshold: 0.1 },
      );
      observer.observe(pagination);
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
=======
    const pagination = document.querySelector(".MuiTablePagination-root");
    if (!pagination) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearBottom(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(pagination);
    return () => observer.disconnect();
>>>>>>> 0230394 ([fix] Sua loi bulk form, lam keep alive cho sua chua bao duong)
  }, []);

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: isNearBottom ? 10 : 24,
        right: 24,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1,
        bgcolor: "primary.main",
        color: "white",
        borderRadius: "20px",
        boxShadow: 3,
        cursor: "pointer",
        userSelect: "none",
        "&:hover": { bgcolor: "primary.dark" },
        transition: "background-color 0.2s, bottom 0.2s ease",
      }}
    >
      <EditNote sx={{ fontSize: 20 }} />
      <Typography variant="body2" fontWeight={500}>
        Đang soạn thảo...
      </Typography>
    </Box>
  );
}