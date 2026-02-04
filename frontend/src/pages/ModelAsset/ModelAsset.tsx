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
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import {
  useAllModelAssetQuery,
  useModelAssetMutation,
  useModelAssetPageQuery,
} from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { useDebounce } from "../../hooks/useDebounce";
import ModelAssetForm from "./components/ModelAssetForm";

export default function ModelAsset() {
  const [showForm, setShowForm] = useState(false);
  const [selectedModelAsset, setSelectedModelAsset] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

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
  } = useModelAssetMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
  );

  const debouncedSearchValue = useDebounce(searchValue, 600);
  const { data: modelAssetPage = { items: [], totalItems: 0 }, isLoading } =
    useModelAssetPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      debouncedSearchValue,
    );
  const { data: allModelAsset = [] } = useAllModelAssetQuery();

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
    setSelectedModelAsset(params.row);
    setReadOnly(true);
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedModelAsset) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedModelAsset(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedModelAsset(null);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã mô hình",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenMoHinh",
      headerName: "Tên mô hình",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phuongPhapKhauHao",
      headerName: "Phương pháp khấu hao",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        if (value === 1) return "Đường thẳng";
        if (value === 0) return "Khác";
        return value;
      },
    },
    {
      field: "kyKhauHao",
      headerName: "Kỳ khấu hao",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "loaiKyKhauHao",
      headerName: "Loại kỳ khấu hao",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "taiKhoanTaiSan",
      headerName: "Tài khoản tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "taiKhoanKhauHao",
      headerName: "Tài khoản khấu hao",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "taiKhoanChiPhi",
      headerName: "Tài khoản chi phí",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ngayTao",
      headerName: "Ngày tạo",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ngayCapNhat",
      headerName: "Ngày cập nhật",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nguoiTao",
      headerName: "Người tạo",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nguoiCapNhat",
      headerName: "Người cập nhật",
      width: 120,
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
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <PageAction
        title="Quản lý mô hình tài sản"
        onNewClick={() => {
          setShowForm(true);
          setSelectedModelAsset(null);
          setReadOnly(false);
        }}
        onExport={() => exportMutation.mutate(allModelAsset)}
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
              Đang xử lý dữ liệu mô hình tài sản...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <ModelAssetForm
              onEdit={handleEdit}
              onCancel={handleCancel}
              selectedModelAsset={selectedModelAsset}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý mô hình tài sản"
          columns={columns}
          rows={modelAssetPage.items}
          total={modelAssetPage.totalItems}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          onRowClick={handleRowClick}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onDelete={deleteManyMutation.mutate}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </Box>
    </Box>
  );
}
