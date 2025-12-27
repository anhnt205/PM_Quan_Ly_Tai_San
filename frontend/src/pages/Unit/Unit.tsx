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
import Units from "../../data/Unit.json";
import TypeAssetForm from "./components/UnitForm";

export default function Unit() {
  const [showForm, setShowForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [unitsData, setUnitsData] = useState(Units);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedUnit(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedUnit) {
      // Update existing staff
      const updatedStaffs = unitsData.map((typeAsset) =>
        typeAsset.id === selectedUnit.id
          ? { ...typeAsset, ...values }
          : typeAsset
      );
      setUnitsData(updatedStaffs);
    } else {
      // Create new staff
      const newStaff = { ...values, id: Date.now() }; // Simple ID generation
      setUnitsData([...unitsData, newStaff]);
    }
    setShowForm(false);
    setSelectedUnit(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã loại tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Tên loại tài sản",
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
        <IconButton>
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
        rows={unitsData}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}
