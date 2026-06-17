import {
  Box,
  Divider,
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

export default function AcceptanceTestPreview({
  formik,
  d,
  tieude,
  congty,
}: {
  formik?: any;
  d: Date;
  tieude?: string;
  congty?: string;
}) {
  return (
    <Box
      sx={{
        mt: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 2.5,
        fontFamily: "serif",
        fontSize: "0.875rem",
        lineHeight: 1.8,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
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
            CÔNG TY {congty || "............."}
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
        Quảng Ninh, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
        {d.getFullYear()}
      </Typography>

      <Typography
        variant="subtitle2"
        align="center"
        fontWeight={700}
        sx={{ color: "primary.main", mb: 0.25 }}
      >
        BIÊN BẢN
      </Typography>
      <Typography
        variant="subtitle2"
        align="center"
        fontWeight={700}
        sx={{ mb: 2, textTransform: "uppercase" }}
      >
        {tieude ||
          ".............................................................."}
      </Typography>

      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Hôm nay, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
        {d.getFullYear()}. Tại {formik?.values.viTri || "………………………"}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Chúng tôi gồm:
      </Typography>
      <Box sx={{ pl: 2, mb: 1.5 }}>
        {formik?.values.nguoiKyList.map((s: any, i: number) => (
          <Box key={i} sx={{ display: "flex", gap: 3, mb: 0.25 }}>
            <Typography variant="caption" sx={{ minWidth: 16 }}>
              {i + 1}.
            </Typography>
            <Typography
              variant="caption"
              sx={{ minWidth: 150, fontWeight: 500 }}
            >
              {s.userName || "………………………"}
            </Typography>
            <Typography variant="caption" sx={{ minWidth: 120 }}>
              {s.departmentName}
            </Typography>
            <Typography variant="caption">{s.departmentName}</Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
        Cùng tiến hành nghiệm thu thiết bị: <b>{formik?.values.tenThietBi}</b>
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5 }}>
        <Table size="small" sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell
                sx={{ fontWeight: 700, width: 40, fontSize: "0.72rem" }}
              >
                STT
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, width: 150, fontSize: "0.72rem" }}
              >
                Mã VT
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                Tên vật tư, thiết bị
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, width: 45, fontSize: "0.72rem" }}
              >
                ĐVT
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, width: 100, fontSize: "0.72rem" }}
              >
                SL
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, width: 150, fontSize: "0.72rem" }}
              >
                Ghi chú
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formik?.values.danhSachTaiSan.map((ts: any, assetIdx: number) => {
              const activeVatTu = ts.danhSachVatTu || [];
              return (
                <React.Fragment key={`pv-${ts.id || assetIdx}`}>
                  <TableRow sx={{ bgcolor: "#fafafa" }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                      {String.fromCharCode(73 + assetIdx)}/
                    </TableCell>
                    <TableCell
                      colSpan={5}
                      sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                    >
                      Thiết bị: {ts.tenTaiSan || ts.idTaiSan}
                    </TableCell>
                  </TableRow>
                  {activeVatTu.map((item: any, ri: number) => (
                    <TableRow key={`pv-vt-${item.id || ri}`}>
                      <TableCell sx={{ fontSize: "0.72rem", pl: 2 }}>
                        {String(ri + 1).padStart(2, "0")}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.72rem" }}>
                        {item.idVatTu}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.72rem" }}>
                        {item.tenVatTu}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.72rem" }}>
                        {item.donViTinh}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.72rem" }}>
                        {item.soLuong}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.72rem" }}>
                        {item.ghiChu}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="caption"
        display="block"
        fontWeight={700}
        sx={{ mb: 0.5 }}
      >
        2. Kết quả kiểm tra chạy thử:{" "}
        <span style={{ fontWeight: 400 }}>{formik?.values.ketQua}</span>
      </Typography>
      <Typography
        variant="caption"
        display="block"
        fontWeight={700}
        sx={{ mb: 0.5 }}
      >
        3. Các nội dung sửa chữa được nghiệm thu
      </Typography>
      <Typography
        variant="caption"
        display="block"
        sx={{ mb: 0.5, borderBottom: "1px dotted #999", pb: 0.5 }}
      >
        {formik?.values.noiDung || "………………………………………………………………………………………………………………"}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 2 }}>
        ………………………………………………………………………………………………………………
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {(() => {
          const sorted = [...(formik?.values.nguoiKyList || [])].sort(
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
