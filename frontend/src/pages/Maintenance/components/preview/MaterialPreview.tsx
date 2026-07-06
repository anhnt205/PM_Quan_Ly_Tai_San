import {
  Box,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { currentBrandConfig } from "../../../../config/brandConfig";

export default function MaterialPreview({
  d,
  formik,
  congty,
  tieude,
}: {
  d: Date;
  formik?: any;
  congty?: string;
  tieude?: string;
}) {
  return (
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
          <Typography
            variant="caption"
            display="block"
            fontWeight={700}
            sx={{ textDecoration: "underline", textTransform: "uppercase" }}
          >
            {congty || currentBrandConfig.company}
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
        sx={{ mb: 2, textTransform: "uppercase" }}
      >
        {tieude ||
          ".............................................................."}
      </Typography>

      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Hôm nay, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
        {d.getFullYear()}. Tại {formik?.values.viTri || "………………………"}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Hội đồng đánh giá chất lượng vật tư phụ tùng thu hồi sau sửa chữa cấp:{" "}
        <b>{formik?.values.capSuaChua || "……………"}</b>
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Của thiết bị: <b>{formik?.values.tenThietBi || "……………"}</b> Kiểu:{" "}
        {formik?.values.kieu || "………"} Số:{" "}
        {formik?.values.soDangKi || "……………………………"}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Đơn vị quản lý vận hành: {formik?.values.idDonViQuanLy || "………………"}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Thành phần gồm:
      </Typography>
      <Box sx={{ pl: 2, mb: 1.5 }}>
        {formik?.values.nguoiKyList?.map((s: any, i: number) => (
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
        Đã tiến hành kiểm tra chi tiết các vật tư phụ tùng thu hồi sau sửa chữa
        cụ thể như sau:
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
            {formik?.values.danhSachChiTiet.map((item: any, idx: number) => (
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
        Số để lại phục hồi phục vụ cho sản xuất:{" "}
        {formik?.values.soLuongPhucHoi || "…………"}.
      </Typography>
      <Typography variant="caption" display="block">
        Số để làm phế liệu: {formik?.values.soLuongPheLieu || "…………"} (mục)
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
        Số lượng hủy: {formik?.values.soLuongHuy || "…………"} (mục)
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
          const sorted = [...(formik?.values.nguoiKyList || [])].sort(
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
          * Biên bản này thực tế có thể có hoặc không (tùy trường hợp cụ thể)
        </Typography>
      </Box>
    </Box>
  );
}
