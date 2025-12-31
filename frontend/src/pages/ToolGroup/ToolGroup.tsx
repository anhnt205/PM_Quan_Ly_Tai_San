import { Badge, Box, Chip, IconButton } from "@mui/material";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import ToolGroups from "../../data/ToolGroup.json";
import { Delete } from "@mui/icons-material";
import ToolGroupForm from "./components/ToolGroupForm";
import React, { useState } from "react";
import { useToolGroupMutation } from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";

export default function ToolGroup() {
  const [showForm, setShowForm] = useState(false);
  const [selectedToolGroup, setSelectedToolGroup] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    tooGroups,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    isLoading,
  } = useToolGroupMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedToolGroup(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedToolGroup) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedToolGroup(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã nhóm ccdc",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ten",
      headerName: "Tên nhóm ccdc",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
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
        title="Quản lý nhóm ccdc"
        onNewClick={() => {
          setShowForm(true);
          setSelectedToolGroup(null);
          setReadOnly(false);
        }}
      />
      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <ToolGroupForm
              onCancel={() => {
                setShowForm(false);
                setSelectedToolGroup(null);
                setReadOnly(false); // Reset readOnly when form is closed
              }}
              onEdit={handleEdit}
              selectedToolGroup={selectedToolGroup}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý nhóm ccdc"
          columns={columns}
          rows={tooGroups.items}
          total={tooGroups.totalItems}
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
