import React, { useState, useMemo, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import api from "../../../../config/api.config";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Checkbox,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckIcon from "@mui/icons-material/Check";
import { months, maintenanceLevelColors } from "../../../../mockdata/mockPlans";
import type {
  AcceptanceTestRecord,
  MaterialQualityRecord,
  TechnicalInspectionRecord,
} from "../../../../mockdata/mockInspectionRecords";

import RepairRequestDialog from "../dialog/RepairRequestDialog";
import InspectionRecordDialog from "../dialog/InspectionRecordDialog";
import InspectionRecordVehicleDialog from "../dialog/InspectionRecordVehicleDialog";
import AcceptanceTestDialog from "../dialog/AcceptanceTestDialog";
import MaterialDialog from "../dialog/MaterialDialog";
import BienPhapMayMocDialog from "../dialog/BienPhapMayMocDialog";
import BienPhapPhuongTienDialog from "../dialog/BienPhapPhuongTienDialog";
import NghiemThuPhuongTienDialog from "../dialog/NghiemThuPhuongTienDialog";
import { InspectionRecordData, MaintenancePlanData } from "../../types";
import { DanhGiaVatTuData, MaintenanceRepairData } from "../../types";
import {
  useMaintenanceAcceptanceByBienPhapQuery,
  useMaintenanceInspectionMutation,
  useMaintenanceMaterialAssessmentByInspectionQuery,
  useMaintenancePlanningDetailsByMonthQuery,
  useMaintenanceRepairByPlanQuery,
  useMaintenanceRepairMutation,
  useMaintenanceAcceptanceTestMutation,
  useMaintenanceAcceptanceTestVehicleMutation,
  useMaintenanceAcceptanceVehicleByBienPhapQuery,
  useMaintenanceMaterialAssessmentMutation,
  useMaintenanceInspectionByBienBanQuery,
  useMaintenanceVehicleInspectionByBienBanQuery,
  useMaintenanceVehicleInspectionMutation,
} from "../../mutation";
import {
  useBienPhapMayMocByGiamDinhQuery,
  useBienPhapMayMocMutation,
} from "../../mutation/bienPhapMayMoc";
import {
  useBienPhapPhuongTienByGiamDinhQuery,
  useBienPhapPhuongTienMutation,
} from "../../mutation/bienPhapPhuongTien";
import { showStatus } from "../../config";
import { DeleteIcon, EditIcon, TrashIcon } from "lucide-react";
import { showConfirmAlert } from "../../../../components/Alert";
import { AssetGroup } from "../../../../utils/const";

interface Props {
  plan: MaintenancePlanData;
  inspectionRecords: TechnicalInspectionRecord[];
  acceptanceTestRecords: AcceptanceTestRecord[];
  materialQualityRecords: MaterialQualityRecord[];
  onClose: () => void;
  onCreateInspectionRecord: (record: TechnicalInspectionRecord) => void;
  onCreateAcceptanceRecord: (record: AcceptanceTestRecord) => void;
  onCreateMaterialQualityRecord: (record: MaterialQualityRecord) => void;
}

const ROW_H = 36;
const CONNECTOR_WIDTH = 16;
const MAX_DEPTH = 4;
const INDENT_SPACE = CONNECTOR_WIDTH * MAX_DEPTH;

interface TreeConnectorProps {
  depth: number;
  isLast: boolean;
  rowHeight?: number;
}

const TreeConnector = ({
  depth,
  isLast,
  rowHeight = 36,
}: TreeConnectorProps) => {
  const lineColor =
    ["#90caf9", "#a5d6a7", "#ffcc80", "#ce93d8"][depth - 1] ?? "#bdbdbd";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        height: rowHeight,
        flexShrink: 0,
      }}
    >
      {Array.from({ length: depth - 1 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: CONNECTOR_WIDTH,
            flexShrink: 0,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              left: CONNECTOR_WIDTH / 2 - 0.75,
              top: 0,
              bottom: 0,
              width: 1.5,
              bgcolor: lineColor,
              opacity: 0.5,
            },
          }}
        />
      ))}
      <Box sx={{ width: CONNECTOR_WIDTH, flexShrink: 0, position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            left: CONNECTOR_WIDTH / 2 - 0.75,
            top: 0,
            height: isLast ? "50%" : "100%",
            width: 1.5,
            bgcolor: lineColor,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: CONNECTOR_WIDTH / 2 - 0.75,
            top: "50%",
            width: CONNECTOR_WIDTH / 2 + 0.75,
            height: 1.5,
            bgcolor: lineColor,
            transform: "translateY(-50%)",
          }}
        />
      </Box>
    </Box>
  );
};

interface ActionCellProps {
  onAdd?: () => void;
  isAdd?: boolean;
  addTooltip?: string;
  addColor?: "primary" | "success" | "warning" | "secondary" | "error";
  onEdit?: () => void;
  isEdit?: boolean;
  editTooltip?: string;
  editColor?: "primary" | "success" | "warning" | "secondary" | "error";
  onDelete?: () => void;
  isDelete?: boolean;
}

