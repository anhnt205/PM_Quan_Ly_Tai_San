import { Delete, Inventory2, Build } from "@mui/icons-material";
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
import { useAllProjectsQuery } from "../Project/Mutation";
import { useAllReasonIncreaseQuery } from "../ReasonIncrease/Mutation";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { useAllModelAssetQuery } from "../ModelAsset/Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import { Eye, HistoryIcon } from "lucide-react";
import AssetHistoryModal from "./components/AssetHistoryModal";
import socketService from "../../services/socketService";
import { useLocation, useNavigate } from "react-router-dom";

export default function AssetManager() {
  const [tab, setTab] = React.useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

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
  } = useAssetManagerMutation((messages) => {
    setImportErrors(messages); // Lưu mảng lỗi vào state
    setOpenErrorModal(true); // Mở Modal MUI hiển thị danh sách lỗi
  });
  const valueDebounce = useDebounce(searchValue, 600);

  const { data: assetsPage = { items: [], totalItems: 0 }, isLoading } =
    useAssetPageQuery(
      tab < 3 ? tab : -1,
      paginationModel.page,
      paginationModel.pageSize,
      valueDebounce,
      selectedGroup,
      selectedDepartment,
    );

  // Use sample data for tab 3, real data for other tabs

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
      setSelectedAsset(null);
      setReadOnly(false);

      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleOpenHistory = (asset: any) => {
    setSelectedAsset(asset);
    setIsHistoryOpen(true);
  };

  const handleRowClick = (params: GridRowParams) => {
    setSelectedAsset(params.row);
    setReadOnly(true);
    setShowForm(true);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleSave = (values: any) => {
    if (selectedAsset) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedAsset(null);
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
      field: "action",
      headerName: "Hành động",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
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

          <Tooltip title="Xem">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpenViewModal(true);
              }}
              sx={{
                color: "#4F46E5",
                bgcolor: "#EEF2FF",
                "&:hover": {
                  bgcolor: "#E0E7FF",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s",
              }}
            >
              <Eye fontSize={16} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xem lịch sử điều chuyển">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenHistory(params.row);
              }}
              sx={{
                color: "#4F46E5",
                bgcolor: "#EEF2FF",
                "&:hover": {
                  bgcolor: "#E0E7FF",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s",
              }}
            >
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
          setSelectedAsset(null);
          setReadOnly(false);
        }}
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
                setSelectedAsset(null);
                setReadOnly(false);
              }}
              selectedAsset={selectedAsset}
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
            {assetGroups.map((i: any, index: number) => (
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
              <Tab
                label="Sửa chữa bảo dưỡng"
                icon={<Build fontSize="small" />}
                sx={{ fontSize: 12 }}
              />
            </Tabs>
          </Box>
          <TableCustom
            tableId="assetManager"
            title={
              tab === 0
                ? "Quản lý tài sản - Kho thu hồi"
                : tab === 1
                  ? "Quản lý tài sản - Tài sản đã bàn giao"
                  : tab === 2
                    ? "Quản lý tài sản - Kho công ty"
                    : "Sửa chữa bảo dưỡng"
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
            onDelete={deleteManyMutation.mutate}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            isDepreciation={true}
            departments={allDepartments}
            isFilterDepartment={tab === 1}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
          />
        </Box>
      </Box>
      <AssetHistoryModal
        open={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          setSelectedAsset(null);
          setShowForm(false);
        }}
        selectedAsset={selectedAsset}
      />
      <Dialog
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #04b46e 0%, #03a05a 100%)",
            color: "white",
            fontWeight: 600,
            fontSize: "1.2rem",
            padding: "20px",
          }}
        >
          Xem Ghi Chú
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "24px",
            minHeight: "180px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              background: "#f5f5f5",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "16px",
              minHeight: "100px",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <Typography
              sx={{
                color: "#666",
                fontSize: "1rem",
                lineHeight: "1.6",
                fontStyle: "italic",
              }}
            >
              Ghi chú hiện ở đây...
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "16px 24px",
            gap: "8px",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            onClick={() => setOpenViewModal(false)}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              padding: "8px 24px",
              color: "#666",
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={() => setOpenViewModal(false)}
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              padding: "8px 24px",
              background: "linear-gradient(135deg, #04b46e 0%, #03a05a 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #039b5f 0%, #038050 100%)",
              },
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
