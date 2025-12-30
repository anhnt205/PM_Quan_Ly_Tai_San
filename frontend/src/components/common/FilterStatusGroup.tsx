import {
  Box,
  Checkbox,
  Chip,
  Typography,
  styled,
  CheckboxProps,
  alpha,
} from "@mui/material";
import { Check } from "@mui/icons-material";

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
    boxShadow: `inset 0 0 0 1px ${customColor}, inset 0 -1px 0 ${alpha(
      customColor,
      0.2
    )}`,
    backgroundColor: "#fff",
    transition: "all 0.2s",
    "input:hover ~ &": {
      backgroundColor: alpha(customColor, 0.02),
      boxShadow: `inset 0 0 0 2px ${customColor}`,
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
    color: "#fff",
    transition: "all 0.2s",
    ".MuiCheckbox-root:hover &": {
      backgroundColor: alpha(customcolor, 0.9),
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
      sx={{
        mr: 0.5,
        color: colorHex,
        "&:hover": {
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
        width: 22,
        borderRadius: "50%",
        fontSize: 11,
        ml: 0.5,
        bgcolor: alpha(colorHex, 0.15),
        color: colorHex,
        fontWeight: "bold",
        "& .MuiChip-label": {
          padding: 0,
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
        ml: 2, // Tạo khoảng cách giữa các item
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

export const FilterStatusGroup = () => {
  return (
    <Box display="flex" alignItems="center">
      <FilterItem label="Tất cả" count={0} defaultChecked color="default" />
      <FilterItem label="Nháp" count={0} color="default" />
      <FilterItem label="Duyệt" count={1} color="info" />
      <FilterItem label="Hủy" count={1} color="error" />
      <FilterItem label="Hoàn thành" count={1} color="success" />
    </Box>
  );
};
