import React, { useState } from "react";
import {
  Box,
  Chip,
  Alert,
  Badge,
  Card,
  CardContent,
  Paper,
  Typography,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  AssignmentOutlined,
  BuildOutlined,
  FactCheckOutlined,
  PlaylistAddCheckOutlined,
  InventoryOutlined,
  WarningOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import PageAction from "../../../components/common/PageAction";
import TableCustom from "../../../components/common/TableCustom";
import { useCmms } from "../../../hooks/CmmsContext";
import StepPreview from "../components/step/StepPreview";
import RepairRequestPreview from "../components/preview/RepairRequestPreview";
import InspectionPreview from "../components/preview/InspectionPreview";
import AcceptancePreview from "../components/preview/AcceptancePreview";
import MaterialQualityPreview from "../components/preview/MaterialQualityPreview";
import IncidentPreview from "../components/preview/IncidentPreview";
import IncidentInspectionPreview from "../components/preview/IncidentInspectionPreview";
import { useSignBatch } from "../../../hooks/useSignBatch";
import { SignBatchModal } from "../../../components/SignDocument/Signbatchmodal";
import { useMaintenancePlanningPageQuery } from "../../MainenancePlanRepair/Mutation";
import { useDebounce } from "../../../hooks/useDebounce";
import { PlanAdapter } from "../Adapter";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useAllPositionsQuery } from "../../Position/Mutation";
import { useAllStaffsQuery } from "../../Staff/Mutation";
import { useAllDepartmentsQuery } from "../../Department/Mutation";
import {
  listSigneInfo,
  generateBienBanKeHoachPdf,
  getPermissionSigning,
  ShowPermissionSigning,
  canSign,
} from "../config";

import SignDocumentForm from "../components/signdocument/SignDocumentForm";
import { EditIcon } from "lucide-react";
import { useMaintenanceMutation } from "../mutation";
import { SignaturesData } from "../../../components/SignDocument/types";

