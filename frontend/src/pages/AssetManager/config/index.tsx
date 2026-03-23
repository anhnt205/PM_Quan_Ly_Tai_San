import { Box, Chip, Typography } from "@mui/material";
import dayjs from "dayjs";
import "../../../assets/fonts/times_new_roman-normal";

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
import {
  AssetHoursGroupYearType,
  AssetType,
  MaintenanceIncidentType,
  TransferHistoryData,
} from "../types";
import { FileDownloadOutlined } from "@mui/icons-material";
import { findById } from "../../../utils/helpers";
import { PDFDocument } from "pdf-lib";

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
      "Ngày vào sổ:",
      asset.ngayVaoSo ? dayjs(asset.ngayVaoSo).format("DD/MM/YYYY") : "",
    ],
    [
      "Ngày sử dụng:",
      asset.ngaySuDung ? dayjs(asset.ngaySuDung).format("DD/MM/YYYY") : "",
    ],
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

export const generateMonthlyActivityReport = async (
  data: AssetHoursGroupYearType[],
): Promise<Uint8Array> => {
  const reportData =
    data && data.length > 0 ? data : [{} as AssetHoursGroupYearType];
  const sortedData = [...reportData].sort(
    (a, b) => (a.nam || 0) - (b.nam || 0),
  );
  const doc = new jsPDF();
  let currentPage = 0;
  const totalPages = sortedData.length;

  for (let index = 0; index < sortedData.length; index++) {
    const yearData = sortedData[index];
    const year = yearData.nam || new Date().getFullYear();
    const yearItems = yearData.data || [];

    if (index > 0) {
      doc.addPage();
    }
    // Set font và tiêu đề
    doc.setFont("times_new_roman", "normal");
    doc.setFontSize(16);
    doc.text(`GIỜ (KM) HOẠT ĐỘNG CỦA THIẾT BỊ TRONG NĂM ${year}`, 105, 15, {
      align: "center",
    });

    // Chuẩn bị dữ liệu cho bảng (tạo đủ 12 tháng)
    const tableData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthData = yearItems.find((item) => item.thang === month);

      return [
        `${month}`,
        monthData?.gioHoatDong || "",
        monthData?.gioSauSCL || "",
        monthData?.gioSauBcc || "",
        monthData?.ngaySCT_Vao || "",
        monthData?.ngaySCT_Ra || "",
        monthData?.ngayBcc_Vao || "",
        monthData?.ngayBcc_Ra || "",
        monthData?.soLanBaoDuongCapI || "",
        monthData?.soLanBaoDuongCapII || "",
        monthData?.ghiChu || "",
      ];
    });
    let totalGioKm = 0;

    yearItems?.forEach((item) => {
      if (item.gioHoatDong && typeof item.gioHoatDong === "number") {
        totalGioKm += item.gioHoatDong;
      }
    });

    // Thêm hàng tổng cộng vào cuối bảng
    tableData.push([
      "CỘNG",
      totalGioKm > 0 ? totalGioKm.toString() : "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    // Tạo bảng với autoTable
    autoTable(doc, {
      startY: 30,
      head: [
        [
          { content: "Tháng", rowSpan: 2 }, // Chiếm 2 hàng
          { content: "Giờ (km)", colSpan: 3, rowSpan: 1 }, // Chiếm 2 hàng
          { content: "Ngày SCT", colSpan: 2, rowSpan: 1 }, // Gộp 2 cột, chỉ 1 hàng
          { content: "Ngày BCC", colSpan: 2, rowSpan: 1 }, // Gộp 2 cột, chỉ 1 hàng
          { content: "Số lần Báo đường", colSpan: 2, rowSpan: 1 }, // Gộp 2 cột, chỉ 1 hàng
          { content: "Ghi chú", rowSpan: 2 }, // Chiếm 2 hàng
        ],
        // Hàng header thứ hai (tầng 2)
        [
          "Hoạt động",
          "Sau SCL",
          "Sau Bcc",
          "Vào", // Dưới Ngày SCT
          "Ra", // Dưới Ngày SCT
          "Vào", // Dưới Ngày BCC
          "Ra", // Dưới Ngày BCC
          "Cấp I", // Dưới Số lần Báo đường
          "Cấp II", // Dưới Số lần Báo đường
        ],
      ],
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        valign: "middle",
        halign: "center",
        fontSize: 10,
      },
      body: tableData,
      bodyStyles: {
        fontSize: 9,
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 16, halign: "center" }, // Tháng
        1: { cellWidth: 16, halign: "center" }, // Giờ (km)
        2: { cellWidth: 16, halign: "center" }, // Ngày SCT Vào
        3: { cellWidth: 16, halign: "center" }, // Ngày SCT Ra
        4: { cellWidth: 16, halign: "center" }, // Ngày BCC Vào
        5: { cellWidth: 16, halign: "center" }, // Ngày BCC Ra
        6: { cellWidth: 16, halign: "center" }, // Cấp I
        7: { cellWidth: 16, halign: "center" }, // Cấp II
        8: { cellWidth: 16, halign: "center" }, // Ghi chú
        9: { cellWidth: 16, halign: "center" }, // Ghi chú
        10: { cellWidth: 16, halign: "center" }, // Ghi chú
        11: { cellWidth: 16, halign: "center" }, // Ghi chú
      },
      margin: { left: 20, right: 20 },
      theme: "grid",
      styles: {
        font: "times_new_roman",
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      didDrawCell: (data) => {
        // Vẽ border cho các cột gộp
        if (data.section === "head") {
          const { doc, cursor, settings } = data;
          const { x, y, width, height } = data.cell;

          // Vẽ đường phân cách giữa các nhóm cột gộp
          if (data.column.index === 2) {
            doc.setDrawColor(0);
            doc.line(x, y, x, y + height);
          }
          if (data.column.index === 4) {
            doc.setDrawColor(0);
            doc.line(x, y, x, y + height);
          }
          if (data.column.index === 6) {
            doc.setDrawColor(0);
            doc.line(x, y, x, y + height);
          }
        }
      },
    });
  }
  return new Uint8Array(doc.output("arraybuffer"));
};

