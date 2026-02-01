import {
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import ProjectForm from "./components/PositionForm";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import { showConfirmAlert } from "../../components/Alert";
import { usePositionMutation } from "./Mutation";

export default function Position() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    positionsPage,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    importExcelMutation,
    exportMutation,
    isLoading,
    allPositions,
  } = usePositionMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedPosition(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedPosition) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedPosition(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã chức vụ",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenChucVu",
      headerName: "Tên chức vụ",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "quanLyNhanVien",
      headerName: "Quản lý nhân viên",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Checkbox checked={params.row.quanLyNhanVien} />,
    },
    {
      field: "quanLyPhongBan",
      headerName: "Quản lý phòng ban",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Checkbox checked={params.row.quanLyPhongBan} />,
    },
    {
      field: "quanLyDuAn",
      headerName: "Quản lý dự án",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Checkbox checked={params.row.quanLyDuAn} />,
    },
    {
      field: "quanLyNguonVon",
      headerName: "Quản lý nguồn vốn",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Checkbox checked={params.row.quanLyNguonVon} />,
    },
    {
      field: "quanLyMoHinhTaiSan",
      headerName: "Quản lý mô hình tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox checked={params.row.quanLyMoHinhTaiSan} />
      ),
    },
    {
      field: "quanLyTaiSan",
      headerName: "Quản lý tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Checkbox checked={params.row.quanLyTaiSan} />,
    },
    {
      field: "quanLyCCDCVatTu",
      headerName: "Quản lý CCDC - Vật tư",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Checkbox checked={params.row.quanLyCCDCVatTu} />,
    },
    {
      field: "dieuDongTaiSan",
      headerName: "Điều động tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Checkbox checked={params.row.dieuDongTaiSan} />,
    },
    {
      field: "dieuDongCCDCVatTu",
      headerName: "Điều động CCDC - vật tư",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox checked={params.row.dieuDongCCDCVatTu} />
      ),
    },
    {
      field: "banGiaoTaiSan",
      headerName: "Bàn giao tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Checkbox checked={params.row.banGiaoTaiSan} />,
    },
    {
      field: "banGiaoCCDCVatTu",
      headerName: "Bàn giao CCDC - vật tư",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox checked={params.row.banGiaoCCDCVatTu} />
      ),
    },
    {
      field: "baoCao",
      headerName: "Báo cáo",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Checkbox checked={params.row.baoCao} />,
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
        title="Quản lý chức vụ"
        onNewClick={() => {
          setShowForm(true);
          setSelectedPosition(null);
          setReadOnly(false);
        }}
        onExport={() => exportMutation.mutate(allPositions)}
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
            <ProjectForm
              onCancel={() => {
                setShowForm(false);
                setSelectedPosition(null);
                setReadOnly(false);
              }}
              onEdit={handleEdit}
              selectedPosition={selectedPosition}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý chức vụ"
          columns={columns}
          rows={positionsPage.items}
          total={positionsPage.totalItems}
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
    </Box>
  );
}
