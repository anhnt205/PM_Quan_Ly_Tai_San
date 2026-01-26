import { Autocomplete, TextField, Box } from "@mui/material";
import { getIn } from "formik";

interface Props {
  title: string;
  data: any[];
  labelkey: string;
  formik?: any;
  field?: string;
  disabled?: boolean;
  labelOption?: string;
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
  labelOption,
  componentsProps,
  autocompleteSx,
}: Props) {
  const currentValue = formik && field ? getIn(formik.values, field) : null;

  const valueKey = labelOption;
  const selectedOption =
    valueKey && currentValue
      ? data.find(
          (i) => i?.[valueKey]?.toString() === currentValue?.toString(),
        ) || null
      : null;

  const touched = field ? getIn(formik.touched, field) : false;
  const error = field ? getIn(formik.errors, field) : null;

  return (
    <Autocomplete
      sx={autocompleteSx}
      componentsProps={componentsProps}
      disabled={disabled}
      fullWidth
      options={data}
      getOptionLabel={(option: any) => {
        if (typeof option === "string") return option;
        if (!labelOption) return "";
        return option[labelkey] ?? "";
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id}>
          {option[labelkey]}
        </Box>
      )}
      isOptionEqualToValue={(option, value) =>
        valueKey ? option?.[valueKey] === value?.[valueKey] : false
      }
      value={selectedOption}
      onChange={(e, newValue) => {
        if (formik && field && valueKey) {
          formik.setFieldValue(field, newValue?.[valueKey] || null);
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
