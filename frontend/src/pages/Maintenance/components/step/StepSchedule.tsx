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
  Select,
  MenuItem,
} from "@mui/material";
import { devices } from "../../../../mockdata/mockDevices";
import {
  months,
  maintenanceLevelLabels,
  maintenanceLevelColors,
  type MaintenanceLevel,
} from "../../../../mockdata/mockPlans";
import { useAllRepairLevelQuery } from "../../../RepairLevel/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { useAllLoaiSCBDQuery } from "../../../MaintenanceRepairType/Mutation";

interface PlanAsset {
  deviceId: string;
  quantity: number;
  month1: MaintenanceLevel;
  month2: MaintenanceLevel;
  month3: MaintenanceLevel;
  month4: MaintenanceLevel;
  month5: MaintenanceLevel;
  month6: MaintenanceLevel;
  month7: MaintenanceLevel;
  month8: MaintenanceLevel;
  month9: MaintenanceLevel;
  month10: MaintenanceLevel;
  month11: MaintenanceLevel;
  month12: MaintenanceLevel;
}

interface Props {
  assets: PlanAsset[];
  onAssetsChange: (assets: PlanAsset[]) => void;
  deptDevices: any;
}

const StepSchedule = ({ assets, onAssetsChange, deptDevices }: Props) => {
  const selectedDevices = deptDevices.items.filter((d: any) =>
    assets.some((a) => a.deviceId === d.id),
  );

  const { data: levels = [] } = useAllLoaiSCBDQuery();

  const handleChange = (
    deviceId: string,
    monthIdx: number,
    level: MaintenanceLevel,
  ) => {
    const fieldName = `month${monthIdx + 1}` as keyof PlanAsset;
    const updatedAssets = assets.map((a) => {
      if (a.deviceId === deviceId) {
        return { ...a, [fieldName]: level };
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
                  {row.map((level: MaintenanceLevel, idx: number) => (
                    <TableCell
                      key={idx}
                      align="center"
                      sx={{ p: 0.5, bgcolor: maintenanceLevelColors[level] }}
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
                            idx,
                            (e?.id || "") as MaintenanceLevel,
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
