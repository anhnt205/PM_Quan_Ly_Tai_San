import { Chip } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../../components/Alert";
import { findById } from "../../../utils/helpers";
import socketService from "../../../services/socketService";
import { MessageTypeFunctions } from "../../../utils/const";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export const getDecision = (data: any[]) => {
  if (data.length === 0) {
    return false;
  }
  const hasSharedItems = data.some((e) => e.trangThai !== 3);

  if (hasSharedItems) {
    return false;
  }

  return data.some((e) => e.trangThai === 3);
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
export const getPermissionSigning = (data: any, user?: any, allStaffs = []) => {
  const signatureFlow: any[] = [];
  if (data?.nguoiLapPhieuKyNhay === true) {
    signatureFlow.push({
      id: data.idNguoiKyNhay,
      signed: data.trangThaiKyNhay === true,
      label: `Người lập phiếu: ${
        findById(allStaffs, data.idNguoiKyNhay)?.hoTen ?? ""
      }`,
    });
  }

  signatureFlow.push({
    id: data?.idTrinhDuyetCapPhong,
    signed: data?.trinhDuyetCapPhongXacNhan === true,
    label: `Người duyệt: ${data?.tenTrinhDuyetCapPhong ?? ""}`,
  });

  const listLen = data?.nguoiKyList?.length ?? 0;
  for (let i = 0; i < listLen; i++) {
    const item = data.nguoiKyList[i];
    signatureFlow.push({
      id: item?.idNguoiKy,
      signed: item?.trangThai === 1,
      label: `Người ký ${i + 1}: ${item?.tenNguoiKy ?? ""}`,
    });
  }

  signatureFlow.push({
    id: data?.idTrinhDuyetGiamDoc,
    signed: data?.trinhDuyetGiamDocXacNhan === true,
    label: `Người phê duyệt: ${data?.tenTrinhDuyetGiamDoc ?? ""}`,
  });
  const filtered = signatureFlow.filter(
    (step) => step.id != null && String(step.id).trim() !== "",
  );

  const currentIndex = filtered.findIndex(
    (s) => s.id === user?.taiKhoan?.tenDangNhap,
  );

  if (currentIndex === -1) return 2;

  if (
    data?.nguoiTao === user?.taiKhoan?.tenDangNhap &&
    filtered[currentIndex].signed !== -1
  ) {
    return filtered[currentIndex].signed === true ? 4 : 5;
  }

  if (filtered[currentIndex].signed === true) return 3;

  const previousNotSigned = filtered
    .slice(0, currentIndex)
    .find((s) => s.signed === false);
  if (previousNotSigned) return 1;
  return 0;
};
export const getTypeInfo = (typeValue: any) => {
  switch (Number(typeValue)) {
    case 1:
      return { title: "Cấp phát tài sản", label: "cấp phát tài sản" };
    case 2:
      return { title: "Điều chuyển tài sản", label: "điều chuyển tài sản" };
    case 3:
      return { title: "Thu hồi tài sản", label: "thu hồi tài sản" };
    default:
      return { title: "Cấp phát tài sản", label: "cấp phát tài sản" };
  }
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
      return { label: "Chưa ban hành", color: "#9c27b0" }; // Xanh lá
    case 4:
      return { label: "Đã ban hành", color: "#68b9f0" }; // Xanh lá
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

const getStatusDocument = (status: number) => {
  switch (status) {
    case 1:
      return { label: "Chưa tạo biên bản", color: "#f60808" }; // Đỏ
    case 2:
      return { label: "Bàn giao một phần", color: "#ff9800" }; // Cam
    case 3:
      return { label: "Đã bàn giao hết", color: "#0fadfc" }; // Xanh lá
    case 4:
      return { label: "Sắp quá hạn bàn giao", color: "#d40ffc" }; // Xanh lá
    case 5:
      return { label: "Đã quá hạn bàn giao", color: "#08f433" }; // Xanh lá
    default:
      return { label: "Không xác định", color: "#dee4e0" }; // Xám
  }
};
export const showStatusDocument = (status: number) => {
  const { label, color } = getStatusDocument(status);

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
export const showDownloadFile = (fileName: string, onDownload: () => void) => {
  return (
    <Chip
      icon={
        <FileDownloadOutlined style={{ fontSize: "14px", color: "#388e3c" }} />
      }
      label={fileName || "File"}
      onClick={(e) => {
        e.stopPropagation();
        onDownload();
      }}
      variant="outlined"
      sx={{
        backgroundColor: "#f1f8e9", // Tương đương Colors.green.shade50
        color: "#388e3c", // Tương đương Colors.green.shade700
        borderColor: "#c8e6c9", // Tương đương Colors.green.shade200
        borderRadius: "6px", // BorderRadius.circular(6)
        height: "24px", // Chiều cao compact cho bảng
        fontSize: "11px",
        fontWeight: 500,
        cursor: "pointer",
        maxWidth: "100%",
        "& .MuiChip-label": {
          px: 1, // Padding horizontal cho text
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        "&:hover": {
          backgroundColor: "#e8f5e9", // Hiệu ứng hover nhẹ
        },
      }}
    />
  );
};

// kiem tra quyen ky

/**
 * Xây dựng luồng ký dựa trên dữ liệu item
 */
const buildSignatureFlow = (item: any) => {
  const flow: { id: string; signed: boolean }[] = [];

  // 1. Người lập phiếu ký nháy
  if (item.nguoiLapPhieuKyNhay) {
    flow.push({ id: item.idNguoiKyNhay || "", signed: !!item.trangThaiKyNhay });
  }

  // 2. Trình duyệt cấp phòng
  flow.push({
    id: item.idTrinhDuyetCapPhong || "",
    signed: !!item.trinhDuyetCapPhongXacNhan,
  });

  // 3. Danh sách người ký bổ sung
  item.nguoiKyList?.forEach((sig: any) => {
    flow.push({ id: sig.idNguoiKy, signed: sig.trangThai === 1 });
  });

  // 4. Trình duyệt Giám đốc
  flow.push({
    id: item.idTrinhDuyetGiamDoc || "",
    signed: !!item.trinhDuyetGiamDocXacNhan,
  });

  // Lọc bỏ các bước không có ID (tương đương .where trong Dart)
  return flow.filter((step) => step.id && step.id.trim() !== "");
};

/**
 * Hàm chính để kiểm tra user hiện tại có được phép ký không
 */
export const canSign = (items: any[], userInfo: any): boolean => {
  // Kiểm tra điều kiện đầu vào (userInfo và chỉ xử lý 1 item tại một thời điểm)
  if (!userInfo || items.length !== 1) {
    return false;
  }
  const item = items[0];
  const signatureFlow = buildSignatureFlow(item);

  // Tìm vị trí của người dùng hiện tại trong luồng ký
  const currentIndex = signatureFlow.findIndex(
    (s) => s.id === userInfo?.taiKhoan?.tenDangNhap,
  );

  // 1. Nếu không có trong luồng ký
  // 2. Hoặc đã ký rồi (signed === true)
  if (currentIndex === -1 || signatureFlow[currentIndex].signed) {
    return false;
  }

  // Kiểm tra xem TẤT CẢ các người ký trước đó (currentIndex) đã ký chưa
  // .slice(0, currentIndex) tương đương .take(currentIndex) trong Dart
  return signatureFlow
    .slice(0, currentIndex)
    .every((step) => step.signed === true);
};

// hàm ký

export const handleSignDocument = async (
  item: any,
  userInfo: any,
  onSign?: (fileName: string, item: any) => void,
) => {
  // 1. Định nghĩa luồng ký theo thứ tự (giống _buildSignatureFlow)
  const signatureFlow = [
    ...(item.nguoiLapPhieuKyNhay
      ? [
          {
            id: item.idNguoiKyNhay,
            signed: !!item.trangThaiKyNhay,
            label: `Người lập phiếu: ${item.tenNguoiKyNhay}`,
          },
        ]
      : []),
    {
      id: item.idTrinhDuyetCapPhong,
      signed: !!item.trinhDuyetCapPhongXacNhan,
      label: `Người duyệt: ${item.tenTrinhDuyetCapPhong}`,
    },
    ...(item.nguoiKyList?.map((sig: any, index: number) => ({
      id: sig.idNguoiKy,
      signed: sig.trangThai === 1,
      label: `Người ký ${index + 1}: ${sig.tenNguoiKy}`,
    })) || []),
    {
      id: item.idTrinhDuyetGiamDoc,
      signed: !!item.trinhDuyetGiamDocXacNhan,
      label: `Người phê duyệt: ${item.tenTrinhDuyetGiamDoc}`,
    },
  ].filter((step) => step.id && step.id.trim() !== "");

  // 2. Kiểm tra trạng thái hoàn thành/hủy
  if (item.trangThai === 3 || item.trangThai === 2) {
    const message = item.trangThai === 2 ? "Đã bị hủy" : "Đã hoàn thành";
    showErrorAlert(`Phiếu này "${message}", không thể ký.`);
    return;
  }
  // 3. Kiểm tra user có trong flow không
  const currentIndex = signatureFlow.findIndex(
    (s) => s.id === userInfo?.taiKhoan?.tenDangNhap,
  );
  if (currentIndex === -1) {
    showErrorAlert("Bạn không có quyền ký văn bản này");
    return;
  }

  // 4. Kiểm tra nếu đã ký rồi
  if (signatureFlow[currentIndex].signed) {
    showErrorAlert("Bạn đã ký rồi.");
    return;
  }

  // 5. Kiểm tra các bước trước đó đã ký chưa (Tương đương take(currentIndex).firstWhere)
  const previousNotSigned = signatureFlow
    .slice(0, currentIndex)
    .find((s) => !s.signed);

  if (previousNotSigned) {
    showErrorAlert(
      `${previousNotSigned.label} chưa ký xác nhận, bạn chưa thể ký.`,
    );
    return;
  }

  // 6. Nếu vượt qua tất cả check → Load PDF và Preview
  try {
    onSign?.(item.tenFile || "", item);
  } catch (error) {
    showErrorAlert("Không thể tải tệp tin.");
  }
};

// kiem tra quyen xoa
export const isCheckShowDelete = (item: any, user: any) => {
  if (user === null) return false;

  return (
    user?.taiKhoan?.tenDangNhap === "admin" ||
    (item.trangThai === 0 && item.nguoiTao === user?.taiKhoan?.tenDangNhap)
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
};
export const listNguoiKy = (selectedItems: any[]) => {
  const allIds = new Set<string>();
  for (var item of selectedItems) {
    const id1 = item.idNguoiKyNhay;
    const id2 = item.idTrinhDuyetCapPhong;
    const id3 = item.idTrinhDuyetGiamDoc;

    if (id1) allIds.add(id1);
    if (id2) allIds.add(id2);
    if (id3) allIds.add(id3);
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
// ===== Kiểm tra xem user hiện tại có được phép ký không =====
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

// Tính tổng chiều cao của tất cả các trang (để làm mẫu số chung)
export const getTotalDocumentHeight = (sizes: { height: number }[]) => {
  return sizes.reduce((sum, size) => sum + size.height, 0);
};

// Chuyển đổi: Tọa độ trang con -> Tọa độ toàn cục (Dùng khi thả chuột - onDrop)
export const localToGlobal = (
  localYRatio: number, // 0-1 trong trang hiện tại
  pageIndex: number,
  sizes: { height: number }[],
) => {
  const totalHeight = getTotalDocumentHeight(sizes);
  let previousPagesHeight = 0;
  for (let i = 0; i < pageIndex; i++) {
    previousPagesHeight += sizes[i].height;
  }

  // Chiều cao tính theo pixel từ đỉnh tài liệu đến điểm thả
  const globalYPixel =
    previousPagesHeight + localYRatio * sizes[pageIndex].height;

  // Trả về tỉ lệ 0-1 toàn cục
  return globalYPixel / totalHeight;
};

// Chuyển đổi: Tọa độ toàn cục -> Trang và Tọa độ con (Dùng khi Render và Export)
export const globalToLocal = (
  globalYRatio: number,
  sizes: { height: number }[],
) => {
  const totalHeight = getTotalDocumentHeight(sizes);
  const targetPixel = globalYRatio * totalHeight;

  let currentHeightAccumulator = 0;

  for (let i = 0; i < sizes.length; i++) {
    const pageHeight = sizes[i].height;

    // Kiểm tra xem điểm Y có nằm trong trang này không
    if (
      targetPixel >= currentHeightAccumulator &&
      targetPixel <= currentHeightAccumulator + pageHeight
    ) {
      // Tìm thấy trang!
      const localPixel = targetPixel - currentHeightAccumulator;
      return {
        pageIndex: i, // Index bắt đầu từ 0
        localYRatio: localPixel / pageHeight,
      };
    }
    currentHeightAccumulator += pageHeight;
  }

  // Fallback (nếu y=1 hoặc lỗi làm tròn): Trả về trang cuối
  return {
    pageIndex: sizes.length - 1,
    localYRatio: 1,
  };
};

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import S3Service from "../../../services/S3Service";

export const generateBangKePdf = async (
  assetTransferDetail?: any[],
  allUnits?: any[],
  allCurrentStatus?: any[],
): Promise<Uint8Array> => {
  const doc = new jsPDF();

  doc.setFont("times_new_roman", "normal");
  doc.setFontSize(13);
  doc.text("BẢNG KÊ CHI TIẾT", 105, 15, { align: "center" });
  const tableData = (
    Array.isArray(assetTransferDetail) ? assetTransferDetail : []
  ).map((item: any, index: number) => {
    // Kiểm tra an toàn: Chỉ gọi findById khi mảng là hợp lệ
    const unit = Array.isArray(allUnits)
      ? findById(allUnits, item?.donViTinh)
      : null;
    const status = Array.isArray(allCurrentStatus)
      ? findById(allCurrentStatus, item?.hienTrang)
      : null;

    return [
      index + 1,
      item?.tenTaiSan || "",
      unit?.tenDonVi || "",
      item.soLuong || 0,
      status?.tenHTKT || "",
      item.ghiChu || "",
    ];
  });

  autoTable(doc, {
    startY: 25,
    head: [
      [
        "Stt",
        "Tên tài sản",
        "Đơn vị tính",
        "Số lượng",
        "Tình trạng kĩ thuật",
        "Ghi chú",
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
      fontStyle: "normal",
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
      0: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
    },
  });

  return new Uint8Array(doc.output("arraybuffer"));
};

export const mergeBangKeWithOriginalPdf = async (
  tailieu?: File | Blob | string | null,
  bangKeBytes?: Uint8Array | null,
): Promise<File | null> => {
  if (!bangKeBytes) return null;

  try {
    const mergedPdf = await PDFDocument.create();
    if (tailieu) {
      let existingPdfBytes: ArrayBuffer;
      // 1. Xử lý lấy dữ liệu từ tailieu
      if (typeof tailieu === "string") {
        // Nếu là string, giả định là URL/Key từ S3
        const s3Url = await S3Service.presignedGetUrl(tailieu);
        const response = await fetch(s3Url);
        if (!response.ok) throw new Error("Không thể tải tài liệu quyết định");
        existingPdfBytes = await response.arrayBuffer();
      } else {
        // Nếu là File object
        existingPdfBytes = await tailieu.arrayBuffer();
      }
      // 2. Load và Merge file gốc
      const pdf1 = await PDFDocument.load(existingPdfBytes);
      const copiedPages1 = await mergedPdf.copyPages(
        pdf1,
        pdf1.getPageIndices(),
      );
      copiedPages1.forEach((page) => mergedPdf.addPage(page));
    }

    // 3. Load và Merge file Bảng kê
    const pdf2 = await PDFDocument.load(bangKeBytes);
    const copiedPages2 = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
    copiedPages2.forEach((page) => mergedPdf.addPage(page));

    // 4. Xuất file cuối cùng
    const finalPdfBytes = await mergedPdf.save();

    // 5. Tạo đối tượng File để sẵn sàng upload lại S3
    const finalFile = new File(
      [finalPdfBytes.buffer as ArrayBuffer],
      "merged_document.pdf",
      {
        type: "application/pdf",
      },
    );

    return finalFile;
  } catch (error) {
    console.error("Lỗi khi merge PDF:", error);
    return null;
  }
};
