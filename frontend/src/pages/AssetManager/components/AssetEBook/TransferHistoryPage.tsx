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
import { useAssetHandoverMutation } from "../../../AssetHandover/Mutation";
import { generateCode } from "../../../../utils/helpers";

interface TransferHistoryPageProps {
  asset: any;
  allDepartments: any[];
}

interface RowData {
  id: string;
  idTaiSan: string;
  thoiGianBanGiao: string;
  idDonViNhan: string;
  tenDonViNhan?: string;
  idDonViGiao?: string;
  tenDonViGiao?: string;
  isNew?: boolean;
  originalData?: any; // Lưu dữ liệu gốc để so sánh
}

const TransferHistoryPage: React.FC<TransferHistoryPageProps> = ({
  asset,
  allDepartments,
}) => {
  const queryClient = useQueryClient();
  const {
    createManyHistoryAssetMutation, // Tạo 1 cái
    updateHistoryAssetMutation, // Cập nhật 1 cái
    updateHistoryAssetManyMutation, // Cập nhật nhiều cái (create/update batch)
    deleteHistoryAssetMutation,
  } = useAssetManagerMutation();
  const { updateAssetOwnershipMutation } = useAssetHandoverMutation();

  const { data: historyData, isLoading } = useHistoryAssethandoverQuery(
    0,
    1000,
    "",
    "",
    asset?.id,
  );

  const [rows, setRows] = useState<RowData[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load dữ liệu từ API
  useEffect(() => {
    if (historyData?.items) {
      const formattedRows = historyData.items.map((item: any) => ({
        id: item.id,
        thoiGianBanGiao: item.thoiGianBanGiao
          ? item.thoiGianBanGiao.slice(0, 10)
          : "",
        idDonViNhan: item.idDonViNhan,
        tenDonViNhan: item.tenDonViNhan,
        idDonViGiao: item.idDonViGiao,
        tenDonViGiao: item.tenDonViGiao,
        isNew: false,
        originalData: { ...item }, // Lưu lại dữ liệu gốc
      }));
      setRows(formattedRows);
      setHasChanges(false);
    }
  }, [historyData]);

  const handleAddRow = () => {
    const newRow: RowData = {
      id: `temp-${Date.now()}`,
      thoiGianBanGiao: dayjs().format("YYYY-MM-DD"),
      idDonViNhan: "",
      tenDonViNhan: "",
      idDonViGiao:
        asset.idDonViHienThoi | asset.idDonViBanDau || ("K30" as any), // Mặc định đơn vị giao
      tenDonViGiao: "",
      idTaiSan: asset.id,
      isNew: true,
    };
    setRows([newRow, ...rows]);
    setHasChanges(true);
  };

  const handleChange = (id: string, field: keyof RowData, value: any) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
    setHasChanges(true);
  };

  // Lấy record có thời gian giao gần nhất
  const getLatestRecord = (rowsList: RowData[]): RowData | null => {
    if (rowsList.length === 0) return null;

    const sorted = [...rowsList].sort((a, b) =>
      dayjs(b.thoiGianBanGiao).diff(dayjs(a.thoiGianBanGiao)),
    );
    return sorted[0];
  };

  // Xử lý lưu tất cả thay đổi
  const handleSaveAll = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Phân loại các row cần xử lý
      const rowsToCreate: RowData[] = []; // Dùng create từng cái
      const rowsToUpdate: RowData[] = []; // Dùng update từng cái hoặc update nhiều

      rows.forEach((row) => {
        // Bỏ qua các row không có đơn vị nhận
        if (!row.idDonViNhan) return;

        if (row.isNew) {
          // Row mới: dùng create API (từng cái)
          rowsToCreate.push(row);
        } else {
          // Row cũ: kiểm tra xem có thay đổi không
          const originalRow = row.originalData;
          if (originalRow) {
            const hasChange =
              originalRow.thoiGianBanGiao?.slice(0, 10) !==
                row.thoiGianBanGiao ||
              originalRow.idDonViNhan !== row.idDonViNhan;

            if (hasChange) {
              rowsToUpdate.push(row);
            }
          }
        }
      });

      if (rowsToCreate.length > 0) {
        // 1. Xử lý CREATE (từng cái một)
        const createPayload = rowsToCreate.map((row: any) => ({
          id: generateCode("LSDCTS-") + `${row.idTaiSan} -`,
          idBanGiaoTaiSan: "",
          idTaiSan: asset.id,
          thoiGianBanGiao: `${row.thoiGianBanGiao}T00:00:00`,
          idDonViNhan: row.idDonViNhan,
          idDonViGiao:
            row.idDonViGiao || asset.idDonViHienThoi || asset.idDonViBanDau,
        }));

        await new Promise((resolve, reject) => {
          createManyHistoryAssetMutation.mutate(createPayload, {
            onSuccess: resolve,
            onError: reject,
          });
        });
      }

      // 2. Xử lý UPDATE
      if (rowsToUpdate.length > 0) {
        // Nếu API updateMany có sẵn, dùng batch
        const updatePayload = rowsToUpdate.map((row) => ({
          id: row.id,
          idTaiSan: asset.id,
          thoiGianBanGiao: `${row.thoiGianBanGiao}T00:00:00`,
          idDonViNhan: row.idDonViNhan,
          idDonViGiao: row.idDonViGiao || "K30",
        }));

        await new Promise((resolve, reject) => {
          updateHistoryAssetManyMutation.mutate(updatePayload, {
            onSuccess: resolve,
            onError: reject,
          });
        });
      }

      // 3. Sau khi lưu thành công, lấy record mới nhất để cập nhật đơn vị quản lý hiện tại
      // Cập nhật lại rows với dữ liệu mới (xóa các row temp, thay bằng ID thật)
      // Refresh data từ API
      await queryClient.invalidateQueries({
        queryKey: ["historyAssetHandover"],
      });

      if (rows.length > 0) {
        // Tìm record có thời gian gần nhất
        const latestRecord = getLatestRecord(
          rows.map((item: any) => ({
            id: item.id,
            thoiGianBanGiao: item.thoiGianBanGiao?.slice(0, 10) || "",
            idDonViNhan: item.idDonViNhan,
            idDonViGiao: item.idDonViGiao,
            idTaiSan: item.idTaiSan,
          })),
        );

        if (latestRecord && latestRecord.idDonViNhan) {
          // Gọi mutation cập nhật đơn vị quản lý hiện tại của tài sản
          updateAssetOwnershipMutation.mutate([
            {
              id: asset.id,
              idDonVi: latestRecord.idDonViNhan,
            },
          ]);
        }
      }

      // Invalidate thêm query asset list để cập nhật thông tin đơn vị quản lý
      await queryClient.invalidateQueries({ queryKey: ["assetsPage"] });

      setHasChanges(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      // Có thể hiển thị thông báo lỗi ở đây
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRow = async (id: string, isNew?: boolean) => {
    if (isNew) {
      // Xóa row mới (chưa lưu)
      setRows(rows.filter((r) => r.id !== id));
      setHasChanges(true);
    } else {
      const result = await showConfirmAlert(
        "Bạn có chắc chắn muốn xóa lịch sử điều chuyển này không?",
      );

      if (result.isConfirmed) {
        deleteHistoryAssetMutation.mutate(id, {
          onSuccess: async () => {
            // Sau khi xóa, cập nhật lại đơn vị quản lý hiện tại
            // Lấy record mới nhất còn lại từ state (đã xóa id đó)
            const remainingRows = rows.filter((r) => r.id !== id);
            const latestRecord = getLatestRecord(remainingRows);

            if (latestRecord && latestRecord.idDonViNhan) {
              updateAssetOwnershipMutation.mutate([
                {
                  id: asset.id,
                  idDonVi: latestRecord.idDonViNhan,
                },
              ]);
            } else if (remainingRows.length === 0) {
              // Nếu không còn record nào, có thể set về null hoặc giá trị mặc định
              updateAssetOwnershipMutation.mutate([
                {
                  id: asset.id,
                  idDonVi: "K30", // Hoặc ID đơn vị mặc định
                },
              ]);
            }

            // Refresh dữ liệu
            await queryClient.invalidateQueries({
              queryKey: ["historyAssetHandover"],
            });
            await queryClient.invalidateQueries({ queryKey: ["assetsPage"] });
          },
        });
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
          {hasChanges && (
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveAll}
              disabled={isSaving}
              sx={{
                bgcolor: "#009e60",
                color: "#fff",
                "&:hover": { bgcolor: "#026e42" },
                "&.Mui-disabled": { bgcolor: "#ccc" },
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
              }}
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          )}

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
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                          }}
                          placeholder="Chọn đơn vị..."
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
