import React from "react";
import {
  Box,
  Typography,
  Paper,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  IconButton,
  Avatar,
  Chip,
  alpha,
  useTheme,
  Button,
  Fab,
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonUnchecked,
  Close,
  Visibility,
  History,
  SmartToy, // Icon cho nút Action xanh lá
  Cancel,
  ErrorOutline,
  VisibilityOff,
} from "@mui/icons-material";

// Định nghĩa kiểu dữ liệu cho trạng thái ký
type SignStatus = "completed" | "pending";

interface SignerStepProps {
  label: string;
  name: string;
  status: SignStatus;
}
const getSteps = (item: any): SignerStepProps[] => {
  if (!item) return [];

  const steps: SignerStepProps[] = [];

  // 1. Đại diện đơn vị giao
  steps.push({
    label: "Đại diện đơn vị giao",
    name:
      item.tenDaiDienBenGiao ||
      item?.provider?.getNhanVienByID?.(item.idDaiDienBenGiao)?.hoTen ||
      "Chưa xác định",
    status: item.daiDienBenGiaoXacNhan ? "completed" : "pending",
  });

  // 2. Đại diện đơn vị nhận
  steps.push({
    label: "Đại diện đơn vị nhận",
    name:
      item.tenDaiDienBenNhan ||
      item?.provider?.getNhanVienByID?.(item.idDaiDienBenNhan)?.hoTen ||
      "Chưa xác định",
    status: item.daiDienBenNhanXacNhan ? "completed" : "pending",
  });

  // 3. Danh sách người đại diện (listSignatory)
  if (Array.isArray(item.listSignatory)) {
    item.listSignatory.forEach((e: any) => {
      steps.push({
        label: "Người đại diện",
        name: e.tenNguoiKy || "Chưa xác định",
        status: e.trangThai === 1 ? "completed" : "pending",
      });
    });
  }

  // 4. Giám đốc ký duyệt
  steps.push({
    label: "Giám đốc ký duyệt",
    name:
      item.tenGiamDoc ||
      item?.provider?.getNhanVienByID?.(item.idGiamDoc)?.hoTen ||
      "Chưa xác định",
    status: item.giamDocKy ? "completed" : "pending",
  });

  return steps;
};

export default function SignerSidebar({
  selectedRow,
  onClose,
}: {
  selectedRow: any;
  onClose: () => void;
}) {
  const theme = useTheme();

  // Chuyển đổi data từ row sang định dạng Stepper
  const dynamicSteps = React.useMemo(
    () => getSteps(selectedRow),
    [selectedRow],
  );

  if (!selectedRow) return null;
  if (!selectedRow) return null;

  const getStatusConfig = (status: SignStatus) => {
    switch (status) {
      case "completed":
        return {
          color: theme.palette.success.main,
          bgcolor: alpha(theme.palette.success.main, 0.08),
          borderColor: alpha(theme.palette.success.main, 0.3),
          icon: <CheckCircle color="success" />,
        };
      case "pending":
        return {
          color: theme.palette.warning.main,
          bgcolor: alpha(theme.palette.warning.main, 0.08),
          borderColor: alpha(theme.palette.warning.main, 0.3),
          icon: <History color="warning" />,
        };
      default: // future hoặc mặc định
        return {
          color: theme.palette.text.disabled,
          bgcolor: theme.palette.action.hover,
          borderColor: "transparent",
          icon: <RadioButtonUnchecked color="disabled" />,
        };
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        borderLeft: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
      }}
    >
      {/* 1. Header Sidebar */}
      <Box
        p={2}
        borderBottom="1px solid"
        borderColor="divider"
        display="flex"
        justifyContent="space-between"
        alignItems="start"
      >
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <ErrorOutline fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">
              Chi tiết Trạng thái ký "Biên bản {selectedRow?.id}"
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <VisibilityOff fontSize="small" />
        </IconButton>
      </Box>

      {/* 2. Content Scrollable */}
      <Box p={3} sx={{ flex: 1, overflowY: "auto" }}>
        {/* Stepper */}
        <Stepper orientation="vertical" activeStep={1}>
          {dynamicSteps.map((step, index) => {
            const config = getStatusConfig(step.status);

            return (
              <Step key={index} active={true} expanded={true}>
                <StepLabel icon={config.icon}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent
                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      mt: 1,
                      bgcolor: config.bgcolor,
                      border: "1px solid",
                      borderColor: config.borderColor,
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        color:
                          step.status === "pending"
                            ? "text.secondary"
                            : "text.primary",
                      }}
                    >
                      {step.name}
                    </Typography>
                  </Paper>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </Paper>
  );
}
