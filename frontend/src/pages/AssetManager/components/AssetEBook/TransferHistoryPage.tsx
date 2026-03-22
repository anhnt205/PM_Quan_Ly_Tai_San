import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Autocomplete,
  Typography,
  Button,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAssetManagerMutation,
  useHistoryAssethandoverQuery,
} from "../../Mutation";
import { Save } from "lucide-react";
import { showConfirmAlert } from "../../../../components/Alert";

interface TransferHistoryPageProps {
  idTaiSan: string;
  allDepartments: any[];
}

interface RowData {
  id: string;
  thoiGianBanGiao: string;
  idDonViNhan: string;
  tenDonViNhan?: string;
  isNew?: boolean;
}

const TransferHistoryPage: React.FC<TransferHistoryPageProps> = ({
  idTaiSan,
  allDepartments,
}) => {
  const queryClient = useQueryClient();
  const {
    createManyHistoryAssetMutation,
    updateHistoryAssetMutation,
    deleteHistoryAssetMutation,
  } = useAssetManagerMutation();

  const { data: historyData, isLoading } = useHistoryAssethandoverQuery(
    0,
    1000,
    "",
    "",
    idTaiSan,
  );

  const [rows, setRows] = useState<RowData[]>([]);

  // ĐÃ SỬA LỖI Ở ĐÂY: Trỏ đúng vào historyData.items thay vì content
  useEffect(() => {
    if (historyData?.items) {
      const formattedRows = historyData.items.map((item: any) => ({
        id: item.id,
        // Dùng slice để cắt bỏ phần giờ phút giây, chỉ lấy YYYY-MM-DD đưa vào input date
        thoiGianBanGiao: item.thoiGianBanGiao
          ? item.thoiGianBanGiao.slice(0, 10)
          : "",
        idDonViNhan: item.idDonViNhan,
        tenDonViNhan: item.tenDonViNhan,
        isNew: false,
      }));
      setRows(formattedRows);
    }
  }, [historyData]);

  const handleAddRow = () => {
    const newRow: RowData = {
      id: `temp-${Date.now()}`,
      thoiGianBanGiao: dayjs().format("YYYY-MM-DD"),
      idDonViNhan: "",
      tenDonViNhan: "",
      isNew: true,
    };
    setRows([newRow, ...rows]);
  };

  const handleChange = (id: string, field: keyof RowData, value: any) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleSaveRow = (row: RowData) => {
    if (!row.thoiGianBanGiao || !row.idDonViNhan) return;

    if (row.isNew) {
      createManyHistoryAssetMutation.mutate(
        [
          {
            id: "",
            idBanGiaoTaiSan: "",
            idTaiSan: idTaiSan,
            thoiGianBanGiao: `${row.thoiGianBanGiao}T00:00:00`,
            idDonViNhan: row.idDonViNhan,
            idDonViGiao: "K30",
          },
        ],
        {
          onSuccess: () => {
            // Refresh lại API query để lấy ID chuẩn từ DB thay vì dùng ID temp
            queryClient.invalidateQueries({
              queryKey: ["historyAssetHandover"],
            });
          },
        },
      );
    } else {
      updateHistoryAssetMutation.mutate({
        id: row.id,
        data: {
          idDonViNhan: row.idDonViNhan,
          thoiGianBanGiao: `${row.thoiGianBanGiao}T00:00:00`,
          idTaiSan: idTaiSan,
        },
      });
    }
  };

  // Xử lý lưu tất cả các dòng mới
  const handleSaveAll = () => {
    // Lọc ra các dòng mới (isNew === true) và đã nhập đủ dữ liệu
    const newRowsToSave = rows.filter(
      (row) => row.isNew && row.thoiGianBanGiao && row.idDonViNhan,
    );

    if (newRowsToSave.length > 0) {
      const payload = newRowsToSave.map((row) => ({
        id: "",
        idBanGiaoTaiSan: "",
        idTaiSan: idTaiSan,
        thoiGianBanGiao: `${row.thoiGianBanGiao}T00:00:00`,
        idDonViNhan: row.idDonViNhan,
        idDonViGiao: "K30",
      }));

      createManyHistoryAssetMutation.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["historyAssetHandover"],
          });
        },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: RowData) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveRow(row);
    }
  };

  const handleDeleteRow = async (id: string, isNew?: boolean) => {
    if (isNew) {
      setRows(rows.filter((r) => r.id !== id));
    } else {
      const result = await showConfirmAlert(
        "Bạn có chắc chắn muốn xóa lịch sử điều chuyển này không?",
      );

      if (result.isConfirmed) {
        deleteHistoryAssetMutation.mutate(id);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#fff",
        p: 2,
        borderRadius: 2,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold" color="#333">
          Lịch sử điều chuyển tài sản
        </Typography>
        <Box display="flex" gap={1.5}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveAll}
            sx={{
              bgcolor: "#009e60",
              color: "#fff",
              "&:hover": { bgcolor: "#026e42" },
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            Lưu
          </Button>

          {/* Nút Thêm (Hình tròn có dấu +) */}
          <IconButton
            onClick={handleAddRow}
            sx={{
              bgcolor: "#009e60",
              color: "#fff",
              "&:hover": { bgcolor: "#026e42" },
            }}
          >
            <Add />
          </IconButton>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #ddd" }}
      >
        <Table size="small">
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", width: "30%", color: "#333" }}
              >
                Ngày tháng
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", width: "60%", color: "#333" }}
              >
                Đơn vị quản lý
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "10%",
                  textAlign: "center",
                  color: "#333",
                }}
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Chưa có lịch sử thuyên chuyển
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <TextField
                      type="date"
                      fullWidth
                      size="small"
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      value={row.thoiGianBanGiao}
                      onChange={(e) =>
                        handleChange(row.id, "thoiGianBanGiao", e.target.value)
                      }
                      onBlur={() => handleSaveRow(row)}
                      onKeyDown={(e) => handleKeyDown(e, row)}
                      sx={{ input: { color: "#333" } }}
                    />
                  </TableCell>

                  <TableCell>
                    <Autocomplete
                      options={allDepartments.slice(0, 100)}
                      getOptionLabel={(option) => option?.tenPhongBan || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value?.id
                      }
                      value={
                        allDepartments.find((d) => d.id === row.idDonViNhan) ||
                        null
                      }
                      onChange={(_, newValue) => {
                        handleChange(row.id, "idDonViNhan", newValue?.id || "");
                        handleChange(
                          row.id,
                          "tenDonViNhan",
                          newValue?.tenPhongBan || "",
                        );
                      }}
                      onBlur={() => handleSaveRow(row)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                          }}
                          placeholder="Chọn đơn vị..."
                          onKeyDown={(e) => handleKeyDown(e, row)}
                        />
                      )}
                      sx={{ width: "100%" }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteRow(row.id, row.isNew)}
                      sx={{ color: "#d32f2f" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransferHistoryPage;
