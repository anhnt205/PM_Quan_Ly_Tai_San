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
import dayjs from "dayjs";
import { BienPhapMayMocData } from "../../types";
import { currentBrandConfig } from "../../../../config/brandConfig";

interface Props {
  row: BienPhapMayMocData & { nguoiKyList?: any[] };
  tieude?: string;
  congty?: string;
}

const MeasureMachinPreview = ({ row, tieude, congty }: Props) => {
  if (!row) return null;

  const d = row.ngayTao ? new Date(row.ngayTao) : new Date();
  const signers = row.nguoiKyList ?? [];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const parsed = dayjs(dateStr);
      if (!parsed.isValid()) return dateStr;
      return parsed.format("DD/MM/YYYY");
    } catch {
      return dateStr;
    }
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
        sx={{ mb: 2, textTransform: "uppercase" }}
        display="block"
      >
        {tieude || ".............................................................."}
      </Typography>

      <Box sx={{ pb: 2 }} />

      {/* Bảng biện pháp máy móc */}
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
                  width: 100,
                }}
              >
                Số Lệnh/BP
                <br />
                sửa chữa
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 100,
                }}
              >
                Số đề nghị
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 100,
                }}
              >
                Đơn vị
                <br />
                SC
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 100,
                }}
              >
                Đơn vị
                <br />
                phối hợp
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 100,
                }}
              >
                Hình
                <br />
                thức
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 100,
                }}
              >
                Thời gian
                <br />
                bắt đầu
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 100,
                }}
              >
                Thời gian
                <br />
                kết thúc
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                  width: 100,
                }}
              >
                Thời gian
                <br />
                (ngày)
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  textAlign: "center",
                }}
              >
                Ghi chú
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: "0.72rem",
                  color: "#b40000",
                  textAlign: "center",
                }}
              >
                {row.soPhieu || "—"}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.72rem",
                  color: "#b40000",
                  textAlign: "center",
                }}
              >
                {row.soDeNghi || "—"}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.72rem",
                  color: "#b40000",
                  textAlign: "center",
                }}
              >
                {row.donViSuaChua || "—"}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.72rem",
                  color: "#b40000",
                  textAlign: "center",
                }}
              >
                {row.donViPhoiHop || "—"}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.72rem",
                  color: "#b40000",
                  textAlign: "center",
                }}
              >
                {row.hinhThuc || "—"}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.72rem",
                  color: "#b40000",
                  textAlign: "center",
                }}
              >
                {formatDate(row.thoiGianBatDau)}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.72rem",
                  color: "#b40000",
                  textAlign: "center",
                }}
              >
                {formatDate(row.thoiGianKetThuc)}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.72rem",
                  color: "#b40000",
                  textAlign: "center",
                }}
              >
                {row.thoiGianNgay != null ? String(row.thoiGianNgay) : "—"}
              </TableCell>
              <TableCell sx={{ fontSize: "0.72rem", color: "#b40000" }}>
                {row.ghiChu || "—"}
              </TableCell>
            </TableRow>
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
    </Box>
  );
};

export default MeasureMachinPreview;
