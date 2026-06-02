import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { ContentCopy, Delete } from "@mui/icons-material";
import AssetProfileForm from "./components/AssetProfileForm";
import { useState } from "react";
import {
  useAllAssetProfileQuery,
  useAssetProfileMutation,
  useAssetProfilePageQuery,
} from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { useDebounce } from "../../hooks/useDebounce";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

export default function AssetProfile() {
  const [showForm, setShowForm] = useState(false);
  const [selectedAssetProfile, setSelectedAssetProfile] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useSelector((state: RootState) => state.user);

  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    importExcelMutation,
    exportMutation,
    deleteAllMutation,
  } = useAssetProfileMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
  );

  const debouncedSearchValue = useDebounce(searchValue, 600);
  const { data: assetProfilePage = { items: [], totalItems: 0 }, isLoading } =
    useAssetProfilePageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      debouncedSearchValue,
    );
  const { data: allAssetProfile = [] } = useAllAssetProfileQuery();

  const handleImport = (file: File) => {
    importExcelMutation.mutate(file, {
      onError: (error: any) => {
        if (error.message && error.message.includes("\n")) {
          const errorList = error.message.split("\n");
          setImportErrors(errorList);
          setShowErrorDialog(true);
        }
      },
    });
  };

  const handleRowClick = (params: GridRowParams) => {
    setSelectedAssetProfile(params.row);
    window.scrollTo({ top: 140, behavior: "smooth" });
    setReadOnly(true);
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedAssetProfile && !isCopy) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedAssetProfile(null);
    setIsCopy(false);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "maLyLich",
      headerName: "Mã lý lịch",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenLyLich",
      headerName: "Tên lý lịch",
      flex: 1,
      minWidth: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "moTa",
      headerName: "Mô tả",
      flex: 1,
      minWidth: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "ngayTao",
      headerName: "Ngày tạo",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ngayCapNhat",
      headerName: "Ngày cập nhật",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nguoiTao",
      headerName: "Người tạo",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nguoiCapNhat",
      headerName: "Người cập nhật",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "action",
      headerName: "Hành động",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box display="flex" gap={1} justifyContent="center" alignItems="center">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              const { id, ...copyData } = params.row;
              setSelectedAssetProfile({ ...copyData });
              setIsCopy(true);
              setReadOnly(false);
              setShowForm(true);
            }}
          >
            <ContentCopy color="primary" />
          </IconButton>
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
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <PageAction
        title="Quản lý lý lịch tài sản"
        onNewClick={() => {
          setShowForm(true);
          setSelectedAssetProfile(null);
          setReadOnly(false);
        }}
        onExport={() => exportMutation.mutate(allAssetProfile)}
        onImport={handleImport}
        showExcel={true}
      />
      <ImportErrorDialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        errors={importErrors}
      />

      <Dialog
        open={exportMutation.isPending || importExcelMutation.isPending}
        PaperProps={{
          sx: {
            borderRadius: 0,
            boxShadow: "none",
            border: "1px solid #d9d9d9",
            minWidth: "240px",
          },
        }}
      >
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2}>
            <CircularProgress size={20} color="inherit" thickness={4} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Đang xử lý dữ liệu lý lịch...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <AssetProfileForm
              onCancel={() => {
                setShowForm(false);
                setSelectedAssetProfile(null);
                setReadOnly(false);
              }}
              onEdit={handleEdit}
              selectedAssetProfile={selectedAssetProfile}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          tableId="assetProfile"
          title="Quản lý lý lịch tài sản"
          columns={columns}
          rows={assetProfilePage.items}
          total={assetProfilePage.totalItems}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          onRowClick={handleRowClick}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onDelete={deleteManyMutation.mutate}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onDeleteAll={deleteAllMutation.mutate}
          showDeleteAll={user?.taiKhoan?.tenDangNhap === "admin"}
        />
      </Box>
    </Box>
  );
}
