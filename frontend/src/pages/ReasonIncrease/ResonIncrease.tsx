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
import ReasonIncreases from "../../data/ReasonIncrease.json";
import ReasonIncreaseForm from "./components/ReasonIncreaseForm";
import { useReasonIncreaseMutation } from "./Mutation";

export default function ReasonIncrease() {
  const [showForm, setShowForm] = useState(false);
  const [selectedReasonIncrease, setSelectedReasonIncrease] =
    useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    reasonIncreases,
    allData,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    isLoading,
  } = useReasonIncreaseMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedReasonIncrease(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedReasonIncrease) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedReasonIncrease(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã lý do tăng",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ten",
      headerName: "Tên lý do tăng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tangGiam",
      headerName: "Tăng giảm",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.row.tangGiam ? "Tăng" : "Giảm"}
          sx={{
            bgcolor: params.row.tangGiam ? "#baf7cbff" : "#f98e86ff",
            color: params.row.tangGiam ? "#137333" : "#881d15ff",
          }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Hành động",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton>
          <Delete color="error" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <PageAction
        title="Lý do tăng"
        onNewClick={() => {
          setShowForm(true);
          setSelectedReasonIncrease(null);
          setReadOnly(false);
        }}
      />
      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <ReasonIncreaseForm
              onCancel={() => {
                setShowForm(false);
                setSelectedReasonIncrease(null);
                setReadOnly(false); // Reset readOnly when form is closed
              }}
              onEdit={handleEdit}
              selectedReasonIncrease={selectedReasonIncrease}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          title="Danh sách lý do tăng"
          columns={columns}
          rows={reasonIncreases}
          total={reasonIncreases.length}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          // loading={isLoading}
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
