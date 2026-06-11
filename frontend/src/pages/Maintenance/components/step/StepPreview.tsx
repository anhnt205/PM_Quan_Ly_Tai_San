import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { devices } from "../../../../mockdata/mockDevices";
// import { departments } from '../../../../mockdata/mockDepartments';
import {
  months,
  maintenanceLevelColors,
  type PlanSigner,
} from "../../../../mockdata/mockPlans";
import FieldInput from "../../../../components/TextField/FieldInput";

interface PlanAsset {
  deviceId: string;
  quantity: number;
  idDonViBaoTri?: string;
  month1: string;
  month2: string;
  month3: string;
  month4: string;
  month5: string;
  month6: string;
  month7: string;
  month8: string;
  month9: string;
  month10: string;
  month11: string;
  month12: string;
}

interface Props {
  idDonViGiao: string;
  idDonViNhan: string;
  // Mode 1: CreatePlanDialog (dùng assets array)
  assets?: PlanAsset[];
  // Mode 2: ApprovalPage/RecordPage (dùng assetIds, quantities, schedule)
  assetIds?: string[];
  quantities?: Record<string, number>;
  schedule?: Record<string, string[]>;

  signers: PlanSigner[];
  deptDevices?: any;
  departments?: any;
  formik?: any; // chỉ dùng trong CreatePlanDialog
  tenMau?: string;
}

const StepPreview = ({
  idDonViGiao,
  idDonViNhan,
  assets,
  assetIds,
  quantities,
  schedule,
  signers,
  deptDevices,
  departments,
  formik,
  tenMau,
}: Props) => {
  // Xác định mode
  const isCreateMode = !!assets && Array.isArray(assets);

  const sourceDept = departments?.find((d: any) => d.id === idDonViGiao);
  const execDept = departments?.find((d: any) => d.id === idDonViNhan);

  // Lọc thiết bị dựa trên mode
  const selectedDevices = isCreateMode
    ? (deptDevices?.items || []).filter((d: any) =>
        assets!.some((a) => a.deviceId === d.id),
      )
    : (deptDevices?.items || []).filter((d: any) => assetIds?.includes(d.id));

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const sortedSigners = [...signers].sort((a, b) => a.order - b.order);

  const signatureColumns = sortedSigners.map((s, idx) => ({
    label:
      idx === 0
        ? "NGƯỜI LẬP"
        : idx === sortedSigners.length - 1
          ? "PHÓ GIÁM ĐỐC"
          : s.departmentName.toUpperCase(),
    signer: s,
  }));

  // Hàm lấy hàng dữ liệu của một thiết bị
  const getDeviceRow = (device: any): string[] => {
    if (isCreateMode) {
      // Mode CreatePlanDialog: lấy từ assets array
      const asset = assets!.find((a) => a.deviceId === device.id);
      return asset
        ? [
            asset.month1,
            asset.month2,
            asset.month3,
            asset.month4,
            asset.month5,
            asset.month6,
            asset.month7,
            asset.month8,
            asset.month9,
            asset.month10,
            asset.month11,
            asset.month12,
          ]
        : Array(12).fill("");
    } else {
      // Mode ApprovalPage/RecordPage: lấy từ schedule object
      return schedule?.[device.id] || Array(12).fill("");
    }
  };

  // Hàm lấy số lượng
  const getQuantity = (device: any, asset?: PlanAsset): number => {
    if (isCreateMode) {
      return asset?.quantity ?? device.quantity ?? 0;
    } else {
      return quantities?.[device.id] ?? device.quantity ?? 0;
    }
  };

  const getDeptName = (deptId?: string) => {
    if (!deptId) return "";
    return (
      departments?.find((d: any) => d.id === deptId)?.tenPhongBan || deptId
    );
  };

  return (
    <Card variant="outlined" sx={{ border: "2px solid #1976d2" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Tiêu đề */}
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ textTransform: "uppercase", mb: 0.5 }}
        >
          {tenMau
            ? `${tenMau}`
            : `Kế hoạch sửa chữa bảo dưỡng thiết bị năm ${year}`}
        </Typography>
        <Typography
          variant="h6"
          align="center"
          fontWeight={700}
          sx={{ textTransform: "uppercase" }}
        >
          Phân xưởng: {sourceDept?.tenPhongBan || idDonViGiao || "…"}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mt: 0.5, fontStyle: "italic" }}
        >
          (Theo QĐ số{" "}
          {isCreateMode && formik ? (
            <FieldInput
              formik={formik}
              field="soQuyetDinh"
              noBorder={true}
              sx={{ width: "100px" }}
            />
          ) : (
            <span style={{ fontWeight: 500 }}>—</span>
          )}{" "}
          /QĐ – TUB ngày {day} tháng {month} năm {year})
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Bảng kế hoạch */}
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ overflowX: "auto" }}
        >
          <Table size="small" sx={{ tableLayout: "fixed", minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    width: 36,
                    p: 0.5,
                  }}
                >
                  STT
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    width: 60,
                    p: 0.5,
                  }}
                >
                  Mã TB
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    width: 130,
                    p: 0.5,
                  }}
                >
                  Tên thiết bị
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    width: 65,
                    p: 0.5,
                  }}
                >
                  Nhóm TB
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    width: 55,
                    p: 0.5,
                  }}
                >
                  Loại TS
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    width: 36,
                    p: 0.5,
                  }}
                >
                  SL
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    width: 80,
                    p: 0.5,
                  }}
                >
                  Đơn vị QL
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    width: 80,
                    p: 0.5,
                  }}
                >
                  Đơn vị bảo trì
                </TableCell>
                {months.map((m) => (
                  <TableCell
                    key={m}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      width: 36,
                      p: 0.5,
                    }}
                  >
                    {m}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedDevices.map((device: any, idx: number) => {
                const asset = isCreateMode
                  ? assets!.find((a) => a.deviceId === device.id)
                  : undefined;
                const row = getDeviceRow(device);

                return (
                  <TableRow key={device.id}>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.7rem", p: 0.5 }}
                    >
                      {idx + 1}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.7rem", p: 0.5 }}
                    >
                      {device.id}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.7rem", p: 0.5 }}>
                      {device.name || device.tenTaiSan}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.7rem", p: 0.5 }}
                    >
                      {device.group || device.tenNhom}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.7rem", p: 0.5 }}
                    >
                      {device.assetType || device.tenLoai}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.7rem", p: 0.5 }}
                    >
                      {getQuantity(device, asset)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.65rem", p: 0.5 }}
                    >
                      {sourceDept?.tenPhongBan || idDonViGiao}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.65rem", p: 0.5 }}
                    >
                      {getDeptName(asset?.idDonViBaoTri)}
                    </TableCell>
                    {row.map((level: any, mi: number) => (
                      <TableCell
                        key={mi}
                        align="center"
                        sx={{
                          fontSize: "0.65rem",
                          p: 0.5,
                          bgcolor: maintenanceLevelColors[level] || "#1FA463",
                          fontWeight: level ? 600 : 400,
                        }}
                      >
                        {level || ""}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Chữ ký */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {signatureColumns.map((col, idx) => (
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
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StepPreview;
