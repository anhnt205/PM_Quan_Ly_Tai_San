import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Alert,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { SignItem } from "../../hooks/useSignBatch";

interface SignBatchModalProps {
  open: boolean;
  items: SignItem[];
  onClose: () => void;
}

export const SignBatchModal: React.FC<SignBatchModalProps> = ({
  open,
  items,
  onClose,
}) => {
  const successItems = items.filter((i) => i.status === "success");
  const errorItems = items.filter((i) => i.status === "error");

  const successCount = successItems.length;
  const errorCount = errorItems.length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "450px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Tổng hợp kết quả ký lô biên bản
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ flex: 1, overflow: "auto" }}>
        {/* Status header alert */}
        {items.length > 0 && (
          <Alert
            severity={errorCount > 0 ? "warning" : "success"}
            sx={{ mb: 2 }}
          >
            <Typography variant="body2" fontWeight={600}>
              {errorCount > 0
                ? `Hoàn tất ký duyệt: ${successCount} thành công, ${errorCount} thất bại.`
                : "✓ Ký lô biên bản thành công tất cả!"}
            </Typography>
          </Alert>
        )}

        {/* 2-Column Summary statistics boxes */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            mb: 2,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              p: 1.5,
              bgcolor: "success.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "success.100",
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Thành công
            </Typography>
            <Typography variant="h5" color="success.main" fontWeight={700} sx={{ mt: 0.5 }}>
              {successCount}
            </Typography>
          </Box>
          <Box
            sx={{
              textAlign: "center",
              p: 1.5,
              bgcolor: "error.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "error.100",
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Thất bại
            </Typography>
            <Typography variant="h5" color="error.main" fontWeight={700} sx={{ mt: 0.5 }}>
              {errorCount}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ponytail: 2-column list layout showing successful on left and failed on right */}
        <Box sx={{ display: "flex", gap: 2, minHeight: "220px" }}>
          {/* Cột Thành công */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                p: 1,
                bgcolor: "success.50",
                borderRadius: 1,
              }}
            >
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={600} color="success.main" sx={{ ml: 1 }}>
                Danh sách thành công ({successCount})
              </Typography>
            </Box>
            <List
              sx={{
                flex: 1,
                overflow: "auto",
                maxHeight: "220px",
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                p: 0,
              }}
            >
              {successItems.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    py: 1,
                    px: 1.5,
                    borderBottom: "1px solid #f0f0f0",
                    bgcolor: "rgba(76, 175, 80, 0.02)",
                  }}
                >
                  <ListItemText
                    primary={item.id}
                    primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                  />
                </ListItem>
              ))}
              {successItems.length === 0 && (
                <Typography variant="caption" color="text.disabled" sx={{ p: 2, display: "block", textAlign: "center" }}>
                  Chưa có tài liệu thành công
                </Typography>
              )}
            </List>
          </Box>

          {/* Cột Thất bại */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                p: 1,
                bgcolor: "error.50",
                borderRadius: 1,
              }}
            >
              <ErrorIcon color="error" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={600} color="error.main" sx={{ ml: 1 }}>
                Danh sách thất bại ({errorCount})
              </Typography>
            </Box>
            <List
              sx={{
                flex: 1,
                overflow: "auto",
                maxHeight: "220px",
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                p: 0,
              }}
            >
              {errorItems.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    py: 1,
                    px: 1.5,
                    borderBottom: "1px solid #f0f0f0",
                    bgcolor: "rgba(244, 67, 54, 0.02)",
                  }}
                >
                  <ListItemText
                    primary={item.id}
                    primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                    secondary={item.errorMessage}
                    secondaryTypographyProps={{ variant: "caption", color: "error.main" }}
                  />
                </ListItem>
              ))}
              {errorItems.length === 0 && (
                <Typography variant="caption" color="text.disabled" sx={{ p: 2, display: "block", textAlign: "center" }}>
                  Chưa có tài liệu thất bại
                </Typography>
              )}
            </List>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: "rgba(0, 0, 0, 0.12)",
            color: "text.primary",
            "&:hover": {
              borderColor: "rgba(0, 0, 0, 0.24)",
              bgcolor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
