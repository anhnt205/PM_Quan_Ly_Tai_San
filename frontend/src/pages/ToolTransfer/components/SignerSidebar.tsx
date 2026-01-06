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
type SignStatus = "completed" | "pending" | "rejected" | "future";

interface SignerStepProps {
  label: string;
  name: string;
  status: SignStatus;
  date?: string;
}

// Mock data mô phỏng quy trình ký
const steps: SignerStepProps[] = [
  {
    label: "Người ký nháy",
    name: "Hoàng Đức Duy",
    status: "completed",
    date: "29/12/2025 15:30",
  },
  {
    label: "Trình duyệt cấp phòng",
    name: "Đỗ Ánh",
    status: "rejected", // Giả lập trạng thái bị từ chối/đang chờ xử lý lỗi
    date: "29/12/2025 16:00",
  },
  {
    label: "Trình duyệt ban giám đốc",
    name: "Hoàng Đức Duy",
    status: "future",
  },
];

export default function SignerSidebar({
  selectedRow,
  onClose,
}: {
  selectedRow: any;
  onClose: () => void;
}) {
  const theme = useTheme();

  if (!selectedRow) return null;

  // Hàm lấy màu sắc dựa trên trạng thái
  const getStatusConfig = (status: SignStatus) => {
    switch (status) {
      case "completed":
        return {
          color: theme.palette.success.main,
          bgcolor: alpha(theme.palette.success.main, 0.08),
          borderColor: alpha(theme.palette.success.main, 0.3),
          icon: <CheckCircle color="success" />,
        };
      case "rejected":
        return {
          color: theme.palette.error.main,
          bgcolor: alpha(theme.palette.error.main, 0.08),
          borderColor: alpha(theme.palette.error.main, 0.3),
          icon: <Cancel color="error" />,
        };
      case "pending":
        return {
          color: theme.palette.warning.main,
          bgcolor: alpha(theme.palette.warning.main, 0.08),
          borderColor: alpha(theme.palette.warning.main, 0.3),
          icon: <History color="warning" />,
        };
      default: // future
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
              Chi tiết Trạng thái ký
            </Typography>
          </Box>
          <Typography variant="subtitle1" fontWeight={700} color="primary.main">
            {selectedRow.SoQuyetDinh || "Chưa có số"}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <VisibilityOff fontSize="small" />
        </IconButton>
      </Box>

      {/* 2. Content Scrollable */}
      <Box p={3} sx={{ flex: 1, overflowY: "auto" }}>
        {/* Stepper */}
        <Stepper orientation="vertical" activeStep={1}>
          {steps.map((step, index) => {
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
                          step.status === "future"
                            ? "text.secondary"
                            : "text.primary",
                      }}
                    >
                      {step.name}
                    </Typography>

                    {step.date && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <History fontSize="inherit" /> {step.date}
                      </Typography>
                    )}
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
