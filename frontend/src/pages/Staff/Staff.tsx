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
import StaffForm from "./components/StaffForm";
import { useStaffMutation } from "./Mutation";
import { showConfirmAlert, showErrorAlert } from "../../components/Alert";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";

export default function Staff() {
  const [showForm, setShowForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  const {
    staffsPage,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    uploadMutation,
    isLoading,
    exportMutation,
    importExcelMutation,
  } = useStaffMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedStaff(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedStaff) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedStaff(null);
  };
  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleImport = (file: File) => {
    importExcelMutation.mutate(file, {
      onError: (error: any) => {
        // Kiểm tra nếu server trả về danh sách lỗi (array)
        const serverErrors = error.response?.data?.errors;
        if (Array.isArray(serverErrors) && serverErrors.length > 0) {
          setImportErrors(serverErrors);
          setOpenErrorDialog(true);
        } else {
          // Nếu không có mảng lỗi cụ thể, hiện alert lỗi chung như cũ
          showErrorAlert(
            error.response?.data?.message || "Lỗi khi nhập dữ liệu",
          );
        }
      },
    });
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã nhân viên",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hoTen",
      headerName: "Tên nhân viên",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "diDong",
      headerName: "Số điện thoại",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "emailCongViec",
      headerName: "Email",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenPhongBan",
      headerName: "Phòng ban",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenChucVu",
      headerName: "Chức vụ",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "signature",
      headerName: "Quyền ký",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isFlashSign = params.row.kyNhay;
        const isNormalSign = params.row.kyThuong;
        const isDigitalSign = params.row.kySo;
        const isSignature = !isFlashSign && !isNormalSign && !isDigitalSign;
        return (
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={1}
            py={1}
            height={"auto"}
          >
            {isFlashSign && (
              <Chip
                size="small"
                color="secondary"
                label="Ký nháy"
                sx={{ color: "white" }}
              />
            )}
            {isNormalSign && (
              <Chip
                size="small"
                color="primary"
                label="Ký thường"
                sx={{ color: "white" }}
              />
            )}
            {isDigitalSign && (
              <Chip
                size="small"
                color="success"
                label="Ký số"
                sx={{ color: "white" }}
              />
            )}
            {isSignature && (
              <Chip
                size="small"
                color="error"
                label="Không ký"
                sx={{ color: "white" }}
              />
            )}
          </Box>
        );
      },
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
        title="Quản lý nhân viên"
        onNewClick={() => {
          setShowForm(true);
          setSelectedStaff(null);
          setReadOnly(false);
        }}
        onExport={() => exportMutation.mutate()}
        onImport={handleImport}
        showExcel={true}
      />
      <Box p={2}>
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
                Đang xử lý dữ liệu...
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
        {showForm && (
          <Box py={2}>
            <StaffForm
              onCancel={() => {
                setShowForm(false);
                setSelectedStaff(null);
                setReadOnly(false);
              }}
              onEdit={handleEdit}
              selectedStaff={selectedStaff}
              readOnly={readOnly}
              onSave={handleSave}
              onUpload={uploadMutation.mutate}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý nhân viên"
          columns={columns}
          rows={staffsPage.items}
          total={staffsPage.totalItems}
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
      <ImportErrorDialog
        open={openErrorDialog}
        errors={importErrors}
        onClose={() => setOpenErrorDialog(false)}
      />
    </Box>
  );
}
