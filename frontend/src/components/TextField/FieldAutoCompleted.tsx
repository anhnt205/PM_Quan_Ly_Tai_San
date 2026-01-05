import { Autocomplete, TextField } from "@mui/material";
import { getIn } from "formik";

interface Props {
  title: string;
  data: any[];
  labelkey: string;
  formik?: any;
  field?: string;
  disabled?: boolean;
}

export default function FieldAutoCompleted({
  title,
  data,
  labelkey,
  formik,
  field,
  disabled,
}: Props) {
  const currentValue = formik && field ? getIn(formik.values, field) : null;

  const selectedOption = data.find((i) => i.id === currentValue) || null;

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
