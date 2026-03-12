import { Chip } from "@mui/material";

export const ShowStatus = (status: number) => {
  // Định nghĩa cấu hình cho từng trạng thái
  const getStatusConfig = (status: number) => {
    switch (status) {
      case 1:
        return { label: "Đã đăng kiểm", color: "#4caf50" }; // OrangeAccent
      default:
        return { label: "Sắp hết hanjn đăng kiểm", color: "#f44336" }; // Green
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
