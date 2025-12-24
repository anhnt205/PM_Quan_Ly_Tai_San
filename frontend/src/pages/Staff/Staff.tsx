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
import { GridColDef } from "@mui/x-data-grid";
import Staffs from "../../data/Staff.json";
import StaffForm from "./components/StaffForm";

export default function Staff() {
  const [showForm, setShowForm] = useState(false);
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
      <PageAction title="Quản lý nhân viên" onNewClick={() => setShowForm(true)} />
      {showForm && (
        <Box py={2}>
          <StaffForm onCancel={() => setShowForm(false)} />
        </Box>
      )}
      <TableCustom title="Quản lý nhân viên" columns={columns} rows={Staffs} />
    </Box>
  );
}
