import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  Delete,
  InfoOutlineRounded,
  Visibility,
  VisibilityOff,
  Lock,
  Drafts,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import ToolType from "../../../data/ToolType.json";
import FieldDateTime from "../../../components/TextField/FieldDateTime";
import EditButton from "../../../components/Button/EditButton";

export default function ToolForm({
  onEdit,
  onCancel,
  selectedTool,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedTool?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [initialToolCount, setInitialToolCount] = useState(0);
  const [hasAddedNewRow, setHasAddedNewRow] = useState(false);
  const formik = useFormik({
    initialValues: {
      id: "",
      code: "",
      name: "",
      createdAt: "",
      updatedAt: "",
      createdBy: "",
      updatedBy: "",
      tools: [
        {
          tool: "",
          toolSign: "",
          toolQuantity: "",
          toolCapacity: "",
          toolCreatedCountry: "",
          toolCreatedYear: "",
        },
      ],
    },
    onSubmit(values) {
      onSave(values);
    },
  });
  useEffect(() => {
    if (selectedTool) {
      const tools =
        selectedTool.tools && selectedTool.tools.length > 0
          ? selectedTool.tools
          : [
              {
                tool: "",
                toolSign: "",
                toolQuantity: "",
                toolCapacity: "",
                toolCreatedCountry: "",
                toolCreatedYear: "",
              },
            ];
      setInitialToolCount(tools.length);
      formik.setValues({
        ...selectedTool,
        tools: tools,
      });
    } else {
      formik.resetForm();
      setInitialToolCount(1);
    }
  }, [selectedTool, readOnly]);
  return (
    <Accordion sx={{ background: "#f6f8f4ff" }} expanded={expanded}>
      <AccordionSummary
        expandIcon={<ViewBtn expanded={expanded} setExpanded={setExpanded} />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "none", // Ngăn không cho xoay
          },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
          <Typography>Chi tiết CCDC - Vật tư</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Box display="flex" gap={2}>
            {!readOnly && (
              <SaveBtn
                onSave={() => {
                  formik.submitForm();
                  setHasAddedNewRow(false);
                  setInitialToolCount(formik.values.tools.length);
                }}
              />
            )}
            {!readOnly && (
              <CancelBtn
                onClick={() => {
                  onCancel();
                  setHasAddedNewRow(false);
                }}
              />
            )}
            {readOnly && <EditButton onClick={onEdit} />}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 0,
              alignItems: "center",
              borderRadius: "8px",
              overflow: "visible",
              backgroundColor: "#F5F5F5",
              border: "2px solid",
              borderColor: "#B3E5FC",
              transition: "all 0.3s ease",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 28px",
                backgroundColor: !readOnly ? "#B3E5FC" : "transparent",
                color: !readOnly ? "#00695C" : "#BDBDBD",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "default",
                flex: 1,
                transition: "all 0.3s ease",
                borderRadius: "6px 0 0 6px",
                clipPath: !readOnly
                  ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)"
                  : "none",
                position: "relative",
                zIndex: !readOnly ? 2 : 1,
              }}
            >
              Nháp
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 28px",
                backgroundColor: readOnly ? "#B3E5FC" : "transparent",
                color: readOnly ? "#00695C" : "#BDBDBD",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "default",
                flex: 1,
                transition: "all 0.3s ease",
                borderRadius: "0 6px 6px 0",
                clipPath: readOnly
                  ? "polygon(14px 0, 100% 0, 100% 100%, 14px 100%, 0 50%)"
                  : "none",
                position: "relative",
                zIndex: readOnly ? 2 : 1,
              }}
            >
              Khóa
            </Box>
          </Box>
        </Box>
        <Paper sx={{ mt: 2, p: 2, borderRadius: "12px" }}>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <InfoOutlineRounded color="primary" />
            <Typography>Thông tin CCDC - Vật tư</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Mã công cụ dụng cụ *"
                    formik={formik}
                    field="toolNumber"
                    disabled={Boolean(selectedTool)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tên công cụ dụng cụ *"
                    formik={formik}
                    field="toolName"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Đơn vị tính *"
                    formik={formik}
                    field="toolUnit"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Đơn vị nhập *"
                    formik={formik}
                    field="toolInput"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Ngày nhập"
                    formik={formik}
                    field="toolInputedAt"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Ghi chú"
                    formik={formik}
                    field="toolNote"
                    disabled={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Nhóm CCDC *"
                    formik={formik}
                    field="toolGroupName"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Loại CCDC *"
                    data={ToolType}
                    labelkey="name"
                    formik={formik}
                    field="toolTypeId"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số lượng"
                    type="number"
                    formik={formik}
                    field="toolQuantity"
                    disabled={Boolean(selectedTool)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Giá trị *"
                    type="number"
                    formik={formik}
                    field="toolValue"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Ký hiệu"
                    formik={formik}
                    field="toolSign"
                    disabled={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Typography fontSize={14} py={2}>
            Chi tiết CCDC Vật tư:
          </Typography>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Số ký hiệu</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Công suất</TableCell>
                <TableCell>Nước sản xuất</TableCell>
                <TableCell>Năm sản xuất</TableCell>
                <TableCell width={50}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formik.values.tools.map((row, index) => {
                const isNewRow = index >= initialToolCount;
                const isFieldDisabled =
                  readOnly || (!hasAddedNewRow && !isNewRow);
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <FieldAutoCompleted
                        title=""
                        data={ToolType}
                        labelkey="name"
                        formik={formik}
                        field={`tools.${index}.tool`}
                        disabled={isFieldDisabled}
                      />
                    </TableCell>
                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`tools.${index}.toolSign`}
                        disabled={isFieldDisabled}
                      />
                    </TableCell>
                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`tools.${index}.toolQuantity`}
                        disabled={isFieldDisabled}
                      />
                    </TableCell>
                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`tools.${index}.toolCapacity`}
                        disabled={isFieldDisabled}
                      />
                    </TableCell>
                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`tools.${index}.toolCreatedCountry`}
                        disabled={isFieldDisabled}
                      />
                    </TableCell>
                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`tools.${index}.toolCreatedYear`}
                        disabled={isFieldDisabled}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => {
                          const newTools = [...formik.values.tools];
                          newTools.splice(index, 1);
                          formik.setFieldValue("tools", newTools);
                        }}
                        disabled={!hasAddedNewRow}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {!readOnly && (
              <Button
                startIcon={<Add />}
                onClick={() => {
                  setHasAddedNewRow(true);
                  formik.setFieldValue("tools", [
                    ...formik.values.tools,
                    {
                      tool: "",
                      toolSign: "",
                      toolQuantity: "",
                      toolCapacity: "",
                      toolCreatedCountry: "",
                      toolCreatedYear: "",
                    },
                  ]);
                }}
                variant="text"
              >
                Thêm một dòng
              </Button>
            )}
          </Table>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
