import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Divider,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField,
} from '@mui/material';
import { devices } from '../../../../mockdata/mockDevices';
import { departments } from '../../../../mockdata/mockDepartments';
import {
  months, maintenanceLevelColors,
  type MaintenanceLevel, type PlanSigner,
} from '../../../../mockdata/mockPlans';

interface Props {
  sourceDeptId: string;
  executionDeptId: string;
  assetIds: string[];
  quantities: Record<string, number>;
  schedule: Record<string, MaintenanceLevel[]>;
  signers: PlanSigner[];
}

const StepPreview = ({ sourceDeptId, executionDeptId, assetIds, quantities, schedule, signers }: Props) => {
  const [qdNumber, setQdNumber] = useState('');

  const sourceDept = departments.find(d => d.id === sourceDeptId);
  const execDept = departments.find(d => d.id === executionDeptId);
  const selectedDevices = devices.filter(d => assetIds.includes(d.id));

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const creatorSigner = signers.find(s => s.role === 'creator');
  const directorSigner = signers.find(s => s.role === 'director');
  const middleSigners = signers.filter(s => s.role === 'middle');

  const signatureColumns = [
    { label: 'NGƯỜI LẬP', signer: creatorSigner },
    ...middleSigners.map(s => ({ label: s.departmentName.toUpperCase(), signer: s })),
    { label: 'PHÓ GIÁM ĐỐC', signer: directorSigner },
  ];

  return (
    <Card variant="outlined" sx={{ border: '2px solid #1976d2' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Tiêu đề */}
        <Typography variant="subtitle2" align="center" sx={{ textTransform: 'uppercase', mb: 0.5 }}>
          Kế hoạch sửa chữa bảo dưỡng thiết bị năm {year}
        </Typography>
        <Typography variant="h6" align="center" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
          Phân xưởng: {sourceDept?.name || '…'}
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
          (Theo QĐ số{' '}
          <TextField
            variant="standard"
            size="small"
            placeholder="số QĐ"
            value={qdNumber}
            onChange={e => setQdNumber(e.target.value)}
            onClick={e => e.stopPropagation()}
            inputProps={{ style: { width: 80, textAlign: 'center', fontSize: '0.875rem' } }}
            sx={{ mx: 0.5, verticalAlign: 'middle' }}
          />
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
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.7rem', width: 65, p: 0.5 }}>Nhóm TB (QĐ 3021)</TableCell>
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
              {selectedDevices.map((device, idx) => {
                const row = schedule[device.id] || Array(12).fill('');
                return (
                  <TableRow key={device.id}>
                    <TableCell align="center" sx={{ fontSize: '0.7rem', p: 0.5 }}>{idx + 1}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.7rem', p: 0.5 }}>{device.id}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', p: 0.5 }}>{device.name}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.7rem', p: 0.5 }}>{device.group}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.7rem', p: 0.5 }}>{device.assetType}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.7rem', p: 0.5 }}>
                      {quantities[device.id] ?? device.quantity}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.65rem', p: 0.5 }}>{sourceDept?.name}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.65rem', p: 0.5 }}>{execDept?.name}</TableCell>
                    {row.map((level: MaintenanceLevel, mi: number) => (
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