import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import { Action } from "../../../../utils/const";

export default function InspectionRecordVehiclePreview({
  formik,
}: {
  formik: any;
}) {
  const groupSignersByDept = (signerList: any[]) => {
    const groups: { deptName: string; members: any[] }[] = [];
    signerList.forEach((s) => {
      const deptName = s.departmentName || "Bộ phận khác";
      let group = groups.find((g) => g.deptName === deptName);
      if (!group) {
        group = { deptName, members: [] };
        groups.push(group);
      }
      group.members.push(s);
    });
    return groups;
  };
  return (
    <Box
      sx={{
        fontFamily: "serif",
        fontSize: "0.875rem",
        lineHeight: 1.8,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 4,
        bgcolor: "#fff",
        color: "#333",
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
            sx={{ textTransform: "uppercase" }}
          >
            <u>CÔNG TY THAN UÔNG BÍ - TKV</u>
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
        Quảng Ninh, ngày {new Date(formik.values.ngayGiamDinh).getDate()} tháng{" "}
        {new Date(formik.values.ngayGiamDinh).getMonth() + 1} năm{" "}
        {new Date(formik.values.ngayGiamDinh).getFullYear()}
      </Typography>

      <Typography
        variant="subtitle1"
        align="center"
        fontWeight={700}
        display="block"
        sx={{ color: "primary.main", mb: 0.5 }}
      >
        BIÊN BẢN GIÁM ĐỊNH KỸ THUẬT VÀ BÀN GIAO THIẾT BỊ
      </Typography>
      <Typography
        variant="subtitle2"
        align="center"
        fontWeight={700}
        display="block"
        sx={{ mb: 2 }}
      >
        VÀO SỬA CHỮA
      </Typography>

      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Hôm nay, ngày {new Date(formik.values.ngayGiamDinh).getDate()} tháng{" "}
        {new Date(formik.values.ngayGiamDinh).getMonth() + 1} năm{" "}
        {new Date(formik.values.ngayGiamDinh).getFullYear()}. Tại{" "}
        {formik.values.viTri || "……………………………"}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Chúng tôi gồm :
      </Typography>

      <Box sx={{ pl: 2, mb: 1.5 }}>
        {groupSignersByDept(formik.values.nguoiKyList).map((group, gIdx) => (
          <Box key={gIdx} sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              fontWeight={700}
              display="block"
              sx={{ mb: 0.25 }}
            >
              * {group.deptName}:
            </Typography>
            <Box sx={{ pl: 3 }}>
              {group.members.map((member, mIdx) => (
                <Box
                  key={member.userId || mIdx}
                  sx={{
                    display: "flex",
                    mb: 0.25,
                    alignItems: "baseline",
                  }}
                >
                  <Typography variant="caption" sx={{ width: 25 }}>
                    {mIdx + 1}.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ width: 200, fontWeight: 500 }}
                  >
                    Ông: {member.userName || "………………………"}
                  </Typography>
                  <Typography variant="caption">
                    Chức vụ: {member.position || "—"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
        {formik.values.nguoiKyList.length === 0 && (
          <Typography
            variant="caption"
            sx={{ fontStyle: "italic", color: "text.secondary" }}
          >
            (Chưa chọn thành phần tham gia)
          </Typography>
        )}
      </Box>

      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
        Cùng thực hiện giải thể kiểm tra tình trạng kỹ thuật thiết bị:{" "}
        {formik.values.tenTaiSan || ".............."} trước khi vào sửa chữa bảo
        dưỡng cấp {formik.values.capBaoDuong || "............"} và bàn giao cho
        phân xưởng {formik.values.donViSuaChua || "............."} sửa chữa với
        tình trạng kỹ thuật và nội dung sửa chữa sau:
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell
                sx={{ fontWeight: 700, width: 45, fontSize: "0.75rem" }}
              >
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                TÊN CHI TIẾT
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, width: 70, fontSize: "0.75rem" }}
              >
                ĐVT
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, width: 50, fontSize: "0.75rem" }}
              >
                Số lượng
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                Tình trạng kỹ thuật
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, width: 80, fontSize: "0.75rem" }}
              >
                Thay mới
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, width: 80, fontSize: "0.75rem" }}
              >
                Sửa chữa
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, width: 120, fontSize: "0.75rem" }}
              >
                Ghi chú
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formik.values.danhSachChiTiet
              .filter((v: any) => v.action !== Action.DELETE)
              .map((vt: any, vtIdx: number) => (
                <TableRow key={vt.id || vtIdx}>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {vtIdx + 1}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {vt.tenVatTu || vt.idChiTietVatTu || "—"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {vt.donViTinh || "—"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {vt.soLuong || 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {vt.tinhTrang || "—"}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.75rem" }}>
                    {vt.soLuongThayMoi || 0}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.75rem" }}>
                    {vt.soLuongSuaChua || 0}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {vt.ghiChu || "—"}
                  </TableCell>
                </TableRow>
              ))}
            {formik.values.danhSachChiTiet.filter(
              (v: any) => v.action !== Action.DELETE,
            ).length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{ py: 2, fontSize: "0.75rem", fontStyle: "italic" }}
                >
                  Chưa có vật tư nào được liệt kê trong biên bản giám định
                  phương tiện.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="caption"
        display="block"
        sx={{ mb: 1.5, whiteSpace: "pre-line" }}
      >
        Các nội dung cần thống nhất khác:{" "}
        {formik.values.noiDungKhac || "................."}
      </Typography>

      <Typography variant="caption" display="block" sx={{ mb: 2 }}>
        Biên bản lập xong hồi: .... giờ ....cùng ngày, đã được mọi người nhất
        trí thông qua
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
          const sorted = [...(formik.values.nguoiKyList || [])].sort(
            (a, b) => (a.order || 0) - (b.order || 0),
          );

          if (sorted.length === 0) {
            return (
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Typography variant="caption" color="text.disabled">
                  Chưa có người ký duyệt
                </Typography>
              </Box>
            );
          }

          return sorted.map((col, idx) => (
            <Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                variant="caption"
                fontWeight={700}
                display="block"
                sx={{ textTransform: "uppercase", mb: 0.5 }}
              >
                {(col.departmentName || "").toUpperCase()}
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
              <Typography variant="caption" fontWeight={600} display="block">
                {col.userName}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                {col.position}
              </Typography>
            </Box>
          ));
        })()}
      </Box>
    </Box>
  );
}
