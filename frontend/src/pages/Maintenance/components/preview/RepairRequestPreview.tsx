import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Divider,
} from '@mui/material';
import { devices } from '../../../../mockdata/mockDevices';
import { departments } from '../../../../mockdata/mockDepartments';
import type { PlanSigner } from '../../../../mockdata/mockPlans';
import {
  maintenanceLevelLabels,
  type MaintenanceLevel,
} from '../../../../mockdata/mockPlans';
import { MaintenancePlanData } from '../../../MainenancePlanRepair/types';

interface Props {
  plan: MaintenancePlanData;
  deviceIds: string[];
  month: number;
  year: number;
  number: string;
  signers: PlanSigner[];
  sourceDeptId: string;
  execDeptId: string;
}

const RepairRequestPreview = ({ plan, deviceIds, month, year, number, signers, sourceDeptId, execDeptId }: Props) => {
  const sourceDept = departments.find(d => d.id === sourceDeptId);
  const execDept = departments.find(d => d.id === execDeptId);
  const selectedDevices = deviceIds.map(id => devices.find(d => d.id === id)).filter(Boolean).map(d => d!);
  const schedule: Record<string, MaintenanceLevel[]> = (plan as any).monthlySchedule || {};
  const today = new Date();
  const dateStr = `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  const sortedSigners = [...signers].sort((a, b) => a.order - b.order);
  const minOrder = Math.min(...signers.map(s => s.order));
  const maxOrder = Math.max(...signers.map(s => s.order));

  const creator = sortedSigners.find(s => s.order === minOrder);   // order nhỏ nhất = Người lập
  const director = sortedSigners.find(s => s.order === maxOrder);   // order lớn nhất = Phê duyệt
  const middles = sortedSigners.filter(s => s.order !== minOrder && s.order !== maxOrder); // trung gian

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 2, fontFamily: '"Times New Roman", serif' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
            CÔNG TY THAN UÔNG BÍ - TKV
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}>
            Đơn vị: {sourceDept?.name || ''}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}>
            Độc lập – Tự do – Hạnh phúc
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ textAlign: 'right', fontStyle: 'italic', fontSize: 12, mb: 2, fontFamily: 'inherit' }}>
        {dateStr}
      </Typography>

      {/* Title */}
      <Typography sx={{ textAlign: 'center', fontWeight: 700, fontSize: 16, color: 'primary.main', fontFamily: 'inherit' }}>
        GIẤY ĐỀ NGHỊ SỬA CHỮA
      </Typography>
      <Typography sx={{ textAlign: 'center', color: 'error.main', fontSize: 13, mb: 2, fontFamily: 'inherit' }}>
        Số: {number || '...'}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Content */}
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: 'inherit' }}>
        - Căn cứ vào Kế hoạch SCBD tháng <b>{month}</b> năm <b>{year}</b>
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: 'inherit' }}>
        - Phân xưởng: <b>{sourceDept?.name || '...'}</b> đề nghị <b>{execDept?.name || '...'}</b> duyệt cho đơn vị thực hiện sửa chữa bảo dưỡng một số hệ thống thiết bị:
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 0.5, fontFamily: 'inherit' }}>
        - Tên thiết bị: theo bảng kê chi tiết dưới đây
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 0.5, fontFamily: 'inherit' }}>
        - Vị trí lắp đặt: {sourceDept?.name || '...'}
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 2, fontFamily: 'inherit' }}>
        - Thời gian hoạt động: tháng {month}/{year}
      </Typography>

      {/* Device table */}
      <TableContainer sx={{ mb: 2 }}>
        <Table size="small" sx={{ '& th, & td': { fontSize: 11, fontFamily: '"Times New Roman", serif', border: '1px solid #999', py: 0.5, px: 1 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9f9f9' }}>
              <TableCell align="center" sx={{ fontWeight: 700 }}>STT</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Mã TB</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Tên TB</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Nhóm</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Loại BT</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>SL</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Đơn vị quản lý</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Đơn vị bảo trì</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedDevices.map((device, idx) => {
              const level = schedule[device.id]?.[month - 1] || '';
              return (
                <TableRow key={device.id}>
                  <TableCell align="center">{idx + 1}</TableCell>
                  <TableCell align="center">{device.id}</TableCell>
                  <TableCell>{device.name}</TableCell>
                  <TableCell align="center">{device.group}</TableCell>
                  <TableCell align="center">{maintenanceLevelLabels[level as MaintenanceLevel] || 'Sửa chữa nhỏ'}</TableCell>
                  <TableCell align="center">{device.quantity}</TableCell>
                  <TableCell align="center">{sourceDept?.name || ''}</TableCell>
                  <TableCell align="center">{execDept?.name || device.maintenanceUnit}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Signatures */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, px: 2 }}>

        {/* Người lập — luôn bên trái */}
        <Box sx={{ textAlign: 'center', minWidth: 140 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 12, fontFamily: 'inherit' }}>
            Người lập
          </Typography>
          <Typography sx={{ fontSize: 11, fontStyle: 'italic', color: 'text.secondary', mt: 4, fontFamily: 'inherit' }}>
            {creator?.userName || ''}
          </Typography>
        </Box>

        {/* Người ký trung gian */}
        {middles.map(s => (
          <Box key={s.userId} sx={{ textAlign: 'center', minWidth: 140 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 12, fontFamily: 'inherit' }}>
              {s.departmentName}
            </Typography>
            <Typography sx={{ fontSize: 11, fontStyle: 'italic', color: 'text.secondary', mt: 4, fontFamily: 'inherit' }}>
              {s.userName}
            </Typography>
          </Box>
        ))}

        {/* Phê duyệt — luôn bên phải */}
        <Box sx={{ textAlign: 'center', minWidth: 140 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 12, fontFamily: 'inherit' }}>
            Phê duyệt
          </Typography>
          <Typography sx={{ fontSize: 11, fontStyle: 'italic', color: 'text.secondary', mt: 4, fontFamily: 'inherit' }}>
            {director?.userName || ''}
          </Typography>
        </Box>

      </Box>
    </Paper>
  );
};

export default RepairRequestPreview;
