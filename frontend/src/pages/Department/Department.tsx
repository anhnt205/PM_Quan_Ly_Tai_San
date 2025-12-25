import { Box, IconButton } from "@mui/material";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Departments from "../../data/Department.json";
import DepartmentForm from "./components/DepartmentForm";
import { Delete } from "@mui/icons-material";
import React, { useState } from "react";

export default function Department() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const handleRowClick = (params: GridRowParams) => {
    setSelectedDepartment(params.row);
    setShowForm(true);
  };
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã phòng ban",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Tên phòng/ban",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "employee",
      headerName: "Số lượng nhân viên",
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
        title="Quản lý phòng ban"
        onNewClick={() => {
          setShowForm(true);
          setSelectedDepartment(null);
        }}
      />
      {showForm && (
        <Box py={2}>
          <DepartmentForm onCancel={() => {
            setShowForm(false);
            setSelectedDepartment(null);
          }} 
          department={selectedDepartment} />
        </Box>
      )}
      <TableCustom
        title="Quản lý phòng ban"
        columns={columns}
        rows={Departments}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}
