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
} from '@mui/material';
import { devices } from '../../../../mockdata/mockDevices';
import {
  months,
  maintenanceLevelLabels,
  maintenanceLevelColors,
  type MaintenanceLevel,
} from '../../../../mockdata/mockPlans';

interface Props {
  assetIds: string[];
  schedule: Record<string, MaintenanceLevel[]>;
  onScheduleChange: (schedule: Record<string, MaintenanceLevel[]>) => void;
}

const levels: MaintenanceLevel[] = ['', 'CST', 'SCN', 'SCC'];

const StepSchedule = ({ assetIds, schedule, onScheduleChange }: Props) => {
  const selectedDevices = devices.filter(d => assetIds.includes(d.id));

  const handleChange = (deviceId: string, monthIdx: number, level: MaintenanceLevel) => {
    const current = schedule[deviceId] || Array(12).fill('');
    const updated = [...current];
    updated[monthIdx] = level;
    onScheduleChange({ ...schedule, [deviceId]: updated });
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Lập lịch bảo dưỡng 12 tháng
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Chọn cấp bảo dưỡng cho từng thiết bị theo từng tháng.
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 180, fontWeight: 700, bgcolor: '#f5f5f5', position: 'sticky', left: 0, zIndex: 3 }}>
                Thiết bị
              </TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f5f5', minWidth: 80 }}>Nhóm TB</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f5f5', minWidth: 60 }}>SL</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f5f5', minWidth: 90 }}>Loại TS</TableCell>
              {months.map(m => (
                <TableCell key={m} align="center" sx={{ fontWeight: 700, bgcolor: '#f5f5f5', minWidth: 70 }}>
                  {m}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedDevices.map(device => {
              const row = schedule[device.id] || Array(12).fill('');
              return (
                <TableRow key={device.id}>
                  <TableCell sx={{ position: 'sticky', left: 0, bgcolor: 'white', zIndex: 1, fontWeight: 500 }}>
                    {device.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{device.group}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{device.quantity}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{device.assetType}</TableCell>
                  {row.map((level: MaintenanceLevel, idx: number) => (
                    <TableCell
                      key={idx}
                      align="center"
                      sx={{ p: 0.5, bgcolor: maintenanceLevelColors[level] }}
                    >
                      <Select
                        value={level}
                        onChange={(e) => handleChange(device.id, idx, e.target.value as MaintenanceLevel)}
                        size="small"
                        variant="standard"
                        sx={{ fontSize: '0.75rem', minWidth: 55 }}
                        disableUnderline
                      >
                        {levels.map(l => (
                          <MenuItem key={l} value={l} sx={{ fontSize: '0.8rem' }}>
                            {maintenanceLevelLabels[l]}
                          </MenuItem>
                        ))}
                      </Select>
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
