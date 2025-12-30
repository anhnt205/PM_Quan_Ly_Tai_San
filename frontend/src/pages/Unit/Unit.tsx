import { Delete } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Units from "../../data/Unit.json";
import TypeAssetForm from "./components/UnitForm";
import { useUnitMutation } from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";

export default function Unit() {
  const [showForm, setShowForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    units,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    isLoading,
  } = useUnitMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedUnit(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedUnit) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedUnit(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã đơn vị tính",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ten",
      headerName: "Tên đơn vị tính",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "note",
      headerName: "Ghi chú",
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
        title="Quản lý đơn vị tính"
        onNewClick={() => {
          setShowForm(true);
          setSelectedUnit(null);
          setReadOnly(false);
        }}
      />
      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <TypeAssetForm
              onCancel={() => {
                setShowForm(false);
                setSelectedUnit(null);
                setReadOnly(false); // Reset readOnly when form is closed
              }}
              onEdit={handleEdit}
              selectedUnit={selectedUnit}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý đơn vị tính"
          columns={columns}
          rows={units.items}
          total={units.totalItems}
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
