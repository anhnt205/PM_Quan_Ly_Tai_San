import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete, Add, Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import SaveBtn from "../../components/Button/SaveBtn";
import { showConfirmAlert } from "../../components/Alert";
import {
  useGetAssetProfileGroupQuery,
  useUpdateAssetProfileGroupMutation,
  useGetAllAssetProfileQuery,
  useGetAllAssetGroupQuery,
} from "./Mutation";

interface AssetProfileGroupRow {
  lyLichId: string;
  tenLyLich: string;
  nhomTaiSanId: string;
  tenNhomTaiSan: string;
  isNew?: boolean;
}

export default function AssetProfileGroup() {
  const [originalRows, setOriginalRows] = useState<AssetProfileGroupRow[]>([]);
  const [rows, setRows] = useState<AssetProfileGroupRow[]>([]);
  const [isModified, setIsModified] = useState(false);

  // API Queries
  const {
    data: assetProfileGroupData = { items: [], totalItems: 0 },
    isLoading,
  } = useGetAssetProfileGroupQuery();
  const {
    data: assetProfileResponse = {
      items: [],
      totalItems: 0,
    },
  } = useGetAllAssetProfileQuery();
  const allAssetProfiles = assetProfileResponse.items;
  const { data: allAssetGroups = [] } = useGetAllAssetGroupQuery();
  const updateMutation = useUpdateAssetProfileGroupMutation();

  // Initialize rows when data is loaded
  useEffect(() => {
    if (assetProfileGroupData.items && assetProfileGroupData.items.length > 0) {
      setOriginalRows(assetProfileGroupData.items);
      setRows(assetProfileGroupData.items);
      setIsModified(false);
    }
  }, [assetProfileGroupData]);

  // Lấy danh sách Nhóm tài sản đã được sử dụng trong rows hiện tại
  const getUsedAssetGroupIds = () => {
    return rows.map((row) => row.nhomTaiSanId).filter((id) => id !== "");
  };

  // Lọc danh sách Nhóm tài sản: chỉ hiển thị những chưa được sử dụng
  const getAvailableAssetGroups = (currentRowNhomTaiSanId: string) => {
    const usedIds = getUsedAssetGroupIds();
    return allAssetGroups.filter(
      (group: any) =>
        !usedIds.includes(group.id) || group.id === currentRowNhomTaiSanId,
    );
  };

  const handleAddRow = () => {
    const newRow: AssetProfileGroupRow = {
      lyLichId: "",
      tenLyLich: "",
      nhomTaiSanId: "",
      tenNhomTaiSan: "",
      isNew: true,
    };
    setRows([...rows, newRow]);
    setIsModified(true);
  };

  const handleDeleteRow = async (index: number) => {
    const result = await showConfirmAlert("Xác nhận xóa dòng này?");
    if (result.isConfirmed) {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
      setIsModified(true);
    }
  };

  const handleAssetGroupChange = (index: number, assetGroupId: string) => {
    const selectedGroup = allAssetGroups.find(
      (g: any) => g.id === assetGroupId,
    );
    const newRows = [...rows];
    newRows[index].nhomTaiSanId = assetGroupId;
    newRows[index].tenNhomTaiSan = selectedGroup?.tenNhom || "";
    setRows(newRows);
    setIsModified(true);
  };

  const handleAssetProfileChange = (index: number, assetProfileId: string) => {
    const selectedProfile = allAssetProfiles.find(
      (p: any) => p.id === assetProfileId,
    );
    const newRows = [...rows];
    newRows[index].lyLichId = assetProfileId;
    newRows[index].tenLyLich = selectedProfile?.tenLyLich || "";
    setRows(newRows);
    setIsModified(true);
  };

  const handleSave = async () => {
    // Validate that all rows have both lyLichId and nhomTaiSanId
    const invalidRows = rows.filter(
      (row) => !row.lyLichId || !row.nhomTaiSanId,
    );
    if (invalidRows.length > 0) {
      showConfirmAlert("Vui lòng điền đầy đủ thông tin cho tất cả các dòng");
      return;
    }

    // Prepare data for update
    const updateData = rows.map((row) => ({
      lyLichId: row.lyLichId,
      nhomTaiSanId: row.nhomTaiSanId,
    }));

    updateMutation.mutate(updateData, {
      onSuccess: () => {
        setOriginalRows(rows);
        setIsModified(false);
      },
    });
  };

  const handleCancel = async () => {
    const result = await showConfirmAlert(
      "Hủy tất cả thay đổi và quay trở lại danh sách gốc?",
    );
    if (result.isConfirmed) {
      setRows(originalRows);
      setIsModified(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Quản lý Lý lịch - Nhóm tài sản
      </Typography>

      <Paper sx={{ overflow: "auto", mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  STT
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nhóm tài sản</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Lý lịch</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, width: 80 }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        row.isNew && row.nhomTaiSanId === ""
                          ? "#fff3cd"
                          : "inherit",
                    }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={row.nhomTaiSanId}
                          onChange={(e) =>
                            handleAssetGroupChange(index, e.target.value)
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-- Chọn nhóm tài sản --</em>
                          </MenuItem>
                          {getAvailableAssetGroups(row.nhomTaiSanId).map(
                            (group: any) => (
                              <MenuItem key={group.id} value={group.id}>
                                {group.tenNhom}
                              </MenuItem>
                            ),
                          )}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={row.lyLichId}
                          onChange={(e) =>
                            handleAssetProfileChange(index, e.target.value)
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>-- Chọn lý lịch --</em>
                          </MenuItem>
                          {allAssetProfiles.map((profile: any) => (
                            <MenuItem key={profile.id} value={profile.id}>
                              {profile.tenLyLich}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteRow(index)}
                        startIcon={<Delete />}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddRow}
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Thêm quan hệ
        </Button>
      </Box>

      {isModified && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <SaveBtn onSave={handleSave} />
          <Button
            variant="outlined"
            color="error"
            startIcon={<Close />}
            onClick={handleCancel}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Hủy thay đổi
          </Button>
        </Box>
      )}
    </Box>
  );
}
