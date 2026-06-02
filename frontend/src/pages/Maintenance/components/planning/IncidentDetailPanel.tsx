import React, { useState, useMemo, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { EditIcon, TrashIcon } from "lucide-react";
import { showConfirmAlert } from "../../../../components/Alert";

import { devices } from "../../../../mockdata/mockDevices";
import { departments } from "../../../../mockdata/mockDepartments";


import InspectionRecordDialog from "../dialog/InspectionRecordDialog";
import AcceptanceTestDialog from "../dialog/AcceptanceTestDialog";
import MaterialDialog from "../dialog/MaterialDialog";
import IncidentPreview from "../preview/IncidentPreview";
import IncidentInspectionDialog from "../dialog/Incidentinspectiondialog";
import BienPhapMayMocDialog from "../dialog/BienPhapMayMocDialog";
import BienPhapPhuongTienDialog from "../dialog/BienPhapPhuongTienDialog";
import NghiemThuPhuongTienDialog from "../dialog/NghiemThuPhuongTienDialog";
import InspectionRecordVehicleDialog from "../dialog/InspectionRecordVehicleDialog";
import {
  useMaintenanceAcceptanceByBienPhapQuery,
  useMaintenanceIncidentDetailByIncidentQuery,
  useMaintenanceIncidentInspectionBySuCoQuery,
  useMaintenanceInspectionByBienBanQuery,
  useMaintenanceVehicleInspectionByBienBanQuery,
  useMaintenanceMaterialAssessmentByInspectionQuery,
  useMaintenanceMaterialAssessmentMutation,
  useMaintenanceIncidentInspectionMutation,
  useMaintenanceInspectionMutation,
  useMaintenanceAcceptanceTestMutation,
  useMaintenanceAcceptanceTestVehicleMutation,
  useMaintenanceAcceptanceVehicleByBienPhapQuery,
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
import { MaintenancePlanData } from "../../types";
import type { IncidenData, DanhGiaVatTuData } from "../../types";
import { showServerity, showStatus } from "../../config";
import { AssetGroup } from "../../../../utils/const";

interface Props {
  incident: IncidenData;
  plan: MaintenancePlanData;
  onClose: () => void;
}

const ActionCell = ({
  onView,
  onAdd,
  isAdd = true,
  addTooltip = "Tạo biên bản",
  addColor = "primary",
  onEdit,
  isEdit,
  editTooltip,
  editColor = "primary",
  onDelete,
  isDelete,
}: any) => (
  <Box
    sx={{
      display: "flex",
      gap: 0.5,
      justifyContent: "flex-end",
      alignItems: "center",
    }}
  >
    {onView && (
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onView();
        }}
      >
        <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
      </IconButton>
    )}
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
          disabled={!isAdd}
          color={addColor}
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

const IncidentDetailPanel = ({ incident, plan, onClose }: Props) => {
  const [tab, setTab] = useState(0);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [expandedBBKTKSC, setExpandedBBKTKSC] = useState<string | null>(null);
  const [expandedInspections, setExpandedInspections] = useState<string | null>(
    null,
  );
  const [expandedBienPhap, setExpandedBienPhap] = useState<string | null>(null);
  const [expandedAcceptances, setExpandedAcceptances] = useState<string | null>(
    null,
  );
  const [incidentInspectionParentId, setIncidentInspectionParentId] = useState<
    string | null
  >(null);
  const [incInspectionParentBBKTKSCId, setIncInspectionParentBBKTKSCId] =
    useState<string | null>(null);
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
  const [selectedIncidentInspection, setSelectedIncidentInspection] = useState<
    any | null
  >(null);
  const [selectedIns, setSelectedIns] = useState<any | null>(null);
  const [selectedAcc, setSelectedAcc] = useState<any | null>(null);

  const [incidentPreviewId, setIncidentPreviewId] = useState<string | null>(
    null,
  );

  const { deleteMutation: deleteMaterialAssessmentMutation } =
    useMaintenanceMaterialAssessmentMutation();
  const { deleteMutation: deleteIncidentInspectionMutation } =
    useMaintenanceIncidentInspectionMutation();
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

  useEffect(() => {
    setExpandedBBKTKSC(null);
    setExpandedInspections(null);
    setExpandedBienPhap(null);
    setExpandedAcceptances(null);
    setSelectedDeviceIds([]);
    setIncidentInspectionParentId(null);
    setIncInspectionParentBBKTKSCId(null);
    setBienPhapParentInspId(null);
    setSelectedBienPhap(null);
    setAcceptanceParentBienPhapId(null);
    setMaterialParentAccId(null);
    setIncidentPreviewId(null);
    setSelectedMaterialAssessment(null);
    setSelectedIncidentInspection(null);
    setSelectedIns(null);
    setSelectedAcc(null);
  }, [incident?.id]);

  const { data: incidentDevices = [] } =
    useMaintenanceIncidentDetailByIncidentQuery(incident?.id);
  const { data: incidentInspections = [] } =
    useMaintenanceIncidentInspectionBySuCoQuery(incident?.id);

  const { data: inspectionMachineRecords = [] } =
    useMaintenanceInspectionByBienBanQuery(
      expandedBBKTKSC || "",
      plan?.nhomTaiSan === AssetGroup.MAYMOC,
    );
  const { data: inspectionVehicleRecords = [] } =
    useMaintenanceVehicleInspectionByBienBanQuery(
      expandedBBKTKSC || "",
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
      plan?.nhomTaiSan === AssetGroup.PHUONGTIEN ? expandedInspections || "" : "",
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

  // Lấy danh sách thiết bị từ deviceEntries
  const deviceIds = useMemo(
    () => incident.danhSachTaiSan?.map((e) => e.idTaiSan) || [],
    [incident.danhSachTaiSan],
  );

  const devicesInIncident = useMemo(
    () => devices.filter((d) => deviceIds.includes(d.id)),
    [deviceIds],
  );

  const handleToggle = (id: string) => {
    const isVehicle = plan?.nhomTaiSan === AssetGroup.PHUONGTIEN;
    setSelectedDeviceIds((prev) => {
      if (isVehicle) {
        return prev.includes(id) ? [] : [id];
      }
      return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };
  const availableDevices = (incident?.danhSachTaiSan || []).filter(
    (d: any) => d?.daKiemTraSuCo !== 1,
  );
  const handleSelectAll = () =>
    setSelectedDeviceIds(
      selectedDeviceIds.length === availableDevices.length
        ? []
        : availableDevices.map((d: any) => d.id || ""),
    );

  const reporterDept = incident.idDonViBaoCao
    ? departments.find((d) => d.id === incident.idDonViBaoCao)
    : null;


  const inc: any = incident;

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
          Chi tiết: Phiếu báo sự cố {inc.soPhieu || inc.number}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Info section */}
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
          <b>Ngày phát hiện:</b> {inc.ngayPhatHien || inc.detectedAt}
        </Typography>
        <Typography variant="body2">
          <b>Hệ thống:</b> {inc.tenHeThongThietBi || inc.systemName}
        </Typography>
        {(inc.mucDo !== undefined || inc.severity) && showServerity(inc.mucDo)}
        {reporterDept && (
          <Typography variant="body2">
            <b>Đơn vị báo cáo:</b> {reporterDept.name}
          </Typography>
        )}
        {showStatus(inc.trangThai ?? 0)}
      </Box>

      {incident.moTa && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: "#f5f5f5", borderRadius: 2, border: "1px solid #e0e0e0" }}>
          <Typography variant="body2">
            <b>Mô tả:</b> {incident.moTa}
          </Typography>
        </Box>
      )}

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
          {incident.trangThai === 3 && (
            <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
              <Button
                variant="contained"
                disabled={selectedDeviceIds.length === 0}
                onClick={() => setIncidentInspectionParentId(incident.id)}
                size="small"
                sx={{
                  bgcolor: "#1FA463",
                  "&:hover": { bgcolor: "#17824e" },
                }}
              >
                Tạo BB Kiểm tra sự cố ({selectedDeviceIds.length})
              </Button>
            </Box>
          )}

          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ "& th": { bgcolor: "#1FA463 !important", color: "#fff !important", fontWeight: 700 } }}>
                  {incident.trangThai === 3 && (
                    <TableCell padding="checkbox">
                      {plan?.nhomTaiSan !== AssetGroup.PHUONGTIEN && (
                        <Checkbox
                          indeterminate={
                            selectedDeviceIds.length > 0 &&
                            selectedDeviceIds.length < devicesInIncident.length
                          }
                          checked={
                            devicesInIncident.length > 0 &&
                            selectedDeviceIds.length ===
                              devicesInIncident.length
                          }
                          onChange={handleSelectAll}
                          sx={{
                            color: "#fff",
                            "&.Mui-checked": { color: "#fff" },
                            "&.MuiCheckbox-indeterminate": { color: "#fff" },
                          }}
                        />
                      )}
                    </TableCell>
                  )}
                  <TableCell>STT</TableCell>
                  <TableCell>Mã TB</TableCell>
                  <TableCell>Tên TB</TableCell>
                  <TableCell>Nhóm</TableCell>
                  <TableCell>Vị trí</TableCell>
                  <TableCell>Tình trạng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incidentDevices?.map((device: any, idx: number) => {
                  return (
                    <TableRow
                      key={device.id}
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(31, 164, 99, 0.04) !important",
                        },
                      }}
                    >
                      {incident.trangThai === 3 && inc.daKiemTraSuCo !== 1 && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedDeviceIds.includes(
                              device.id ?? "",
                            )}
                            onChange={() => handleToggle(device.id ?? "")}
                            disabled={device.daKiemTraSuCo === 1}
                          />
                        </TableCell>
                      )}
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{device.idTaiSan}</TableCell>
                      <TableCell>{device.tenTaiSan}</TableCell>
                      <TableCell>{device.tenNhomTaiSan}</TableCell>
                      <TableCell>{device?.viTri || "—"}</TableCell>
                      <TableCell>{device?.tinhTrang || "—"}</TableCell>
                      <TableCell>
                        {device.daKiemTraSuCo === 1 ? (
                          <Chip label="Đã kiểm tra" size="small" color="info" />
                        ) : (
                          <Chip
                            label="Chưa kiểm tra"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
                <TableRow sx={{ "& th": { bgcolor: "#1FA463 !important", color: "#fff !important", fontWeight: 700 } }}>
                  <TableCell>Biên bản</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {incidentInspections.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}

                {/* ─── BB Kiểm tra sự cố (Cấp 1) ─── */}
                {incidentInspections.map((bbktksc: any) => {
                  const incInspections = inspectionRecords.filter(
                    (r: any) => r.idBienBan === bbktksc.id,
                  );
                  const isBBExpanded = expandedBBKTKSC === (bbktksc.id ?? "");

                  return (
                    <React.Fragment key={`bbktksc-${bbktksc.id}`}>
                      {/* Depth 1: BBKTKSC */}
                      <TableRow hover>
                        <TableCell sx={{ pl: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {bbktksc.daCoGiamDinh === 1 && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setExpandedBBKTKSC((prev) =>
                                    prev === bbktksc.id
                                      ? null
                                      : (bbktksc.id ?? null),
                                  )
                                }
                              >
                                {isBBExpanded ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                ml: incInspections.length > 0 ? 0 : "28px",
                              }}
                            >
                              {bbktksc.soPhieu}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="BB Kiểm tra SC"
                            size="small"
                            color="warning"
                            sx={{ color: "#fff" }}
                          />
                        </TableCell>
                        <TableCell>{bbktksc.ngayKiemTra}</TableCell>
                        <TableCell>
                          {showStatus(bbktksc.trangThai ?? 0)}
                        </TableCell>
                        <TableCell align="right">
                          {bbktksc.daCoGiamDinh === 1 ? (
                            <Chip
                              label="Đã có BB GĐ"
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          ) : (
                            <ActionCell
                              onAdd={() =>
                                setIncInspectionParentBBKTKSCId(
                                  bbktksc.id ?? "",
                                )
                              }
                              isAdd={
                                bbktksc.trangThai === 3 &&
                                bbktksc.daCoGiamDinh !== 1
                              }
                              addTooltip="Tạo BB Giám định"
                              addColor="success"
                              onEdit={() => {
                                setSelectedIncidentInspection(bbktksc);
                                setIncidentInspectionParentId(bbktksc.id ?? "");
                              }}
                              isEdit={bbktksc.trangThai === 0}
                              onDelete={() =>
                                deleteIncidentInspectionMutation.mutateAsync(
                                  bbktksc.id ?? "",
                                )
                              }
                              isDelete={bbktksc.trangThai === 0}
                            />
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Depth 2: BB Giám định */}
                      {isBBExpanded &&
                        inspectionRecords.map((insp: any) => {
                          const acceptances = acceptanceRecords.filter(
                            (a: any) => a.idGiamDinhMayMoc === insp.id,
                          );
                          const isInspExpanded =
                            expandedInspections === (insp.id ?? "");

                          return (
                            <React.Fragment key={`incinsp-${insp.id}`}>
                              <TableRow hover>
                                <TableCell sx={{ pl: 6 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {(insp.daCoBienPhap === 1 ||
                                      acceptances.length > 0) && (
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          setExpandedInspections((prev) =>
                                            prev === insp.id
                                              ? null
                                              : (insp.id ?? null),
                                          )
                                        }
                                      >
                                        {isInspExpanded ? (
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
                                          insp.daCoBienPhap === 1 ||
                                          acceptances.length > 0
                                            ? 0
                                            : "28px",
                                      }}
                                    >
                                      {insp.soPhieu}
                                    </Typography>
                                  </Box>
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
                                  {showStatus(insp.trangThai ?? 0)}
                                </TableCell>
                                <TableCell align="right">
                                  <ActionCell
                                    onAdd={() => {
                                      setExpandedInspections(insp.id ?? null);
                                      setBienPhapParentInspId(insp.id);
                                    }}
                                    isAdd={
                                      insp.trangThai === 3 &&
                                      insp.daCoBienPhap !== 1
                                    }
                                    addTooltip="Tạo Biện pháp sửa chữa"
                                    addColor="error"
                                    isEdit={insp.trangThai === 0}
                                    onEdit={() => {
                                      setIncInspectionParentBBKTKSCId(
                                        insp.idBienBan,
                                      );
                                      setSelectedIns(insp);
                                    }}
                                    editTooltip="Chỉnh sửa BB Giám định"
                                    editColor="primary"
                                    isDelete={insp.trangThai === 0}
                                    onDelete={() => {
                                      const deleteFn =
                                        plan?.nhomTaiSan === AssetGroup.MAYMOC
                                          ? deleteInspectionMutation
                                          : deleteInspectionVehicleMutation;
                                      deleteFn.mutateAsync(insp.id);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>

                              {/* Depth 3: Biện pháp sửa chữa */}
                              {isInspExpanded &&
                                bienPhapRecords.map((bp: any) => {
                                  const isBPExpanded =
                                    expandedBienPhap === (bp.id ?? "");
                                  const bpAcceptances =
                                    acceptanceRecords.filter(
                                      (a: any) => a.idBienPhapMayMoc === bp.id,
                                    );

                                  return (
                                    <React.Fragment key={`bp-${bp.id}`}>
                                      <TableRow hover>
                                        <TableCell sx={{ pl: 10 }}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {(bp.daCoNghiemThu === 1 ||
                                              bpAcceptances.length > 0) && (
                                              <IconButton
                                                size="small"
                                                onClick={() =>
                                                  setExpandedBienPhap((prev) =>
                                                    prev === bp.id
                                                      ? null
                                                      : (bp.id ?? null),
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
                                                  bp.daCoNghiemThu === 1 ||
                                                  bpAcceptances.length > 0
                                                    ? 0
                                                    : "28px",
                                              }}
                                            >
                                              {bp.soPhieu || bp.id}
                                            </Typography>
                                          </Box>
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
                                            onDelete={() =>
                                              (plan?.nhomTaiSan === AssetGroup.MAYMOC
                                                ? deleteBienPhapMayMocMutation
                                                : deleteBienPhapPhuongTienMutation
                                              ).mutateAsync(bp.id)
                                            }
                                          />
                                        </TableCell>
                                      </TableRow>

                                      {/* Depth 4: BB Nghiệm thu */}
                                      {isBPExpanded &&
                                        acceptanceRecords.map(
                                          (acc: any) => {
                                            const materials =
                                              materialQualityRecords.filter(
                                                (m: any) =>
                                                  m.idNghiemThu === acc.id,
                                              );
                                            const isAccExpanded =
                                              expandedAcceptances ===
                                              (acc.id ?? "");

                                            return (
                                              <React.Fragment
                                                key={`incacc-${acc.id}`}
                                              >
                                                <TableRow hover>
                                                  <TableCell sx={{ pl: 14 }}>
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      {acc.daCoDanhGiaVatTu ===
                                                        1 && (
                                                        <IconButton
                                                          size="small"
                                                          onClick={() =>
                                                            setExpandedAcceptances(
                                                              (prev) =>
                                                                prev === acc.id
                                                                  ? null
                                                                  : (acc.id ??
                                                                    null),
                                                            )
                                                          }
                                                        >
                                                          {isAccExpanded ? (
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
                                                              1 ||
                                                            materials.length > 0
                                                              ? 0
                                                              : "28px",
                                                        }}
                                                      >
                                                        {acc.soPhieu}
                                                      </Typography>
                                                    </Box>
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
                                                      acc.trangThai ?? 0,
                                                    )}
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    <ActionCell
                                                      onAdd={() =>
                                                        setMaterialParentAccId(
                                                          acc.id ?? "",
                                                        )
                                                      }
                                                      isAdd={
                                                        acc.trangThai === 3 &&
                                                        acc.daCoDanhGiaVatTu !==
                                                          1
                                                      }
                                                      addTooltip="Tạo BB Vật tư"
                                                      addColor="secondary"
                                                      isEdit={
                                                        acc.trangThai === 0
                                                      }
                                                      onEdit={() => {
                                                        setSelectedAcc(acc);
                                                        setAcceptanceParentBienPhapId(
                                                          acc.idBienPhapMayMoc,
                                                        );
                                                      }}
                                                      editTooltip="Chỉnh sửa BB Nghiệm thu"
                                                      editColor="primary"
                                                      isDelete={
                                                        acc.trangThai === 0
                                                      }
                                                      onDelete={() =>
                                                        (plan?.nhomTaiSan ===
                                                        AssetGroup.MAYMOC
                                                          ? deleteAcceptanceMutation
                                                          : deleteAcceptanceVehicleMutation
                                                        ).mutateAsync(acc.id)
                                                      }
                                                    />
                                                  </TableCell>
                                                </TableRow>

                                                {/* Depth 5: BB Vật tư */}
                                                {isAccExpanded &&
                                                  materialQualityRecords.map(
                                                    (mat: any) => (
                                                      <TableRow
                                                        hover
                                                        key={`incmat-${mat.id}`}
                                                      >
                                                        <TableCell
                                                          sx={{ pl: 18 }}
                                                        >
                                                          <Typography variant="body2">
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
                                                          {mat.ngayDanhGia ||
                                                            "—"}
                                                        </TableCell>
                                                        <TableCell>
                                                          {showStatus(
                                                            mat.trangThai ?? 0,
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
                                                                mat.id || "",
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
                        })}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Dialogs */}
      {incidentInspectionParentId && (
        <IncidentInspectionDialog
          open={true}
          onClose={() => {
            setIncidentInspectionParentId(null);
            setSelectedDeviceIds([]);
            setSelectedIncidentInspection(null);
          }}
          plan={plan}
          incidentReport={incident}
          selectedDeviceIds={selectedDeviceIds}
          initData={selectedIncidentInspection}
        />
      )}

      {(incInspectionParentBBKTKSCId || selectedIns) &&
        (() => {
          const parentId = selectedIns
            ? selectedIns.idBienBan
            : incInspectionParentBBKTKSCId;
          const parentBBKTKSC = incidentInspections.find(
            (r: any) => r.id === parentId,
          );

          if (!parentBBKTKSC) return null;

          if (plan?.nhomTaiSan === AssetGroup.PHUONGTIEN) {
            return (
              <InspectionRecordVehicleDialog
                open={true}
                onClose={() => {
                  setIncInspectionParentBBKTKSCId(null);
                  setSelectedIns(null);
                }}
                plan={plan}
                repairRequest={null}
                incidentInspection={parentBBKTKSC}
                initData={selectedIns}
              />
            );
          }

          return (
            <InspectionRecordDialog
              open={true}
              onClose={() => {
                setIncInspectionParentBBKTKSCId(null);
                setSelectedIns(null);
              }}
              plan={plan}
              repairRequest={null}
              incidentInspection={parentBBKTKSC}
              initData={selectedIns}
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

      {(acceptanceParentBienPhapId || selectedAcc) &&
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
          const targetBpId = selectedAcc
            ? selectedAcc.idBienPhapMayMoc
            : acceptanceParentBienPhapId;
          const bp = bienPhapRecords.find((r: any) => r.id === targetBpId);
          const parentInsp = bp
            ? inspectionRecords.find((r: any) => r.id === bp.idGiamDinhMayMoc)
            : null;
          return parentInsp ? (
            <AcceptanceTestDialog
              open={true}
              onClose={() => {
                setAcceptanceParentBienPhapId(null);
                setSelectedAcc(null);
              }}
              plan={plan}
              repairRequest={null as any}
              inspectionRecord={parentInsp}
              initData={selectedAcc}
              bienPhapId={targetBpId || undefined}
            />
          ) : null;
        })()}

      {(materialParentAccId || selectedMaterialAssessment) &&
        (() => {
          const parentId = selectedMaterialAssessment
            ? selectedMaterialAssessment.idNghiemThu
            : materialParentAccId;
          const parentAcc = acceptanceRecords.find(
            (a: any) => a.id === parentId,
          );
          return parentAcc ? (
            <MaterialDialog
              open={true}
              onClose={() => {
                setMaterialParentAccId(null);
                setSelectedMaterialAssessment(null);
              }}
              plan={plan}
              repairRequest={null as any}
              acceptanceRecord={parentAcc}
              initData={selectedMaterialAssessment}
            />
          ) : null;
        })()}

      {/* Incident Preview */}
      {incidentPreviewId && (
        <Dialog
          open={true}
          onClose={() => setIncidentPreviewId(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Phiếu báo sự cố — {incident.soPhieu}</DialogTitle>
          <DialogContent dividers>
            <IncidentPreview
              number={incident.soPhieu}
              detectedAt={incident.ngayPhatHien}
              reporter={""}
              reporterDeptId={incident.idDonViBaoCao}
              signers={incident.nguoiKyList}
              systemName={incident.tenHeThongThietBi}
              location={""}
              description={incident.moTa}
              severity={incident.mucDo}
              subsystem={inc.subsystem || inc.phanHeViTri}
              deviceEntries={inc.deviceEntries}
              planIds={inc.planIds}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIncidentPreviewId(null)}>Đóng</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default IncidentDetailPanel;
