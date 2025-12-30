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
import CurrentStatuss from "../../data/CurrentStatus.json";
import CurrentStatusForm from "./components/CurrentStatusForm";
import { useCurrentStatusMutation } from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";

export default function CurrentStatus() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCurrentStatus, setSelectedCurrentStatus] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    currentStatus,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    isLoading,
  } = useCurrentStatusMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedCurrentStatus(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedCurrentStatus) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedCurrentStatus(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã trạng thái",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenHTKT",
      headerName: "Tên trạng thái",
      flex: 1,
      minWidth: 150,
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
        title="Quản lý hiện trạng"
        onNewClick={() => {
          setShowForm(true);
          setSelectedCurrentStatus(null);
          setReadOnly(false);
        }}
      />
      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <CurrentStatusForm
              onCancel={() => {
                setShowForm(false);
                setSelectedCurrentStatus(null);
                setReadOnly(false); // Reset readOnly when form is closed
              }}
              onEdit={handleEdit}
              selectedCurrentStatus={selectedCurrentStatus}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý hiện trạng"
          columns={columns}
          rows={currentStatus.items}
          total={currentStatus.totalItems}
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
