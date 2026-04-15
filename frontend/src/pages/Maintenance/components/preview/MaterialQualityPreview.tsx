// src/pages/Maintenance/components/preview/MaterialQualityPreview.tsx
import { Box, Typography, Divider, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { MaterialRequest } from '../../../../mockdata/mockWorkflow';

export default function MaterialQualityPreview({ row }: { row: MaterialRequest }) {
  return (
    <Box sx={{ border: '2px solid #1976d2', borderRadius: 2, p: 3 }}>
      <Typography variant="subtitle2" align="center" sx={{ textTransform: 'uppercase', mb: 0.5 }}>
        Biên bản đánh giá vật tư
      </Typography>
      <Typography variant="h6" align="center" fontWeight={700}>{row.id}</Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">Thiết bị</Typography>
          <Typography fontWeight={600}>{row.deviceName}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Ngày tạo</Typography>
          <Typography>{row.createdDate}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Trạng thái</Typography>
          <Box mt={0.5}><Chip label="Chờ duyệt" color="warning" size="small" /></Box>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
        Danh sách vật tư
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tên vật tư</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Số lượng</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Đơn vị</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {row.items?.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="center">{item.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        {['Người lập', 'Trưởng phòng vật tư', 'Phó giám đốc'].map((label) => (
          <Box key={label} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" fontWeight={700} display="block" sx={{ textTransform: 'uppercase' }}>
              {label}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontStyle="italic">(Ký, ghi rõ họ tên)</Typography>
            <Box sx={{ borderBottom: '1px solid', borderColor: 'text.primary', width: 120, mx: 'auto', mt: 4, mb: 0.5 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}