import { Box, Chip, Typography } from "@mui/material";
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

export const showDownloadFile = (fileName: string, onDownload: () => void) => {
  return (
    <Box
      component="span"
      onClick={(e) => {
        e.stopPropagation();
        onDownload();
      }}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        color: "#1976d2", // Màu xanh link truyền thống
        "&:hover": {
          textDecoration: "underline",
          color: "#115293",
        },
        transition: "all 0.2s",
        gap: 0.5,
      }}
    >
      <Typography
        variant="body2"
        component="span"
        sx={{
          fontSize: "13px",
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "250px", // Giới hạn độ dài để không vỡ layout
        }}
      >
        {fileName || "Tài liệu đính kèm"}
      </Typography>
      <FileDownloadOutlined sx={{ fontSize: "16px" }} />
    </Box>
  );
};

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AssetType } from "../types";
import { FileDownloadOutlined } from "@mui/icons-material";
import { findById } from "../../../utils/helpers";

interface Attachment {
  id: string;
  tenFile: string;
  loaiFile: string; // 'image/png', 'application/pdf', ...
  url?: string; // đường dẫn (có thể dùng để tải nội dung nếu cần nhúng)
  data?: string | ArrayBuffer; // nếu có sẵn dữ liệu base64 (tuỳ chọn)
}

export const generateAssetPdf = async (
  asset: AssetType,
  allAssetModel: any[],
  allCurrentStatus: any[],
  assetGroups: any[],
  allDepartments: any[],
  allUnits: any[],
  allReasonIncreases: any[],
): Promise<Uint8Array> => {
  const doc = new jsPDF();
  doc.setFont("times_new_roman", "normal");
  doc.setFontSize(16);
  doc.text("THÔNG TIN TÀI SẢN", 105, 15, { align: "center" });

  // --- Phần thông tin chính (giữ nguyên) ---
  const pairs: [string, any][] = [
    ["Số thẻ tài sản", asset.soThe],
    ["Nguyên giá", formatCurrency(asset.nguyenGia)],
    ["Giá trị khấu hao ban đầu", formatCurrency(asset.giaTriKhauHaoBanDau)],
    ["Kỳ khấu hao ban đầu", asset.kyKhauHaoBanDau],
    ["Giá trị thanh lý", formatCurrency(asset.giaTriThanhLy)],
    ["Mô hình tài sản", asset.tenMoHinh || asset.idMoHinhTaiSan],
    [
      "Phương pháp khấu hao",
      asset.phuongPhapKhauHao === 1 ? "Đường thẳng" : "Khác",
    ],
    ["Số kỳ khấu hao", asset.soKyKhauHao],
    ["Tài khoản tài sản", asset.taiKhoanTaiSan],
    ["Tài khoản khấu hao", asset.taiKhoanKhauHao],
    ["Tài khoản chi phí", asset.taiKhoanChiPhi],
    ["Nhóm tài sản", asset.tenNhom || asset.idNhomTaiSan],
    ["Loại tài sản", asset.tenLoaiTaiSanCon || asset.idLoaiTaiSanCon],
    [
      "Ngày vào sổ",
      asset.ngayVaoSo
        ? dayjs(asset.ngayVaoSo).format("DD/MM/YYYY HH:mm:ss")
        : "",
    ],
    [
      "Ngày sử dụng",
      asset.ngaySuDung
        ? dayjs(asset.ngaySuDung).format("DD/MM/YYYY HH:mm:ss")
        : "",
    ],
    ["Dự án", asset.tenDuAn || asset.idDuDan],
    ["Vốn NS", formatCurrency(asset.nvNS)],
    ["Vốn vay", formatCurrency(asset.vonVay)],
    ["Vốn khác", formatCurrency(asset.vonKhac)],
    ["Mã hiệu", asset.kyHieu],
    ["Số mã hiệu", asset.soKyHieu],
    ["Công suất", asset.congSuat],
    ["Nước sản xuất", asset.nuocSanXuat],
    ["Năm sản xuất", asset.namSanXuat],
    ["Lý do tăng", asset.lyDoTang],
    ["Hiện trạng", findById(allCurrentStatus, asset.hienTrang)?.tenHTKT],
    ["Số lượng", asset.soLuong],
    ["Đơn vị tính", asset.tenDonViTinh],
    ["Kho", asset.tenDonViBanDau || asset.idDonViBanDau],
    ["Đơn vị hiện thời", asset.tenDonViHienThoi || asset.idDonViHienThoi],
  ];

  // Nhóm thành dòng 2 cặp (4 cột)
  const rows: any[] = [];
  for (let i = 0; i < pairs.length; i += 2) {
    const pair1 = pairs[i];
    const pair2 = pairs[i + 1];
    rows.push([
      pair1[0],
      pair1[1],
      pair2 ? pair2[0] : "",
      pair2 ? pair2[1] : "",
    ]);
  }

  const tableBody: any[] = [
    [
      {
        content: `Tên tài sản: ${asset.tenTaiSan}`,
        colSpan: 4,
        styles: { fontSize: 12, fontStyle: "bold" },
      },
    ],
    ...rows,
    [
      {
        content: `Ghi chú: ${asset.ghiChu || ""}`,
        colSpan: 4,
        styles: { fontSize: 11, fontStyle: "italic" },
      },
    ],
  ];

  autoTable(doc, {
    startY: 25,
    body: tableBody,
    theme: "plain",
    styles: { font: "times_new_roman", fontSize: 11, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 45 },
      1: { cellWidth: 60 },
      2: { fontStyle: "bold", cellWidth: 45 },
      3: { cellWidth: 60 },
    },
    margin: { left: 15, right: 15 },
  });

  let y = (doc as any).lastAutoTable.finalY + 10;

  // --- Phần tài sản con (liệt kê dạng văn bản, không kẻ bảng) ---
  if (asset.taiSanConList && asset.taiSanConList.length > 0) {
    const conList = asset.taiSanConList.filter((con: any) => !con.isDeleted);
    if (conList.length > 0) {
      doc.setFont("times_new_roman", "bold");
      doc.setFontSize(12);
      doc.text("Danh sách tài sản con:", 20, y);
      y += 6;
      doc.setFontSize(10);

      conList.forEach((con: any, idx: number) => {
        // Chuẩn bị nội dung: số thứ tự + mã tài sản + tên tài sản
        const line = `${idx + 1}. ${con.idTaiSanCon || ""} - ${con.tenTaiSan || "N/A"}`;
        // Tự động xuống dòng nếu nội dung quá dài
        const lines = doc.splitTextToSize(line, 170); // chiều rộng vùng in (A4 trừ lề)
        doc.text(lines, 25, y);
        y += lines.length * 5; // mỗi dòng cao 5mm (có thể điều chỉnh)
      });

      y += 5; // khoảng cách sau danh sách
    }
  }

  // --- Phần danh sách tệp đính kèm (chỉ tên) ---
  if (asset.fileDinhKemList && asset.fileDinhKemList.length > 0) {
    doc.setFontSize(12);
    doc.text("Danh sách tệp đính kèm:", 20, y);
    y += 6;
    asset.fileDinhKemList
      .filter((file: any) => !file.isDeleted)
      .forEach((att, idx) => {
        doc.setFontSize(10);
        doc.text(`${idx + 1}. ${att.tenFile}`, 25, y);
        y += 5;
      });
  }

  // Không cần thêm trang nhúng nội dung nữa vì yêu cầu chỉ hiển thị tên
  return new Uint8Array(doc.output("arraybuffer"));
};

// Hàm định dạng tiền tệ (VNĐ)
const formatCurrency = (value: number | undefined | null): string => {
  if (value == null) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
