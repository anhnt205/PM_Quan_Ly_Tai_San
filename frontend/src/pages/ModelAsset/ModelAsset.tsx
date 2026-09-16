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
import { ContentCopy, Delete, Edit } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useModelAssetMutation, useModelAssetPageQuery } from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { useDebounce } from "../../hooks/useDebounce";
import ModelAssetForm, {
  ModelAssetItem,
} from "./components/ModelAssetForm";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useTabForm } from "../../redux/useTabForm";
import { hasDraftData } from "../../utils/draftUtils";
import DraftIndicator from "../../components/common/DraftIndicator";
import { CongTy } from "../../utils/const";

interface ModelAssetTabState {
  showForm: boolean;
  formMode: "create" | "edit";
  items: ModelAssetItem[];
  draftData?: {
    items: ModelAssetItem[];
    formMode: "create" | "edit";
  };
}

export default function ModelAsset() {
  const { formData, setField } =
    useTabForm<ModelAssetTabState>("/mo_hinh_tai_san");
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

  const itemsRef = useRef<ModelAssetItem[]>(items);
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
    importExcelMutation,
    exportMutation,
    deleteAllMutation,
    createBatchMutation,
    updateBatchMutation,
  } = useModelAssetMutation();

  const debouncedSearchValue = useDebounce(searchValue, 600);
  const { data: modelAssetPage = { items: [], totalItems: 0 }, isLoading } =
    useModelAssetPageQuery(
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
    const emptyItem: ModelAssetItem = {
      id: "",
      tenMoHinh: "",
      phuongPhapKhauHao: 1,
      kyKhauHao: "",
      loaiKyKhauHao: "",
      taiKhoanTaiSan: "",
      taiKhoanKhauHao: "",
      taiKhoanChiPhi: "",
      idCongTy: CongTy.CT001,
    };
    itemsRef.current = [emptyItem];
    setField({
      formMode: "create",
      items: [emptyItem],
      showForm: true,
    });
  };

  const handleEditRow = (row: any) => {
    const editItem: ModelAssetItem = {
      id: row.id,
      tenMoHinh: row.tenMoHinh,
      phuongPhapKhauHao: row.phuongPhapKhauHao ?? 1,
      kyKhauHao: row.kyKhauHao ?? "",
      loaiKyKhauHao: row.loaiKyKhauHao ?? "",
      taiKhoanTaiSan: row.taiKhoanTaiSan ?? "",
      taiKhoanKhauHao: row.taiKhoanKhauHao ?? "",
      taiKhoanChiPhi: row.taiKhoanChiPhi ?? "",
      idCongTy: row.idCongTy || CongTy.CT001,
    };
    itemsRef.current = [editItem];
    setField({
      formMode: "edit",
      items: [editItem],
      showForm: true,
    });
  };

  const handleCopyRow = (row: any) => {
    const copiedItem: ModelAssetItem = {
      id: "",
      tenMoHinh: row.tenMoHinh,
      phuongPhapKhauHao: row.phuongPhapKhauHao ?? 1,
      kyKhauHao: row.kyKhauHao ?? "",
      loaiKyKhauHao: row.loaiKyKhauHao ?? "",
      taiKhoanTaiSan: row.taiKhoanTaiSan ?? "",
      taiKhoanKhauHao: row.taiKhoanKhauHao ?? "",
      taiKhoanChiPhi: row.taiKhoanChiPhi ?? "",
      idCongTy: row.idCongTy || CongTy.CT001,
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
    const selectedRows = modelAssetPage.items
      .filter((item: any) => selectedIds.includes(item.id))
      .sort((a: any, b: any) => a.id.localeCompare(b.id));

    const editItems: ModelAssetItem[] = selectedRows.map((row: any) => ({
      id: row.id,
      tenMoHinh: row.tenMoHinh,
      phuongPhapKhauHao: row.phuongPhapKhauHao ?? 1,
      kyKhauHao: row.kyKhauHao ?? "",
      loaiKyKhauHao: row.loaiKyKhauHao ?? "",
      taiKhoanTaiSan: row.taiKhoanTaiSan ?? "",
      taiKhoanKhauHao: row.taiKhoanKhauHao ?? "",
      taiKhoanChiPhi: row.taiKhoanChiPhi ?? "",
      idCongTy: row.idCongTy || CongTy.CT001,
    }));

    itemsRef.current = editItems;
    setField({
      formMode: "edit",
      items: editItems,
      showForm: true,
    });
  };

  const handleSave = async (savedItems: ModelAssetItem[]) => {
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
      console.error("Lỗi khi lưu mô hình tài sản:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã mô hình",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenMoHinh",
      headerName: "Tên mô hình",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phuongPhapKhauHao",
      headerName: "Phương pháp khấu hao",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        if (value === 1) return "Đường thẳng";
        if (value === 0) return "Khác";
        return value;
      },
    },
    {
      field: "kyKhauHao",
      headerName: "Kỳ khấu hao",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "loaiKyKhauHao",
      headerName: "Loại kỳ khấu hao",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "taiKhoanTaiSan",
      headerName: "Tài khoản tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "taiKhoanKhauHao",
      headerName: "Tài khoản khấu hao",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "taiKhoanChiPhi",
      headerName: "Tài khoản chi phí",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ngayTao",
      headerName: "Ngày tạo",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ngayCapNhat",
      headerName: "Ngày cập nhật",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nguoiTao",
      headerName: "Người tạo",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nguoiCapNhat",
      headerName: "Người cập nhật",
      width: 120,
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
      <PageAction
        title="Quản lý mô hình tài sản"
        onNewClick={handleStartCreate}
        onExport={() => exportMutation.mutate()}
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
              Đang xử lý dữ liệu mô hình tài sản...
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
          maxWidth="md"
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
              <ModelAssetForm
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
          tableId="modelAsset"
          title="Quản lý mô hình tài sản"
          columns={columns}
          rows={modelAssetPage.items}
          total={modelAssetPage.totalItems}
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
