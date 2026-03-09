import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  Typography,
  Tab,
  Tabs,
  Badge,
} from "@mui/material";
import { ClassOutlined, TableChart } from "@mui/icons-material";
import { useState, useMemo, useCallback, useEffect } from "react";
import PageAction from "../../components/common/PageAction";
import MaintenanceRepairForm from "./components/MaintenanceRepairForm";
import MaintenanceRepairDetailSidebar from "./components/MaintenanceRepairDetailSidebar";
import TableCustom from "../../components/common/TableCustom";
import { useSelector } from "react-redux";
import { useAllDepartmentsQuery } from "../Department/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import { useAllCurrentStatusQuery } from "../CurrentStatus/Mutation";
import { useAllStaffsQuery } from "../Staff/Mutation";
import { showConfirmAlert } from "../../components/Alert";
import { GridColDef } from "@mui/x-data-grid";
import { Trash2, FileText } from "lucide-react";
import { SignHeader } from "../../components/SignDocument/SignHeader";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import { showStatus, showShareStatus } from "./config";
import {
  useMaintenanceRepairMutation,
  useMaintenanceRepairPageQuery,
} from "./Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import { useMaintenancePlanningPageQuery } from "../MainenancePlanRepair/Mutation";
import { showPeriod, showPlanType } from "../MainenancePlanRepair/config";
import { StatusPlan } from "../../utils/const";

