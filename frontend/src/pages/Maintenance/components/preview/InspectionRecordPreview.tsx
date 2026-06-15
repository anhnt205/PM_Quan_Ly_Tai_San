import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { Action } from "../../../../utils/const";

export default function InspectionRecordPreview({
  formik,
  plan,
  repairRequest,
  tieude,
  congty,
}: {
  formik?: any;
  plan?: any;
  repairRequest?: any;
  tieude?: string;
  congty?: string;
}) {
  return (
    <Box
      sx={{
        fontFamily: "serif",
        fontSize: "0.875rem",
        lineHeight: 1.8,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="caption" display="block">
            TẬP ĐOÀN CÔNG NGHIỆP
          </Typography>
          <Typography variant="caption" display="block">
            THAN – KHOÁNG SẢN VIỆT NAM
          </Typography>
          <Typography
            variant="caption"
            display="block"
            fontWeight={700}
            sx={{ textTransform: "uppercase", textDecoration: "underline" }}
          >
            Công ty {congty || "............."}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" display="block" fontWeight={700}>
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </Typography>
          <Typography variant="caption" display="block" fontWeight={700}>
            <u>Độc lập – Tự do – Hạnh phúc</u>
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="caption"
        display="block"
        sx={{ textAlign: "right", fontStyle: "italic", mb: 2 }}
      >
        Quảng Ninh, ngày {new Date(formik?.values?.ngayGiamDinh).getDate()}{" "}
        tháng {new Date(formik?.values?.ngayGiamDinh).getMonth() + 1} năm{" "}
        {new Date(formik?.values?.ngayGiamDinh).getFullYear()}
      </Typography>
      <Typography
        variant="subtitle2"
        align="center"
        fontWeight={700}
        display="block"
        sx={{ color: "primary.main", mb: 0.5 }}
      >
        BIÊN BẢN
      </Typography>
      <Typography
        variant="subtitle2"
        align="center"
        fontWeight={700}
        display="block"
        sx={{ mb: 2, textTransform: "uppercase" }}
      >
        {tieude || "................................................................."}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Hôm nay, ngày {new Date(formik?.values?.ngayGiamDinh).getDate()} tháng{" "}
        {new Date(formik?.values?.ngayGiamDinh).getMonth() + 1} năm{" "}
        {new Date(formik?.values?.ngayGiamDinh).getFullYear()}. Tại{" "}
        {formik?.values?.viTri || "……………………………"}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Chúng tôi gồm:
      </Typography>
      <Box sx={{ pl: 2, mb: 1 }}>
        {formik?.values?.nguoiKyList?.map((s: any, i: number) => (
          <Box key={i} sx={{ display: "flex", gap: 3, mb: 0.25 }}>
            <Typography variant="caption" sx={{ minWidth: 16 }}>
              {i + 1}.
            </Typography>
            <Typography
              variant="caption"
              sx={{ minWidth: 140, fontWeight: 500 }}
            >
              {s.userName || "………………………"}
            </Typography>
            <Typography variant="caption" sx={{ minWidth: 120 }}>
              {s.position || "………………………"}
            </Typography>
            <Typography variant="caption">{s.departmentName}</Typography>
          </Box>
        ))}
      </Box>
      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
        Cùng tiến hành thực hiện giải thể và kiểm tra tình trạng kỹ thuật thiết
        bị theo văn bản đề nghị số <b>{repairRequest?.soPhieu ?? plan?.id}</b>{" "}
        ngày {repairRequest?.ngayTao ?? "—"} của phân xưởng{" "}
        {plan?.tenDonViGiao || "……………"}.
      </Typography>
      <Typography variant="caption" display="block">
        Số đăng ký: ……………… trước khi đưa vào sửa chữa cấp ………………
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
        Với tình trạng kỹ thuật và nội dung sửa chữa như sau:
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5 }}>
        <Table size="small" sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell
                sx={{ fontWeight: 700, width: 45, fontSize: "0.75rem" }}
              >
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                Tên vật tư, thiết bị
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, width: 50, fontSize: "0.75rem" }}
              >
                ĐVT
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, width: 40, fontSize: "0.75rem" }}
              >
                SL
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                Tình trạng kỹ thuật
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, width: 65, fontSize: "0.75rem" }}
              >
                SL S.chữa
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, width: 65, fontSize: "0.75rem" }}
              >
                SL Thay mới
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, width: 90, fontSize: "0.75rem" }}
              >
                Ghi chú
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formik?.values?.danhSachChiTiet?.map((entry: any, idx: number) => (
              <React.Fragment key={`pv-group-${idx}`}>
                <TableRow key={`group-${idx}`} sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                    {String.fromCharCode(73 + idx)}/
                  </TableCell>
                  <TableCell
                    colSpan={7}
                    sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                  >
                    Thiết bị: {entry.tenTaiSan}
                  </TableCell>
                </TableRow>
                {!entry.danhSachVatTu ||
                entry.danhSachVatTu.filter(
                  (v: any) => v.action !== Action.DELETE,
                ).length === 0 ? (
                  <TableRow key={`empty-${idx}`}>
                    <TableCell></TableCell>
                    <TableCell
                      colSpan={7}
                      sx={{ fontSize: "0.75rem", fontStyle: "italic" }}
                    >
                      Chưa có vật tư/linh kiện nào được giám định.
                    </TableCell>
                  </TableRow>
                ) : (
                  entry.danhSachVatTu
                    .filter((v: any) => v.action !== Action.DELETE)
                    .map((vt: any, vtIdx: number) => (
                      <TableRow key={`vt-${vt.id || vtIdx}`}>
                        <TableCell sx={{ fontSize: "0.75rem", align: "right" }}>
                          {idx + 1}.{vtIdx + 1}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {vt.tenVatTu || vt.idChiTietVatTu || "—"}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {vt.donViTinh}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {vt.soLuong}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {vt.tinhTrang}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "0.75rem" }}>
                          {vt.soLuongSuaChua || 0}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "0.75rem" }}>
                          {vt.soLuongThayMoi || 0}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {vt.ghiChu}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption" display="block">
        Số để lại phục hồi: {formik?.values?.soDeLaiPhucHoi || "…………"}.
      </Typography>
      <Typography variant="caption" display="block">
        Số để làm phế liệu: {formik?.values?.soDeLamPheLieu || "…………"} (mục)
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
        Số lượng hủy: {formik?.values?.soLuongHuy || "…………"} (mục)
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 2 }}>
        Biên bản được lập xong lúc …… giờ cùng ngày và được các thành phần cùng
        thống nhất thông qua./.
      </Typography>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {(() => {
          const sorted = [...(formik?.values?.nguoiKyList || [])].sort(
            (a, b) => (a.order || 0) - (b.order || 0),
          );
          const cols = sorted.map((s) => ({
            label: (s.departmentName || "").toUpperCase(),
            signer: s,
          }));

          if (cols.length === 0) {
            return (
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Typography variant="caption" color="text.disabled">
                  Chưa có người duyệt
                </Typography>
              </Box>
            );
          }

          return cols.map((col, idx) => (
            <Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                variant="caption"
                fontWeight={700}
                display="block"
                sx={{ textTransform: "uppercase", mb: 0.5 }}
              >
                {col.label}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ fontStyle: "italic", mb: 4 }}
              >
                (Ký, ghi rõ họ tên)
              </Typography>
              <Box
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "text.primary",
                  width: "70%",
                  mx: "auto",
                  mb: 0.5,
                }}
              />
              {col.signer ? (
                <>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    display="block"
                  >
                    {col.signer.userName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {col.signer.departmentName}
                  </Typography>
                </>
              ) : (
                <Typography variant="caption" color="text.disabled">
                  Chưa chọn
                </Typography>
              )}
            </Box>
          ));
        })()}
      </Box>
    </Box>
  );
}
