// src/components/common/DraftIndicator.tsx
import { EditNote } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export default function DraftIndicator({ onClick }: { onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: 24,
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
        transition: "background-color 0.2s",
      }}
    >
      <EditNote sx={{ fontSize: 20 }} />
      <Typography variant="body2" fontWeight={500}>
        Đang soạn thảo...
      </Typography>
    </Box>
  );
}
