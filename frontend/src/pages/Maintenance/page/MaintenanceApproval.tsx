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
import MaterialQualityPreview from "../components/preview/MaterialQualityPreview";
import IncidentInspectionPreview from "../components/preview/IncidentInspectionPreview";
import { useSignBatch } from "../../../hooks/useSignBatch";
import { SignBatchModal } from "../../../components/SignDocument/Signbatchmodal";
import {
  useMaintenanceAcceptanceTestPageQuery,
  useMaintenanceIncidentPageQuery,
  useMaintenanceInspectionPageQuery,
  useMaintenanceMaterialAssessmentPageQuery,
  useMaintenancePlanningPageQuery,
  useMaintenanceRepairPageQuery,
  useMaintenanceIncidentInspectionPageQuery,
} from "../../MainenancePlanRepair/Mutation";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  AcceptanceTestAdapter,
  IncidentAdapter,
  InspectionAdapter,
  MaterialAssessmentAdapter,
  PlanAdapter,
  RepairAdapter,
  IncidentInspectionAdapter,
} from "../Adapter";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useAllPositionsQuery } from "../../Position/Mutation";
import { useAllStaffsQuery } from "../../Staff/Mutation";
import { useAllDepartmentsQuery } from "../../Department/Mutation";
import {
  listSigneInfo,
  generateBienBanKeHoachPdf,
  generatePhieuSuCoPdf,
  generateSuaChuaPdf,
  generateGiamDinhPdf,
  generateNghiemThuPdf,
  generateDanhGiaVatTuPdf,
  generateKiemTraSuCoPdf,
  getPermissionSigning,
  ShowPermissionSigning,
  canSign,
  showStatus,
} from "../config";

import SignDocumentForm from "../components/signdocument/SignDocumentForm";
import { EditIcon } from "lucide-react";
import { useMaintenanceMutation } from "../mutation";
import { SignaturesData } from "../../../components/SignDocument/types";
import { TypeBienBan } from "../../../utils/const";

