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
import TypeAssets from "../../data/TypeAsset.json";
import TypeAssetForm from "./components/TypeAssetForm";
import { showConfirmAlert } from "../../components/Alert";
import { useTypeAssetMutation } from "./Mutation";

export default function TypeAsset() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTypeAsset, setSelectedTypeAsset] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    // typeAssets,
    allTypeAssets,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    isLoading,
  } = useTypeAssetMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedTypeAsset(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedTypeAsset) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedTypeAsset(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã loại tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "idLoaiTs",
      headerName: "Mã loại tài sản cha",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenLoai",
      headerName: "Tên loại tài sản",
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
        title="Quản lý loại tài sản"
        onNewClick={() => {
          setShowForm(true);
          setSelectedTypeAsset(null);
          setReadOnly(false);
        }}
      />
      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <TypeAssetForm
              onCancel={() => {
                setShowForm(false);
                setSelectedTypeAsset(null);
                setReadOnly(false); // Reset readOnly when form is closed
              }}
              onEdit={handleEdit}
              selectedTypeAsset={selectedTypeAsset}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý loại tài sản"
          columns={columns}
          rows={allTypeAssets}
          total={allTypeAssets.length}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          onRowClick={handleRowClick}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onDelete={deleteManyMutation.mutate}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          paginationMode="client"
        />
      </Box>
    </Box>
  );
}
