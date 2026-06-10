import { Chip, Box } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";
import { ToolTransferData } from "../types";
import { findById } from "../../../utils/helpers";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../../components/Alert";
import { MessageTypeFunctions } from "../../../utils/const";
import socketService from "../../../services/socketService";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

// 1. Thông tin tiêu đề theo loại phiếu
export const getTypeInfo = (type: string | number | null) => {
  switch (Number(type)) {
    case 1:
      return { title: "Cấp phát CCDC - Vật tư", label: "cấp phát CCDC - Vật tư" };
    case 2:
      return { title: "Điều chuyển CCDC - Vật tư", label: "điều chuyển CCDC - Vật tư" };
    case 3:
      return { title: "Thu hồi CCDC - Vật tư", label: "thu hồi CCDC - Vật tư" };
    default:
      return { title: "Quản lý CCDC - Vật tư", label: "CCDC - Vật tư" };
  }
};

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
// 2. Map dữ liệu trạng thái

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

// 4. Hiển thị Chip Trạng thái bàn giao
export const showStatusDocument = (status: number) => {
  let config = { label: "Chưa có", color: "#dee4e0" };
  switch (status) {
    case 1:
      config = { label: "Chưa tạo biên bản", color: "#f60808" };
      break;
    case 2:
      config = { label: "Bàn giao một phần", color: "#ff9800" };
      break;
    case 3:
      config = { label: "Đã bàn giao hết", color: "#0fadfc" };
      break;
    case 4:
      config = { label: "Sắp quá hạn", color: "#d40ffc" };
      break;
    case 5:
      config = { label: "Đã quá hạn", color: "#4caf50" };
      break;
  }
  return (
    <Chip
      label={config.label}
      sx={{
        backgroundColor: config.color,
        color: "white",
        fontWeight: 500,
        fontSize: "12px",
        borderRadius: "4px",
        height: "22px",
      }}
    />
  );
};

// 5. Hiển thị Chip Trình duyệt (Share)
export const showShareStatus = (isShare: boolean, isMyCreated: boolean) => {
  return (
    <Chip
      label={isShare ? (isMyCreated ? "Đã gửi" : "Được gửi") : "Chưa gửi"}
      sx={{
        backgroundColor: isShare ? "#4caf50" : "#f30d0d",
        color: "white",
        fontWeight: 500,
        fontSize: "12px",
        borderRadius: "4px",
        height: "22px",
      }}
    />
  );
};

// 6. Hiển thị nút tải file
export const showDownloadFile = (fileName: string, onDownload: () => void) => {
  return (
    <Chip
      icon={
        <FileDownloadOutlined style={{ fontSize: "16px", color: "#388e3c" }} />
      }
      label={fileName || "Tài liệu"}
      onClick={(e) => {
        e.stopPropagation();
        onDownload();
      }}
      variant="outlined"
      sx={{
        backgroundColor: "#f1f8e9",
        color: "#388e3c",
        borderColor: "#c8e6c9",
        borderRadius: "6px",
        height: "26px",
        fontSize: "11px",
        cursor: "pointer",
        maxWidth: "180px",
        "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
      }}
    />
  );
};

// 7. Logic kiểm tra quyền xóa
export const isCheckShowDelete = (item: any, user: any) => {
  if (!user) return false;
  return (
    user?.taiKhoan?.tenDangNhap === "admin" ||
    (item.trangThai === 0 && item.nguoiTao === user?.taiKhoan?.tenDangNhap)
  );
};

// 8. Logic lấy trạng thái ký và hiển thị Chip tương ứng
export const getToolSigningStatus = (
  item: ToolTransferData,
  currentUser: any,
) => {
  const userName = currentUser?.taiKhoan?.tenDangNhap;
  const signatureFlow = [
    { id: item.nguoiTao, signed: true },
    ...(item.nguoiLapPhieuKyNhay
      ? [{ id: item.idNguoiKyNhay, signed: item.trangThaiKyNhay }]
      : []),
    { id: item.idTrinhDuyetCapPhong, signed: item.trinhDuyetCapPhongXacNhan },
    { id: item.idTrinhDuyetGiamDoc, signed: item.trinhDuyetGiamDocXacNhan },
  ];

  const currentIndex = signatureFlow.findIndex((s) => s.id === userName);
  if (currentIndex === -1) return 2; // Không có quyền
  if (item.nguoiTao === userName) return item.trangThai === 0 ? 5 : 3;
  if (signatureFlow[currentIndex].signed) return 3;

  const isPending = signatureFlow.slice(0, currentIndex).some((s) => !s.signed);
  return isPending ? 1 : 0;
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

export const canUserSign = (newSigningType: number, signatures: any[]) => {
  const hasDigitalSignature = signatures.some((img) =>
    [3, 4, 5].includes(img.loaiKy),
  );

  if (hasDigitalSignature && ![3, 4, 5].includes(newSigningType)) {
    return false;
  }

  if (newSigningType === 1) return true; // Luôn cho phép ký nháy

  const userNewSignatures = signatures.filter((img) => !img.isLocked);
  if (userNewSignatures.length === 0) return true;

  const hasNonType1Signature = userNewSignatures.some(
    (img) => img.loaiKy !== 1,
  );
  return !hasNonType1Signature;
};

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
        await onUpdate(notSharedItems.map((e) => ({ ...e, share: true })));
        const list = await listNguoiKy(selectedItems);
        socketService.send({
          type: MessageTypeFunctions.TOOL_TRANSFER,
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

export const generateBangKePdf = async (
  toolTransferDetail: any[],
  allUnits: any[],
): Promise<Uint8Array> => {
  const doc = new jsPDF();

  doc.setFont("times_new_roman", "normal");
  doc.setFontSize(13);
  doc.text("BẢNG KÊ CHI TIẾT", 105, 15, { align: "center" });
  const tableData = (
    Array.isArray(toolTransferDetail) ? toolTransferDetail : []
  ).map((item: any, index: number) => {
    // Kiểm tra an toàn: Chỉ gọi findById khi mảng là hợp lệ
    const unit = Array.isArray(allUnits)
      ? findById(allUnits, item?.donViTinh)
      : null;
    return [
      index + 1,
      item?.tenCCDCVatTu || "",
      unit?.tenDonVi || "",
      item.soLuong || 0,
      item.soLuongXuat || 0,
      item.soLuongDaBanGiao || 0,
      item.ghiChu || "",
    ];
  });

  autoTable(doc, {
    startY: 25,
    head: [
      [
        "Stt",
        "Tên CCDC, Vật tư",
        "Đơn vị tính",
        "Số lượng có sẵn",
        "Số lượng xuất kho",
        "Số lượng đã bàn giao",
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
      5: { halign: "center" },
    },
  });

  return new Uint8Array(doc.output("arraybuffer"));
};
