import { useEffect, useState } from "react";
import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  EventNote as EventNoteIcon,
} from "@mui/icons-material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import AssetTransferForm from "./components/AssetTransferForm";
import SignerSidebar from "./components/SignerSidebar";
import SignDocumentForm from "./components/SignDocumentForm";
import BienBanDialog from "./components/BienBanDialog";
import TableCustom from "../../components/common/TableCustom";
import { AssetTransferData, SignaturesData } from "./types";
import PageAction from "../../components/common/PageAction";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAssetTranferMutation, useAssetTransferPageQuery } from "./Mutation";
import { useSelector } from "react-redux";
import {
  canSign,
  getDecision,
  getPermissionSigning,
  getTypeInfo,
  handleSendToSigner,
  handleSignDocument,
  isCheckShowDelete,
  isCheckShowShare,
  showDownloadFile,
  ShowPermissionSigning,
  showShareStatus,
  showStatus,
  showStatusDocument,
} from "./config";
import { showConfirmAlert } from "../../components/Alert";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import { Building, Trash2 } from "lucide-react";
import { AssetHandoverData } from "../AssetHandover/types";
import { useDebounce } from "../../hooks/useDebounce";
import {
  useAllStaffsQuery,
  useGetFileQuery,
  useStaffMutation,
} from "../Staff/Mutation";
import { useAllDepartmentsQuery } from "../Department/Mutation";
import { useAllCurrentStatusQuery } from "../CurrentStatus/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import S3Service from "../../services/S3Service";

