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
import { ContentCopy, Delete } from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import {
  showConfirmAlert,
  showSuccessAlert,
  showErrorAlert,
} from "../../components/Alert";
import { useDebounce } from "../../hooks/useDebounce";
import { useLoaiSCBDMutation, useloaiscbdPageQuery } from "./Mutation";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useTabForm } from "../../redux/useTabForm";
import { hasDraftData } from "../../utils/draftUtils";
import DraftIndicator from "../../components/common/DraftIndicator";

interface MaintenanceRepairTypeTabState {
  showForm: boolean;
  selectedRepairType: any | null;
  readOnly: boolean;
  isCopy: boolean;
  draftForm?: Record<string, any>;
  showBulkForm: boolean;
  bulkEditType?: "create" | "edit";
  bulkItems?: any[];
  bulkDraftData?: Record<string, any>;
}

export default function MaintenanceRepairType() {
  const { formData, setField } = useTabForm<MaintenanceRepairTypeTabState>(
    "/loai_sua_chua_bao_duong",
  );
  const showForm = formData.showForm ?? false;
  const selectedRepairType = formData.selectedRepairType ?? null;
  const readOnly = formData.readOnly ?? false;
  const isCopy = formData.isCopy ?? false;
  const setShowForm = (v: boolean) => setField({ showForm: v });
  const setSelectedRepairType = (v: any) => setField({ selectedRepairType: v });
  const setReadOnly = (v: boolean) => setField({ readOnly: v });
  const setIsCopy = (v: boolean) => setField({ isCopy: v });

  const showBulkForm = formData.showBulkForm ?? false;
  const bulkEditType = formData.bulkEditType ?? "create";
  const bulkItems = formData.bulkItems ?? [];
  const setShowBulkForm = (v: boolean) => setField({ showBulkForm: v });
  const setBulkEditType = (v: "create" | "edit") =>
    setField({ bulkEditType: v });
  const setBulkItems = (v: any[]) => setField({ bulkItems: v });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const handleMinimize = () => setShowForm(false);
  const isMinimized = !showForm && hasDraftData(formData.draftForm);
  const handleBulkMinimize = () => setShowBulkForm(false);
  const isBulkMinimized = !showBulkForm && hasDraftData(formData.bulkDraftData);

  const {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    deleteAllMutation,
    createBatchMutation,
    updateBatchMutation,
  } = useLoaiSCBDMutation();

  const debouncedSearchValue = useDebounce(searchValue, 600);

  const {
    data: maintenanceRepairTypes = { items: [], totalItems: 0 },
    isLoading,
  } = useloaiscbdPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    debouncedSearchValue,
  );

  useEffect(() => {
    if (location.state?.autoCreate) {
      setShowForm(true);
      setSelectedRepairType(null);
      setReadOnly(false);
      setField({ draftForm: undefined });
      navigate(location.pathname + location.search, { replace: true });
    }
  }, [location, navigate]);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRepairType(params.row);
    window.scrollTo({ top: 140, behavior: "smooth" });
    setReadOnly(true);
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (Array.isArray(values)) {
      if (bulkEditType === "create") {
        createBatchMutation.mutate(values);
      } else {
        updateBatchMutation.mutate(values);
      }
      setShowBulkForm(false);
      setBulkItems([]);
      setSelectedIds([]);
      setField({ bulkDraftData: undefined });
    } else {
      if (selectedRepairType && !isCopy) {
        updateMutation.mutate(values);
      } else {
        createMutation.mutate(values);
      }
      setShowForm(false);
      setSelectedRepairType(null);
      setField({ draftForm: undefined });
    }
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleBulkEdit = () => {
    if (selectedIds.length === 0) return;
    const itemsToEdit = maintenanceRepairTypes.items
      .filter((item: any) => selectedIds.includes(item.id))
      .sort((a: any, b: any) => a.id.localeCompare(b.id));
    setBulkEditType("edit");
    setBulkItems(itemsToEdit);
    setShowBulkForm(true);
  };

  const handleBulkItemsChange = useCallback(
    (items: any[]) => {
      setField({ bulkDraftData: { items, bulkEditType }, bulkItems: items });
    },
    [bulkEditType],
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã loại sửa chữa",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ten",
      headerName: "Tên loại sửa chữa",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ghiChu",
      headerName: "Ghi chú",
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
        <Box display="flex" gap={1} justifyContent="center" alignItems="center">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              const { id, ...copyData } = params.row;
              setSelectedRepairType({ ...copyData, id: "" });
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
        title="Quản lý loại sửa chữa"
        onNewClick={() => {
          if (isBulkMinimized) {
            setShowBulkForm(true);
            return;
          }
          if (isMinimized) {
            setShowForm(true);
            return;
          }
          setBulkEditType("create");
          setBulkItems([{}]);
          setShowBulkForm(true);
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
        <Dialog
          open={showForm}
          onClose={handleMinimize}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ p: 0 }}>
            <MaintenanceRepairTypeForm
              onCancel={() => {
                setShowForm(false);
                setSelectedRepairType(null);
                setReadOnly(false);
                setIsCopy(false);
                setField({ draftForm: undefined });
              }}
              onMinimize={handleMinimize}
              onEdit={handleEdit}
              selectedRepairType={selectedRepairType}
              readOnly={readOnly}
              onSave={handleSave}
              onFormChange={(values) => setField({ draftForm: values })}
              initialFormData={formData.draftForm}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={showBulkForm}
          onClose={handleBulkMinimize}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ p: 0 }}>
            <MaintenanceRepairTypeForm
              onEdit={() => {}}
              onCancel={() => {
                setBulkItems([]);
                setSelectedIds([]);
                setField({ bulkDraftData: undefined });
                setShowBulkForm(false);
              }}
              onMinimize={handleBulkMinimize}
              selectedRepairType={null}
              readOnly={false}
              onSave={handleSave}
              isBulkMode={true}
              bulkItems={bulkItems}
              onBulkItemsChange={handleBulkItemsChange}
              bulkEditType={bulkEditType}
            />
          </DialogContent>
        </Dialog>

        {isBulkMinimized ? (
          <DraftIndicator onClick={() => setShowBulkForm(true)} />
        ) : (
          isMinimized && <DraftIndicator onClick={() => setShowForm(true)} />
        )}

        <TableCustom
          title="Quản lý loại sửa chữa"
          columns={columns}
          rows={maintenanceRepairTypes.items}
          total={maintenanceRepairTypes.totalItems}
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
          onBulkEdit={selectedIds.length > 1 ? handleBulkEdit : undefined}
        />
      </Box>
    </Box>
  );
}
