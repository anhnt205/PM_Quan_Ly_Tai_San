import { Close, PictureAsPdf } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";

export const SignHeader = ({
  pagesCount,
  handleExportPDF,
  onCancel,
}: {
  pagesCount: number;
  handleExportPDF: () => void;
  onCancel: () => void;
}) => (
  <Box
    sx={{
      bgcolor: "white",
      p: 2,
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Box>
      <Typography variant="h6">Soạn & Ký Tài Liệu</Typography>
      <Typography variant="body2" color="textSecondary">
        Tổng số trang: {pagesCount}
      </Typography>
    </Box>
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Button
        variant="outlined"
        size="small"
        onClick={handleExportPDF}
        sx={{
          textTransform: "none",
          fontSize: "0.875rem",
          color: "#8b5cf6",
          borderColor: "#c4b5fd",
          fontWeight: 500,
          "&:hover": {
            borderColor: "#a78bfa",
            backgroundColor: "rgba(139, 92, 246, 0.04)",
          },
        }}
        startIcon={<PictureAsPdf />}
      >
        Xuất PDF
      </Button>
      <IconButton onClick={onCancel}>
        <Close />
      </IconButton>
    </Box>
  </Box>
);
