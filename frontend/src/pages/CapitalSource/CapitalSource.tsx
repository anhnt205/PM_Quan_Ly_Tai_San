import { Delete, Download, Settings, Upload } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import CapitalSources from "../../data/CapitalSource.json";
import CapitalSourceForm from "./components/CapitalSourceForm";
import { useCapitalSourceMutation } from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";

export default function CapitalSource() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCapitalSource, setSelectedCapitalSource] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    capitalSourcesPage,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    isLoading,
  } = useCapitalSourceMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedCapitalSource(params.row);
    setReadOnly(true);
    setShowForm(true);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleSave = (values: any) => {
    if (selectedCapitalSource) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedCapitalSource(null);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã nguồn kinh phí",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenNguonKinhPhi",
      headerName: "Tên nguồn kinh phí",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ghiChu",
      headerName: "Ghi chú",
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isActive = params.row.isActive;
        return (
          <Chip
            label={isActive ? "Hoạt động" : "Không hoạt động"}
            size="small" // Nên để small cho gọn trong bảng
            sx={{
              bgcolor: isActive ? "#baf7cbff" : "#f5f5f5",

              color: isActive ? "#137333" : "#616161",

              // Bỏ viền nếu không cần
              border: "none",
            }}
          />
        );
      },
    },
    {
      field: "active",
      headerName: "Hiệu lực",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isActive = params.row.hieuLuc;
        return (
          <Chip
            label={isActive ? "Có hiệu lực" : "Không hiệu lực"}
            size="small" // Nên để small cho gọn trong bảng
            sx={{
              bgcolor: isActive ? "#baf7cbff" : "#f5f5f5",

              color: isActive ? "#137333" : "#616161",

              // Bỏ viền nếu không cần
              border: "none",
            }}
          />
        );
      },
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
        title="Quản lý nguồn vốn"
        onNewClick={() => {
          setShowForm(true);
          setSelectedCapitalSource(null);
          setReadOnly(false);
        }}
      />
      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <CapitalSourceForm
              onCancel={() => {
                setShowForm(false);
                setSelectedCapitalSource(null);
                setReadOnly(false);
              }}
              selectedCapitalSource={selectedCapitalSource}
              readOnly={readOnly}
              onEdit={handleEdit}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý nguồn vốn"
          columns={columns}
          rows={capitalSourcesPage.items}
          total={capitalSourcesPage.totalItems}
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
