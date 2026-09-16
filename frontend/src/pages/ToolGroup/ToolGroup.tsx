import {
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { ContentCopy, Delete, Edit } from "@mui/icons-material";
import ToolGroupForm, { ToolGroupItem } from "./components/ToolGroupForm";
import {
  useToolGroupMutation,
  useToolGroupPageQuery,
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

interface ToolGroupTabState {
  showForm: boolean;
  formMode: "create" | "edit";
  items: ToolGroupItem[];
  draftData?: {
    items: ToolGroupItem[];
    formMode: "create" | "edit";
  };
}

export default function ToolGroup() {
  const { formData, setField } = useTabForm<ToolGroupTabState>("/nhom_ccdc");
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

  const itemsRef = useRef<ToolGroupItem[]>(items);
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
  } = useToolGroupMutation();

  const debouncedSearchValue = useDebounce(searchValue, 600);
  const { data: toolGroupPage = { items: [], totalItems: 0 }, isLoading } =
    useToolGroupPageQuery(
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
    const emptyItem: ToolGroupItem = {
      id: "",
      ten: "",
      idCongTy: CongTy.CT001,
      laCCDC: false,
      laVatTu: false,
    };
    itemsRef.current = [emptyItem];
    setField({
      formMode: "create",
      items: [emptyItem],
      showForm: true,
    });
  };

  const handleEditRow = (row: any) => {
    const editItem: ToolGroupItem = {
      id: row.id,
      ten: row.ten,
      idCongTy: row.idCongTy || CongTy.CT001,
      laCCDC: row.laCCDC || false,
      laVatTu: row.laVatTu || false,
    };
    itemsRef.current = [editItem];
    setField({
      formMode: "edit",
      items: [editItem],
      showForm: true,
    });
  };

  const handleCopyRow = (row: any) => {
    const copiedItem: ToolGroupItem = {
      id: "",
      ten: row.ten,
      idCongTy: row.idCongTy || CongTy.CT001,
      laCCDC: row.laCCDC || false,
      laVatTu: row.laVatTu || false,
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
    const selectedRows = toolGroupPage.items
      .filter((item: any) => selectedIds.includes(item.id))
      .sort((a: any, b: any) => a.id.localeCompare(b.id));

    const editItems: ToolGroupItem[] = selectedRows.map((row: any) => ({
      id: row.id,
      ten: row.ten,
      idCongTy: row.idCongTy || CongTy.CT001,
      laCCDC: row.laCCDC || false,
      laVatTu: row.laVatTu || false,
    }));

    itemsRef.current = editItems;
    setField({
      formMode: "edit",
      items: editItems,
      showForm: true,
    });
  };

  const handleSave = async (savedItems: ToolGroupItem[]) => {
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
      console.error("Lỗi khi lưu nhóm CCDC:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã nhóm CCDC",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ten",
      headerName: "Tên nhóm CCDC",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "laCCDC",
      headerName: "CCDC",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <Checkbox checked={params.row.laCCDC} disabled />;
      },
    },
    {
      field: "laVatTu",
      headerName: "Vật tư",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <Checkbox checked={params.row.laVatTu} disabled />;
      },
    },
    {
      field: "ngayTao",
      headerName: "Ngày tạo",
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
        title="Quản lý nhóm CCDC"
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
              Đang xử lý dữ liệu nhóm CCDC...
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
              <ToolGroupForm
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
          tableId="toolGroup"
          title="Quản lý nhóm CCDC"
          columns={columns}
          rows={toolGroupPage.items}
          total={toolGroupPage.totalItems}
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
