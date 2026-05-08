import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import RecyclingIcon from "@mui/icons-material/Recycling";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  AcceptanceTestRecordData,
  MaintenancePlanData,
} from "../../../MainenancePlanRepair/types";
import {
  MaintenanceRepairData,
  DanhGiaVatTuData,
  ChiTietVatTuThuHoiData,
} from "../../types";
import FieldDate from "../../../../components/TextField/FieldDate";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { PlanSigner } from "../../../../mockdata/mockPlans";
import { generateCode } from "../../../../utils/helpers";
import { useMaintenanceMaterialAssessmentMutation } from "../../../MainenancePlanRepair/Mutation";
import { useAllToolDetailQuery } from "../../../ToolManager/Mutation";
import { useAllLoaiSCBDQuery } from "../../../MaintenanceRepairType/Mutation";

type SimpleDept = { id: string; name: string };
type SimpleUser = {
  id: string;
  name: string;
  departmentId?: string;
  title?: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  plan: MaintenancePlanData;
  repairRequest: MaintenanceRepairData;
  acceptanceRecord: AcceptanceTestRecordData;
  // onSubmit: (record: DanhGiaVatTuData) => void;
}

const MaterialDialog = ({
  open,
  onClose,
  plan,
  repairRequest,
  acceptanceRecord,
  // onSubmit,
}: Props) => {
  const [soPhieu, setSoPhieu] = useState(`BB-DG-`);
  const [ngayDanhGia, setNgayDanhGia] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [viTri, setViTri] = useState(acceptanceRecord.viTri || "");
  const [capSuaChua, setCapSuaChua] = useState(
    acceptanceRecord.capSuaChua || "",
  );
  const [tenThietBi, setTenThietBi] = useState(
    acceptanceRecord.tenThietBi || "",
  );
  const [kieu, setKieu] = useState("");
  const [soDangKi, setSoDangKi] = useState(acceptanceRecord.soDangKi || "");
  const [idDonViQuanLy, setIdDonViQuanLy] = useState(plan.tenDonViGiao || "");
  const [soLuongPhucHoi, setSoLuongPhucHoi] = useState(0);
  const [soLuongPheLieu, setSoLuongPheLieu] = useState(0);
  const [soLuongHuy, setSoLuongHuy] = useState(0);

  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();
  const { data: allToolDetail = [] } = useAllToolDetailQuery();
  const { data: allLevel = [] } = useAllLoaiSCBDQuery();
  const { createMutation } = useMaintenanceMaterialAssessmentMutation();

  const departments: SimpleDept[] = (apiDepartments || []).map((d: any) => ({
    id: String(d?.id ?? ""),
    name: String(d?.tenPhongBan ?? d?.name ?? ""),
  }));
  const users: SimpleUser[] = (apiUsers || [])
    .filter((u: any) => u.hasAccount)
    .map((u: any) => ({
      id: String(u?.id ?? ""),
      name: String(u?.hoTen ?? u?.name ?? ""),
      departmentId: String(u?.phongBanId ?? u?.departmentId ?? ""),
      title: String(u?.tenChucVu ?? u?.chucVu ?? u?.title ?? ""),
    }));

  const [items, setItems] = useState<ChiTietVatTuThuHoiData[]>(() =>
    acceptanceRecord.danhSachTaiSan &&
    acceptanceRecord.danhSachTaiSan.length > 0
      ? acceptanceRecord.danhSachTaiSan
          .flatMap((m) => m.danhSachVatTu ?? [])
          ?.map((mi) => ({
            idChiTietVatTu: mi.idChiTietVatTu || "",
            tenVatTu: mi.tenVatTu ?? "",
            donViTinh: mi.donViTinh ?? "",
            soLuong: mi.soLuong || 1,
            tinhTrang: "",
            bienPhapXuLy: "",
            ghiChu: "",
          }))
      : [
          {
            idChiTietVatTu: "",
            tenVatTu: "",
            donViTinh: "Cái",
            soLuong: 1,
            tinhTrang: "",
            bienPhapXuLy: "",
            ghiChu: "",
          },
        ],
  );

  // Signers
  const [signers, setSigners] = useState<PlanSigner[]>([]);
  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      {
        idChiTietVatTu: "",
        tenVatTu: "",
        donViTinh: "Cái",
        soLuong: 1,
        tinhTrang: "",
        bienPhapXuLy: "",
        ghiChu: "",
      },
    ]);
  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItem = (
    idx: number,
    field: keyof ChiTietVatTuThuHoiData,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    );
  };

  const handleAddSigner = () => {
    if (!addUserId || !addDeptId) return;
    if (signers.some((s) => s.userId === addUserId)) return;
    const user = users.find((u) => u.id === addUserId);
    const dept = departments.find((d) => d.id === addDeptId);
    if (!user || !dept) return;
    setSigners((prev) => [
      ...prev,
      {
        userId: user.id,
        userName: user.name,
        departmentId: dept.id,
        departmentName: dept.name,
        order: prev.length + 1,
        signed: false,
      },
    ]);
    setAddDeptId("");
    setAddUserId("");
  };

  const handleRemoveSigner = (userId: string) => {
    setSigners((prev) =>
      prev
        .filter((s) => s.userId !== userId)
        .map((s, i) => ({ ...s, order: i + 1 })),
    );
  };

  const handleEdit = (signer: PlanSigner) => {
    setEditingSignerId(signer.userId);
    setEditDeptId(signer.departmentId);
    setEditUserId(signer.userId);
  };

  const handleSaveEdit = () => {
    setSigners((prev) =>
      prev.map((s) =>
        s.userId === editingSignerId
          ? {
              ...s,
              userId: editUserId,
              userName: users.find((u) => u.id === editUserId)?.name || "",
              departmentId: editDeptId,
              departmentName:
                departments.find((d) => d.id === editDeptId)?.name || "",
            }
          : s,
      ),
    );
    setEditingSignerId(null);
  };

  const handleSubmit = () => {
    const idNguoiLapBieu = signers.length > 0 ? signers[0].userId : "";
    const idTrinhDuyetGiamDoc =
      signers.length > 1 ? signers[signers.length - 1].userId : "";

    // Người ký trung gian (nếu có)
    const intermediateSigners =
      signers.length > 2
        ? signers.slice(1, -1).map((s: PlanSigner, idx: number) => ({
            id: `${generateCode("SIG-")}-${idx}`,
            idNguoiKy: s.userId,
            tenNguoiKy: s.userName,
            idPhongBan: s.departmentId,
            trangThai: 0,
          }))
        : [];
    const record: DanhGiaVatTuData = {
      soPhieu,
      ngayDanhGia,
      viTri,
      capSuaChua,
      tenThietBi,
      kieu,
      soDangKi,
      idDonViQuanLy,
      idNghiemThu: acceptanceRecord.id,
      soLuongPhucHoi,
      soLuongPheLieu,
      soLuongHuy,
      idNguoiLap: idNguoiLapBieu,
      nguoiLapXacNhan: false,
      idGiamDoc: idTrinhDuyetGiamDoc,
      giamDocXacNhan: false,
      trangThai: 0,
      share: true,
      nguoiKyList: intermediateSigners,
      danhSachChiTiet: items,
    };
    createMutation.mutate(record, {
      onSuccess: () => handleClose(),
    });
  };

  const handleClose = () => {
    setEditingSignerId(null);
    onClose();
  };
  const d = new Date(ngayDanhGia);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: "90vh" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RecyclingIcon color="warning" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Biên bản đánh giá chất lượng vật tư phụ tùng thu hồi sau sửa chữa
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Căn cứ BB nghiệm thu: {acceptanceRecord.soPhieu || ""}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        {/* 2-column grid: Thông tin | Quy trình duyệt */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 3 }}>
          {/* Col 1: Thông tin */}
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: 2.5,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Thông tin
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Số biên bản"
                value={soPhieu}
                onChange={(e) => setSoPhieu(e.target.value)}
                placeholder={`VD: BB-DG-${repairRequest?.id}`}
                size="small"
                fullWidth
              />
              <FieldDate
                title="Ngày lập biên bản"
                selectedDate={ngayDanhGia}
                setSelectedDate={setNgayDanhGia}
              />
              <TextField
                label="Địa điểm (Tại...)"
                value={viTri}
                onChange={(e) => setViTri(e.target.value)}
                size="small"
                fullWidth
                placeholder="vd: Phân xưởng khai thác 1, khu vực A"
              />
              <FieldAutoCompleted
                title="Cấp sửa chữa"
                labelkey="ten"
                data={allLevel}
                value={capSuaChua}
                onChange={(value) => setCapSuaChua(value.id)}
                autocompleteSx={{ flex: 1 }}
              />
              <TextField
                label="Của thiết bị"
                value={tenThietBi}
                onChange={(e) => setTenThietBi(e.target.value)}
                size="small"
                fullWidth
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Kiểu"
                  value={kieu}
                  onChange={(e) => setKieu(e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Số (đăng ký)"
                  value={soDangKi}
                  onChange={(e) => setSoDangKi(e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
              </Box>
              <FieldAutoCompleted
                title="Đơn vị quản lý vận hành"
                data={apiDepartments}
                value={idDonViQuanLy}
                setValue={setIdDonViQuanLy}
                labelkey="tenPhongBan"
              />
            </Box>
          </Box>

          {/* Col 2: Quy trình duyệt */}
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              mb={2}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              Quy trình duyệt
              <Chip
                label={`${signers.length} người`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 400 }}
              />
            </Typography>

            <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
              {signers.length > 0 ? (
                <Box sx={{ position: "relative", pl: 5 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: 16,
                      top: 8,
                      bottom: 8,
                      width: "1px",
                      bgcolor: "divider",
                    }}
                  />
                  {signers.map((s, idx) => {
                    const user = users.find((u) => u.id === s.userId);
                    const isEditingThis = editingSignerId === s.userId;
                    return (
                      <Box
                        key={s.userId}
                        sx={{ position: "relative", mb: 1.5 }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            left: -37,
                            top: 14,
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 600,
                            zIndex: 1,
                            boxShadow: "0 0 0 3px white",
                          }}
                        >
                          {idx + 1}
                        </Box>

                        <Box
                          sx={{
                            border: "1px solid",
                            borderColor: isEditingThis
                              ? "primary.main"
                              : "divider",
                            borderRadius: 2,
                            p: 1.5,
                            bgcolor: isEditingThis
                              ? "primary.50"
                              : "background.paper",
                          }}
                        >
                          {isEditingThis ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.5,
                              }}
                            >
                              <FormControl size="small" fullWidth>
                                <InputLabel>Đơn vị</InputLabel>
                                <Select
                                  value={editDeptId}
                                  label="Đơn vị"
                                  onChange={(e) => {
                                    setEditDeptId(e.target.value);
                                    setEditUserId("");
                                  }}
                                >
                                  {departments.map((d) => (
                                    <MenuItem key={d.id} value={d.id}>
                                      {d.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormControl size="small" fullWidth>
                                <InputLabel>Người duyệt</InputLabel>
                                <Select
                                  value={editUserId}
                                  label="Người duyệt"
                                  onChange={(e) =>
                                    setEditUserId(e.target.value)
                                  }
                                >
                                  {users
                                    .filter(
                                      (u) => u.departmentId === editDeptId,
                                    )
                                    .map((u) => (
                                      <MenuItem key={u.id} value={u.id}>
                                        {u.name}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={handleSaveEdit}
                                >
                                  Lưu
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => setEditingSignerId(null)}
                                >
                                  Hủy
                                </Button>
                              </Box>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    bgcolor: "primary.main",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    flexShrink: 0,
                                  }}
                                >
                                  {user?.name?.charAt(0) ?? "?"}
                                </Box>
                                <Box>
                                  <Typography fontWeight={600} fontSize={13}>
                                    {user?.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {user?.title}
                                  </Typography>
                                  <Box sx={{ mt: 0.5 }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {
                                        departments.find(
                                          (d) => d.id === s.departmentId,
                                        )?.name
                                      }
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <Box sx={{ display: "flex", gap: 0.5 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleEdit(s)}
                                >
                                  Sửa
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  onClick={() => handleRemoveSigner(s.userId)}
                                >
                                  Xóa
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có người duyệt
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              <FormControl size="small" fullWidth>
                <InputLabel>Đơn vị</InputLabel>
                <Select
                  value={addDeptId}
                  label="Đơn vị"
                  onChange={(e) => {
                    setAddDeptId(e.target.value);
                    setAddUserId("");
                  }}
                >
                  {departments.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth disabled={!addDeptId}>
                <InputLabel>Người duyệt</InputLabel>
                <Select
                  value={addUserId}
                  label="Người duyệt"
                  onChange={(e) => setAddUserId(e.target.value)}
                >
                  {users
                    .filter((u) => u.departmentId === addDeptId)
                    .map((u) => (
                      <MenuItem
                        key={u.id}
                        value={u.id}
                        disabled={signers.some((s) => s.userId === u.id)}
                      >
                        {u.name} – {u.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleAddSigner}
                disabled={!addUserId}
              >
                Thêm người duyệt
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Full-width: Danh mục vật tư thu hồi */}
        <Box
          sx={{
            mt: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              Danh mục vật tư thu hồi
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addItem}
              variant="outlined"
            >
              Thêm dòng
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 700, width: 40 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Tên vật tư, thiết bị
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 55 }}>ĐVT</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 50 }}>SL</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tình trạng</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Biện pháp xử lý
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 80 }}>
                    Ghi chú
                  </TableCell>
                  <TableCell sx={{ width: 36 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{String(idx + 1).padStart(2, "0")}</TableCell>
                    <TableCell>
                      <FieldAutoCompleted
                        title=""
                        data={allToolDetail}
                        labelkey="tenTaiSan"
                        limitOptions={10}
                        value={item.idChiTietVatTu}
                        noBorder={true}
                        onChange={(value) => {
                          updateItem(idx, "idChiTietVatTu", value.id);
                          updateItem(idx, "tenVatTu", value.tenTaiSan);
                          updateItem(idx, "donViTinh", value.donViTinh);
                        }}
                      />
                    </TableCell>
                    <TableCell>{item.donViTinh}</TableCell>
                    <TableCell>
                      <TextField
                        value={item.soLuong}
                        size="small"
                        variant="standard"
                        onChange={(e) =>
                          updateItem(idx, "soLuong", e.target.value)
                        }
                        inputProps={{ style: { width: 36 } }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item.tinhTrang}
                        size="small"
                        variant="standard"
                        fullWidth
                        onChange={(e) =>
                          updateItem(idx, "tinhTrang", e.target.value)
                        }
                        placeholder="Mô tả tình trạng..."
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item.bienPhapXuLy}
                        size="small"
                        variant="standard"
                        fullWidth
                        onChange={(e) =>
                          updateItem(idx, "bienPhapXuLy", e.target.value)
                        }
                        placeholder="Phục hồi / Phế liệu / Hủy"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item.ghiChu}
                        size="small"
                        variant="standard"
                        fullWidth
                        onChange={(e) =>
                          updateItem(idx, "ghiChu", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => removeItem(idx)}
                        color="error"
                        disabled={items.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Số lượng phân loại */}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Số để lại phục hồi"
              type="number"
              size="small"
              value={soLuongPhucHoi}
              onChange={(e) =>
                setSoLuongPhucHoi(Math.max(0, parseInt(e.target.value) || 0))
              }
              sx={{ width: 200 }}
            />
            <TextField
              label="Số phế liệu"
              type="number"
              size="small"
              value={soLuongPheLieu}
              onChange={(e) =>
                setSoLuongPheLieu(Math.max(0, parseInt(e.target.value) || 0))
              }
              sx={{ width: 200 }}
            />
            <TextField
              label="Số hủy"
              type="number"
              size="small"
              value={soLuongHuy}
              onChange={(e) =>
                setSoLuongHuy(Math.max(0, parseInt(e.target.value) || 0))
              }
              sx={{ width: 200 }}
            />
          </Box>
        </Box>

        {/* Full-width Preview */}
        <Box
          sx={{
            mt: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: 2.5,
            fontFamily: "serif",
            fontSize: "0.875rem",
            lineHeight: 1.8,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="caption" display="block">
                TẬP ĐOÀN CÔNG NGHIỆP
              </Typography>
              <Typography variant="caption" display="block">
                THAN – KHOÁNG SẢN VIỆT NAM
              </Typography>
              <Typography variant="caption" display="block" fontWeight={700}>
                CÔNG <u>TY THAN UÔNG BÍ</u> - TKV
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" display="block" fontWeight={700}>
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </Typography>
              <Typography variant="caption" display="block" fontWeight={700}>
                <u>Độc lập – Tự do – Hạnh phúc</u>
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="caption"
            display="block"
            sx={{ textAlign: "right", fontStyle: "italic", mb: 2 }}
          >
            Quảng Ninh, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
            {d.getFullYear()}
          </Typography>

          <Typography
            variant="subtitle2"
            align="center"
            fontWeight={700}
            sx={{ color: "primary.main", mb: 0.25 }}
          >
            BIÊN BẢN
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            ĐÁNH GIÁ CHẤT LƯỢNG VẬT TƯ PHỤ TÙNG THU HỒI SAU SỬA CHỮA
          </Typography>

          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Hôm nay, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
            {d.getFullYear()}. Tại {viTri || "………………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Hội đồng đánh giá chất lượng vật tư phụ tùng thu hồi sau sửa chữa
            cấp: <b>{capSuaChua || "……………"}</b>
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Của thiết bị: <b>{tenThietBi || "……………"}</b> Kiểu: {kieu || "………"}{" "}
            Số: {soDangKi || "……………………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Đơn vị quản lý vận hành: {idDonViQuanLy || "………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Thành phần gồm:
          </Typography>
          <Box sx={{ pl: 2, mb: 1.5 }}>
            {signers.map((s, i) => (
              <Box key={i} sx={{ display: "flex", gap: 3, mb: 0.25 }}>
                <Typography variant="caption" sx={{ minWidth: 16 }}>
                  {i + 1}.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ minWidth: 150, fontWeight: 500 }}
                >
                  {s.userName || "………………………"}
                </Typography>
                <Typography variant="caption" sx={{ minWidth: 120 }}>
                  {s.position || "………………………"}
                </Typography>
                <Typography variant="caption">{s.departmentName}</Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
            Đã tiến hành kiểm tra chi tiết các vật tư phụ tùng thu hồi sau sửa
            chữa cụ thể như sau:
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5 }}>
            <Table size="small" sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell
                    sx={{ fontWeight: 700, width: 40, fontSize: "0.72rem" }}
                  >
                    STT
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                    Tên vật tư, thiết bị
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, width: 45, fontSize: "0.72rem" }}
                  >
                    ĐVT
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, width: 40, fontSize: "0.72rem" }}
                  >
                    SL
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                    Tình trạng
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                    Biện pháp xử lý
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, width: 70, fontSize: "0.72rem" }}
                  >
                    Ghi chú
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.tenVatTu}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.donViTinh}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.soLuong}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.tinhTrang}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.bienPhapXuLy}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.ghiChu}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="caption" display="block">
            Số để lại phục hồi phục vụ cho sản xuất: {soLuongPhucHoi || "…………"}.
          </Typography>
          <Typography variant="caption" display="block">
            Số để làm phế liệu: {soLuongPheLieu || "…………"} (mục)
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
            Số lượng hủy: {soLuongHuy || "…………"} (mục)
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {(() => {
              const sorted = [...(signers || [])].sort(
                (a, b) => (a.order || 0) - (b.order || 0),
              );
              const cols = sorted.map((s, idx) => ({
                label: (s.departmentName || "").toUpperCase(),
                signer: s,
              }));

              if (cols.length === 0) {
                return (
                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    <Typography variant="caption" color="text.disabled">
                      Chưa có người duyệt
                    </Typography>
                  </Box>
                );
              }

              return cols.map((col, idx) => (
                <Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    display="block"
                    sx={{ textTransform: "uppercase", mb: 0.5 }}
                  >
                    {col.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ fontStyle: "italic", mb: 4 }}
                  >
                    (Ký, ghi rõ họ tên)
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "text.primary",
                      width: "70%",
                      mx: "auto",
                      mb: 0.5,
                    }}
                  />
                  {col.signer ? (
                    <>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        display="block"
                      >
                        {col.signer.userName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {col.signer.departmentName}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="caption" color="text.disabled">
                      Chưa chọn
                    </Typography>
                  )}
                </Box>
              ));
            })()}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Chip label="Trạng thái: Chờ duyệt" color="warning" size="small" />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              * Biên bản này thực tế có thể có hoặc không (tùy trường hợp cụ
              thể)
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="warning"
          disabled={signers.length === 0}
          onClick={handleSubmit}
        >
          Tạo biên bản
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialDialog;
