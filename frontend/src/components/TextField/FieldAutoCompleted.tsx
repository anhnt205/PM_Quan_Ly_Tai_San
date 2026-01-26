import { Autocomplete, TextField, Box } from "@mui/material";
import { getIn } from "formik";

interface Props {
  title: string;
  data: any[];
  labelkey: string;
  formik?: any;
  field?: string;
  disabled?: boolean;
  onChange?: (newValue: any) => void;
  componentsProps?: any;
  autocompleteSx?: any;
}

export default function FieldAutoCompleted({
  title,
  data,
  labelkey,
  formik,
  field,
  disabled,
  onChange,
  componentsProps,
  autocompleteSx,
}: Props) {
  const currentValue = formik && field ? getIn(formik.values, field) : null;

  const selectedOption =
    data.find((i) => i.id?.toString() === currentValue?.toString()) || null;

  const touched = field ? getIn(formik.touched, field) : false;
  const error = field ? getIn(formik.errors, field) : null;

  return (
    <Autocomplete
      sx={autocompleteSx}
      componentsProps={componentsProps}
      disabled={disabled}
      fullWidth
      options={data}
      // 1. Hiển thị trên ô Input sau khi chọn
      getOptionLabel={(option: any) => {
        if (typeof option === "string") return option;
        return option[labelkey] ? String(option[labelkey]) : "";
      }}
      // 2. Hiển thị trong danh sách Dropdown (Dòng này giúp hiển thị đẹp hơn)
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id}>
          {option[labelkey]}
        </Box>
      )}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      value={selectedOption}
      onChange={(e, newValue) => {
        if (formik && field) {
          formik.setFieldValue(field, newValue?.id || null);
        }
        if (onChange) {
          onChange(newValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={title}
          error={Boolean(touched && error)}
          helperText={touched ? error : ""}
          size="small"
        />
      )}
    />
  );
}
