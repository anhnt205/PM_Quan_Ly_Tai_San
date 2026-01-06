import { Autocomplete, TextField } from "@mui/material";
import { getIn } from "formik";
import React from "react";

interface Props {
  title: string;
  data: any[];
  labelkey: string;
  formik?: any;
  field?: string;
  disabled?: boolean;
  onCustomChange?: (val: any) => void;
}

export default function FieldAutoCompleted({
  title,
  data,
  labelkey,
  formik,
  field,
  disabled,
  onCustomChange,
}: Props) {
  const currentValue = formik && field ? getIn(formik.values, field) : null;

  const selectedOption =
    data.find((i) => i.id === currentValue) || null;

  const touched = field ? getIn(formik.touched, field) : false;
  const error = field ? getIn(formik.errors, field) : null;
  return (
    <Autocomplete
      disabled={disabled}
      fullWidth
      options={data}
      getOptionLabel={(option: any) => option[labelkey] || ""}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      value={selectedOption}
      onChange={(e, newValue) => {
        if (formik && field) {
          formik.setFieldValue(field, newValue?.id);
        }
        if (onCustomChange) {
          onCustomChange(newValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={title}
          error={Boolean(touched && error)}
          helperText={touched ? error : ""}
          size="small"
          // InputProps={{
          //     ...params.InputProps,
          //     sx: {
          //         borderRadius: '12px'
          //     }
          // }}
        />
      )}
    />
  );
}
