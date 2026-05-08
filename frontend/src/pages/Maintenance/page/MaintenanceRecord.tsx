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
import { useDebounce } from "../../../hooks/useDebounce";
import {
  useMaintenanceAcceptanceTestPageQuery,
  useMaintenanceIncidentPageQuery,
  useMaintenanceInspectionPageQuery,
  useMaintenanceMaterialAssessmentPageQuery,
  useMaintenancePlanningPageQuery,
  useMaintenanceRepairPageQuery,
} from "../../MainenancePlanRepair/Mutation";
import {
  generateBienBanKeHoachPdf,
  generatePhieuSuCoPdf,
  generateSuaChuaPdf,
  generateGiamDinhPdf,
  generateNghiemThuPdf,
  generateDanhGiaVatTuPdf,
  showStatus,
  listSigneInfo,
} from "../config";
import SignDocumentForm from "../components/signdocument/SignDocumentForm";
import { useAllDepartmentsQuery } from "../../Department/Mutation";
import { useAllStaffsQuery } from "../../Staff/Mutation";
import { useAllPositionsQuery } from "../../Position/Mutation";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import {
  AcceptanceTestAdapter,
  IncidentAdapter,
  InspectionAdapter,
  MaterialAssessmentAdapter,
  PlanAdapter,
  RepairAdapter,
} from "../Adapter";
import { FilterOption } from "../../../components/common/FilterStatusGroup";

