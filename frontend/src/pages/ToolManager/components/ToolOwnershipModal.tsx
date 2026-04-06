import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import TableCustom from "../../../components/common/TableCustom";
import { GridColDef } from "@mui/x-data-grid";
import { useToolOwnershipPageQuery } from "../Mutation";
import dayjs from "dayjs";
import { useDebounce } from "../../../hooks/useDebounce";

interface ToolOwnershipModalProps {
  open: boolean;
  onClose: () => void;
  departments: any[];
}

const ToolOwnershipModal: React.FC<ToolOwnershipModalProps> = ({
  open,
  onClose,
  departments,
}) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const searchDebounce = useDebounce(searchValue, 500);

  const { data, isLoading } = useToolOwnershipPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    selectedDepartment,
    selectedDate,
  );

  const columns: GridColDef[] = [
    {
      field: "soChungTu",
      headerName: "Số chứng từ",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "idCCDCVT",
      headerName: "Mã VTHH",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenCCDCVatTu",
      headerName: "Vật tư",
      flex: 1.5,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "tenPhongBan",
      headerName: "Đơn vị",
      flex: 1.5,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "ngayTao",
      headerName: "Ngày tạo",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? dayjs(params.value).format("DD/MM/YYYY") : "",
    },
    {
      field: "soLuong",
      headerName: "Số lượng",
      flex: 0.5,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Danh sách nhập vật tư hàng hóa
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ height: "70vh", p: 0 }}>
        <TableCustom
          title=""
          columns={columns}
          rows={data?.items || []}
          total={data?.totalItems || 0}
          loading={isLoading}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          isFilterDepartment={true}
          departments={departments}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          isFilterDate={true}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ToolOwnershipModal;
