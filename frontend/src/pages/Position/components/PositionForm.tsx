import {
  InfoOutlineRounded,
  ArrowDropUp,
  ArrowDropDown,
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
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import { PositionValidation } from "../validation/Validation";
import EditButton from "../../../components/Button/EditButton";

export default function PositionForm({
  onEdit,
  onCancel,
  selectedPosition,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedPosition?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      id: "",
      tenChucVu: "",
      quanLyNhanVien: false,
      quanLyPhongBan: false,
      quanLyDuAn: false,
      quanLyNguonVon: false,
      quanLyMoHinhTaiSan: false,
      quanLyNhomTaiSan: false,
      quanLyTaiSan: false,
      quanLyCCDCVatTu: false,
      dieuDongTaiSan: false,
      dieuDongCCDCVatTu: false,
      banGiaoTaiSan: false,
      banGiaoCCDCVatTu: false,
      baoCao: false,
      idCongTy: "ct001",
    },
    validationSchema: PositionValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedPosition) {
      formik.setValues(selectedPosition);
      formik.setErrors({}); // Clear errors when selectedPosition changes
    } else {
      formik.resetForm();
    }
  }, [selectedPosition, readOnly]); // Add readOnly to dependencies

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
          <Typography>Chi tiết chức vụ</Typography>
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
            <Typography>Thông tin chức vụ</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Mã chức vụ *"
                formik={formik}
                field="id"
                disabled={Boolean(selectedPosition)}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Tên chức vụ *"
                formik={formik}
                field="tenChucVu"
                disabled={readOnly}
              />
            </Grid>
          </Grid>
        </Paper>
        <Paper sx={{ mt: 2, p: 2, borderRadius: "12px" }}>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <InfoOutlineRounded color="primary" />
            <Typography>Thông tin chức vụ</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Quản lý nhân viên:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.quanLyNhanVien}
                  onChange={(e) =>
                    formik.setFieldValue("quanLyNhanVien", e.target.checked)
                  }
                  name="quanLyNhanVien"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Quản lý CCDC vật tư:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.quanLyCCDCVatTu}
                  onChange={(e) =>
                    formik.setFieldValue("quanLyCCDCVatTu", e.target.checked)
                  }
                  name="quanLyCCDCVatTu"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Quản lý phòng ban:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.quanLyPhongBan}
                  onChange={(e) =>
                    formik.setFieldValue("quanLyPhongBan", e.target.checked)
                  }
                  name="quanLyPhongBan"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Điều động tài sản:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.dieuDongTaiSan}
                  onChange={(e) =>
                    formik.setFieldValue("dieuDongTaiSan", e.target.checked)
                  }
                  name="dieuDongTaiSan"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Quản lý dự án:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.quanLyDuAn}
                  onChange={(e) =>
                    formik.setFieldValue("quanLyDuAn", e.target.checked)
                  }
                  name="quanLyDuAn"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Điều động CCDC vật tư:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.dieuDongCCDCVatTu}
                  onChange={(e) =>
                    formik.setFieldValue("dieuDongCCDCVatTu", e.target.checked)
                  }
                  name="dieuDongCCDCVatTu"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Quản lý nguồn vốn:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.quanLyNguonVon}
                  onChange={(e) =>
                    formik.setFieldValue("quanLyNguonVon", e.target.checked)
                  }
                  name="quanLyNguonVon"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Bàn giao tài sản:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.banGiaoTaiSan}
                  onChange={(e) =>
                    formik.setFieldValue("banGiaoTaiSan", e.target.checked)
                  }
                  name="banGiaoTaiSan"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Quản lý mô hình tài sản:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.quanLyMoHinhTaiSan}
                  onChange={(e) =>
                    formik.setFieldValue("quanLyMoHinhTaiSan", e.target.checked)
                  }
                  name="quanLyMoHinhTaiSan"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>bàn giao CCDC vật tư:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.banGiaoCCDCVatTu}
                  onChange={(e) =>
                    formik.setFieldValue("banGiaoCCDCVatTu", e.target.checked)
                  }
                  name="banGiaoCCDCVatTu"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Quản lý nhóm tài sản:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.quanLyNhomTaiSan}
                  onChange={(e) =>
                    formik.setFieldValue("quanLyNhomTaiSan", e.target.checked)
                  }
                  name="quanLyNhomTaiSan"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Báo cáo:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.baoCao}
                  onChange={(e) =>
                    formik.setFieldValue("baoCao", e.target.checked)
                  }
                  name="baoCao"
                  disabled={readOnly}
                />
              </Box>
              <Grid size={{ xs: 6 }}>
                <Box display="flex" alignItems="center">
                  <Box width={200}>
                    <Typography>Quản lý tài sản:</Typography>
                  </Box>
                  <Checkbox
                    checked={formik.values.quanLyTaiSan}
                    onChange={(e) =>
                      formik.setFieldValue("quanLyTaiSan", e.target.checked)
                    }
                    name="quanLyTaiSan"
                    disabled={readOnly}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
