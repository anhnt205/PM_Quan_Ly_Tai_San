import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  Delete,
  InfoOutlineRounded,
  Visibility,
  VisibilityOff,
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import AssetParents from "../../../data/AssetParent.json";
import TypeAssets from "../../../data/TypeAsset.json";
import Projects from "../../../data/Project.json";
import FieldDateTime from "../../../components/TextField/FieldDateTime";
import EditButton from "../../../components/Button/EditButton";

export default function AssetManagerForm({
  onEdit,
  onCancel,
  selectedAsset,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedAsset?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      assetNumber: "",
      assetCode: "",
      assetName: "",
      originalCost: "",
      initialDepValue: "",
      initialDepPeriod: "",
      salvageValue: "",
      assetModel: "",
      depreciationMethod: "",
      depreciationYears: "",
      assetDisplayName: "",
      depreciationAccountName: "",
      expenseAccount: "",
      assetGroupId: "",
      assetTypeId: "",
      recordedDate: null,
      usedDate: null,

      projectId: "",
      stateBudgetCapital: "",
      loanCapital: "",
      otherCapital: "",
      brand: "",
      brandCode: "",
      capacity: "",
      countryOfOrigin: "",
      manufactureYear: "",
      increaseReasonId: "",
      assetStatus: "",
      quantity: 1,
      unitId: "",
      note: "",
      autoCreateUnit: false,
      warehouseId: "",
      currentUnitId: "",

      assets: [
        {
          asset: "",
          uom: "",
          quantity: "",
          status: "",
          note: "",
        },
      ],
    },
    onSubmit(values) {
      onSave(values);
    },
  });
  useEffect(() => {
    if (selectedAsset) {
      formik.setValues(selectedAsset);
    } else {
      formik.resetForm();
    }
  }, [selectedAsset]);
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
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
          <Typography>Chi tiết tài sản</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" gap={2}>
          {!readOnly && <SaveBtn onSave={formik.submitForm} />}
          {!readOnly && <CancelBtn onClick={onCancel} />}
          {readOnly && <EditButton onClick={onEdit} />}
        </Box>
        <Paper sx={{ mt: 2, p: 2, borderRadius: "12px" }}>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <InfoOutlineRounded color="primary" />
            <Typography>Thông tin tài sản</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số thẻ tài sản *"
                    formik={formik}
                    field="assetNumber"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Mã tài sản *"
                    formik={formik}
                    field="assetCode"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tên tài sản *"
                    formik={formik}
                    field="assetName"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Nguyên giá tài sản"
                    type="number"
                    formik={formik}
                    field="originalCost"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Giá trị khấu hao ban đầu"
                    type="number"
                    formik={formik}
                    field="initialDepValue"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Kỳ khấu hao ban đầu"
                    type="number"
                    formik={formik}
                    field="initialDepPeriod"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Giá trị thanh lý"
                    type="number"
                    formik={formik}
                    field="salvageValue"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Mô hình tài sản"
                    data={[]}
                    labelkey="name"
                    formik={formik}
                    field="assetModel"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Phương pháp khấu hao"
                    formik={formik}
                    field="depreciationMethod"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số kỳ khấu hao"
                    type="number"
                    formik={formik}
                    field="depreciationYears"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tên tài sản"
                    formik={formik}
                    field="assetDisplayName"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tên khoản khấu hao"
                    formik={formik}
                    field="depreciationAccountName"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tài khoản chi phí"
                    formik={formik}
                    field="expenseAccount"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Nhóm tài sản *"
                    data={AssetParents}
                    labelkey="name"
                    formik={formik}
                    field="assetGroupId"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Loại tài sản"
                    data={TypeAssets}
                    labelkey="name"
                    formik={formik}
                    field="assetTypeId"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldDateTime
                    title="Ngày vào sổ"
                    formik={formik}
                    field="recordedDate"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldDateTime
                    title="Ngày sử dụng"
                    formik={formik}
                    field="usedDate"
                    disabled={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Dự án"
                    data={Projects}
                    labelkey="name"
                    formik={formik}
                    field="projectId"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Vốn NS"
                    type="number"
                    formik={formik}
                    field="stateBudgetCapital"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Vốn vay"
                    type="number"
                    formik={formik}
                    field="loanCapital"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Vốn khác"
                    type="number"
                    formik={formik}
                    field="otherCapital"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput title="Mã hiệu" formik={formik} field="brand" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số mã hiệu"
                    type="number"
                    formik={formik}
                    field="brandCode"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Công suất"
                    formik={formik}
                    field="capacity"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Nước sản xuất"
                    data={[]}
                    labelkey="name"
                    formik={formik}
                    field="countryOfOrigin"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Năm sản xuất"
                    type="number"
                    formik={formik}
                    field="manufactureYear"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Lý do tăng"
                    data={[]}
                    labelkey="name"
                    formik={formik}
                    field="increaseReasonId"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Hiện trạng"
                    data={[]}
                    labelkey="name"
                    formik={formik}
                    field="assetStatus"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số lượng"
                    type="number"
                    formik={formik}
                    field="quantity"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Đơn vị tính"
                    data={[]}
                    labelkey="name"
                    formik={formik}
                    field="unitId"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Ghi chú"
                    formik={formik}
                    field="note"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box display={"flex"} alignItems={"center"}>
                    <Typography>Khởi tạo đơn vị:</Typography>
                    <Checkbox
                      name="autoCreateUnit"
                      checked={formik.values.autoCreateUnit}
                      onChange={(e) =>
                        formik.setFieldValue("autoCreateUnit", e.target.checked)
                      }
                      disabled={readOnly}
                    />
                  </Box>
                </Grid>
                {formik.values.autoCreateUnit && (
                  <Grid size={{ xs: 12 }}>
                    <FieldAutoCompleted
                      title="Kho"
                      data={[]}
                      labelkey="name"
                      formik={formik}
                      field="warehouseId"
                      disabled={readOnly}
                    />
                  </Grid>
                )}
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Đơn vị hiện thời"
                    data={[]}
                    labelkey="name"
                    formik={formik}
                    field="currentUnitId"
                    disabled={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Typography fontSize={14} py={2}>
            Chi tiết tài sản con:
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tài sản</TableCell>
                <TableCell>Đơn vị tính</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Tình trạng kỹ thuật</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell width={50}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {formik.values.assets.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <FieldAutoCompleted
                      title=""
                      data={TypeAssets}
                      labelkey="name"
                      formik={formik}
                      field={`assets.${index}.asset`}
                      disabled={readOnly}
                    />
                  </TableCell>

                  <TableCell>
                    <FieldInput
                      formik={formik}
                      field={`assets.${index}.uom`}
                      disabled={true}
                    />
                  </TableCell>

                  <TableCell>
                    <FieldInput
                      type="number"
                      formik={formik}
                      field={`assets[${index}].quantity`}
                      disabled={readOnly}
                    />
                  </TableCell>

                  <TableCell>
                    <FieldInput
                      formik={formik}
                      field={`assets[${index}].status`}
                      disabled={readOnly}
                    />
                  </TableCell>

                  <TableCell>
                    <FieldInput
                      formik={formik}
                      field={`assets[${index}].note`}
                      disabled={readOnly}
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => {
                        const newAssets = [...formik.values.assets];
                        newAssets.splice(index, 1);
                        formik.setFieldValue("assets", newAssets);
                      }}
                      disabled={readOnly}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <Button
              startIcon={<Add />}
              onClick={() => {
                formik.setFieldValue("assets", [
                  ...formik.values.assets,
                  {
                    asset: "",
                    uom: "",
                    quantity: "",
                    status: "",
                    note: "",
                  },
                ]);
              }}
              variant="text"
            >
              Thêm một dòng
            </Button>
          </Table>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
