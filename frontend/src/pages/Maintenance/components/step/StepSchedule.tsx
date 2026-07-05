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
import { months, maintenanceLevelColors } from "../../../../mockdata/mockPlans";
import { useAllRepairLevelQuery } from "../../../RepairLevel/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { useAllLoaiSCBDQuery } from "../../../MaintenanceRepairType/Mutation";

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
  assets: PlanAsset[];
  onAssetsChange: (assets: PlanAsset[]) => void;
  deptDevices: any;
  departments: any[];
}

const StepSchedule = ({
  assets,
  onAssetsChange,
  deptDevices,
  departments,
}: Props) => {
  const selectedDevices = deptDevices.filter((d: any) =>
    assets.some((a) => a.deviceId === d.id),
  );

  const { data: levels = [] } = useAllLoaiSCBDQuery();

  const handleChange = (deviceId: string, field: string, value: any) => {
    const updatedAssets = assets.map((a) => {
      if (a.deviceId === deviceId) {
        return { ...a, [field]: value };
      }
      return a;
    });
    onAssetsChange(updatedAssets);
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Chọn cấp bảo dưỡng cho từng thiết bị theo từng tháng.
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  minWidth: 180,
                  fontWeight: 700,
                  bgcolor: "#f5f5f5",
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                }}
              >
                Thiết bị
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, bgcolor: "#f5f5f5", minWidth: 80 }}
              >
                Nhóm TB
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, bgcolor: "#f5f5f5", minWidth: 60 }}
              >
                SL
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, bgcolor: "#f5f5f5", minWidth: 90 }}
              >
                Loại TS
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, bgcolor: "#f5f5f5", minWidth: 120 }}
              >
                Đơn vị bảo trì
              </TableCell>
              {months.map((m) => (
                <TableCell
                  key={m}
                  align="center"
                  sx={{ fontWeight: 700, bgcolor: "#f5f5f5", minWidth: 70 }}
                >
                  {m}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedDevices.map((device: any) => {
              const asset = assets.find((a) => a.deviceId === device.id);
              const row = asset
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
              return (
                <TableRow key={device.id}>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      bgcolor: "white",
                      zIndex: 1,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 200,
                    }}
                    title={device.tenTaiSan} // Hiển thị tooltip native khi hover
                  >
                    {device.tenTaiSan}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {device.tenNhom}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {asset?.quantity || device.soLuong || 1}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {device.tenLoai}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    <FieldAutoCompleted
                      data={departments}
                      labelkey="tenPhongBan"
                      labelOption="id"
                      title=""
                      value={asset?.idDonViBaoTri}
                      noBorder={true}
                      fontSize="0.75rem"
                      onChange={(e) =>
                        handleChange(
                          device.id,
                          "idDonViBaoTri",
                          (e?.id || "") as string,
                        )
                      }
                      limitOptions={10}
                      autocompleteSx={{ width: 120 }}
                    />
                  </TableCell>
                  {row.map((level: string, idx: number) => (
                    <TableCell
                      key={idx}
                      align="center"
                      sx={{
                        p: 0.5,
                        bgcolor: maintenanceLevelColors[level] || "#0273a3",
                      }}
                    >
                      <FieldAutoCompleted
                        data={levels}
                        labelkey="id"
                        title=""
                        value={level}
                        noBorder={true}
                        fontSize="0.75rem"
                        onChange={(e) =>
                          handleChange(
                            device.id,
                            `month${idx + 1}`,
                            (e?.id || "") as string,
                          )
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StepSchedule;
