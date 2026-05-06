import jsPDF from "jspdf";
import { findById, formatted, loadImage } from "../../../utils/helpers";
import { MaintenancePlanData } from "../../MainenancePlanRepair/types";
import autoTable from "jspdf-autotable";
import "../../../assets/fonts/times_new_roman-normal";
import "../../../assets/fonts/times_new_roman-bold";
import "../../../assets/fonts/times_new_roman_italic-italic";
import { Chip } from "@mui/material";

import { IncidenData } from "../types";

const getChucVu = (idUser: string, staffs: any[], positions: any[]) => {
  const nhanVien = findById(staffs, idUser);
  const chucVu = findById(positions, nhanVien?.chucVuId ?? "");
  return chucVu?.tenChucVu ?? "";
};
const getDonVi = (idUser: string, staffs: any[], departments: any[]) => {
  const nhanVien = findById(staffs, idUser);
  const donVi = findById(departments, nhanVien?.phongBanId ?? "");
  return donVi?.tenPhongBan ?? "";
};

export const listSigneInfo = (
  item?: any,
  staffs: any[] = [],
  departments: any[] = [],
  positions: any[] = [],
) => {
  if (!item) return [];

  const result: any[] = [];

  if (item.idNguoiLapBieu) {
    result.push({
      idNhanVien: item.idNguoiLapBieu ?? "",
      title: "Người lập",
      hoTen: item.tenNguoiLapBieu ?? "",
      chucVu: getChucVu(item.idNguoiLapBieu ?? "", staffs, positions),
      donVi: getDonVi(item.idNguoiLapBieu ?? "", staffs, departments),
      signed: item.nguoiLapBieuXacNhan || false,
    });
  }

  // ===== NGƯỜI KÝ BỔ SUNG =====
  if (item.nguoiKyList?.length) {
    for (let i = 0; i < item.nguoiKyList.length; i++) {
      const sign = item.nguoiKyList[i];
      result.push({
        idNhanVien: sign.idNguoiKy ?? "",
        hoTen: sign.tenNguoiKy ?? "",
        chucVu: getChucVu(sign.idNguoiKy ?? "", staffs, positions),
        donVi: getDonVi(sign.idNguoiKy ?? "", staffs, departments),
        signed: sign.trangThai === 0 ? false : true,
      });
    }
  }

  // ===== GIÁM ĐỐC =====
  if (item.idTrinhDuyetGiamDoc) {
    result.push({
      idNhanVien: item.idTrinhDuyetGiamDoc ?? "",
      title: getChucVu(item.idTrinhDuyetGiamDoc ?? "", staffs, positions),
      hoTen: item.tenTrinhDuyetGiamDoc ?? "",
      chucVu: getChucVu(item.idTrinhDuyetGiamDoc ?? "", staffs, positions),
      donVi: getDonVi(item.idTrinhDuyetGiamDoc ?? "", staffs, departments),
      signed: item.trinhDuyetGiamDocXacNhan || false,
    });
  }

  return result;
};

