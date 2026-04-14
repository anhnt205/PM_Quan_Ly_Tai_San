import { Box, Typography } from "@mui/material";
import { FactCheck } from "@mui/icons-material";

export default function MaintenanceApprovalPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: 2,
        color: "text.secondary",
      }}
    >
      <FactCheck sx={{ fontSize: 64, color: "success.main", opacity: 0.5 }} />
      <Typography variant="h5" fontWeight={600}>
        Phê duyệt
      </Typography>
      <Typography variant="body2" color="text.disabled">
        Trang đang được phát triển
      </Typography>
    </Box>
  );
}