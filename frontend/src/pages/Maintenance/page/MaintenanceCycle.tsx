import { useState } from 'react';
import {
  Box, Card, CardContent, Chip, Collapse, IconButton,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Tabs, Tab,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  LoopOutlined,      // icon cho "Chu kỳ theo nhóm"
  HistoryOutlined,   // icon cho "Lịch sử bảo dưỡng"
} from '@mui/icons-material';
import { FilterOption } from '../../../components/common/FilterStatusGroup';
import PageAction from '../../../components/common/PageAction';
import TableCustom from '../../../components/common/TableCustom';


// ── Mock data ────────────────────────────────────────────
const cycleGroups = [
  { group: 'XG', name: 'Xe goòng', cycles: [{ type: 'CST', value: 1, unit: 'Tháng' }, { type: 'SCN', value: 3, unit: 'Tháng' }, { type: 'SCC', value: 12, unit: 'Tháng' }] },
  { group: 'QG', name: 'Quạt gió cục bộ', cycles: [{ type: 'CST', value: 1, unit: 'Tháng' }, { type: 'SCN', value: 4, unit: 'Tháng' }, { type: 'SCC', value: 12, unit: 'Tháng' }] },
  { group: 'MC', name: 'Máng cào', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'TD-AQ', name: 'Tàu điện ắc quy', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'BM-KN', name: 'Bơm nước khí nén', cycles: [{ type: 'CST', value: 1, unit: 'Tháng' }, { type: 'SCN', value: 3, unit: 'Tháng' }, { type: 'SCC', value: 12, unit: 'Tháng' }] },
  { group: 'BA-KN', name: 'Búa khoan khí nén', cycles: [{ type: 'CST', value: 1, unit: 'Tháng' }, { type: 'SCN', value: 6, unit: 'Tháng' }, { type: 'SCC', value: 12, unit: 'Tháng' }] },
  { group: 'TN', name: 'Tủ nạp ắc quy', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'TD', name: 'Tời điện', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'KDT', name: 'Thiết bị điện (KĐT, Aptomat, biến tần)', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'QL', name: 'Quang lật goòng', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'TB-TL', name: 'Thiết bị thủy lực', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'MNK', name: 'Máy nén khí di động', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'TNK', name: 'Trạm nén khí cố định', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 3, unit: 'Tháng' }] },
  { group: 'BM-Đ', name: 'Bơm nước dùng điện', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'BT-B800', name: 'Băng tải B800', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'BT-B650', name: 'Băng tải B650', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'MK', name: 'Máy khoan thăm dò', cycles: [{ type: 'CST', value: 72, unit: 'Giờ' }, { type: 'SCN', value: 140, unit: 'Giờ' }, { type: 'SCC', value: 200, unit: 'Giờ' }] },
  { group: 'ML', name: 'Máy cắt liên hợp', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
  { group: 'TQ', name: 'Trạm quạt', cycles: [{ type: 'CST', value: 1, unit: 'Tháng' }, { type: 'SCN', value: 6, unit: 'Tháng' }, { type: 'SCC', value: 12, unit: 'Tháng' }] },
  { group: 'TTLL', name: 'Hệ thống thông tin liên lạc', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }] },
  { group: 'BT-XD', name: 'Máng cào XĐ', cycles: [{ type: 'CST', value: 1, unit: 'Tuần' }, { type: 'SCN', value: 1, unit: 'Tháng' }, { type: 'SCC', value: 6, unit: 'Tháng' }] },
];

// --- Mock lịch sử bảo dưỡng ---
const maintenanceHistory = [
  { id: 'TB-001', name: 'Quạt gió lò 1', group: 'QG', lastDate: '03/04/2026', lastType: 'SCN', status: 'Đã BT' },
  { id: 'TB-002', name: 'Máng cào 1', group: 'MC', lastDate: '03/04/2026', lastType: 'CST', status: 'Đã BT' },
  { id: 'TB-003', name: 'Băng tải B800', group: 'BT-B800', lastDate: '15/03/2026', lastType: 'SCC', status: 'Đã BT' },
  { id: 'TB-004', name: 'Cảm biến khí', group: 'KDT', lastDate: '21/03/2026', lastType: 'SCN', status: 'Đã BT' },
  { id: 'TB-005', name: 'Tời điện 1', group: 'TD', lastDate: '—', lastType: '—', status: 'Chưa BT' },
  { id: 'TB-006', name: 'Bơm nước 1', group: 'BM-Đ', lastDate: '10/02/2026', lastType: 'SCN', status: 'Đã BT' },
  { id: 'TB-007', name: 'Máy nén khí', group: 'MNK', lastDate: '05/04/2026', lastType: 'CST', status: 'Đã BT' },
  { id: 'TB-008', name: 'Tủ nạp ắc quy', group: 'TN', lastDate: '—', lastType: '—', status: 'Chưa BT' },
];

