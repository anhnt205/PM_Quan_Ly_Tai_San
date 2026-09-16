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
import { Delete, ContentCopy, Edit } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import AssetGroupForm, {
  AssetGroupItem,
} from "./components/AssetGroupForm";
import {
  useAssetGroupMutation,
  useAssetGroupPageQuery,
} from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { useDebounce } from "../../hooks/useDebounce";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useTabForm } from "../../redux/useTabForm";
import { hasDraftData } from "../../utils/draftUtils";
import DraftIndicator from "../../components/common/DraftIndicator";
import { CongTy } from "../../utils/const";

interface AssetGroupTabState {
  showForm: boolean;
  formMode: "create" | "edit";
  items: AssetGroupItem[];
  draftData?: {
    items: AssetGroupItem[];
    formMode: "create" | "edit";
  };
}

export default function AssetGroup() {
  const { formData, setField } =
    useTabForm<AssetGroupTabState>("/nhom_tai_san");
  const showForm = formData.showForm ?? false;
  const formMode = formData.formMode ?? "create";
  const items = formData.items ?? [];

  const setShowForm = (v: boolean) => setField({ showForm: v });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useSelector((state: RootState) => state.user);

  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const itemsRef = useRef<AssetGroupItem[]>(items);
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
    createBatchMutation,
    updateMutation,
    updateBatchMutation,
    deleteOneMutation,
    deleteManyMutation,
    importExcelMutation,
    exportMutation,
    deleteAllMutation,
  } = useAssetGroupMutation();

  const debouncedSearchValue = useDebounce(searchValue, 600);
  const { data: assetGroupPage = { items: [], totalItems: 0 }, isLoading } =
    useAssetGroupPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      debouncedSearchValue,
    );

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

  const handleStartCreate = () => {
    if (isMinimized) {
      handleRestoreFromDraft();
      return;
    }
    const emptyItem: AssetGroupItem = {
      id: "",
      tenNhom: "",
      idCongTy: CongTy.CT001,
      idLyLich: "",
    };
    itemsRef.current = [emptyItem];
    setField({
      formMode: "create",
      items: [emptyItem],
      showForm: true,
    });
  };

  const handleEditRow = (row: any) => {
    const editItem: AssetGroupItem = {
      id: row.id,
      tenNhom: row.tenNhom,
      idCongTy: row.idCongTy || CongTy.CT001,
      idLyLich: row.idLyLich || row.lyLich?.id || "",
    };
    itemsRef.current = [editItem];
    setField({
      formMode: "edit",
      items: [editItem],
      showForm: true,
    });
  };

  const handleCopyRow = (row: any) => {
    const copiedItem: AssetGroupItem = {
      id: "",
      tenNhom: row.tenNhom,
      idCongTy: row.idCongTy || CongTy.CT001,
      idLyLich: row.idLyLich || row.lyLich?.id || "",
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

    const selectedRows = assetGroupPage.items
      .filter((item: any) => selectedIds.includes(item.id))
      .sort((a: any, b: any) => a.id.localeCompare(b.id));

    const editItems: AssetGroupItem[] = selectedRows.map((row: any) => ({
      id: row.id,
      tenNhom: row.tenNhom,
      idCongTy: row.idCongTy || CongTy.CT001,
      idLyLich: row.idLyLich || row.lyLich?.id || "",
    }));

    itemsRef.current = editItems;
    setField({
      formMode: "edit",
      items: editItems,
      showForm: true,
    });
  };

  const handleSave = async (savedItems: AssetGroupItem[]) => {
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
      console.error("Lỗi khi lưu nhóm tài sản:", error);
    }
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
      field: "lyLichName",
      headerName: "Tên lý lịch",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      valueGetter: (_value: any, row: any) => row?.lyLich?.tenLyLich || "N/A",
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
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          gap={1}
          justifyContent="center"
          alignItems="center"
        >
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
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <PageAction
            title="Quản lý nhóm tài sản"
            onNewClick={handleStartCreate}
            onExport={() => exportMutation.mutate()}
            onImport={handleImport}
            showExcel={true}
          />
        </Box>
      </Box>

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
        <Dialog
          open={showForm}
          onClose={(_, reason) => {
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
              // Ẩn tạm — giữ draft
              handleMinimize();
            } else {
              // Đóng hẳn — xóa draft
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
              <AssetGroupForm
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
          tableId="assetGroup"
          title="Quản lý nhóm tài sản"
          columns={columns}
          rows={assetGroupPage.items}
          total={assetGroupPage.totalItems}
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
          onImportExcel={handleImport}
          onExportExcel={() => exportMutation.mutate()}
          onBulkEdit={selectedIds.length > 1 ? handleBulkEdit : undefined}
        />
      </Box>
    </Box>
  );
}
