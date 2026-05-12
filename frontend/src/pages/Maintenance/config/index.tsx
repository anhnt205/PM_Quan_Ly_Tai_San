import jsPDF from "jspdf";
import { findById, formatted, loadImage } from "../../../utils/helpers";
import { MaintenancePlanData } from "../../MainenancePlanRepair/types";
import autoTable from "jspdf-autotable";
import "../../../assets/fonts/times_new_roman-normal";
import "../../../assets/fonts/times_new_roman-bold";
import "../../../assets/fonts/times_new_roman_italic-italic";
import { Chip } from "@mui/material";

import { IncidenData } from "../types";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../../components/Alert";
import { MessageTypeFunctions } from "../../../utils/const";
import socketService from "../../../services/socketService";

export const showShareStatus = (isShare: boolean, isMyCreated: boolean) => {
  return (
    <Chip
      label={isShare ? (isMyCreated ? "Đã gửi" : "Được gửi") : "Chưa gửi"}
      sx={{
        backgroundColor: isShare ? "#4caf50" : "#f30d0d",
        color: "white",
        fontWeight: 500,
        fontSize: "12px",
        borderRadius: "4px", // BorderRadius.circular(4)
        height: "auto",
        padding: "1px 5px", // EdgeInsets.symmetric(horizontal: 5, vertical: 1)
        mb: "2px", // margin: const EdgeInsets.only(bottom: 2)
        "& .MuiChip-label": {
          padding: 0,
        },
      }}
    />
  );
};

// kiem tra quyền share
export const isCheckShowShare = (items: any[]) => {
  if (items.length === 0) {
    return false;
  }
  const hasSharedItems = items.some((e) => e.share === true);

  if (hasSharedItems) {
    return false;
  }

  return items.some((e) => e.share !== true);
};

//

/**
 * Lọc danh sách phiếu chưa trình duyệt và hiển thị thông báo nếu có phiếu đã trình duyệt rồi.
 */
const getNotSharedAndNotify = (items: any[]): any[] => {
  if (!items || items.length === 0) {
    showErrorAlert("Không có phiếu nào để trình duyệt");
    return [];
  }

  // Lọc phiếu đã trình duyệt và chưa trình duyệt
  const alreadyShared = items.filter((e) => e.share === true);
  const notShared = items.filter((e) => e.share !== true);

  // Trường hợp tất cả đều đã trình duyệt
  if (notShared.length === 0) {
    showErrorAlert("Các phiếu này đều đã được trình duyệt");
    return [];
  }

  // Thông báo nếu trong danh sách chọn có lẫn phiếu đã trình duyệt
  if (alreadyShared.length > 0) {
    const names = alreadyShared
      .map((e) => (e.tenPhieu?.trim() ? e.tenPhieu : e.id))
      .filter(Boolean)
      .join(", ");

    const message = names
      ? `Các phiếu đã được trình duyệt: ${names}`
      : "Có phiếu đã được trình duyệt trong danh sách chọn";

    showErrorAlert(message);
  }

  return notShared;
};

export const canUserSign = (newSigningType: number, images: any[]) => {
  // Kiểm tra xem tài liệu đã có chữ ký số (loaiKy = 3, 4, 5) chưa
  const hasDigitalSignature = images.some(
    (img) => img.loaiKy === 3 || img.loaiKy === 4 || img.loaiKy === 5,
  );

  // Nếu tài liệu đã có chữ ký số, chỉ cho phép ký số (loaiKy = 3, 4, 5)
  if (hasDigitalSignature) {
    if (newSigningType !== 3 && newSigningType !== 4 && newSigningType !== 5) {
      return false;
    }
  }

  // Chữ ký loại 1 (ký nháy) luôn được phép ký (nếu chưa có chữ ký số)
  if (newSigningType === 1) {
    return true;
  }

  // Lấy tất cả chữ ký mới của user hiện tại trong phiên này
  const userNewSignatures = images.filter((img) => !img.isLocked);
  // Nếu chưa có chữ ký mới nào, được phép ký
  if (userNewSignatures.length === 0) {
    return true;
  }

  // Kiểm tra xem đã có chữ ký loại khác 1 chưa
  const hasNonType1Signature = userNewSignatures.some(
    (img) => img.loaiKy !== 1,
  );

  // Nếu đã có chữ ký loại khác 1 (2, 3, 4, 5), không được ký thêm
  if (hasNonType1Signature) {
    return false;
  }

  // Nếu chỉ có chữ ký loại 1, được phép ký thêm
  return true;
};

