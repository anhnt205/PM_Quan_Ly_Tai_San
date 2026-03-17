import { TextField } from "@mui/material";
import { getIn } from "formik";
import { NumericFormat } from "react-number-format";

interface Props {
  title?: string;
  formik?: any;
  field?: string;
  disabled?: boolean;
  onChange?: (value: any) => void;
}
export default function TextFieldNumber({
  title,
  formik,
  field,
  disabled = false,
  onChange,
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
    />
  );
}