export default function MaintenanceApprovalPage() {
  const { materialQualityRecords, incidentInspectionRecords } = useCmms();

  const signBatch = useSignBatch();
  const { user } = useSelector((state: any) => state.user);

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
    true,
    dateFrom,
    dateTo,
  );

  const {
    data: incidentPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading: isLoadingIncident,
  } = useMaintenanceIncidentPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    true,
    dateFrom,
    dateTo,
  );
  const {
    data: repairPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading: isLoadingRepair,
  } = useMaintenanceRepairPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    true,
    dateFrom,
    dateTo,
  );

  const {
    data: inspectionPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading: isLoadingInspection,
  } = useMaintenanceInspectionPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    true,
    dateFrom,
    dateTo,
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
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    true,
    dateFrom,
    dateTo,
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
    undefined,
    user?.taiKhoan?.tenDangNhap,
    true,
    dateFrom,
    dateTo,
  );

  const {
    data: incidentInspectionPaged = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
    },
    isLoading: isLoadingIncidentInspection,
  } = useMaintenanceIncidentInspectionPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    true,
    dateFrom,
    dateTo,
  );

  const { signMutation } = useMaintenanceMutation(
    activeTab === 0
      ? "maintenancePlanningPage"
      : activeTab === 1
        ? "repairPage"
        : activeTab === 2
          ? "inspectionPage"
          : activeTab === 3
            ? "acceptanceTestPage"
            : activeTab === 4
              ? "materialAssessmentPage"
              : activeTab === 5
                ? "incidentPage"
                : activeTab === 6
                  ? "incidentInspectionPage"
                  : "",
    activeTab === 0
      ? "kehoach-suachua"
      : activeTab === 1
        ? "suachua"
        : activeTab === 2
          ? "giamdinh"
          : activeTab === 3
            ? "nghiemthu"
            : activeTab === 4
              ? "danhgia-vattu"
              : activeTab === 5
                ? "suco-thietbi"
                : activeTab === 6
                  ? "kiemtra-suco"
                  : "",
    activeTab,
  );

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
    {
      ...incidentInspectionPaged,
      items: incidentInspectionPaged.items.map(IncidentInspectionAdapter),
    },
  ];

  const pendingCounts = allRows.map(
    (rows: any) =>
      (rows?.trangThaiCounts?.["0"] || 0) + (rows?.trangThaiCounts?.["1"] || 0),
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
      field: "soPhieu",
    },
  ];

  const parentColumnConfigs: Record<
    number,
    { field: string; headerName: string; key?: string }[]
  > = {
    1: [{ field: "planId", headerName: "Mã kế hoạch" }],
    2: [
      {
        field: "idBienBanSuaChua",
        headerName: "Mã lệnh SC",
        key: TypeBienBan.SUA_CHUA,
      },
      {
        field: "idBienBanKiemTra",
        headerName: "Mã BB kiểm tra SC",
        key: TypeBienBan.SU_CO,
      },
    ],
    3: [{ field: "idGiamDinh", headerName: "Mã BB giám định" }],
    4: [{ field: "idNghiemThu", headerName: "Mã BB nghiệm thu" }],
    5: [{ field: "planId", headerName: "Mã kế hoạch" }],
    6: [{ field: "idSuCo", headerName: "Mã phiếu báo SC" }],
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

  const handleSign = (data: SignaturesData[]) => {
    signMutation.mutate(
      {
        SignaturesData: data,
        asset: selectedRow || selectedItem,
      },
      {
        onSuccess: () => {
          setSelectedItem([]);
          setSelectedIds([]);
          setSelectedRow(null);
        },
      },
    );
  };

  const buildColumns = (collapsed: boolean) => {
    const parentCols = (parentColumnConfigs[activeTab] ?? []).map((cfg) => ({
      field: cfg.field,
      headerName: cfg.headerName,
      width: 160,
      renderCell: (params: any) => {
        // Tab giám định: hiển thị dữ liệu vào đúng cột loại biên bản
        if (activeTab === 2) {
          const loai = params.row.loaiBienBan; // 'sua_chua' | 'su_co'
          if (loai === cfg.key) {
            return <span>{params.row.idBienBan || "—"}</span>;
          }
          return <span style={{ color: "#bbb" }}>—</span>;
        }
        return (
          <span style={{ color: params.value ? "inherit" : "#bbb" }}>
            {params.value || "—"}
          </span>
        );
      },
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
      {
        field: tabConfigs[activeTab].field || "id",
        headerName: tabConfigs[activeTab].idLabel,
        width: 160,
      },
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
        renderCell: (params: any) => showStatus(params.row.trangThai),
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
            showHeader={true}
            generatePdf={() =>
              generateBienBanKeHoachPdf(
                selectedRow,
                staffs,
                departments,
                positions,
              )
            }
          />
        );
      case 1:
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
            showHeader={true}
            generatePdf={() =>
              generateSuaChuaPdf(selectedRow, staffs, departments, positions)
            }
          />
        );
      case 2:
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
            generatePdf={() =>
              generateGiamDinhPdf(selectedRow, staffs, departments, positions)
            }
          />
        );
      case 3:
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
            generatePdf={() =>
              generateNghiemThuPdf(selectedRow, staffs, departments, positions)
            }
          />
        );
      case 4:
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
            generatePdf={() =>
              generatePhieuSuCoPdf(selectedRow, staffs, departments, positions)
            }
          />
        );
      case 6:
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
            generatePdf={() =>
              generateKiemTraSuCoPdf(
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
          generatePdf={() =>
            generateBienBanKeHoachPdf(
              selectedRow,
              staffs,
              departments,
              positions,
            )
          }
        />
      )}
      {selectedRow && isSigning && activeTab === 1 && (
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
          generatePdf={() =>
            generateSuaChuaPdf(selectedRow, staffs, departments, positions)
          }
        />
      )}
      {selectedRow && isSigning && activeTab === 2 && (
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
          generatePdf={() =>
            generateGiamDinhPdf(selectedRow, staffs, departments, positions)
          }
        />
      )}
      {selectedRow && isSigning && activeTab === 3 && (
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
          generatePdf={() =>
            generateNghiemThuPdf(selectedRow, staffs, departments, positions)
          }
        />
      )}
      {selectedRow && isSigning && activeTab === 4 && (
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
          generatePdf={() =>
            generateDanhGiaVatTuPdf(selectedRow, staffs, departments, positions)
          }
        />
      )}

      {selectedRow && isSigning && activeTab === 5 && (
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
          generatePdf={() =>
            generatePhieuSuCoPdf(selectedRow, staffs, departments, positions)
          }
        />
      )}

      {selectedRow && isSigning && activeTab === 6 && (
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
          generatePdf={() =>
            generateKiemTraSuCoPdf(selectedRow, staffs, departments, positions)
          }
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
                setIsDetailOpen(false);
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
            <Box sx={{ flexGrow: 1 }} />
          </Box>

          <SignBatchModal
            open={signBatch.isOpen}
            items={signBatch.items}
            isProcessing={signBatch.isProcessing}
            onSign={handleSign}
            onClose={() => {
              signBatch.closeModal();
              setSelectedIds([]);
              setSelectedItem([]);
              setSelectedRow(null);
            }}
            generatePdf={
              activeTab === 0
                ? generateBienBanKeHoachPdf
                : activeTab === 1
                  ? generateSuaChuaPdf
                  : activeTab === 2
                    ? generateGiamDinhPdf
                    : activeTab === 3
                      ? generateNghiemThuPdf
                      : activeTab === 4
                        ? generateDanhGiaVatTuPdf
                        : activeTab === 5
                          ? generatePhieuSuCoPdf
                          : generateKiemTraSuCoPdf
            }
            staffs={staffs || []}
            departments={departments || []}
            positions={positions || []}
            user={user}
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
                  isRowSelectable={(params) => canSign([params.row], user)}
                  showStatusFilter={false}
                  canSign={(items) => items.length >= 1}
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
