import React from "react";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import {
  CheckCircle,
  History,
  RadioButtonUnchecked,
  ErrorOutline,
  VisibilityOff,
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
      date: item.ngayKyNhay, // Nếu có field ngày, nếu không thì bỏ hoặc để undefined
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

  return steps;
};

const getHandoverNodes = (
  item: any,
  handoverDetails: any[] = [],
): ThreadNode[] => {
  const nodes: ThreadNode[] = [];

  // --- PHẦN 2: CHI TIẾT BÀN GIAO (Depth 0) ---
  nodes.push({ header: "Chi tiết bàn giao", depth: 0 });

  const tools = item.chiTietDieuDongCCDCVatTuDTOS || [];
  tools.forEach((tool: any) => {
    // Cấp 1: Tên vật tư (Màu Hồng)
    nodes.push({
      header: `${tool.tenCCDCVatTu} -- SLX: ${tool.soLuongXuat}`,
      subInfo: `Số lượng đã bàn giao: ${tool.soLuongDaBanGiao || 0}`,
      depth: 1,
      status: "info",
    });

    // Cấp 2: Các phiếu bàn giao con (Lọc từ API mới dựa trên idCCDCVatTu)
    const subItems = handoverDetails.filter(
      (detail) => detail.idCCDCVatTu === tool.idCCDCVatTu,
    );

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
      {/* 1. ĐƯỜNG DỌC CHÍNH (Trunk - vị trí 10) */}
      {/* Logic: Chỉ vẽ nếu là nhánh chính (D1) HOẶC là nhánh con (D2) nhưng phía sau vẫn còn các nhóm D1 khác */}
      {(isDepth1 || (isDepth2 && hasMoreMainBranches)) && (
        <Box
          sx={{
            position: "absolute",
            left: 10,
            top: 0,
            // Nếu là mục D1 cuối cùng của danh sách, dừng ở giữa (50%)
            // Nếu không, kẻ suốt (0) để nối xuống các nhóm bên dưới
            bottom: isDepth1 && !hasMoreMainBranches ? "50%" : 0,
            width: "2px",
            bgcolor: "#bdbdbd",
            zIndex: 0,
          }}
        />
      )}

      {/* 2. ĐƯỜNG DỌC PHỤ (Vị trí 34 - nối các con Depth 2) */}
      {isDepth2 && (
        <>
          <Box
            sx={{
              position: "absolute",
              left: 34,
              top: 0,
              // Dừng ở 50% nếu là phần tử cuối cùng của nhóm con
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

      {/* 3. NHÁNH NGANG CHO DEPTH 1 */}
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

      {/* NỘI DUNG CHÍNH (Phần Paper giữ nguyên nhưng sửa FiberManualRecord) */}
      <Box sx={{ py: 0, pl: isHeader ? 0 : 2.5, my: 0.5 }}>
        {isHeader ? (
          <Box
            sx={{
              py: 1,
              px: 2,
              bgcolor: "#fff",
              borderRadius: "8px",
              border: "1px solid #eee",
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
              borderColor: isDepth2 ? "#f0f0f0" : "#e0e0e0",
              bgcolor: isDepth2 ? "#fff" : node.isDone ? "#f6ffed" : "#fff",
              position: "relative",
              zIndex: 1,
            }}
          >
            {isDepth2 && (
              <FiberManualRecord
                sx={{
                  position: "absolute",
                  left: -16, // Đã chỉnh sang -16 theo bạn thấy đúng
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 10,
                  color: "#bdbdbd",
                  bgcolor: "#fff",
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
      }}
    >
      <Box
        p={2}
        borderBottom="1px solid"
        borderColor="divider"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#fff"
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
        <Stepper orientation="vertical">
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

        {/* Phần Chi tiết bàn giao giữ nguyên */}
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
    </Paper>
  );
}
