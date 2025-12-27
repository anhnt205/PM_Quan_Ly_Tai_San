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
import Staffs from "../../data/Staff.json";
import StaffForm from "./components/StaffForm";

export default function Staff() {
  const [showForm, setShowForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [staffsData, setStaffsData] = useState(Staffs);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedStaff(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedStaff) {
      // Update existing staff
      const updatedStaffs = staffsData.map((staff) =>
        staff.id === selectedStaff.id ? { ...staff, ...values } : staff
      );
      setStaffsData(updatedStaffs);
    } else {
      // Create new staff
      const newStaff = { ...values, id: Date.now() }; // Simple ID generation
      setStaffsData([...staffsData, newStaff]);
    }
    setShowForm(false);
    setSelectedStaff(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã nhân viên",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Tên nhân viên",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "department",
      headerName: "Phòng ban",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "position",
      headerName: "Chức vụ",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "signature",
      headerName: "Quyền ký",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isFlashSign = params.row.isFlashSign;
        const isNormalSign = params.row.isNormalSign;
        const isDigitalSign = params.row.isDigitalSign;
        const isSignature = !isFlashSign && !isNormalSign && !isDigitalSign;
        return (
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={1}
            py={1}
            height={"auto"}
          >
            {isFlashSign && (
              <Chip
                size="small"
                color="secondary"
                label="Ký nháy"
                sx={{ color: "white" }}
              />
            )}
            {isNormalSign && (
              <Chip
                size="small"
                color="primary"
                label="Ký thường"
                sx={{ color: "white" }}
              />
            )}
            {isDigitalSign && (
              <Chip
                size="small"
                color="success"
                label="Ký số"
                sx={{ color: "white" }}
              />
            )}
            {isSignature && (
              <Chip
                size="small"
                color="error"
                label="Không ký"
                sx={{ color: "white" }}
              />
            )}
          </Box>
        );
      },
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
        title="Quản lý nhân viên"
        onNewClick={() => {
          setShowForm(true);
          setSelectedStaff(null);
          setReadOnly(false); // Set readOnly to false when creating a new staff
        }}
      />
      {showForm && (
        <Box py={2}>
          <StaffForm
            onCancel={() => {
              setShowForm(false);
              setSelectedStaff(null);
              setReadOnly(false); // Reset readOnly when form is closed
            }}
            onEdit={handleEdit}
            selectedStaff={selectedStaff}
            readOnly={readOnly}
            onSave={handleSave}
          />
        </Box>
      )}
      <TableCustom
        title="Quản lý nhân viên"
        columns={columns}
        rows={staffsData}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}