export default function MaintenanceApprovalPage() {
  const {
    annualPlans,
    approvePlan,
    repairRequests,
    inspectionRecords,
    acceptanceTestRecords,
    materialQualityRecords,
    signAcceptanceRecords,
    signInspectionRecords,
    signMaterialQualityRecords,
    signRepairRequests,
    incidentReports,
    signIncidentReports,
    incidentInspectionRecords,
    signIncidentInspectionRecords,
  } = useCmms();

  const signBatch = useSignBatch();
  const { user } = useSelector((state: RootState) => state.user);

  const [activeTab, setActiveTab] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [justSigned, setJustSigned] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [detailTab, setDetailTab] = useState(0);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedItem, setSelectedItem] = useState<any[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const { data: positions } = useAllPositionsQuery();
  const { data: staffs } = useAllStaffsQuery();
  const { data: departments } = useAllDepartmentsQuery();

  const searchDebounce = useDebounce(searchValue, 500);
  const {
    data: planPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading,
  } = useMaintenancePlanningPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );

  const { signMutation } = useMaintenanceMutation(
    activeTab === 0 ? "maintenancePlanningPage" : "",
    activeTab === 0 ? "kehoach-suachua" : "",
  );

  const allRows = [
    { ...planPaged, items: planPaged.items.map(PlanAdapter) },
    repairRequests,
    inspectionRecords,
    acceptanceTestRecords,
    materialQualityRecords,
    incidentReports || [],
    incidentInspectionRecords || [],
  ];

  const pendingCounts = allRows.map(
    (rows: any) =>
      (rows?.trangThaiCounts?.["0"] || 0) + (rows?.trangThaiCounts?.["1"] || 0),
  );

  const tabConfigs = [
    { label: "Kế hoạch", icon: <AssignmentOutlined />, idLabel: "Mã KH" },
    { label: "Lệnh sửa chữa", icon: <BuildOutlined />, idLabel: "Số lệnh SC" },
    {
      label: "BB Giám định",
      icon: <FactCheckOutlined />,
      idLabel: "Số BB giám định",
    },
    {
      label: "BB Nghiệm thu",
      icon: <PlaylistAddCheckOutlined />,
      idLabel: "Số BB nghiệm thu",
    },
    {
      label: "BB Đánh giá VT",
      icon: <InventoryOutlined />,
      idLabel: "Số BB đánh giá",
    },
    {
      label: "Phiếu báo SỰ CỐ",
      icon: <WarningOutlined />,
      idLabel: "Số phiếu",
    },
    {
      label: "BB Kiểm tra SỰ CỐ",
      icon: <SearchOutlined />,
      idLabel: "Số BB kiểm tra",
    },
  ];

  const parentColumnConfigs: Record<
    number,
    { field: string; headerName: string }[]
  > = {
    1: [{ field: "planId", headerName: "Mã kế hoạch" }],
    2: [
      { field: "repairRequestId", headerName: "Mã lệnh SC" },
      { field: "incidentInspectionId", headerName: "Mã BB kiểm tra SC" },
    ],
    3: [{ field: "inspectionId", headerName: "Mã BB giám định" }],
    4: [{ field: "acceptanceId", headerName: "Mã BB nghiệm thu" }],
    5: [{ field: "planId", headerName: "Mã kế hoạch" }],
    6: [{ field: "incidentReportId", headerName: "Mã phiếu báo SC" }],
  };

  const isInDateRange = (row: any) => {
    const rawDate: string =
      row.createdDate ?? row.date ?? row.inspectionDate ?? row.detectedAt ?? "";
    if (!rawDate) return true;

    const parseVn = (s: string) => {
      const parts = s.split("/");
      if (parts.length === 3) {
        return new Date(
          `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`,
        );
      }
      return new Date(s);
    };

    const d = parseVn(rawDate);
    if (isNaN(d.getTime())) return true;

    if (dateFrom) {
      const from = new Date(dateFrom);
      if (d < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (d > to) return false;
    }
    return true;
  };

  const currentAllRows = allRows[activeTab];

  // const handleSign = async (selectedItems: any[]) => {
  //   const ids = selectedItems.map((i) => i.id);
  //   if (activeTab === 0) ids.forEach((id) => approvePlan(id));
  //   else if (activeTab === 1) signRepairRequests(ids);
  //   else if (activeTab === 2) signInspectionRecords(ids);
  //   else if (activeTab === 3) signAcceptanceRecords(ids);
  //   else if (activeTab === 4) signMaterialQualityRecords(ids);
  //   else if (activeTab === 5) signIncidentReports?.(ids);
  //   else if (activeTab === 6) signIncidentInspectionRecords?.(ids);
  //   setJustSigned(ids.join(", "));
  //   setSelectedIds([]);
  //   if (selectedRow && ids.includes(selectedRow.id)) {
  //     setSelectedRow((prev: any) => ({ ...prev, status: "da-duyet" }));
  //   }
  // };

  const handleSign = (data: SignaturesData[]) => {
    signMutation.mutate({
      SignaturesData: data,
      asset: selectedRow,
    });
  };

  const handleSignBatch = async (ids: string[]) => {
    try {
      if (activeTab === 0) {
        ids.forEach((id) => approvePlan(id));
      } else if (activeTab === 1) {
        signRepairRequests(ids);
      } else if (activeTab === 2) {
        signInspectionRecords(ids);
      } else if (activeTab === 3) {
        signAcceptanceRecords(ids);
      } else if (activeTab === 4) {
        signMaterialQualityRecords(ids);
      } else if (activeTab === 5) {
        signIncidentReports?.(ids);
      } else if (activeTab === 6) {
        signIncidentInspectionRecords?.(ids);
      }

      setJustSigned(ids.join(", "));
      setSelectedItem([]);
      setSelectedIds([]);
    } catch (error) {
      console.error("Lỗi ký biên bản:", error);
      throw error;
    }
  };

  const statusChip = (status: number) => {
    if (status === 0)
      return <Chip label="Bản nháp" color="default" size="small" />;
    if (status === 1)
      return <Chip label="Chờ duyệt" color="warning" size="small" />;
    if (status === 2)
      return <Chip label="Từ chối" color="error" size="small" />;
    if (status === 3)
      return <Chip label="Đã duyệt" color="success" size="small" />;
    return <Chip label="Bản nháp" color="default" size="small" />;
  };

  const buildColumns = (collapsed: boolean) => {
    const parentCols = (parentColumnConfigs[activeTab] ?? []).map((cfg) => ({
      field: cfg.field,
      headerName: cfg.headerName,
      width: 160,
      renderCell: (params: any) => (
        <span style={{ color: params.value ? "inherit" : "#bbb" }}>
          {params.value || "—"}
        </span>
      ),
    }));

    if (collapsed) {
      return [
        { field: "id", headerName: tabConfigs[activeTab].idLabel, flex: 1 },
        {
          field: "status",
          headerName: "TT",
          width: 110,
          renderCell: (params: any) => statusChip(params.row.status),
        },
      ];
    }

    return [
      { field: "id", headerName: tabConfigs[activeTab].idLabel, width: 160 },
      ...parentCols,
      { field: "moTa", headerName: "Mô tả", flex: 1, minWidth: 200 },
      { field: "ngayTao", headerName: "Ngày tạo", width: 120 },
      {
        field: "trangThaiKy",
        headerName: "Trạng thái ký",
        width: 200,
        renderCell: (params: any) =>
          ShowPermissionSigning(getPermissionSigning(params.row, user)),
      },
      {
        field: "trangThai",
        headerName: "Trạng thái",
        width: 140,
        renderCell: (params: any) => statusChip(params.row.trangThai),
      },
      {
        field: "sign",
        headerName: "Ký",
        width: 140,
        renderCell: (params: any) => (
          <IconButton
            aria-label="edit"
            onClick={(e) => {
              e.stopPropagation();
              if (canSign([params.row], user)) {
                setSelectedRow(params.row);
                setIsSigning(true);
              }
            }}
            size="small"
          >
            <EditIcon color="#1976d2" />
          </IconButton>
        ),
      },
    ];
  };

  const renderPreview = () => {
    if (!selectedRow) return null;
    switch (activeTab) {
      case 0:
        return (
          <SignDocumentForm
            selectedIds={[selectedRow.id]}
            onCancel={() => {
              setSelectedRow(null);
              setIsDetailOpen(false);
            }}
            onSign={() => {}}
            plan={selectedRow}
            staffs={staffs || []}
            departments={departments || []}
            positions={positions || []}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={false}
          />
        );
      case 1:
        return (
          <RepairRequestPreview
            plan={selectedRow}
            deviceIds={selectedRow.deviceIds ?? []}
            month={selectedRow.month ?? 1}
            year={selectedRow.year ?? new Date().getFullYear()}
            number={selectedRow.number ?? ""}
            signers={selectedRow.signers ?? []}
            sourceDeptId={selectedRow.sourceDepartmentId ?? ""}
            execDeptId={selectedRow.executionDepartmentId ?? ""}
          />
        );
      case 2:
        return <InspectionPreview row={selectedRow} />;
      case 3:
        return <AcceptancePreview row={selectedRow} />;
      case 4:
        return <MaterialQualityPreview row={selectedRow} />;
      case 5:
        return (
          <IncidentPreview
            number={selectedRow.number}
            detectedAt={selectedRow.detectedAt}
            reporter={selectedRow.reporter}
            reporterDeptId={selectedRow.reporterDeptId}
            signers={selectedRow.signers}
            systemName={selectedRow.systemName}
            location={selectedRow.location}
            description={selectedRow.description}
            severity={selectedRow.severity}
            subsystem={selectedRow.subsystem}
            deviceEntries={selectedRow.deviceEntries}
            planIds={selectedRow.planIds}
          />
        );
      case 6:
        return (
          <IncidentInspectionPreview
            number={selectedRow.number}
            inspectionDate={selectedRow.inspectionDate}
            location={selectedRow.location}
            findings={selectedRow.findings}
            recommendation={selectedRow.recommendation}
            items={selectedRow.items}
            signers={selectedRow.signers}
          />
        );
      default:
        return null;
    }
  };

  const renderSignProcess = (row: any) => {
    const signers = listSigneInfo(row, staffs, departments, positions);
    if (!signers.length)
      return (
        <Alert severity="info">Không có quy trình ký cho biên bản này.</Alert>
      );

    return (
      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          Quy trình ký
          <Chip
            label={`${signers.length} người`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 400 }}
          />
        </Typography>
        <Box sx={{ position: "relative", pl: 5 }}>
          <Box
            sx={{
              position: "absolute",
              left: 16,
              top: 8,
              bottom: 8,
              width: "1px",
              bgcolor: "divider",
            }}
          />
          {signers.map((s: any, idx: number) => (
            <Box
              key={`${s.hoTen}-${idx}`}
              sx={{ position: "relative", mb: 1.5 }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: -37,
                  top: 14,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  zIndex: 1,
                  boxShadow: "0 0 0 3px white",
                }}
              >
                {idx + 1}
              </Box>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 1.5,
                  bgcolor: "background.paper",
                  transition: "all 0.2s",
                  "&:hover": { boxShadow: 1, borderColor: "grey.300" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      {s.hoTen?.charAt(0) ?? "?"}
                    </Box>
                    <Box>
                      <Typography fontWeight={600} fontSize={13}>
                        {s.hoTen ?? "—"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.chucVu || ""}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={s.donVi || ""}
                          size="small"
                          sx={{ fontSize: 10, height: 18, bgcolor: "grey.100" }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    {s.signed ? (
                      <Chip
                        label={`Đã ký${s.signedAt ? ` • ${s.signedAt}` : ""}`}
                        size="small"
                        color="success"
                      />
                    ) : (
                      <Chip label="Chưa ký" size="small" color="warning" />
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <>
      {selectedRow && isSigning && activeTab === 0 && (
        <SignDocumentForm
          selectedIds={[selectedRow?.id]}
          onCancel={() => {
            setIsSigning(false);
            setSelectedRow(null);
          }}
          onSign={handleSign}
          plan={selectedRow}
          staffs={staffs || []}
          departments={departments || []}
          positions={positions || []}
          fullscreen={true}
          showSignerSidebar={true}
        />
      )}

      <PageAction title="Ký duyệt biên bản" />

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {justSigned && (
          <Alert severity="success" onClose={() => setJustSigned(null)}>
            Đã ký duyệt thành công: <strong>{justSigned}</strong>
          </Alert>
        )}

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Tab bar */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "#fff",
              display: "flex",
              justifyContent: "flex-end",
              overflowX: "auto",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, v) => {
                setActiveTab(v);
                setSelectedIds([]);
                setSearchValue("");
                setDateFrom("");
                setDateTo("");
                setSelectedRow(null);
                setSelectedItem([]);
              }}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: "bold",
                  minHeight: 64,
                },
              }}
            >
              {tabConfigs.map((t, i) => (
                <Tab
                  key={i}
                  iconPosition="top"
                  icon={
                    <Badge badgeContent={pendingCounts[i]} color="error">
                      {t.icon}
                    </Badge>
                  }
                  label={t.label}
                />
              ))}
            </Tabs>
          </Box>

          {/* ── Filter thời gian ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 2,
              py: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "#fafafa",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              Lọc theo ngày:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Từ
              </Typography>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPaginationModel((m) => ({ ...m, page: 0 }));
                }}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 13,
                  color: "inherit",
                  background: "transparent",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Đến
              </Typography>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPaginationModel((m) => ({ ...m, page: 0 }));
                }}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 13,
                  color: "inherit",
                  background: "transparent",
                }}
              />
            </Box>
            {(dateFrom || dateTo) && (
              <Chip
                label="Xóa bộ lọc"
                size="small"
                onDelete={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
                sx={{ fontSize: 11 }}
              />
            )}
          </Box>

          <SignBatchModal
            open={signBatch.isOpen}
            items={signBatch.items}
            isProcessing={signBatch.isProcessing}
            onConfirm={() => signBatch.confirmSign(handleSignBatch)}
            onClose={signBatch.closeModal}
          />

          {/* Nội dung: bảng + panel detail song song */}
          <Box sx={{ display: "flex", gap: 0, minHeight: 500 }}>
            {/* ── Bảng danh sách ── */}
            <Card
              elevation={0}
              sx={{
                flex: isDetailOpen ? "0 0 400px" : 1,
                transition: "flex 0.3s ease",
                overflow: "hidden",
                borderRadius: 0,
                borderRight: isDetailOpen ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ height: "100%", p: "0 !important" }}>
                <TableCustom
                  title="Biên bản chờ ký duyệt"
                  rows={currentAllRows.items}
                  columns={buildColumns(isDetailOpen)}
                  total={currentAllRows.totalItems}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  paginationMode="client"
                  checkboxSelection={!isDetailOpen}
                  selectedIds={selectedIds}
                  onSelectionChange={(ids) => {
                    setSelectedIds(ids);
                    const selected = currentAllRows.items.filter((row: any) =>
                      ids.includes(row.id),
                    );
                    setSelectedItem(selected);
                  }}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  showDelete={false}
                  onRowClick={(params) => {
                    setSelectedRow(params.row);
                    setDetailTab(0);
                    setIsDetailOpen(true);
                  }}
                  isRowSelectable={(params) =>
                    params?.row?.status === "cho-duyet"
                  }
                  showStatusFilter={false}
                  canSign={(items) => items.length >= 2}
                  handleSignDocument={(items, _user, _onSign) => {
                    signBatch.openModal(items);
                  }}
                  onSign={() => {}}
                />
              </CardContent>
            </Card>

            {/* ── Panel chi tiết / preview ── */}
            {isDetailOpen && selectedRow && (
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2,
                  overflow: "auto",
                  borderRadius: 0,
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Xem trước: {selectedRow.id}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedRow(null);
                      setIsDetailOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Tabs
                  value={detailTab}
                  onChange={(_, v) => setDetailTab(v)}
                  sx={{ mb: 2 }}
                >
                  <Tab label="Biên bản" />
                  <Tab label="Quy trình ký" />
                </Tabs>

                {detailTab === 0
                  ? renderPreview()
                  : renderSignProcess(selectedRow)}
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
