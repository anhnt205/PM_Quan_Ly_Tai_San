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
  alpha,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonUnchecked,
  History,
  ErrorOutline,
  VisibilityOff,
} from "@mui/icons-material";

type SignStatus = "completed" | "pending";

interface SignerStepProps {
  label: string;
  name: string;
  status: SignStatus;
  date?: string;
}

const getSteps = (item: any): SignerStepProps[] => {
  if (!item) return [];

  const steps: SignerStepProps[] = [];

  // 1. Người lập phiếu ký nháy
  if (item.nguoiLapPhieuKyNhay) {
    steps.push({
      label: "Người ký nháy",
      name: item.tenNguoiKyNhay || "Chưa xác định",
      status: item.trangThaiKyNhay ? "completed" : "pending",
      date: item.ngayKyNhay,
    });
  }

  // 2. Người duyệt cấp phòng
  steps.push({
    label: "Người duyệt",
    name: item.tenTrinhDuyetCapPhong || "Chưa xác định",
    status: item.trinhDuyetCapPhongXacNhan ? "completed" : "pending",
  });

  // 3. Danh sách người đại diện
  if (item.nguoiKyList && Array.isArray(item.nguoiKyList)) {
    item.nguoiKyList.forEach((e: any) => {
      steps.push({
        label: "Người đại diện",
        name: e.tenNguoiKy || "Chưa xác định",
        status: e.trangThai === 1 ? "completed" : "pending",
      });
    });
  }

  // 4. Người phê duyệt ban giám đốc
  steps.push({
    label: "Người phê duyệt",
    name: item.tenTrinhDuyetGiamDoc || "Chưa xác định",
    status: item.trinhDuyetGiamDocXacNhan ? "completed" : "pending",
  });

  return steps;
};

export default function MaintenanceRepairDetailSidebar({
  selectedRepair,
  onClose,
}: {
  selectedRepair: any;
  onClose: () => void;
}) {
  const theme = useTheme();

  const dynamicSteps = React.useMemo(
    () => getSteps(selectedRepair),
    [selectedRepair],
  );

  if (!selectedRepair) return null;

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
      default:
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
      {/* Header */}
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
              Chi tiết Trạng thái ký "{selectedRepair?.id}"
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <VisibilityOff fontSize="small" />
        </IconButton>
      </Box>

      {/* Content Scrollable */}
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
