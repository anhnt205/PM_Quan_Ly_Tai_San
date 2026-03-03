import {
  Autocomplete,
  TextField,
  Box,
  createFilterOptions,
} from "@mui/material";
import { getIn } from "formik";
import { useMemo } from "react";

interface Props {
  title: string;
  data: any[];
  labelkey: string;
  formik?: any;
  field?: string;
  disabled?: boolean;
  labelOption?: string;
  onChange?: (newValue: any) => void;
  onSearch?: (value: string) => void;
  componentsProps?: any;
  autocompleteSx?: any;
  limitOptions?: number;
}

export default function FieldAutoCompleted({
  title,
  data = [],
  labelkey,
  formik,
  field,
  disabled,
  onChange,
  onSearch,
  labelOption,
  componentsProps,
  autocompleteSx,
  limitOptions,
}: Props) {
  const currentValue = formik && field ? getIn(formik.values, field) : null;
  const touched = field ? getIn(formik.touched, field) : false;
  const error = field ? getIn(formik.errors, field) : null;

  const filter = useMemo(() => {
    return limitOptions
      ? createFilterOptions<any>({ limit: limitOptions })
      : undefined;
  }, [limitOptions]);

  const selectedOption = useMemo(() => {
    // 1. Tìm trong data trước (Logic gốc)
    const found = data.find(
      (i) => i.id?.toString() === currentValue?.toString(),
    );
    if (found) return found;

    // 2. Logic dự phòng: Nếu không thấy trong data nhưng có currentValue và formik
    if (currentValue && formik && field) {
      const parentPath = field.includes(".")
        ? field.substring(0, field.lastIndexOf("."))
        : "";

      // Nếu là mảng (có parentPath), tìm field label cùng cấp
      // Nếu không có parentPath (field đơn), thì labelValue sẽ khó tìm hơn nên trả về null
      const labelPath = parentPath ? `${parentPath}.${labelkey}` : "";
      const labelValue = labelPath ? getIn(formik.values, labelPath) : null;

      if (labelValue) {
        // Trả về object "giả" để Autocomplete có cái mà hiển thị nhãn
        return { id: currentValue, [labelkey]: labelValue };
      }
    }

    return null;
    // Thêm data vào dependency để khi listAssets từ API về, nó sẽ tính toán lại và khớp với hàng thật
  }, [currentValue, data, formik?.values, field, labelkey]);

  return (
    <Autocomplete
      sx={autocompleteSx}
      componentsProps={componentsProps}
      disabled={disabled}
      fullWidth
      options={data}
      {...(filter ? { filterOptions: filter } : {})}
      getOptionLabel={(option: any) => {
        if (!option) return ""; // Tránh lỗi khi option là null/undefined
        if (typeof option === "string") return option; // Tránh lỗi nếu truyền string vào thay vì object

        return `${option[labelkey] || ""} ${(labelOption && `- ${option[labelOption]}`) || ""}`.trim();
      }}
      isOptionEqualToValue={(option, value) => {
        if (!value) return false;
        return option?.id?.toString() === (value?.id || value)?.toString();
      }}
      value={selectedOption}
      onChange={(e, newValue) => {
        if (formik && field) {
          formik.setFieldValue(field, newValue?.id, true);
          formik.setFieldError(field, undefined);
        }
        if (onChange) {
          onChange(newValue);
        }
      }}
      onInputChange={(_, value) => onSearch?.(value)}
      renderOption={(props, option, state) => {
        const label = `${option[labelkey] || ""}${
          labelOption ? ` - ${option[labelOption]}` : ""
        }`;

        return (
          <li
            {...props}
            key={`${option.id} - ${state.index}`}
            title={label} // tooltip native
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              display: "block",
            }}
          >
            {label}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={title}
          error={Boolean(touched && error)}
          helperText={touched ? error : ""}
          onBlur={() => {
            if (formik && field) {
              formik.setFieldTouched(field, true, true);
            }
          }}
          size="small"
        />
      )}
    />
  );
}
