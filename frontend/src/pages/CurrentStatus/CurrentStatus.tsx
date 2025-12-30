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

export default function CurrentStatus() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCurrentStatus, setSelectedCurrentStatus] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [currentStatusData, setCurrentStatusData] = useState(CurrentStatuss);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedCurrentStatus(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedCurrentStatus) {
      // Update existing staff
      const updatedStaffs = currentStatusData.map((typeAsset) =>
        typeAsset.id === selectedCurrentStatus.id
          ? { ...typeAsset, ...values }
          : typeAsset
      );
      setCurrentStatusData(updatedStaffs);
    } else {
      // Create new staff
      const newStaff = { ...values, id: Date.now() }; // Simple ID generation
      setCurrentStatusData([...currentStatusData, newStaff]);
    }
    setShowForm(false);
    setSelectedCurrentStatus(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã trạng thái",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
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
        <IconButton>
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
          rows={currentStatusData}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
}
