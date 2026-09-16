import { ContentCopy, Delete, Edit } from "@mui/icons-material";
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { showConfirmAlert } from "../../components/Alert";
import { useDebounce } from "../../hooks/useDebounce";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useTabForm } from "../../redux/useTabForm";
import { hasDraftData } from "../../utils/draftUtils";
import DraftIndicator from "../../components/common/DraftIndicator";
import {
  useBienBanSuaChuaMutation,
  useBienBanSuaChuaPageQuery,
} from "./Mutation";
import RepairReportForm from "./components/RepairReportForm";
import { BienBanSuaChua } from "./types";
import { LOAI_BIEN_BAN_OPTIONS } from "../../utils/const";

interface RepairReportTabState {
  showForm: boolean;
  selectedRepairReport: any | null;
  readOnly: boolean;
  isCopy: boolean;
  draftForm?: Record<string, any>;
}

export default function RepairReport() {
  const { formData, setField } = useTabForm<RepairReportTabState>(
    "/mau_bien_ban_sua_chua",
  );

  const showForm = formData.showForm ?? false;
  const selectedRepairReport = formData.selectedRepairReport ?? null;
  const readOnly = formData.readOnly ?? false;
  const isCopy = formData.isCopy ?? false;

  const setShowForm = (v: boolean) => setField({ showForm: v });
  const setReadOnly = (v: boolean) => setField({ readOnly: v });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useSelector((state: RootState) => state.user);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const formValuesRef = useRef<any>(
    formData.draftForm || selectedRepairReport || null,
  );
  useEffect(() => {
    if (formData.draftForm) {
      formValuesRef.current = formData.draftForm;
    } else if (selectedRepairReport) {
      formValuesRef.current = selectedRepairReport;
    }
  }, [formData.draftForm, selectedRepairReport]);

  const handleMinimize = (values?: any) => {
    const currentValues =
      values || formValuesRef.current || selectedRepairReport;
    setField({
      draftForm: currentValues || { isDraft: true },
      showForm: false,
    });
  };

  const handleClose = () => {
    formValuesRef.current = null;
    setField({
      showForm: false,
      selectedRepairReport: null,
      readOnly: false,
      isCopy: false,
      draftForm: undefined,
    });
  };

  const isMinimized =
    !showForm &&
    (hasDraftData(formData.draftForm) ||
      Boolean(formData.selectedRepairReport) ||
      Boolean(formData.draftForm));

  const debouncedSearchValue = useDebounce(searchValue, 600);

  const {
    createMutation,
    deleteAllMutation,
    deleteMutation,
    updateMutation,
    deleteBatchMutation,
  } = useBienBanSuaChuaMutation();

  const { data: repairReportPage = { items: [], totalItems: 0 }, isLoading } =
    useBienBanSuaChuaPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      debouncedSearchValue,
    );

  const handleRowClick = (params: GridRowParams) => {
    formValuesRef.current = params.row;
    setField({
      selectedRepairReport: params.row,
      readOnly: true,
      isCopy: false,
      draftForm: undefined,
      showForm: true,
    });
  };

  const handleEditRow = (row: any) => {
    formValuesRef.current = row;
    setField({
      selectedRepairReport: row,
      readOnly: false,
      isCopy: false,
      draftForm: undefined,
      showForm: true,
    });
  };

  const handleCopyRow = (row: any) => {
    const { id, ...rest } = row;
    const copied = { ...rest, ma: "", id: undefined };
    formValuesRef.current = copied;
    setField({
      selectedRepairReport: copied,
      readOnly: false,
      isCopy: true,
      draftForm: undefined,
      showForm: true,
    });
  };

  const handleStartCreate = () => {
    if (isMinimized) {
      setShowForm(true);
      return;
    }
    formValuesRef.current = null;
    setField({
      selectedRepairReport: null,
      readOnly: false,
      isCopy: false,
      draftForm: undefined,
      showForm: true,
    });
  };

  const handleSave = async (values: any) => {
    try {
      if (selectedRepairReport?.id && !isCopy) {
        await updateMutation.mutateAsync({
          ...values,
          id: selectedRepairReport.id,
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      handleClose();
    } catch {
      // Alert is handled in mutation hooks
    }
  };

  const columns: GridColDef[] = [
    {
      field: "ma",
      headerName: "Mã",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ten",
      headerName: "Tên",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "loaiBienBan",
      headerName: "Loại biên bản",
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const option = LOAI_BIEN_BAN_OPTIONS.find(
          (opt) => opt.id === params.value,
        );
        return option?.label || params.value;
      },
    },
    {
      field: "congTy",
      headerName: "Công ty",
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "macDinh",
      headerName: "Mặc định",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.value ? "✓" : ""),
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
                deleteMutation.mutate(params.row.id);
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
        title="Mẫu biên bản sửa chữa"
        onNewClick={handleStartCreate}
      />

      <Box p={2}>
        <Dialog
          open={showForm}
          onClose={(_, reason) => {
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
              handleMinimize();
            } else {
              handleClose();
            }
          }}
          maxWidth="lg"
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
              <RepairReportForm
                key={`${selectedRepairReport?.id || "new"}-${isCopy ? "copy" : "edit"}-${readOnly}`}
                onCancel={handleClose}
                onMinimize={handleMinimize}
                onEdit={() => setReadOnly(false)}
                editData={selectedRepairReport}
                readOnly={readOnly}
                isCopy={isCopy}
                onSave={handleSave}
                onFormChange={(values: any) => {
                  formValuesRef.current = values;
                  setField({ draftForm: values });
                }}
                initialFormData={formData.draftForm as BienBanSuaChua}
              />
            )}
          </DialogContent>
        </Dialog>

        {isMinimized && <DraftIndicator onClick={() => setShowForm(true)} />}

        <TableCustom
          tableId="repairReport"
          title="Mẫu biên bản sửa chữa"
          columns={columns}
          rows={repairReportPage?.data?.items || []}
          total={repairReportPage?.data?.totalItems || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          onRowClick={handleRowClick}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onDelete={deleteBatchMutation.mutate}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onDeleteAll={deleteAllMutation.mutate}
          showDeleteAll={user?.taiKhoan?.tenDangNhap === "admin"}
        />
      </Box>
    </Box>
  );
}
