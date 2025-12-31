import { Box, Button, Typography, IconButton } from "@mui/material";
import { Close, PictureAsPdf } from "@mui/icons-material";

interface DocumentLayoutProps {
  children: React.ReactNode;
  pageCount?: number;
  onClose: () => void;
  onExportPDF?: () => void;
}

export default function DocumentLayout({
  children,
  pageCount = 3,
  onClose,
  onExportPDF,
}: DocumentLayoutProps) {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
      }}
    >
      {/* Header */}
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
          <Typography variant="h6" fontWeight={600}>
            Soạn & Ký Tài Liệu
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {pageCount} trang
          </Typography>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            sx={{
              bgcolor: "#6366f1",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { bgcolor: "#4f46e5" },
            }}
            onClick={onExportPDF}
          >
            Xuất PDF
          </Button>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#ef4444",
              borderRadius: 1,
              border: "1px solid #fecaca",
              padding: 1,
              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: "900px", width: "100%" }}>{children}</Box>
      </Box>
    </Box>
  );
}
