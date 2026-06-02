import { Close, PictureAsPdf, Description } from "@mui/icons-material";
import { Box, Button, IconButton, Typography, Chip } from "@mui/material";

export const SignHeader = ({
  pagesCount,
  handleExportPDF,
  onCancel,
  title,
}: {
  pagesCount: number;
  handleExportPDF: () => void;
  onCancel: () => void;
  title?: string;
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
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "10px",
          bgcolor: "#f3f4f6",
          border: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Description sx={{ color: "#4b5563", fontSize: 22 }} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.05rem",
            color: "#111827",
            mb: 0.25,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title || "Soạn & Ký Tài Liệu"}
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
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexShrink: 0 }}>
        <Button
            variant="outlined"
            size="medium"
            onClick={handleExportPDF}
            startIcon={<PictureAsPdf sx={{ fontSize: 18, color: "#ef4444" }} />}
            sx={{
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                px: 2.5,
                py: 0.8,
                borderRadius: "10px",
                color: "#ef4444",
                borderColor: "rgba(239, 68, 68, 0.25)",
                bgcolor: "white",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                    borderColor: "#ef4444",
                    bgcolor: "rgba(239, 68, 68, 0.04)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.08)",
                },
                "&:active": {
                    transform: "translateY(0)",
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
