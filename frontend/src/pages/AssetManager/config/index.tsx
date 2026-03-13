import { Chip } from "@mui/material";
import dayjs from "dayjs";

export const ShowStatus = (data: any) => {
  const soNgayBaoTruoc = data.soNgayBaoTruoc || 20;

  // 1. Ngày đầu tháng kiểm định (01/03/2026)
  const ngayKiemDinh = dayjs(data.tgKiemDinh, "MM/YYYY").startOf("month");

  // 2. Tháng hết hạn (01/03 + 3 tháng = 01/06/2026)
  const thangHetHan = ngayKiemDinh.add(data.chuKyKiemDinh ?? 0, "month");

  // 3. Ngày cuối cùng của tháng hết hạn (30/06/2026)
  const ngayHetHanCuoiCung = thangHetHan.endOf("month");

  // 4. Ngày bắt đầu thông báo (30/06 - 15 ngày = 15/06/2026)
  const ngayBatDauBao = ngayHetHanCuoiCung.subtract(soNgayBaoTruoc, "day");

  const now = dayjs();

  // Mặc định là Đã đăng kiểm
  let label = "Đã đăng kiểm";
  let color = "#4caf50";

  // LOGIC QUAN TRỌNG: Chỉ báo khi:
  // (Ngày hiện tại >= Ngày bắt đầu báo) VÀ (Ngày hiện tại <= Ngày cuối cùng của tháng hết hạn)
  const isTrongHanThongBao =
    now.isAfter(ngayBatDauBao) && now.isBefore(ngayHetHanCuoiCung);

  if (isTrongHanThongBao) {
    label = "Sắp hết hạn đăng kiểm";
    color = "#f44336";
  }

  return (
    <Chip
      label={label}
      sx={{
        backgroundColor: color,
        color: "white",
        fontWeight: 600,
        fontSize: "12px",
        borderRadius: "4px",
        height: "24px",
      }}
    />
  );
};
