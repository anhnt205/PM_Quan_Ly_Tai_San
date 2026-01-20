import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Grid,
  Divider,
  Slide,
  Tooltip,
} from "@mui/material";
import {
  Close,
  AddCircle,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useAccountMutation } from "../../Mutation";
import { useFormik } from "formik";
import TableCustom from "../../../../components/common/TableCustom";
import FieldInput from "../../../../components/TextField/FieldInput";
import SaveBtn from "../../../../components/Button/SaveBtn";
import CancelBtn from "../../../../components/Button/CancelBtn";
import { useSelector } from "react-redux";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AccountModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const currentUser = useSelector((state: any) => state.user.user);

  const { accountPage, staffs, createMutation } = useAccountMutation(
    undefined,
    undefined,
    undefined,
    null,
    currentUser?.taiKhoan?.idCongTy,
  );
  const staffWithStatus = useMemo(() => {
    return staffs.map((staff: any) => {
      const hasAccount = accountPage?.items?.some(
        (acc: any) => acc.tenDangNhap === staff.id,
      );
      return { ...staff, hasAccount };
    });
  }, [staffs, accountPage]);

  const formik = useFormik({
    initialValues: {
      tenDangNhap: "",
      matKhau: "",
      username: "",
      hoTen: "",
      email: "",
      soDienThoai: "",
      idCongTy: currentUser?.taiKhoan?.idCongTy || "",
      nguoiTao: currentUser?.taiKhoan?.hoTen || "",
      isActive: true,
    },
    onSubmit: (values) => {
      createMutation.mutate(values, {
        onSuccess: () => handleClose(),
      });
    },
  });

  const handleClose = () => {
    setStep(0);
    setSelectedStaff(null);
    formik.resetForm();
    onClose();
  };

  const columns: any[] = [
    {
      field: "action",
      headerName: "Thao tác",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <Tooltip
          title={params.row.hasAccount ? "Đã có tài khoản" : "Tạo tài khoản"}
          placement="top"
          arrow
        >
          <span>
            <IconButton
              disabled={params.row.hasAccount}
              onClick={() => {
                setSelectedStaff(params.row);
                formik.setValues({
                  ...formik.initialValues,
                  tenDangNhap: params.row.id,
                  username: params.row.id,
                  hoTen: params.row.hoTen,
                  email: params.row.emailCongViec,
                  soDienThoai: params.row.diDong,
                });
                setStep(1);
              }}
            >
              <AddCircle
                sx={{ color: params.row.hasAccount ? "#bdbdbd" : "#f44336" }}
              />
            </IconButton>
          </span>
        </Tooltip>
      ),
    },
    { field: "id", headerName: "Mã nhân viên", width: 120 },
    { field: "hoTen", headerName: "Họ tên", flex: 1 },
    { field: "emailCongViec", headerName: "Email công việc", flex: 1 },
    { field: "diDong", headerName: "Số điện thoại", width: 130 },
    { field: "tenChucVu", headerName: "Chức vụ", width: 150 },
    { field: "tenPhongBan", headerName: "Phòng ban", width: 180 },
    {
      field: "hasAccount",
      headerName: "Trạng thái tài khoản",
      width: 180,
      renderCell: (params: any) => (
        <Typography
          variant="body2"
          sx={{
            color: params.row.hasAccount ? "text.secondary" : "error.main",
          }}
        >
          {params.row.hasAccount ? "Đã có tài khoản" : "Chưa có tài khoản"}
        </Typography>
      ),
    },
    {
      field: "nguoiTao",
      headerName: "Người tạo",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "96vw",
          height: "92vh",
          maxWidth: "none",
          m: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        size="small"
        sx={{
          position: "absolute",
          right: 3,
          top: 3,
          zIndex: 1100,
          color: "#1976d2",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.04)",
          },
        }}
      >
        <Close />
      </IconButton>

      <DialogContent
        sx={{
          p: 0,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Slide
          direction="right"
          in={step === 0}
          mountOnEnter
          unmountOnExit
          timeout={400}
        >
          {/* Thẻ Box duy nhất bọc toàn bộ Step 0 */}
          <Box
            sx={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              "& .MuiPaper-root": {
                m: 0,
                boxShadow: "none",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              },
              "& .MuiDataGrid-root": { flex: 1 },
            }}
          >
            <TableCustom
              title={"Danh sách nhân viên"}
              columns={columns}
              rows={staffWithStatus}
              total={staffWithStatus.length}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              paginationMode="client"
              checkboxSelection={false}
            />
          </Box>
        </Slide>
        <Slide
          direction="left"
          in={step === 1}
          mountOnEnter
          unmountOnExit
          timeout={400}
        >
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                p: 1,
                background: "#f5efefff",
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Grid color="success" fontSize="small" />
              <Typography sx={{ fontWeight: 500 }}>
                Tạo account cho nhân viên {selectedStaff?.hoTen}
              </Typography>
            </Box>

            <Box p={2} sx={{ flex: 1, overflowY: "auto" }}>
              <Box mb={2} display="flex" gap={1}>
                <SaveBtn onSave={() => formik.handleSubmit()} />
                <CancelBtn onClick={() => setStep(0)} />
              </Box>
              <Divider />

              <Grid container spacing={4} mt={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    color="primary"
                    fontWeight="bold"
                    align="center"
                    mb={2}
                  >
                    Thông tin tài khoản
                  </Typography>

                  <Divider />
                  <Box display="flex" flexDirection="column" gap={4} mt={4}>
                    <FieldInput
                      title="Tên đăng nhập"
                      field="username"
                      formik={formik}
                    />
                    <FieldInput
                      title="Mật khẩu"
                      field="matKhau"
                      formik={formik}
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    color="primary"
                    fontWeight="bold"
                    align="center"
                    mb={2}
                  >
                    Thông tin nhân viên
                  </Typography>
                  <Divider />
                  <Box display="flex" flexDirection="column" gap={4} mt={4}>
                    <FieldInput
                      title="Mã nhân viên"
                      field="tenDangNhap"
                      formik={formik}
                      disabled
                    />
                    <FieldInput
                      title="Họ tên"
                      field="hoTen"
                      formik={formik}
                      disabled
                    />
                    <FieldInput
                      title="Email"
                      field="email"
                      formik={formik}
                      disabled
                    />
                    <FieldInput
                      title="Số điện thoại"
                      field="soDienThoai"
                      formik={formik}
                      disabled
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Slide>
      </DialogContent>
    </Dialog>
  );
}
