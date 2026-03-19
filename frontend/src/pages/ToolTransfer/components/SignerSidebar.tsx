import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  alpha,
  useTheme,
} from "@mui/material";
import {
  ErrorOutline,
  VisibilityOff,
  CheckCircle,
  History,
  RadioButtonUnchecked,
  FiberManualRecord,
} from "@mui/icons-material";

type SignStatus = "completed" | "pending" | "info";

interface ThreadNode {
  header: string;
  subInfo?: string;
  depth: number;
  status?: SignStatus;
  isDone?: boolean;
}

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
      name: item.tenNguoiKyNhay || "Chưa xác định",
      status: item.trangThaiKyNhay ? "completed" : "pending",
      date: item.ngayKyNhay,
    });
  }

  // 2. Trình duyệt cấp phòng
  steps.push({
    label: "Trình duyệt cấp phòng",
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

  // 4. Trình duyệt ban giám đốc
  steps.push({
    label: "Trình duyệt ban giám đốc",
    name: item.tenTrinhDuyetGiamDoc || "Chưa xác định",
    status: item.trinhDuyetGiamDocXacNhan ? "completed" : "pending",
  });

  // 5. Trạng thái của phòng văn thư
  let vanThuName = "Ban hành";
  let vanThuStatus: SignStatus = "pending";

  if (item.trangThai === 4) {
    vanThuStatus = "completed";
  }

  steps.push({
    label: "Trạng thái của phòng văn thư",
    name: vanThuName,
    status: vanThuStatus,
  });

  return steps;
};

const getHandoverNodes = (
  item: any,
  handoverDetails: any[] = [],
): ThreadNode[] => {
  const nodes: ThreadNode[] = [];

  nodes.push({ header: "Chi tiết bàn giao", depth: 0 });

  const tools = item?.chiTietDieuDongCCDCVatTuDTOS || [];
  tools.forEach((tool: any) => {
    nodes.push({
      header: `${tool.tenCCDCVatTu} - SLX: ${tool.soLuongXuat}`,
      subInfo: `Số lượng đã bàn giao: ${tool.soLuongDaBanGiao || 0}`,
      depth: 1,
      status: "info",
    });

    const subItems = handoverDetails.filter((detail) => {
      return String(detail.idCCDCVatTu) === String(tool.idCCDCVatTu);
    });

    subItems.forEach((sub) => {
      nodes.push({
        header: `Số phiếu bàn giao: ${sub.idBanGiaoCCDCVatTu}`,
        subInfo: `Mã chi tiết CCDC - Vật tư:\n${sub.idChiTietCCDCVatTu}\nSố lượng bàn giao: ${sub.soLuong}`,
        depth: 2,
        status: "info",
      });
    });
  });

  return nodes;
};

const ThreadItem = ({
  node,
  isLast,
  hasMoreMainBranches,
}: {
  node: ThreadNode;
  isLast: boolean;
  hasMoreMainBranches: boolean;
}) => {
  const isHeader = node.depth === 0;
  const isDepth1 = node.depth === 1;
  const isDepth2 = node.depth === 2;

  return (
    <Box
      sx={{
        position: "relative",
        pl: node.depth * 1.5,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {(isDepth1 || (isDepth2 && hasMoreMainBranches)) && (
        <Box
          sx={{
            position: "absolute",
            left: 10,
            top: 0,
            bottom: isDepth1 && !hasMoreMainBranches ? "50%" : 0,
            width: "2px",
            bgcolor: "#bdbdbd",
            zIndex: 0,
          }}
        />
      )}

      {isDepth2 && (
        <>
          <Box
            sx={{
              position: "absolute",
              left: 34,
              top: 0,
              bottom: isLast ? "50%" : 0,
              width: "2px",
              bgcolor: "#bdbdbd",
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: 34,
              top: "50%",
              width: 12,
              height: "2px",
              bgcolor: "#bdbdbd",
            }}
          />
        </>
      )}

      {isDepth1 && (
        <Box
          sx={{
            position: "absolute",
            left: 10,
            top: "50%",
            width: 15,
            height: "2px",
            bgcolor: "#bdbdbd",
          }}
        />
      )}

      <Box sx={{ py: 0, pl: isHeader ? 0 : 2.5, my: 0.5 }}>
        {isHeader ? (
          <Box
            sx={{
              py: 1,
              px: 2,
              bgcolor: "background.paper",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {node.header}
            </Typography>
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: "10px",
              border: "1px solid",
              borderColor: isDepth2 ? "#f0f0f0" : "divider",
              bgcolor: isDepth2
                ? "background.paper"
                : node.isDone
                  ? "#f6ffed"
                  : "background.paper",
              position: "relative",
              zIndex: 1,
            }}
          >
            {isDepth2 && (
              <FiberManualRecord
                sx={{
                  position: "absolute",
                  left: -16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 10,
                  color: "#bdbdbd",
                  bgcolor: "background.paper",
                  borderRadius: "50%",
                  zIndex: 2,
                }}
              />
            )}

            <Typography
              variant="body2"
              fontWeight={600}
              sx={{
                color: isDepth2
                  ? "#444"
                  : node.status === "info"
                    ? "#e91e63"
                    : "#f4511e",
                fontSize: isDepth2 ? "12.5px" : "14px",
                lineHeight: 1.2,
              }}
            >
              {node.header}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: isDepth2 ? "#52c41a" : "#00bcd4",
                display: "block",
                mt: 0.5,
                whiteSpace: "pre-line",
                fontWeight: 500,
              }}
            >
              {node.subInfo}
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default function SignerSidebar({
  selectedRow,
  handoverDetails,
  onClose,
}: {
  selectedRow: any;
  handoverDetails: any[];
  onClose: () => void;
}) {
  const theme = useTheme();

  const dynamicSteps = React.useMemo(
    () => getSteps(selectedRow),
    [selectedRow],
  );

  const handoverNodes = React.useMemo(
    () => getHandoverNodes(selectedRow, handoverDetails),
    [selectedRow, handoverDetails],
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

      <Box p={2} sx={{ flex: 1, overflowY: "auto" }}>
        <ThreadItem
          node={{ header: "Trạng thái ký", depth: 0 }}
          isLast={false}
          hasMoreMainBranches={false}
        />
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
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
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

        {/* Phần Chi tiết bàn giao */}
        {handoverNodes.length > 0 && (
          <Box mt={2}>
            {handoverNodes.map((node, index) => {
              const hasMoreMainBranches = handoverNodes
                .slice(index + 1)
                .some((n) => n.depth === 1);

              const isLastInGroup =
                index === handoverNodes.length - 1 ||
                handoverNodes[index + 1].depth < node.depth;

              return (
                <ThreadItem
                  key={index}
                  node={node}
                  isLast={isLastInGroup}
                  hasMoreMainBranches={hasMoreMainBranches}
                />
              );
            })}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
