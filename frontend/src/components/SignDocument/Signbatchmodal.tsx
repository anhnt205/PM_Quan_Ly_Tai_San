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
  ListItemIcon,
  Button,
  CircularProgress,
  Typography,
  Chip,
  Alert,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as PendingIcon,
} from "@mui/icons-material";
import { SignItem } from "../../hooks/useSignBatch";
import { findById } from "../../utils/helpers";
import { SignaturesData } from "./types";
import { getAutoSignatureType } from "../../pages/Maintenance/config";
import { handleSigning } from "../../utils/efySigning";
import dayjs from "dayjs";
import { showErrorAlert } from "../Alert";

interface SignBatchModalProps {
  open: boolean;
  items: SignItem[];
  isProcessing: boolean;
  onSign: (data: any[], item: any) => void;
  onClose: () => void;
  generatePdf: (
    item: any,
    staffs: any[],
    departments: any[],
    positions: any[],
  ) => Promise<{
    pdf: Uint8Array;
    coordinates: Record<string, { xRatio: number; yRatio: number; page?: number }>;
  }>;
  staffs: any[];
  departments: any[];
  positions: any[];
  user: any;
}

export const SignBatchModal: React.FC<SignBatchModalProps> = ({
  open,
  items,
  isProcessing,
  onSign,
  onClose,
  generatePdf,
  staffs,
  departments,
  positions,
  user,
}) => {
  const successCount = items.filter((i) => i.status === "success").length;
  const errorCount = items.filter((i) => i.status === "error").length;
  const pendingCount = items.filter((i) => i.status === "pending").length;

  const allSigned = pendingCount === 0 && errorCount === 0;

  const getStatusIcon = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "success":
        return <CheckCircleIcon sx={{ color: "success.main" }} />;
      case "error":
        return <ErrorIcon sx={{ color: "error.main" }} />;
      case "pending":
        return <PendingIcon sx={{ color: "warning.main" }} />;
    }
  };

  const getStatusLabel = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "success":
        return "Ký thành công";
      case "error":
        return "Ký thất bại";
      case "pending":
        return "Chờ ký";
    }
  };

  const getStatusColor = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "pending":
        return "warning";
    }
  };

  const handleSignBatch = async () => {
    try {
      const employee = findById(staffs, user?.taiKhoan?.tenDangNhap);
      if (!employee)
        return showErrorAlert("Không tìm thấy thông tin nhân viên");

      for (const item of items) {
        const id = item.id;
        if (!item)
          return showErrorAlert(`Không tìm thấy dữ liệu cho ID: ${id}`);

        const signatureType = getAutoSignatureType(employee);
        if (signatureType === 0)
          return showErrorAlert("Bạn chưa thiết lập loại chữ ký hợp lệ.");

        let chuKySo = "";
        if ([3, 4, 5].includes(signatureType)) {
          if (!employee.savePin) {
            return showErrorAlert(
              `Bạn chưa lưu mã PIN để thực hiện ký số lô cho tài liệu ${id}`,
            );
          }
          const hash = await handleSigning(user?.taiKhoan?.tenDangNhap, id);
          if (!hash) return showErrorAlert("Ký số EFY thất bại");
          chuKySo = hash;
        }

        const result = await generatePdf(item, staffs, departments, positions);
        const coords = result.coordinates[user?.taiKhoan?.tenDangNhap] ?? {
          xRatio: 0.2,
          yRatio: 0.8,
          page: 1,
        };
        const displayWidth = 800;
        const baseWidthPx = 120;

        const signatureData: SignaturesData = {
          stt: 1,
          id: `temp-${Date.now()}`,
          idTaiLieu: id,
          idNguoiKy: user?.taiKhoan?.tenDangNhap,
          loaiKy: signatureType,
          ngayKy: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          x: coords.xRatio,
          y: coords.yRatio,
          page: coords.page || 1,
          chuKyNhay:
            (signatureType === 1 || signatureType === 5) && employee.chuKyNhay,
          chuKyThuong:
            (signatureType === 2 || signatureType === 4) &&
            employee.chuKyThuong,
          width: baseWidthPx,
          widthRatio: baseWidthPx / displayWidth,
          scale: signatureType === 2 || signatureType === 4 ? 2 : 1,
          chuKySo: chuKySo,
          isLocked: false,
        };

        await onSign([signatureData], item);
      }
      onClose();
    } catch (error) {
      console.error("Lỗi ký biên bản lô:", error);
      throw error;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Ký lô biên bản
          </Typography>
          {isProcessing && <CircularProgress size={24} />}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ flex: 1, overflow: "auto" }}>
        {/* Summary stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 1,
            mb: 2,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              p: 1,
              bgcolor: "warning.50",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Chờ ký
            </Typography>
            <Typography variant="h6" color="warning.main" fontWeight={600}>
              {pendingCount}
            </Typography>
          </Box>
          <Box
            sx={{
              textAlign: "center",
              p: 1,
              bgcolor: "success.50",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Thành công
            </Typography>
            <Typography variant="h6" color="success.main" fontWeight={600}>
              {successCount}
            </Typography>
          </Box>
          <Box
            sx={{
              textAlign: "center",
              p: 1,
              bgcolor: "error.50",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Lỗi
            </Typography>
            <Typography variant="h6" color="error.main" fontWeight={600}>
              {errorCount}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Items list */}
        <List sx={{ maxHeight: "300px", overflow: "auto" }}>
          {items.map((item, idx) => (
            <React.Fragment key={item.id}>
              <ListItem
                sx={{
                  py: 1.5,
                  px: 0,
                  backgroundColor:
                    item.status === "success"
                      ? "rgba(76, 175, 80, 0.05)"
                      : item.status === "error"
                        ? "rgba(244, 67, 54, 0.05)"
                        : "transparent",
                  borderRadius: 1,
                  mb: 1,
                  transition: "all 0.3s ease",
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getStatusIcon(item.status)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {item.id}
                      </Typography>
                      <Chip
                        label={getStatusLabel(item.status)}
                        size="small"
                        color={getStatusColor(item.status)}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    item.errorMessage && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {item.errorMessage}
                      </Typography>
                    )
                  }
                />
              </ListItem>
              {idx < items.length - 1 && <Divider sx={{ my: 0.5 }} />}
            </React.Fragment>
          ))}
        </List>

        {/* Success message when all done */}
        {allSigned && items.length > 0 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={500}>
              ✓ Ký lô biên bản thành công!
            </Typography>
            <Typography
              variant="caption"
              color="inherit"
              sx={{ display: "block", mt: 0.5 }}
            >
              Tất cả {items.length} biên bản đã được ký duyệt
            </Typography>
          </Alert>
        )}

        {errorCount > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={500}>
              ⚠ Có {errorCount} biên bản ký thất bại
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions
        sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Button
          onClick={onClose}
          disabled={isProcessing && pendingCount > 0}
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
          {allSigned ? "Đóng" : "Hủy"}
        </Button>
        {!allSigned && (
          <Button
            onClick={handleSignBatch}
            disabled={isProcessing || items.length === 0}
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#04b46e",
              boxShadow: "0 2px 8px rgba(4, 180, 110, 0.25)",
              "&:hover": {
                bgcolor: "#038d56",
                boxShadow: "0 4px 12px rgba(4, 180, 110, 0.35)",
              },
            }}
          >
            {isProcessing ? "Đang ký..." : "Xác nhận ký"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
