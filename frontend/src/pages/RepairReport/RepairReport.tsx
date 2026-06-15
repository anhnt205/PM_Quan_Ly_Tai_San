import { Delete } from "@mui/icons-material";
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";
import { useState } from "react";
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

interface RepairReportTabState {
  showForm: boolean;
  selectedRepairReport: any | null;
  readOnly: boolean;
  draftForm?: Record<string, any>;
}

export default function RepairReport() {
  const { formData, setField } = useTabForm<RepairReportTabState>(
    "/mau_bien_ban_sua_chua",
  );

  const showForm = formData.showForm ?? false;
  const selectedRepairReport = formData.selectedRepairReport ?? null;
  const readOnly = formData.readOnly ?? false;

  const setShowForm = (v: boolean) => setField({ showForm: v });
  const setSelectedRepairReport = (v: any) =>
    setField({ selectedRepairReport: v });
  const setReadOnly = (v: boolean) => setField({ readOnly: v });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useSelector((state: RootState) => state.user);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const handleMinimize = () => setShowForm(false);
  const isMinimized = !showForm && hasDraftData(formData.draftForm);

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
    setSelectedRepairReport(params.row);
    setReadOnly(true);
    setShowForm(true);
  };

  const handleSave = async (values: any) => {
    try {
      if (selectedRepairReport) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
      setShowForm(false);
      setSelectedRepairReport(null);
      setField({ draftForm: undefined });
    } catch {
      // Alert is handled in mutation hooks; keep form open for user correction/retry.
    }
  };

  const handleEdit = () => setReadOnly(false);

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
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          onClick={async (e) => {
            e.stopPropagation();
            const confirm = await showConfirmAlert("Xác nhận xóa!");
            if (confirm.isConfirmed) {
              deleteMutation.mutate(params.row.id);
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
        title="Mẫu biên bản sửa chữa"
        onNewClick={() => {
          if (isMinimized) {
            setShowForm(true);
            return;
          }
          setSelectedRepairReport(null);
          setReadOnly(false);
          setShowForm(true);
        }}
      />

      <Box p={2}>
        <Dialog
          open={showForm}
          onClose={handleMinimize}
          maxWidth="lg"
          fullWidth
        >
          <DialogContent sx={{ p: 0 }}>
            <RepairReportForm
              onCancel={() => {
                setShowForm(false);
                setSelectedRepairReport(null);
                setReadOnly(false);
                setField({ draftForm: undefined });
              }}
              onMinimize={handleMinimize}
              onEdit={handleEdit}
              editData={selectedRepairReport}
              readOnly={readOnly}
              onSave={handleSave}
              onFormChange={(values: any) => setField({ draftForm: values })}
              initialFormData={formData.draftForm as BienBanSuaChua}
            />
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