export default function MaintenanceRecordPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [detailTab, setDetailTab] = useState(0);

  const { user } = useSelector((state: RootState) => state.user);

  // Filter ngày & trạng thái
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: staffs } = useAllStaffsQuery();
  const { data: departments } = useAllDepartmentsQuery();
  const { data: positions } = useAllPositionsQuery();

  const searchDebounce = useDebounce(searchValue, 500);
  const {
    data: planPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading,
  } = useMaintenancePlanningPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );

  const {
    data: incidentPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading: isLoadingIncident,
  } = useMaintenanceIncidentPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );
  const {
    data: repairPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading: isLoadingRepair,
  } = useMaintenanceRepairPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );

  const {
    data: inspectionPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading: isLoadingInspection,
  } = useMaintenanceInspectionPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );

  const {
    data: acceptanceTestPaged = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
    },
    isLoading: isLoadingAcceptanceTest,
  } = useMaintenanceAcceptanceTestPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );

  const {
    data: materialAssessmentPaged = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
    },
    isLoading: isLoadingMaterialAssessment,
  } = useMaintenanceMaterialAssessmentPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter ? Number(statusFilter) : undefined,
    user?.taiKhoan?.tenDangNhap,
  );

  const tabConfigs = [
    { label: "Kế hoạch", icon: <AssignmentOutlined />, idLabel: "Mã KH" },
    {
      label: "Lệnh sửa chữa",
      icon: <BuildOutlined />,
      idLabel: "Số lệnh SC",
      field: "soPhieu",
    },
    {
      label: "BB Giám định",
      icon: <FactCheckOutlined />,
      idLabel: "Số BB giám định",
      field: "soPhieu",
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
      field: "soPhieu",
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
      { field: "idSuaChua", headerName: "Mã lệnh SC" },
      { field: "incidentInspectionId", headerName: "Mã BB kiểm tra SC" },
    ],
    3: [{ field: "idGiamDinh", headerName: "Mã BB giám định" }],
    4: [{ field: "idNghiemThu", headerName: "Mã BB nghiệm thu" }],
    5: [{ field: "planId", headerName: "Mã kế hoạch" }],
    6: [{ field: "incidentReportId", headerName: "Mã phiếu báo SC" }],
  };

  const allRows = [
    { ...planPaged, items: planPaged.items.map(PlanAdapter) },
    { ...repairPaged, items: repairPaged.items.map(RepairAdapter) },
    { ...inspectionPaged, items: inspectionPaged.items.map(InspectionAdapter) },
    {
      ...acceptanceTestPaged,
      items: acceptanceTestPaged.items.map(AcceptanceTestAdapter),
    },
    {
      ...materialAssessmentPaged,
      items: materialAssessmentPaged.items.map(MaterialAssessmentAdapter),
    },
    { ...incidentPaged, items: incidentPaged.items.map(IncidentAdapter) },
    [],
  ];

  const currentAllData = allRows[activeTab];
  const safeRows = (currentAllData?.items || []).map((r: any) => ({
    ...r,
    id: r.id || crypto.randomUUID(),
  }));

  const tabCounts = allRows.map((data) => data?.totalItems || 0);

  const buildColumns = (collapsed: boolean) => {
    const parentCols = (parentColumnConfigs[activeTab] ?? []).map((cfg) => ({
      field: cfg.field,
      headerName: cfg.headerName,
      width: 160,
    }));

    if (collapsed) {
      return [
        {
          field: tabConfigs[activeTab].field || "id",
          headerName: tabConfigs[activeTab].idLabel,
          flex: 1,
        },
        {
          field: "trangThai",
          headerName: "TT",
          width: 110,
          renderCell: (params: any) => showStatus(params.row.trangThai),
        },
      ];
    }

    return [
      { field: "id", headerName: tabConfigs[activeTab].idLabel, width: 160 },
      ...parentCols,
      { field: "moTa", headerName: "Nội dung/Ghi chú", flex: 1, minWidth: 200 },
      { field: "ngayTao", headerName: "Ngày tạo", width: 120 },
      {
        field: "trangThai",
        headerName: "Trạng thái",
        width: 140,
        renderCell: (params: any) => showStatus(params.row.trangThai),
      },
    ];
  };

  const renderPreview = () => {
    if (!selectedRow) return null;
    const commonProps = {
      selectedIds: [selectedRow.id],
      onCancel: () => {
        setSelectedRow(null);
      },
      onSign: () => {},
      plan: selectedRow,
      staffs: staffs || [],
      departments: departments || [],
      positions: positions || [],
      fullscreen: false,
      showSignerSidebar: true,
      showHeader: false,
    };

    switch (activeTab) {
      case 0:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generateBienBanKeHoachPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
          />
        );
      case 1:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generateSuaChuaPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
          />
        );
      case 2:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generateGiamDinhPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
          />
        );
      case 3:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generateNghiemThuPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
          />
        );
      case 4:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generateDanhGiaVatTuPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
          />
        );
      case 5:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generatePhieuSuCoPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
          />
        );
      case 6:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generateGiamDinhPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
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

  const isDetailOpen = !!selectedRow;

  const resetFilters = () => {
    setSearchValue("");
    setDateFrom("");
    setDateTo("");
    setStatusFilter("");
    setSelectedRow(null);
    setPaginationModel((m) => ({ ...m, page: 0 }));
  };

  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      value: "",
      count: currentAllData.totalItems,
      color: "primary",
    },
    {
      label: "Bản nháp",
      value: 0,
      count: currentAllData?.trangThaiCounts?.["0"] || 0,
      color: "default",
    },
    {
      label: "Chờ duyệt",
      value: 1,
      count: currentAllData?.trangThaiCounts?.["1"] || 0,
      color: "warning",
    },
    {
      label: "Từ chối",
      value: 2,
      count: currentAllData?.trangThaiCounts?.["2"] || 0,
      color: "error",
    },
    {
      label: "Đã duyệt",
      value: 3,
      count: currentAllData?.trangThaiCounts?.["3"] || 0,
      color: "success",
    },
  ];

  return (
    <>
      <PageAction title="Quản lý biên bản" />

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* ── Tab bar ── */}
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
                resetFilters();
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
                    <Badge badgeContent={tabCounts[i]} color="primary">
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
              flexWrap: "wrap",
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
                label="Xóa bộ lọc ngày"
                size="small"
                onDelete={() => {
                  setDateFrom("");
                  setDateTo("");
                  setPaginationModel((m) => ({ ...m, page: 0 }));
                }}
                sx={{ fontSize: 11 }}
              />
            )}
          </Box>

          {/* ── Nội dung: bảng + panel detail song song ── */}
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
                  title="Danh sách biên bản"
                  rows={safeRows}
                  columns={buildColumns(isDetailOpen)}
                  total={currentAllData?.totalItems || 0}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  paginationMode="server"
                  checkboxSelection={!isDetailOpen}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  showDelete={false}
                  onRowClick={(params) => {
                    setSelectedRow(params.row);
                    setDetailTab(0);
                  }}
                  isRowSelectable={() => true}
                  showStatusFilter={!isDetailOpen}
                  statusOptions={statusOptions as any}
                  statusValue={statusFilter}
                  onStatusChange={(val) => {
                    setStatusFilter(val as any);
                    setPaginationModel((m) => ({ ...m, page: 0 }));
                  }}
                  canSign={() => false}
                />
              </CardContent>
            </Card>

            {/* ── Panel chi tiết / preview ── */}
            {isDetailOpen && (
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
                  <IconButton size="small" onClick={() => setSelectedRow(null)}>
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
