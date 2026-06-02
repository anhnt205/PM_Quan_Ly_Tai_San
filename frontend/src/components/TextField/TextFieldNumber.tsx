import { TextField } from "@mui/material";
import { getIn } from "formik";
import { NumericFormat } from "react-number-format";

interface Props {
  title?: string;
  formik?: any;
  field?: string;
  disabled?: boolean;
  onChange?: (value: any) => void;
  noBorder?: boolean;
  sx?: any;
}
export default function TextFieldNumber({
  title,
  formik,
  field,
  disabled = false,
  onChange,
  noBorder = false,
  sx,
}: Props) {
  const currentValue = formik && field ? getIn(formik.values, field) : "";
  const touched = formik && field ? getIn(formik.touched, field) : false;
  const error = formik && field ? getIn(formik.errors, field) : "";
  return (
    <NumericFormat
      size="small"
      customInput={TextField}
      label={title}
      fullWidth
      disabled={disabled}
      value={currentValue}
      thousandSeparator="."
      decimalSeparator=","
      fixedDecimalScale={false}
      onValueChange={(values: any) => {
        formik.setFieldValue(
          field,
          values.floatValue === undefined ? 0 : values.floatValue,
        );
        onChange && onChange(values.floatValue);
      }}
      // Giữ nguyên style của bạn
      error={Boolean(touched && error)}
      helperText={touched && error}
      variant="outlined"
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
