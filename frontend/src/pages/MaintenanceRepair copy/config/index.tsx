import { Chip } from "@mui/material";

const getStatusDetails = (status: number) => {
  switch (status) {
    case 0:
      return { label: "Nháp", color: "#9e9e9e" }; // Xám
    case 1:
      return { label: "Duyệt", color: "#ff9800" }; // Cam
    case 2:
      return { label: "Đang sửa chữa", color: "#9c27b0" }; // Tím
    case 3:
      return { label: "Hủy", color: "#f44336" }; // Đỏ
    case 4:
      return { label: "Hoàn thành", color: "#4caf50" }; // Xanh lá
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
