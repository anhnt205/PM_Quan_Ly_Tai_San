import { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, Chip, Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Select,
  MenuItem, FormControl, InputLabel, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Avatar, Grid, Stack, useTheme,
} from '@mui/material';
import {
  BuildOutlined,
  DescriptionOutlined,
  FactCheckOutlined,
  InventoryOutlined,
  AssignmentTurnedInOutlined,
  BoltOutlined,
  ArrowForwardOutlined,
  CheckCircle,
  PendingOutlined,
  HourglassBottomOutlined,
  CloseOutlined,
  PrecisionManufacturingOutlined,
  NotesOutlined,
  SpeedOutlined,
  EventAvailableOutlined,
  RefreshOutlined,
  CheckCircleOutline,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import {
  donViList, thietBiByDonVi, namList,
  thietBiDetails, summaryByThietBi,
  quyTrinhByThietBi, phieuByThietBi, tienDoByThietBi,
} from '../../../mockdata/specialMockOnly';

// ── Helpers ───────────────────────────────────────────────────
const trangThaiChipProps = (trang: string): { label: string; color: 'success' | 'warning' | 'info' | 'error' | 'default' } => {
  switch (trang) {
    case 'da-duyet': return { label: 'Đã duyệt', color: 'success' };
    case 'cho-duyet': return { label: 'Chờ duyệt', color: 'warning' };
    case 'cho-ky': return { label: 'Chờ ký', color: 'info' };
    case 'dot-xuat': return { label: 'Đột xuất', color: 'error' };
    default: return { label: trang, color: 'default' };
  }
};

// ── Summary Card ──────────────────────────────────────────────
const SummaryCard = ({
  icon, title, main, mainLabel, sub, subLabel, color,
}: {
  icon: React.ReactNode; title: string;
  main: number; mainLabel: string;
  sub: number; subLabel: string;
  color: string;
}) => (
  <Paper elevation={1} sx={{ borderRadius: 2, p: 2, flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff' }}>
    <Box sx={{ width: 8, height: 56, borderRadius: 1, bgcolor: color, flexShrink: 0 }} />
    <Box sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>{title}</Typography>
        <Box sx={{ color }}>{icon}</Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mt: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} lineHeight={1}>{main}</Typography>
          <Typography variant="caption" color="text.secondary">{mainLabel}</Typography>
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="warning.main" lineHeight={1}>{sub}</Typography>
          <Typography variant="caption" color="text.secondary">{subLabel}</Typography>
        </Box>
      </Box>
    </Box>
  </Paper>
);

// ── Quy Trinh Step ────────────────────────────────────────────
const QuyTrinhStep = ({
  step, title, icon, color, items, onXemTatCa,
}: {
  step: number; title: string; icon: React.ReactNode; color: string;
  items: { ma: string; trang: string }[];
  onXemTatCa: () => void;
}) => (
  <Paper elevation={1} sx={{ borderRadius: 2, p: 2, flex: 1, minWidth: 180, bgcolor: '#fff', display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: `${color}22`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{step}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
        <Box sx={{ color }}>{icon}</Box>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color }}>{title}</Typography>
      </Box>
    </Box>
    <Stack spacing={0.5}>
      {items.slice(0, 3).map(item => {
        const cfg = trangThaiChipProps(item.trang);
        return (
          <Box key={item.ma} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ fontSize: '0.78rem', color: 'text.secondary', fontFamily: 'monospace' }}>{item.ma}</Typography>
            <Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
          </Box>
        );
      })}
    </Stack>
    <Box sx={{ mt: 'auto' }}>
      <Typography variant="caption" onClick={onXemTatCa} sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 700, display: 'inline-block', '&:hover': { textDecoration: 'underline' } }}>
        Xem tất cả ({items.length})
      </Typography>
    </Box>
  </Paper>
);