const ActionCell = ({
  onAdd,
  isAdd = true,
  addTooltip = "Tạo biên bản",
  addColor = "primary",
  onEdit,
  isEdit,
  editTooltip,
  editColor,
  onDelete,
  isDelete,
}: ActionCellProps) => (
  <Box
    sx={{
      display: "flex",
      gap: 0.5,
      justifyContent: "flex-end",
      alignItems: "center",
    }}
  >
    {" "}
    {onEdit && (
      <Tooltip title={editTooltip} placement="top">
        <IconButton
          size="small"
          color={editColor}
          disabled={!isEdit}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <EditIcon color="#1976d2" size={16} />
        </IconButton>
      </Tooltip>
    )}
    {onAdd && (
      <Tooltip title={addTooltip} placement="top">
        <IconButton
          size="small"
          color={addColor}
          disabled={!isAdd}
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    )}
    {onDelete && (
      <Tooltip title="Xóa" placement="top">
        <IconButton
          size="small"
          disabled={!isDelete}
          onClick={(e) => {
            e.stopPropagation();
            showConfirmAlert("Bạn có chắc chắn muốn xóa không?").then(
              (isConfirm) => {
                if (isConfirm.isConfirmed) {
                  onDelete();
                }
              },
            );
          }}
        >
          <TrashIcon color="#ef4444" size={16} />
        </IconButton>
      </Tooltip>
    )}
  </Box>
);

