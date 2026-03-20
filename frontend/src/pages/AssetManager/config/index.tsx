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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AssetType } from "../types";

interface Attachment {
  id: string;
  tenFile: string;
  loaiFile: string; // 'image/png', 'application/pdf', ...
  url?: string; // đường dẫn (có thể dùng để tải nội dung nếu cần nhúng)
  data?: string | ArrayBuffer; // nếu có sẵn dữ liệu base64 (tuỳ chọn)
}

export const generateAssetPdf = async (
  asset: AssetType,
  attachments: Attachment[] = [],
): Promise<Uint8Array> => {
  const doc = new jsPDF();
  doc.setFont("times_new_roman", "normal");
  doc.setFontSize(16);
  doc.text("THÔNG TIN TÀI SẢN", 105, 15, { align: "center" });

  // Danh sách các cặp key-value (loại bỏ Tên tài sản và Ghi chú)
  const pairs: [string, any][] = [
    ["Nguyên giá", formatCurrency(asset.nguyenGia)],
    ["Giá trị khấu hao ban đầu", formatCurrency(asset.giaTriKhauHaoBanDau)],
    ["Kỳ khấu hao ban đầu", asset.kyKhauHaoBanDau],
    ["Giá trị thanh lý", formatCurrency(asset.giaTriThanhLy)],
    ["Mô hình tài sản", asset.tenMoHinh],
    ["Phương pháp khấu hao", asset.phuongPhapKhauHao],
    ["Số kỹ khấu hao", asset.soKyKhauHao],
    ["Tài khoản tài sản", asset.taiKhoanTaiSan],
    ["Tài khoản khấu hao", asset.taiKhoanKhauHao],
    ["Tài khoản chi phí", asset.taiKhoanChiPhi],
    ["Nhóm tài sản", asset.tenNhom],
    ["Dự án", asset.tenDuAn],
    ["Vốn NS", formatCurrency(asset.nvNS)],
    ["Vốn vay", formatCurrency(asset.vonVay)],
    ["Vốn khác", formatCurrency(asset.vonKhac)],
    ["Ký hiệu", asset.kyHieu],
    ["Số ký hiệu", asset.soKyHieu],
    ["Công suất", asset.congSuat],
    ["Nước sản xuất", asset.nuocSanXuat],
    ["Năm sản xuất", asset.namSanXuat],
    ["Lý do tăng", asset.lyDoTang],
    ["Hiện trạng", asset.hienTrang],
    ["Số lượng", asset.soLuong],
    ["Đơn vị tính", asset.donViTinh],
  ];

  // Nhóm các cặp thành từng bộ 2 để tạo dòng 4 cột
  const rows: any[] = [];
  for (let i = 0; i < pairs.length; i += 2) {
    const pair1 = pairs[i];
    const pair2 = pairs[i + 1]; // có thể undefined nếu lẻ
    const row = [
      pair1[0],
      pair1[1],
      pair2 ? pair2[0] : "", // nếu không có cặp thứ hai, để ô trống
      pair2 ? pair2[1] : "",
    ];
    rows.push(row);
  }

  // Xây dựng body của bảng
  const tableBody: any[] = [
    // Dòng đầu: Tên tài sản (gộp 4 cột)
    [
      {
        content: `Tên tài sản: ${asset.tenTaiSan}`,
        colSpan: 4,
        styles: { fontSize: 12, fontStyle: "bold", cellPadding: 2 },
      },
    ],
    // Các dòng dữ liệu (mỗi dòng 4 cột)
    ...rows,
    // Dòng cuối: Ghi chú (gộp 4 cột)
    [
      {
        content: `Ghi chú: ${asset.ghiChu || ""}`,
        colSpan: 4,
        styles: { fontSize: 11, fontStyle: "italic" },
      },
    ],
  ];

  // Vẽ bảng chính với 4 cột
  autoTable(doc, {
    startY: 25,
    body: tableBody,
    theme: "plain",
    styles: {
      font: "times_new_roman",
      fontSize: 11,
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 45 }, // label 1
      1: { cellWidth: 60 }, // value 1
      2: { fontStyle: "bold", cellWidth: 45 }, // label 2
      3: { cellWidth: 60 }, // value 2
    },
    margin: { left: 15, right: 15 }, // thu hẹp margin để vừa 4 cột
    didDrawPage: (data) => {},
  });

  let y = (doc as any).lastAutoTable.finalY + 10;

  // Xử lý tệp đính kèm (giữ nguyên)
  if (attachments.length > 0) {
    doc.setFontSize(12);
    doc.text("Danh sách tệp đính kèm:", 20, y);
    y += 6;
    attachments.forEach((att, index) => {
      doc.text(`- ${att.tenFile} (${att.loaiFile})`, 25, y);
      y += 5;
    });
  }

  // Trang cho từng tệp đính kèm (giữ nguyên)
  for (let i = 0; i < attachments.length; i++) {
    const att = attachments[i];
    doc.addPage();

    doc.setFontSize(14);
    doc.text(`Tệp đính kèm: ${att.tenFile}`, 20, 20);

    if (att.loaiFile.startsWith("image/") && att.data) {
      try {
        doc.addImage(att.data as string, "JPEG", 20, 30, 170, 0);
      } catch (e) {
        doc.text("Không thể hiển thị ảnh.", 20, 30);
      }
    } else if (att.loaiFile === "application/pdf" && att.data) {
      doc.text("Tệp PDF không thể hiển thị trực tiếp trong PDF này.", 20, 30);
      doc.text("Vui lòng mở tệp đính kèm riêng.", 20, 36);
    } else {
      doc.text("Không có dữ liệu xem trước.", 20, 30);
    }

    doc.setFontSize(10);
    doc.text(`Loại tệp: ${att.loaiFile}`, 20, 50);
  }

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