export const generateTransferHistoryPDF = async (
  data: TransferHistoryData[],
): Promise<Uint8Array> => {
  const doc = new jsPDF();

  // Set font
  doc.setFont("times_new_roman", "normal");

  // Tiêu đề chính
  doc.setFontSize(18);
  doc.text("ĐIỀU CHUYỂN TÀI SẢN", 105, 20, { align: "center" });
  console.log("data", data);

  // Chuẩn bị dữ liệu cho bảng
  const tableData = data.map((item, index) => {
    return [
      item.thoiGianBanGiao
        ? dayjs(item.thoiGianBanGiao).format("DD/MM/YYYY")
        : "-",
      item.tenDonViNhan || item.idDonViNhan || "",
      "",
    ];
  });

  // Tạo bảng
  autoTable(doc, {
    startY: 30,
    head: [
      [
        { content: "Ngày tháng", styles: { halign: "center" } },
        { content: "Đơn vị quản lý", styles: { halign: "center" } },
        { content: "Ghi Chú", styles: { halign: "center" } },
      ],
    ],
    body: tableData,
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center",
      fontSize: 10,
      valign: "middle",
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 4,
      halign: "center",
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 25, halign: "center" },
      1: { cellWidth: 50, halign: "center" },
    },
    margin: { left: 20, right: 20 },
    theme: "grid",
    styles: {
      font: "times_new_roman",
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    didParseCell: (data: any) => {
      // Căn trái cho cột đơn vị quản lý
      if (data.section === "body" && data.column.index === 2) {
        data.cell.styles.halign = "left";
      }
    },
  });

  return new Uint8Array(doc.output("arraybuffer"));
};

export const generateAssetManentancePDF = async (
  data: MaintenanceIncidentType[],
): Promise<Uint8Array> => {
  const doc = new jsPDF();

  // Set font
  doc.setFont("times_new_roman", "bold");

  // Tiêu đề chính
  doc.setFontSize(18);
  doc.text("DIỄN BIẾN KỸ THUẬT VÀ TAI NẠN, SỰ CỐ PHẢI SỬA CHỮA", 105, 20, {
    align: "center",
  });

  // Chuẩn bị dữ liệu cho bảng
  const tableData = data.map((item, index) => {
    return [
      item.tuNgay ? dayjs(item.tuNgay).format("DD/MM/YYYY") : "-",
      item.denNgay ? dayjs(item.denNgay).format("DD/MM/YYYY") : "-",
      item.loaiSuCo || "",
      item.noiSuaChua || "",
    ];
  });

  // Tạo bảng
  autoTable(doc, {
    startY: 30,
    head: [
      [
        { content: "Từ ngày", styles: { halign: "center" } },
        { content: "Đến ngày", styles: { halign: "center" } },
        {
          content: "Loại sự cố, tai nạn, nội dung hư hỏng",
        },
        {
          content: "Nơi sửa chữa",
        },
      ],
    ],
    body: tableData,
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center",
      fontSize: 10,
      valign: "middle",
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 4,
      halign: "center",
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 25, halign: "center" },
      1: { cellWidth: 50, halign: "center" },
    },
    margin: { left: 20, right: 20 },
    theme: "grid",
    styles: {
      font: "times_new_roman",
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    didParseCell: (data: any) => {
      // Căn trái cho cột đơn vị quản lý
      if (data.section === "body" && data.column.index === 2) {
        data.cell.styles.halign = "left";
      }
    },
  });

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

export const mergePdf = async (
  pdfBytesList: Uint8Array[],
  outputFileName: string = "merged_document.pdf",
): Promise<Uint8Array | null> => {
  // Kiểm tra đầu vào
  if (!pdfBytesList || pdfBytesList.length === 0) {
    console.error("Không có file PDF nào để merge");
    return null;
  }

  try {
    // Tạo document PDF mới
    const mergedPdf = await PDFDocument.create();

    // Duyệt qua từng file PDF trong danh sách
    for (const pdfBytes of pdfBytesList) {
      // Load từng PDF từ Uint8Array
      const pdf = await PDFDocument.load(pdfBytes);

      // Copy tất cả các trang từ PDF nguồn sang PDF đích
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      // Thêm từng trang đã copy vào PDF đã merge
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Xuất file PDF đã merge
    const finalPdfBytes = await mergedPdf.save();

    return finalPdfBytes;
  } catch (error) {
    console.error("Lỗi khi merge PDF:", error);
    return null;
  }
};
