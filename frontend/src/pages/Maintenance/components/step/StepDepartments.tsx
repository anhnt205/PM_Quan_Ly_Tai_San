import { Box, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { departments } from '../../../../mockdata/mockDepartments';

interface Props {
  sourceDeptId: string;
  executionDeptId: string;
  onSourceChange: (id: string) => void;
  onExecutionChange: (id: string) => void;
  // ✅ Bỏ hoàn toàn signers / onSignersChange
}

const StepDepartments = ({ sourceDeptId, executionDeptId, onSourceChange, onExecutionChange }: Props) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Alert severity="info">
        Chọn đơn vị quản lý thiết bị (nguồn) và đơn vị thực hiện sửa chữa/bảo dưỡng.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            1. Đơn vị quản lý thiết bị (Nguồn)
          </Typography>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Chọn đơn vị nguồn</InputLabel>
            <Select
              value={sourceDeptId}
              label="Chọn đơn vị nguồn"
              onChange={(e) => onSourceChange(e.target.value)}
            >
              {departments.filter(d => !['PB-09', 'PB-10'].includes(d.id)).map(d => (
                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            2. Đơn vị thực hiện sửa chữa
          </Typography>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Chọn đơn vị thực hiện</InputLabel>
            <Select
              value={executionDeptId}
              label="Chọn đơn vị thực hiện"
              onChange={(e) => onExecutionChange(e.target.value)}
            >
              {departments.filter(d => !['PB-09', 'PB-10'].includes(d.id)).map(d => (
                <MenuItem key={d.id} value={d.id} disabled={d.id === sourceDeptId}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StepDepartments;