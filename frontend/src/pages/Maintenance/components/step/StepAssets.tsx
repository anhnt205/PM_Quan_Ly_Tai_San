import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, TextField,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowSelectionModel, type GridRenderEditCellParams } from '@mui/x-data-grid';
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

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Tên thiết bị', flex: 1, minWidth: 180 },
    { field: 'group', headerName: 'Nhóm TB', width: 100 },
    {
      field: 'assetType', headerName: 'Loại TS', width: 90,
      renderCell: (params) => (
        <Chip label={params.value} size="small"
          color={params.value === 'TSCĐ' ? 'primary' : 'default'} variant="outlined" />
      ),
    },
    {
      field: 'quantity', headerName: 'SL', width: 90,
      renderCell: (params) => (
        <TextField
          type="number"
          size="small"
          value={quantities[params.row.id] ?? params.value}
          onChange={(e) => {
            const val = Math.max(1, parseInt(e.target.value) || 1);
            onQuantityChange({ ...quantities, [params.row.id]: val });
          }}
          onClick={(e) => e.stopPropagation()}
          inputProps={{ min: 1, style: { padding: '2px 6px', width: 56 } }}
          variant="outlined"
        />
      ),
    },
    { field: 'maintenanceUnit', headerName: 'Đơn vị bảo trì', width: 150 },
    {
      field: 'status', headerName: 'Trạng thái', width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === 'active' ? 'Hoạt động' : params.value === 'maintenance' ? 'Bảo dưỡng' : 'Hỏng'}
          color={params.value === 'active' ? 'success' : params.value === 'maintenance' ? 'warning' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'operatingHours', headerName: 'Giờ vận hành', width: 120,
      valueFormatter: (value: number) => `${value.toLocaleString()} h`,
    },
  ];

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Chọn thiết bị cần lập kế hoạch bảo dưỡng
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Đã chọn: {selectedAssetIds.length} thiết bị. Có thể chỉnh sửa số lượng trực tiếp trên bảng.
      </Typography>
      <Card>
        <CardContent>
          {deptDevices.length === 0 ? (
            <Typography color="text.secondary">Đơn vị này chưa có thiết bị nào.</Typography>
          ) : (
            <Box sx={{ height: 420 }}>
              <DataGrid
                rows={deptDevices}
                columns={columns}
                checkboxSelection
                rowSelectionModel={{ type: 'include', ids: new Set(selectedAssetIds) }}
                onRowSelectionModelChange={(model: GridRowSelectionModel) => {
                  if (model.type === 'include') {
                    onSelectionChange(Array.from(model.ids) as string[]);
                  } else {
                    // type === 'exclude': chọn tất cả trừ ids trong set
                    const allIds = deptDevices.map(d => d.id);
                    const excluded = Array.from(model.ids) as string[];
                    onSelectionChange(allIds.filter(id => !excluded.includes(id)));
                  }
                }}
                disableRowSelectionOnClick
                density="compact"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default StepAssets;