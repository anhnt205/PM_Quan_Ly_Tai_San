import { Badge, Box, Checkbox, Chip, IconButton } from "@mui/material";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Positions from "../../data/Position.json";
import ProjectForm from "./components/PositionForm";
import { Delete } from "@mui/icons-material";
import React, { useState } from "react";

export default function Position() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [positionsData, setPositionsData] = useState(Positions);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedPosition(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedPosition) {
      // Update existing staff
      const updatedStaffs = positionsData.map((position) =>
        position.id === selectedPosition.id
          ? { ...position, ...values }
          : position
      );
      setPositionsData(updatedStaffs);
    } else {
      // Create new staff
      const newStaff = { ...values, id: Date.now() }; // Simple ID generation
      setPositionsData([...positionsData, newStaff]);
    }
    setShowForm(false);
    setSelectedPosition(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã chức vụ",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Tên chức vụ",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "manager_staff",
      headerName: "Quản lý nhân viên",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Checkbox checked={params.row.manager_staff} />,
    },
    {
      field: "manager_department",
      headerName: "Quản lý phòng ban",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox checked={params.row.manager_department} />
      ),
    },
    {
      field: "manager_project",
      headerName: "Quản lý dự án",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <Checkbox checked={params.row.manager_project} />,
    },
    {
      field: "manager_capital_source",
      headerName: "Quản lý nguồn vốn",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox checked={params.row.manager_capital_source} />
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
        title="Quản lý chức vụ"
        onNewClick={() => {
          setShowForm(true);
          setSelectedPosition(null);
          setReadOnly(false);
        }}
      />
      {showForm && (
        <Box py={2}>
          <ProjectForm
            onCancel={() => {
              setShowForm(false);
              setSelectedPosition(null);
              setReadOnly(false); // Reset readOnly when form is closed
            }}
            onEdit={handleEdit}
            selectedPosition={selectedPosition}
            readOnly={readOnly}
            onSave={handleSave}
          />
        </Box>
      )}
      <TableCustom
        title="Quản lý chức vụ"
        columns={columns}
        rows={Positions}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}
