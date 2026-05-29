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
import DepartmentForm from "./components/DepartmentForm";
import { ContentCopy, Delete } from "@mui/icons-material";
import { useState } from "react";

import {
  useAllDepartmentsQuery,
  useDepartmentMutation,
  useDepartmentsPageQuery,
} from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";
import { useDebounce } from "../../hooks/useDebounce";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTabForm } from "../../redux/useTabForm";

interface DepartmentTabState {
  showForm: boolean;
  selectedDepartment: any | null;
  readOnly: boolean;
  isCopy: boolean;
  draftForm?: Record<string, any>;
}

export default function Department() {
  const { formData, setField } = useTabForm<DepartmentTabState>("/phong_ban");
  const showForm = formData.showForm ?? false;
  const isCopy = formData.isCopy ?? false;
  const selectedDepartment = formData.selectedDepartment ?? null;
  const readOnly = formData.readOnly ?? false;

  const setShowForm = (v: boolean) => setField({ showForm: v });
  const setIsCopy = (v: boolean) => setField({ isCopy: v });
  const setSelectedDepartment = (v: any) => setField({ selectedDepartment: v });
  const setReadOnly = (v: boolean) => setField({ readOnly: v });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useSelector((state: RootState) => state.user);

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
  } = useDepartmentMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
  );

  const debouncedSearchValue = useDebounce(searchValue, 600);
  const { data: departmentsPage = { items: [], totalItems: 0 }, isLoading } =
    useDepartmentsPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      debouncedSearchValue,
    );

  const { data: allDepartment } = useAllDepartmentsQuery();

  const handleRowClick = (params: GridRowParams) => {
    setSelectedDepartment(params.row);
    window.scrollTo({ top: 140, behavior: "smooth" });
    setReadOnly(true);
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedDepartment && !isCopy) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedDepartment(null);
    setIsCopy(false);
    setField({ draftForm: undefined })
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã phòng ban",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenPhongBan",
      headerName: "Tên phòng/ban",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenPhongCapTren",
      headerName: "Phòng ban cấp trên",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "soLuongNhanVien",
      headerName: "Số lượng nhân viên",
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
              setSelectedDepartment({ ...copyData, id: "" });
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
        title="Quản lý phòng ban"
        onNewClick={() => {
          setShowForm(true);
          setSelectedDepartment(null);
          setReadOnly(false);
        }}
        onExport={() => exportMutation.mutate(allDepartment)}
        onImport={(file) => importExcelMutation.mutate(file)}
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
            <DepartmentForm
              allDepartment={allDepartment}
              onCancel={() => {
                setShowForm(false);
                setSelectedDepartment(null);
                setReadOnly(false);
                setField({ draftForm: undefined })
              }}
              onEdit={handleEdit}
              selectedDepartment={selectedDepartment}
              readOnly={readOnly}
              onSave={handleSave}
              onFormChange={(values) => setField({ draftForm: values })}
              initialFormData={formData.draftForm}
            />
          </Box>
        )}
        <TableCustom
          tableId="department"
          title="Quản lý phòng ban"
          columns={columns}
          rows={departmentsPage.items}
          total={departmentsPage.totalItems}
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