// ── Tien Do Item ──────────────────────────────────────────────
const TienDoItem = ({ label, ma, trang }: { label: string; ma: string; trang: 'done' | 'pending' | 'wait' }) => {
  const iconProps = {
    done: { icon: <CheckCircle sx={{ fontSize: 16, color: '#22c55e' }} />, color: '#22c55e' },
    pending: { icon: <PendingOutlined sx={{ fontSize: 16, color: '#f59e0b' }} />, color: '#f59e0b' },
    wait: { icon: <RadioButtonUnchecked sx={{ fontSize: 16, color: '#94a3b8' }} />, color: '#94a3b8' },
  }[trang];

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 0.5 }}>
      <Box sx={{ mt: 0.2 }}>{iconProps.icon}</Box>
      <Box>
        <Typography variant="caption" fontWeight={600} display="block">{label}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{ma}</Typography>
      </Box>
    </Box>
  );
};

// ── Modal Xem Tất Cả ──────────────────────────────────────────
const ModalXemTatCa = ({
  open, onClose, title, items,
}: {
  open: boolean; onClose: () => void; title: string;
  items: { ma: string; trang: string }[];
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {title}
      <IconButton size="small" onClick={onClose}><CloseOutlined fontSize="small" /></IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, i) => {
              const cfg = trangThaiChipProps(item.trang);
              return (
                <TableRow key={item.ma} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.ma}</TableCell>
                  <TableCell><Chip label={cfg.label} color={cfg.color} size="small" /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="outlined" size="small">Đóng</Button>
    </DialogActions>
  </Dialog>
);

// ── Main Component ────────────────────────────────────────────
export default function MaintenanceStatPage() {
  const theme = useTheme();
  const [donVi, setDonVi] = useState(donViList[0]);
  const [nam, setNam] = useState('2024');
  const [selectedId, setSelectedId] = useState(thietBiByDonVi[donViList[0]][0].id);
  const [modal, setModal] = useState<{ open: boolean; title: string; items: { ma: string; trang: string }[] }>({
    open: false, title: '', items: [],
  });

  const thietBiList = thietBiByDonVi[donVi] ?? [];
  const thietBi = thietBiList.find(t => t.id === selectedId) ?? thietBiList[0];
  const detail = thietBiDetails[thietBi?.id] ?? thietBiDetails['BOM-001'];
  const summary = summaryByThietBi[thietBi?.id] ?? summaryByThietBi['BOM-001'];
  const quyTrinh = quyTrinhByThietBi[thietBi?.id] ?? quyTrinhByThietBi['BOM-001'];
  const phieuRows = phieuByThietBi[thietBi?.id] ?? [];
  const tienDo = tienDoByThietBi[thietBi?.id] ?? [];

  // Pagination for phieu table
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const totalPages = Math.ceil(phieuRows.length / pageSize);
  const pagedRows = phieuRows.slice((page - 1) * pageSize, page * pageSize);

  const handleDonViChange = (val: string) => {
    setDonVi(val);
    const list = thietBiByDonVi[val] ?? [];
    setSelectedId(list[0]?.id ?? '');
    setPage(1);
  };

  const openModal = (title: string, items: { ma: string; trang: string }[]) =>
    setModal({ open: true, title, items });

  const quyTrinhSteps = [
    { step: 1, title: 'KẾ HOẠCH', icon: <BuildOutlined sx={{ fontSize: 16 }} />, color: '#3b82f6', items: quyTrinh.keHoach },
    { step: 2, title: 'LỆNH SỬA CHỮA', icon: <DescriptionOutlined sx={{ fontSize: 16 }} />, color: '#f59e0b', items: quyTrinh.lenhSuaChua },
    { step: 3, title: 'BIÊN BẢN', icon: <FactCheckOutlined sx={{ fontSize: 16 }} />, color: '#22c55e', items: quyTrinh.bienBanGiamDinh },
    { step: 4, title: 'PHIẾU VẬT TƯ', icon: <InventoryOutlined sx={{ fontSize: 16 }} />, color: '#f97316', items: quyTrinh.phieuLinhVatTu },
    { step: 5, title: 'NGHIỆM THU', icon: <AssignmentTurnedInOutlined sx={{ fontSize: 16 }} />, color: '#10b981', items: quyTrinh.nghiemThu },
  ];

  return (
    <Box sx={{ bgcolor: '#f6f8fb', minHeight: '100vh', py: 3, px: 3 }}>
      <Box sx={{ maxWidth: 1800, mx: 'auto' }}>
        {/* ── Top Filter Bar ── */}
        <Paper elevation={1} sx={{ px: 3, py: 1.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Đơn Vị</InputLabel>
            <Select value={donVi} label="Đơn Vị" onChange={e => handleDonViChange(e.target.value)}>
              {donViList.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 260 }}>
            <InputLabel>Chọn Thiết Bị</InputLabel>
            <Select value={selectedId} label="Chọn Thiết Bị"
              onChange={e => { setSelectedId(e.target.value); setPage(1); }}>
              {thietBiList.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Năm</InputLabel>
            <Select value={nam} label="Năm" onChange={e => setNam(e.target.value)}>
              {namList.map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </Select>
          </FormControl>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<RefreshOutlined />} size="small" sx={{ textTransform: 'none', fontWeight: 600 }}>Làm mới</Button>
            <Button variant="contained" startIcon={<EventAvailableOutlined />} size="small" sx={{ textTransform: 'none', fontWeight: 600 }}>Lịch</Button>
          </Box>
        </Paper>

        <Grid container spacing={2}>
          {/* Left */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              {/* Summary */}
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}><SummaryCard icon={<BuildOutlined fontSize="small" />} title="Kế Hoạch" color="#3b82f6" main={summary.keHoach.daTao} mainLabel="Đã tạo" sub={summary.keHoach.choDuyet} subLabel="Chờ duyệt" /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}><SummaryCard icon={<DescriptionOutlined fontSize="small" />} title="Lệnh SC" color="#f59e0b" main={summary.lenhSuaChua.daHoanThanh} mainLabel="Hoàn" sub={summary.lenhSuaChua.dangXuLy} subLabel="Đang" /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}><SummaryCard icon={<FactCheckOutlined fontSize="small" />} title="Biên Bản" color="#22c55e" main={summary.bienBanGiamDinh.daTao} mainLabel="Đã tạo" sub={summary.bienBanGiamDinh.choDuyet} subLabel="Chờ" /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}><SummaryCard icon={<InventoryOutlined fontSize="small" />} title="Phiếu VT" color="#f97316" main={summary.phieuLinhVatTu.daDuyet} mainLabel="Đã duyệt" sub={summary.phieuLinhVatTu.doDuyet} subLabel="Đang" /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}><SummaryCard icon={<AssignmentTurnedInOutlined fontSize="small" />} title="Nghiệm Thu" color="#10b981" main={summary.nghiemThu.hoanThanh} mainLabel="Hoàn" sub={summary.nghiemThu.cho} subLabel="Chờ" /></Grid>
              </Grid>

              {/* Quy Trinh */}
              <Paper elevation={0} sx={{ borderRadius: 2, p: 2, bgcolor: 'transparent' }}>
                <Typography variant="subtitle2" fontWeight={800} mb={1} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Sơ đồ quy trình</Typography>
                {quyTrinh.lenhDotXuat && (
                  <Paper elevation={0} sx={{ bgcolor: '#fff8f0', borderRadius: 2, px: 2, py: 1, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BoltOutlined sx={{ color: '#f97316', fontSize: 18 }} />
                    <Typography variant="caption" fontWeight={800} color="#c2410c">LỆNH SỬA CHỮA ĐỘT XUẤT</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Đã: <b>{quyTrinh.lenhDotXuat.hoaThanhCount}</b> · Đang: <b>{quyTrinh.lenhDotXuat.dangXuLyCount}</b></Typography>
                    <Typography variant="caption" sx={{ ml: 'auto', color: 'primary.main', cursor: 'pointer', fontWeight: 700 }}>Xem danh sách</Typography>
                  </Paper>
                )}

                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                  {quyTrinhSteps.map((step, i) => (
                    <Box key={step.step} sx={{ minWidth: 220 }}>
                      <QuyTrinhStep {...step} onXemTatCa={() => openModal(step.title, step.items)} />
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Danh Sách Phiếu */}
              <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="subtitle2" fontWeight={800}>DANH SÁCH PHIẾU: <span style={{ color: '#2563eb' }}>{thietBi?.name?.toUpperCase()}</span></Typography>
                  <Typography variant="caption" color="text.secondary">Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, phieuRows.length)} / {phieuRows.length}</Typography>
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f3f6fb' }}>
                        {['STT', 'Thiết Bị', 'Lệnh Sửa Chữa', 'Biên Bản', 'Phiếu VT', 'Phiếu VT2', 'Trạng Thái'].map(h => (
                          <TableCell key={h} sx={{ fontWeight: 800, fontSize: '0.78rem', py: 1 }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pagedRows.map(row => (
                        <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: '#fbfbff' } }}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption">{row.thietBi}</Typography>
                              <Chip label={row.thietBiId} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700 }}>{row.lenhSuaChua}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {row.bienBanGiamDinhOk ? <CheckCircleOutline sx={{ fontSize: 15, color: '#22c55e' }} /> : <HourglassBottomOutlined sx={{ fontSize: 15, color: '#f59e0b' }} />}
                              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{row.bienBanGiamDinh}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {row.phieuLinhVTOk ? <CheckCircleOutline sx={{ fontSize: 15, color: '#22c55e' }} /> : <HourglassBottomOutlined sx={{ fontSize: 15, color: '#f59e0b' }} />}
                              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{row.phieuLinhVT}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{row.phieuLinhVatTu}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={row.trangThai} size="small" sx={{ bgcolor: row.trangThaiColor + '22', color: row.trangThaiColor, fontWeight: 700, fontSize: '0.68rem', border: `1px solid ${row.trangThaiColor}44` }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', px: 2, py: 1, gap: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="caption" color="text.secondary">Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, phieuRows.length)} / {phieuRows.length}</Typography>
                    <Stack direction="row" spacing={0.5}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <Button key={p} size="small" variant={p === page ? 'contained' : 'outlined'} onClick={() => setPage(p)} sx={{ minWidth: 36, fontWeight: p === page ? 800 : 600 }}>{p}</Button>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Paper>
            </Stack>
          </Grid>

          {/* Right */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', px: 3, py: 2 }}>
                  <Typography variant="caption" fontWeight={800} color="#fff" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Thông Tin Thiết Bị</Typography>
                </Box>

                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#eef2ff', width: 56, height: 56 }}><PrecisionManufacturingOutlined sx={{ color: '#2563eb', fontSize: 28 }} /></Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>{thietBi?.name}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">Mã: <b>{thietBi?.ma}</b></Typography>
                      <Typography variant="caption" color="text.secondary" display="block">Vị trí: {thietBi?.vitri}</Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Tình trạng</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Chip label={detail.tinhTrang} size="small" sx={{ bgcolor: detail.tinhTrangColor + '22', color: detail.tinhTrangColor, fontWeight: 800 }} />
                      <Typography variant="caption" color="text.secondary">{detail.lanSCTiepTheoDate}</Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Tổng giờ chạy</Typography>
                    <Typography variant="h6" fontWeight={800}>{detail.tongGioChay.toLocaleString()} giờ</Typography>
                    <Typography variant="caption" color="text.secondary">{detail.tongGioChayDate}</Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase' }}>Tiến độ</Typography>
                    <Box sx={{ mt: 1 }}>{tienDo.map(item => <TienDoItem key={item.ma} {...item} />)}</Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" fontWeight={800} color="text.secondary">Ghi chú</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{detail.ghiChu}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Modal */}
        <ModalXemTatCa open={modal.open} onClose={() => setModal(m => ({ ...m, open: false }))} title={modal.title} items={modal.items} />
      </Box>
    </Box>
  );
}