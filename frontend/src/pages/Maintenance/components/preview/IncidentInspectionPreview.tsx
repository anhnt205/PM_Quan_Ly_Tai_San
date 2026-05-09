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
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import type {
  IncidentInspectionRecord,
  IncidentInspectionSigner,
} from "../../../../mockdata/mockIncidentInspection";
import { PlanSigner } from "../../../../mockdata/mockPlans";

interface Props {
  number?: string;
  inspectionDate?: string;
  location?: string;
  findings?: string;
  recommendation?: string;
  items?: Array<{
    stt: number;
    itemName: string;
    repairLevel: string;
    unit?: string;
    quantity: number;
    condition: string;
    actionRepair: boolean;
    actionReplace: boolean;
    note: string;
  }>;
  signers?: PlanSigner[];
}

const IncidentInspectionPreview = ({
  number,
  inspectionDate,
  location,
  findings,
  recommendation,
  items = [],
  signers = [],
}: Props) => {
  const { data: apiDepartments = [] } = useAllDepartmentsQuery();

  const today = new Date();
  const dateStr =
    inspectionDate ||
    `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, mt: 0, fontFamily: '"Times New Roman", serif' }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography
            sx={{ fontSize: 13, fontFamily: "inherit" }}
          >
            TẬP ĐOÀN CÔNG NGHIỆP
          </Typography>
          <Typography
            sx={{ fontSize: 13, fontFamily: "inherit" }}
          >
            THAN - KHOÁNG SẢN VIỆT NAM
          </Typography>
          <Typography
            sx={{ fontWeight: 700, fontSize: 13, fontFamily: "inherit", textDecoration: "underline" }}
          >
            CÔNG TY THAN UÔNG BÍ - TKV
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "inherit",
              color: "#0066cc",
            }}
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
          fontSize: 14,
          color: "#0066cc",
          mb: 1,
          fontFamily: "inherit",
        }}
      >
        BIÊN BAN
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 14,
          color: "#0066cc",
          mb: 2,
          fontFamily: "inherit",
        }}
      >
        KIỂM TRA SỰ CỐ THIẾT BỊ
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Chủ tịch, Hôm nay, Chứng tỏ gồm */}
      <Box sx={{ mb: 2, fontSize: 12 }}>
        <Typography sx={{ fontFamily: "inherit", mb: 1 }}>
          Hôm nay, ngày ....... tháng ........ năm ........... Tại
          .....................................................................
        </Typography>
        <Typography sx={{ fontFamily: "inherit", fontWeight: 600, mb: 1 }}>
          Chứng tỏ gồm:
        </Typography>
        <Box sx={{ pl: 2, mb: 1 }}>
          {signers.map((s, i) => (
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
              <Typography variant="caption">
                {s.departmentName || "………………………"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ mb: 2, fontSize: 12 }}>
        <Typography sx={{ fontFamily: "inherit", mb: 1 }}>
          Đã tiến hành kiểm tra tình trạng kỹ thuật thiết bị bị:
          .............................................................................
        </Typography>
        <Typography sx={{ fontFamily: "inherit", mb: 1 }}>
          Số dãng ký:
          ..............................................................................
        </Typography>
        <Typography sx={{ fontFamily: "inherit", mb: 1 }}>
          Sau khi xay ra sự cố vào lúc ....... giờ ....... ngày ....... tháng
          ....... năm ..........
        </Typography>
      </Box>

      {/* Findings */}
      <Box sx={{ mb: 2, fontSize: 12 }}>
        <Typography sx={{ fontFamily: "inherit", fontWeight: 600, mb: 1 }}>
          1. Nội dung sự cố:
        </Typography>
        <Typography sx={{ fontFamily: "inherit", ml: 2, mb: 2 }}>
          {findings ||
            "......................................................................."}
        </Typography>

        <Typography sx={{ fontFamily: "inherit", fontWeight: 600, mb: 1 }}>
          2. Điều kiện văn hành:
          ...............................................................................
        </Typography>
        <Typography sx={{ fontFamily: "inherit", ml: 2, mb: 2 }}>
          ..........................................................................
        </Typography>

        <Typography sx={{ fontFamily: "inherit", fontWeight: 600, mb: 1 }}>
          3. Nội dung sửa chữa/ bảo dưỡng gần nhất:
          ........................................................
        </Typography>
        <Typography sx={{ fontFamily: "inherit", ml: 2, mb: 2 }}>
          ..........................................................................
        </Typography>

        <Typography sx={{ fontFamily: "inherit", fontWeight: 600, mb: 1 }}>
          4. Tính trạng thiết bị:
          ...............................................................................
        </Typography>
        <Typography sx={{ fontFamily: "inherit", ml: 2, mb: 2 }}>
          ..........................................................................
        </Typography>

        <Typography sx={{ fontFamily: "inherit", fontWeight: 600, mb: 1 }}>
          5. Sơ bộ xác định nguyên nhân:
          ...............................................................
        </Typography>
        <Typography sx={{ fontFamily: "inherit", ml: 2, mb: 2 }}>
          ..........................................................................
        </Typography>

        <Typography sx={{ fontFamily: "inherit", fontWeight: 600, mb: 1 }}>
          6. Nội dung cần sửa chữa khác phục: (theo bảng kê chỉ tiết định kèm)
        </Typography>
      </Box>

      {/* Items table */}
      <TableContainer sx={{ mb: 2 }}>
        <Table
          size="small"
          sx={{
            "& th, & td": {
              fontSize: 11,
              fontFamily: '"Times New Roman", serif',
              border: "1px solid #000",
              py: 0.5,
              px: 1,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                TT
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                Tên vật tư, thiết bị
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                DVT
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                SL
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                Tính trạng kỹ thuật
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                SC
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Thay mới
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Ghi chú
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.stt}>
                  <TableCell align="center">{item.stt}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell align="center">
                    {item.unit || "—"}
                  </TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell>{item.condition}</TableCell>
                  <TableCell align="center">
                    {item.actionRepair ? "✓" : "—"}
                  </TableCell>
                  <TableCell align="center">
                    {item.actionReplace ? "✓" : "—"}
                  </TableCell>
                  <TableCell>{item.note}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Chưa có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography sx={{ fontSize: 12, mb: 2, fontFamily: "inherit" }}>
        Biên bản được lập xong lúc ...... giờ cùng ngày, được các thành phần
        thống nhất thông qua./.
      </Typography>

      {/* Signatures */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {(() => {
          const sorted = [...(signers || [])].sort(
            (a, b) => (a.order || 0) - (b.order || 0),
          );
          const cols = sorted.map((s, idx) => ({
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
    </Paper>
  );
};

export default IncidentInspectionPreview;
