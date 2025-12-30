import { Badge, Box, Chip, IconButton } from "@mui/material";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import ToolGroups from "../../data/ToolGroup.json";
import { Delete } from "@mui/icons-material";
import ToolGroupForm from "./components/ToolGroupForm";
import React, { useState } from "react";

export default function ToolGroup() {
  const [showForm, setShowForm] = useState(false);
  const [selectedToolGroup, setSelectedToolGroup] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [toolGroupsData, setToolGroupsData] = useState(ToolGroups);

  const handleRowClick = (params: GridRowParams) => {
    setToolGroupsData(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedToolGroup) {
      // Update existing staff
      const updatedStaffs = toolGroupsData.map((staff) =>
        staff.id === selectedToolGroup.id ? { ...staff, ...values } : staff
      );
      setToolGroupsData(updatedStaffs);
    } else {
      // Create new staff
      const newStaff = { ...values, id: Date.now() }; // Simple ID generation
      setToolGroupsData([...toolGroupsData, newStaff]);
    }
    setShowForm(false);
    setSelectedToolGroup(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã nhóm ccdc",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Tên nhóm ccdc",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "updatedAt",
      headerName: "Ngày cập nhật",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdBy",
      headerName: "Người tạo",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "updatedBy",
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
        <IconButton>
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
          rows={ToolGroups}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
}