const typeColors: Record<string, 'success' | 'warning' | 'error'> = {
  CST: 'success', SCN: 'warning', SCC: 'error',
};

const historyStatusConfig: Record<string, { label: string; color: 'success' | 'default' }> = {
  'da-bt': { label: 'Đã BT', color: 'success' },
  'chua-bt': { label: 'Chưa BT', color: 'default' },
};

// ── CycleRow expand ──────────────────────────────────────
type CycleGroup = typeof cycleGroups[0];

const CycleRow = ({ row }: { row: CycleGroup }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <TableCell padding="checkbox">
          <IconButton size="small">
            {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 600 }}>{row.group}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.cycles.length} loại</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {row.cycles.map(c => (
              <Chip key={c.type} label={c.type} size="small"
                color={typeColors[c.type] ?? 'default'} variant="outlined" />
            ))}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5} sx={{ py: 0 }}>
          <Collapse in={open} unmountOnExit>
            <Box sx={{ py: 1.5, px: 6, bgcolor: 'action.hover' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Loại BT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Chu kỳ</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Đơn vị</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.cycles.map(c => (
                    <TableRow key={c.type}>
                      <TableCell>
                        <Chip label={c.type} size="small" color={typeColors[c.type] ?? 'default'} />
                      </TableCell>
                      <TableCell>{c.value}</TableCell>
                      <TableCell>{c.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// ── Tab configs — giống pattern MaintenanceRecordPage ────
const tabConfigs = [
  { label: 'Chu kỳ theo nhóm', icon: <LoopOutlined /> },
  { label: 'Lịch sử bảo dưỡng', icon: <HistoryOutlined /> },
];

// ── Component chính ──────────────────────────────────────
export default function MaintenanceCycles() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });

  // reset khi đổi tab
  const handleTabChange = (_: any, val: number) => {
    setActiveTab(val);
    setSearchValue('');
    setStatusFilter('');
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  // ── Tab 0: Chu kỳ theo nhóm ─────────────────────────
  const filteredCycles = cycleGroups.filter(g =>
    !searchValue ||
    g.group.toLowerCase().includes(searchValue.toLowerCase()) ||
    g.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  const paginatedCycles = filteredCycles.slice(
    paginationModel.page * paginationModel.pageSize,
    (paginationModel.page + 1) * paginationModel.pageSize,
  );

  // ── Tab 1: Lịch sử bảo dưỡng ────────────────────────
  const countByStatus = (s: string) => maintenanceHistory.filter(h => h.status === s).length;

  const filteredHistory = maintenanceHistory.filter(h => {
    const matchSearch = !searchValue ||
      h.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      h.group.toLowerCase().includes(searchValue.toLowerCase());
    const matchStatus = !statusFilter || h.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const paginatedHistory = filteredHistory.slice(
    paginationModel.page * paginationModel.pageSize,
    (paginationModel.page + 1) * paginationModel.pageSize,
  );

  const flatCycles = cycleGroups.flatMap((g, gi) =>
    g.cycles.map((c, ci) => ({
      id: `${g.group}-${c.type}`,
      stt: gi * 3 + ci + 1, // hoặc tính lại
      group: g.group,
      name: g.name,
      maintenanceType: c.type === 'CST' ? 'Chăm sóc' : c.type === 'SCN' ? 'Sửa chữa nhỏ' : 'Sửa chữa lớn',
      code: c.type,
      cycle: c.value,
      unit: c.unit,
    }))
  );

  const cycleColumns = [
    { field: 'stt', headerName: 'STT', width: 60 },
    { field: 'group', headerName: 'Mã nhóm', width: 100 },
    { field: 'name', headerName: 'Tên nhóm thiết bị', flex: 1, minWidth: 180 },
    { field: 'maintenanceType', headerName: 'Loại bảo trì', width: 140 },
    {
      field: 'code', headerName: 'Mã', width: 80,
      renderCell: (p: any) => (
        <Chip label={p.value} size="small" color={typeColors[p.value] ?? 'default'} />
      ),
    },
    { field: 'cycle', headerName: 'Chu kỳ', width: 90 },
    { field: 'unit', headerName: 'Đơn vị', width: 90 },
  ];
  
  const historyStatusOptions: FilterOption[] = [
    { label: 'Tất cả', value: '', count: maintenanceHistory.length, color: 'primary' },
    { label: 'Đã BT', value: 'da-bt', count: countByStatus('da-bt'), color: 'success' },
    { label: 'Chưa BT', value: 'chua-bt', count: countByStatus('chua-bt'), color: 'default' },
  ];

  const historyColumns = [
    { field: 'id', headerName: 'Mã TB', width: 110 },
    { field: 'name', headerName: 'Tên thiết bị', flex: 1, minWidth: 160 },
    {
      field: 'group', headerName: 'Nhóm', width: 110,
      renderCell: (p: any) => <Chip label={p.value} size="small" variant="outlined" />,
    },
    { field: 'lastDate', headerName: 'Lần BT gần nhất', width: 140 },
    {
      field: 'lastType', headerName: 'Loại BT', width: 90,
      renderCell: (p: any) => p.value !== '—'
        ? <Chip label={p.value} size="small" color={typeColors[p.value] ?? 'default'} />
        : <span>—</span>,
    },
    {
      field: 'status', headerName: 'Trạng thái', width: 120,
      renderCell: (p: any) => {
        const cfg = historyStatusConfig[p.value] ?? historyStatusConfig['chua-bt'];
        return <Chip label={cfg.label} size="small" color={cfg.color} />;
      },
    },
  ];

  return (
    <>
      <PageAction title="Chu kỳ bảo dưỡng theo nhóm thiết bị" />

      <Box sx={{ p: 2 }}>
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>

          {/* ── Tabs — cùng style với MaintenanceRecordPage ── */}
          <Box sx={{
            borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper',
            display: 'flex', justifyContent: 'flex-end',
          }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold', minHeight: 64 } }}
            >
              {tabConfigs.map((t, i) => (
                <Tab
                  key={i}
                  iconPosition="top"
                  icon={t.icon}          // không có Badge số đỏ
                  label={t.label}
                />
              ))}
            </Tabs>
          </Box>

          {/* ── Nội dung theo tab ── */}
          <Box sx={{ minHeight: 500 }}>

            {/* Tab 0: bảng expand row qua customContent */}
            {activeTab === 0 && (
              <Card elevation={0} sx={{ borderRadius: 0 }}>
                <CardContent sx={{ p: '0 !important' }}>
                  <TableCustom
                    title="Danh sách chu kỳ"
                    rows={flatCycles.slice(
                      paginationModel.page * paginationModel.pageSize,
                      (paginationModel.page + 1) * paginationModel.pageSize,
                    )}
                    columns={cycleColumns}
                    total={flatCycles.length}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    checkboxSelection={false}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    showDelete={false}
                  />
                </CardContent>
              </Card>
            )}

            {/* Tab 1: lịch sử — TableCustom bình thường với DataGrid */}
            {activeTab === 1 && (
              <Card elevation={0} sx={{ borderRadius: 0 }}>
                <CardContent sx={{ p: '0 !important' }}>
                  <TableCustom
                    title="Lịch sử bảo dưỡng gần nhất"
                    rows={paginatedHistory}
                    columns={historyColumns}
                    total={filteredHistory.length}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    checkboxSelection={false}
                    statusOptions={historyStatusOptions}
                    statusValue={statusFilter}
                    onStatusChange={setStatusFilter}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    showDelete={false}
                  />
                </CardContent>
              </Card>
            )}

          </Box>
        </Box>
      </Box>
    </>
  );
}