export default function AssetTransfer() {
  const { user } = useSelector((state: any) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AssetTransferData | null>(
    null,
  );
  const [showSidebar, setShowSidebar] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showSignDocument, setShowSignDocument] = useState(false);
  const [showSignerSidebar, setShowSignerSidebar] = useState(true);
  const [showBienBanDialog, setShowBienBanDialog] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [assetHandover, setAssetHandover] = useState<AssetHandoverData[]>([]);

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const [assetTransferDetail, setAssetTransferDetail] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const {
    handleDownloadFile,
    createMutation,
    updateMutation,
    updateManyMutation,
    cancelMutation,
    deleteOneMutation,
    handleSignatureList,
    signMutation,
    getAssetHandoverMutation,
    decisionMutation,
  } = useAssetTranferMutation();

  const debouncedSearchValue = useDebounce(searchValue, 600);
  const {
    data: assetTranferPage = {
      items: [],
      totalItems: 0,
      loaiCounts: {},
      trangThaiCounts: {},
    },
    isLoading,
  } = useAssetTransferPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    debouncedSearchValue,
    type ? Number(type) : undefined,
    user?.taiKhoan?.tenDangNhap,
    status ? Number(status) : undefined,
  );

  const { data: allStaffs = [] } = useAllStaffsQuery();
  const { data: allDepartments = [] } = useAllDepartmentsQuery();
  const { data: allCurrentStatus = [] } = useAllCurrentStatusQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();

  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      count: assetTranferPage.loaiCounts?.[`${type}`] ?? 0,
      color: "default",
      value: "",
    },
    {
      label: "Nháp",
      count: assetTranferPage?.trangThaiCounts?.["0"] ?? 0,
      color: "default",
      value: "0",
    },
    {
      label: "Duyệt",
      count: assetTranferPage?.trangThaiCounts?.["1"] ?? 0,
      color: "info",
      value: "1",
    },
    {
      label: "Hủy",
      count: assetTranferPage?.trangThaiCounts?.["2"] ?? 0,
      color: "error",
      value: "2",
    },
    {
      label: "Chưa ban hành",
      count: assetTranferPage?.trangThaiCounts?.["3"] ?? 0,
      color: "success",
      value: "3",
    },
    {
      label: "Đã ban hành",
      count: assetTranferPage?.trangThaiCounts?.["4"] ?? 0,
      color: "secondary",
      value: "4",
    },
  ];

  useEffect(() => {
    setSelectedIds([]);
    setSelectedDocument(null);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedRow(null);
    setShowForm(false);
    setShowSidebar(false);
    setReadOnly(false);
  }, [type]);

  useEffect(() => {
    if (location.state?.autoCreate) {
      setShowForm(true);
      setSelectedRow(null);
      setReadOnly(false);

      navigate(location.pathname + location.search, { replace: true });
    }
  }, [
    location.state?.autoCreate,
    location.pathname,
    location.search,
    navigate,
  ]);

  const { title, label } = getTypeInfo(type);

  const handleRowClick = (params: GridRowParams) => {
    const data = params.row as AssetTransferData;
    setSelectedRow(data);
    setShowForm(true);
    setReadOnly(true);
    setShowSidebar(true);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const handleClose = () => {
    setSelectedIds([]);
    setSelectedDocument(null);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedRow(null);
    setShowForm(false);
    setShowSidebar(false);
    setReadOnly(false);
    setAssetHandover([]);
  };

  const handleSend = (items: any[]) => {
    handleSendToSigner(items, updateManyMutation.mutateAsync, handleClose);
  };
  const handleSave = async (values: any) => {
    if (selectedRow) {
      await updateMutation.mutate(values);
      handleClose();
    } else {
      await createMutation.mutate(values);
      handleClose();
    }
  };
  const handleCancel = async () => {
    if (selectedRow) {
      const confirm = await showConfirmAlert(
        `Hủy phiếu ${title} "${selectedRow?.id}"`,
      );
      if (confirm.isConfirmed) {
        await cancelMutation.mutate(selectedRow);
        handleClose();
      }
    }
  };

  const handleSign = (data: SignaturesData[]) => {
    signMutation.mutate({
      SignaturesData: data,
      asset: selectedRow,
    });
  };
  const handleDecision = (data: any) => {
    decisionMutation.mutate(data);
  };

  const handleViewSignAssets = async (fileName: string, item: any) => {
    setSelectedDocument(fileName);
    setShowSignDocument(true);
    setSelectedRow(item);
    setAssetTransferDetail(item.chiTietDieuDongTaiSanDTOS);
    setShowSignerSidebar(true); // Hiện sidebar khi ký
  };

  const handleViewBienBan = async (id: string) => {
    const result: any[] = await getAssetHandoverMutation.mutateAsync(id);
    setAssetHandover(result);
    setShowBienBanDialog(true);
  };

  const columns: GridColDef<any>[] = [
    {
      field: "id",
      headerName: "Mã",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tenPhieu",
      headerName: "Phiếu ký nội sinh",
      width: 200,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "trichYeu",
      headerName: "Trích yếu",
      width: 180,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "ngayHieuLuc",
      headerName: "Ngày có hiệu lực",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell(params) {
        if (!params.row?.tgGnTuNgay) return "";
        return new Date(params.row?.tgGnTuNgay).toLocaleString("vi-VN");
      },
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
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return showDownloadFile(
          params.value,
          () => S3Service.download(params.row.duongDanFile),
          // handleDownloadFile(params.value),
        );
      },
    },
    {
      field: "tgGnTuNgay",
      headerName: "Thời gian giao nhận từ ngày",
      width: 160,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: any) => {
        if (!value) return "";
        return new Date(value).toLocaleString("vi-VN");
      },
    },

    {
      field: "tgGnDenNgay",
      headerName: "Thời gian giao nhận đến ngày",
      width: 160,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: any) => {
        if (!value) return "";
        return new Date(value).toLocaleString("vi-VN");
      },
    },

    {
      field: "tenDonViGiao",
      headerName: "Đơn vị giao",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tenDonViNhan",
      headerName: "Đơn vị nhận",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "trangThai",
      headerName: "Trạng thái phiếu",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => showStatus(params.row.trangThai ?? 0),
    },

    {
      field: "TrangThaiKy",
      headerName: "Trạng thái ký",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        ShowPermissionSigning(
          getPermissionSigning(params.row, user, allStaffs),
        ),
    },

    {
      field: "TrangThaiBanGiao",
      headerName: "Trạng thái bàn giao",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        showStatusDocument(params.row?.trangThaiPhieuDieuDong ?? 0),
    },

    {
      field: "share",
      headerName: "Trình duyệt",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        showShareStatus(
          params.row?.share ?? false,
          params.row?.nguoiTao === user?.taiKhoan?.tenDangNhap,
        ),
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
        const rowData = params.row as AssetTransferData;
        return (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title="Xóa">
              <IconButton
                color="error"
                disabled={!isCheckShowDelete(rowData, user)}
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirm = await showConfirmAlert(
                    `Xóa phiếu ${title} "${rowData?.id}"`,
                  );
                  if (confirm.isConfirmed) {
                    deleteOneMutation.mutate(rowData);
                  }
                }}
                sx={{
                  padding: "4px",
                  "&:hover": { bgcolor: "rgba(244, 67, 54, 0.08)" },
                }}
              >
                <Trash2 size={20} strokeWidth={2} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xem phiếu bàn giao">
              <IconButton
                color="primary"
                disabled={!rowData.coPhieuBanGiao}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewBienBan(rowData.id);
                }}
                sx={{
                  padding: "4px",
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.08)" },
                }}
              >
                <Building size={20} strokeWidth={2} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xem">
              <IconButton
                color="success"
                onClick={async (e) => {
                  e.stopPropagation();
                  setSelectedDocument(rowData.taiLieuCuoi);
                  setAssetTransferDetail(
                    rowData.chiTietDieuDongTaiSanDTOS || [],
                  );
                  setShowSignerSidebar(false); // Ẩn sidebar khi xem
                  setSelectedIds([rowData.id]);
                  setShowSignDocument(true);
                }}
                sx={{
                  padding: "4px",
                  "&:hover": { bgcolor: "rgba(76, 175, 80, 0.08)" },
                }}
              >
                <VisibilityIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <BienBanDialog
        open={showBienBanDialog}
        onClose={() => setShowBienBanDialog(false)}
        assetHandover={assetHandover}
        handleSignatureList={handleSignatureList}
      />

      {showSignDocument ? (
        <SignDocumentForm
          selectedIds={selectedIds}
          document={selectedDocument}
          onCancel={handleClose}
          onSign={handleSign}
          assetTransferDetail={assetTransferDetail}
          showSignerSidebar={showSignerSidebar}
          allUnits={allUnits}
          allCurrentStatus={allCurrentStatus}
          fullscreen={true}
          staffs={allStaffs}
          isEdit={false}
        />
      ) : (
        <>
          <PageAction
            title={title}
            onNewClick={() => {
              handleClose();
              setShowForm(true);
            }}
          />
          <Box sx={{ p: 2 }}>
            {showForm && (
              <Box sx={{ mb: 2 }}>
                <AssetTransferForm
                  key={showForm ? "new-form" : `edit-${selectedRow?.id}`}
                  onClose={handleClose}
                  readOnly={readOnly}
                  type={Number(type)}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  selectedTransfer={selectedRow}
                  label={label}
                  isSignedForm={!!selectedRow && !showForm}
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
                display: "flex",
                alignItems: "stretch",
                bgcolor: "background.paper",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Grid
                size={{ xs: showSidebar ? 9 : 12 }}
                sx={{
                  transition: "all 0.3s ease",
                  borderRight: showSidebar ? "1px solid" : "none",
                  borderColor: "divider",
                  "& .MuiPaper-root": {
                    margin: 0,
                    boxShadow: "none",
                    borderRadius: 0,
                  },
                }}
              >
                <TableCustom
                  tableId="assetTransfer"
                  title={`Phiếu duyệt ${label}`}
                  columns={columns}
                  rows={assetTranferPage.items}
                  total={assetTranferPage.totalItems}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={handleRowClick}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  // onDelete={handleDelete}
                  onSign={handleViewSignAssets}
                  handleSignDocument={handleSignDocument}
                  canSign={canSign}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  showStatusFilter={true}
                  showDelete={false}
                  handleSendToSigner={handleSend}
                  statusOptions={statusOptions}
                  onStatusChange={(value) => {
                    setStatus(value);
                  }}
                  handleDecision={handleDecision}
                  isDecision={getDecision}
                  statusValue={status}
                  isCheckShowShare={isCheckShowShare}
                  loading={isLoading}
                />
              </Grid>

              {showSidebar && (
                <Grid
                  size={{ xs: 3 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fafafa",
                  }}
                >
                  <SignerSidebar
                    selectedRow={selectedRow}
                    onClose={() => setShowSidebar(false)}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
