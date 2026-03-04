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

  // 1. Người ký nháy
  if (item.nguoiLapPhieuKyNhay) {
    steps.push({
      label: "Người ký nháy",
      name: item.tenNguoiKyNhay || "Chưa xác định", // Giả định field name
      status: item.trangThaiKyNhay ? "completed" : "pending",
      date: item.ngayKyNhay, // Giả định có field ngày
    });
  }

  // 2. Trưởng phòng xác nhận
  if (item.quanTrongCanXacNhan) {
    steps.push({
      label: "Trưởng phòng xác nhận",
      name: item.tenTruongPhongDonViGiao || "Chưa xác định",
      status: item.truongPhongDonViGiaoXacNhan ? "completed" : "pending",
    });
  }

  // 3. Phó phòng xác nhận
  if (item.phoPhongDonViGiaoXacNhan) {
    steps.push({
      label: "Phó phòng xác nhận",
      name: item.tenPhoPhongDonViGiao || "Chưa xác định",
      status: item.phoPhongDonViGiaoXacNhan ? "completed" : "pending",
    });
  }

  // 4. Trình duyệt cấp phòng (Luôn hiển thị theo code Flutter)
  steps.push({
    label: "Trình duyệt cấp phòng",
    name: item.tenTrinhDuyetCapPhong || "Chưa xác định",
    status: item.trinhDuyetCapPhongXacNhan ? "completed" : "pending",
  });

  // 5. Danh sách người đại diện (Map từ listSignatory)
  if (item.nguoiKyList && Array.isArray(item.nguoiKyList)) {
    item.nguoiKyList.forEach((e: any) => {
      steps.push({
        label: "Người đại diện",
        name: e.tenNguoiKy || "",
        status: e.trangThai === 1 ? "completed" : "pending",
      });
    });
  }

  // 6. Trình duyệt ban giám đốc (Luôn hiển thị)
  steps.push({
    label: "Trình duyệt ban giám đốc",
    name: item.tenTrinhDuyetGiamDoc || "Chưa xác định",
    status: item.trinhDuyetGiamDocXacNhan ? "completed" : "pending",
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
