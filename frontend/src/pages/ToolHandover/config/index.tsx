import { Box, Chip, Typography } from "@mui/material";
import { ToolHandoverData } from "../types";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../../components/Alert";
import socketService from "../../../services/socketService";
import { MessageTypeFunctions } from "../../../utils/const";

export const getStatusHandoverText = (status: number) => {
  switch (status) {
    case 0:
      return "Chưa hoàn thành";
    case 1:
      return "Sắp hết hạn";
    case 2:
      return "Đã hoàn thành";
    default:
      return "Không xác định";
  }
};

export const getStatusHandoverColor = (status: number) => {
  switch (status) {
    case 0:
      return "orange";
    case 1:
      return "red";
    case 2:
      return "green";
    default:
      return "grey";
  }
};

export const StatusHandover = (status: number) => {
  return (
    <Box
      sx={{
        maxHeight: 48,
        px: "5px",
        py: "2px",
        mb: "2px",
        backgroundColor: getStatusHandoverColor(status),
        borderRadius: "4px",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {getStatusHandoverText(status)}
      </Typography>
    </Box>
  );
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

interface SignatureStep {
  id: string;
  signed: boolean;
}

const buildSignatureFlow = (item: any): SignatureStep[] => {
  if (!item) return [];

  const steps: (SignatureStep | null)[] = [
    {
      id: item.idDaiDienBenGiao,
      signed: item.daiDienBenGiaoXacNhan === true,
    },
    {
      id: item.idDaiDienBenNhan,
      signed: item.daiDienBenNhanXacNhan === true,
    },

    ...(Array.isArray(item.listSignatory)
      ? item.listSignatory.map((e: any) => ({
          id: e.idNguoiKy,
          signed: e.trangThai === 1,
        }))
      : []),

    {
      id: item.idGiamDoc,
      signed: item.giamDocKy === true,
    },
  ];

  return steps.filter((s): s is SignatureStep => Boolean(s?.id));
};
export const canSign = (items: any[], user?: any): boolean => {
  if (!user || items.length !== 1) return false;

  const item = items[0];
  const signatureFlow = buildSignatureFlow(item);

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

export const handleSendToSigner = async (
  items: ToolHandoverData[],
  onUpdate: (data: any[]) => Promise<any>,
  onClose: () => void,
) => {
  if (!items || items.length === 0) {
    showErrorAlert("Không có phiếu nào cần trình duyệt");
    return;
  }
  // 2. Hiển thị Dialog xác nhận (tương tự showConfirmDialog trong Flutter)
  const confirm = await showConfirmAlert(
    "Bạn có chắc muốn trình duyệt cho người ký?",
  );

  if (confirm.isConfirmed) {
    // 3. Lọc danh sách hợp lệ
    const notSharedItems = getNotSharedAndNotify(items);

    if (notSharedItems.length > 0) {
      try {
        await onUpdate(notSharedItems.map((e) => ({ ...e, share: true })));
        const list = await listNguoiKy(items);
        socketService.send({
          type: MessageTypeFunctions.TOOL_HANDOVER,
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
    const id1 = item.idDaiDiendonviBanHanhQD;
    const id2 = item.idDaiDienBenGiao;
    const id3 = item.idDaiDienBenNhan;
    const id4 = item.idGiamDoc;

    if (id1) allIds.add(id1);
    if (id2) allIds.add(id2);
    if (id3) allIds.add(id3);
    if (id4) allIds.add(id4);

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

export const getNotSharedAndNotify = (
  items: ToolHandoverData[],
): ToolHandoverData[] => {
  if (!items || items.length === 0) {
    showErrorAlert("Không có phiếu nào để chia sẻ");
    return [];
  }

  const alreadyShared = items.filter((e) => e.share === true);
  const notShared = items.filter((e) => e.share !== true);

  if (notShared.length === 0) {
    showErrorAlert("Các phiếu này đều đã được chia sẻ");
    return [];
  }

  if (alreadyShared.length > 0) {
    const names = alreadyShared
      .map((e) =>
        e.quyetDinhDieuDongSo?.trim() ? e.quyetDinhDieuDongSo : e.id || "",
      )
      .filter(Boolean)
      .join(", ");

    showErrorAlert(
      names
        ? `Các phiếu đã được chia sẻ: ${names}`
        : "Có phiếu đã được chia sẻ trong danh sách chọn",
    );
  }

  return notShared;
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
export const getPermissionSigning = (
  data: ToolHandoverData,
  user?: any,
): number => {
  const signatureFlow = [
    {
      id: data.idDaiDienBenGiao,
      signed: data.daiDienBenGiaoXacNhan === true,
    },
    {
      id: data.idDaiDienBenNhan,
      signed: data.daiDienBenNhanXacNhan === true,
    },
    ...(data.nguoiKyList?.length
      ? data.nguoiKyList.map((e) => ({
          id: e.idNguoiKy,
          signed: e.trangThai === 1,
        }))
      : []),
    {
      id: data.idGiamDoc,
      signed: data.giamDocKy === true,
    },
  ].filter((step) => step.id && step.id.trim() !== "");

  const currentIndex = signatureFlow.findIndex(
    (s) => s.id === user?.taiKhoan?.tenDangNhap,
  );

  if (currentIndex === -1) return 2;

  // Người đại diện đơn vị ban hành QĐ
  if (data.nguoiTao === user?.taiKhoan?.tenDangNhap) {
    return signatureFlow[currentIndex].signed ? 4 : 5;
  }

  if (signatureFlow[currentIndex].signed) return 3;

  const previousNotSigned = signatureFlow
    .slice(0, currentIndex)
    .find((s) => s.signed === false);

  if (previousNotSigned) return 1;

  return 0;
};
export const isCheckShowShare = (items: ToolHandoverData[]): boolean => {
  if (!items || items.length === 0) return false;

  const hasSharedItems = items.some((e) => e.share === true);
  if (hasSharedItems) return false;

  return items.some((e) => e.share !== true);
};

export const handleSignDocument = async (
  item: any,
  userInfo: any,
  onSign: (fileName: string, item: any) => void,
) => {
  // 1️⃣ Build signature flow (giống Flutter)
  const signatureFlow = [
    {
      id: item.idDaiDienBenGiao,
      signed: item.daiDienBenGiaoXacNhan === true,
      label: `Đại diện đơn vị giao: ${item.tenDaiDienBenGiao ?? ""}`,
    },
    {
      id: item.idDaiDienBenNhan,
      signed: item.daiDienBenNhanXacNhan === true,
      label: `Đại diện đơn vị nhận: ${item.tenDaiDienBenNhan ?? ""}`,
    },
    ...(item.listSignatory?.map((e: any) => ({
      id: e.idNguoiKy,
      signed: e.trangThai === 1,
      label: `Người ký: ${e.tenNguoiKy ?? ""}`,
    })) ?? []),
    {
      id: item.idGiamDoc,
      signed: item.giamDocKy === true,
      label: `Giám đốc ký duyệt: ${item.tenGiamDoc ?? ""}`,
    },
  ].filter((s) => s.id && s.id.trim() !== "");

  // 2️⃣ Không có quyền ký
  if (signatureFlow.length === 0) {
    showErrorAlert("Bạn không có quyền ký biên bản này");
    return;
  }

  // 3️⃣ Kiểm tra user có trong flow không
  const currentIndex = signatureFlow.findIndex(
    (s) => s.id === userInfo?.taiKhoan?.tenDangNhap,
  );

  if (currentIndex === -1) {
    showErrorAlert("Bạn không có quyền ký văn bản này");
    return;
  }

  // 4️⃣ Đã ký rồi
  if (signatureFlow[currentIndex].signed) {
    showErrorAlert("Bạn đã ký rồi.");
    return;
  }

  // 5️⃣ Kiểm tra các bước trước đã ký chưa
  const previousNotSigned = signatureFlow
    .slice(0, currentIndex)
    .find((s) => s.signed === false);

  if (previousNotSigned) {
    showErrorAlert(
      `${previousNotSigned.label} chưa ký xác nhận, bạn chưa thể ký.`,
    );
    return;
  }

  // 6️⃣ Kiểm tra file
  const tenFile = item.tenFile;
  if (!tenFile) {
    showErrorAlert("Không tìm thấy tệp để xem / ký");
    return;
  }

  // 7️⃣ Load PDF + preview (thay cho _loadPdfNetwork + previewDocumentHandover)
  try {
    onSign(tenFile, item);
  } catch (error) {
    showErrorAlert("Không thể tải tệp tin.");
  }
};

export const isCheckShowDelete = (item: any, user: any) => {
  if (user === null) return false;

  return (
    user?.taiKhoan?.tenDangNhap === "admin" ||
    (item.trangThai === 0 && item.nguoiTao === user?.taiKhoan?.tenDangNhap)
  );
};