export const handleSendToSigner = async (
  selectedItems: any[],
  onUpdate: (data: any[]) => Promise<any>,
  onClose: () => void,
) => {
  // 1. Kiểm tra rỗng
  if (!selectedItems || selectedItems.length === 0) {
    showErrorAlert("Không có phiếu nào để chia sẻ");
    return;
  }

  // 2. Hiển thị Dialog xác nhận (tương tự showConfirmDialog trong Flutter)
  const confirm = await showConfirmAlert(
    "Bạn có chắc muốn trình duyệt cho người ký?",
  );

  if (confirm.isConfirmed) {
    // 3. Lọc danh sách hợp lệ
    const notSharedItems = getNotSharedAndNotify(selectedItems);

    if (notSharedItems.length > 0) {
      try {
        const list = await listNguoiKy(selectedItems);
        await onUpdate(notSharedItems.map((e) => ({ ...e, share: true })));
        await socketService.send({
          type: MessageTypeFunctions.ASSET_TRANSFER,
          recieve: list,
        });
        showSuccessAlert("Trình duyệt phiếu thành công!");
        onClose();
      } catch (error) {
        showErrorAlert("Có lỗi xảy ra khi trình duyệt phiếu.");
      }
    }
  }
  onClose();
};

export const listNguoiKy = (selectedItems: any[]) => {
  const allIds = new Set<string>();
  for (var item of selectedItems) {
    const id1 = item.idNguoiLapBieu;
    const id2 = item.idTrinhDuyetGiamDoc;

    if (id1) allIds.add(id1);
    if (id2) allIds.add(id2);
    const signatories = item.nguoiKyList;
    if (signatories != null) {
      for (var s of signatories) {
        const sigId = s.idNguoiKy;
        if (sigId) allIds.add(sigId);
      }
    }
  }
  return Array.from(allIds);
};

const getStatusDetails = (status: number) => {
  switch (status) {
    case 0:
      return { label: "Nháp", color: "#9e9e9e" }; // Đỏ
    case 1:
      return { label: "Duyệt", color: "#ff9800" }; // Cam
    case 2:
      return { label: "Hủy", color: "#4caf50" }; // Xanh lá
    case 3:
      return { label: "Hoàn thành", color: "#68b9f0" }; // Xanh lá
    default:
      return { label: "Nháp", color: "#9e9e9e" }; // Xám
  }
};

export const showStatus = (status: number) => {
  const { label, color } = getStatusDetails(status);

  return (
    <Chip
      label={label}
      sx={{
        backgroundColor: color,
        color: "white",
        fontWeight: 500,
        fontSize: "12px",
        borderRadius: "4px", // BorderRadius.circular(4)
        height: "auto",
        padding: "1px 5px", // EdgeInsets.symmetric(horizontal: 5, vertical: 1)
        mb: "2px", // margin: const EdgeInsets.only(bottom: 2)
        "& .MuiChip-label": {
          padding: 0,
        },
      }}
    />
  );
};

