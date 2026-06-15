import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  NghiemThuPhuongTienData,
  NghiemThuPhuongTienChiTietData,
} from "../../types";

interface Props {
  row: NghiemThuPhuongTienData & {
    nguoiKyList?: any[];
    tenTaiSan?: string;
    soPhieuBienPhapPhuongTien?: string;
  };
  congty?: string;
  tieude?: string;
}

const AcceptanceVehiclePreview = ({ row, congty, tieude }: Props) => {
  if (!row) return null;

  const d = row.ngayTao ? new Date(row.ngayTao) : new Date();
  const signers = row.nguoiKyList ?? [];
  const materials = (row.danhSachChiTiet ??
    []) as NghiemThuPhuongTienChiTietData[];

  return (
    <Box
      sx={{
        fontFamily: "serif",
        fontSize: "0.875rem",
        lineHeight: 1.8,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
      }}
    >
      {/* Header 2 cột */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
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
            sx={{ textTransform: "uppercase", textDecorationLine: "underline" }}
          >
            CÔNG TY {congty || "................."}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" display="block" fontWeight={700}>
            CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </Typography>
          <Typography variant="caption" display="block" fontWeight={700}>
            <u>Độc lập – Tự do – Hạnh phúc</u>
          </Typography>
        </Box>
      </Box>

      {/* Địa danh ngày tháng */}
      <Typography
        variant="caption"
        display="block"
        sx={{ textAlign: "right", fontStyle: "italic", mb: 2 }}
      >
        Quảng Ninh, ngày {d.getDate()} tháng{" "}
        {String(d.getMonth() + 1).padStart(2, "0")} năm {d.getFullYear()}
      </Typography>

      {/* Tiêu đề */}
      <Typography
        variant="subtitle2"
        align="center"
        fontWeight={700}
        sx={{ mb: 0.5, fontSize: "1rem", textTransform: "uppercase" }}
        display="block"
      >
        {tieude ||
          ".............................................................."}
      </Typography>

      {/* Căn cứ */}
      {row.soPhieuBienPhapPhuongTien && (
        <Typography
          variant="caption"
          display="block"
          sx={{ fontStyle: "italic", mb: 1 }}
        >
          Căn cứ biện pháp sửa chữa số: {row.soPhieuBienPhapPhuongTien}
        </Typography>
      )}

      <Box sx={{ mb: 2 }} />

      {/* Thông tin nghiệm thu */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" display="block">
          <b>- Số phiếu:</b> {row.soPhieu || "…………"}
        </Typography>
        <Typography variant="caption" display="block">
          <b>- Thiết bị:</b> {row.tenTaiSan || "…………"}
        </Typography>
        <Typography variant="caption" display="block">
          <b>- Nội dung nghiệm thu:</b> {row.noiDung || "…………"}
        </Typography>
        <Typography variant="caption" display="block">
          <b>- Tình trạng sau sửa chữa:</b> {row.tinhTrang || "…………"}
        </Typography>
        {row.congViecPhatSinh && (
          <Typography variant="caption" display="block">
            <b>- Công việc phát sinh:</b> {row.congViecPhatSinh}
          </Typography>
        )}
        {row.chiPhiNhanCong != null && row.chiPhiNhanCong > 0 && (
          <Typography variant="caption" display="block">
            <b>- Chi phí nhân công:</b>{" "}
            {row.chiPhiNhanCong?.toLocaleString("vi-VN")} đồng
          </Typography>
        )}
      </Box>

      {/* Bảng vật tư phụ tùng */}
      <Typography
        variant="caption"
        display="block"
        fontWeight={700}
        sx={{ mb: 0.5 }}
      >
        Chi phí vật tư, phụ tùng:
      </Typography>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ mb: 3, border: "1px solid", borderColor: "divider" }}
      >
        <Table size="small" sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 40,
                }}
              >
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                Tên vật tư, phụ tùng
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 55,
                }}
              >
                ĐVT
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 80,
                }}
              >
                Thay thế
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 70,
                }}
              >
                Thu hồi
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 70,
                }}
              >
                % còn lại
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 130,
                }}
              >
                Biện pháp xử lý
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 80,
                }}
              >
                Ghi chú
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.length === 0 ? (
              <TableRow>
                <TableCell
                  sx={{ fontSize: "0.72rem", textAlign: "center" }}
                  colSpan={8}
                >
                  Không có vật tư phụ tùng
                </TableCell>
              </TableRow>
            ) : (
              materials.map((vt, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: "0.72rem", textAlign: "center" }}>
                    {idx + 1}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem" }}>
                    {vt.tenVatTu || ""}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", textAlign: "center" }}>
                    {vt.donViTinh || ""}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", textAlign: "center" }}>
                    {vt.soLuongThayThe != null
                      ? String(vt.soLuongThayThe)
                      : "—"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", textAlign: "center" }}>
                    {vt.soLuongThuHoi != null ? String(vt.soLuongThuHoi) : "—"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", textAlign: "center" }}>
                    {vt.phanTramConLai != null ? `${vt.phanTramConLai}%` : "—"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem" }}>
                    {vt.bienPhapXuLy || ""}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem" }}>
                    {vt.ghiChu || ""}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Kết luận */}
      <Typography variant="caption" display="block" sx={{ mb: 2 }}>
        <b>Kết luận:</b>{" "}
        {row.ketLuan || "Đảm bảo yêu cầu kỹ thuật đưa vào sử dụng"}
      </Typography>

      {/* Chữ ký */}
      {signers.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            gap: 1,
            mt: 2,
          }}
        >
          {signers.map((signer: any, idx: number) => (
            <Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                variant="caption"
                fontWeight={700}
                display="block"
                sx={{ textTransform: "uppercase", fontSize: "0.75rem" }}
              >
                {signer.title ||
                  signer.donVi ||
                  signer.departmentName ||
                  "Ký tên"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ fontStyle: "italic", mb: 4, fontSize: "0.7rem" }}
              >
                (Ký, ghi rõ họ tên)
              </Typography>
              <Typography
                variant="caption"
                fontWeight={600}
                display="block"
                sx={{ fontSize: "0.72rem" }}
              >
                {signer.name || signer.hoTen || ""}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AcceptanceVehiclePreview;
