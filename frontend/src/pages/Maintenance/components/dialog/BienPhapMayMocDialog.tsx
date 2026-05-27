import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Chip,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useSelector } from "react-redux";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import { useBienPhapMayMocMutation } from "../../mutation/bienPhapMayMoc";
import { BienPhapMayMocData } from "../../types";
import { CongTy } from "../../../../utils/const";
import { generateCode } from "../../../../utils/helpers";
import { PlanSigner } from "../../../../mockdata/mockPlans";
import { listSigneInfo } from "../../config";
import dayjs from "dayjs";
import FileAttachmentInput from "../../../../components/TextField/FileAttachmentInput";
import S3Service from "../../../../services/S3Service";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";

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
  idGiamDinhMayMoc: string;
  soPhieuGiamDinh?: string;
  initData?: BienPhapMayMocData | null;
}

const BienPhapMayMocDialog = ({
  open,
  onClose,
  idGiamDinhMayMoc,
  soPhieuGiamDinh,
  initData,
}: Props) => {
  const { user } = useSelector((state: any) => state.user);
  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();
  const [document, setDocument] = useState<File | string | any>("");
  const { createMutation, updateMutation } = useBienPhapMayMocMutation();

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

  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const initialValues: BienPhapMayMocData & { nguoiKyList: any[] } = {
    id: "",
    idCongTy: CongTy.CT001,
    idGiamDinhMayMoc: idGiamDinhMayMoc,
    soPhieu: "",
    soDeNghi: "",
    donViSuaChua: "",
    donViPhoiHop: "",
    hinhThuc: "",
    thoiGianBatDau: dayjs().format("YYYY-MM-DD"),
    thoiGianKetThuc: dayjs().format("YYYY-MM-DD"),
    thoiGianNgay: 0,
    ghiChu: "",
    tenFile: "",
    duongDanFile: "",
    idNguoiLap: "",
    nguoiLapXacNhan: false,
    idGiamDoc: "",
    giamDocXacNhan: false,
    share: false,
    trangThai: 0,
    nguoiKyList: [],
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const list: any[] = values.nguoiKyList ?? [];
      const idNguoiLap = list.length > 0 ? list[0].userId : "";
      const idGiamDoc = list.length > 1 ? list[list.length - 1].userId : "";
      const nguoiKyList =
        list.length > 2
          ? list.slice(1, -1).map((s: PlanSigner, idx: number) => ({
              id: `${generateCode("SIG-")}-${idx}`,
              idNguoiKy: s.userId,
              tenNguoiKy: s.userName,
              idPhongBan: s.departmentId,
              trangThai: 0,
            }))
          : [];

      let keyTailieu = "";
      if (document instanceof File) {
        keyTailieu = await S3Service.put({
          name: document.name,
          file: document,
          type: "tailieu",
        });
      }
      const payload: BienPhapMayMocData = {
        ...values,
        duongDanFile: keyTailieu,
        tenFile: document?.name,
        idNguoiLap,
        idGiamDoc,
        nguoiKyList,
        nguoiTao: user?.taiKhoan?.tenDangNhap,
        ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        ngayCapNhat: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };

      if (initData?.id) {
        updateMutation.mutate(payload, { onSuccess: handleClose });
      } else {
        createMutation.mutate(payload, { onSuccess: handleClose });
      }
    },
  });

  useEffect(() => {
    if (!open) return;
    if (initData) {
      const listInfo = listSigneInfo(initData, apiUsers, apiDepartments);
      formik.setValues({
        ...initData,
        nguoiKyList: (listInfo ?? []).map((item: any) => ({
          userId: item.idNhanVien,
          userName: item.hoTen,
          departmentId: item.idDonVi,
          departmentName: item.donVi,
        })),
      } as any);
    } else {
      formik.setValues({ ...initialValues, idGiamDinhMayMoc });
    }
  }, [open, initData, idGiamDinhMayMoc, apiUsers, apiDepartments]);

  function handleClose() {
    setAddDeptId("");
    setAddUserId("");
    setEditingSignerId(null);
    formik.resetForm();
    onClose();
  }

  const handleAddSigner = () => {
    if (!addDeptId || !addUserId) return;
    const u = users.find((x) => x.id === addUserId);
    const d = departments.find((x) => x.id === addDeptId);
    if (!u || !d) return;
    if (formik.values.nguoiKyList.some((s: any) => s.userId === u.id)) return;
    formik.setFieldValue("nguoiKyList", [
      ...formik.values.nguoiKyList,
      {
        userId: u.id,
        userName: u.name,
        departmentId: d.id,
        departmentName: d.name,
        position: u.title ?? "",
        order: formik.values.nguoiKyList.length + 1,
        signed: false,
      },
    ]);
    setAddDeptId("");
    setAddUserId("");
  };

  const handleRemoveSigner = (userId: string) => {
    formik.setFieldValue(
      "nguoiKyList",
      formik.values.nguoiKyList
        .filter((s: any) => s.userId !== userId)
        .map((s: any, i: number) => ({ ...s, order: i + 1 })),
    );
  };

  const handleSaveEdit = () => {
    formik.setFieldValue(
      "nguoiKyList",
      formik.values.nguoiKyList.map((s: any) =>
        s.userId === editingSignerId
          ? {
              ...s,
              userId: editUserId,
              userName: users.find((u) => u.id === editUserId)?.name ?? "",
              departmentId: editDeptId,
              departmentName:
                departments.find((d) => d.id === editDeptId)?.name ?? "",
            }
          : s,
      ),
    );
    setEditingSignerId(null);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: "90vh" } }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BuildIcon color="warning" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Biện pháp sửa chữa máy móc
            </Typography>
            {soPhieuGiamDinh && (
              <Typography variant="caption" color="text.secondary">
                Căn cứ BB giám định: {soPhieuGiamDinh}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: 3,
            height: "100%",
          }}
        >
          {/* ── LEFT: Form nhập liệu ── */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              overflowY: "auto",
            }}
          >
            {/* Thông tin chính */}
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 2.5,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Thông tin chung
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Số phiếu"
                    name="soPhieu"
                    value={formik.values.soPhieu ?? ""}
                    onChange={formik.handleChange}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Số đề nghị"
                    name="soDeNghi"
                    value={formik.values.soDeNghi ?? ""}
                    onChange={formik.handleChange}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
                <FieldAutoCompleted
                  title="Đơn vị sửa chữa"
                  data={apiDepartments}
                  labelkey="tenPhongBan"
                  field="donViSuaChua"
                  value={formik.values.donViSuaChua ?? ""}
                  formik={formik}
                />
                <FieldAutoCompleted
                  title="Đơn vị phối hợp"
                  data={apiDepartments}
                  labelkey="tenPhongBan"
                  field="donViPhoiHop"
                  value={formik.values.donViPhoiHop ?? ""}
                  formik={formik}
                />
                <TextField
                  label="Hình thức sửa chữa"
                  name="hinhThuc"
                  value={formik.values.hinhThuc ?? ""}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                  placeholder="VD: Sửa chữa tại xưởng, sửa chữa tại chỗ..."
                />
              </Box>
            </Box>

            {/* Thời gian */}
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 2.5,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Thời gian thực hiện
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Thời gian bắt đầu"
                    name="thoiGianBatDau"
                    type="date"
                    value={formik.values.thoiGianBatDau ?? ""}
                    onChange={(e) => {
                      formik.handleChange(e);
                      // tự tính số ngày
                      if (formik.values.thoiGianKetThuc) {
                        const diff = dayjs(formik.values.thoiGianKetThuc).diff(
                          dayjs(e.target.value),
                          "day",
                        );
                        formik.setFieldValue("thoiGianNgay", Math.max(0, diff));
                      }
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Thời gian kết thúc"
                    name="thoiGianKetThuc"
                    type="date"
                    value={formik.values.thoiGianKetThuc ?? ""}
                    onChange={(e) => {
                      formik.handleChange(e);
                      if (formik.values.thoiGianBatDau) {
                        const diff = dayjs(e.target.value).diff(
                          dayjs(formik.values.thoiGianBatDau),
                          "day",
                        );
                        formik.setFieldValue("thoiGianNgay", Math.max(0, diff));
                      }
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <TextField
                  label="Thời gian thực hiện (số ngày)"
                  name="thoiGianNgay"
                  type="number"
                  value={formik.values.thoiGianNgay ?? 0}
                  onChange={formik.handleChange}
                  size="small"
                  inputProps={{ min: 0 }}
                  helperText="Tự tính khi chọn ngày bắt đầu và kết thúc"
                />
              </Box>
            </Box>

            {/* Ghi chú */}
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 2.5,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Ghi chú
              </Typography>
              <TextField
                name="ghiChu"
                value={formik.values.ghiChu ?? ""}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                multiline
                rows={3}
                placeholder="Ghi chú thêm về biện pháp sửa chữa..."
              />
            </Box>

            {/* File đính kèm */}
            <Box mt={4} mb={4}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Tài liệu đính kèm
              </Typography>

              <FileAttachmentInput
                formik={formik}
                fileName="tenFile"
                filePath="duongDanFile"
                setDocument={setDocument}
              />
            </Box>
          </Box>

          {/* ── RIGHT: Luồng ký ── */}
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
                label={`${formik.values.nguoiKyList.length} người`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 400 }}
              />
            </Typography>

            {/* Danh sách người ký */}
            <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
              {formik.values.nguoiKyList.length > 0 ? (
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
                  {formik.values.nguoiKyList.map((s: any, idx: number) => {
                    const userItem = users.find((u) => u.id === s.userId);
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
                            bgcolor: "warning.main",
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
                            borderRadius: 2,
                            p: 1.5,
                            borderColor: isEditingThis
                              ? "primary.main"
                              : "divider",
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
                                    bgcolor: "warning.main",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    flexShrink: 0,
                                  }}
                                >
                                  {userItem?.name?.charAt(0) ?? "?"}
                                </Box>
                                <Box>
                                  <Typography fontWeight={600} fontSize={13}>
                                    {userItem?.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {userItem?.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                  >
                                    {s.departmentName}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: "flex", gap: 0.5 }}>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    setEditingSignerId(s.userId);
                                    setEditDeptId(s.departmentId);
                                    setEditUserId(s.userId);
                                  }}
                                >
                                  Sửa
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
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
                <Box
                  sx={{ textAlign: "center", py: 4, color: "text.disabled" }}
                >
                  <Typography variant="body2">
                    Chưa có người trong quy trình duyệt
                  </Typography>
                  <Typography variant="caption">
                    Thêm người ký bên dưới
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Thêm người ký */}
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              mb={1}
              display="block"
            >
              Thêm người vào quy trình
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
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
                <InputLabel>Người ký</InputLabel>
                <Select
                  value={addUserId}
                  label="Người ký"
                  onChange={(e) => setAddUserId(e.target.value)}
                >
                  {users
                    .filter((u) => u.departmentId === addDeptId)
                    .map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                size="small"
                color="warning"
                fullWidth
                disabled={!addDeptId || !addUserId}
                onClick={handleAddSigner}
              >
                + Thêm người ký
              </Button>
            </Box>

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
          disabled={isPending || formik.values.nguoiKyList.length === 0}
          onClick={() => formik.submitForm()}
        >
          {isPending
            ? "Đang lưu..."
            : initData?.id
              ? "Cập nhật"
              : "Tạo biện pháp"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BienPhapMayMocDialog;
