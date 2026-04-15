// src/pages/Maintenance/components/preview/InspectionPreview.tsx
import { Box, Typography, Divider, Chip } from '@mui/material';
import type { InspectionReport } from '../../../../mockdata/mockWorkflow';

export default function InspectionPreview({ row }: { row: InspectionReport }) {
  return (
    <Box sx={{ border: '2px solid #1976d2', borderRadius: 2, p: 3 }}>
      <Typography variant="subtitle2" align="center" sx={{ textTransform: 'uppercase', mb: 0.5 }}>
        Biên bản giám định kỹ thuật
      </Typography>
      <Typography variant="h6" align="center" fontWeight={700}>{row.id}</Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">Thiết bị</Typography>
          <Typography fontWeight={600}>{row.deviceName}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Người giám định</Typography>
          <Typography fontWeight={600}>{row.inspector}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Ngày giám định</Typography>
          <Typography>{row.createdDate}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Trạng thái</Typography>
          <Box mt={0.5}><Chip label="Chờ duyệt" color="warning" size="small" /></Box>
        </Box>
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Typography variant="caption" color="text.secondary">Kết quả giám định</Typography>
          <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography>{row.findings}</Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        {['Người giám định', 'Trưởng phòng kỹ thuật', 'Phó giám đốc'].map((label) => (
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