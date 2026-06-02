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
import RepairLevelForm from "./components/RepairLevelForm";
import { showConfirmAlert } from "../../components/Alert";
import {
  useRepairLevelMutation,
  useRepairLevelPageQuery,
  useAllRepairLevelQuery,
} from "./Mutation";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { useDebounce } from "../../hooks/useDebounce";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { RepairLevel as RepairLevelType } from "./types";

export default function RepairLevel() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRepairLevel, setSelectedRepairLevel] = useState<RepairLevelType | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const debouncedSearchValue = useDebounce(searchValue, 600);
  const {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    importExcelMutation,
    exportMutation,
    deleteAllMutation,
  } = useRepairLevelMutation(
    paginationModel.page,
    paginationModel.pageSize,
    debouncedSearchValue,
  );

  const { data: repairLevelPage = { items: [], totalItems: 0 }, isLoading } =
    useRepairLevelPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      debouncedSearchValue,
    );
    
  const { data: allRepairLevels = [] } = useAllRepairLevelQuery();

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
    setSelectedRepairLevel(params.row as RepairLevelType);
    window.scrollTo({ top: 140, behavior: "smooth" });
    setReadOnly(true);
    setShowForm(true);
  };

  const handleSave = (values: RepairLevelType) => {
    if (selectedRepairLevel && !isCopy) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedRepairLevel(null);
    setIsCopy(false);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const columns: GridColDef[] = [
    {
      field: "kyHieu",
      headerName: "Ký hiệu",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ten",
      headerName: "Cấp bảo dưỡng, sửa chữa",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chuKyThucHien",
      headerName: "Chu kỳ thực hiện (giờ máy)",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const { mocGioDau, mocGioCuoi, chuKyThucHien } = params.row;
        if (mocGioDau != null && mocGioCuoi != null) {
          return `${mocGioDau} : ${mocGioCuoi}`;
        }
        return chuKyThucHien || "";
      },
    },
    {
      field: "soLanTrongChuKy",
      headerName: "Số lần thực hiện trong 1 chu kỳ",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "thoiGianSuaChua",
      headerName: "Thời gian dùng để sửa chữa",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenLoaiTaiSan",
      headerName: "Loại tài sản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "ghiChu",
      headerName: "Ghi chú",
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
              setSelectedRepairLevel({ ...copyData, id: "" } as RepairLevelType);
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
        title="Quản lý cấp sửa chữa"
        onNewClick={() => {
          setShowForm(true);
          setSelectedRepairLevel(null);
          setReadOnly(false);
        }}
        onExport={() => exportMutation.mutate(allRepairLevels)}
        onImport={handleImport}
        showExcel={true}
      />
      <Box p={2}>
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
              minWidth: "200px",
            },
          }}
        >
          <DialogContent>
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={20} color="inherit" thickness={4} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Đang xử lý dữ liệu cấp sửa chữa...
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
        {showForm && (
          <Box py={2}>
            <RepairLevelForm
              onCancel={() => {
                setShowForm(false);
                setSelectedRepairLevel(null);
                setReadOnly(false);
              }}
              onEdit={handleEdit}
              selectedRepairLevel={selectedRepairLevel || undefined}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          tableId="repairLevelTable"
          title="Quản lý cấp sửa chữa"
          columns={columns}
          rows={repairLevelPage.items}
          total={repairLevelPage.totalItems}
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
          onImportExcel={handleImport}
          onExportExcel={() => exportMutation.mutate(allRepairLevels)}
        />
      </Box>
    </Box>
  );
}
