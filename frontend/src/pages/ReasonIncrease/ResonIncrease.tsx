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

export default function ReasonIncrease() {
  const [showForm, setShowForm] = useState(false);
  const [selectedReasonIncrease, setSelectedReasonIncrease] =
    useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [ReasonIncreasesData, setReasonIncreasesData] =
    useState(ReasonIncreases);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedReasonIncrease(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedReasonIncrease) {
      // Update existing staff
      const updatedStaffs = ReasonIncreasesData.map((typeAsset) =>
        typeAsset.id === selectedReasonIncrease.id
          ? { ...typeAsset, ...values }
          : typeAsset
      );
      setReasonIncreasesData(updatedStaffs);
    } else {
      // Create new staff
      const newStaff = { ...values, id: Date.now() }; // Simple ID generation
      setReasonIncreasesData([...ReasonIncreasesData, newStaff]);
    }
    setShowForm(false);
    setSelectedReasonIncrease(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã lý do tăng",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Tên lý do tăng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Tăng giảm",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.row.status === 0 ? "Giảm" : "Tăng"}
          sx={{
            bgcolor: params.row.status === 0 ? "#f98e86ff" : "#baf7cbff",
            color: params.row.status === 0 ? "#881d15ff" : "#137333",
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
          rows={ReasonIncreasesData}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
}
