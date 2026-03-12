import { TextField } from "@mui/material";
import React from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { getIn, useField } from "formik";

export default function FieldDate({
  title,
  formik,
  selectedDate,
  setSelectedDate,
  field,
  disabled = false,
}: {
  title: string;
  formik?: any;
  selectedDate?: string;
  setSelectedDate?: React.Dispatch<React.SetStateAction<string>>;
  field?: string;
  disabled?: boolean;
}) {
  const value = formik && field ? getIn(formik.values, field) : selectedDate;

  const setValue = (val: string) => {
    if (formik && field) {
      formik.setFieldValue(field, val);
    } else {
      setSelectedDate?.(val);
    }
  };

  const dayjsValue: Dayjs | null = value ? dayjs(value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <DatePicker
        label={title}
        format="DD/MM/YYYY"
        views={["year", "month", "day"]}
        openTo="day"
        value={dayjsValue}
        disabled={disabled}
        onChange={(val) =>
          setValue(val ? dayjs(val).format("YYYY-MM-DD") : "")
        }
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            sx: { backgroundColor: "#fff" },
          },
        }}
      />
    </LocalizationProvider>
  );
}
