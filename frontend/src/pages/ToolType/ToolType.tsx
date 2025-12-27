import { Delete } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import ToolTypes from "../../data/ToolType.json";
import TypeAssetForm from "./components/ToolTypeForm";

export default function ToolType() {
  const [showForm, setShowForm] = useState(false);
  const [selectedToolType, setSelectedToolType] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [toolTypesData, setToolTypesData] = useState(ToolTypes);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedToolType(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedToolType) {
      // Update existing staff
      const updatedStaffs = toolTypesData.map((typeAsset) =>
        typeAsset.id === selectedToolType.id
          ? { ...typeAsset, ...values }
          : typeAsset
      );
      setToolTypesData(updatedStaffs);
    } else {
      // Create new staff
      const newStaff = { ...values, id: Date.now() }; // Simple ID generation
      setToolTypesData([...toolTypesData, newStaff]);
    }
    setShowForm(false);
    setSelectedToolType(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã loại CCDC",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolGroup",
      headerName: "Mã loại CCDC cha",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Tên loại CCDC",
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
        title="Loại CCDC"
        onNewClick={() => {
          setShowForm(true);
          setSelectedToolType(null);
          setReadOnly(false);
        }}
      />
      {showForm && (
        <Box py={2}>
          <TypeAssetForm
            onCancel={() => {
              setShowForm(false);
              setSelectedToolType(null);
              setReadOnly(false); // Reset readOnly when form is closed
            }}
            onEdit={handleEdit}
            selectedToolType={selectedToolType}
            readOnly={readOnly}
            onSave={handleSave}
          />
        </Box>
      )}
      <TableCustom
        title="Quản lý loại CCDC"
        columns={columns}
        rows={toolTypesData}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}
