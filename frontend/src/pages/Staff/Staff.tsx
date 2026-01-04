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
import { useStaffMutation } from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";

export default function Staff() {
  const [showForm, setShowForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    staffsPage,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    uploadMutation,
    isLoading,
  } = useStaffMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedStaff(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedStaff) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedStaff(null);
  };
  const handleEdit = () => {
    setReadOnly(false);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã nhân viên",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hoTen",
      headerName: "Tên nhân viên",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "diDong",
      headerName: "Số điện thoại",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "emailCongViec",
      headerName: "Email",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenPhongBan",
      headerName: "Phòng ban",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenChucVu",
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
        const isFlashSign = params.row.kyNhay;
        const isNormalSign = params.row.kyThuong;
        const isDigitalSign = params.row.kySo;
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
        <IconButton
          onClick={async (e) => {
            e.stopPropagation();
            const confirm = await showConfirmAlert("Xác nhận xóa!");
            if (confirm.isConfirmed) {
              deleteOneMutation.mutate(params.row.id);
            }
          }}
        >
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
      <Box p={2}>
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
              onUpload={uploadMutation.mutate}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý nhân viên"
          columns={columns}
          rows={staffsPage.items}
          total={staffsPage.totalItems}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
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
