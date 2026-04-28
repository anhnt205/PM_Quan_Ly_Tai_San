import { Chip } from "@mui/material";
import { PlanType, StatusPlan, StatusPlanType } from "../../../utils/const";
import { MaintenancePlanData } from "../types";
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from "../../../components/Alert";

const getStatusDetails = (status: StatusPlanType) => {
  switch (status) {
    case StatusPlan.PENDING:
      return { label: "Chưa thực hiện", color: "#9e9e9e" }; // Xám
    case StatusPlan.PROGRESS:
      return { label: "Đang thực hiện", color: "#9c27b0" }; // Cam
    case StatusPlan.COMPLETED:
      return { label: "Đã hoàn thành", color: "#4caf50" }; // Xanh lá
    default:
      return { label: "Chưa thực hiện", color: "#9e9e9e" }; // Xám
  }
};

export const showStatus = (status: StatusPlanType) => {
  const { label, color } = getStatusDetails(status);

  return (
    <Chip
      label={label}
      sx={{
        backgroundColor: color,
        color: "white",
        fontWeight: 500,
        fontSize: "12px",
        borderRadius: "4px",
        height: "auto",
        padding: "1px 5px",
        mb: "2px",
        "& .MuiChip-label": {
          padding: 0,
        },
      }}
    />
  );
};

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

export const handleSendToSigner = async (
  items: MaintenancePlanData[],
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
        // const list = await listNguoiKy(items);
        // socketService.send({
        //   type: MessageTypeFunctions.ASSET_HANDOVER,
        //   recieve: list,
        // });
        showSuccessAlert("Trình duyệt phiếu thành công!");
        onClose();
      } catch (error) {
        showErrorAlert("Có lỗi xảy ra khi trình duyệt phiếu.");
      }
    }
  }
};
export const getNotSharedAndNotify = (
  items: MaintenancePlanData[],
): MaintenancePlanData[] => {
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
        e.soKeHoach?.trim() ? e.soKeHoach : e.id || "",
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
