import {
  Delete,
  Inventory2,
  Build,
  ContentCopy,
  ContentCopyTwoTone,
  MenuBookTwoTone,
  Edit,
  Close,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import AssetManagerForm from "./components/AssetManagerForm";
import AssetGroupItem from "./components/AssetGroupItem";
import { showConfirmAlert } from "../../components/Alert";
import { useAssetManagerMutation, useAssetPageQuery } from "./Mutation";
import { findById } from "../../utils/helpers";
import { useAllDepartmentsQuery } from "../Department/Mutation";
import { useAllCurrentStatusQuery } from "../CurrentStatus/Mutation";
import {
  useAllAssetGroupQuery,
  useAllTypeAssetByGroupQuery,
  useAllTypeAssetQuery,
} from "../TypeAsset/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import { useAllReasonIncreaseQuery } from "../ReasonIncrease/Mutation";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { useAllModelAssetQuery } from "../ModelAsset/Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import { BookOpenCheckIcon, Eye, HistoryIcon } from "lucide-react";
import AssetHistoryModal from "./components/AssetHistoryModal";
import { useLocation, useNavigate } from "react-router-dom";
import { ShowStatus } from "./config";
import AssetEbookModal from "./components/AssetEbookModal";
import AssetEbookContent from "./components/AssetEbookContent";
import { Action } from "../../utils/const";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useConfig } from "../../hooks/useContext";
import { FilterOption } from "../../components/common/FilterStatusGroup";