export const ShowPermissionSigning = (status: number) => {
  // Định nghĩa cấu hình cho từng trạng thái
  const getStatusConfig = (status: number) => {
    switch (status) {
      case 1:
        return { label: "Chưa đến lượt ký", color: "#f44336" }; // Red
      case 2:
        return { label: "Không được phép ký", color: "#ffab40" }; // OrangeAccent
      case 3:
        return { label: "Đã ký", color: "#2196f3" }; // Blue
      case 4:
        return { label: "Đã ký & tạo", color: "#9c27b0" }; // Purple
      case 5:
        return { label: "Cần ký & tạo", color: "#ff9800" }; // Orange
      default:
        return { label: "Cần ký", color: "#4caf50" }; // Green
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      sx={{
        backgroundColor: config.color,
        color: "white",
        fontWeight: 500,
        fontSize: "12px",
        borderRadius: "4px", // Bo góc theo mẫu Flutter (4)
        height: "24px", // Tương đương với padding vertical của bạn
        "& .MuiChip-label": {
          paddingLeft: "5px",
          paddingRight: "5px",
        },
      }}
    />
  );
};
export const getPermissionSigning = (data: any, user?: any): number => {
  const signatureFlow = [
    {
      id: data.idNguoiLapBieu,
      signed: data.nguoiLapBieuXacNhan === true,
    },
    ...(data.nguoiKyList?.length
      ? data.nguoiKyList.map((e: any) => ({
          id: e.idNguoiKy,
          signed: e.trangThai === 1,
        }))
      : []),
    {
      id: data.idTrinhDuyetGiamDoc,
      signed: data.trinhDuyetGiamDocXacNhan === true,
    },
  ].filter((step) => step.id && step.id.trim() !== "");

  const currentIndex = signatureFlow.findIndex(
    (s) => s.id === user?.taiKhoan?.tenDangNhap,
  );

  if (currentIndex === -1) return 2;

  // Người đại diện đơn vị ban hành QĐ
  if (data.idDaiDiendonviBanHanhQD === user?.taiKhoan?.tenDangNhap) {
    return signatureFlow[currentIndex].signed ? 4 : 5;
  }

  if (signatureFlow[currentIndex].signed) return 3;

  const previousNotSigned = signatureFlow
    .slice(0, currentIndex)
    .find((s) => s.signed === false);

  if (previousNotSigned) return 1;

  return 0;
};

interface SignatureStep {
  id: string;
  signed: boolean;
}
const buildSignatureFlow = (item: any): SignatureStep[] => {
  if (!item) return [];

  const steps: (SignatureStep | null)[] = [
    {
      id: item.idNguoiLapBieu,
      signed: item.nguoiLapBieuXacNhan === true,
    },
    ...(Array.isArray(item.nguoiKyList)
      ? item.nguoiKyList.map((e: any) => ({
          id: e.idNguoiKy,
          signed: e.trangThai === 1,
        }))
      : []),

    {
      id: item.idTrinhDuyetGiamDoc,
      signed: item.trinhDuyetGiamDocXacNhan === true,
    },
  ];

  return steps.filter((s): s is SignatureStep => Boolean(s?.id));
};
export const canSign = (items: any[], user?: any): boolean => {
  if (!user || items.length !== 1) return false;

  const item = items[0];
  const signatureFlow = buildSignatureFlow(item);
  console.log("signatureFlow:", signatureFlow);

  const currentIndex = signatureFlow.findIndex(
    (s) => s.id === user?.taiKhoan?.tenDangNhap,
  );

  // Không có trong flow hoặc đã ký rồi
  if (currentIndex === -1 || signatureFlow[currentIndex].signed) {
    return false;
  }

  // Tất cả bước trước đó phải đã ký
  return signatureFlow.slice(0, currentIndex).every((s) => s.signed);
};
export const getAutoSignatureType = (employee: any): number => {
  if (!employee) return 0;
  if (employee.kySo) {
    if (employee.kyThuong) return 4;
    if (employee.kyNhay) return 5;
    return 3;
  } else {
    if (employee.kyThuong) return 2;
    if (employee.kyNhay) return 1;
    return 0;
  }
};

export const generateBienBanKeHoachPdf = async (
  plan: MaintenancePlanData,
  staffs: any[],
  departments: any[],
  positions: any[],
): Promise<{
  pdf: Uint8Array;
  coordinates: Record<string, { xRatio: number; yRatio: number }>;
}> => {
  const listSigneInfos: any[] = listSigneInfo(
    plan,
    staffs,
    departments,
    positions,
  );
  console.log("listSigneInfos:", listSigneInfos);
  const doc = new jsPDF("l", "mm", "a4");

  doc.setFont("times_new_roman", "bold");

  doc.setFontSize(12);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;

  doc.text(
    `KẾ HOẠCH SỬA CHỮA BẢO DƯỠNG THIẾT BỊ NĂM ${plan.nam ?? new Date().getFullYear()}`,
    centerX,
    20,
    {
      align: "center",
    },
  );
  doc.text(
    `PHÂN XƯỞNG: ${(plan.tenDonViGiao || ".......................................................").toUpperCase()}`,
    centerX,
    26,
    { align: "center" },
  );

  // ===== CĂN CỨ =====
  doc.setFont("times_new_roman", "normal");
  doc.setFontSize(11);

  const canCuText = `(Theo QĐ số ${plan?.soQuyetDinh ?? "........."} /QĐ - TUB ${formatted(plan?.ngayTao)})`;
  doc.text(canCuText, centerX, 32, { align: "center" });

  let y = 35;

  // Giả sử signatures là mảng đối tượng có { hoTen, chucVu, phongBan }

  // ===== TABLE =====
  const tableData = (plan?.danhSachTaiSan ?? []).map(
    (item: any, index: number) => [
      index + 1,
      item.idTaiSan ?? "",
      item.tenTaiSan ?? "",
      item.idNhomTaiSan ?? "",
      item.idLoaiTaiSan ?? "",
      item.soLuong,
      plan.idDonViGiao,
      plan.idDonViNhan,
      item.capSuaChuaThang1,
      item.capSuaChuaThang2,
      item.capSuaChuaThang3,
      item.capSuaChuaThang4,
      item.capSuaChuaThang5,
      item.capSuaChuaThang6,
      item.capSuaChuaThang7,
      item.capSuaChuaThang8,
      item.capSuaChuaThang9,
      item.capSuaChuaThang10,
      item.capSuaChuaThang11,
      item.capSuaChuaThang12,
    ],
  );

  autoTable(doc, {
    startY: y + 5,
    margin: { left: 20, right: 20 },
    head: [
      [
        "STT",
        "Mã TB",
        "Tên thiết bị",
        "Nhóm TB",
        "Loại TS",
        "SL",
        "Đơn vị QL",
        "Đơn vị bảo trì",
        "T1",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "T8",
        "T9",
        "T10",
        "T11",
        "T12",
      ],
    ],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: false,
      textColor: 0,
      lineWidth: 0.1,
      lineColor: 0,
      font: "times_new_roman",
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      font: "times_new_roman",
      fontSize: 10,
      textColor: 0,
      lineWidth: 0.1,
      lineColor: 0,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 15, halign: "center" },
      2: { halign: "center" }, // auto width for equipment name
      3: { cellWidth: 13, halign: "center" },
      4: { cellWidth: 13, halign: "center" },
      5: { cellWidth: 10, halign: "center" },
      6: { cellWidth: 15, halign: "center" },
      7: { cellWidth: 15, halign: "center" },
      8: { cellWidth: 11, halign: "center" },
      9: { cellWidth: 11, halign: "center" },
      10: { cellWidth: 11, halign: "center" },
      11: { cellWidth: 11, halign: "center" },
      12: { cellWidth: 11, halign: "center" },
      13: { cellWidth: 11, halign: "center" },
      14: { cellWidth: 11, halign: "center" },
      15: { cellWidth: 11, halign: "center" },
      16: { cellWidth: 11, halign: "center" },
      17: { cellWidth: 11, halign: "center" },
      18: { cellWidth: 11, halign: "center" },
      19: { cellWidth: 11, halign: "center" },
    },
  });

  // ===== KẾT LUẬN & CHỮ KÝ =====
  let finalY = (doc as any).lastAutoTable.finalY + 10;

  finalY += 15;

  const marginX = 40; // Lề trái và lề phải (giống lề của bảng phía trên)
  const printableWidth = pageWidth - 2 * marginX; // Chiều rộng thực tế dùng để chia cột

  const colWidth = 45; // Độ rộng vùng text mỗi chữ ký
  const maxPerRow = 5; // Tối đa 4 chữ ký / hàng
  const rowGap = 70;
  const coordinates: Record<string, { xRatio: number; yRatio: number }> = {};
  const baseY = finalY;
  const baseWidthPx = 120;
  const displayWidth = 800;

  listSigneInfos?.forEach((s, index) => {
    const rowIndex = Math.floor(index / maxPerRow);
    const colIndex = index % maxPerRow;

    // Xác định số lượng chữ ký thực tế của hàng này
    const itemsInRow = Math.min(
      maxPerRow,
      listSigneInfos.length - rowIndex * maxPerRow,
    );

    let x;
    if (itemsInRow === 1) {
      // 1 người: Căn giữa trang
      x = pageWidth / 2;
    } else {
      // Từ 2 người trở lên: Chia đều khoảng cách để 2 người ngoài cùng sát lề marginX
      // Công thức: Lề trái + (vị trí cột * (chiều rộng khả dụng / số khoảng trống giữa các cột))
      const gapSize = printableWidth / (itemsInRow - 1);
      x = marginX + colIndex * gapSize;
    }

    const y = baseY + rowIndex * rowGap + 15;

    const sigWidthMm = (baseWidthPx / displayWidth) * pageWidth;
    coordinates[s.idNhanVien] = {
      xRatio: Math.max(0, Math.min((x - sigWidthMm / 2) / pageWidth, 1)),
      yRatio: Math.max(0, Math.min((y + 5) / pageHeight, 1)), // +5 để vào giữa khoảng trống
    };

    // 1️⃣ Đơn vị (Phòng ban/Phân xưởng)
    // Dùng fontSize nhỏ hơn một chút nếu cần giống ảnh mẫu
    doc.setFontSize(10);
    const donViLines = doc.splitTextToSize(
      s?.title || s?.donVi || "",
      colWidth,
    );
    doc.text(donViLines, x, y, { align: "center" });

    // 2️⃣ Họ tên người ký
    // Cố định khoảng cách nameY để tạo khoảng trống cho chữ ký tay
    const nameY = y + 35;
    const hoTenLines = doc.splitTextToSize(s?.hoTen || "", colWidth);
    doc.text(hoTenLines, x, nameY, { align: "center" });
  });

  return {
    pdf: new Uint8Array(doc.output("arraybuffer")),
    coordinates,
  };
};

