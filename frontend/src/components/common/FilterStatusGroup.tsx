import React from "react";
import {
  Box,
  Checkbox,
  Typography,
  styled,
  CheckboxProps,
  alpha,
} from "@mui/material";
import { Check } from "@mui/icons-material";

const COLORS = {
  default: "#424242", // Tất cả (Đen/Xám đậm)
  success: "#4caf50", // Cấp phát (Xanh lá)
  info: "#2196f3", // Điều chuyển (Xanh dương)
  error: "#ff7043", // Thu hồi (Cam đỏ)
  primary: "#1976d2",
  secondary: "#9c27b0",
  warning: "#ed6c02",
};

// --- Styled Components cho Checkbox Custom ---
const BpIcon = styled("span")<{ customColor: string }>(({ customColor }) => ({
  borderRadius: 3,
  width: 18,
  height: 18,
  boxShadow: `inset 0 0 0 1px ${customColor}`,
  backgroundColor: "#fff",
  transition: "all 0.2s",
  "input:hover ~ &": {
    backgroundColor: alpha(customColor, 0.05),
    boxShadow: `inset 0 0 0 2px ${customColor}`,
  },
}));

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
  })
);

const CustomCheckbox = (
  props: CheckboxProps & { colorKey: keyof typeof COLORS }
) => {
  const colorHex = COLORS[props.colorKey] || COLORS.default;
  return (
    <Checkbox
      color="default"
      checkedIcon={
        <BpCheckedIconRoot customcolor={colorHex}>
          <Check sx={{ fontSize: 14, fontWeight: "bold" }} />
        </BpCheckedIconRoot>
      }
      icon={<BpIcon customColor={colorHex} />}
      sx={{
        p: 0.5,
        "&.Mui-checked": { color: colorHex },
      }}
      {...props}
    />
  );
};

// --- Badge số lượng màu xám tròn ---
const StatusCountBadge = ({ count }: { count: number }) => (
  <Box
    sx={{
      height: 22,
      minWidth: 22,
      borderRadius: "50%",
      fontSize: 12,
      ml: 1,
      bgcolor: "#e0e0e0",
      color: "#333",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: 0.5,
    }}
  >
    {count}
  </Box>
);

// --- Component Item đơn lẻ (Dynamic) ---
const FilterItem = ({
  label,
  count,
  color = "default",
  checked,
  onChange,
}: {
  label: string;
  count: number;
  color?: keyof typeof COLORS;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={() => onChange(!checked)}
      sx={{
        cursor: "pointer",
        ml: 2,
        userSelect: "none",
        "&:hover .MuiCheckbox-root": {
          bgcolor: alpha(COLORS[color] || COLORS.default, 0.05),
        },
      }}
    >
      <CustomCheckbox
        checked={checked}
        colorKey={color}
        onChange={(e) => onChange(e.target.checked)}
      />
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
        {label} <StatusCountBadge count={count} />
      </Typography>
    </Box>
  );
};

// --- Component Group chính (Dynamic) ---
export interface FilterOption {
  label: string;
  count: number;
  color: keyof typeof COLORS;
  value: any;
}

interface FilterStatusGroupProps {
  options: FilterOption[];
  selectedValue: any;
  onChange: (value: any) => void;
}

export const FilterStatusGroup = ({
  options,
  selectedValue,
  onChange,
}: FilterStatusGroupProps) => {
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {options.map((opt) => (
        <FilterItem
          key={opt.value}
          label={opt.label}
          count={opt.count}
          color={opt.color}
          checked={selectedValue === opt.value}
          onChange={() => onChange(opt.value)}
        />
      ))}
    </Box>
  );
};
