import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { devices } from "../../../../mockdata/mockDevices";
import { departments } from "../../../../mockdata/mockDepartments";
import type {
  AcceptanceTestRecord,
  MaterialQualityRecord,
  TechnicalInspectionRecord,
} from "../../../../mockdata/mockInspectionRecords";

import InspectionRecordDialog from "../dialog/InspectionRecordDialog";
import AcceptanceTestDialog from "../dialog/AcceptanceTestDialog";
import MaterialDialog from "../dialog/MaterialDialog";
import IncidentPreview from "../preview/IncidentPreview";
import IncidentInspectionDialog from "../dialog/Incidentinspectiondialog";
import {
  useMaintenanceAcceptanceByInspectionQuery,
  useMaintenanceIncidentInspectionBySuCoQuery,
  useMaintenanceInspectionByBienBanQuery,
  useMaintenanceMaterialAssessmentByInspectionQuery,
} from "../../../MainenancePlanRepair/Mutation";
import { MaintenancePlanData } from "../../../MainenancePlanRepair/types";
import type { IncidenData } from "../../types";
import { showStatus } from "../../config";

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
    {onAdd && (
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
    )}
  </Box>
);

const IncidentDetailPanel = ({ incident, plan, onClose }: Props) => {
  const [tab, setTab] = useState(0);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [expandedBBKTKSC, setExpandedBBKTKSC] = useState<Set<string>>(
    new Set(),
  );
  const [expandedInspections, setExpandedInspections] = useState<Set<string>>(
    new Set(),
  );
  const [expandedAcceptances, setExpandedAcceptances] = useState<Set<string>>(
    new Set(),
  );
  const [incidentInspectionParentId, setIncidentInspectionParentId] = useState<
    string | null
  >(null);
  const [incInspectionParentBBKTKSCId, setIncInspectionParentBBKTKSCId] =
    useState<string | null>(null);
  const [acceptanceParentInspId, setAcceptanceParentInspId] = useState<
    string | null
  >(null);
  const [materialParentAccId, setMaterialParentAccId] = useState<string | null>(
    null,
  );
  const [incidentPreviewId, setIncidentPreviewId] = useState<string | null>(
    null,
  );

  const { data: incidentInspections = [] } =
    useMaintenanceIncidentInspectionBySuCoQuery(incident?.id);

  const { data: inspectionRecords = [] } =
    useMaintenanceInspectionByBienBanQuery(
      expandedBBKTKSC.values().next().value,
    );

  const { data: acceptanceTestRecords = [] } =
    useMaintenanceAcceptanceByInspectionQuery(
      expandedInspections.values().next().value,
    );

  const { data: materialQualityRecords = [] } =
    useMaintenanceMaterialAssessmentByInspectionQuery(
      expandedAcceptances.values().next().value,
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

  const handleToggle = (id: string) =>
    setSelectedDeviceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const availableDevices = (incident?.danhSachTaiSan || []).filter(
    (d: any) => d?.daCoLenhSuaChua !== 1,
  );
  const handleSelectAll = () =>
    setSelectedDeviceIds(
      selectedDeviceIds.length === availableDevices.length
        ? []
        : availableDevices.map((d: any) => d.id || ""),
    );

  const toggle = (
    set: Set<string>,
    id: string,
    setter: (s: Set<string>) => void,
  ) => {
    const newSet = new Set(set);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setter(newSet);
  };

  const reporterDept = incident.idDonViBaoCao
    ? departments.find((d) => d.id === incident.idDonViBaoCao)
    : null;

  const severityColors: Record<any, string> = {
    Nhẹ: "#4caf50",
    "Trung bình": "#ff9800",
    Nặng: "#f44336",
    "Nghiêm trọng": "#9c27b0",
    0: "#4caf50",
    1: "#ff9800",
    2: "#f44336",
    3: "#9c27b0",
  };

  const severityLabels: Record<any, string> = {
    0: "Nhẹ",
    1: "Trung bình",
    2: "Nặng",
    3: "Nghiêm trọng",
    Nhẹ: "Nhẹ",
    "Trung bình": "Trung bình",
    Nặng: "Nặng",
    "Nghiêm trọng": "Nghiêm trọng",
  };

  const inc: any = incident;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Chi tiết: Phiếu báo sự cố {inc.soPhieu || inc.number}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Info section */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
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
        {(inc.mucDo !== undefined || inc.severity) && (
          <Chip
            label={severityLabels[inc.mucDo ?? inc.severity]}
            size="small"
            sx={{
              bgcolor: severityColors[inc.mucDo ?? inc.severity] || "#bdbdbd",
              color: "#fff",
            }}
          />
        )}
        {reporterDept && (
          <Typography variant="body2">
            <b>Đơn vị báo cáo:</b> {reporterDept.name}
          </Typography>
        )}
        {showStatus(inc.trangThai ?? 0)}
      </Box>

      {incident.moTa && (
        <Box sx={{ mb: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="body2">
            <b>Mô tả:</b> {incident.moTa}
          </Typography>
        </Box>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
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
                color="primary"
                disabled={selectedDeviceIds.length === 0}
                onClick={() => setIncidentInspectionParentId(incident.id)}
                size="small"
              >
                Tạo BB Kiểm tra sự cố ({selectedDeviceIds.length})
              </Button>
            </Box>
          )}

          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {incident.trangThai === 3 && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedDeviceIds.length > 0 &&
                          selectedDeviceIds.length < devicesInIncident.length
                        }
                        checked={
                          devicesInIncident.length > 0 &&
                          selectedDeviceIds.length === devicesInIncident.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Mã TB</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tên TB</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Nhóm</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Vị trí</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tình trạng</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(incident?.danhSachTaiSan ?? []).map((device, idx) => {
                  return (
                    <TableRow key={device.id}>
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
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Biên bản</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Loại</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ngày</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
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
                  const isBBExpanded = expandedBBKTKSC.has(bbktksc.id ?? "");

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
                                  toggle(
                                    expandedBBKTKSC,
                                    bbktksc.id ?? "",
                                    setExpandedBBKTKSC,
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
                              onView={() => setIncidentPreviewId(bbktksc.id)}
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
                            />
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Depth 2: BB Giám định */}
                      {isBBExpanded &&
                        inspectionRecords.map((insp: any) => {
                          const acceptances = acceptanceTestRecords.filter(
                            (a: any) => a.idGiamDinh === insp.id,
                          );
                          const isInspExpanded = expandedInspections.has(
                            insp.id,
                          );

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
                                    {(insp.daCoNghiemThu === 1 ||
                                      acceptances.length > 0) && (
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          toggle(
                                            expandedInspections,
                                            insp.id,
                                            setExpandedInspections,
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
                                          insp.daCoNghiemThu === 1 ||
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
                                    onView={() => {}}
                                    onAdd={() =>
                                      setAcceptanceParentInspId(insp.id)
                                    }
                                    isAdd={
                                      insp.trangThai === 3 &&
                                      insp.daCoNghiemThu !== 1
                                    }
                                    addTooltip="Tạo BB Nghiệm thu"
                                    addColor="warning"
                                  />
                                </TableCell>
                              </TableRow>

                              {/* Depth 3: BB Nghiệm thu */}
                              {isInspExpanded &&
                                acceptanceTestRecords.map((acc: any) => {
                                  const materials =
                                    materialQualityRecords.filter(
                                      (m: any) => m.idNghiemThu === acc.id,
                                    );
                                  const isAccExpanded = expandedAcceptances.has(
                                    acc.id ?? "",
                                  );

                                  return (
                                    <React.Fragment key={`incacc-${acc.id}`}>
                                      <TableRow hover>
                                        <TableCell sx={{ pl: 10 }}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {acc.daCoDanhGiaVatTu === 1 && (
                                              <IconButton
                                                size="small"
                                                onClick={() =>
                                                  toggle(
                                                    expandedAcceptances,
                                                    acc.id ?? "",
                                                    setExpandedAcceptances,
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
                                                  acc.daCoDanhGiaVatTu === 1 ||
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
                                          {acc.ngayNghiemThu}
                                        </TableCell>
                                        <TableCell>
                                          {showStatus(acc.trangThai ?? 0)}
                                        </TableCell>
                                        <TableCell align="right">
                                          <ActionCell
                                            onView={() => {}}
                                            onAdd={() =>
                                              setMaterialParentAccId(
                                                acc.id ?? "",
                                              )
                                            }
                                            isAdd={
                                              acc.trangThai === 3 &&
                                              acc.daCoDanhGiaVatTu !== 1
                                            }
                                            addTooltip="Tạo BB Vật tư"
                                            addColor="secondary"
                                          />
                                        </TableCell>
                                      </TableRow>

                                      {/* Depth 4: BB Vật tư */}
                                      {isAccExpanded &&
                                        materialQualityRecords.map(
                                          (mat: any) => (
                                            <TableRow
                                              hover
                                              key={`incmat-${mat.id}`}
                                            >
                                              <TableCell sx={{ pl: 14 }}>
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
                                                {mat.ngayDanhGia || "—"}
                                              </TableCell>
                                              <TableCell>
                                                {showStatus(mat.trangThai ?? 0)}
                                              </TableCell>
                                              <TableCell align="right">
                                                <ActionCell onView={() => {}} />
                                              </TableCell>
                                            </TableRow>
                                          ),
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
          onClose={() => setIncidentInspectionParentId(null)}
          plan={plan}
          incidentReport={incident}
        />
      )}

      {incInspectionParentBBKTKSCId &&
        (() => {
          const parentBBKTKSC = incidentInspections.find(
            (r: any) => r.id === incInspectionParentBBKTKSCId,
          );

          return parentBBKTKSC ? (
            <InspectionRecordDialog
              open={true}
              onClose={() => setIncInspectionParentBBKTKSCId(null)}
              plan={plan}
              repairRequest={null} // ← không có GĐ sửa chữa
              incidentInspection={parentBBKTKSC} // ← truyền deviceIds từ incident
            />
          ) : null;
        })()}

      {acceptanceParentInspId &&
        (() => {
          const parentInsp = inspectionRecords.find(
            (r: any) => r.id === acceptanceParentInspId,
          );
          return parentInsp ? (
            <AcceptanceTestDialog
              open={true}
              onClose={() => setAcceptanceParentInspId(null)}
              plan={plan}
              repairRequest={null as any}
              inspectionRecord={parentInsp}
              // onSubmit={(record) => {
              //   onCreateAcceptanceRecord(record);
              //   setAcceptanceParentInspId(null);
              // }}
            />
          ) : null;
        })()}

      {materialParentAccId &&
        (() => {
          const parentAcc = acceptanceTestRecords.find(
            (a: any) => a.id === materialParentAccId,
          );
          return parentAcc ? (
            <MaterialDialog
              open={true}
              onClose={() => setMaterialParentAccId(null)}
              plan={plan}
              repairRequest={null as any}
              acceptanceRecord={parentAcc}
              // onSubmit={(record) => {
              //   onCreateMaterialQualityRecord(record);
              //   setMaterialParentAccId(null);
              // }}
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
