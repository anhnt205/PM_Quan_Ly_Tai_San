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
  isSimpleDot?: boolean;
}

const getSteps = (item: any): SignerStepProps[] => {
  if (!item) return [];

  const steps: SignerStepProps[] = [];

  // 1. Người ký nháy
  if (item.nguoiLapPhieuKyNhay) {
    steps.push({
      label: "Người ký nháy",
      name: item.tenNguoiKyNhay || "Chưa xác định",
      status: item.trangThaiKyNhay ? "completed" : "pending",
      date: item.ngayKyNhay,
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

  // 4. Trình duyệt cấp phòng
  steps.push({
    label: "Trình duyệt cấp phòng",
    name: item.tenTrinhDuyetCapPhong || "Chưa xác định",
    status: item.trinhDuyetCapPhongXacNhan ? "completed" : "pending",
  });

  // 5. Danh sách người đại diện
  if (item.nguoiKyList && Array.isArray(item.nguoiKyList)) {
    item.nguoiKyList.forEach((e: any) => {
      steps.push({
        label: "Người đại diện",
        name: e.tenNguoiKy || "Chưa xác định",
        status: e.trangThai === 1 ? "completed" : "pending",
      });
    });
  }

  // 6. Trình duyệt ban giám đốc
  steps.push({
    label: "Trình duyệt ban giám đốc",
    name: item.tenTrinhDuyetGiamDoc || "Chưa xác định",
    status: item.trinhDuyetGiamDocXacNhan ? "completed" : "pending",
  });

  // 7. Trạng thái của phòng văn thư
  let vanThuName = "Ban hành";
  let vanThuStatus: SignStatus = "pending";

  if (item.trangThai === 4) {
    vanThuName = "Ban hành";
    vanThuStatus = "completed";
  }

  steps.push({
    label: "Trạng thái của phòng văn thư",
    name: vanThuName,
    status: vanThuStatus,
    isSimpleDot: true,
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

  const dynamicSteps = React.useMemo(
    () => getSteps(selectedRow),
    [selectedRow],
  );

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
        minHeight: "500px",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* Header Sidebar */}
      <Box
        p={2}
        borderBottom="1px solid"
        borderColor="divider"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="background.paper"
        sx={{ flexShrink: 0, zIndex: 10 }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <ErrorOutline fontSize="small" color="action" />
          <Typography variant="subtitle2" color="text.secondary">
            Chi tiết Trạng thái ký "Biên bản {selectedRow?.id}"
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <VisibilityOff fontSize="small" />
        </IconButton>
      </Box>

      {/* Content Scrollable */}
      <Box p={2} sx={{ flex: 1, overflowY: "auto" }}>
        <Stepper
          orientation="vertical"
          connector={null}
          sx={{
            px: 1,
            "& .MuiStep-root": {
              position: "relative",
            },
            "& .MuiStepContent-root": {
              ml: 1.5,
              pl: 3.5,
              pr: 0,
              borderLeft: "2px solid",
              position: "relative",
            },
          }}
        >
          {dynamicSteps.map((step, index) => {
            const config = getStatusConfig(step.status);
            const isLast = index === dynamicSteps.length - 1;

            return (
              <Step key={index} active={true} expanded={true}>
                <StepLabel
                  icon={config.icon}
                  sx={{
                    py: 0.5,
                    "& .MuiStepLabel-label": { mt: "4px !important" },
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={700}
                  >
                    {step.label}
                  </Typography>
                </StepLabel>

                <StepContent
                  sx={{
                    borderColor: `${config.color} !important`,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 27,
                      width: 18,
                      height: "2px",
                      backgroundColor: config.color,
                    },
                    ...(isLast
                      ? {
                          borderLeft: "none !important",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            left: -2,
                            top: 0,
                            height: 28,
                            width: "2px",
                            backgroundColor: config.color,
                          },
                        }
                      : {}),
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      width: "100%",
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
                        lineHeight: 1.2,
                      }}
                    >
                      {step.name}
                    </Typography>

                    {step.date && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                        }}
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
