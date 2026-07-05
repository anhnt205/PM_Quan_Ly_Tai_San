import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  TablePagination,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DeleteOutline, TableViewOutlined } from "@mui/icons-material";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { useAssetByDonViQuery } from "../../../AssetTransfer/Mutation";
import { useDebounce } from "../../../../hooks/useDebounce";

interface PlanAsset {
  deviceId: string;
  quantity: number;
  tenTaiSan?: string;
  tenNhom?: string;
  tenDonVi?: string;
  tenHienTrang?: string;
  viTri?: string;
  thuocHeThong?: string;
  id?: string;
  month1?: any;
  month2?: any;
  month3?: any;
  month4?: any;
  month5?: any;
  month6?: any;
  month7?: any;
  month8?: any;
  month9?: any;
  month10?: any;
  month11?: any;
  month12?: any;
}

interface Props {
  idDonViGiao: string;
  assets: PlanAsset[];
  onAssetsChange: (assets: PlanAsset[]) => void;
  allDeptDevices: any[];
}

const StepAssets = ({
  idDonViGiao,
  assets,
  onAssetsChange,
  allDeptDevices,
}: Props) => {
  const [openTable, setOpenTable] = useState(false);

  // State cho Modal phân trang
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [modalSearch, setModalSearch] = useState("");
  const debouncedModalSearch = useDebounce(modalSearch, 500);

  const { data: deptDevices = { items: [], totalItems: 0 } } =
    useAssetByDonViQuery(2, idDonViGiao, debouncedModalSearch, page, pageSize);


  const [localSelection, setLocalSelection] = useState<string[]>(
    assets.map((a) => a.deviceId),
  );
  const [localQuantities, setLocalQuantities] = useState<
    Record<string, number>
  >(
    assets.reduce(
      (acc, curr) => ({ ...acc, [curr.deviceId]: curr.quantity }),
      {},
    ),
  );

  useEffect(() => {
    setLocalSelection(assets.map((a) => a.deviceId));
    setLocalQuantities(
      assets.reduce(
        (acc, curr) => ({ ...acc, [curr.deviceId]: curr.quantity }),
        {},
      ),
    );
  }, [assets]);

  const [assetValue, setAssetValue] = useState<any>(null);

  const addDevice = (device: any) => {
    if (!device) return;
    const isSelected = assets.some((a) => a.deviceId === device.id);
    if (!isSelected) {
      onAssetsChange([
        ...assets,
        {
          ...device,
          deviceId: device.id,
          quantity: 1,
          month1: "",
          month2: "",
          month3: "",
          month4: "",
          month5: "",
          month6: "",
          month7: "",
          month8: "",
          month9: "",
          month10: "",
          month11: "",
          month12: "",
        },
      ]);
    }

    setAssetValue(null);
  };

  const removeDevice = (id: string) => {
    onAssetsChange(assets.filter((a: any) => a.id !== id));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <FieldAutoCompleted
          title="Thêm thiết bị..."
          data={allDeptDevices}
          labelkey="tenTaiSan"
          labelOption="id"
          value={assetValue}
          setValue={setAssetValue}
          onChange={addDevice}
          autocompleteSx={{ flex: 1 }}
          limitOptions={20}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={() => setOpenTable(true)}
          sx={{ height: 40, minWidth: 40, px: 1 }}
        >
          <TableViewOutlined fontSize="small" />
        </Button>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
        Danh sách thiết bị đã chọn (<strong>{assets.length}</strong> thiết bị)
      </Typography>

      {assets.length === 0 ? (
        <Alert severity="info">
          Chưa có thiết bị nào được chọn. Hãy dùng ô tìm kiếm hoặc nút Chọn
          nhiều.
        </Alert>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {assets.map((asset: any) => {
            const device = allDeptDevices.find(
              (d: any) => d.id === asset.deviceId,
            );
            return (
              <Box
                key={asset.deviceId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  transition: "all 0.15s",
                  width: "100%",
                  minWidth: 0,
                  "&:hover": {
                    borderColor: "primary.light",
                    bgcolor: "grey.50",
                  },
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    fontSize={13}
                    fontWeight={600}
                    noWrap
                    display="block"
                  >
                    {device?.tenTaiSan || asset.tenTaiSan || asset.deviceId}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      mt: 0.5,
                      flexWrap: "wrap",
                    }}
                  >
                    {device?.tenNhom && (
                      <Chip
                        label={device.tenNhom}
                        size="small"
                        sx={{ fontSize: 10, height: 18 }}
                      />
                    )}
                    {device?.tenLoai && (
                      <Chip
                        label={device.tenLoai}
                        size="small"
                        color={"default"}
                        variant="outlined"
                        sx={{ fontSize: 10, height: 18 }}
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    type="number"
                    size="small"
                    label="SL"
                    value={asset.quantity}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      onAssetsChange(
                        assets.map((a) =>
                          a.deviceId === asset.deviceId
                            ? { ...a, quantity: val }
                            : a,
                        ),
                      );
                    }}
                    inputProps={{ min: 1 }}
                    sx={{ width: 70, "& .MuiInputBase-input": { py: 0.5 } }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeDevice(asset.id)}
                    sx={{ p: 0.5 }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Large selection dialog with Pagination */}
      <Dialog
        open={openTable}
        onClose={() => setOpenTable(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Chọn nhiều thiết bị
          <IconButton size="small" onClick={() => setOpenTable(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm theo mã hoặc tên thiết bị..."
              onChange={(e) => {
                setModalSearch(e.target.value);
                setPage(0);
              }}
            />
          </Box>

          {localSelection.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.75, display: "block" }}
              >
                Đã chọn (<strong>{localSelection.length}</strong> thiết bị)
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  maxHeight: 220,
                  overflowY: "auto",
                  pr: 0.5,
                }}
              >
                {localSelection.map((id) => {
                  const device = allDeptDevices.find(
                    (d: any) => d.id === id,
                  );
                  return (
                    <Box
                      key={id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "primary.light",
                        bgcolor: "primary.50",
                        width: "100%",
                        minWidth: 0,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          fontSize={13}
                          fontWeight={600}
                          noWrap
                          display="block"
                        >
                          {device?.tenTaiSan || id}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            mt: 0.5,
                            flexWrap: "wrap",
                          }}
                        >
                          {device?.tenNhom && (
                            <Chip
                              label={device.tenNhom}
                              size="small"
                              sx={{ fontSize: 10, height: 18 }}
                            />
                          )}
                          {device?.tenLoai && (
                            <Chip
                              label={device.tenLoai}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: 10, height: 18 }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <TextField
                          type="number"
                          size="small"
                          label="SL"
                          value={localQuantities[id] ?? 1}
                          onChange={(e) =>
                            setLocalQuantities({
                              ...localQuantities,
                              [id]: Math.max(1, parseInt(e.target.value) || 1),
                            })
                          }
                          inputProps={{ min: 1 }}
                          sx={{
                            width: 70,
                            "& .MuiInputBase-input": { py: 0.5 },
                          }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setLocalSelection(
                              localSelection.filter((sid) => sid !== id),
                            )
                          }
                          sx={{ p: 0.5 }}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          <Paper sx={{ width: "100%", overflow: "auto", boxShadow: "none" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">Chọn</TableCell>
                  <TableCell>Mã thiết bị</TableCell>
                  <TableCell>Tên thiết bị</TableCell>
                  <TableCell>Nhóm TB</TableCell>
                  <TableCell>Loại TS</TableCell>
                  <TableCell align="center">Số lượng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deptDevices.items.map((dev: any) => {
                  const isLocallySelected = localSelection.includes(dev.id);
                  return (
                    <TableRow key={dev.id} hover>
                      <TableCell padding="checkbox">
                        <input
                          type="checkbox"
                          checked={isLocallySelected}
                          onChange={() => {
                            if (isLocallySelected)
                              setLocalSelection(
                                localSelection.filter((id) => id !== dev.id),
                              );
                            else setLocalSelection([...localSelection, dev.id]);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, fontFamily: "monospace" }}>
                        {dev.id}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {dev.tenTaiSan}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{dev.tenNhom}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{dev.tenLoai}</TableCell>
                      <TableCell align="center">
                        <input
                          type="number"
                          min={1}
                          style={{ width: 60, padding: 2 }}
                          value={localQuantities[dev.id] ?? 1}
                          onChange={(e) =>
                            setLocalQuantities({
                              ...localQuantities,
                              [dev.id]: Math.max(
                                1,
                                parseInt(e.target.value) || 1,
                              ),
                            })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={deptDevices.totalItems || 0}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Số hàng:"
            />
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTable(false)}>Đóng</Button>
          <Button
            variant="contained"
            onClick={() => {
              const newAssets: PlanAsset[] = localSelection.map((id) => {
                const existingAsset = assets.find((a) => a.deviceId === id);
                if (existingAsset)
                  return {
                    ...existingAsset,
                    quantity: localQuantities[id] ?? 1,
                  };

                return {
                  deviceId: id,
                  quantity: localQuantities[id] ?? 1,
                  month1: "",
                  month2: "",
                  month3: "",
                  month4: "",
                  month5: "",
                  month6: "",
                  month7: "",
                  month8: "",
                  month9: "",
                  month10: "",
                  month11: "",
                  month12: "",
                };
              });
              onAssetsChange(newAssets);
              setOpenTable(false);
              setModalSearch("");
            }}
          >
            Áp dụng ({localSelection.length})
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StepAssets;
