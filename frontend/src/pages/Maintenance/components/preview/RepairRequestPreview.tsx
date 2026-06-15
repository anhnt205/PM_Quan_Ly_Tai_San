import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import { departments } from "../../../../mockdata/mockDepartments";
import type { PlanSigner } from "../../../../mockdata/mockPlans";
import { MaintenancePlanData } from "../../types";

interface Props {
  assets: any[];
  month: number;
  year: number;
  number: string;
  signers: PlanSigner[];
  sourceDeptId: string;
  execDeptId: string;
  note: string;
  tieude?: string;
  congty?: string;
}

const RepairRequestPreview = ({
  assets,
  month,
  year,
  number,
  signers,
  sourceDeptId,
  execDeptId,
  note,
  tieude,
  congty,
}: Props) => {
  const sourceDept = departments.find((d) => d.id === sourceDeptId);
  const execDept = departments.find((d) => d.id === execDeptId);

  const today = new Date();
  const dateStr = `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, mt: 2, fontFamily: '"Times New Roman", serif' }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}
          >
            CÔNG TY {congty ? congty : "..."}
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            Đơn vị: {sourceDept?.name || ""}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}
          >
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            Độc lập – Tự do – Hạnh phúc
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          textAlign: "right",
          fontStyle: "italic",
          fontSize: 12,
          mb: 2,
          fontFamily: "inherit",
        }}
      >
        {dateStr}
      </Typography>

      {/* Title */}
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 16,
          color: "primary.main",
          fontFamily: "inherit",
          textTransform: "uppercase",
        }}
      >
        {tieude ? tieude : "..."}
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
          color: "error.main",
          fontSize: 13,
          mb: 2,
          fontFamily: "inherit",
        }}
      >
        Số: {number || "..."}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Content */}
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: "inherit" }}>
        - Căn cứ vào Kế hoạch SCBD tháng <b>{month}</b> năm <b>{year}</b>
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: "inherit" }}>
        - Phân xưởng: <b>{sourceDept?.name || "..."}</b> đề nghị{" "}
        <b>{execDept?.name || "..."}</b> duyệt cho đơn vị thực hiện sửa chữa bảo
        dưỡng một số hệ thống thiết bị:
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 0.5, fontFamily: "inherit" }}>
        - Tên thiết bị: theo bảng kê chi tiết dưới đây
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 0.5, fontFamily: "inherit" }}>
        - Vị trí lắp đặt: {sourceDept?.name || "..."}
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 0.5, fontFamily: "inherit" }}>
        - Thời gian hoạt động: tháng {month}/{year}
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 2, fontFamily: "inherit" }}>
        - Nội dung sửa chữa: {note || "..."}
      </Typography>

      {/* Device table */}
      <TableContainer sx={{ mb: 2 }}>
        <Table
          size="small"
          sx={{
            "& th, & td": {
              fontSize: 11,
              fontFamily: '"Times New Roman", serif',
              border: "1px solid #999",
              py: 0.5,
              px: 1,
            },
          }}
        >
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                STT
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Mã TB
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Tên TB
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Nhóm
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Loại BT
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                SL
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Đơn vị quản lý
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Đơn vị bảo trì
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Ghi chú
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(assets ?? []).map((device: any, idx: number) => {
              return (
                <TableRow key={device.idTaiSan}>
                  <TableCell align="center">{idx + 1}</TableCell>
                  <TableCell align="center">{device.idTaiSan}</TableCell>
                  <TableCell>{device.tenTaiSan}</TableCell>
                  <TableCell align="center">{device.nhomTaiSan}</TableCell>
                  <TableCell align="center">{device.capSuaChua}</TableCell>
                  <TableCell align="center">{device.soLuong}</TableCell>
                  <TableCell align="center">
                    {device.donViQuanLy || ""}
                  </TableCell>
                  <TableCell align="center">
                    {device.donViBaoTri || ""}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Signatures */}
      <Box
        sx={{ mt: 4, display: "flex", justifyContent: "space-between", gap: 2 }}
      >
        {(() => {
          const sorted = [...(signers || [])].sort(
            (a, b) => (a.order || 0) - (b.order || 0),
          );
          const cols = sorted.map((s, idx) => ({
            label:
              idx === 0
                ? "Người lập"
                : idx === sorted.length - 1
                  ? "Phê duyệt"
                  : (s.departmentName || "").toUpperCase(),
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
    </Paper>
  );
};

export default RepairRequestPreview;
