import { TextField } from "@mui/material";
import { getIn } from "formik";

interface Props {
  title?: string;
  type?: string;
  formik?: any;
  field?: string;
  slotProps?: any;
  disabled?: boolean;
  InputProps?: any;
  onChange?: (newValue: any) => void;
}
export default function FieldInput({
  title,
  type = "text",
  formik,
  field,
  slotProps,
  disabled = false,
  InputProps,
  onChange,
}: Props) {
  const currentValue = formik && field ? getIn(formik.values, field) : "";
  const touched = formik && field ? getIn(formik.touched, field) : false;
  const error = formik && field ? getIn(formik.errors, field) : "";
  return (
    <TextField
      disabled={disabled}
      fullWidth
      type={type}
      size="small"
      label={title}
      value={currentValue}
      onChange={(e) => {
        if (field) {
          formik.setFieldError(field, undefined);
          formik.setFieldTouched(field, true, false);
          formik.setFieldValue(field, e.target.value);
        }
        if (onChange) {
          onChange(e.target.value);
        }
      }}
      error={Boolean(touched && error)}
      helperText={touched && error}
      InputProps={InputProps}
      slotProps={slotProps}
    />
  );
}
