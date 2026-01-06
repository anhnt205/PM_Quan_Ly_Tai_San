import { TextField } from "@mui/material";
import { getIn } from "formik";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  title?: string;
  type?: string;
  formik?: any;
  field?: string;
  slotProps?: any;
  disabled?: boolean;
  InputProps?: any;
}
export default function FieldInput({
  title,
  type = "text",
  formik,
  field,
  slotProps,
  disabled = false,
  InputProps,
}: Props) {
  const currentValue = formik && field ? getIn(formik.values, field) : '';
  return (
    <TextField
      disabled={disabled}
      fullWidth
      type={type}
      size="small"
      label={title}
      value={currentValue}
      onChange={(e) => {
        if (field) formik.setFieldValue(field, e.target.value);
      }}
      error={field && formik.touched[field] && Boolean(formik.errors[field])}
      helperText={field && formik.touched[field] && formik.errors[field]}
      InputProps={InputProps}
      slotProps={slotProps}
    />
  );
}
