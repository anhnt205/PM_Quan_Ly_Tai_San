import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Divider,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField,
} from '@mui/material';
import { devices } from '../../../../mockdata/mockDevices';
// import { departments } from '../../../../mockdata/mockDepartments';
import {
  months, maintenanceLevelColors,
  type MaintenanceLevel, type PlanSigner,
} from '../../../../mockdata/mockPlans';

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
  sourceDeptId: string;
  executionDeptId: string;
  // Mode 1: CreatePlanDialog (dùng assets array)
  assets?: PlanAsset[];
  // Mode 2: ApprovalPage/RecordPage (dùng assetIds, quantities, schedule)
  assetIds?: string[];
  quantities?: Record<string, number>;
  schedule?: Record<string, MaintenanceLevel[]>;
  
  signers: PlanSigner[];
  deptDevices?: any; 
  departments?: any;
  formik?: any; // chỉ dùng trong CreatePlanDialog
}

const StepPreview = ({ 
  sourceDeptId, executionDeptId, 
  assets, assetIds, quantities, schedule,
  signers, deptDevices, departments, formik 
}: Props) => {

  // Xác định mode
  const isCreateMode = !!assets && Array.isArray(assets);
  
  const sourceDept = departments?.find((d: any) => d.id === sourceDeptId);
  const execDept = departments?.find((d: any) => d.id === executionDeptId);
  
  // Lọc thiết bị dựa trên mode
  const selectedDevices = isCreateMode
    ? (deptDevices?.items || []).filter((d: any) => assets!.some(a => a.deviceId === d.id))
    : (deptDevices?.items || []).filter((d: any) => assetIds?.includes(d.id));

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const sortedSigners = [...signers].sort((a, b) => a.order - b.order);

  const signatureColumns = sortedSigners.map((s, idx) => ({
    label: idx === 0
      ? 'NGƯỜI LẬP'
      : idx === sortedSigners.length - 1
        ? 'PHÓ GIÁM ĐỐC'
        : s.departmentName.toUpperCase(),
    signer: s,
  }));

  // Hàm lấy hàng dữ liệu của một thiết bị
  const getDeviceRow = (device: any): MaintenanceLevel[] => {
    if (isCreateMode) {
      // Mode CreatePlanDialog: lấy từ assets array
      const asset = assets!.find(a => a.deviceId === device.id);
      return asset ? [
        asset.month1, asset.month2, asset.month3, asset.month4,
        asset.month5, asset.month6, asset.month7, asset.month8,
        asset.month9, asset.month10, asset.month11, asset.month12
      ] : Array(12).fill('');
    } else {
      // Mode ApprovalPage/RecordPage: lấy từ schedule object
      return schedule?.[device.id] || Array(12).fill('');
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

  return (
    <Card variant="outlined" sx={{ border: '2px solid #1976d2' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Tiêu đề */}
        <Typography variant="subtitle2" align="center" sx={{ textTransform: 'uppercase', mb: 0.5 }}>
          Kế hoạch sửa chữa bảo dưỡng thiết bị năm {year}
        </Typography>
        <Typography variant="h6" align="center" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
          Phân xưởng: {sourceDept?.tenPhongBan || sourceDeptId || '…'}
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
          (Theo QĐ số{' '}
          {isCreateMode && formik ? (
            <TextField
              variant="standard"
              size="small"
              name="decisionNo"
              placeholder="số QĐ"
              value={formik.values.decisionNo}
              onChange={formik.handleChange}
              inputProps={{ style: { width: 80, textAlign: 'center', fontSize: '0.875rem' } }}
              sx={{ mx: 0.5, verticalAlign: 'middle' }}
            />
          ) : (
            <span style={{ fontWeight: 500 }}>—</span>
          )}
          {' '}/QĐ – TUB ngày {day} tháng {month} năm {year})
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Bảng kế hoạch */}
        <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ tableLayout: 'fixed', minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.7rem', width: 36, p: 0.5 }}>STT</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.7rem', width: 60, p: 0.5 }}>Mã TB</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.7rem', width: 130, p: 0.5 }}>Tên thiết bị</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.7rem', width: 65, p: 0.5 }}>Nhóm TB</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.7rem', width: 55, p: 0.5 }}>Loại TS</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.7rem', width: 36, p: 0.5 }}>SL</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.7rem', width: 80, p: 0.5 }}>Đơn vị QL</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.7rem', width: 80, p: 0.5 }}>Đơn vị bảo trì</TableCell>
                {months.map(m => (
                  <TableCell key={m} align="center" sx={{ fontWeight: 700, fontSize: '0.65rem', width: 36, p: 0.5 }}>
                    {m}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedDevices.map((device: any, idx: number) => {
                const asset = isCreateMode ? assets!.find(a => a.deviceId === device.id) : undefined;
                const row = getDeviceRow(device);
                
                return (
                  <TableRow key={device.id}>
                    <TableCell align="center" sx={{ fontSize: '0.7rem', p: 0.5 }}>{idx + 1}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.7rem', p: 0.5 }}>{device.id}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', p: 0.5 }}>{device.name || device.tenTaiSan}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.7rem', p: 0.5 }}>{device.group || device.tenNhom}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.7rem', p: 0.5 }}>{device.assetType || device.tenLoai}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.7rem', p: 0.5 }}>
                      {getQuantity(device, asset)}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.65rem', p: 0.5 }}>{sourceDept?.tenPhongBan || sourceDeptId}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.65rem', p: 0.5 }}>{execDept?.tenPhongBan || executionDeptId}</TableCell>
                    {row.map((level: any, mi: number) => (
                      <TableCell
                        key={mi}
                        align="center"
                        sx={{
                          fontSize: '0.65rem', p: 0.5,
                          bgcolor: maintenanceLevelColors[level],
                          fontWeight: level ? 600 : 400,
                        }}
                      >
                        {level || ''}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Chữ ký */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          {signatureColumns.map((col, idx) => (
            <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="caption" fontWeight={700} display="block"
                sx={{ textTransform: 'uppercase', mb: 0.5 }}>
                {col.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block"
                sx={{ fontStyle: 'italic', mb: 4 }}>
                (Ký, ghi rõ họ tên)
              </Typography>
              <Box sx={{ borderBottom: '1px solid', borderColor: 'text.primary', width: '70%', mx: 'auto', mb: 0.5 }} />
              {col.signer ? (
                <>
                  <Typography variant="caption" fontWeight={600} display="block">
                    {col.signer.userName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {col.signer.departmentName}
                  </Typography>
                </>
              ) : (
                <Typography variant="caption" color="text.disabled">Chưa chọn</Typography>
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StepPreview;