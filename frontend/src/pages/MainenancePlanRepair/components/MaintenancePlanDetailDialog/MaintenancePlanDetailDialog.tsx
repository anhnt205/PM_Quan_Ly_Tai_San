import React, { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
  Paper,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Close,
  InfoOutlineRounded,
  Inventory,
  Build,
} from "@mui/icons-material";
import dayjs from "dayjs";

interface MaintenancePlanDetailDialogProps {
  open: boolean;
  plan: any | null; // Data của kế hoạch được chọn
  onClose: () => void;
}

export default function MaintenancePlanDetailDialog({
  open,
  plan,
  onClose,
}: MaintenancePlanDetailDialogProps) {
  const theme = useTheme();

  // Tách và đếm số lượng Tài sản / CCDC từ mảng chiTiets của plan
  const { soLuongTaiSan, soLuongCCDC } = useMemo(() => {
    if (!plan || !plan.chiTiets) return { soLuongTaiSan: 0, soLuongCCDC: 0 };

    let ts = 0;
    let ccdc = 0;

    plan.chiTiets.forEach((item: any) => {
      // Dựa vào logic backend trả về để đếm, thường là check field idTaiSan / idCCDC
      if (item.idTaiSan) ts += 1;
      if (item.idCCDC) ccdc += 1;
    });

    return { soLuongTaiSan: ts, soLuongCCDC: ccdc };
  }, [plan]);

  if (!plan) return null;

  // Format ngày tháng hiển thị
  const formatDate = (dateString?: string) => {
    return dateString
      ? dayjs(dateString).format("DD/MM/YYYY")
      : "Chưa xác định";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <InfoOutlineRounded color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Chi tiết Kế hoạch Bảo trì
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Thông tin chung */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={600}
              gutterBottom
            >
              Thông tin chung
            </Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, bgcolor: "background.default" }}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Tên kế hoạch
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {plan.tenKeHoach || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Mã kế hoạch
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {plan.id || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Loại kế hoạch
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {plan.loaiKeHoach === "THIET_BI"
                      ? "Theo thiết bị"
                      : plan.loaiKeHoach === "CHU_KY"
                        ? `Theo chu kỳ (${plan.chuKyNgay} ngày)`
                        : plan.loaiKeHoach === "GIO_MAY"
                          ? `Theo giờ máy (${plan.mocGioMay} giờ)`
                          : "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Trạng thái
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      size="small"
                      label={plan.trangThai || "Khởi tạo"}
                      color="default"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Thời gian & Phụ trách */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={600}
              gutterBottom
            >
              Thời gian & Phụ trách
            </Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, bgcolor: "background.default" }}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Ngày bắt đầu
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(plan.ngayBatDau)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Ngày kết thúc
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(plan.ngayKetThuc)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Đơn vị giao
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {plan.tenDonViGiao || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Đơn vị thực hiện
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {plan.tenDonViThucHien || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">
                    Người phụ trách
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {plan.tenNguoiPhuTrach || "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Ghi chú */}
          {plan.ghiChu && (
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight={600}
                gutterBottom
              >
                Ghi chú
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: "background.default" }}
              >
                <Typography variant="body2">{plan.ghiChu}</Typography>
              </Paper>
            </Grid>
          )}

          {/* Thống kê thiết bị (Tài sản & CCDC) */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={600}
              gutterBottom
            >
              Thiết bị bảo trì
            </Typography>
            <Grid container spacing={2}>
              {/* Box Tài Sản */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    borderColor: alpha(theme.palette.info.main, 0.2),
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "50%",
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      display: "flex",
                      color: "info.main",
                    }}
                  >
                    <Build />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Tài sản
                    </Typography>
                    <Typography variant="h6" color="info.main" fontWeight={700}>
                      {soLuongTaiSan}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Box CCDC */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    bgcolor: alpha(theme.palette.warning.main, 0.05),
                    borderColor: alpha(theme.palette.warning.main, 0.2),
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "50%",
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      display: "flex",
                      color: "warning.main",
                    }}
                  >
                    <Inventory />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      CCDC - Vật tư
                    </Typography>
                    <Typography
                      variant="h6"
                      color="warning.main"
                      fontWeight={700}
                    >
                      {soLuongCCDC}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Button onClick={onClose} variant="outlined" color="inherit">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
