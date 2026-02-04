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
import AssetGroupForm from "./components/AssetGroupForm";
import { useState } from "react";
import {
  useAllAssetGroupQuery,
  useAssetGroupMutation,
  useAssetGroupPageQuery,
} from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { useDebounce } from "../../hook/useDebounce";

export default function AssetGroup() {
  const [showForm, setShowForm] = useState(false);
  const [selectedAssetGroup, setSelectedAssetGroup] = useState<any>(null);
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
  } = useAssetGroupMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
  );

  const debouncedSearchValue = useDebounce(searchValue, 600);
  const { data: assetGroupPage = { items: [], totalItems: 0 }, isLoading } =
    useAssetGroupPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      debouncedSearchValue,
    );
  const { data: allAssetGroup = [] } = useAllAssetGroupQuery();

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
    setSelectedAssetGroup(params.row);
    setReadOnly(true);
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedAssetGroup) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedAssetGroup(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã nhóm tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenNhom",
      headerName: "Tên nhóm tài sản",
      flex: 1,
      minWidth: 200,
      align: "center",
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
        title="Quản lý nhóm tài sản"
        onNewClick={() => {
          setShowForm(true);
          setSelectedAssetGroup(null);
          setReadOnly(false);
        }}
        onExport={() => exportMutation.mutate(allAssetGroup)}
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
              Đang xử lý dữ liệu nhóm tài sản...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <AssetGroupForm
              onCancel={() => {
                setShowForm(false);
                setSelectedAssetGroup(null);
                setReadOnly(false);
              }}
              onEdit={handleEdit}
              selectedAssetGroup={selectedAssetGroup}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý nhóm tài sản"
          columns={columns}
          rows={assetGroupPage.items}
          total={assetGroupPage.totalItems}
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
