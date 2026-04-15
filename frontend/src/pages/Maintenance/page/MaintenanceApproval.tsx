import { useState } from 'react';
import {
  Box, Chip, Alert, Badge, Card, CardContent, Paper,
  Typography, IconButton, Tabs, Tab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  AssignmentOutlined, BuildOutlined, FactCheckOutlined,
  PlaylistAddCheckOutlined, InventoryOutlined,
} from '@mui/icons-material';
import PageAction from '../../../components/common/PageAction';
import TableCustom from '../../../components/common/TableCustom';
import { useCmms } from '../../../hooks/CmmsContext';
import { FilterOption } from '../../../components/common/FilterStatusGroup';
import StepPreview from '../components/step/StepPreview';
import RepairRequestPreview from '../components/preview/RepairRequestPreview';
import InspectionPreview from '../components/preview/InspectionPreview';
import AcceptancePreview from '../components/preview/AcceptancePreview';
import MaterialQualityPreview from '../components/preview/MaterialQualityPreview';

export default function MaintenanceApprovalPage() {
  const {
    annualPlans, approvePlan,
    repairRequests, inspectionRecords,
    acceptanceTestRecords, materialQualityRecords,
    signAcceptanceRecords, signInspectionRecords,
    signMaterialQualityRecords, signRepairRequests,
  } = useCmms();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [justSigned, setJustSigned] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const [currentStatus0, setCurrentStatus0] = useState('');
  const [currentStatus1, setCurrentStatus1] = useState('');
  const [currentStatus2, setCurrentStatus2] = useState('');
  const [currentStatus3, setCurrentStatus3] = useState('');
  const [currentStatus4, setCurrentStatus4] = useState('');

  const statusSetters = [
    setCurrentStatus0, setCurrentStatus1, setCurrentStatus2,
    setCurrentStatus3, setCurrentStatus4,
  ];
  const statusValues = [
    currentStatus0, currentStatus1, currentStatus2,
    currentStatus3, currentStatus4,
  ];

  const allRows = [
    annualPlans, repairRequests, inspectionRecords,
    acceptanceTestRecords, materialQualityRecords,
  ];

  const pendingCounts = allRows.map(rows => rows.filter(r => r.status === 'cho-duyet').length);

  const buildStatusOptions = (rows: any[]): FilterOption[] => {
    const pending = rows.filter(r => r.status === 'cho-duyet').length;
    const approved = rows.filter(r => r.status === 'da-duyet').length;
    const rejected = rows.filter(r => r.status === 'tu-choi').length;
    return [
      { label: 'Tất cả', count: rows.length, color: 'default', value: '' },
      { label: 'Chờ duyệt', count: pending, color: 'warning', value: 'cho-duyet' },
      { label: 'Đã duyệt', count: approved, color: 'success', value: 'da-duyet' },
      { label: 'Từ chối', count: rejected, color: 'error', value: 'tu-choi' },
    ];
  };

  const tabConfigs = [
    { label: 'Kế hoạch', icon: <AssignmentOutlined />, idLabel: 'Mã KH' },
    { label: 'Lệnh sửa chữa', icon: <BuildOutlined />, idLabel: 'Số lệnh SC' },
    { label: 'BB Giám định', icon: <FactCheckOutlined />, idLabel: 'Số BB giám định' },
    { label: 'BB Nghiệm thu', icon: <PlaylistAddCheckOutlined />, idLabel: 'Số BB nghiệm thu' },
    { label: 'BB Đánh giá VT', icon: <InventoryOutlined />, idLabel: 'Số BB đánh giá' },
  ];

  const currentAllRows = allRows[activeTab];
  const currentStatusVal = statusValues[activeTab];

  const filtered = currentAllRows.filter(r => {
    if (r.status === 'draft') return false;
    const matchSearch = !searchValue || r.id.toLowerCase().includes(searchValue.toLowerCase());
    const matchStatus = !currentStatusVal || r.status === currentStatusVal;
    return matchSearch && matchStatus;
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
    setJustSigned(ids.join(', '));
    setSelectedIds([]);
    // Cập nhật selectedRow nếu đang xem row vừa ký
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
    if (status === 'draft') return <Chip label="Bản nháp" color="default" size="small" />;
    if (status === 'tu-choi') return <Chip label="Từ chối" color="error" size="small" />;
    return <Chip label={status} size="small" />;
  };

  // Cột đầy đủ khi chưa mở detail
  const columnsFull = [
    { field: 'id', headerName: tabConfigs[activeTab].idLabel, width: 160 },
    { field: 'description', headerName: 'Mô tả', flex: 1, minWidth: 200 },
    { field: 'createdDate', headerName: 'Ngày tạo', width: 120 },
    {
      field: 'status', headerName: 'Trạng thái', width: 140,
      renderCell: (params: any) => statusChip(params.row.status),
    },
  ];

  // Cột thu gọn khi đang mở detail
  const columnsCollapsed = [
    { field: 'id', headerName: tabConfigs[activeTab].idLabel, flex: 1 },
    {
      field: 'status', headerName: 'TT', width: 110,
      renderCell: (params: any) => statusChip(params.row.status),
    },
  ];

  // Render đúng preview theo tab
  const renderPreview = () => {
    if (!selectedRow) return null;
    switch (activeTab) {
      case 0:
        return (
          <StepPreview
            sourceDeptId={selectedRow.sourceDepartmentId ?? ''}
            executionDeptId={selectedRow.executionDepartmentId ?? ''}
            assetIds={selectedRow.deviceIds ?? []}
            quantities={{}}
            schedule={selectedRow.monthlySchedule ?? {}}
            signers={selectedRow.signers ?? []}
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
      default: return null;
    }
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

        {/* Tab bar — tách ra ngoài để nằm trên cả 2 panel */}
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{
            borderBottom: 1, borderColor: 'divider', bgcolor: '#fff',
            display: 'flex', justifyContent: 'flex-end',
          }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => {
                setActiveTab(v);
                setSelectedIds([]);
                setSearchValue('');
                setSelectedRow(null); // ← reset khi đổi tab
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
                  columns={isDetailOpen ? columnsCollapsed : columnsFull}
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
                  onRowClick={(params) => setSelectedRow(params.row)}
                  isRowSelectable={(params) => params?.row?.status === 'cho-duyet'}
                  showStatusFilter={true}
                  statusOptions={buildStatusOptions(currentAllRows)}
                  statusValue={currentStatusVal}
                  onStatusChange={(val) => {
                    statusSetters[activeTab](val);
                    setPaginationModel(prev => ({ ...prev, page: 0 }));
                  }}
                  canSign={(items) => items.length > 0 && items.every(i => i.status === 'cho-duyet')}
                  handleSignDocument={(items, _user, _onSign) => handleSign(items)}
                  onSign={() => { }}
                />
              </CardContent>
            </Card>

            {/* ── Panel chi tiết / preview ── */}
            {isDetailOpen && (
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2,
                  overflow: 'auto',
                  borderRadius: 0,
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Xem trước: {selectedRow.id}
                  </Typography>
                  <IconButton size="small" onClick={() => setSelectedRow(null)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                {renderPreview()}
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}