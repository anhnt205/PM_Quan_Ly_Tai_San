import React from 'react';
import {
  Box, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Divider,
} from '@mui/material';
import type { AcceptanceTestRecord } from '../../../../mockdata/mockInspectionRecords';

interface Props {
  row: AcceptanceTestRecord;
}

const AcceptancePreview = ({ row }: Props) => {
  if (!row) return null;

  const d = row.date ? new Date(row.date) : new Date();
  const signers = row.signers ?? [];
  const materialItems = row.materialItems ?? [];

  // Group materials by groupLabel
  const groupedMaterials = materialItems.reduce<Record<string, typeof materialItems>>((acc, item) => {
    const key = item.groupLabel || '—';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <Box sx={{ fontFamily: 'serif', fontSize: '0.875rem', lineHeight: 1.8, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 3 }}>

      {/* Header 2 cột */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="caption" display="block">TẬP ĐOÀN CÔNG NGHIỆP</Typography>
          <Typography variant="caption" display="block">THAN – KHOÁNG SẢN VIỆT NAM</Typography>
          <Typography variant="caption" display="block" fontWeight={700}>CÔNG <u>TY THAN UÔNG BÍ</u> - TKV</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" display="block" fontWeight={700}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
          <Typography variant="caption" display="block" fontWeight={700}><u>Độc lập – Tự do – Hạnh phúc</u></Typography>
        </Box>
      </Box>

      {/* Địa danh ngày tháng */}
      <Typography variant="caption" display="block" sx={{ textAlign: 'right', fontStyle: 'italic', mb: 2 }}>
        Quảng Ninh, ngày {d.getDate()} tháng {d.getMonth() + 1} năm {d.getFullYear()}
      </Typography>

      {/* Tiêu đề */}
      <Typography variant="subtitle2" align="center" fontWeight={700} sx={{ color: 'primary.main', mb: 0.25 }} display="block">BIÊN BẢN</Typography>
      <Typography variant="subtitle2" align="center" fontWeight={700} sx={{ mb: 2 }} display="block">
        NGHIỆM THU CHẠY THỬ VÀ BÀN GIAO THIẾT BỊ SAU SỬA CHỮA
      </Typography>

      {/* Mở đầu */}
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Hôm nay, ngày {d.getDate()} tháng {d.getMonth() + 1} năm {d.getFullYear()}. Tại {row.location || '………………………'}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>Chúng tôi gồm:</Typography>
      <Box sx={{ pl: 2, mb: 1.5 }}>
        {signers.map((s: any, i: number) => (
          <Box key={i} sx={{ display: 'flex', gap: 3, mb: 0.25 }}>
            <Typography variant="caption" sx={{ minWidth: 16 }}>{i + 1}.</Typography>
            <Typography variant="caption" sx={{ minWidth: 150, fontWeight: 500 }}>{s.name || '………………………'}</Typography>
            <Typography variant="caption" sx={{ minWidth: 120 }}>{s.title}</Typography>
            <Typography variant="caption">{s.departmentName}</Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
        Cùng tiến hành nghiệm thu thiết bị: <b>{row.deviceName || '……………'}</b>
      </Typography>

      {/* Bảng vật tư */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5 }}>
        <Table size="small" sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 700, width: 40, fontSize: '0.72rem' }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 75, fontSize: '0.72rem' }}>Mã VT</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem' }}>Tên vật tư, thiết bị</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 45, fontSize: '0.72rem' }}>ĐVT</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 40, fontSize: '0.72rem' }}>SL</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 75, fontSize: '0.72rem' }}>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedMaterials).map(([groupLabel, items]) => (
              <React.Fragment key={`pv-${groupLabel}`}>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem' }}>{groupLabel}</TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: 600, fontSize: '0.72rem' }}>Thiết bị: {items[0].groupDevice}</TableCell>
                </TableRow>
                {items.map((item: any, ri: number) => (
                  <TableRow key={`${groupLabel}-pv-${ri}`}>
                    <TableCell sx={{ fontSize: '0.72rem', pl: 2 }}>{String(ri + 1).padStart(2, '0')}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{item.code}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{item.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{item.unit}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{item.quantity}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{item.note}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="caption" display="block" fontWeight={700} sx={{ mb: 0.5 }}>
        2. Kết quả kiểm tra chạy thử: <span style={{ fontWeight: 400 }}>{row.testResult || '……………………'}</span>
      </Typography>
      <Typography variant="caption" display="block" fontWeight={700} sx={{ mb: 0.5 }}>3. Các nội dung sửa chữa được nghiệm thu</Typography>
      <Typography variant="caption" display="block" sx={{ mb: 0.5, borderBottom: '1px dotted #999', pb: 0.5 }}>
        {row.acceptanceContent || '………………………………………………………………………………………………………………'}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mb: 2 }}>………………………………………………………………………………………………………………</Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Chữ ký — 4 cột */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        {[
          { label: signers[2]?.departmentName || 'Phân xưởng', signer: signers[2] },
          { label: signers[3]?.departmentName || 'Phân xưởng', signer: signers[3] },
          { label: 'Phòng CV', signer: signers[0] },
          { label: 'PHÓ GIÁM ĐỐC', signer: signers[signers.length - 1] },
        ].map((col, idx) => (
          <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" fontWeight={700} display="block" sx={{ textTransform: 'uppercase', fontSize: idx === 3 ? '0.75rem' : '0.7rem' }}>
              {col.label}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontStyle: 'italic', mb: 3, fontSize: '0.7rem' }}>
              (Ký, ghi rõ họ tên)
            </Typography>
            <Box sx={{ borderBottom: '1px solid', borderColor: 'text.primary', width: '75%', mx: 'auto', mb: 0.5 }} />
            <Typography variant="caption" fontWeight={600} display="block" sx={{ fontSize: '0.72rem' }}>{col.signer?.name || ''}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.7rem' }}>{col.signer?.title || ''}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AcceptancePreview;