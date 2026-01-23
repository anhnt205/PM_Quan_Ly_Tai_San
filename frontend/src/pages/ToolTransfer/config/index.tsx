import { Chip, Box } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";
import { ToolTransferData } from "../types";

// 1. Thông tin tiêu đề theo loại phiếu
export const getTypeInfo = (type: string | number | null) => {
  switch (Number(type)) {
    case 1:
      return { title: "Cấp phát CCDC - Vật tư", label: "cấp phát" };
    case 2:
      return { title: "Điều chuyển CCDC - Vật tư", label: "điều chuyển" };
    case 3:
      return { title: "Thu hồi CCDC - Vật tư", label: "thu hồi" };
    default:
      return { title: "Quản lý CCDC - Vật tư", label: "CCDC" };
  }
};

// 2. Map dữ liệu trạng thái
export const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Nháp", color: "#9e9e9e" },
  1: { label: "Đã duyệt", color: "#00bcd4" },
  2: { label: "Đã hủy", color: "#ff5722" },
  3: { label: "Hoàn thành", color: "#4caf50" },
};

// 3. Hiển thị Chip Trạng thái phiếu
export const showStatus = (status: number) => {
  const config = statusMap[status] || {
    label: "Không xác định",
    color: "#dee4e0",
  };
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
  let config = { label: "Không rõ", color: "#dee4e0" };
  switch (status) {
    case 0:
      config = { label: "Đến lượt ký", color: "#00bcd4" };
      break;
    case 1:
      config = { label: "Chờ người trước", color: "#ff9800" };
      break;
    case 2:
      config = { label: "Chưa đến lượt", color: "#9e9e9e" };
      break;
    case 3:
      config = { label: "Đã ký xong", color: "#4caf50" };
      break;
    case 4:
      config = { label: "Chờ ký nháy", color: "#795548" };
      break;
    case 5:
      config = { label: "Chờ xem duyệt", color: "#2196f3" };
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
