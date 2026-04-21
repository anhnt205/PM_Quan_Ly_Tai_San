import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import { devices } from '../../../../mockdata/mockDevices';
import { useAllDepartmentsQuery } from '../../../Department/Mutation';
import type { PlanSigner } from '../../../../mockdata/mockPlans';

interface DeviceEntry {
  deviceId: string;
  deviceName: string;
  position?: string;
  note?: string;
}

interface Props {
  number?: string;
  detectedAt?: string;
  reporter?: string;
  reporterDeptId?: string;
  signers?: PlanSigner[];
  systemName?: string;
  subsystem?: string;
  location?: string;
  description?: string;
  severity?: string;
  deviceEntries?: DeviceEntry[];
  planIds?: string[];
}

const IncidentPreview = ({ 
  number, 
  detectedAt, 
  reporter, 
  reporterDeptId, 
  signers = [], 
  systemName, 
  subsystem,
  location, 
  description, 
  severity, 
  deviceEntries = [], 
  planIds = []
}: Props) => {
  
  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const deptName = (apiDepartments || []).find((d: any) => d.id === reporterDeptId)?.tenPhongBan 
    || (apiDepartments || []).find((d: any) => d.id === reporterDeptId)?.name 
    || '';
  
  const today = new Date();
  const dateStr = detectedAt || `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 0, fontFamily: '"Times New Roman", serif' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
            CÔNG TY THAN UÔNG BÍ - TKV
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}>
            Đơn vị: {deptName}
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
        PHIẾU BÁO SỰ CỐ THIẾT BỊ
      </Typography>
      <Typography sx={{ textAlign: 'center', color: 'error.main', fontSize: 13, mb: 2, fontFamily: 'inherit' }}>
        Số: {number || '...'}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Main Information */}
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: 'inherit' }}>
        - Đơn vị báo cáo: <b>{deptName || '...'}</b>
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: 'inherit' }}>
        - Ngày giờ phát hiện: <b>{detectedAt || '...'}</b>
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: 'inherit' }}>
        - Tên hệ thống/thiết bị gặp sự cố: <b>{systemName || '...'}</b>
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: 'inherit' }}>
        - Phân hệ/vị trí xây ra sự cố: <b>{subsystem || '...'}</b>
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 1, fontFamily: 'inherit' }}>
        - Mô tả tình trạng sự cố: {description || '...'}
      </Typography>
      <Typography sx={{ fontSize: 12, mb: 2, fontFamily: 'inherit' }}>
        - Đánh giá mức độ: <b style={{ color: severity === 'Nghiêm trọng' ? '#d32f2f' : undefined }}>
          {severity || '...'}
        </b>
      </Typography>

      {/* Devices Table */}
      <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 1, fontFamily: 'inherit' }}>
        Danh sách hệ thống/thiết bị bị sự cố:
      </Typography>
      <TableContainer sx={{ mb: 2 }}>
        <Table size="small" sx={{ 
          '& th, & td': { 
            fontSize: 11, 
            fontFamily: '"Times New Roman", serif', 
            border: '1px solid #999', 
            py: 0.5, 
            px: 1 
          } 
        }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9f9f9' }}>
              <TableCell align="center" sx={{ fontWeight: 700 }}>STT</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Số chứng chỉ từ</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Mã thiết bị</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Tên TB</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Nhóm chủng loại</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Thuộc hệ thống</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Vị trí</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Tính trạng</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Đơn vị quản lý TB</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Đơn vị quản lý KT</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Mức độ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceEntries && deviceEntries.length > 0 ? (
              deviceEntries.map((entry, idx) => {
                // Tìm thiết bị để lấy thông tin đầy đủ
                const device = devices.find(d => d.id === entry.deviceId);
                return (
                  <TableRow key={`${entry.deviceId}-${idx}`}>
                    <TableCell align="center">{idx + 1}</TableCell>
                    <TableCell align="center">—</TableCell>
                    <TableCell align="center">{entry.deviceId}</TableCell>
                    <TableCell>{entry.deviceName}</TableCell>
                    <TableCell align="center">{device?.group || '—'}</TableCell>
                    <TableCell align="center">—</TableCell>
                    <TableCell align="center">{entry.position || device?.location || '—'}</TableCell>
                    <TableCell align="center">{device?.status || '—'}</TableCell>
                    <TableCell align="center">{device?.maintenanceUnit || '—'}</TableCell>
                    <TableCell align="center">—</TableCell>
                    <TableCell align="center">{severity || '—'}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Chưa có thiết bị nào được thêm
                  </Typography>
                </TableCell>
              </TableRow>
            )}
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
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.disabled">
                  Chưa có người duyệt
                </Typography>
              </Box>
            );
          }
          
          return cols.map((col, idx) => (
            <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
              <Typography 
                variant="caption" 
                fontWeight={700} 
                display="block" 
                sx={{ textTransform: 'uppercase', mb: 0.5 }}
              >
                {col.label}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                display="block" 
                sx={{ fontStyle: 'italic', mb: 4 }}
              >
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
                <Typography variant="caption" color="text.disabled">
                  Chưa chọn
                </Typography>
              )}
            </Box>
          ));
        })()}
      </Box>
    </Paper>
  );
};

export default IncidentPreview;