// ── Component chính ───────────────────────────────────────
const PlanDetailPanel = ({ plan, onClose }: Props) => {
  const [tab, setTab] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([
    new Date().getMonth(),
  ]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [repairDialogOpen, setRepairDialogOpen] = useState(false);
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);

  const [expandedRequests, setExpandedRequests] = useState<string | null>(null);
  const [expandedInspections, setExpandedInspections] = useState<string | null>(
    null,
  );
  const [expandedBienPhap, setExpandedBienPhap] = useState<string | null>(null);
  const [expandedAcceptances, setExpandedAcceptances] = useState<string | null>(
    null,
  );

  const [inspectionParentReqId, setInspectionParentReqId] = useState<
    string | null
  >(null);
  // Biện pháp
  const [bienPhapParentInspId, setBienPhapParentInspId] = useState<
    string | null
  >(null);
  const [selectedBienPhap, setSelectedBienPhap] = useState<any | null>(null);
  // Nghiệm thu (cha là biện pháp)
  const [acceptanceParentBienPhapId, setAcceptanceParentBienPhapId] = useState<
    string | null
  >(null);
  const [materialParentAccId, setMaterialParentAccId] = useState<string | null>(
    null,
  );
  const [selectedMaterialAssessment, setSelectedMaterialAssessment] =
    useState<DanhGiaVatTuData | null>(null);

  const [selectedReq, setSelectedReq] = useState<MaintenanceRepairData | null>(
    null,
  );
  const [selectedIns, setSelectedIns] = useState<InspectionRecordData | null>(
    null,
  );

  const [selectedAcc, setSelectedAcc] = useState<any | null>(null);
  const [acceptanceDialogOpen, setAcceptanceDialogOpen] = useState(false);

  // sua chua
  const {
    createMutation: createRepairMutation,
    updateMutation: updateRepairMutation,
    deleteMutation: deleteRepairMutation,
    updateManyMutation: updateManyRepairMutation,
  } = useMaintenanceRepairMutation();
  const { deleteMutation: deleteInspectionMutation } =
    useMaintenanceInspectionMutation();
  const { deleteMutation: deleteInspectionVehicleMutation } =
    useMaintenanceVehicleInspectionMutation();
  const { deleteMutation: deleteBienPhapMayMocMutation } =
    useBienPhapMayMocMutation();
  const { deleteMutation: deleteBienPhapPhuongTienMutation } =
    useBienPhapPhuongTienMutation();
  const { deleteMutation: deleteAcceptanceMutation } =
    useMaintenanceAcceptanceTestMutation();
  const { deleteMutation: deleteAcceptanceVehicleMutation } =
    useMaintenanceAcceptanceTestVehicleMutation();
  const { deleteMutation: deleteMaterialAssessmentMutation } =
    useMaintenanceMaterialAssessmentMutation();

  useEffect(() => {
    setExpandedRequests(null);
    setExpandedInspections(null);
    setExpandedBienPhap(null);
    setExpandedAcceptances(null);
    setSelectedDeviceIds([]);
    setInspectionParentReqId(null);
    setBienPhapParentInspId(null);
    setSelectedBienPhap(null);
    setAcceptanceParentBienPhapId(null);
    setMaterialParentAccId(null);
    setSelectedMaterialAssessment(null);
  }, [plan?.id]);

  const results = useQueries({
    queries: selectedMonths.map((thang) => ({
      queryKey: ["maintenancePlanningDetailsByMonth", plan?.id, thang + 1],
      queryFn: async () => {
        const res = await api.get(
          `kehoachsuachua-chitiet-taisan/kehoach/${plan?.id}/thang/${thang + 1}`,
        );
        return res.data.data || res.data || [];
      },
      enabled: !!plan?.id,
    })),
  });

  const allMonthsData = useMemo(() => {
    return results.map((r) => r.data || []);
  }, [results]);

  const mergedDevices = useMemo(() => {
    const devicesMap: Record<string, any> = {};

    selectedMonths.forEach((thangIdx, queryIdx) => {
      const monthData = allMonthsData[queryIdx] || [];
      monthData.forEach((item: any) => {
        const key = item.idTaiSan;
        if (!devicesMap[key]) {
          devicesMap[key] = {
            id: item.id,
            idTaiSan: item.idTaiSan,
            tenTaiSan: item.tenTaiSan,
            idNhomTaiSan: item.idNhomTaiSan,
            soLuong: item.soLuong,
            monthlyData: {},
          };
        }
        devicesMap[key].monthlyData[thangIdx] = {
          id: item.id,
          capSuaChua: item.capSuaChua,
          daCoLenhSuaChua: item.daCoLenhSuaChua,
        };
      });
    });

    return Object.values(devicesMap);
  }, [selectedMonths, allMonthsData]);

  const { data: maintenanceRepairByPlan = [] } =
    useMaintenanceRepairByPlanQuery(plan?.id);

  // Giám định máy móc theo yêu cầu đang expand
  const { data: inspectionMachineRecords = [] } =
    useMaintenanceInspectionByBienBanQuery(
      expandedRequests || "",
      plan?.nhomTaiSan === AssetGroup.MAYMOC,
    );

  // Giám định phương tiện theo yêu cầu đang expand
  const { data: inspectionVehicleRecords = [] } =
    useMaintenanceVehicleInspectionByBienBanQuery(
      expandedRequests || "",
      plan?.nhomTaiSan === AssetGroup.PHUONGTIEN,
    );
  const inspectionRecords =
    plan?.nhomTaiSan === AssetGroup.MAYMOC
      ? inspectionMachineRecords
      : inspectionVehicleRecords;

  // Biện pháp theo giám định đang expand
  const { data: bienPhapMayMocRecords = [] } = useBienPhapMayMocByGiamDinhQuery(
    plan?.nhomTaiSan === AssetGroup.MAYMOC ? expandedInspections || "" : "",
  );
  const { data: bienPhapPhuongTienRecords = [] } =
    useBienPhapPhuongTienByGiamDinhQuery(
      plan?.nhomTaiSan === AssetGroup.PHUONGTIEN
        ? expandedInspections || ""
        : "",
    );
  const bienPhapRecords =
    plan?.nhomTaiSan === AssetGroup.MAYMOC
      ? bienPhapMayMocRecords
      : bienPhapPhuongTienRecords;

  // Nghiệm thu theo biện pháp đang expand
  const { data: acceptanceTestRecords = [] } =
    useMaintenanceAcceptanceByBienPhapQuery(expandedBienPhap || "");

  // Nghiệm thu phương tiện theo biện pháp đang expand
  const { data: acceptanceTestVehicleRecords = [] } =
    useMaintenanceAcceptanceVehicleByBienPhapQuery(expandedBienPhap || "");

  const acceptanceRecords =
    plan?.nhomTaiSan === AssetGroup.MAYMOC
      ? acceptanceTestRecords
      : acceptanceTestVehicleRecords;

  const { data: materialQualityRecords = [] } =
    useMaintenanceMaterialAssessmentByInspectionQuery(
      expandedAcceptances || "",
    );

  const availableDevices = useMemo(() => {
    if (selectedMonths.length > 1) return [];
    const singleMonthIdx = selectedMonths[0];
    return mergedDevices.filter((d: any) => {
      const mData = d.monthlyData[singleMonthIdx];
      return mData && mData.daCoLenhSuaChua !== 1;
    });
  }, [mergedDevices, selectedMonths]);

  const handleToggle = (id: string) => {
    const isVehicle = plan?.nhomTaiSan === AssetGroup.PHUONGTIEN;
    setSelectedDeviceIds((prev) => {
      if (isVehicle) {
        return prev.includes(id) ? [] : [id];
      }
      return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const handleSelectAll = () =>
    setSelectedDeviceIds(
      selectedDeviceIds.length === availableDevices.length
        ? []
        : availableDevices.map((d: any) => d.id || d.idTaiSan || ""),
    );

  const toggle = (
    current: string | null,
    id: string,
    setter: (s: string | null) => void,
  ) => {
    setter(current === id ? null : id);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.5,
          mx: -2,
          mt: -2,
          mb: 2,
          bgcolor: "#1FA463",
          color: "#fff",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1.1rem" }}>
          Chi tiết kế hoạch: {plan.id}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Info Section */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          p: 1.5,
          borderRadius: 2,
          bgcolor: "#f1f8e9",
          border: "1px solid #d0e7b5",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Typography variant="body2">
          <b>Năm:</b> {plan.nam}
        </Typography>
        <Typography variant="body2">
          <b>Ngày tạo:</b> {plan.ngayTao}
        </Typography>
        {plan.tenDonViGiao && (
          <Typography variant="body2">
            <b>ĐV quản lý:</b> {plan.tenDonViGiao}
          </Typography>
        )}
        {plan.tenDonViNhan && (
          <Typography variant="body2">
            <b>ĐV thực hiện:</b> {plan.tenDonViNhan}
          </Typography>
        )}
        {showStatus(plan.trangThai)}
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 2,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTab-root": {
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.95rem",
            color: "text.secondary",
            "&:hover": {
              color: "#1FA463",
              opacity: 0.85,
            },
          },
          "& .MuiTab-root.Mui-selected": {
            color: "#1FA463 !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#1FA463 !important",
          },
        }}
      >
        <Tab label="Xem theo thiết bị" />
        <Tab label="Xem theo biên bản" />
      </Tabs>

      {/* ══════════════ TAB 0: Thiết bị ══════════════ */}
      {tab === 0 && (
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {plan.trangThai === 3 && (
            <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
              <FormControl size="small" sx={{ minWidth: 200, mt: 1 }}>
                <InputLabel
                  id="month-scbd-label"
                  sx={{
                    color: "#1FA463",
                    "&.Mui-focused": { color: "#17824e" },
                  }}
                >
                  Tháng SCBD
                </InputLabel>
                <Select
                  labelId="month-scbd-label"
                  multiple
                  value={selectedMonths}
                  label="Tháng SCBD"
                  onChange={(e) => {
                    const val = e.target.value;
                    const nextMonths =
                      typeof val === "string"
                        ? val.split(",").map(Number)
                        : (val as number[]);
                    nextMonths.sort((a, b) => a - b);
                    setSelectedMonths(nextMonths);
                    setSelectedDeviceIds([]);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as number[]).map((value) => (
                        <Chip
                          key={value}
                          label={months[value]}
                          size="small"
                          sx={{
                            bgcolor: "#e8f5e9",
                            color: "#1FA463",
                            fontWeight: 600,
                            border: "1px solid #c8e6c9",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1FA463",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#17824e",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#17824e",
                    },
                  }}
                >
                  {months.map((m, idx) => (
                    <MenuItem
                      key={idx}
                      value={idx}
                      sx={{
                        "&.Mui-selected": {
                          bgcolor: "rgba(31, 164, 99, 0.08)",
                          "&:hover": {
                            bgcolor: "rgba(31, 164, 99, 0.12)",
                          },
                        },
                        "&:hover": {
                          bgcolor: "rgba(31, 164, 99, 0.04)",
                        },
                      }}
                    >
                      <Checkbox
                        checked={selectedMonths.includes(idx)}
                        size="small"
                        sx={{
                          color: "#1FA463",
                          "&.Mui-checked": {
                            color: "#1FA463",
                          },
                        }}
                      />
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<PostAddIcon />}
                disabled={
                  selectedDeviceIds.length === 0 || selectedMonths.length > 1
                }
                onClick={() => setRepairDialogOpen(true)}
                size="small"
                sx={{
                  bgcolor: "#1FA463",
                  "&:hover": { bgcolor: "#17824e" },
                }}
              >
                Tạo Giấy đề nghị SC ({selectedDeviceIds.length})
              </Button>
            </Box>
          )}

          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      bgcolor: "#1FA463 !important",
                      color: "#fff !important",
                      fontWeight: 700,
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    {plan?.nhomTaiSan !== AssetGroup.PHUONGTIEN && (
                      <Checkbox
                        indeterminate={
                          selectedDeviceIds.length > 0 &&
                          selectedDeviceIds.length < availableDevices.length
                        }
                        checked={
                          availableDevices.length > 0 &&
                          selectedDeviceIds.length === availableDevices.length
                        }
                        onChange={handleSelectAll}
                        disabled={
                          plan.trangThai !== 3 || selectedMonths.length > 1
                        }
                        sx={{
                          color: "#fff",
                          "&.Mui-checked": { color: "#fff" },
                          "&.MuiCheckbox-indeterminate": { color: "#fff" },
                          "&.Mui-disabled": {
                            color: "rgba(255, 255, 255, 0.3) !important",
                          },
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>STT</TableCell>
                  <TableCell>Mã TB</TableCell>
                  <TableCell>Tên TB</TableCell>
                  <TableCell>Nhóm</TableCell>
                  {selectedMonths.map((mIdx) => (
                    <TableCell key={mIdx}>Tháng {mIdx + 1}</TableCell>
                  ))}
                  <TableCell>SL</TableCell>
                  {selectedMonths.length === 1 && (
                    <TableCell>Trạng thái</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {mergedDevices?.map((device: any, idx: number) => {
                  const isAlreadyRequested =
                    selectedMonths.length === 1 &&
                    device.monthlyData[selectedMonths[0]]?.daCoLenhSuaChua ===
                      1;
                  return (
                    <TableRow
                      key={device.idTaiSan}
                      sx={{
                        bgcolor: isAlreadyRequested ? "#f5f5f5" : undefined,
                        "&:hover": {
                          bgcolor: "rgba(31, 164, 99, 0.04) !important",
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedDeviceIds.includes(device.id)}
                          onChange={() => handleToggle(device.id)}
                          disabled={
                            plan.trangThai !== 3 ||
                            selectedMonths.length > 1 ||
                            isAlreadyRequested
                          }
                        />
                      </TableCell>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{device.idTaiSan}</TableCell>
                      <TableCell>{device.tenTaiSan}</TableCell>
                      <TableCell>{device.idNhomTaiSan}</TableCell>
                      {selectedMonths.map((mIdx) => {
                        const mData = device.monthlyData[mIdx];
                        return (
                          <TableCell key={mIdx}>
                            {mData ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Chip
                                  label={mData.capSuaChua}
                                  size="small"
                                  sx={{
                                    bgcolor:
                                      maintenanceLevelColors[
                                        mData.capSuaChua
                                      ] || "transparent",
                                    color: "#fff",
                                    fontWeight: 600,
                                  }}
                                />
                                {mData.daCoLenhSuaChua === 1 && (
                                  <CheckIcon
                                    sx={{ color: "#1FA463", fontSize: 18 }}
                                  />
                                )}
                              </Box>
                            ) : (
                              <span style={{ color: "#aaa" }}>—</span>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell>{device.soLuong}</TableCell>
                      {selectedMonths.length === 1 && (
                        <TableCell>
                          {isAlreadyRequested ? (
                            <Chip
                              label="Đã lập lệnh"
                              size="small"
                              color="info"
                            />
                          ) : (
                            <Chip
                              label="Chưa lập"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {mergedDevices?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={
                        6 +
                        selectedMonths.length +
                        (selectedMonths.length === 1 ? 1 : 0)
                      }
                      align="center"
                      sx={{ py: 4 }}
                    >
                      Không có thiết bị cần SCBD trong các tháng đã chọn
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ══════════════ TAB 1: Biên bản — tree view ══════════════ */}
      {tab === 1 && (
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ overflowX: "auto" }}
          >
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      bgcolor: "#1FA463 !important",
                      color: "#fff !important",
                      fontWeight: 700,
                    },
                  }}
                >
                  <TableCell>Biên bản</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {maintenanceRepairByPlan.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}

                {/* ─── Giấy đề nghị sửa chữa (Cấp 1) ─── */}
                {maintenanceRepairByPlan.map(
                  (req: MaintenanceRepairData, reqIdx: number) => {
                    const isReqLast =
                      reqIdx === maintenanceRepairByPlan.length - 1;

                    return (
                      <React.Fragment key={req.id}>
                        {/* Level 1 */}
                        <TableRow hover>
                          <TableCell
                            sx={{
                              pl: 2,
                              position: "relative",
                              height: ROW_H,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TreeConnector depth={1} isLast={isReqLast} />
                            </Box>
                            {req.daCoGiamDinh === 1 && (
                              <IconButton
                                size="small"
                                sx={{ ml: `${CONNECTOR_WIDTH * 1 - 6}px` }}
                                onClick={() =>
                                  toggle(
                                    expandedRequests,
                                    req.id ?? "",
                                    setExpandedRequests,
                                  )
                                }
                              >
                                {expandedRequests === (req.id ?? "") ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            )}
                            <Typography
                              variant="body2"
                              sx={{ ml: `${CONNECTOR_WIDTH * 1 + 8}px` }}
                            >
                              {req.soPhieu}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label="GĐ Sửa chữa" size="small" />
                          </TableCell>
                          <TableCell>{req.ngayTao}</TableCell>
                          <TableCell>
                            {showStatus(req.trangThai ?? 0)}
                          </TableCell>
                          <TableCell align="right">
                            <ActionCell
                              onAdd={() => {
                                setInspectionParentReqId(req.id ?? "");
                                setInspectionDialogOpen(true);
                              }}
                              isAdd={
                                req?.trangThai === 3 && req?.daCoGiamDinh !== 1
                              }
                              addTooltip="Tạo BB Giám định"
                              addColor="success"
                              onEdit={() => {
                                setSelectedReq(req);
                                setRepairDialogOpen(true);
                              }}
                              onDelete={() =>
                                deleteRepairMutation.mutateAsync(req)
                              }
                              isDelete={req?.trangThai === 0}
                              isEdit={req?.trangThai === 0}
                              editTooltip="Sửa"
                              editColor="success"
                            />
                          </TableCell>
                        </TableRow>

                        {/* Level 2 */}
                        {expandedRequests === (req.id ?? "") &&
                          inspectionRecords.map(
                            (insp: any, inspIdx: number) => {
                              const acceptances = acceptanceRecords.filter(
                                (a: any) => a.inspectionRecordId === insp.id,
                              );
                              const isInspLast =
                                inspIdx === inspectionRecords.length - 1;

                              return (
                                <React.Fragment key={insp.id}>
                                  <TableRow hover>
                                    <TableCell
                                      sx={{
                                        pl: 2,
                                        position: "relative",
                                        height: ROW_H,
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          position: "absolute",
                                          left: 0,
                                          top: 0,
                                          height: "100%",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <TreeConnector
                                          depth={2}
                                          isLast={isInspLast}
                                        />
                                      </Box>
                                      {insp.daCoBienPhap === 1 && (
                                        <IconButton
                                          size="small"
                                          sx={{
                                            ml: `${CONNECTOR_WIDTH * 2 - 6}px`,
                                          }}
                                          onClick={() =>
                                            toggle(
                                              expandedInspections,
                                              insp.id,
                                              setExpandedInspections,
                                            )
                                          }
                                        >
                                          {expandedInspections === insp.id ? (
                                            <KeyboardArrowUpIcon />
                                          ) : (
                                            <KeyboardArrowDownIcon />
                                          )}
                                        </IconButton>
                                      )}
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          ml: `${CONNECTOR_WIDTH * 2 + 8}px`,
                                        }}
                                      >
                                        {insp.soPhieu}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Chip
                                        label="BB Giám định"
                                        size="small"
                                        color="success"
                                        sx={{ color: "#fff" }}
                                      />
                                    </TableCell>
                                    <TableCell>{insp.ngayGiamDinh}</TableCell>
                                    <TableCell>
                                      {showStatus(insp.trangThai)}
                                    </TableCell>
                                    <TableCell align="right">
                                      <ActionCell
                                        isAdd={
                                          insp?.trangThai === 3 &&
                                          insp.daCoBienPhap !== 1
                                        }
                                        onAdd={() => {
                                          setExpandedInspections(
                                            insp.id ?? null,
                                          );
                                          setBienPhapParentInspId(insp.id);
                                        }}
                                        isDelete={insp?.trangThai === 0}
                                        onDelete={() => {
                                          const deleteFn =
                                            plan?.nhomTaiSan ===
                                            AssetGroup.MAYMOC
                                              ? deleteInspectionMutation
                                              : deleteInspectionVehicleMutation;
                                          deleteFn.mutateAsync(insp.id);
                                        }}
                                        isEdit={insp?.trangThai === 0}
                                        onEdit={() => {
                                          setInspectionParentReqId(
                                            req.id ?? "",
                                          );
                                          setInspectionDialogOpen(true);
                                          setSelectedIns(insp);
                                        }}
                                        editTooltip="Chỉnh sửa BB Giám định"
                                        editColor="primary"
                                        addTooltip="Tạo Biện pháp sửa chữa"
                                        addColor="error"
                                      />
                                    </TableCell>
                                  </TableRow>

                                  {/* Depth 3: Biện pháp sửa chữa */}
                                  {expandedInspections === insp.id &&
                                    bienPhapRecords.map((bp: any) => {
                                      const isBPExpanded =
                                        expandedBienPhap === (bp.id ?? "");
                                      const bpAcceptances =
                                        acceptanceRecords.filter(
                                          (a: any) =>
                                            a.idBienPhapMayMoc === bp.id,
                                        );

                                      return (
                                        <React.Fragment key={`bp-${bp.id}`}>
                                          <TableRow hover>
                                            <TableCell
                                              sx={{
                                                pl: 2,
                                                position: "relative",
                                                height: ROW_H,
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  position: "absolute",
                                                  left: 0,
                                                  top: 0,
                                                  height: "100%",
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <TreeConnector
                                                  depth={3}
                                                  isLast={false}
                                                />
                                              </Box>
                                              {bp.daCoNghiemThu === 1 && (
                                                <IconButton
                                                  size="small"
                                                  sx={{
                                                    ml: `${CONNECTOR_WIDTH * 3 - 6}px`,
                                                  }}
                                                  onClick={() =>
                                                    toggle(
                                                      expandedBienPhap,
                                                      bp.id ?? "",
                                                      setExpandedBienPhap,
                                                    )
                                                  }
                                                >
                                                  {isBPExpanded ? (
                                                    <KeyboardArrowUpIcon />
                                                  ) : (
                                                    <KeyboardArrowDownIcon />
                                                  )}
                                                </IconButton>
                                              )}
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  ml:
                                                    bp.daCoNghiemThu === 1
                                                      ? `${CONNECTOR_WIDTH * 3 + 8}px`
                                                      : `${CONNECTOR_WIDTH * 3 + 36}px`,
                                                }}
                                              >
                                                {bp.soPhieu || bp.id}
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              <Chip
                                                label="Biện pháp SC"
                                                size="small"
                                                sx={{
                                                  bgcolor: "#d32f2f",
                                                  color: "#fff",
                                                }}
                                              />
                                            </TableCell>
                                            <TableCell>
                                              {bp.thoiGianBatDau || bp.ngayTao}
                                            </TableCell>
                                            <TableCell>
                                              {showStatus(bp.trangThai ?? 0)}
                                            </TableCell>
                                            <TableCell align="right">
                                              <ActionCell
                                                onAdd={() => {
                                                  setExpandedBienPhap(
                                                    bp.id ?? null,
                                                  );
                                                  setAcceptanceParentBienPhapId(
                                                    bp.id,
                                                  );
                                                  setAcceptanceDialogOpen(true);
                                                }}
                                                isAdd={
                                                  bp.trangThai === 3 &&
                                                  bp.daCoNghiemThu !== 1
                                                }
                                                addTooltip="Tạo BB Nghiệm thu"
                                                addColor="warning"
                                                isEdit={bp.trangThai === 0}
                                                onEdit={() => {
                                                  setSelectedBienPhap(bp);
                                                  setBienPhapParentInspId(
                                                    bp.idGiamDinhMayMoc ||
                                                      bp.idGiamDinhPhuongTien ||
                                                      bp.idKiemTraSuCo,
                                                  );
                                                }}
                                                editTooltip="Chỉnh sửa Biện pháp"
                                                editColor="primary"
                                                isDelete={bp.trangThai === 0}
                                                onDelete={() => {
                                                  const deleteFn =
                                                    plan?.nhomTaiSan ===
                                                    AssetGroup.MAYMOC
                                                      ? deleteBienPhapMayMocMutation
                                                      : deleteBienPhapPhuongTienMutation;
                                                  deleteFn.mutateAsync(bp.id);
                                                }}
                                              />
                                            </TableCell>
                                          </TableRow>

                                          {/* Depth 4: BB Nghiệm thu */}
                                          {isBPExpanded &&
                                            acceptanceRecords.map(
                                              (acc: any, accIdx: number) => {
                                                const isAccLast =
                                                  accIdx ===
                                                  bpAcceptances.length - 1;

                                                return (
                                                  <React.Fragment key={acc.id}>
                                                    <TableRow hover>
                                                      <TableCell
                                                        sx={{
                                                          pl: 2,
                                                          position: "relative",
                                                          height: ROW_H,
                                                          display: "flex",
                                                          alignItems: "center",
                                                        }}
                                                      >
                                                        <Box
                                                          sx={{
                                                            position:
                                                              "absolute",
                                                            left: 0,
                                                            top: 0,
                                                            height: "100%",
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                          }}
                                                        >
                                                          <TreeConnector
                                                            depth={4}
                                                            isLast={isAccLast}
                                                          />
                                                        </Box>
                                                        {acc.daCoDanhGiaVatTu ===
                                                          1 && (
                                                          <IconButton
                                                            size="small"
                                                            sx={{
                                                              ml: `${CONNECTOR_WIDTH * 4 - 6}px`,
                                                            }}
                                                            onClick={() =>
                                                              toggle(
                                                                expandedAcceptances,
                                                                acc.id,
                                                                setExpandedAcceptances,
                                                              )
                                                            }
                                                          >
                                                            {expandedAcceptances ===
                                                            acc.id ? (
                                                              <KeyboardArrowUpIcon />
                                                            ) : (
                                                              <KeyboardArrowDownIcon />
                                                            )}
                                                          </IconButton>
                                                        )}
                                                        <Typography
                                                          variant="body2"
                                                          sx={{
                                                            ml:
                                                              acc.daCoDanhGiaVatTu ===
                                                              1
                                                                ? `${CONNECTOR_WIDTH * 4 + 8}px`
                                                                : `${CONNECTOR_WIDTH * 4 + 36}px`,
                                                          }}
                                                        >
                                                          {acc.soPhieu}
                                                        </Typography>
                                                      </TableCell>
                                                      <TableCell>
                                                        <Chip
                                                          label="BB Nghiệm thu"
                                                          size="small"
                                                          color="warning"
                                                          sx={{ color: "#fff" }}
                                                        />
                                                      </TableCell>
                                                      <TableCell>
                                                        {acc.ngayTao}
                                                      </TableCell>
                                                      <TableCell>
                                                        {showStatus(
                                                          acc.trangThai,
                                                        )}
                                                      </TableCell>
                                                      <TableCell align="right">
                                                        <ActionCell
                                                          onAdd={() => {
                                                            setMaterialParentAccId(
                                                              acc.id,
                                                            );
                                                          }}
                                                          addTooltip={
                                                            acc.daCoDanhGiaVatTu ===
                                                            1
                                                              ? "Đã có BB Vật tư"
                                                              : "Tạo BB Vật tư"
                                                          }
                                                          addColor="secondary"
                                                          isAdd={
                                                            acc.trangThai ===
                                                              3 &&
                                                            acc.daCoDanhGiaVatTu !==
                                                              1
                                                          }
                                                          isEdit={
                                                            acc.trangThai === 0
                                                          }
                                                          onEdit={() => {
                                                            setSelectedAcc(acc);
                                                            setAcceptanceParentBienPhapId(
                                                              acc.idBienPhapMayMoc ||
                                                                acc.idBienPhapPhuongTien,
                                                            );
                                                            setAcceptanceDialogOpen(
                                                              true,
                                                            );
                                                          }}
                                                          isDelete={
                                                            acc.trangThai === 0
                                                          }
                                                          onDelete={() => {
                                                            const deleteFn =
                                                              plan?.nhomTaiSan ===
                                                              AssetGroup.MAYMOC
                                                                ? deleteAcceptanceMutation
                                                                : deleteAcceptanceVehicleMutation;
                                                            deleteFn.mutateAsync(
                                                              acc.id,
                                                            );
                                                          }}
                                                          editTooltip="Chỉnh sửa BB Nghiệm thu"
                                                          editColor="primary"
                                                        />
                                                      </TableCell>
                                                    </TableRow>

                                                    {/* Depth 5: BB Vật tư */}
                                                    {expandedAcceptances ===
                                                      acc.id &&
                                                      materialQualityRecords.map(
                                                        (
                                                          mat: DanhGiaVatTuData,
                                                        ) => (
                                                          <TableRow
                                                            hover
                                                            key={mat.id}
                                                          >
                                                            <TableCell
                                                              sx={{
                                                                pl: 2,
                                                                position:
                                                                  "relative",
                                                                height: ROW_H,
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                              }}
                                                            >
                                                              <Box
                                                                sx={{
                                                                  position:
                                                                    "absolute",
                                                                  left: 0,
                                                                  top: 0,
                                                                  height:
                                                                    "100%",
                                                                  display:
                                                                    "flex",
                                                                  alignItems:
                                                                    "center",
                                                                }}
                                                              >
                                                                <TreeConnector
                                                                  depth={5}
                                                                  isLast={false}
                                                                />
                                                              </Box>
                                                              <Typography
                                                                variant="body2"
                                                                sx={{
                                                                  ml: `${CONNECTOR_WIDTH * 5 + 36}px`,
                                                                }}
                                                              >
                                                                {mat.soPhieu}
                                                              </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                              <Chip
                                                                label="BB Vật tư"
                                                                size="small"
                                                                color="secondary"
                                                              />
                                                            </TableCell>
                                                            <TableCell>
                                                              {(mat as any)
                                                                .ngayDanhGia ||
                                                                "—"}
                                                            </TableCell>
                                                            <TableCell>
                                                              {showStatus(
                                                                mat.trangThai ??
                                                                  0,
                                                              )}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                              <ActionCell
                                                                isEdit={
                                                                  mat.trangThai ===
                                                                  0
                                                                }
                                                                onEdit={() => {
                                                                  setSelectedMaterialAssessment(
                                                                    mat,
                                                                  );
                                                                  setMaterialParentAccId(
                                                                    mat.idNghiemThu ||
                                                                      "",
                                                                  );
                                                                }}
                                                                isDelete={
                                                                  mat.trangThai ===
                                                                  0
                                                                }
                                                                onDelete={() =>
                                                                  deleteMaterialAssessmentMutation.mutateAsync(
                                                                    mat.id ||
                                                                      "",
                                                                  )
                                                                }
                                                                editTooltip="Chỉnh sửa BB Đánh giá Vật tư"
                                                                editColor="secondary"
                                                              />
                                                            </TableCell>
                                                          </TableRow>
                                                        ),
                                                      )}
                                                  </React.Fragment>
                                                );
                                              },
                                            )}
                                        </React.Fragment>
                                      );
                                    })}
                                </React.Fragment>
                              );
                            },
                          )}
                      </React.Fragment>
                    );
                  },
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Dialogs */}
      <RepairRequestDialog
        open={repairDialogOpen}
        onClose={() => setRepairDialogOpen(false)}
        plan={plan}
        initialData={selectedReq}
        selectedDeviceIds={selectedDeviceIds}
        selectedMonth={selectedMonths[0]}
        onSubmit={(req) => {
          if (selectedReq) {
            updateRepairMutation.mutateAsync(req);
          } else {
            createRepairMutation.mutateAsync(req);
          }
          setSelectedDeviceIds([]);
          setRepairDialogOpen(false);
          setSelectedReq(null);
        }}
      />

      {inspectionDialogOpen &&
        (() => {
          const parentReq = maintenanceRepairByPlan.find(
            (r: MaintenanceRepairData) => r.id === inspectionParentReqId,
          );
          if (plan?.nhomTaiSan === AssetGroup.PHUONGTIEN) {
            return (
              <InspectionRecordVehicleDialog
                open={inspectionDialogOpen}
                onClose={() => setInspectionDialogOpen(false)}
                plan={plan}
                initData={selectedIns as any}
                repairRequest={parentReq}
              />
            );
          }
          return (
            <InspectionRecordDialog
              open={inspectionDialogOpen}
              onClose={() => setInspectionDialogOpen(false)}
              plan={plan}
              initData={selectedIns}
              repairRequest={parentReq}
            />
          );
        })()}

      {/* BienPhapMayMocDialog / BienPhapPhuongTienDialog */}
      {(bienPhapParentInspId || selectedBienPhap) &&
        (() => {
          const parentId = selectedBienPhap
            ? selectedBienPhap.idGiamDinhMayMoc ||
              selectedBienPhap.idGiamDinhPhuongTien ||
              selectedBienPhap.idKiemTraSuCo
            : bienPhapParentInspId;
          const parentInsp = inspectionRecords.find(
            (r: any) => r.id === parentId,
          );
          if (plan?.nhomTaiSan === AssetGroup.PHUONGTIEN) {
            return (
              <BienPhapPhuongTienDialog
                open={true}
                onClose={() => {
                  setBienPhapParentInspId(null);
                  setSelectedBienPhap(null);
                }}
                idGiamDinhPhuongTien={parentId ?? ""}
                soPhieuGiamDinh={parentInsp?.soPhieu}
                initData={selectedBienPhap}
              />
            );
          }
          return (
            <BienPhapMayMocDialog
              open={true}
              onClose={() => {
                setBienPhapParentInspId(null);
                setSelectedBienPhap(null);
              }}
              idGiamDinhMayMoc={parentId ?? ""}
              soPhieuGiamDinh={parentInsp?.soPhieu}
              initData={selectedBienPhap}
            />
          );
        })()}

      {acceptanceDialogOpen &&
        (() => {
          if (plan?.nhomTaiSan === AssetGroup.PHUONGTIEN) {
            const bp = bienPhapRecords.find(
              (r: any) =>
                r.id ===
                (selectedAcc
                  ? selectedAcc.idBienPhapPhuongTien ||
                    selectedAcc.idGiamDinhPhuongTien
                  : acceptanceParentBienPhapId),
            );
            return (
              <NghiemThuPhuongTienDialog
                open={true}
                onClose={() => {
                  setAcceptanceDialogOpen(false);
                  setAcceptanceParentBienPhapId(null);
                  setSelectedAcc(null);
                }}
                idBienPhapPhuongTien={
                  selectedAcc
                    ? selectedAcc.idBienPhapPhuongTien ||
                      selectedAcc.idGiamDinhPhuongTien ||
                      ""
                    : (acceptanceParentBienPhapId ?? "")
                }
                idTaiSan={bp?.idTaiSan}
                tenTaiSan={bp?.tenTaiSan}
                soBienBanBienPhap={bp?.soPhieu || bp?.soBienBan}
                bienPhap={bp}
                initData={selectedAcc}
              />
            );
          }
          if (selectedAcc) {
            const bp = bienPhapRecords.find(
              (r: any) => r.id === selectedAcc.idBienPhapMayMoc,
            );
            const parentInsp = bp
              ? inspectionRecords.find((r: any) => r.id === bp.idGiamDinhMayMoc)
              : null;
            const parentReq = parentInsp
              ? maintenanceRepairByPlan.find(
                  (rr: MaintenanceRepairData) => rr.id === parentInsp.idSuaChua,
                )
              : null;
            return (
              <AcceptanceTestDialog
                open={true}
                onClose={() => {
                  setAcceptanceDialogOpen(false);
                  setAcceptanceParentBienPhapId(null);
                  setSelectedAcc(null);
                }}
                plan={plan}
                repairRequest={parentReq!}
                inspectionRecord={parentInsp!}
                initData={selectedAcc}
                bienPhapId={bp?.id}
              />
            );
          } else {
            const bp = bienPhapRecords.find(
              (r: any) => r.id === acceptanceParentBienPhapId,
            );
            const parentInsp = bp
              ? inspectionRecords.find((r: any) => r.id === bp.idGiamDinhMayMoc)
              : null;
            const parentReq = parentInsp
              ? maintenanceRepairByPlan.find(
                  (rr: MaintenanceRepairData) => rr.id === parentInsp.idSuaChua,
                )
              : null;
            return parentInsp ? (
              <AcceptanceTestDialog
                open={true}
                onClose={() => {
                  setAcceptanceDialogOpen(false);
                  setAcceptanceParentBienPhapId(null);
                }}
                plan={plan}
                repairRequest={parentReq!}
                inspectionRecord={parentInsp}
                bienPhapId={acceptanceParentBienPhapId || undefined}
              />
            ) : null;
          }
        })()}

      {materialParentAccId &&
        (() => {
          console.log(materialParentAccId);
          const parentAcc = acceptanceRecords.find(
            (a: any) => a.id === materialParentAccId,
          );
          const parentReq = parentAcc
            ? maintenanceRepairByPlan.find(
                (rr: MaintenanceRepairData) =>
                  rr.id === parentAcc.repairRequestId,
              )
            : null;
          return parentAcc ? (
            <MaterialDialog
              open={true}
              onClose={() => {
                setMaterialParentAccId(null);
                setSelectedMaterialAssessment(null);
              }}
              plan={plan}
              repairRequest={parentReq!}
              acceptanceRecord={parentAcc}
              initData={selectedMaterialAssessment}
            />
          ) : null;
        })()}
    </Box>
  );
};

export default PlanDetailPanel;
