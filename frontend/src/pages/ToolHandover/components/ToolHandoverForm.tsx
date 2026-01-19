import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TableCell,
  IconButton,
  styled,
  TableBody,
  TableContainer,
  Collapse,
  Table,
  TableRow,
  TableHead,
} from "@mui/material";
import {
  ArrowDropDown,
  ArrowDropUp,
  Add,
  Delete,
  Cancel,
  Visibility,
} from "@mui/icons-material";
import { useFormik, FieldArray, FormikProvider } from "formik";

import FieldInput from "../../../components/TextField/FieldInput";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import FieldDateTime from "../../../components/TextField/FieldDateTime";
import FileAttachmentInput from "../../AssetTransfer/components/FileAttachmentInput";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import EditButton from "../../../components/Button/EditButton";
import CustomStepper from "../../../components/common/CustomStepper";
import { useToolHandoverMutation } from "../Mutation";
import { ToolHandoverFormValues } from "../types";
import ViewBtn from "../../../components/Button/ViewBtn";
import SignDocumentForm from "../../../components/common/SignDocumentForm";

const UnderlinedInputWrapper = styled(Box)({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    // 1. Ẩn toàn bộ khung mặc định
    "& fieldset": {
      border: "none",
    },
    // 2. Tạo vạch kẻ chân giả bằng border-bottom của chính Input
    borderBottom: "1px solid #ccc",
    borderRadius: 0,
    backgroundColor: "transparent",
    transition: "all 0.2s ease-in-out",
    paddingLeft: 0,
    paddingRight: 0,

    // 3. Hiệu ứng khi Hover
    "&:hover": {
      borderBottom: "1px solid #1976d2",
    },

    // 4. Hiệu ứng khi Focus (đang nhập liệu)
    "&.Mui-focused": {
      borderBottom: "2px solid #1976d2",
    },

    // 5. Trạng thái Disabled (Chỉ xem)
    "&.Mui-disabled": {
      borderBottom: "1px dotted #999",
    },
  },

  // Điều chỉnh khoảng cách chữ bên trong cho sát vạch kẻ
  "& .MuiInputBase-input": {
    padding: "8px 0px 4px 0px !important",
  },

  // Đẩy cái icon dropdown của Autocomplete lên một chút cho cân
  "& .MuiAutocomplete-endAdornment": {
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
  },
});

// --- Styled Components ---
const CancelStatusBadge = styled(Box)(() => ({
  backgroundColor: "#f44336",
  color: "#fff",
  padding: "6px 16px",
  borderRadius: "20px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "bold",
  fontSize: "14px",
  marginBottom: "16px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
}));

const CustomTableCell = styled(TableCell)(() => ({
  borderBottom: "1px solid rgba(224, 224, 224, 1)",
  padding: "8px",
  fontSize: "14px",
}));

