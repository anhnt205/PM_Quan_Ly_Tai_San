import {
  Box,
  Checkbox,
  Chip,
  Typography,
  styled,
  CheckboxProps,
  alpha,
} from "@mui/material";
import { Check, FilterList } from "@mui/icons-material";

const COLORS = {
  default: "#757575",
  primary: "#1976d2",
  secondary: "#9c27b0",
  error: "#d32f2f",
  info: "#0288d1",
  success: "#2e7d32",
  warning: "#ed6c02",
};

const BpIcon = styled("span")<{ customColor: string }>(
  ({ theme, customColor }) => ({
    borderRadius: 3,
    width: 18,
    height: 18,
    // Viền sử dụng màu customColor, nền trắng
    boxShadow: `inset 0 0 0 1px ${customColor}, inset 0 -1px 0 ${alpha(
      customColor,
      0.2
    )}`,
    backgroundColor: "#fff",
    transition: "all 0.2s",

    // Khi hover vào ô input, làm viền đậm hơn hoặc nền tối hơn chút
    "input:hover ~ &": {
      backgroundColor: alpha(customColor, 0.02),
      boxShadow: `inset 0 0 0 2px ${customColor}`, // Viền dày hơn khi hover
    },
  })
);

const BpCheckedIconRoot = styled("span")<{ customcolor: string }>(
  ({ customcolor }) => ({
    borderRadius: 3,
    width: 18,
    height: 18,
    backgroundColor: customcolor,
    border: `1px solid ${customcolor}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff", // Màu của dấu tick
    transition: "all 0.2s",

    // Khi hover vào checkbox đã check
    ".MuiCheckbox-root:hover &": {
      backgroundColor: alpha(customcolor, 0.9), // Tối đi 1 chút để biết đang hover
    },
  })
);

const BpCheckedIcon = ({ customColor }: { customColor: string }) => {
  return (
    <BpCheckedIconRoot customcolor={customColor}>
      <Check sx={{ fontSize: 14, fontWeight: "bold" }} />
    </BpCheckedIconRoot>
  );
};

const CustomCheckbox = (
  props: CheckboxProps & { colorKey: keyof typeof COLORS }
) => {
  const colorHex = COLORS[props.colorKey] || COLORS.default;

  return (
    <Checkbox
      color="default"
      checkedIcon={<BpCheckedIcon customColor={colorHex} />}
      icon={<BpIcon customColor={colorHex} />}
      inputProps={{ "aria-label": "Checkbox demo" }}
      sx={{
        p: 1,
        mr: 0.5,
        color: colorHex,
        "&:hover": {
          // Hiệu ứng nền tròn bao quanh khi hover (màu nhạt 10%)
          bgcolor: alpha(colorHex, 0.1),
        },
        "&.Mui-checked": {
          color: colorHex,
        },
      }}
      {...props}
    />
  );
};

const renderStatusChip = (count: number, colorKey: keyof typeof COLORS) => {
  const colorHex = COLORS[colorKey] || COLORS.default;

  return (
    <Chip
      label={count}
      size="small"
      sx={{
        height: 22,
        width: 22, // Set width = height để tròn
        borderRadius: "50%", // Hình tròn
        fontSize: 11,
        ml: 0.5,
        bgcolor: alpha(colorHex, 0.15), // Nền nhạt
        color: colorHex, // Chữ đậm
        fontWeight: "bold",
        "& .MuiChip-label": {
          padding: 0, // Reset padding để số nằm chính giữa hình tròn
        },
      }}
    />
  );
};

const FilterItem = ({
  label,
  count,
  color = "default",
  defaultChecked = false,
}: {
  label: string;
  count: number;
  color?: keyof typeof COLORS;
  defaultChecked?: boolean;
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        cursor: "pointer",
        "& .MuiTypography-root": { userSelect: "none" },
        "&:hover .MuiCheckbox-root": {
          bgcolor: alpha(COLORS[color] || COLORS.default, 0.1),
        },
      }}
    >
      <CustomCheckbox defaultChecked={defaultChecked} colorKey={color} />

      <Typography
        variant="body2"
        sx={{
          fontSize: "14px",
          color: "text.primary",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
        }}
      >
        {label} {renderStatusChip(count, color)}
      </Typography>
    </Box>
  );
};

interface FilterBarProps {
  totalCount: number;
}

export default function FilterBar({ totalCount }: FilterBarProps) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid",
        borderColor: "divider",
        borderRadius: "8px 8px 0 0",
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            bgcolor: "#f5f5f5",
            p: 0.5,
            borderRadius: 1,
            display: "flex",
          }}
        >
          <FilterList color="action" fontSize="small" />
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          Phiếu duyệt cấp phát tài sản{" "}
          <span style={{ color: "#1976d2" }}>({totalCount})</span>
        </Typography>
      </Box>

      <Box display="flex" gap={2}>
        <FilterItem
          label="Tất cả"
          count={0}
          defaultChecked
          color="default" // Màu xám
        />
        <FilterItem label="Nháp" count={0} color="default" />
        <FilterItem label="Duyệt" count={1} color="info" />{" "}
        <FilterItem label="Hủy" count={1} color="error" />
        <FilterItem label="Hoàn thành" count={1} color="success" />
      </Box>
    </Box>
  );
}
