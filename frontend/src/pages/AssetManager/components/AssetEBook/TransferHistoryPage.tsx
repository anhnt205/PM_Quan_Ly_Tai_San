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
import { showConfirmAlert } from "../../../../components/Alert";
import { useAssetHandoverMutation } from "../../../AssetHandover/Mutation";
import { generateCode } from "../../../../utils/helpers";
import SaveBtn from "../../../../components/Button/SaveBtn";
import CancelBtn from "../../../../components/Button/CancelBtn";
import EditButton from "../../../../components/Button/EditButton";

// Style sách
const bookStyles = {
  container: {
    width: "210mm",
    minHeight: "297mm",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    // backgroundImage: "linear-gradient(to bottom, #ffffff, #e6f7f0)",
    borderRadius: "2px",
    boxShadow:
      "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
    position: "relative" as const,
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    "&::before": {
      content: '""',
      position: "absolute" as const,
      left: 0,
      top: 0,
      bottom: 0,
      width: "24px",
      background:
        "linear-gradient(to right, rgba(139, 69, 19, 0.08), transparent)",
      pointerEvents: "none" as const,
      borderTopLeftRadius: "12px",
      borderBottomLeftRadius: "12px",
    },
    "&::after": {
      content: '""',
      position: "absolute" as const,
      right: 0,
      top: 0,
      bottom: 0,
      width: "24px",
      background:
        "linear-gradient(to left, rgba(139, 69, 19, 0.08), transparent)",
      pointerEvents: "none" as const,
      borderTopRightRadius: "12px",
      borderBottomRightRadius: "12px",
    },
  },
  content: {
    flex: 1,
    overflow: "auto",
  },
  footer: {
    marginTop: "auto",
    paddingTop: "24px",
    position: "relative" as const,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pageNumber: {
    position: "absolute" as const,
    bottom: 0,
    right: "20px",
    fontSize: "12px",
    fontStyle: "italic" as const,
  },
};

interface TransferHistoryPageProps {
  asset: any;
  allDepartments: any[];
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  readOnly?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: (values: any) => void;
  isView?: boolean;
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
  isDeleted?: boolean;
  originalData?: any;
  action?: "create" | "update" | "delete";
}

const TransferHistoryPage: React.FC<TransferHistoryPageProps> = ({
  asset,
  allDepartments,
  onPageChange,
  currentPage = 2,
  totalPages = 4,
  readOnly = true,
  onEdit,
  onCancel,
  onSave,
  isView = false,
}) => {
  const queryClient = useQueryClient();
  const {
    createManyHistoryAssetMutation,
    updateHistoryAssetManyMutation,
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
  const [isEditMode, setIsEditMode] = useState(false);

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
        isDeleted: false,
        originalData: { ...item },
        action: undefined,
      }));
      setRows(formattedRows);
      setHasChanges(false);
    }
  }, [historyData]);

  // Xử lý khi bấm Edit
  const handleEdit = () => {
    setIsEditMode(true);
    onEdit?.();
  };

  // Xử lý khi bấm Cancel
  const handleCancel = () => {
    // Reset lại dữ liệu về ban đầu
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
        isDeleted: false,
        originalData: { ...item },
        action: undefined,
      }));
      setRows(formattedRows);
    } else {
      setRows([]);
    }
    setHasChanges(false);
    setIsEditMode(false);
    onCancel?.();
  };

  const handleAddRow = () => {
    const newRow: RowData = {
      id: `temp-${Date.now()}`,
      thoiGianBanGiao: dayjs().format("YYYY-MM-DD"),
      idDonViNhan: "",
      tenDonViNhan: "",
      idDonViGiao: asset.idDonViHienThoi || asset.idDonViBanDau || "Kty",
      tenDonViGiao: "",
      idTaiSan: asset.id,
      isNew: true,
      isDeleted: false,
      action: "create",
    };
    setRows([newRow, ...rows]);
    setHasChanges(true);
  };

  const handleChange = (id: string, field: keyof RowData, value: any) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          // Đánh dấu action là update nếu không phải row mới
          if (!row.isNew && !row.isDeleted) {
            updatedRow.action = "update";
          }
          return updatedRow;
        }
        return row;
      }),
    );
    setHasChanges(true);
  };

  const handleDeleteRow = (id: string, isNew?: boolean) => {
    if (isNew) {
      // Xóa row mới (chưa lưu) khỏi danh sách
      setRows(rows.filter((r) => r.id !== id));
    } else {
      // Đánh dấu xóa mềm
      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, isDeleted: true, action: "delete" } : row,
        ),
      );
    }
    setHasChanges(true);
  };

  const getLatestRecord = (rowsList: RowData[]): RowData | null => {
    const activeRows = rowsList.filter((row) => !row.isDeleted);
    if (activeRows.length === 0) return null;
    const sorted = [...activeRows].sort((a, b) =>
      dayjs(b.thoiGianBanGiao).diff(dayjs(a.thoiGianBanGiao)),
    );
    return sorted[0];
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Phân loại các row cần xử lý
      const rowsToCreate: RowData[] = [];
      const rowsToUpdate: RowData[] = [];
      const rowsToDelete: RowData[] = [];

      rows.forEach((row) => {
        if (row.isDeleted) {
          if (!row.isNew) {
            rowsToDelete.push(row);
          }
        } else {
          if (row.isNew) {
            rowsToCreate.push(row);
          } else if (row.action === "update") {
            rowsToUpdate.push(row);
          }
        }
      });

      // 1. Xử lý CREATE
      if (rowsToCreate.length > 0) {
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
        const updatePayload = rowsToUpdate.map((row) => ({
          id: row.id,
          idTaiSan: asset.id,
          thoiGianBanGiao: `${row.thoiGianBanGiao}T00:00:00`,
          idDonViNhan: row.idDonViNhan,
          idDonViGiao: row.idDonViGiao || "Kty",
        }));

        await new Promise((resolve, reject) => {
          updateHistoryAssetManyMutation.mutate(updatePayload, {
            onSuccess: resolve,
            onError: reject,
          });
        });
      }

      // 3. Xử lý DELETE
      if (rowsToDelete.length > 0) {
        for (const row of rowsToDelete) {
          await new Promise((resolve, reject) => {
            deleteHistoryAssetMutation.mutate(row.id, {
              onSuccess: resolve,
              onError: reject,
            });
          });
        }
      }

      // Refresh dữ liệu
      await queryClient.invalidateQueries({
        queryKey: ["historyAssetHandover"],
      });

      // Cập nhật đơn vị quản lý hiện tại dựa trên record mới nhất
      const activeRows = rows.filter((row) => !row.isDeleted);
      const latestRecord = getLatestRecord(activeRows);

      if (latestRecord && latestRecord.idDonViNhan) {
        updateAssetOwnershipMutation.mutate([
          {
            id: asset.id,
            idDonVi: latestRecord.idDonViNhan,
          },
        ]);
      } else if (activeRows.length === 0) {
        updateAssetOwnershipMutation.mutate([
          {
            id: asset.id,
            idDonVi: "Kty",
          },
        ]);
      }

      await queryClient.invalidateQueries({ queryKey: ["assetsPage"] });

      setHasChanges(false);
      setIsEditMode(false);

      // Gọi onSave để thông báo đã lưu thành công
      onSave?.({});
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Lọc các row không bị xóa để hiển thị
  const visibleRows = rows.filter((row) => !row.isDeleted);

  return (
    <Box sx={bookStyles.container}>
      {/* Button actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          mb: 2,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {!isView && !isEditMode && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {!readOnly && isEditMode && (
              <>
                <SaveBtn onSave={handleSave} />
                <CancelBtn onClick={handleCancel} />
              </>
            )}
            {readOnly && !isEditMode && <EditButton onClick={handleEdit} />}
          </Box>
        )}
      </Box>

      {/* Header sách */}
      <Typography
        textAlign="center"
        fontSize={20}
        fontWeight={700}
        sx={{ letterSpacing: "2px", mb: 2 }}
      >
        THEO DÕI DI CHUYỂN LẮP ĐẶT MÁY
      </Typography>

      {/* Nút thêm - chỉ hiển thị khi ở chế độ edit */}
      {isEditMode && (
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          mb={3}
          gap={2}
        >
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddRow}
            sx={{
              borderColor: "#009e60",
              color: "#009e60",
              "&:hover": { borderColor: "#66bb6a", bgcolor: "#e6f7f0" },
              textTransform: "none",
            }}
          >
            Thêm di chuyển
          </Button>
        </Box>
      )}

      {/* Nội dung chính */}
      <Box sx={bookStyles.content}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "0px",
            overflow: "hidden",
            width: "100%",
            marginTop: "10px",
          }}
        >
          <Table
            size="small"
            sx={{ borderCollapse: "collapse", border: "1px solid black" }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: "bold",
                    fontSize: "16px",
                    width: "15%",
                    border: "1px solid black",
                    backgroundColor: "transparent",
                  }}
                >
                  Ngày/tháng/
                  <br />
                  năm
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: "bold",
                    fontSize: "16px",
                    width: "30%",
                    border: "1px solid black",
                    backgroundColor: "transparent",
                  }}
                >
                  Địa điểm đặt máy
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: "bold",
                    fontSize: "16px",
                    width: "25%",
                    border: "1px solid black",
                    backgroundColor: "transparent",
                  }}
                >
                  Đối tượng phục vụ
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: "bold",
                    fontSize: "16px",
                    width: "30%",
                    border: "1px solid black",
                    backgroundColor: "transparent",
                  }}
                >
                  Họ tên và chữ ký người
                  <br />
                  chịu trách nhiệm lắp đặt
                </TableCell>
                {isEditMode && (
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: '"Times New Roman", Times, serif',
                      fontWeight: "bold",
                      fontSize: "16px",
                      width: "10%",
                      border: "1px solid black",
                      backgroundColor: "transparent",
                    }}
                  >
                    Thao tác
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={isEditMode ? 5 : 4}
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {visibleRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        align="center"
                        sx={{
                          borderTop: "none",
                          borderBottom: "1px dashed black",
                          borderLeft: "1px solid black",
                          borderRight: "1px solid black",
                          padding: "8px",
                        }}
                      >
                        {isEditMode ? (
                          <TextField
                            type="date"
                            fullWidth
                            size="small"
                            variant="standard"
                            InputProps={{ disableUnderline: true }}
                            value={row.thoiGianBanGiao}
                            onChange={(e) =>
                              handleChange(
                                row.id,
                                "thoiGianBanGiao",
                                e.target.value,
                              )
                            }
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: "16px",
                            }}
                          >
                            {row.thoiGianBanGiao
                              ? dayjs(row.thoiGianBanGiao).format("DD/MM/YYYY")
                              : ""}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell
                        sx={{
                          borderTop: "none",
                          borderBottom: "1px dashed black",
                          borderLeft: "1px solid black",
                          borderRight: "1px solid black",
                          padding: "8px",
                        }}
                      >
                        {isEditMode ? (
                          <Autocomplete
                            options={allDepartments.slice(0, 100)}
                            getOptionLabel={(option) =>
                              option?.tenPhongBan || ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.id === value?.id
                            }
                            value={
                              allDepartments.find(
                                (d) => d.id === row.idDonViNhan,
                              ) || null
                            }
                            onChange={(_, newValue) => {
                              handleChange(
                                row.id,
                                "idDonViNhan",
                                newValue?.id || "",
                              );
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
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: "16px",
                            }}
                          >
                            {row.tenDonViNhan || ""}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderTop: "none",
                          borderBottom: "1px dashed black",
                          borderLeft: "1px solid black",
                          borderRight: "1px solid black",
                          padding: "8px",
                        }}
                      ></TableCell>
                      <TableCell
                        sx={{
                          borderTop: "none",
                          borderBottom: "1px dashed black",
                          borderLeft: "1px solid black",
                          borderRight: "1px solid black",
                          padding: "8px",
                        }}
                      ></TableCell>
                      {isEditMode && (
                        <TableCell
                          align="center"
                          sx={{
                            borderTop: "none",
                            borderBottom: "1px dashed black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                            padding: "8px",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRow(row.id, row.isNew)}
                            sx={{ color: "#d32f2f" }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}

                  {/* Dòng trống mô phỏng sổ sách */}
                  {!isEditMode &&
                    Array.from({
                      length: Math.max(0, 10 - visibleRows.length),
                    }).map((_, index) => (
                      <TableRow key={`empty-${index}`}>
                        <TableCell
                          sx={{
                            height: "40px",
                            borderTop: "none",
                            borderBottom: "1px dashed black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            height: "40px",
                            borderTop: "none",
                            borderBottom: "1px dashed black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            height: "40px",
                            borderTop: "none",
                            borderBottom: "1px dashed black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            height: "40px",
                            borderTop: "none",
                            borderBottom: "1px dashed black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                          }}
                        ></TableCell>
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Footer - luôn ở dưới cùng */}
      <Box sx={bookStyles.footer}>
        <Box sx={bookStyles.pageNumber}>Trang {currentPage}</Box>
      </Box>
    </Box>
  );
};

export default TransferHistoryPage;