export default function ToolHandoverForm({
  onEdit,
  onCancel,
  selectedTransfer,
  readOnly,
  onSave,
  label,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedTransfer?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
  label?: string;
}) {
  const [document, setDocument] = useState<File | string | any>("");
  const isNew =
    !selectedTransfer || (!selectedTransfer.id && !selectedTransfer.Id);
  const currentStatus =
    selectedTransfer?.trangThai ?? selectedTransfer?.TrangThai ?? 0;
  const canBeEdited = isNew || currentStatus === 0;
  const isFormReadOnly = isNew ? false : readOnly || !canBeEdited;

  const [paginationModel] = useState({ page: 0, pageSize: 10 });
  const [searchValue] = useState("");
  const {
    departments,
    staffs,
    allTools,
    updateMutation,
    createMutation,
    handleDownloadFile,
  } = useToolHandoverMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
  );

  const [expanded, setExpanded] = useState(true);
  const [tableExpanded, setTableExpanded] = useState(true);
  const [previewFileName, setPreviewFileName] = useState<string | null>(null);

  const formik = useFormik<ToolHandoverFormValues>({
    initialValues: {
      id: "",
      soQuyetDinh: "",
      banGiaoCCDC: "",
      quyetDinhDieuDongSo: "",
      lenhDieuDong: "",
      idDonViGiao: "",
      idDonViNhan: "",
      ngayBanGiao: "",
      ngayQuyetDinh: "",
      ngayTaoChungTu: "",
      diaDiemQuyetDinh: "",
      idGiamDoc: "",
      idCongTy: "ct001",
      idLanhDao: "",
      idDaiDiendonviBanHanhQD: "",
      daXacNhan: false,
      idDaiDienBenGiao: "",
      daiDienBenGiaoXacNhan: false,
      idDaiDienBenNhan: "",
      daiDienBenNhanXacNhan: false,
      trangThai: 0,
      note: "",
      ngayTao: "",
      ngayCapNhat: "",
      nguoiTao: "",
      nguoiCapNhat: "",
      isActive: true,
      share: false,
      duongDanFile: "",
      tenFile: "",
      byStep: false,
      giamDocKy: false,
      chiTietBanGiaoCCDC: [
        {
          idCCDC: "",
          donViTinh: "",
          soLuong: 1,
          hienTrang: "1",
          ghiChu: "",
          id: "",
          idBanGiaoCCDC: "",
          isActive: true,
          moTa: "",
          tenCCDC: "",
        },
      ],
      nguoiKyList: [{ idPhongBan: "", idNguoiKy: "" }],
      chuKyList: [],
    },
    onSubmit: (values) => {
      const payload = {
        ...values,
        daXacNhan: !!values.daXacNhan,
        giamDocKy: !!values.giamDocKy,
        isActive: !!values.isActive,
        share: !!values.share,
        byStep: !!values.byStep,
      };
      if (values.id) updateMutation.mutate(payload);
      else createMutation.mutate(payload);
    },
  });

  useEffect(() => {
    if (selectedTransfer) {
      formik.setValues({
        ...selectedTransfer,
        ngayBanGiao: selectedTransfer.ngayBanGiao || "",
        ngayQuyetDinh: selectedTransfer.ngayQuyetDinh || "",
        ngayTaoChungTu: selectedTransfer.ngayTaoChungTu || "",
        chiTietBanGiaoCCDC:
          selectedTransfer.chiTietBanGiaoCCDC?.length > 0
            ? selectedTransfer.chiTietBanGiaoCCDC
            : formik.initialValues.chiTietBanGiaoCCDC,
        nguoiKyList: selectedTransfer.nguoiKyList || [
          { idPhongBan: "", idNguoiKy: "" },
        ],
      });
    } else {
      formik.resetForm();
    }
  }, [selectedTransfer]);

  return (
    <Accordion
      sx={{
        background: "#f6f8f4ff",
        boxShadow: "none",
        margin: "0 !important",
        "& .MuiAccordionSummary-expandIconWrapper": { display: "none" },
      }}
      expanded={expanded}
    >
      <AccordionSummary
        expandIcon={<ViewBtn expanded={expanded} setExpanded={setExpanded} />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          flexDirection: "row",
          "& .MuiAccordionSummary-content": {
            margin: "12px 0",
          },
          "& .MuiAccordionSummary-expandIconWrapper": {
            display: "flex",
            transform: "none !important",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
          <Typography>Chi tiết {label}</Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails
        sx={{ pt: 0, pb: 2, display: "flex", flexDirection: "column" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" gap={2}>
            {/* LOGIC NÚT BẤM CHUẨN */}
            {isNew ? (
              // Nếu là phiếu mới: Hiện Lưu/Hủy luôn
              <>
                <SaveBtn onSave={formik.submitForm} />
                <CancelBtn onClick={onCancel} />
              </>
            ) : (
              // Nếu là phiếu cũ
              <>
                {/* 1. Nếu đang ở chế độ xem: Hiện nút Chỉnh sửa (chỉ khi là phiếu Nháp) */}
                {readOnly && canBeEdited && <EditButton onClick={onEdit} />}

                {/* 2. Nếu đang ở chế độ sửa: Hiện Lưu/Hủy */}
                {!readOnly && canBeEdited && (
                  <>
                    <SaveBtn onSave={formik.submitForm} />
                    <CancelBtn onClick={onCancel} />
                  </>
                )}
              </>
            )}
          </Box>
          <CustomStepper activeStep={currentStatus} />
        </Box>

        {previewFileName && (
          <SignDocumentForm
            fileName={previewFileName}
            onCancel={() => setPreviewFileName(null)}
            onDownload={handleDownloadFile}
            showSignerSidebar={false}
          />
        )}

        {currentStatus === 2 && (
          <CancelStatusBadge>
            <Cancel fontSize="small" /> Hủy phiếu {label}
          </CancelStatusBadge>
        )}

        <Paper
          sx={{
            p: 3,
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          <Grid container spacing={4}>
            {/* CỘT 1 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <FieldInput
                    title="Số phiếu bàn giao ccdc - vật tư"
                    formik={formik}
                    field="id"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldInput
                    title="Tên biên bản bàn giao ccdc - vật tư"
                    formik={formik}
                    field="banGiaoCCDC"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldInput
                    title="Lệnh điều động"
                    formik={formik}
                    field="lenhDieuDong"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldAutoCompleted
                    title="Đơn vị giao"
                    formik={formik}
                    field="idDonViGiao"
                    data={departments}
                    labelkey="tenPhongBan"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldAutoCompleted
                    title="Đơn vị nhận"
                    formik={formik}
                    field="idDonViNhan"
                    data={departments}
                    labelkey="tenPhongBan"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldInput
                    title="Số quyết định"
                    formik={formik}
                    field="quyetDinhDieuDongSo"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldInput
                    title="Địa điểm bàn giao"
                    formik={formik}
                    field="diaDiemQuyetDinh"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldDateTime
                    title="Ngày quyết định"
                    formik={formik}
                    field="ngayQuyetDinh"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldDateTime
                    title="Ngày bàn giao"
                    formik={formik}
                    field="ngayBanGiao"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldDateTime
                    title="Ngày tạo chứng từ"
                    formik={formik}
                    field="ngayTaoChungTu"
                    disabled={isFormReadOnly}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* CỘT 2 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <FieldAutoCompleted
                    labelkey="tenPhongBan"
                    title="Đơn vị giao (Bên A)"
                    formik={formik}
                    field="idDonViGiao"
                    data={departments}
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldAutoCompleted
                    labelkey="tenPhongBan"
                    title="Đơn vị nhận (Bên B)"
                    formik={formik}
                    field="idDonViNhan"
                    data={departments}
                    disabled={isFormReadOnly}
                  />
                </Grid>

                <FormikProvider value={formik}>
                  <FieldArray name="nguoiKyList">
                    {({ push, remove }) => (
                      <Grid size={12}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <Typography variant="subtitle2">
                            Người đại diện các bên:
                          </Typography>
                          {!isFormReadOnly && (
                            <Button
                              size="small"
                              startIcon={<Add />}
                              onClick={() =>
                                push({ idPhongBan: "", idNguoiKy: "" })
                              }
                            >
                              Thêm người đại diện
                            </Button>
                          )}
                        </Box>
                        {(formik.values.nguoiKyList || []).map(
                          (item: any, index: number) => (
                            <Grid
                              container
                              spacing={1}
                              key={index}
                              sx={{ mb: 1 }}
                            >
                              <Grid size={5.5}>
                                <FieldAutoCompleted
                                  title={`Đơn vị đại diện ${index + 1}`}
                                  formik={formik}
                                  field={`nguoiKyList.${index}.idPhongBan`}
                                  data={departments}
                                  labelkey="tenPhongBan"
                                  disabled={isFormReadOnly}
                                />
                              </Grid>
                              <Grid size={5.5}>
                                <FieldAutoCompleted
                                  title={`Người đại diện ${index + 1}`}
                                  formik={formik}
                                  field={`nguoiKyList.${index}.idNguoiKy`}
                                  data={staffs.filter(
                                    (s: any) =>
                                      s.phongBanId === item.idPhongBan,
                                  )}
                                  labelkey="hoTen"
                                  disabled={isFormReadOnly}
                                />
                              </Grid>
                              {!isFormReadOnly && index > 0 && (
                                <Grid
                                  size={1}
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <IconButton
                                    color="error"
                                    onClick={() => remove(index)}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Grid>
                              )}
                            </Grid>
                          ),
                        )}
                      </Grid>
                    )}
                  </FieldArray>
                </FormikProvider>

                <Grid size={12} sx={{ mt: 2 }}>
                  <FieldAutoCompleted
                    labelkey="hoTen"
                    title="Giám đốc xác nhận"
                    formik={formik}
                    field="idGiamDoc"
                    data={staffs}
                    disabled={isFormReadOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* PHẦN 2: TÀI LIỆU QUYẾT ĐỊNH */}
          <Box mt={4} mb={4}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Tài liệu Quyết định
            </Typography>

            {/* Khung bao ngoài màu xám để chứa input file */}
            <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: "4px", p: 2 }}>
              <FileAttachmentInput
                formik={formik}
                fileName="tenFile"
                setDocument={setDocument}
                disabled={isFormReadOnly}
              />

              {/* Hiển thị định dạng hỗ trợ và Nút xem trước */}
              <Box mt={1} display="flex" flexDirection="column" gap={0.5}>
                {/* Chỉ hiện nút xem trước nếu đã có file (tên file không rỗng) */}
                {formik.values.tenFile && (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    sx={{
                      cursor: "pointer",
                      color: "#1976d2",
                      width: "fit-content",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (formik.values.tenFile) {
                        setPreviewFileName(formik.values.tenFile);
                      } else {
                        alert("Không có file để xem!");
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Xem trước tài liệu
                    </Typography>
                    <Visibility sx={{ fontSize: 18 }} />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* PHẦN 3: CHI TIẾT CCDC - VẬT TƯ BÀN GIAO */}
          <Box
            mt={3}
            sx={{ backgroundColor: "#f5f5f5", borderRadius: "4px", p: 1 }}
          >
            {/* Header của bảng nhỏ - Hoạt động giống cái lớn */}
            <Box
              onClick={() => setTableExpanded(!tableExpanded)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                px: 1,
                py: 0.5,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {tableExpanded ? (
                  <ArrowDropUp sx={{ color: "text.secondary", fontSize: 20 }} />
                ) : (
                  <ArrowDropDown
                    sx={{ color: "text.secondary", fontSize: 20 }}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{ color: "#666", fontSize: "13px" }}
                >
                  Chi tiết ccdc - vật tư bàn giao
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "#666", fontSize: "13px" }}
              >
                {tableExpanded ? "Thu gọn" : "Mở rộng"}
              </Typography>
            </Box>

            {/* Nội dung bảng bên trong lớp nền trắng */}
            <Collapse in={tableExpanded}>
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: "none",
                  border: "none",
                  backgroundColor: "#fff",
                  mt: 1,
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <CustomTableCell
                        width="35%"
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        Tên ccdc - vật tư
                      </CustomTableCell>
                      <CustomTableCell
                        width="15%"
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        Đơn vị tính
                      </CustomTableCell>
                      <CustomTableCell
                        width="10%"
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        Số lượng
                      </CustomTableCell>
                      <CustomTableCell
                        width="20%"
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        Tình trạng kỹ thuật
                      </CustomTableCell>
                      <CustomTableCell
                        width="20%"
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        Ghi chú
                      </CustomTableCell>
                      {!isFormReadOnly && (
                        <CustomTableCell
                          width="45px"
                          sx={{ borderBottom: "1px solid #eee" }}
                        />
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(formik.values.chiTietBanGiaoCCDC || []).map(
                      (row: any, index: number) => (
                        <TableRow
                          key={index}
                          sx={{
                            height: "50px",
                            "&:hover": { backgroundColor: "#fafafa" },
                            "& td": { borderBottom: "none" },
                          }}
                        >
                          {/* 1. Tên ccdc - vật tư */}
                          <CustomTableCell
                            sx={{ py: 0.5, px: 1, verticalAlign: "bottom" }}
                          >
                            <UnderlinedInputWrapper>
                              <FieldAutoCompleted
                                labelkey="tenCCDC"
                                title=""
                                formik={formik}
                                field={`chiTietBanGiaoCCDC.${index}.idCCDC`}
                                data={allTools}
                                disabled={isFormReadOnly}
                                onChange={(newValue: any) => {
                                  if (newValue) {
                                    formik.setFieldValue(
                                      `chiTietBanGiaoCCDC.${index}.tenCCDC`,
                                      newValue.tenCCDC,
                                    );
                                    formik.setFieldValue(
                                      `chiTietBanGiaoCCDC.${index}.donViTinh`,
                                      newValue.donViTinh,
                                    );
                                    formik.setFieldValue(
                                      `chiTietBanGiaoCCDC.${index}.hienTrang`,
                                      newValue.hienTrang || "1",
                                    );
                                  }
                                }}
                              />
                            </UnderlinedInputWrapper>
                          </CustomTableCell>

                          {/* 2. Đơn vị tính */}
                          <CustomTableCell
                            sx={{ py: 0.5, px: 1, verticalAlign: "bottom" }}
                          >
                            <UnderlinedInputWrapper>
                              <FieldInput
                                title=""
                                formik={formik}
                                field={`chiTietBanGiaoCCDC.${index}.donViTinh`}
                                InputProps={{
                                  value:
                                    formik.values.chiTietBanGiaoCCDC[index]
                                      ?.donViTinh || "",
                                }}
                                disabled={isFormReadOnly}
                              />
                            </UnderlinedInputWrapper>
                          </CustomTableCell>

                          {/* 3. Số lượng */}
                          <CustomTableCell
                            sx={{ py: 0.5, px: 1, verticalAlign: "bottom" }}
                          >
                            <UnderlinedInputWrapper>
                              <FieldInput
                                title=""
                                type="number"
                                formik={formik}
                                field={`chiTietBanGiaoCCDC.${index}.soLuong`}
                                InputProps={{
                                  value:
                                    formik.values.chiTietBanGiaoCCDC[index]
                                      ?.soLuong ?? 0,
                                }}
                                disabled={isFormReadOnly}
                              />
                            </UnderlinedInputWrapper>
                          </CustomTableCell>

                          {/* 4. Tình trạng kỹ thuật */}
                          <CustomTableCell
                            sx={{ py: 0.5, px: 1, verticalAlign: "bottom" }}
                          >
                            <UnderlinedInputWrapper>
                              <FieldInput
                                title=""
                                formik={formik}
                                field={`chiTietBanGiaoCCDC.${index}.hienTrang`}
                                InputProps={{
                                  value: (() => {
                                    const val =
                                      formik.values.chiTietBanGiaoCCDC[index]
                                        ?.hienTrang;
                                    if (val === "1") return "Đang sử dụng";
                                    return val || "";
                                  })(),
                                }}
                                disabled={isFormReadOnly}
                              />
                            </UnderlinedInputWrapper>
                          </CustomTableCell>

                          {/* 5. Ghi chú */}
                          <CustomTableCell
                            sx={{ py: 0.5, px: 1, verticalAlign: "bottom" }}
                          >
                            <UnderlinedInputWrapper>
                              <FieldInput
                                title=""
                                formik={formik}
                                field={`chiTietBanGiaoCCDC.${index}.ghiChu`}
                                InputProps={{
                                  value:
                                    formik.values.chiTietBanGiaoCCDC[index]
                                      ?.ghiChu || "",
                                }}
                                disabled={isFormReadOnly}
                              />
                            </UnderlinedInputWrapper>
                          </CustomTableCell>

                          {/* Nút xóa - Chỉ hiện khi không phải chế độ xem */}
                          {!isFormReadOnly && (
                            <CustomTableCell
                              align="center"
                              sx={{ py: 0.5, verticalAlign: "bottom" }}
                            >
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => {
                                  const newTools = [
                                    ...formik.values.chiTietBanGiaoCCDC,
                                  ];
                                  newTools.splice(index, 1);
                                  formik.setFieldValue(
                                    "chiTietBanGiaoCCDC",
                                    newTools,
                                  );
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </CustomTableCell>
                          )}
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>

                {/* Nút thêm mới - chỉ hiện khi không ReadOnly */}
                {!isFormReadOnly && (
                  <Box p={1} display="flex" justifyContent="flex-start">
                    <Button
                      startIcon={<Add />}
                      size="small"
                      onClick={() =>
                        formik.setFieldValue("chiTietBanGiaoCCDC", [
                          ...formik.values.chiTietBanGiaoCCDC,
                          {
                            idCCDC: "",
                            donViTinh: "",
                            soLuong: 1,
                            hienTrang: "1",
                            ghiChu: "",
                          },
                        ])
                      }
                      sx={{ textTransform: "none", color: "#1976d2" }}
                    >
                      Thêm ccdc - vật tư
                    </Button>
                  </Box>
                )}
              </TableContainer>
            </Collapse>
          </Box>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