const getChucVu = (idUser: string, staffs: any[], positions: any[]) => {
  const nhanVien = findById(staffs, idUser);
  const chucVu = findById(positions, nhanVien?.chucVuId ?? "");
  return chucVu?.tenChucVu ?? "";
};
const getDonVi = (idUser: string, staffs: any[], departments: any[]) => {
  const nhanVien = findById(staffs, idUser);
  const donVi = findById(departments, nhanVien?.phongBanId ?? "");
  return donVi;
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
      donVi: getDonVi(item.idNguoiLapBieu ?? "", staffs, departments)
        ?.tenPhongBan,
      idDonVi: getDonVi(item.idNguoiLapBieu ?? "", staffs, departments)?.id,
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
        donVi: getDonVi(item.idNguoiLapBieu ?? "", staffs, departments)
          ?.tenPhongBan,
        idDonVi: getDonVi(item.idNguoiLapBieu ?? "", staffs, departments)?.id,
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
      donVi: getDonVi(item.idNguoiLapBieu ?? "", staffs, departments)
        ?.tenPhongBan,
      idDonVi: getDonVi(item.idNguoiLapBieu ?? "", staffs, departments)?.id,
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
  const today = new Date(repair.ngayTao || new Date());
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
export const generateGiamDinhPdf = async (
  inspection: any,
  staffs: any[],
  departments: any[],
  positions: any[],
): Promise<{
  pdf: Uint8Array;
  coordinates: Record<string, { xRatio: number; yRatio: number }>;
}> => {
  const listSigneInfos: any[] = listSigneInfo(
    inspection,
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
  doc.text("TẬP ĐOÀN CÔNG NGHIỆP", leftColCenter, 20, { align: "center" });
  doc.text("THAN – KHOÁNG SẢN VIỆT NAM", leftColCenter, 26, {
    align: "center",
  });
  doc.text("CÔNG TY THAN UÔNG BÍ - TKV", leftColCenter, 32, {
    align: "center",
  });
  doc.line(leftColCenter - 15, 33, leftColCenter + 15, 33);

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
  const today = new Date(inspection.ngayGiamDinh || new Date());
  const dateStr = `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  doc.text(dateStr, pageWidth - 20, 40, { align: "right" });

  // Title
  doc.setFont("times_new_roman", "bold");
  doc.setFontSize(14);
  doc.text("BIÊN BẢN", pageWidth / 2, 50, { align: "center" });
  doc.text(
    "GIÁM ĐỊNH KỸ THUẬT VÀ BÀN GIAO THIẾT BỊ ĐƯA VÀO SỬA CHỮA",
    pageWidth / 2,
    58,
    { align: "center" },
  );

  doc.setFont("times_new_roman", "normal");
  doc.setFontSize(11);
  let y = 70;

  const d = new Date(inspection.ngayGiamDinh || new Date());
  doc.text(
    `Hôm nay, ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}. Tại ${inspection.viTri || "……………………………"}`,
    20,
    y,
  );
  y += 8;
  doc.text("Chúng tôi gồm:", 20, y);
  y += 8;

  listSigneInfos.forEach((s, idx) => {
    doc.text(`${idx + 1}.`, 25, y);
    doc.setFont("times_new_roman", "bold");
    doc.text(s.hoTen || "………………………", 35, y);
    doc.setFont("times_new_roman", "normal");
    doc.text(s.chucVu || "", 75, y);
    doc.text(s.donVi || "", 115, y);
    y += 7;
  });

  y += 3;
  const canCuText = `Cùng tiến hành thực hiện giải thể và kiểm tra tình trạng kỹ thuật thiết bị theo văn bản đề nghị số ${inspection.soPhieuSuaChua || "……………"} của phân xưởng.`;
  const canCuLines = doc.splitTextToSize(canCuText, pageWidth - 40);
  canCuLines.forEach((line: string) => {
    doc.text(line, 20, y);
    y += 7;
  });

  doc.text("Số đăng ký: ……………… trước khi đưa vào sửa chữa cấp ………………", 20, y);
  y += 7;
  doc.text("Với tình trạng kỹ thuật và nội dung sửa chữa như sau:", 20, y);
  y += 8;

  // Table
  const tableData: any[] = [];
  (inspection.danhSachChiTiet || []).forEach((item: any, idx: number) => {
    // Group row (I/, II/, ...)
    tableData.push([
      {
        content: `${String.fromCharCode(73 + idx)}/`,
        styles: { fontStyle: "bold" },
      },
      {
        content: `Thiết bị: ${item.tenTaiSan || ""}`,
        colSpan: 7,
        styles: { fontStyle: "bold" },
      },
    ]);
    // Entry row
    tableData.push([
      "",
      item.tenTaiSan || "",
      item.donViTinh || "",
      item.soLuong || "",
      item.tinhTrang || "",
      item.suaChua ? "X" : "",
      item.thayMoi ? "X" : "",
      item.ghiChu || "",
    ]);
  });

  autoTable(doc, {
    startY: y,
    margin: { left: 15, right: 15 },
    head: [
      [
        "STT",
        "Tên vật tư, thiết bị",
        "ĐVT",
        "SL",
        "Tình trạng kỹ thuật",
        "S.chữa",
        "Thay mới",
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
      2: { cellWidth: 12, halign: "center" },
      3: { cellWidth: 10, halign: "center" },
      5: { cellWidth: 15, halign: "center" },
      6: { cellWidth: 15, halign: "center" },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;
  doc.text(
    `Số để lại phục hồi phục vụ cho sản xuất: ${inspection.soDeLaiPhucHoi ?? "…………"}.`,
    20,
    y,
  );
  y += 7;
  doc.text(
    `Số để làm phế liệu: ${inspection.soDeLamPheLieu ?? "…………"} (mục)`,
    20,
    y,
  );
  y += 7;
  doc.text(`Số lượng hủy: ${inspection.soLuongHuy ?? "…………"} (mục)`, 20, y);
  y += 10;

  doc.text(
    "Biên bản được lập xong lúc …… giờ cùng ngày và được các thành phần cùng thống nhất thông qua./.",
    20,
    y,
  );
  y += 15;

  // Signatures
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

    const yPos = y + rowIndex * rowGap;
    const sigWidthMm = (baseWidthPx / displayWidth) * pageWidth;

    coordinates[s.idNhanVien] = {
      xRatio: Math.max(0, Math.min((x - sigWidthMm / 2) / pageWidth, 1)),
      yRatio: Math.max(0, Math.min((yPos + 10) / pageHeight, 1)),
    };

    doc.setFont("times_new_roman", "bold");
    doc.setFontSize(10);
    doc.text(s.title || s.donVi || "", x, yPos, { align: "center" });
    doc.setFont("times_new_roman_italic", "italic");
    doc.text("(Ký, ghi rõ họ tên)", x, yPos + 5, { align: "center" });
    doc.setFont("times_new_roman", "bold");
    doc.text(s.hoTen || "", x, yPos + 35, { align: "center" });
  });

  return {
    pdf: new Uint8Array(doc.output("arraybuffer")),
    coordinates,
  };
};

export const generateNghiemThuPdf = async (
  item: any,
  staffs: any[],
  departments: any[],
  positions: any[],
): Promise<{
  pdf: Uint8Array;
  coordinates: Record<string, { xRatio: number; yRatio: number }>;
}> => {
  const listSigneInfos: any[] = listSigneInfo(
    item,
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
  doc.text("TẬP ĐOÀN CÔNG NGHIỆP", leftColCenter, 20, { align: "center" });
  doc.text("THAN – KHOÁNG SẢN VIỆT NAM", leftColCenter, 26, {
    align: "center",
  });
  doc.text("CÔNG TY THAN UÔNG BÍ - TKV", leftColCenter, 32, {
    align: "center",
  });
  doc.line(leftColCenter - 15, 33, leftColCenter + 15, 33);

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
  const today = new Date(item.ngayNghiemThu || new Date());
  const dateStr = `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  doc.text(dateStr, pageWidth - 20, 40, { align: "right" });

  // Title
  doc.setFont("times_new_roman", "bold");
  doc.setFontSize(14);
  doc.text("BIÊN BẢN", pageWidth / 2, 50, { align: "center" });
  doc.text(
    "NGHIỆM THU CHẠY THỬ VÀ BÀN GIAO THIẾT BỊ SAU SỬA CHỮA",
    pageWidth / 2,
    58,
    { align: "center" },
  );

  doc.setFont("times_new_roman", "normal");
  doc.setFontSize(11);
  let y = 70;

  const d = new Date(item.ngayNghiemThu || new Date());
  doc.text(
    `Hôm nay, ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}. Tại ${item.viTri || "……………………………"}`,
    20,
    y,
  );
  y += 8;
  doc.text("Chúng tôi gồm:", 20, y);
  y += 8;

  listSigneInfos.forEach((s, idx) => {
    doc.text(`${idx + 1}.`, 25, y);
    doc.setFont("times_new_roman", "bold");
    doc.text(s.hoTen || "………………………", 35, y);
    doc.setFont("times_new_roman", "normal");
    doc.text(s.chucVu || "", 75, y);
    doc.text(s.donVi || "", 115, y);
    y += 7;
  });

  y += 3;
  doc.text(
    `Cùng tiến hành nghiệm thu thiết bị: ${item.tenThietBi || "……………"}.`,
    20,
    y,
  );
  y += 6;
  doc.text(
    `Số đăng ký: ${item.soDangKi || "............."} sau khi thực hiện sửa chữa cấp ${item.capSuaChua || ".............."} với các nội dung cụ thể sau: `,
    20,
    y,
  );
  y += 8;

  doc.text(`1. Nội dung sửa chữa:`, 20, y);

  y += 8;

  // Table
  const tableData: any[] = [];
  (item.danhSachTaiSan || []).forEach((ts: any, idx: number) => {
    // Group row (I/, II/, ...)
    tableData.push([
      {
        content: `${String.fromCharCode(73 + idx)}/`,
        styles: { fontStyle: "bold" },
      },
      {
        content: `Thiết bị: ${ts.tenTaiSan || ts.idTaiSan || ""}`,
        colSpan: 5,
        styles: { fontStyle: "bold", halign: "left" },
      },
    ]);
    // Material entries
    (ts.danhSachVatTu || []).forEach((vt: any, vIdx: number) => {
      tableData.push([
        String(vIdx + 1).padStart(2, "0"),
        vt.idVatTu || "",
        vt.tenTaiSan || vt.tenVatTu || "",
        vt.donViTinh || "",
        vt.soLuong || "",
        vt.moTa || "",
      ]);
    });
  });

  autoTable(doc, {
    startY: y,
    margin: { left: 15, right: 15 },
    head: [["STT", "Mã VT", "Tên vật tư, thiết bị", "ĐVT", "SL", "Ghi chú"]],
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
      1: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 15, halign: "center" },
      4: { cellWidth: 10, halign: "center" },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont("times_new_roman", "bold");
  doc.text(`2. Kết quả kiểm tra chạy thử: `, 20, y);
  const resultW = doc.getTextWidth(`2. Kết quả kiểm tra chạy thử: `);
  doc.setFont("times_new_roman", "normal");
  doc.text(item.ketQua || "……………………", 20 + resultW, y);
  y += 8;

  doc.setFont("times_new_roman", "bold");
  doc.text("3. Các nội dung sửa chữa được nghiệm thu:", 20, y);
  y += 8;
  autoTable(doc, {
    startY: y,
    margin: { left: 15, right: 15 },
    head: [["STT", "Mã VT", "Tên vật tư, thiết bị", "ĐVT", "SL", "Ghi chú"]],
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
      1: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 15, halign: "center" },
      4: { cellWidth: 10, halign: "center" },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont("times_new_roman", "normal");
  doc.text("4. Các nội dung cần tiếp tục theo dõi, khắc ( nếu có )", 20, y);
  y += 8;
  const noiDungLines = doc.splitTextToSize(
    item.noiDung || "………………………………………………………………………………………………………………",
    pageWidth - 40,
  );
  noiDungLines.forEach((line: string) => {
    doc.text(line, 20, y);
    y += 7;
  });

  y += 10;
  // Signatures
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

    const yPos = y + rowIndex * rowGap;
    const sigWidthMm = (baseWidthPx / displayWidth) * pageWidth;

    coordinates[s.idNhanVien] = {
      xRatio: Math.max(0, Math.min((x - sigWidthMm / 2) / pageWidth, 1)),
      yRatio: Math.max(0, Math.min((yPos + 10) / pageHeight, 1)),
    };

    doc.setFont("times_new_roman", "bold");
    doc.setFontSize(10);
    doc.text(s.title || s.donVi || "", x, yPos, { align: "center" });
    doc.setFont("times_new_roman_italic", "italic");
    doc.text("(Ký, ghi rõ họ tên)", x, yPos + 5, { align: "center" });
    doc.setFont("times_new_roman", "bold");
    doc.text(s.hoTen || "", x, yPos + 35, { align: "center" });
  });

  return {
    pdf: new Uint8Array(doc.output("arraybuffer")),
    coordinates,
  };
};

export const generateDanhGiaVatTuPdf = async (
  item: any,
  staffs: any[],
  departments: any[],
  positions: any[],
): Promise<{
  pdf: Uint8Array;
  coordinates: Record<string, { xRatio: number; yRatio: number }>;
}> => {
  const listSigneInfos: any[] = listSigneInfo(
    item,
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
  doc.text("TẬP ĐOÀN CÔNG NGHIỆP", leftColCenter, 20, { align: "center" });
  doc.text("THAN – KHOÁNG SẢN VIỆT NAM", leftColCenter, 26, {
    align: "center",
  });
  doc.text("CÔNG TY THAN UÔNG BÍ - TKV", leftColCenter, 32, {
    align: "center",
  });
  doc.line(leftColCenter - 15, 33, leftColCenter + 15, 33);

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
  const today = new Date(item.ngayDanhGia || new Date());
  const dateStr = `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  doc.text(dateStr, pageWidth - 20, 40, { align: "right" });

  // Title
  doc.setFont("times_new_roman", "bold");
  doc.setFontSize(14);
  doc.text("BIÊN BẢN", pageWidth / 2, 50, { align: "center" });
  doc.text(
    "ĐÁNH GIÁ CHẤT LƯỢNG VẬT TƯ PHỤ TÙNG THU HỒI SAU SỬA CHỮA",
    pageWidth / 2,
    58,
    { align: "center" },
  );

  doc.setFont("times_new_roman", "normal");
  doc.setFontSize(11);
  let y = 70;

  const d = new Date(item.ngayDanhGia || new Date());
  doc.text(
    `Hôm nay, ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}. Tại ${item.viTri || "……………………………"}`,
    20,
    y,
  );
  y += 8;
  doc.text(
    `Hội đồng đánh giá chất lượng vật tư phụ tùng thu hồi sau sửa chữa cấp: ${item.capSuaChua || "……………"}`,
    20,
    y,
  );
  y += 8;
  doc.text(
    `Của thiết bị: ${item.tenThietBi || "……………"} Kiểu: ${item.kieu || "………"} Số: ${item.soDangKi || "……………………………"}`,
    20,
    y,
  );
  y += 8;
  doc.text(
    `Đơn vị quản lý vận hành: ${item.tenDonViQuanLy || "………………"}`,
    20,
    y,
  );
  y += 8;
  doc.text("Thành phần gồm:", 20, y);
  y += 8;

  listSigneInfos.forEach((s, idx) => {
    doc.text(`${idx + 1}.`, 25, y);
    doc.setFont("times_new_roman", "bold");
    doc.text(s.hoTen || "………………………", 35, y);
    doc.setFont("times_new_roman", "normal");
    doc.text(s.chucVu || "", 75, y);
    doc.text(s.donVi || "", 115, y);
    y += 7;
  });

  y += 3;
  doc.text(
    "Đã tiến hành kiểm tra chi tiết các vật tư phụ tùng thu hồi sau sửa chữa cụ thể như sau:",
    20,
    y,
  );
  y += 8;

  // Table
  const tableData: any[] = (item.danhSachChiTiet || []).map(
    (it: any, idx: number) => [
      String(idx + 1).padStart(2, "0"),
      it.tenVatTu || "",
      it.donViTinh || "",
      it.soLuong || "",
      it.tinhTrang || "",
      it.bienPhapXuLy || "",
      it.ghiChu || "",
    ],
  );

  autoTable(doc, {
    startY: y,
    margin: { left: 15, right: 15 },
    head: [
      [
        "STT",
        "Tên vật tư, thiết bị",
        "ĐVT",
        "SL",
        "Tình trạng",
        "Biện pháp xử lý",
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
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 10, halign: "center" },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont("times_new_roman", "normal");
  doc.text(
    `Số để lại phục hồi phục vụ cho sản xuất: ${item.soLuongPhucHoi ?? "…………"}.`,
    20,
    y,
  );
  y += 8;
  doc.text(`Số để làm phế liệu: ${item.soLuongPheLieu ?? "…………"} (mục)`, 20, y);
  y += 8;
  doc.text(`Số lượng hủy: ${item.soLuongHuy ?? "…………"} (mục)`, 20, y);
  y += 10;

  // Signatures
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

    const yPos = y + rowIndex * rowGap;
    const sigWidthMm = (baseWidthPx / displayWidth) * pageWidth;

    coordinates[s.idNhanVien] = {
      xRatio: Math.max(0, Math.min((x - sigWidthMm / 2) / pageWidth, 1)),
      yRatio: Math.max(0, Math.min((yPos + 10) / pageHeight, 1)),
    };

    doc.setFont("times_new_roman", "bold");
    doc.setFontSize(10);
    doc.text(s.title || s.donVi || "", x, yPos, { align: "center" });
    doc.setFont("times_new_roman_italic", "italic");
    doc.text("(Ký, ghi rõ họ tên)", x, yPos + 5, { align: "center" });
    doc.setFont("times_new_roman", "bold");
    doc.text(s.hoTen || "", x, yPos + 35, { align: "center" });
  });

  return {
    pdf: new Uint8Array(doc.output("arraybuffer")),
    coordinates,
  };
};

export const generateKiemTraSuCoPdf = async (
  item: any,
  staffs: any[],
  departments: any[],
  positions: any[],
): Promise<{
  pdf: Uint8Array;
  coordinates: Record<string, { xRatio: number; yRatio: number }>;
}> => {
  const listSigneInfos: any[] = listSigneInfo(
    item,
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
  doc.setFont("times_new_roman", "normal");
  doc.text("TẬP ĐOÀN CÔNG NGHIỆP", leftColCenter, 20, { align: "center" });
  doc.text("THAN - KHOÁNG SẢN VIỆT NAM", leftColCenter, 25, {
    align: "center",
  });
  doc.setFont("times_new_roman", "bold");
  doc.text("CÔNG TY THAN UÔNG BÍ - TKV", leftColCenter, 30, {
    align: "center",
  });
  doc.line(leftColCenter - 25, 31, leftColCenter + 25, 31);

  // Header Right
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", rightColCenter, 20, {
    align: "center",
  });
  doc.text("Độc lập - Tự do - Hạnh phúc", rightColCenter, 26, {
    align: "center",
  });
  doc.line(rightColCenter - 25, 27, rightColCenter + 25, 27);

  // Date
  doc.setFont("times_new_roman_italic", "italic");
  doc.setFontSize(11);
  const today = new Date(item.ngayTao || item.ngayKiemTra || new Date());
  const dateStr = `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  doc.text(dateStr, pageWidth - 20, 35, { align: "right" });

  // Title
  doc.setFont("times_new_roman", "bold");
  doc.setFontSize(14);
  doc.text("BIÊN BẢN", pageWidth / 2, 45, { align: "center" });
  doc.text("KIỂM TRA SỰ CỐ THIẾT BỊ", pageWidth / 2, 53, { align: "center" });

  doc.setFont("times_new_roman", "normal");
  doc.setFontSize(12);
  let y = 65;

  const getDots = (len: number) => ".".repeat(len);

  // Intro
  doc.text(
    `Hôm nay, ngày ....... tháng ........ năm ........... Tại ${item.viTri || getDots(50)}`,
    20,
    y,
  );
  y += 8;
  doc.setFont("times_new_roman", "bold");
  doc.text("Chúng tôi gồm:", 20, y);
  y += 8;

  doc.setFont("times_new_roman", "normal");
  listSigneInfos.forEach((s, i) => {
    doc.text(`${i + 1}. ${s.hoTen || getDots(30)}`, 25, y);
    doc.text(`${s.chucVu || getDots(20)}`, 85, y);
    doc.text(`${s.donVi || getDots(30)}`, 140, y);
    y += 7;
  });

  y += 3;
  doc.text(
    `Đã tiến hành kiểm tra tình trạng kỹ thuật thiết bị: ${getDots(70)}`,
    20,
    y,
  );
  y += 8;
  doc.text(`Số đăng ký: ${getDots(100)}`, 20, y);
  y += 8;
  doc.text(
    `Sau khi xảy ra sự cố vào lúc ....... giờ ....... ngày ....... tháng ....... năm ..........`,
    20,
    y,
  );
  y += 10;

  // Findings
  const writeField = (label: string, content: string) => {
    doc.setFont("times_new_roman", "bold");
    doc.text(label, 20, y);
    y += 6;
    doc.setFont("times_new_roman", "normal");
    const lines = doc.splitTextToSize(content || getDots(120), pageWidth - 40);
    doc.text(lines, 25, y);
    y += lines.length * 6 + 2;
  };

  writeField("1. Nội dung sự cố:", item.nhanXetKetLuan || item.moTa || "");
  writeField("2. Điều kiện vận hành:", "");
  writeField("3. Nội dung sửa chữa/ bảo dưỡng gần nhất:", "");
  writeField("4. Tình trạng thiết bị:", "");
  writeField("5. Sơ bộ xác định nguyên nhân:", "");

  doc.setFont("times_new_roman", "bold");
  doc.text(
    "6. Nội dung cần sửa chữa khắc phục: (theo bảng kê chi tiết đính kèm)",
    20,
    y,
  );
  y += 8;

  // Table
  const tableData = (item.danhSachChiTiet || item.items || []).map(
    (detail: any, idx: number) => {
      const tenTaiSan =
        detail.tenTaiSan || detail.itemName || detail.idTaiSan || "";
      const dvt = detail.donViTinh || detail.unit || "";
      const sl = detail.soLuong || detail.quantity || 1;
      const tTrang = detail.tinhTrang || detail.condition || "";
      const sc = detail.suaChua || detail.actionRepair ? "X" : "";
      const tm = detail.thayMoi || detail.actionReplace ? "X" : "";
      const note = detail.ghiChu || detail.note || "";

      return [idx + 1, tenTaiSan, dvt, sl, tTrang, sc, tm, note];
    },
  );

  autoTable(doc, {
    startY: y,
    margin: { left: 15, right: 15 },
    head: [
      [
        "TT",
        "Tên vật tư, thiết bị",
        "ĐVT",
        "SL",
        "Tình trạng kỹ thuật",
        "SC",
        "Thay mới",
        "Ghi chú",
      ],
    ],
    body: tableData,
    theme: "grid",
    styles: { font: "times_new_roman", fontSize: 10 },
    headStyles: {
      fillColor: false,
      textColor: 0,
      lineWidth: 0.1,
      lineColor: 0,
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
    },
    bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 0 },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { halign: "left" },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 10, halign: "center" },
      4: { cellWidth: 35, halign: "left" },
      5: { cellWidth: 12, halign: "center" },
      6: { cellWidth: 20, halign: "center" },
      7: { cellWidth: 25, halign: "left" },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  doc.setFont("times_new_roman", "normal");
  doc.text(
    "Biên bản được lập xong lúc ...... giờ cùng ngày, được các thành phần thống nhất thông qua./.",
    15,
    y,
  );

  y += 15;

  // Signatures
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

    // Nếu row mới tràn trang thì thêm page
    if (rowIndex > 0 && y + rowIndex * rowGap > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }

    let x;
    if (itemsInRow === 1) x = pageWidth / 2;
    else {
      const gapSize = printableWidth / (itemsInRow - 1);
      x = marginX + colIndex * gapSize;
    }

    const yPos = y + rowIndex * rowGap;
    const sigWidthMm = (baseWidthPx / displayWidth) * pageWidth;

    coordinates[s.idNhanVien] = {
      xRatio: Math.max(0, Math.min((x - sigWidthMm / 2) / pageWidth, 1)),
      yRatio: Math.max(0, Math.min((yPos + 10) / pageHeight, 1)),
    };

    doc.setFont("times_new_roman", "bold");
    doc.setFontSize(10);
    doc.text(s.title || s.donVi || "", x, yPos, { align: "center" });
    doc.setFont("times_new_roman_italic", "italic");
    doc.text("(Ký, ghi rõ họ tên)", x, yPos + 5, { align: "center" });
    doc.setFont("times_new_roman", "bold");
    doc.text(s.hoTen || "", x, yPos + 35, { align: "center" });
  });

  return {
    pdf: new Uint8Array(doc.output("arraybuffer")),
    coordinates,
  };
};