export default function MaintenanceRepair() {
  const { user } = useSelector((state: any) => state.user);

  const [showForm, setShowForm] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [maintenanceRepairs, setMaintenanceRepairs] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSignDocument, setShowSignDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [activeTabRepair, setActiveTabRepair] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const { data: allDepartments = [] } = useAllDepartmentsQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();
  const { data: allCurrentStatus = [] } = useAllCurrentStatusQuery();
  const { data: allStaffs = [] } = useAllStaffsQuery();

  // API queries — load data from server
  const { data: repairPageData = { items: [], totalItems: 0 } } =
    useMaintenanceRepairPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      undefined,
      status !== "" ? parseInt(status) : undefined,
    );

  const searchDebounce = useDebounce(searchValue, 600);
  const { data: planPageData = { items: [], totalItems: 0 } } =
    useMaintenancePlanningPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      status,
    );

  // Repair mutations
  const {
    createMutation: createRepairMutation,
    updateMutation: updateRepairMutation,
    cancelMutation,
    deleteOneMutation: deleteRepairMutation,
    deleteManyMutation: deleteManyRepairMutation,
  } = useMaintenanceRepairMutation();

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleClose = useCallback(() => {
    setSelectedRepair(null);
    setShowForm(false);
    setShowResultForm(false);
    setReadOnly(false);
    setShowSidebar(false);
  }, []);

  const handleRowClick = useCallback(
    (params: any) => {
      const fullRepair = maintenanceRepairs.find((r) => r.id === params.row.id);
      setSelectedRepair(fullRepair || params.row);
      setShowForm(true);
      setShowResultForm(false);
      setReadOnly(true);
      setShowSidebar(true);
    },
    [maintenanceRepairs],
  );

  const handleSave = useCallback(
    async (values: any) => {
      const enrichedValues = {
        ...values,
        tenDonViGiao:
          allDepartments.find((d: any) => d.id === values.idDonViGiao)
            ?.tenPhongBan || "",
        tenDonViNhan:
          allDepartments.find((d: any) => d.id === values.idDonViNhan)
            ?.tenPhongBan || "",
        tenTrinhDuyetGiamDoc:
          allStaffs.find((s: any) => s.id === values.idTrinhDuyetGiamDoc)
            ?.hoTen || "",
      };

      if (values.id) {
        updateRepairMutation.mutate(enrichedValues);
      } else {
        createRepairMutation.mutate(enrichedValues);
      }
      handleClose();
    },
    [
      allDepartments,
      allStaffs,
      updateRepairMutation,
      createRepairMutation,
      handleClose,
    ],
  );

  const handleCancel = useCallback(async () => {
    if (selectedRepair) {
      const confirm = await showConfirmAlert(
        `Hủy phiếu sửa chữa bảo dưỡng "${selectedRepair?.id}"`,
      );
      if (confirm && confirm.isConfirmed) {
        cancelMutation.mutate(
          { id: selectedRepair.id, trangThai: 3 },
          { onSuccess: handleClose },
        );
      }
    }
  }, [selectedRepair, handleClose, cancelMutation]);

  const handleDeleteSelected = useCallback(
    (ids: string[]) => {
      deleteManyRepairMutation.mutate(ids, {
        onSuccess: () => {
          setSelectedIds([]);
          if (selectedRepair && ids.includes(selectedRepair.id)) {
            handleClose();
          }
        },
      });
    },
    [selectedRepair, handleClose, deleteManyRepairMutation],
  );

  const handleDelete = useCallback(
    async (rowId: string) => {
      const confirm = await showConfirmAlert(
        `Xóa phiếu sửa chữa bảo dưỡng "${rowId}"`,
      );
      if (confirm?.isConfirmed) {
        deleteRepairMutation.mutate(rowId, {
          onSuccess: () => {
            if (selectedRepair?.id === rowId) handleClose();
          },
        });
      }
    },
    [handleClose, selectedRepair, deleteRepairMutation],
  );

  const handleViewPdf = useCallback(
    async (_fileName: string, _filePath: string) => {
      // TODO: Implement S3 file preview
    },
    [],
  );
  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      value: "",
      count:
        planPageData?.groupCounts?.[StatusPlan.PENDING] +
          planPageData?.groupCounts?.[StatusPlan.PROGRESS] +
          planPageData?.groupCounts?.[StatusPlan.COMPLETED] || 0,
      color: "primary",
    },
    {
      label: "Chưa thực hiện",
      value: StatusPlan.PENDING,
      count: planPageData?.groupCounts?.[StatusPlan.PENDING] ?? 0,
      color: "warning",
    },
    {
      label: "Đang thực hiện",
      value: StatusPlan.PROGRESS,
      count: planPageData?.groupCounts?.[StatusPlan.PROGRESS] ?? 0,
      color: "info",
    },
    {
      label: "Đã hoàn thành",
      value: StatusPlan.COMPLETED,
      count: planPageData?.groupCounts?.[StatusPlan.COMPLETED] ?? 0,
      color: "success",
    },
  ];
  const columns: GridColDef<any>[] = useMemo(
    () => [
      {
        field: "tenPhieu",
        headerName: "Tên Phiếu",
        width: 180,
        headerAlign: "center",
        align: "left",
      },

      {
        field: "idLoaiSuaChua",
        headerName: "Loại sửa chữa",
        width: 160,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "ngayTao",
        headerName: "Ngày lập phiếu",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell(params) {
          if (!params.row?.ngayTao) return "";
          return new Date(params.row?.ngayTao).toLocaleString("vi-VN");
        },
      },

      {
        field: "ngayYeuCauHoanThanh",
        headerName: "Thời gian yêu cầu hoàn thành",
        width: 180,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "tenTrinhDuyetGiamDoc",
        headerName: "Trình duyệt biên bản",
        width: 160,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "tenFile",
        headerName: "Tài liệu duyệt",
        width: 160,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "id",
        headerName: "Ký số",
        width: 140,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "tenDonViGiao",
        headerName: "Đơn vị giao",
        width: 160,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "tenDonViNhan",
        headerName: "Đơn vị nhận",
        width: 160,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "trangThai",
        headerName: "Trạng thái phiếu",
        width: 140,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => showStatus(params.row?.trangThai ?? 0),
      },
      {
        field: "trangThai",
        headerName: "Trạn thái kí",
        width: 140,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => showStatus(params.row?.trangThai ?? 0),
      },
      {
        field: "share",
        headerName: "Trình duyệt",
        width: 140,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const isMyCreated =
            params.row?.nguoiTao === user?.taiKhoan?.tenDangNhap;
          return showShareStatus(params.row?.share ?? false, isMyCreated);
        },
      },

      {
        field: "HanhDong",
        headerName: "Hành động",
        width: 140,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const hasFile = !!params.row?.tenFile;
          return (
            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
              <Tooltip title={hasFile ? "Xem tài liệu" : "Chưa có tài liệu"}>
                <span>
                  <IconButton
                    color="info"
                    disabled={!hasFile}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPdf(
                        params.row.tenFile,
                        params.row.duongDanFile,
                      );
                    }}
                    sx={{
                      padding: "4px",
                      "&:hover:not(:disabled)": {
                        bgcolor: "rgba(2, 136, 209, 0.08)",
                      },
                    }}
                  >
                    <FileText size={20} strokeWidth={2} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Xóa">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(params.row.id);
                  }}
                  sx={{
                    padding: "4px",
                    "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" },
                  }}
                >
                  <Trash2 size={20} strokeWidth={2} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [user, allDepartments, handleRowClick, handleDelete, handleViewPdf],
  );

  const planningColumns = [
    {
      field: "tenKeHoach",
      headerName: "Tên kế hoạch",
      flex: 2,
      minWidth: 160,
      editable: false,
    },
    {
      field: "loaiKeHoach",
      headerName: "Loại kế hoạch",
      flex: 1.5,
      minWidth: 130,
      editable: false,
      renderCell: (params: any) => showPlanType(params.value),
    },
    {
      field: "thuocKy",
      headerName: "Thuộc kỳ",
      flex: 1,
      minWidth: 100,
      editable: false,
      renderCell: (params: any) => showPeriod(params.row.ngayBatDau),
    },
    {
      field: "tenDonViThucHien",
      headerName: "Đơn vị",
      flex: 1.5,
      minWidth: 130,
      editable: false,
    },
    {
      field: "tenNguoiPhuTrach",
      headerName: "Người phụ trách",
      flex: 1.5,
      minWidth: 120,
      editable: false,
    },
    {
      field: "ngayBatDau",
      headerName: "Ngày bắt đầu",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "ngayKetThuc",
      headerName: "Ngày kết thúc",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "trangThai",
      headerName: "Trạng thái",
      flex: 1.2,
      minWidth: 120,
      editable: false,
      renderCell: (params: any) => showStatus(params.value),
    },
    {
      field: "ngayTao",
      headerName: "Ngày tạo",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 100,
      editable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Xóa kế hoạch">
            <IconButton
              size="small"
              color="error"
              onClick={async (e) => {
                e.stopPropagation();
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      {!showSignDocument ? (
        <>
          <PageAction
            title="Sửa chữa, bảo dưỡng"
            onNewClick={() => {
              handleClose();
              setShowForm(true);
            }}
          />
          <Box sx={{ p: 2 }}>
            {activeTabRepair === 0 && showForm && !showResultForm && (
              <Box sx={{ mb: 2 }}>
                <MaintenanceRepairForm
                  key={showForm ? "new-form" : `edit-${selectedRepair?.id}`}
                  onClose={handleClose}
                  readOnly={readOnly}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  selectedRepair={selectedRepair}
                  departments={allDepartments}
                  staffs={(allStaffs || []).filter(
                    (staff: any) => staff.hasAccount,
                  )}
                  allUnits={allUnits}
                  allCurrentStatus={allCurrentStatus}
                />
              </Box>
            )}

            <Grid
              container
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                bgcolor: "background.paper",
              }}
            >
              {/* Tab header row */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "#fff",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Tabs
                    value={activeTabRepair}
                    onChange={(_e, v) => {
                      setActiveTabRepair(v);
                      setShowForm(false);
                      setShowResultForm(false);
                      setShowSidebar(false);
                    }}
                    sx={{
                      "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: "bold",
                        minHeight: "64px",
                      },
                    }}
                  >
                    <Tab
                      icon={<ClassOutlined />}
                      label="Phếu sửa chữa bảo dưỡng"
                      iconPosition="top"
                    />
                    <Tab
                      icon={
                        <Badge
                          badgeContent={planPageData.totalItems}
                          color="error"
                        >
                          <TableChart />
                        </Badge>
                      }
                      label="Kết quả sửa chữa bảo dưỡng"
                      iconPosition="top"
                    />
                  </Tabs>
                </Box>
              </Grid>

              {/* Table row */}
              <Grid
                size={{
                  xs: activeTabRepair === 0 && showSidebar ? 9 : 12,
                }}
                sx={{
                  transition: "all 0.3s ease",
                  borderRight:
                    activeTabRepair === 0 && showSidebar ? "1px solid" : "none",
                  borderColor: "divider",
                  "& .MuiPaper-root": {
                    margin: 0,
                    boxShadow: "none",
                    borderRadius: 0,
                  },
                }}
              >
                <TableCustom
                  title={
                    activeTabRepair === 0
                      ? "Phếu sửa chữa bảo dưỡng"
                      : "Kế hoạch sửa chữa bảo dưỡng"
                  }
                  columns={activeTabRepair === 0 ? columns : planningColumns}
                  rows={
                    activeTabRepair === 0
                      ? repairPageData.items
                      : planPageData.items
                  }
                  total={
                    activeTabRepair === 0
                      ? repairPageData?.totalItems || 0
                      : planPageData?.totalItems || 0
                  }
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={handleRowClick}
                  showStatusFilter={activeTabRepair === 0}
                  statusOptions={statusOptions}
                  statusValue={status}
                  onStatusChange={(value) => {
                    setStatus(value);
                  }}
                  selectedIds={selectedIds}
                  onSelectionChange={(ids) => {
                    setSelectedIds(ids);
                  }}
                  onDelete={handleDeleteSelected}
                  showDelete={true}
                />
                )
              </Grid>

              {/* Sidebar - only for tab 0 */}
              {activeTabRepair === 0 && showSidebar && (
                <Grid
                  size={{ xs: 3 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fafafa",
                    borderLeft: "1px solid #e0e0e0",
                  }}
                >
                  <MaintenanceRepairDetailSidebar
                    selectedRepair={selectedRepair}
                    onClose={() => setShowSidebar(false)}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      ) : (
        <Dialog
          fullScreen
          open={showSignDocument}
          onClose={() => {
            setShowSignDocument(false);
            setSelectedDocument(null);
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              bgcolor: "#ced4da",
            }}
          >
            <SignHeader
              pagesCount={1}
              handleExportPDF={() => {}}
              onCancel={() => {
                setShowSignDocument(false);
                setSelectedDocument(null);
              }}
            />

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "850px",
                  bgcolor: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  lineHeight: 0,
                }}
              >
                <iframe
                  src={`${selectedDocument}#toolbar=0&navpanes=0&scrollbar=0&view=FitW`}
                  style={{
                    width: "100%",
                    height: "1200px",
                    border: "none",
                  }}
                  title="PDF Viewer"
                />
              </Box>
            </Box>
          </Box>
        </Dialog>
      )}
    </>
  );
}
