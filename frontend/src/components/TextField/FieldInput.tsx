import { TextField } from "@mui/material";
import { getIn } from "formik";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

interface Props {
  title?: string;
  type?: string;
  formik?: any;
  field?: string;
  slotProps?: any;
  disabled?: boolean;
  InputProps?: any;
  InputLabelProps?: any;
  onChange?: (newValue: any) => void;
  onClick?: (e: any) => void;
  multiline?: boolean;
  rows?: number;
  noBorder?: boolean;
  sx?: any;
  placeholder?: string;
}
export default function FieldInput({
  title,
  type = "text",
  formik,
  field,
  slotProps,
  disabled = false,
  InputProps,
  InputLabelProps,
  onChange,
  onClick,
  multiline = false,
  rows = 1,
  noBorder = false,
  sx,
  placeholder,
}: Props) {
  const currentValue = formik && field ? getIn(formik.values, field) : "";
  const touched = formik && field ? getIn(formik.touched, field) : false;
  const error = formik && field ? getIn(formik.errors, field) : "";

  // Local state để input mượt, debounce để set vào formik
  const [localValue, setLocalValue] = useState(currentValue);
  const debouncedValue = useDebounce(localValue, 300);

  // Khi debouncedValue thay đổi mới set vào formik
  useEffect(() => {
    if (field && debouncedValue !== getIn(formik.values, field)) {
      formik.setFieldValue(field, debouncedValue);
    }
  }, [debouncedValue]);

  // Đồng bộ localValue khi giá trị trong formik thay đổi từ bên ngoài
  useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);
  return (
    <TextField
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      disabled={disabled}
      fullWidth
      type={type}
      size="small"
      label={title}
      value={localValue}
      multiline={multiline}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => {
        setLocalValue(e.target.value);
        if (onChange) {
          onChange(e.target.value);
        }
      }}
      error={Boolean(touched && error)}
      helperText={touched && error}
      InputProps={InputProps}
      InputLabelProps={InputLabelProps}
      slotProps={slotProps}
      sx={{
        ...sx,
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            border: noBorder ? "none" : undefined,
            borderBottom: noBorder
              ? "1px solid rgba(0, 0, 0, 0.23)"
              : undefined,
            borderRadius: noBorder ? 0 : undefined,
          },
          "&:hover fieldset": {
            borderBottom: noBorder
              ? "1px solid rgba(0, 0, 0, 0.87)"
              : undefined,
          },
          "&.Mui-focused fieldset": {
            borderBottom: noBorder ? "2px solid #1976d2" : undefined,
          },
        },
      }}
    />
  );
}
