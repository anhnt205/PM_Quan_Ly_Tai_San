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
import MaintenanceRepairTypeForm from "./components/MaintenanceRepairTypeForm";
import { Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import {
  showConfirmAlert,
  showSuccessAlert,
  showErrorAlert,
} from "../../components/Alert";
import { useDebounce } from "../../hooks/useDebounce";
import {
  getMaintenanceRepairTypesFromStorage,
  saveMaintenanceRepairTypesToStorage,
} from "./useMaintenanceRepairTypes";
import MaintenanceRepairTypesData from "../../data/MaintenanceRepairType.json";

export default function MaintenanceRepairType() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRepairType, setSelectedRepairType] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [maintenanceRepairTypes, setMaintenanceRepairTypes] = useState<any[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  // Load data from JSON file on mount
  useEffect(() => {
    setMaintenanceRepairTypes(MaintenanceRepairTypesData);
  }, []);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const debouncedSearchValue = useDebounce(searchValue, 600);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRepairType(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    let updatedData: any[];

    if (selectedRepairType) {
      // Update existing record
      updatedData = maintenanceRepairTypes.map((item) =>
        item.id === selectedRepairType.id ? values : item,
      );
    } else {
      // Create new record - check if ID already exists
      if (maintenanceRepairTypes.some((item) => item.id === values.id)) {
        showErrorAlert("Mã loại sửa chữa đã tồn tại!");
        return;
      }
      updatedData = [...maintenanceRepairTypes, values];
    }

    // Save to localStorage
    saveMaintenanceRepairTypesToStorage(updatedData);
    setMaintenanceRepairTypes(updatedData);
    setShowForm(false);
    setSelectedRepairType(null);

    showSuccessAlert(
      selectedRepairType ? "Cập nhật thành công!" : "Tạo mới thành công!",
    );
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã loại sửa chữa",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenLoaiSuaChua",
      headerName: "Tên loại sửa chữa",
      flex: 1,
      minWidth: 200,
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
              const updatedData = maintenanceRepairTypes.filter(
                (item) => item.id !== params.row.id,
              );
              saveMaintenanceRepairTypesToStorage(updatedData);
              setMaintenanceRepairTypes(updatedData);
              showSuccessAlert("Xóa thành công!");
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
        title="Quản lý loại sửa chữa"
        onNewClick={() => {
          setShowForm(true);
          setSelectedRepairType(null);
          setReadOnly(false);
        }}
      />
      <Box p={2}>
        <Dialog
          open={isLoading}
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
            <MaintenanceRepairTypeForm
              onCancel={() => {
                setShowForm(false);
                setSelectedRepairType(null);
                setReadOnly(false);
              }}
              onEdit={handleEdit}
              selectedRepairType={selectedRepairType}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý loại sửa chữa"
          columns={columns}
          rows={maintenanceRepairTypes}
          total={maintenanceRepairTypes.length}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          onRowClick={handleRowClick}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onDelete={(ids) => {
            const updatedData = maintenanceRepairTypes.filter(
              (item) => !ids.includes(item.id),
            );
            saveMaintenanceRepairTypesToStorage(updatedData);
            setMaintenanceRepairTypes(updatedData);
            setSelectedIds([]);
            showSuccessAlert("Xóa thành công!");
          }}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </Box>
    </Box>
  );
}
