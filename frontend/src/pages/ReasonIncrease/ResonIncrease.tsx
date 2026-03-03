import { Delete } from "@mui/icons-material";
import {
  Box,
  Chip,
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
import ReasonIncreaseForm from "./components/ReasonIncreaseForm";
import {
  useAllReasonIncreaseQuery,
  useReasonIncreaseMutation,
  useReasonIncreasePageQuery,
} from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { useDebounce } from "../../hooks/useDebounce";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function ReasonIncrease() {
  const [showForm, setShowForm] = useState(false);
  const [selectedReasonIncrease, setSelectedReasonIncrease] =
    useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
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
    deleteAllMutation
  } = useReasonIncreaseMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
  );

  const debouncedSearchValue = useDebounce(searchValue, 600);
  const {
    data: reasonIncreasesPage = { items: [], totalItems: 0 },
    isLoading,
  } = useReasonIncreasePageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    debouncedSearchValue,
  );
  const { data: allReasonIncreases = [] } = useAllReasonIncreaseQuery();

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
    setSelectedReasonIncrease(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedReasonIncrease) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedReasonIncrease(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã lý do tăng",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ten",
      headerName: "Tên lý do tăng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tangGiam",
      headerName: "Tăng giảm",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.row.tangGiam ? "Tăng" : "Giảm"}
          sx={{
            bgcolor: params.row.tangGiam ? "#baf7cbff" : "#f98e86ff",
            color: params.row.tangGiam ? "#137333" : "#881d15ff",
          }}
        />
      ),
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
        title="Lý do tăng"
        onNewClick={() => {
          setShowForm(true);
          setSelectedReasonIncrease(null);
          setReadOnly(false);
        }}
        onExport={() => exportMutation.mutate(allReasonIncreases)}
        onImport={handleImport}
        showExcel={true}
      />

      <ImportErrorDialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        errors={importErrors}
      />

      {/* 3. Dialog Loading khi đang Export/Import */}
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
              Đang xử lý dữ liệu lý do tăng...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <ReasonIncreaseForm
              onCancel={() => {
                setShowForm(false);
                setSelectedReasonIncrease(null);
                setReadOnly(false);
              }}
              onEdit={handleEdit}
              selectedReasonIncrease={selectedReasonIncrease}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          tableId="réonIncrease"
          title="Danh sách lý do tăng"
          columns={columns}
          rows={reasonIncreasesPage.items}
          total={reasonIncreasesPage.totalItems}
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