export const generateSuaChuaPdf = async (
  repair: any,
  staffs: any[],
  departments: any[],
  positions: any[],
): Promise<{
  pdf: Uint8Array;
  coordinates: Record<string, { xRatio: number; yRatio: number }>;
}> => {
  const listSigneInfos: any[] = listSigneInfo(
    repair,
    staffs,
    departments,
    positions,
  );
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFont("times_new_roman", "bold");
  doc.setFontSize(11);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftColCenter = pageWidth / 4;
  const rightColCenter = (pageWidth * 3) / 4;

  // Header Left
  doc.text("CÔNG TY THAN UÔNG BÍ - TKV", leftColCenter, 20, {
    align: "center",
  });
  const creatorDept = getDonVi(repair.idNguoiLapBieu, staffs, departments);
  doc.text(`Đơn vị: ${"................"}`, leftColCenter, 26, {
    align: "center",
  });
  doc.line(leftColCenter - 15, 27, leftColCenter + 15, 27);

  // Header Right
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", rightColCenter, 20, {
    align: "center",
  });
  doc.text("Độc lập - Tự do - Hạnh phúc", rightColCenter, 26, {
    align: "center",
  });
  doc.line(rightColCenter - 15, 27, rightColCenter + 15, 27);

  // Date
  doc.setFont("times_new_roman_italic", "italic");
  doc.setFontSize(10);
  const today = new Date();
  const dateStr = `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  doc.text(dateStr, pageWidth - 20, 35, { align: "right" });

  // Title
  doc.setFont("times_new_roman", "bold");
  doc.setFontSize(16);
  doc.text("ĐỀ NGHỊ SỬA CHỮA, BẢO DƯỠNG THIẾT BỊ", pageWidth / 2, 50, {
    align: "center",
  });
  doc.setFontSize(12);
  doc.text(`Số: ${repair.soPhieu || "..."}`, pageWidth / 2, 58, {
    align: "center",
  });

  doc.setFont("times_new_roman", "normal");
  doc.setFontSize(12);
  let y = 70;

  doc.text(
    `- Căn cứ vào Kế hoạch SCBD tháng ${repair.thang || "..."} năm ${repair.nam || "..."}`,
    20,
    y,
  );
  y += 8;

  const deNghiText = `- Phân xưởng: ............ đề nghị ................... duyệt cho đơn vị thực hiện sửa chữa bảo dưỡng một số hệ thống thiết bị:`;
  const deNghiLines = doc.splitTextToSize(deNghiText, pageWidth - 40);
  deNghiLines.forEach((line: string) => {
    doc.text(line, 20, y);
    y += 8;
  });

  doc.text(`- Tên thiết bị: theo bảng kê chi tiết dưới đây`, 20, y);
  y += 8;
  doc.text(
    `- Vị trí lắp đặt: ${"..........................................."}`,
    20,
    y,
  );
  y += 8;
  doc.text(
    `- Thời gian hoạt động: tháng ${repair.thang || "..."}/${repair.nam || "..."}`,
    20,
    y,
  );
  y += 10;

  // Table
  const tableData = (repair.danhSachTaiSan || []).map(
    (item: any, idx: number) => {
      return [
        idx + 1,
        item.idTaiSan || "",
        item.tenTaiSan || "",
        item.nhomTaiSan || "",
        item.capSuaChua || "",
        item.soLuong || 1,
        item.donViQuanLy || "",
        item.donVibaoTri || "",
        "",
      ];
    },
  );

  autoTable(doc, {
    startY: y,
    margin: { left: 15, right: 15 },
    head: [
      [
        "STT",
        "Mã TB",
        "Tên thiết bị",
        "Nhóm",
        "Loại BT",
        "SL",
        "Đơn vị QL",
        "Đơn vị bảo trì",
        "Ghi chú",
      ],
    ],
    body: tableData,
    theme: "grid",
    styles: { font: "times_new_roman", fontSize: 9 },
    headStyles: {
      fillColor: false,
      textColor: 0,
      lineWidth: 0.1,
      lineColor: 0,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 0 },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 15, halign: "center" },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 10, halign: "center" },
      6: { cellWidth: 25, halign: "center" },
      7: { cellWidth: 25, halign: "center" },
    },
  });

  // Signatures
  let finalY = (doc as any).lastAutoTable.finalY + 20;
  const marginX = 25;
  const printableWidth = pageWidth - 2 * marginX;
  const maxPerRow = 3;
  const rowGap = 60;
  const coordinates: Record<string, { xRatio: number; yRatio: number }> = {};
  const baseWidthPx = 120;
  const displayWidth = 800;

  listSigneInfos.forEach((s, index) => {
    const rowIndex = Math.floor(index / maxPerRow);
    const colIndex = index % maxPerRow;
    const itemsInRow = Math.min(
      maxPerRow,
      listSigneInfos.length - rowIndex * maxPerRow,
    );

    let x;
    if (itemsInRow === 1) x = pageWidth / 2;
    else {
      const gapSize = printableWidth / (itemsInRow - 1);
      x = marginX + colIndex * gapSize;
    }

    const yPos = finalY + rowIndex * rowGap;
    const sigWidthMm = (baseWidthPx / displayWidth) * pageWidth;

    coordinates[s.idNhanVien] = {
      xRatio: Math.max(0, Math.min((x - sigWidthMm / 2) / pageWidth, 1)),
      yRatio: Math.max(0, Math.min((yPos + 10) / pageHeight, 1)),
    };

    doc.setFont("times_new_roman", "bold");
    doc.setFontSize(10);
    doc.text(s.title || s.donVi || "", x, yPos, { align: "center" });
    doc.setFont("times_new_roman", "italic");
    doc.text("(Ký, ghi rõ họ tên)", x, yPos + 5, { align: "center" });
    doc.setFont("times_new_roman", "bold");
    doc.text(s.hoTen || "", x, yPos + 35, { align: "center" });
  });

  return {
    pdf: new Uint8Array(doc.output("arraybuffer")),
    coordinates,
  };
};

export const generatePhieuSuCoPdf = async (
  incident: IncidenData,
  staffs: any[],
  departments: any[],
  positions: any[],
): Promise<{
  pdf: Uint8Array;
  coordinates: Record<string, { xRatio: number; yRatio: number }>;
}> => {
  const listSigneInfos: any[] = listSigneInfo(
    incident,
    staffs,
    departments,
    positions,
  );
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFont("times_new_roman", "bold");
  doc.setFontSize(11);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftColCenter = pageWidth / 4; // Giữa cột trái
  const rightColCenter = (pageWidth * 3) / 4;

  // Header Left
  doc.text("CÔNG TY THAN UÔNG BÍ - TKV", leftColCenter, 20, {
    align: "center",
  });
  doc.text(`Đơn vị: ${incident.tenDonViBaoCao}`, leftColCenter, 26, {
    align: "center",
  });

  // Header Right
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", rightColCenter, 20, {
    align: "center",
  });
  doc.text("Độc lập - Tự do - Hạnh phúc", rightColCenter, 26, {
    align: "center",
  });

  // Lines - căn theo text
  const leftLineWidth = 30; // độ dài line cột trái
  const rightLineWidth = 30; // độ dài line cột phải

  doc.line(
    leftColCenter - leftLineWidth / 2,
    27,
    leftColCenter + leftLineWidth / 2,
    27,
  );

  doc.line(
    rightColCenter - rightLineWidth / 2,
    27,
    rightColCenter + rightLineWidth / 2,
    27,
  );

  // Date
  doc.setFont("times_new_roman_italic", "italic");
  doc.setFontSize(10);
  const today = new Date(incident.ngayTao || new Date());
  const dateStr = `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  doc.text(dateStr, pageWidth - 20, 35, { align: "right" });

  // Title
  doc.setFont("times_new_roman", "bold");
  doc.setFontSize(16);
  doc.text("PHIẾU BÁO SỰ CỐ THIẾT BỊ", pageWidth / 2, 50, { align: "center" });
  doc.setFontSize(12);
  doc.text(
    `Số: ${incident.soPhieu || (incident as any).number || "..."}`,
    pageWidth / 2,
    58,
    {
      align: "center",
    },
  );

  doc.setFont("times_new_roman", "normal");
  let y = 70;
  const severityLabels: Record<number, string> = {
    0: "Nhẹ",
    1: "Trung bình",
    2: "Nặng",
    3: "Nghiêm trọng",
  };

  const drawField = (label: string, value: string) => {
    doc.setFont("times_new_roman", "normal");
    doc.text(`- ${label}: `, 20, y);
    const labelW = doc.getTextWidth(`- ${label}: `);
    doc.setFont("times_new_roman", "bold");
    doc.text(value, 20 + labelW, y);
    y += 8;
  };

  drawField(
    "Đơn vị báo cáo",
    incident.tenDonViBaoCao || (incident as any).idDonViBaoCao || "...",
  );

  drawField("Ngày giờ phát hiện", incident.ngayPhatHien);
  drawField(
    "Tên hệ thống/thiết bị gặp sự cố",
    incident.tenHeThongThietBi || "...",
  );
  drawField("Phân hệ/vị trí xảy ra sự cố", incident.phanHeViTri || "...");

  doc.setFont("times_new_roman", "normal");
  doc.text(`- Mô tả tình trạng sự cố: ${incident.moTa || "..."}`, 20, y);
  y += 8;

  const mucDo = incident.mucDo ?? (incident as any).severity ?? 0;
  drawField("Đánh giá mức độ", severityLabels[mucDo] || "...");

  y += 5;
  doc.setFont("times_new_roman", "bold");
  doc.text("Danh sách hệ thống/thiết bị bị sự cố:", pageWidth / 2, y, {
    align: "center",
  });
  y += 5;

  const tableData = (incident?.danhSachTaiSan ?? []).map((item, idx) => [
    idx + 1 || "",
    incident.soPhieu || "",
    item.idTaiSan || "",
    item.tenTaiSan || "",
    item.tenNhomTaiSan || "",
    item.thuocHeThong || "",
    item.viTri || "",
    item.tinhTrang || "",
    incident.idDonViBaoCao,
    item.idDonViQuanLyKyThuat || "",
    severityLabels[mucDo] || "",
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: 20, right: 20 },
    head: [
      [
        "STT",
        "Số chứng từ",
        "Mã thiết bị",
        "Tên TB",
        "Nhóm chủng loại",
        "Thuộc hệ thống",
        "Vị trí",
        "Tình trạng",
        "Đơn vị quản lý TB",
        "Đơn vị quản lý KT",
        "Mức độ",
      ],
    ],
    body: tableData || [],
    theme: "grid",
    styles: { font: "times_new_roman", fontSize: 8 },
    headStyles: {
      fillColor: false,
      textColor: 0,
      lineWidth: 0.1,
      lineColor: 0,
      font: "times_new_roman",
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      font: "times_new_roman",
      fontSize: 10,
      textColor: 0,
      lineWidth: 0.1,
      lineColor: 0,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 12, halign: "center" },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 30, halign: "center" },
      4: { cellWidth: 15, halign: "center" },
      5: { cellWidth: 15, halign: "center" },
      6: { cellWidth: 15, halign: "center" },
      7: { cellWidth: 15, halign: "center" },
      8: { cellWidth: 15, halign: "center" },
      9: { cellWidth: 15, halign: "center" },
      10: { cellWidth: 15, halign: "center" },
      11: { cellWidth: 15, halign: "center" },
    },
  });

  let finalY = (doc as any).lastAutoTable.finalY + 20;
  const marginX = 30;
  const printableWidth = pageWidth - 2 * marginX;
  const maxPerRow = 3;
  const rowGap = 60;
  const coordinates: Record<string, { xRatio: number; yRatio: number }> = {};
  const baseWidthPx = 120;
  const displayWidth = 800;

  listSigneInfos.forEach((s, index) => {
    const rowIndex = Math.floor(index / maxPerRow);
    const colIndex = index % maxPerRow;
    const itemsInRow = Math.min(
      maxPerRow,
      listSigneInfos.length - rowIndex * maxPerRow,
    );

    let x;
    if (itemsInRow === 1) x = pageWidth / 2;
    else {
      const gapSize = printableWidth / (itemsInRow - 1);
      x = marginX + colIndex * gapSize;
    }

    const yPos = finalY + rowIndex * rowGap;
    const sigWidthMm = (baseWidthPx / displayWidth) * pageWidth;

    coordinates[s.idNhanVien] = {
      xRatio: Math.max(0, Math.min((x - sigWidthMm / 2) / pageWidth, 1)),
      yRatio: Math.max(0, Math.min((yPos + 10) / pageHeight, 1)),
    };

    doc.setFont("times_new_roman", "bold");
    doc.setFontSize(10);
    doc.text(s.title || s.donVi || "", x, yPos, { align: "center" });
    doc.setFont("times_new_roman", "italic");
    doc.text("(Ký, ghi rõ họ tên)", x, yPos + 5, { align: "center" });
    doc.setFont("times_new_roman", "bold");
    doc.text(s.hoTen || "", x, yPos + 35, { align: "center" });
  });

  return {
    pdf: new Uint8Array(doc.output("arraybuffer")),
    coordinates,
  };
};
