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
  default: "#424242",
  success: "#4caf50",
  info: "#2196f3",
  error: "#ff7043",
  primary: "#1976d2",
  secondary: "#9c27b0",
  warning: "#ed6c02",
};

const BpIcon = styled("span")<{ customColor: string }>(({ customColor }) => ({
  borderRadius: 3,
  width: 18,
  height: 18,
  boxShadow: `inset 0 0 0 2px ${customColor}`,
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
  }),
);

const CustomCheckbox = (
  props: CheckboxProps & { colorKey: keyof typeof COLORS },
) => {
  const { colorKey, ...otherProps } = props;
  const colorHex = COLORS[colorKey] || COLORS.default;

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
      {...otherProps} // Chỉ truyền các props hợp lệ của Checkbox
    />
  );
};

const StatusCountBadge = ({ count }: { count: number }) => (
  <Box
    component="span" // QUAN TRỌNG: Đổi div thành span để nằm trong Typography hợp lệ
    sx={{
      height: 22,
      minWidth: 22,
      borderRadius: "50%",
      fontSize: 12,
      ml: 1,
      bgcolor: "#e0e0e0",
      color: "#333",
      fontWeight: "bold",
      display: "inline-flex", // inline-flex để căn chỉnh cùng dòng văn bản
      alignItems: "center",
      justifyContent: "center",
      px: 0.5,
    }}
  >
    {count}
  </Box>
);

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
        component="div" // QUAN TRỌNG: Đổi p thành div để chứa Badge (nếu badge là thẻ div)
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

