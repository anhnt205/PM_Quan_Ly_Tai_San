import React, { useState } from 'react';
import {
  Box, Chip, Alert, Badge, Card, CardContent, Paper,
  Typography, IconButton, Tabs, Tab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  AssignmentOutlined, BuildOutlined, FactCheckOutlined,
  PlaylistAddCheckOutlined, InventoryOutlined, WarningOutlined, SearchOutlined,
} from '@mui/icons-material';
import PageAction from '../../../components/common/PageAction';
import TableCustom from '../../../components/common/TableCustom';
import { useCmms } from '../../../hooks/CmmsContext';
import StepPreview from '../components/step/StepPreview';
import RepairRequestPreview from '../components/preview/RepairRequestPreview';
import InspectionPreview from '../components/preview/InspectionPreview';
import AcceptancePreview from '../components/preview/AcceptancePreview';
import MaterialQualityPreview from '../components/preview/MaterialQualityPreview';
import IncidentPreview from '../components/preview/IncidentPreview';
import IncidentInspectionPreview from '../components/preview/IncidentInspectionPreview';

export default function MaintenanceApprovalPage() {
  const {
    annualPlans, approvePlan,
    repairRequests, inspectionRecords,
    acceptanceTestRecords, materialQualityRecords,
    signAcceptanceRecords, signInspectionRecords,
    signMaterialQualityRecords, signRepairRequests,
    incidentReports, signIncidentReports,
    incidentInspectionRecords, signIncidentInspectionRecords,
  } = useCmms();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [justSigned, setJustSigned] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [detailTab, setDetailTab] = useState(0);

  // ── Filter ngày ──────────────────────────────────────────────
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const allRows = [
    annualPlans, repairRequests, inspectionRecords,
    acceptanceTestRecords, materialQualityRecords,
    incidentReports || [], incidentInspectionRecords || [],
  ];

  const pendingCounts = allRows.map(rows => rows.filter(r => r.status === 'cho-duyet').length);

  const tabConfigs = [
    { label: 'Kế hoạch',           icon: <AssignmentOutlined />,      idLabel: 'Mã KH' },
    { label: 'Lệnh sửa chữa',      icon: <BuildOutlined />,           idLabel: 'Số lệnh SC' },
    { label: 'BB Giám định',        icon: <FactCheckOutlined />,       idLabel: 'Số BB giám định' },
    { label: 'BB Nghiệm thu',       icon: <PlaylistAddCheckOutlined />, idLabel: 'Số BB nghiệm thu' },
    { label: 'BB Đánh giá VT',      icon: <InventoryOutlined />,       idLabel: 'Số BB đánh giá' },
    { label: 'Phiếu báo SỰ CỐ',    icon: <WarningOutlined />,         idLabel: 'Số phiếu' },
    { label: 'BB Kiểm tra SỰ CỐ',  icon: <SearchOutlined />,          idLabel: 'Số BB kiểm tra' },
  ];

  // ── Cấu hình cột cha cho từng tab ────────────────────────────
  // tab 0 – Kế hoạch          : không có cột cha
  // tab 1 – Lệnh sửa chữa     : mã kế hoạch
  // tab 2 – BB Giám định       : mã lệnh SC + mã BB kiểm tra SC (2 luồng)
  // tab 3 – BB Nghiệm thu      : mã BB giám định
  // tab 4 – BB Đánh giá VT     : mã BB nghiệm thu
  // tab 5 – Phiếu báo SC       : mã kế hoạch
  // tab 6 – BB Kiểm tra SC     : mã phiếu báo SC
  const parentColumnConfigs: Record<number, { field: string; headerName: string }[]> = {
    1: [{ field: 'planId',                  headerName: 'Mã kế hoạch' }],
    2: [
      { field: 'repairRequestId',           headerName: 'Mã lệnh SC' },
      { field: 'incidentInspectionId',      headerName: 'Mã BB kiểm tra SC' },
    ],
    3: [{ field: 'inspectionId',            headerName: 'Mã BB giám định' }],
    4: [{ field: 'acceptanceId',            headerName: 'Mã BB nghiệm thu' }],
    5: [{ field: 'planId',                  headerName: 'Mã kế hoạch' }],
    6: [{ field: 'incidentReportId',        headerName: 'Mã phiếu báo SC' }],
  };

  // ── Helper lọc theo ngày ─────────────────────────────────────
  const isInDateRange = (row: any) => {
    // Ưu tiên field `createdDate`; fallback sang `date`, `inspectionDate`, `detectedAt`
    const rawDate: string =
      row.createdDate ?? row.date ?? row.inspectionDate ?? row.detectedAt ?? '';
    if (!rawDate) return true;

    // Chuyển chuỗi ngày VN "DD/MM/YYYY" → Date, hoặc chuỗi ISO cũng được
    const parseVn = (s: string) => {
      const parts = s.split('/');
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`);
      }
      return new Date(s);
    };

    const d = parseVn(rawDate);
    if (isNaN(d.getTime())) return true;

    if (dateFrom) {
      const from = new Date(dateFrom);
      if (d < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (d > to) return false;
    }
    return true;
  };

  const currentAllRows = allRows[activeTab];

  const filtered = currentAllRows.filter(r => {
    const matchSearch = !searchValue || r.id.toLowerCase().includes(searchValue.toLowerCase());
    return r.status === 'cho-duyet' && matchSearch && isInDateRange(r);
  });

  const paginated = filtered.slice(
    paginationModel.page * paginationModel.pageSize,
    (paginationModel.page + 1) * paginationModel.pageSize,
  );

  const handleSign = async (selectedItems: any[]) => {
    const ids = selectedItems.map(i => i.id);
    if (activeTab === 0) ids.forEach(id => approvePlan(id));
    else if (activeTab === 1) signRepairRequests(ids);
    else if (activeTab === 2) signInspectionRecords(ids);
    else if (activeTab === 3) signAcceptanceRecords(ids);
    else if (activeTab === 4) signMaterialQualityRecords(ids);
    else if (activeTab === 5) signIncidentReports?.(ids);
    else if (activeTab === 6) signIncidentInspectionRecords?.(ids);
    setJustSigned(ids.join(', '));
    setSelectedIds([]);
    if (selectedRow && ids.includes(selectedRow.id)) {
      setSelectedRow((prev: any) => ({ ...prev, status: 'da-duyet' }));
    }
  };

  const safeRows = paginated.map(r => ({
    ...r,
    id: r.id || crypto.randomUUID(),
  }));

  const statusChip = (status: string) => {
    if (status === 'cho-duyet') return <Chip label="Chờ duyệt" color="warning" size="small" />;
    if (status === 'da-duyet') return <Chip label="Đã duyệt" color="success" size="small" />;
    if (status === 'draft')    return <Chip label="Bản nháp"  color="default" size="small" />;
    if (status === 'tu-choi')  return <Chip label="Từ chối"   color="error"   size="small" />;
    return <Chip label={status} size="small" />;
  };

  // ── Xây dựng cột bảng ────────────────────────────────────────
  const buildColumns = (collapsed: boolean) => {
    const parentCols = (parentColumnConfigs[activeTab] ?? []).map(cfg => ({
      field: cfg.field,
      headerName: cfg.headerName,
      width: 160,
      // Hiển thị '—' nếu không có giá trị (biên bản thuộc luồng kia)
      renderCell: (params: any) => (
        <span style={{ color: params.value ? 'inherit' : '#bbb' }}>
          {params.value || '—'}
        </span>
      ),
    }));

    if (collapsed) {
      return [
        { field: 'id',     headerName: tabConfigs[activeTab].idLabel, flex: 1 },
        { field: 'status', headerName: 'TT', width: 110,
          renderCell: (params: any) => statusChip(params.row.status) },
      ];
    }

    return [
      { field: 'id',          headerName: tabConfigs[activeTab].idLabel, width: 160 },
      ...parentCols,
      { field: 'description', headerName: 'Mô tả', flex: 1, minWidth: 200 },
      { field: 'createdDate', headerName: 'Ngày tạo', width: 120 },
      { field: 'status',      headerName: 'Trạng thái', width: 140,
        renderCell: (params: any) => statusChip(params.row.status) },
    ];
  };

  // ── Render preview theo tab ───────────────────────────────────
  const renderPreview = () => {
    if (!selectedRow) return null;
    switch (activeTab) {
      case 0: return (
        <StepPreview
          sourceDeptId={selectedRow.sourceDepartmentId ?? ''}
          executionDeptId={selectedRow.executionDepartmentId ?? ''}
          assetIds={selectedRow.deviceIds ?? []}
          quantities={{}}
          schedule={selectedRow.monthlySchedule ?? {}}
          signers={selectedRow.signers ?? []}
          deptDevices={{}}
          departments={[]}
        />
      );
      case 1: return (
        <RepairRequestPreview
          plan={selectedRow}
          deviceIds={selectedRow.deviceIds ?? []}
          month={selectedRow.month ?? 1}
          year={selectedRow.year ?? new Date().getFullYear()}
          number={selectedRow.number ?? ''}
          signers={selectedRow.signers ?? []}
          sourceDeptId={selectedRow.sourceDepartmentId ?? ''}
          execDeptId={selectedRow.executionDepartmentId ?? ''}
        />
      );
      case 2: return <InspectionPreview row={selectedRow} />;
      case 3: return <AcceptancePreview row={selectedRow} />;
      case 4: return <MaterialQualityPreview row={selectedRow} />;
      case 5: return (
        <IncidentPreview
          number={selectedRow.number}
          detectedAt={selectedRow.detectedAt}
          reporter={selectedRow.reporter}
          reporterDeptId={selectedRow.reporterDeptId}
          signers={selectedRow.signers}
          systemName={selectedRow.systemName}
          location={selectedRow.location}
          description={selectedRow.description}
          severity={selectedRow.severity}
          subsystem={selectedRow.subsystem}
          deviceEntries={selectedRow.deviceEntries}
          planIds={selectedRow.planIds}
        />
      );
      case 6: return (
        <IncidentInspectionPreview
          number={selectedRow.number}
          inspectionDate={selectedRow.inspectionDate}
          location={selectedRow.location}
          findings={selectedRow.findings}
          recommendation={selectedRow.recommendation}
          items={selectedRow.items}
          signers={selectedRow.signers}
        />
      );
      default: return null;
    }
  };

  const renderSignProcess = (row: any) => {
    const signers = row?.signers ?? [];
    if (!signers.length) return <Alert severity="info">Không có quy trình ký cho biên bản này.</Alert>;

    return (
      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          Quy trình ký
          <Chip label={`${signers.length} người`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 400 }} />
        </Typography>
        <Box sx={{ position: 'relative', pl: 5 }}>
          <Box sx={{ position: 'absolute', left: 16, top: 8, bottom: 8, width: '1px', bgcolor: 'divider' }} />
          {signers.map((s: any, idx: number) => (
            <Box key={`${s.name ?? s.userName}-${idx}`} sx={{ position: 'relative', mb: 1.5 }}>
              <Box sx={{
                position: 'absolute', left: -37, top: 14,
                width: 24, height: 24, borderRadius: '50%',
                bgcolor: 'primary.main', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, zIndex: 1, boxShadow: '0 0 0 3px white',
              }}>{idx + 1}</Box>
              <Box sx={{
                border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5,
                bgcolor: 'background.paper', transition: 'all 0.2s',
                '&:hover': { boxShadow: 1, borderColor: 'grey.300' },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: '50%',
                      bgcolor: 'primary.main', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, fontSize: 13, flexShrink: 0,
                    }}>{(s.name ?? s.userName)?.charAt(0) ?? '?'}</Box>
                    <Box>
                      <Typography fontWeight={600} fontSize={13}>{s.name ?? s.userName ?? '—'}</Typography>
                      <Typography variant="caption" color="text.secondary">{s.title || s.departmentName || ''}</Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip label={s.departmentName || ''} size="small" sx={{ fontSize: 10, height: 18, bgcolor: 'grey.100' }} />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    {s.signed
                      ? <Chip label={`Đã ký${s.signedAt ? ` • ${s.signedAt}` : ''}`} size="small" color="success" />
                      : <Chip label="Chưa ký" size="small" color="warning" />}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const isDetailOpen = !!selectedRow;

  return (
    <>
      <PageAction title="Ký duyệt biên bản" />

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {justSigned && (
          <Alert severity="success" onClose={() => setJustSigned(null)}>
            Đã ký duyệt thành công: <strong>{justSigned}</strong>
          </Alert>
        )}

        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          {/* Tab bar */}
          <Box sx={{
            borderBottom: 1, borderColor: 'divider', bgcolor: '#fff',
            display: 'flex', justifyContent: 'flex-end', overflowX: 'auto',
          }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => {
                setActiveTab(v);
                setSelectedIds([]);
                setSearchValue('');
                setDateFrom('');
                setDateTo('');
                setSelectedRow(null);
              }}
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold', minHeight: 64 } }}
            >
              {tabConfigs.map((t, i) => (
                <Tab
                  key={i}
                  iconPosition="top"
                  icon={<Badge badgeContent={pendingCounts[i]} color="error">{t.icon}</Badge>}
                  label={t.label}
                />
              ))}
            </Tabs>
          </Box>

          {/* ── Filter thời gian ── */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1.5,
            borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#fafafa',
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
              Lọc theo ngày:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">Từ</Typography>
              <input
                type="date"
                value={dateFrom}
                onChange={e => { setDateFrom(e.target.value); setPaginationModel(m => ({ ...m, page: 0 })); }}
                style={{
                  border: '1px solid #ccc', borderRadius: 6, padding: '4px 8px',
                  fontSize: 13, color: 'inherit', background: 'transparent',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">Đến</Typography>
              <input
                type="date"
                value={dateTo}
                onChange={e => { setDateTo(e.target.value); setPaginationModel(m => ({ ...m, page: 0 })); }}
                style={{
                  border: '1px solid #ccc', borderRadius: 6, padding: '4px 8px',
                  fontSize: 13, color: 'inherit', background: 'transparent',
                }}
              />
            </Box>
            {(dateFrom || dateTo) && (
              <Chip
                label="Xóa bộ lọc"
                size="small"
                onDelete={() => { setDateFrom(''); setDateTo(''); }}
                sx={{ fontSize: 11 }}
              />
            )}
          </Box>

          {/* Nội dung: bảng + panel detail song song */}
          <Box sx={{ display: 'flex', gap: 0, minHeight: 500 }}>

            {/* ── Bảng danh sách ── */}
            <Card
              elevation={0}
              sx={{
                flex: isDetailOpen ? '0 0 400px' : 1,
                transition: 'flex 0.3s ease',
                overflow: 'hidden',
                borderRadius: 0,
                borderRight: isDetailOpen ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ height: '100%', p: '0 !important' }}>
                <TableCustom
                  title="Biên bản chờ ký duyệt"
                  rows={safeRows}
                  columns={buildColumns(isDetailOpen)}
                  total={filtered.length}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  paginationMode="client"
                  checkboxSelection={!isDetailOpen}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  showDelete={false}
                  onRowClick={(params) => { setSelectedRow(params.row); setDetailTab(0); }}
                  isRowSelectable={(params) => params?.row?.status === 'cho-duyet'}
                  showStatusFilter={false}
                  canSign={(items) => items.length > 0 && items.every(i => i.status === 'cho-duyet')}
                  handleSignDocument={(items, _user, _onSign) => handleSign(items)}
                  onSign={() => {}}
                />
              </CardContent>
            </Card>

            {/* ── Panel chi tiết / preview ── */}
            {isDetailOpen && (
              <Paper
                elevation={0}
                sx={{ flex: 1, p: 2, overflow: 'auto', borderRadius: 0, bgcolor: 'background.paper' }}
              >
                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Xem trước: {selectedRow.id}
                  </Typography>
                  <IconButton size="small" onClick={() => setSelectedRow(null)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Tabs value={detailTab} onChange={(_, v) => setDetailTab(v)} sx={{ mb: 2 }}>
                  <Tab label="Biên bản" />
                  <Tab label="Quy trình ký" />
                </Tabs>

                {detailTab === 0 ? renderPreview() : renderSignProcess(selectedRow)}
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}