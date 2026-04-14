import {
  Box, Typography, Chip, TextField, Checkbox,
  FormControlLabel, Alert, Divider,
} from '@mui/material';
import { devices } from '../../../../mockdata/mockDevices';
import { departmentDeviceMap } from '../../../../mockdata/mockDepartments';

interface Props {
  sourceDeptId: string;
  selectedAssetIds: string[];
  quantities: Record<string, number>;
  onSelectionChange: (ids: string[]) => void;
  onQuantityChange: (quantities: Record<string, number>) => void;
}

const StepAssets = ({ sourceDeptId, selectedAssetIds, quantities, onSelectionChange, onQuantityChange }: Props) => {
  const deptDeviceIds = departmentDeviceMap[sourceDeptId] || [];
  const deptDevices = devices.filter(d => deptDeviceIds.includes(d.id));

  const toggleDevice = (id: string) => {
    if (selectedAssetIds.includes(id)) {
      onSelectionChange(selectedAssetIds.filter(a => a !== id));
    } else {
      onSelectionChange([...selectedAssetIds, id]);
    }
  };

  if (deptDevices.length === 0) {
    return <Typography color="text.secondary" fontSize={14}>Đơn vị này chưa có thiết bị nào.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
        Chọn thiết bị và nhập số lượng — đã chọn <strong>{selectedAssetIds.length}</strong>/{deptDevices.length}
      </Typography>

      {deptDevices.map((device, idx) => {
        const isSelected = selectedAssetIds.includes(device.id);
        return (
          <Box key={device.id}>
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                p: 1.5, borderRadius: 2,
                border: '1px solid',
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? 'primary.50' : 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { borderColor: 'primary.light', bgcolor: 'grey.50' }
              }}
              onClick={() => toggleDevice(device.id)}
            >
              <Checkbox
                checked={isSelected}
                size="small"
                onClick={e => e.stopPropagation()}
                onChange={() => toggleDevice(device.id)}
                sx={{ p: 0 }}
              />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontSize={13} fontWeight={isSelected ? 600 : 400} noWrap>
                  {device.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip label={device.group} size="small" sx={{ fontSize: 10, height: 18 }} />
                  <Chip
                    label={device.assetType}
                    size="small"
                    color={device.assetType === 'TSCĐ' ? 'primary' : 'default'}
                    variant="outlined"
                    sx={{ fontSize: 10, height: 18 }}
                  />
                  <Chip
                    label={device.status === 'active' ? 'Hoạt động' : device.status === 'maintenance' ? 'Bảo dưỡng' : 'Hỏng'}
                    size="small"
                    color={device.status === 'active' ? 'success' : device.status === 'maintenance' ? 'warning' : 'error'}
                    sx={{ fontSize: 10, height: 18 }}
                  />
                </Box>
              </Box>

              {isSelected && (
                <TextField
                  type="number"
                  size="small"
                  label="SL"
                  value={quantities[device.id] ?? device.quantity ?? 1}
                  onChange={e => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    onQuantityChange({ ...quantities, [device.id]: val });
                  }}
                  onClick={e => e.stopPropagation()}
                  inputProps={{ min: 1 }}
                  sx={{ width: 80, flexShrink: 0 }}
                />
              )}
            </Box>
            {idx < deptDevices.length - 1 && <Divider sx={{ my: 0.5, opacity: 0.4 }} />}
          </Box>
        );
      })}
    </Box>
  );
};

export default StepAssets;