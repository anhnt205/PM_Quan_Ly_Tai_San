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
import { BienPhapPhuongTienData } from "../../types";

interface Props {
  row: BienPhapPhuongTienData & { nguoiKyList?: any[] };
  tieude?: string;
  congty?: string;
}

const MeasureVehiclePreview = ({ row, tieude, congty }: Props) => {
  if (!row) return null;

  const d = row.ngayTao ? new Date(row.ngayTao) : new Date();
  const signers = row.nguoiKyList ?? [];
  const materials = row.danhSachChiTiet ?? [];

  const renderBulletList = (text: string) => {
    if (!text) return null;
    const items = text
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean);
    return items.map((itemText, idx) => (
      <Typography
        key={idx}
        variant="caption"
        display="block"
        sx={{ mb: 0.5, pl: 2 }}
      >
        {itemText.startsWith("-") ? itemText : `- ${itemText}`}
      </Typography>
    ));
  };

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
            sx={{ textTransform: "uppercase", textDecoration: "underline" }}
          >
            CÔNG TY {congty || "................."}
          </Typography>
          <Typography variant="caption" display="block">
            Số: {(row as any)?.soBienBan || "401"} /BP- CV
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

      {/* Địa danh ngày tháng */}
      <Typography
        variant="caption"
        display="block"
        sx={{ textAlign: "right", fontStyle: "italic", mb: 2 }}
      >
        Quảng Ninh, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
        {d.getFullYear()}
      </Typography>

      {/* Tiêu đề */}
      <Typography
        variant="subtitle2"
        align="center"
        fontWeight={700}
        sx={{ mb: 1, textTransform: "uppercase" }}
        display="block"
      >
        {tieude ||
          ".............................................................."}
      </Typography>
      <Typography
        variant="caption"
        align="center"
        sx={{ mb: 1, fontStyle: "italic" }}
        display="block"
      >
        V/v sửa chữa thiết bị ô tô xe máy - {row.tenTaiSan || "……………………………………"}
      </Typography>
      <Typography
        variant="caption"
        align="center"
        sx={{ mb: 3, fontStyle: "italic" }}
        display="block"
      >
        Phân xưởng {row.donViQuanLy || "……………………………………"} quản lý
      </Typography>

      {/* I. MỤC ĐÍCH VÀ YÊU CẦU */}
      <Typography
        variant="caption"
        display="block"
        fontWeight={700}
        sx={{ mb: 0.5 }}
      >
        I. MỤC ĐÍCH VÀ YÊU CẦU
      </Typography>
      <Typography
        variant="caption"
        display="block"
        fontWeight={700}
        sx={{ mb: 0.5 }}
      >
        1. Mục đích:
      </Typography>
      {renderBulletList(row.mucDich || "..........")}

      <Typography
        variant="caption"
        display="block"
        fontWeight={700}
        sx={{ mb: 0.5 }}
      >
        2. Yêu cầu:
      </Typography>
      {renderBulletList(row.yeuCau || "..........")}

      {/* II. TÌNH TRẠNG HIỆN TẠI */}
      <Typography
        variant="caption"
        display="block"
        fontWeight={700}
        sx={{ mt: 1.5, mb: 0.5 }}
      >
        II. TÌNH TRẠNG HIỆN TẠI
      </Typography>
      {renderBulletList(row.tinhTrangHienTai || "..........")}

      {/* III. BIỆN PHÁP SỬA CHỮA */}
      <Typography
        variant="caption"
        display="block"
        fontWeight={700}
        sx={{ mt: 1.5, mb: 0.5 }}
      >
        III. BIỆN PHÁP SỬA CHỮA
      </Typography>

      <Typography
        variant="caption"
        display="block"
        fontWeight={700}
        sx={{ mb: 0.5 }}
      >
        1. Nội dung thực hiện:
      </Typography>
      {renderBulletList(row.noiDungThucHien || "..........")}

      <Typography
        variant="caption"
        display="block"
        fontWeight={700}
        sx={{ mt: 1, mb: 0.5 }}
      >
        2. Chi phí vật tư:
      </Typography>

      {/* Bảng chi phí vật tư */}
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
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                }}
              >
                Tên vật tư, thiết bị
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 50,
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
                Số lượng cấp
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
                  colSpan={6}
                >
                  Không có vật tư thiết bị thay thế
                </TableCell>
              </TableRow>
            ) : (
              materials.map((vt: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: "0.72rem", textAlign: "center" }}>
                    {idx + 1}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem" }}>
                    {vt.tenVatTu || vt.idChiTietVatTu || ""}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", textAlign: "center" }}>
                    {vt.donViTinh || ""}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", textAlign: "center" }}>
                    {vt.soLuongCap != null
                      ? String(vt.soLuongCap)
                      : vt.soLuong != null
                        ? String(vt.soLuong)
                        : "—"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", textAlign: "center" }}>
                    {vt.soLuongThuHoi != null ? String(vt.soLuongThuHoi) : "—"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.72rem", textAlign: "center" }}>
                    {vt.ghiChu || ""}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mb: 2 }} />

      {/* Chữ ký */}
      <Box sx={{ display: "flex", justifyContent: "space-around", gap: 1 }}>
        {signers.map((signer: any, idx: number) => (
          <Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              variant="caption"
              fontWeight={700}
              display="block"
              sx={{
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
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
    </Box>
  );
};

export default MeasureVehiclePreview;
