import {
  InfoOutlineRounded,
  ArrowDropUp,
  ArrowDropDown,
  Remove,
  Close,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import { PositionValidation } from "../validation/Validation";
import EditButton from "../../../components/Button/EditButton";
import { CongTy } from "../../../utils/const";
import { useDebounce } from "../../../hooks/useDebounce";

export default function PositionForm({
  onEdit,
  onCancel,
  selectedPosition,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
  onMinimize,
}: {
  onEdit: () => void;
  onCancel: () => void;
  onMinimize: () => void;
  selectedPosition?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
  onFormChange?: (values: any) => void;
  initialFormData?: Record<string, any>;
}) {
  const [expanded, setExpanded] = useState(true);

  const formik = useFormik({
    initialValues: {
      id: initialFormData?.id ?? "",
      tenChucVu: initialFormData?.tenChucVu ?? "",
      quanLyNhanVien: initialFormData?.quanLyNhanVien ?? false,
      quanLyPhongBan: initialFormData?.quanLyPhongBan ?? false,
      quanLyDuAn: initialFormData?.quanLyDuAn ?? false,
      quanLyNguonVon: initialFormData?.quanLyNguonVon ?? false,
      quanLyMoHinhTaiSan: initialFormData?.quanLyMoHinhTaiSan ?? false,
      quanLyNhomTaiSan: initialFormData?.quanLyNhomTaiSan ?? false,
      quanLyTaiSan: initialFormData?.quanLyTaiSan ?? false,
      quanLyCCDCVatTu: initialFormData?.quanLyCCDCVatTu ?? false,
      dieuDongTaiSan: initialFormData?.dieuDongTaiSan ?? false,
      dieuDongCCDCVatTu: initialFormData?.dieuDongCCDCVatTu ?? false,
      banGiaoTaiSan: initialFormData?.banGiaoTaiSan ?? false,
      banGiaoCCDCVatTu: initialFormData?.banGiaoCCDCVatTu ?? false,
      baoCao: initialFormData?.baoCao ?? false,
      banHanhQuyetDinh: initialFormData?.banHanhQuyetDinh ?? false,
      idCongTy: initialFormData?.idCongTy ?? CongTy.CT001,
    },
    validationSchema: PositionValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 800);
  useEffect(() => {
    onFormChange?.(debouncedValues);
  }, [debouncedValues]);

  useEffect(() => {
    if (selectedPosition) {
      formik.setValues(selectedPosition);
      formik.setErrors({}); // Clear errors when selectedPosition changes
    }
  }, [selectedPosition, readOnly]); // Add readOnly to dependencies

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1FA463" }}>
          Chi tiết chức vụ
        </Typography>
        <Box display="flex" gap={0.5}>
          <IconButton size="small" onClick={onMinimize} title="Ẩn tạm">
            <Remove fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onCancel} title="Đóng">
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Thông tin cơ bản */}
      <Paper sx={{ p: 2, borderRadius: "12px" }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <InfoOutlineRounded sx={{ color: "#1FA463" }} />
          <Typography sx={{ fontWeight: 600, color: "#1FA463" }}>
            Thông tin chức vụ
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <FieldInput
              title="Mã chức vụ *"
              formik={formik}
              field="id"
              disabled={Boolean(selectedPosition?.id)}
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

      {/* Phân quyền — giữ nguyên toàn bộ Grid checkboxes, chỉ bỏ wrapper Accordion */}
      <Paper sx={{ p: 2, borderRadius: "12px" }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <InfoOutlineRounded sx={{ color: "#1FA463" }} />
          <Typography sx={{ fontWeight: 600, color: "#1FA463" }}>
            Phân quyền
          </Typography>
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
                <Typography>Ban hành quyết định:</Typography>
              </Box>
              <Checkbox
                checked={formik.values.banHanhQuyetDinh}
                onChange={(e) =>
                  formik.setFieldValue("banHanhQuyetDinh", e.target.checked)
                }
                name="banHanhQuyetDinh"
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
          </Grid>
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
      </Paper>

      {/* Footer */}
      <Box
        display="flex"
        justifyContent="flex-end"
        gap={2}
        pt={2.5}
        sx={{ borderTop: "1px solid #f1f5f9" }}
      >
        {readOnly ? (
          <EditButton onClick={onEdit} />
        ) : (
          <>
            <CancelBtn onClick={onCancel} />
            <SaveBtn onSave={formik.submitForm} />
          </>
        )}
      </Box>
    </Box>
  );
}