export default function AssetManager() {
  const [tab, setTab] = React.useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [isCopy, setIsCopy] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const { config } = useConfig();
  const [status, setStatus] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    exportAssetMutation,
    importAssetMutation,
    deleteAllMutation,
    createBatchMutation,
  } = useAssetManagerMutation((messages) => {
    setImportErrors(messages); // Lưu mảng lỗi vào state
    setOpenErrorModal(true); // Mở Modal MUI hiển thị danh sách lỗi
  });
  const valueDebounce = useDebounce(searchValue, 600);

  const {
    data: assetsPage = { items: [], totalItems: 0, loaiCounts: {} },
    isLoading,
  } = useAssetPageQuery(
    tab < 4 ? tab : -1,
    paginationModel.page,
    paginationModel.pageSize,
    valueDebounce,
    selectedGroup,
    selectedDepartment,
    config?.ngayBaoDangKiem,
    undefined,
    status,
  );
  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      count: assetsPage.loaiCounts?.["Tat ca"] ?? 0,
      color: "default",
      value: "",
    },
    {
      label: "Đã đăng kiểm",
      count: assetsPage?.loaiCounts?.["Da dang kiem"] ?? 0,
      color: "success",
      value: "DA_DANG_KIEM",
    },
    {
      label: "Sắp đến hạn đăng kiểm",
      count: assetsPage?.loaiCounts?.["Sap den han"] ?? 0,
      color: "warning",
      value: "SAP_DEN_HAN",
    },
    {
      label: "Quá hạn đăng kiểm",
      count: assetsPage?.loaiCounts?.["Qua han"] ?? 0,
      color: "error",
      value: "QUA_HAN",
    },
  ];

  const { data: allDepartments = [] } = useAllDepartmentsQuery();
  const { data: allCurrentStatus = [] } = useAllCurrentStatusQuery();
  const { data: assetGroups = [] } = useAllAssetGroupQuery();

  const { data: typeAssetsByAssetGroup = [] } =
    useAllTypeAssetByGroupQuery(selectedGroup);
  const { data: allTypeAssets = [] } = useAllTypeAssetQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();
  const { data: allModelAsset = [] } = useAllModelAssetQuery();
  const { data: allReasonIncreases = [] } = useAllReasonIncreaseQuery();

  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);

  useEffect(() => {
    if (location.state?.autoCreate) {
      setShowForm(true);
      setSelectedAssets([]);
      setReadOnly(false);

      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedAssets([params.row]);
    setShowSidebar(true);
    setShowForm(false);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleSave = (values: any[]) => {
    if (values.length > 0) {
      values.forEach((data) => {
        if (data.isNew) {
          createMutation.mutate(data);
        } else {
          updateMutation.mutate(data, {
            onSuccess: () => {
              if (values.length === 1) {
                setSelectedAssets([
                  {
                    ...data,
                    taiSanConList: (data.taiSanConList || []).filter(
                      (item: any) => !item.isDeleted,
                    ),
                    fileDinhKemList: (data.fileDinhKemList || []).filter(
                      (item: any) => item.action !== Action.DELETE,
                    ),
                  },
                ]);
              }
            },
          });
        }
      });
    }
    setShowForm(false);
    setReadOnly(true);
    setIsCopy(false);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "soThe",
      headerName: "Số thẻ",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenTaiSan",
      headerName: "Tên tài sản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ngayVaoSo",
      headerName: "Ngày vào sổ",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nvNS",
      headerName: "Vốn NS",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.row.nvNS || 0).toLocaleString(),
    },
    {
      field: "vonVay",
      headerName: "Vốn vay",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.row.vonVay || 0).toLocaleString(),
    },
    {
      field: "vonKhac",
      headerName: "Vốn khác",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.row.vonKhac || 0).toLocaleString(),
    },
    {
      field: "ngaySuDung",
      headerName: "Ngày sử dụng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "idDonViHienThoi",
      headerName: "Đơn vị hiện thời",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        findById(allDepartments, params.row.idDonViHienThoi)?.tenPhongBan,
    },
    {
      field: "taiSanConList",
      headerName: "Số lượng TS con",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.row.taiSanConList.length || 0,
    },
    {
      field: "tenNhom",
      headerName: "Nhóm tài sản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "idLoaiTaiSanCon",
      headerName: "Loại tài sản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        findById(allTypeAssets, params.row.idLoaiTaiSanCon)?.tenLoai,
    },
    {
      field: "hienTrang",
      headerName: "Hiện trạng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        findById(allCurrentStatus, params.row.hienTrang)?.tenHTKT,
    },
    {
      field: "soLuong",
      headerName: "Số lượng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "donViTinh",
      headerName: "Đơn vị tính",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        findById(allUnits, params.row.donViTinh)?.tenDonVi,
    },
    {
      field: "kyHieu",
      headerName: "Mã hiệu",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "soKyHieu",
      headerName: "Số mã hiệu",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "trangThaiKiemDinh",
      headerName: "Trạng thái kiểm định",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => ShowStatus(params.row.trangThaiKiemDinh ?? true),
    },
    {
      field: "action",
      headerName: "Hành động",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAssets([{ ...params.row, isNew: false }]);
                setReadOnly(true);
                setShowForm(true);
                setShowSidebar(false);
              }}
            >
              <Edit color="success" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sao chép">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                const { id, ...copyData } = params.row;
                setSelectedAssets([
                  {
                    ...copyData,
                    id: "",
                    isNew: true,
                    fileDinhKemList: [],
                    taiSanConList: copyData.taiSanConList.map((item: any) => ({
                      ...item,
                      id: "",
                      idTaiSanCha: "",
                      isInsert: true,
                    })),
                  },
                ]);
                setIsCopy(true);
                setReadOnly(false);
                setShowForm(true);
              }}
            >
              <ContentCopyTwoTone color="primary" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xóa">
            <IconButton
              onClick={async (e) => {
                e.stopPropagation();
                const confirm = await showConfirmAlert("Xác nhận xóa!");
                if (confirm.isConfirmed) {
                  deleteOneMutation.mutate(params.row.id);
                }
              }}
            >
              <Delete color="error" />
            </IconButton>
          </Tooltip>

          {/* <Tooltip title="Xem lý lịch">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setModalOpenBook(true);
                setSelectedAsset(params.row);
              }}
            >
              <MenuBookTwoTone color="success" />
            </IconButton>
          </Tooltip> */}
          {/* <Tooltip title="Xem">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setOpenViewModal(true);
              }}
            >
              <Eye color="#0288d1" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xem lịch sử điều chuyển">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleOpenHistory(params.row);
              }}
            >
              <HistoryIcon color="#7b1fa2" />
            </IconButton>
          </Tooltip> */}
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <ImportErrorDialog
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
        errors={importErrors}
      />

      <PageAction
        title="Quản lý tài sản"
        onNewClick={() => {
          setShowForm(true);
          setSelectedAssets([]);
          setReadOnly(false);
        }}
        loading={exportAssetMutation.isPending || importAssetMutation.isPending}
        onExport={() => exportAssetMutation.mutate()}
        onImport={(file) => importAssetMutation.mutate(file)}
        showExcel={true}
      />
      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <AssetManagerForm
              onCancel={() => {
                setShowForm(false);
                setSelectedAssets([]);
                setReadOnly(true);
              }}
              selectedAssets={selectedAssets}
              readOnly={readOnly}
              onEdit={handleEdit}
              onSave={handleSave}
              allAssetModel={allModelAsset}
              allCurrentStatus={allCurrentStatus}
              assetGroups={assetGroups}
              allDepartments={allDepartments}
              allUnits={allUnits}
              allReasonIncreases={allReasonIncreases}
            />
          </Box>
        )}
        <Paper sx={{ bgcolor: "#04b46eff", p: 2, mt: 2, width: "100%" }}>
          <Typography fontWeight={600} color="white">
            Quản lý tài sản
          </Typography>
          <Divider sx={{ bgcolor: "white", my: 2 }} />
          <Box
            display="flex"
            gap={2}
            sx={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              py: 1,

              // Thanh cuộn mỏng
              "&::-webkit-scrollbar": {
                height: 6,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255,255,255,0.6)",
                borderRadius: 10,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(255,255,255,0.2)",
              },
            }}
          >
            {assetGroups
              .filter((e: any) => e.soLuongTaiSan > 0)
              .map((i: any, index: number) => (
                <AssetGroupItem
                  key={i.id}
                  item={i}
                  selectedGroup={selectedGroup}
                  setSelectedGroup={setSelectedGroup}
                />
              ))}
          </Box>
        </Paper>
        <Box>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            bgcolor={"#f5efefff"}
          >
            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
              <Tab
                label="Kho thu hồi"
                icon={<Inventory2 fontSize="small" />}
                sx={{ fontSize: 12 }}
              />
              <Tab
                label="Tài sản đã bàn giao"
                icon={<Inventory2 fontSize="small" />}
                sx={{ fontSize: 12 }}
              />
              <Tab
                label="Kho công ty"
                icon={<Inventory2 fontSize="small" />}
                sx={{ fontSize: 12 }}
              />
            </Tabs>
          </Box>
          <Grid
            container
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              overflow: "hidden",
              alignItems: "stretch",
            }}
          >
            <Grid
              size={{ xs: showSidebar ? 6 : 12 }}
              sx={{
                transition: "all 0.3s ease",
                borderRight: showSidebar ? "1px solid #e0e0e0" : "none",
              }}
            >
              <TableCustom
                tableId="assetManager"
                title={
                  tab === 0
                    ? "Quản lý tài sản - Kho thu hồi"
                    : tab === 1
                      ? "Quản lý tài sản - Tài sản đã bàn giao"
                      : tab === 2
                        ? "Quản lý tài sản - Kho công ty"
                        : ""
                }
                columns={columns}
                rows={assetsPage.items}
                total={assetsPage.totalItems}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                loading={tab < 3 ? isLoading : false}
                onRowClick={handleRowClick}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                checkboxSelection={true}
                extraActions={
                  selectedIds.length > 0 && (
                    <Button
                      variant="contained"
                      size="small"
                      color="info"
                      onClick={() => {
                        const mapped = assetsPage.items.filter((item: any) =>
                          selectedIds.includes(item.id || item.soThe),
                        );
                        setSelectedAssets(mapped);
                        setReadOnly(true);
                        setShowForm(true);
                        setShowSidebar(false);
                      }}
                    >
                      Chỉnh sửa ({selectedIds.length})
                    </Button>
                  )
                }
                onDelete={deleteManyMutation.mutate}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isDepreciation={true}
                departments={allDepartments}
                isFilterDepartment={tab === 1}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                onDeleteAll={deleteAllMutation.mutate}
                showDeleteAll={user?.taiKhoan?.tenDangNhap === "admin"}
                statusOptions={statusOptions}
                onStatusChange={(value) => {
                  setStatus(value);
                }}
                statusValue={status}
              />
            </Grid>
            {showSidebar && (
              <Grid
                size={{ xs: 6 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "white",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <AssetEbookContent
                    selectedAsset={selectedAssets[0]}
                    readOnly={readOnly}
                    onEdit={handleEdit}
                    onCancel={() => {
                      setReadOnly(true);
                    }}
                    onClose={() => {
                      setShowSidebar(false);
                      setSelectedAssets([]);
                      setReadOnly(true);
                    }}
                    onSave={(values) => {
                      handleSave([values]);
                    }}
                    allAssetModel={allModelAsset}
                    allCurrentStatus={allCurrentStatus}
                    assetGroups={assetGroups}
                    allDepartments={allDepartments}
                    allUnits={allUnits}
                    allReasonIncreases={allReasonIncreases}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
      <AssetHistoryModal
        open={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          setSelectedAssets([]);
          setShowForm(false);
        }}
        selectedAsset={selectedAssets[0]}
      />
    </Box>
  );
}
