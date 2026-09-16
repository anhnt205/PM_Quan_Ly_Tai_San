import { ContentCopy, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { showConfirmAlert } from "../../components/Alert";
import DraftIndicator from "../../components/common/DraftIndicator";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { useDebounce } from "../../hooks/useDebounce";
import { RootState } from "../../redux/store";
import { useTabForm } from "../../redux/useTabForm";
import { hasDraftData } from "../../utils/draftUtils";
import MaintenanceRepairTypeForm, {
  MaintenanceRepairTypeItem,
} from "./components/MaintenanceRepairTypeForm";
import {
  useLoaiSCBDMutation,
  useloaiscbdPageQuery,
} from "./Mutation";

interface MaintenanceRepairTypeTabState {
  showForm: boolean;
  formMode: "create" | "edit";
  items: MaintenanceRepairTypeItem[];
  draftData?: {
    items: MaintenanceRepairTypeItem[];
    formMode: "create" | "edit";
  };
}

export default function MaintenanceRepairType() {
  const { formData, setField } = useTabForm<MaintenanceRepairTypeTabState>(
    "/loai_sua_chua_bao_duong",
  );
  const showForm = formData.showForm ?? false;
  const formMode = formData.formMode ?? "create";
  const items = formData.items ?? [];

  const setShowForm = (v: boolean) => setField({ showForm: v });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const itemsRef = useRef<MaintenanceRepairTypeItem[]>(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const handleMinimize = () => {
    const currentItems = itemsRef.current;
    if (currentItems && currentItems.length > 0) {
      setField({
        draftData: {
          items: currentItems,
          formMode,
        },
        showForm: false,
      });
    } else {
      setShowForm(false);
    }
  };

  const handleRestoreFromDraft = () => {
    const draft = formData.draftData;
    if (draft?.items && Array.isArray(draft.items) && draft.items.length > 0) {
      itemsRef.current = draft.items;
      setField({
        items: draft.items,
        formMode: draft.formMode || "create",
        showForm: true,
      });
    }
  };

  const handleClose = () => {
    setField({
      showForm: false,
      draftData: undefined,
      items: [],
    });
  };

  const isMinimized = !showForm && hasDraftData(formData.draftData?.items);

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

  const handleStartCreate = () => {
    if (isMinimized) {
      handleRestoreFromDraft();
      return;
    }
    const emptyItem: MaintenanceRepairTypeItem = {
      id: "",
      ten: "",
      ghiChu: "",
    };
    itemsRef.current = [emptyItem];
    setField({
      formMode: "create",
      items: [emptyItem],
      showForm: true,
    });
  };

  useEffect(() => {
    if (location.state?.autoCreate) {
      handleStartCreate();
      navigate(location.pathname + location.search, { replace: true });
    }
  }, [location, navigate]);

  const handleEditRow = (row: any) => {
    const editItem: MaintenanceRepairTypeItem = {
      id: row.id,
      ten: row.ten,
      ghiChu: row.ghiChu ?? "",
    };
    itemsRef.current = [editItem];
    setField({
      formMode: "edit",
      items: [editItem],
      showForm: true,
    });
  };

  const handleCopyRow = (row: any) => {
    const copiedItem: MaintenanceRepairTypeItem = {
      id: "",
      ten: row.ten,
      ghiChu: row.ghiChu ?? "",
    };
    itemsRef.current = [copiedItem];
    setField({
      formMode: "create",
      items: [copiedItem],
      showForm: true,
    });
  };

  const handleBulkEdit = () => {
    if (selectedIds.length === 0) return;
    const selectedRows = maintenanceRepairTypes.items
      .filter((item: any) => selectedIds.includes(item.id))
      .sort((a: any, b: any) => a.id.localeCompare(b.id));

    const editItems: MaintenanceRepairTypeItem[] = selectedRows.map(
      (row: any) => ({
        id: row.id,
        ten: row.ten,
        ghiChu: row.ghiChu ?? "",
      }),
    );

    itemsRef.current = editItems;
    setField({
      formMode: "edit",
      items: editItems,
      showForm: true,
    });
  };

  const handleSave = async (savedItems: MaintenanceRepairTypeItem[]) => {
    try {
      if (formMode === "create") {
        if (savedItems.length === 1) {
          await createMutation.mutateAsync(savedItems[0] as any);
        } else {
          await createBatchMutation.mutateAsync(savedItems as any);
        }
      } else {
        if (savedItems.length === 1) {
          await updateMutation.mutateAsync(savedItems[0] as any);
        } else {
          await updateBatchMutation.mutateAsync(savedItems as any);
        }
      }
      setField({
        showForm: false,
        draftData: undefined,
        items: [],
      });
      setSelectedIds([]);
    } catch (error) {
      console.error("Lỗi khi lưu loại sửa chữa:", error);
    }
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
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box display="flex" gap={1} justifyContent="center" alignItems="center">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleEditRow(params.row);
            }}
            title="Chỉnh sửa"
          >
            <Edit color="primary" />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleCopyRow(params.row);
            }}
            title="Sao chép"
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
            title="Xóa"
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
        onNewClick={handleStartCreate}
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
          onClose={(_, reason) => {
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
              handleMinimize();
            } else {
              handleClose();
            }
          }}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: "16px",
                border: "2px solid #1FA463",
              },
            },
          }}
        >
          <DialogContent
            sx={{
              p: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              flex: 1,
            }}
          >
            {showForm && (
              <MaintenanceRepairTypeForm
                key={`${formMode}-${items.map((i) => i.id).join("-") || "new"}`}
                mode={formMode}
                initialItems={items}
                onSave={handleSave}
                onCancel={handleClose}
                onMinimize={handleMinimize}
                onItemsChange={(newItems) => {
                  itemsRef.current = newItems;
                }}
                initialFormData={formData.draftData}
              />
            )}
          </DialogContent>
        </Dialog>

        {isMinimized && (
          <DraftIndicator onClick={handleRestoreFromDraft} />
        )}

        <TableCustom
          title="Quản lý loại sửa chữa"
          columns={columns}
          rows={maintenanceRepairTypes.items}
          total={maintenanceRepairTypes.totalItems}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          onRowClick={(params: GridRowParams) => handleEditRow(params.row)}
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

