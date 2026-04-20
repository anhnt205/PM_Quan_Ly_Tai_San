import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import { devices } from '../../../../mockdata/mockDevices';
import { useAllDepartmentsQuery } from '../../../Department/Mutation';
import type { AnnualPlan } from '../../../../mockdata/mockWorkflow';
import type { PlanSigner } from '../../../../mockdata/mockPlans';

interface Props {
  number?: string;
  detectedAt?: string;
  reporter?: string;
  reporterDeptId?: string;
  signers?: PlanSigner[];
  systemName?: string;
  location?: string;
  description?: string;
  severity?: string;
  deviceIds?: string[];
  planIds?: string[];
}

const IncidentPreview = ({ number, detectedAt, reporter, reporterDeptId, signers = [], systemName, location, description, severity, deviceIds = [], planIds = [] }: Props) => {
  const selectedDevices = deviceIds.map(id => devices.find(d => d.id === id)).filter(Boolean).map(d => d!);
  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const deptName = (apiDepartments || []).find((d: any) => d.id === reporterDeptId)?.tenPhongBan || '';
  const today = new Date();
  const dateStr = detectedAt || `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 0, fontFamily: '"Times New Roman", serif' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>CÔNG TY THAN UÔNG BÍ - TKV</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}>Đơn vị: {deptName}</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}>Độc lập – Tự do – Hạnh phúc</Typography>
        </Box>
      </Box>

      <Typography sx={{ textAlign: 'right', fontStyle: 'italic', fontSize: 12, mb: 2, fontFamily: 'inherit' }}>{dateStr}</Typography>

      <Typography sx={{ textAlign: 'center', fontWeight: 700, fontSize: 16, color: 'primary.main', fontFamily: 'inherit' }}>PHIẾU BÁO SỰ CỐ THIẾT BỊ</Typography>
      <Typography sx={{ textAlign: 'center', color: 'error.main', fontSize: 13, mb: 2, fontFamily: 'inherit' }}>Số: {number || '...'}</Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: 'inherit' }}>- Ngày giờ phát hiện: <b>{detectedAt || '...'}</b></Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: 'inherit' }}>- Người báo: <b>{reporter || '...'}</b></Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: 'inherit' }}>- Hệ thống/Thiết bị: <b>{systemName || '...'}</b></Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: 'inherit' }}>- Vị trí: <b>{location || '...'}</b></Typography>
      <Typography sx={{ fontSize: 12, mb: 2, fontFamily: 'inherit' }}>- Mô tả tình trạng: {description || '...'}</Typography>
      <Typography sx={{ fontSize: 12, mb: 2, fontFamily: 'inherit' }}>- Đánh giá mức độ: <b style={{ color: severity === 'Nghiêm trọng' ? '#d32f2f' : undefined }}>{severity || '...'}</b></Typography>

      <TableContainer sx={{ mb: 2 }}>
        <Table size="small" sx={{ '& th, & td': { fontSize: 11, fontFamily: '"Times New Roman", serif', border: '1px solid #999', py: 0.5, px: 1 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9f9f9' }}>
              <TableCell align="center" sx={{ fontWeight: 700 }}>STT</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Mã TB</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Tên TB</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Vị trí</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedDevices.map((d, idx) => (
              <TableRow key={d.id}>
                <TableCell align="center">{idx + 1}</TableCell>
                <TableCell align="center">{d.id}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell align="center">{(d as any).position || '—'}</TableCell>
                <TableCell />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Signatures */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        {(() => {
          const sorted = [...(signers || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
          const cols = sorted.map((s, idx) => ({
            label: idx === 0 ? 'Người lập' : idx === sorted.length - 1 ? 'Phê duyệt' : (s.departmentName || '').toUpperCase(),
            signer: s,
          }));
          if (cols.length === 0) {
            return (
              <>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.disabled">Chưa có người duyệt</Typography>
                </Box>
              </>
            );
          }
          return cols.map((col, idx) => (
            <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="caption" fontWeight={700} display="block" sx={{ textTransform: 'uppercase', mb: 0.5 }}>{col.label}</Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontStyle: 'italic', mb: 4 }}>(Ký, ghi rõ họ tên)</Typography>
              <Box sx={{ borderBottom: '1px solid', borderColor: 'text.primary', width: '70%', mx: 'auto', mb: 0.5 }} />
              {col.signer ? (
                <>
                  <Typography variant="caption" fontWeight={600} display="block">{col.signer.userName}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{col.signer.departmentName}</Typography>
                </>
              ) : (
                <Typography variant="caption" color="text.disabled">Chưa chọn</Typography>
              )}
            </Box>
          ));
        })()}
      </Box>
    </Paper>
  );
};

export default IncidentPreview;
