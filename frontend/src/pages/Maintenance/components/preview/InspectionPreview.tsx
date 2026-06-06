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
} from "@mui/material";
import type { TechnicalInspectionRecord } from "../../../../mockdata/mockInspectionRecords";

interface Props {
  row: TechnicalInspectionRecord;
}

const InspectionPreview = ({ row }: Props) => {
  if (!row) return null;

  const d = row.inspectionDate ? new Date(row.inspectionDate) : new Date();
  const signers = row.signers ?? [];
  const entries = row.deviceEntries ?? [];

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
      {/* Header 2 cột */}
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
            Công <u>ty than KHO VẬN CẨM PHÁ</u> - VINACOMIN
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

      {/* Địa danh ngày tháng */}
      <Typography
        variant="caption"
        display="block"
        sx={{ textAlign: "right", fontStyle: "italic", mb: 2 }}
      >
        Quảng Ninh, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
        {d.getFullYear()}
      </Typography>

      {/* Tiêu đề */}
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
        sx={{ mb: 2 }}
      >
        GIÁM ĐỊNH KỸ THUẬT VÀ BÀN GIAO THIẾT BỊ ĐƯA VÀO SỬA CHỮA
      </Typography>

      {/* Mở đầu */}
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Hôm nay, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
        {d.getFullYear()}. Tại {row.location || "……………………………"}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Chúng tôi gồm:
      </Typography>
      <Box sx={{ pl: 2, mb: 1 }}>
        {signers.map((s: any, i: number) => (
          <Box key={i} sx={{ display: "flex", gap: 3, mb: 0.25 }}>
            <Typography variant="caption" sx={{ minWidth: 16 }}>
              {i + 1}.
            </Typography>
            <Typography
              variant="caption"
              sx={{ minWidth: 140, fontWeight: 500 }}
            >
              {s.name || "………………………"}
            </Typography>
            <Typography variant="caption" sx={{ minWidth: 120 }}>
              {s.title}
            </Typography>
            <Typography variant="caption">{s.departmentName}</Typography>
          </Box>
        ))}
      </Box>

      {/* Căn cứ */}
      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
        Cùng tiến hành thực hiện giải thể và kiểm tra tình trạng kỹ thuật thiết
        bị theo văn bản đề nghị số <b>{row.repairRequestId || "……………"}</b> của
        phân xưởng.
      </Typography>

      <Typography variant="caption" display="block">
        Số đăng ký: ……………… trước khi đưa vào sửa chữa cấp ………………
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
        Với tình trạng kỹ thuật và nội dung sửa chữa như sau:
      </Typography>

      {/* Bảng thiết bị */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5 }}>
        <Table size="small" sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell
                sx={{ fontWeight: 700, width: 40, fontSize: "0.75rem" }}
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
                sx={{ fontWeight: 700, width: 55, fontSize: "0.75rem" }}
              >
                S.chữa
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, width: 65, fontSize: "0.75rem" }}
              >
                Thay mới
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, width: 80, fontSize: "0.75rem" }}
              >
                Ghi chú
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry: any, idx: number) => (
              <>
                <TableRow key={`group-${idx}`} sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                    {String.fromCharCode(73 + idx)}/
                  </TableCell>
                  <TableCell
                    colSpan={7}
                    sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                  >
                    Thiết bị: {entry.deviceName}
                  </TableCell>
                </TableRow>
                <TableRow key={`entry-${idx}`}>
                  <TableCell sx={{ fontSize: "0.75rem" }}></TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {entry.deviceName}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {entry.unit}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {entry.quantity}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {entry.technicalCondition}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.75rem" }}>
                    {entry.actionRepair ? "✓" : ""}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.75rem" }}>
                    {entry.actionReplace ? "✓" : ""}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {entry.note}
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tổng kết vật tư */}
      <Typography variant="caption" display="block">
        Số để lại phục hồi phục vụ cho sản xuất: {row.recoveryCount ?? "…………"}.
      </Typography>
      <Typography variant="caption" display="block">
        Số để làm phế liệu: {row.scrapCount ?? "…………"} (mục)
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
        Số lượng hủy: {row.destroyCount ?? "…………"} (mục)
      </Typography>

      {/* Kết thúc */}
      <Typography variant="caption" display="block" sx={{ mb: 2 }}>
        Biên bản được lập xong lúc …… giờ cùng ngày và được các thành phần cùng
        thống nhất thông qua./.
      </Typography>

      {/* Chữ ký — 3 cột */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {[
          {
            label: signers[2]?.departmentName || "Phân xưởng",
            signer: signers[2],
          },
          {
            label: signers[3]?.departmentName || "Phân xưởng",
            signer: signers[3],
          },
          { label: "Phòng CV", signer: signers[0] },
        ].map((col, idx) => (
          <Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              variant="caption"
              fontWeight={700}
              display="block"
              sx={{ textTransform: "uppercase" }}
            >
              {col.label}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ fontStyle: "italic", mb: 3 }}
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
              {col.signer?.name || ""}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {col.signer?.title || ""}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default InspectionPreview;
