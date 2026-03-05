import { Chip } from "@mui/material";
import { PlanType, StatusPlan, StatusPlanType } from "../../../utils/const";

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

export const showPlanType = (type: string) => {
  const label = () => {
    switch (type) {
      case PlanType.DEVICE:
        return "Theo thiết bị";
      case PlanType.WORK:
        return "Theo chu kỳ thời gian";
      case PlanType.TIME:
        return "Theo giờ máy";
      default:
        return "";
    }
  };

  return <p>{label()}</p>;
};

export const showPeriod = (time: string) => {
  if (!time) return "";

  const date = new Date(time);

  // Kiểm tra nếu string truyền vào không đúng định dạng ngày tháng
  if (isNaN(date.getTime())) return "Thời gian không hợp lệ";

  const month = date.getMonth() + 1; // getMonth() trả về 0-11
  const year = date.getFullYear();

  // Tính Quý: Tháng 1,2,3 -> Quý 1; Tháng 4,5,6 -> Quý 2...
  const quarter = Math.ceil(month / 3);

  return `Tháng ${month}. Quý ${quarter}. Năm ${year}`;
};
