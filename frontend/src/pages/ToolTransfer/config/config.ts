import { ToolTransferData } from "../types";

// 1. Logic lấy tiêu đề (tương đương getScreenTitle trong Flutter)
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

// 2. Logic Trạng thái (tương đương FilterStatus trong Flutter)
export const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Nháp", color: "#C0C0C0" }, // silverGray
  1: { label: "Duyệt", color: "#00FFFF" }, // cyan
  2: { label: "Hủy", color: "#FF7F50" }, // coral
  3: { label: "Hoàn thành", color: "#228B22" }, // forestGreen
};

// 3. Logic kiểm tra quyền ký (Chuyển thể từ isCheckSigningStatus của Flutter)
// Trả về: 0: Chưa ký, 1: Đã ký, 4: Chờ ký nháy, 5: Chờ người tạo xem...
export const getToolSigningStatus = (
  item: ToolTransferData,
  currentUser: any,
) => {
  const userName = currentUser?.taiKhoan?.tenDangNhap?.toLowerCase();

  // Xây dựng luồng ký giống Flutter
  const signatureFlow = [
    { id: item.nguoiTao, signed: -1 },
    ...(item.nguoiLapPhieuKyNhay
      ? [{ id: item.idNguoiKyNhay, signed: item.trangThaiKyNhay }]
      : []),
    { id: item.idTrinhDuyetCapPhong, signed: item.trinhDuyetCapPhongXacNhan },
    { id: item.idTrinhDuyetGiamDoc, signed: item.trinhDuyetGiamDocXacNhan },
    ...(item.nguoiKyList || []).map((s) => ({
      id: s.idNguoiKy,
      signed: s.trangThai === 1,
    })),
  ];

  const currentIndex = signatureFlow.findIndex(
    (s) => s.id?.toLowerCase() === userName,
  );
  if (currentIndex === -1) return -1;

  const currentSigner = signatureFlow[currentIndex];

  // Logic đặc biệt cho ký nháy
  if (
    item.nguoiLapPhieuKyNhay &&
    item.idNguoiKyNhay?.toLowerCase() === userName
  ) {
    return item.trangThaiKyNhay ? 2 : 4;
  }

  return currentSigner.signed ? 1 : 0;
};
