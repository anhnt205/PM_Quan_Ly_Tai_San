import { Close, PictureAsPdf, Description } from "@mui/icons-material";
import { Box, Button, IconButton, Typography, Chip } from "@mui/material";

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
      px: 3,
      py: 2,
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    }}
  >
    {/* Left Section */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "10px",
          bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Description sx={{ color: "white", fontSize: 22 }} />
      </Box>

      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.125rem",
            color: "#111827",
            mb: 0.25,
          }}
        >
          Soạn & Ký Tài Liệu
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={`${pagesCount} trang`}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.75rem",
              fontWeight: 500,
              bgcolor: "#f3f4f6",
              color: "#6b7280",
              "& .MuiChip-label": { px: 1 },
            }}
          />
        </Box>
      </Box>
    </Box>

    {/* Right Section */}
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
      <Button
        variant="contained"
        size="medium"
        onClick={handleExportPDF}
        startIcon={<PictureAsPdf sx={{ fontSize: 18 }} />}
        sx={{
          textTransform: "none",
          fontSize: "0.875rem",
          fontWeight: 600,
          px: 2.5,
          py: 1,
          borderRadius: "8px",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
          },
        }}
      >
        Xuất PDF
      </Button>

      <IconButton
        onClick={onCancel}
        sx={{
          width: 36,
          height: 36,
          bgcolor: "#f3f4f6",
          "&:hover": {
            bgcolor: "#e5e7eb",
          },
        }}
      >
        <Close sx={{ fontSize: 20, color: "#6b7280" }} />
      </IconButton>
    </Box>
  </Box>
);