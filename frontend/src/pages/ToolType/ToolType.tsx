import { ContentCopy, Delete } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import TypeAssetForm from "./components/ToolTypeForm";
import {
  useAllToolTypeQuery,
  useToolTypeMutation,
  useToolTypePageQuery,
} from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { useDebounce } from "../../hooks/useDebounce";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function ToolType() {
  const [showForm, setShowForm] = useState(false);
  const [selectedToolType, setSelectedToolType] = useState<any>(null);
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
  } = useToolTypeMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
  );
  const debouncedSearchValue = useDebounce(searchValue, 600);
  const { data: toolTypesPage = { items: [], totalItems: 0 }, isLoading } =
    useToolTypePageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      debouncedSearchValue,
    );
  const { data: allToolTypes = [] } = useAllToolTypeQuery();

  const handleImport = (file: File) => {
    importExcelMutation.mutate(file, {
      onError: (error: any) => {
        if (error.message && error.message.includes("\n")) {
          setImportErrors(error.message.split("\n"));
          setShowErrorDialog(true);
        }
      },
    });
  };

  const handleRowClick = (params: GridRowParams) => {
    setSelectedToolType(params.row);
    window.scrollTo({ top: 140, behavior: "smooth" });
    setReadOnly(true);
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedToolType && !isCopy) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedToolType(null);
    setIsCopy(false);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã loại CCDC",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenLoaiCCDC",
      headerName: "Loại CCDC cha",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenLoai",
      headerName: "Tên loại CCDC",
      flex: 1,
      minWidth: 150,
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
              setSelectedToolType({ ...copyData, id: "" });
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
        title="Loại CCDC"
        onNewClick={() => {
          setShowForm(true);
          setSelectedToolType(null);
          setReadOnly(false);
        }}
        onExport={() => exportMutation.mutate(allToolTypes)}
        onImport={handleImport}
        showExcel={true}
      />

      <ImportErrorDialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        errors={importErrors}
      />

      <Dialog open={exportMutation.isPending || importExcelMutation.isPending}>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2}>
            <CircularProgress size={20} />
            <Typography variant="body2">
              Đang xử lý dữ liệu loại CCDC...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <TypeAssetForm
              onCancel={() => {
                setShowForm(false);
                setSelectedToolType(null);
                setReadOnly(false);
              }}
              onEdit={handleEdit}
              selectedToolType={selectedToolType}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          tableId="toolType"
          title="Quản lý loại CCDC"
          columns={columns}
          rows={toolTypesPage.items}
          total={toolTypesPage.totalItems}
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
