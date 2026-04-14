import { useState } from 'react';
import { Box, Chip, Alert, Badge } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import {
  AssignmentOutlined,
  BuildOutlined,
  FactCheckOutlined,
  PlaylistAddCheckOutlined,
  InventoryOutlined,
} from '@mui/icons-material';
import PageAction from '../../../components/common/PageAction';
import TableCustom from '../../../components/common/TableCustom';
import { useCmms } from '../../../hooks/CmmsContext';
import { FilterOption } from '../../../components/common/FilterStatusGroup';

export default function MaintenanceApprovalPage() {
  const {
    annualPlans,
    approvePlan,
    repairRequests,
    inspectionRecords,
    acceptanceTestRecords,
    materialQualityRecords,
    signAcceptanceRecords,
    signInspectionRecords,
    signMaterialQualityRecords,
    signRepairRequests,
  } = useCmms();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [justSigned, setJustSigned] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // ── Status filter per tab ─────────────────────────────────────────────────
  const [currentStatus0, setCurrentStatus0] = useState('');
  const [currentStatus1, setCurrentStatus1] = useState('');
  const [currentStatus2, setCurrentStatus2] = useState('');
  const [currentStatus3, setCurrentStatus3] = useState('');
  const [currentStatus4, setCurrentStatus4] = useState('');

  const statusSetters = [
    setCurrentStatus0,
    setCurrentStatus1,
    setCurrentStatus2,
    setCurrentStatus3,
    setCurrentStatus4,
  ];
  const statusValues = [
    currentStatus0,
    currentStatus1,
    currentStatus2,
    currentStatus3,
    currentStatus4,
  ];

  // ── Raw rows per tab ──────────────────────────────────────────────────────
  const allRows = [
    annualPlans,
    repairRequests,
    inspectionRecords,
    acceptanceTestRecords,
    materialQualityRecords,
  ];

  const pendingCounts = allRows.map(rows => rows.filter(r => r.status === 'cho-duyet').length);

  // ── Status options (giống AssetHandover) ─────────────────────────────────
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

  // ── Tab config ────────────────────────────────────────────────────────────
  const tabConfigs = [
    { label: 'Kế hoạch', icon: <AssignmentOutlined />, idLabel: 'Mã KH' },
    { label: 'Lệnh sửa chữa', icon: <BuildOutlined />, idLabel: 'Số lệnh SC' },
    { label: 'BB Giám định', icon: <FactCheckOutlined />, idLabel: 'Số BB giám định' },
    { label: 'BB Nghiệm thu', icon: <PlaylistAddCheckOutlined />, idLabel: 'Số BB nghiệm thu' },
    { label: 'BB Đánh giá VT', icon: <InventoryOutlined />, idLabel: 'Số BB đánh giá' },
  ];

  // ── Filtered rows for current tab ─────────────────────────────────────────
  const currentAllRows = allRows[activeTab];
  const currentStatusValue = statusValues[activeTab];

  const filtered = currentAllRows.filter(r => {
    if (r.status === 'draft') return false;

    const matchSearch =
      !searchValue || r.id.toLowerCase().includes(searchValue.toLowerCase());

    const matchStatus =
      !currentStatusValue || r.status === currentStatusValue;

    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice(
    paginationModel.page * paginationModel.pageSize,
    (paginationModel.page + 1) * paginationModel.pageSize,
  );

  // ── Sign handler ──────────────────────────────────────────────────────────
  const handleSign = async (selectedItems: any[]) => {
    const ids = selectedItems.map(i => i.id);
    if (activeTab === 0) ids.forEach(id => approvePlan(id));
    else if (activeTab === 1) signRepairRequests(ids);
    else if (activeTab === 2) signInspectionRecords(ids);
    else if (activeTab === 3) signAcceptanceRecords(ids);
    else if (activeTab === 4) signMaterialQualityRecords(ids);
    setJustSigned(ids.join(', '));
    setSelectedIds([]);
  };

  const safeRows = paginated.map(r => ({
    ...r,
    id: r.id || crypto.randomUUID(),
  }));

  // ── Columns ───────────────────────────────────────────────────────────────
  const statusChip = (status: string) => {
    if (status === 'cho-duyet') return <Chip label="Chờ duyệt" color="warning" size="small" />;
    if (status === 'da-duyet') return <Chip label="Đã duyệt" color="success" size="small" />;
    if (status === 'draft') return <Chip label="Bản nháp" color="default" size="small" />;
    if (status === 'tu-choi') return <Chip label="Từ chối" color="error" size="small" />;
    return <Chip label={status} size="small" />;
  };

  const columns = [
    { field: 'id', headerName: tabConfigs[activeTab].idLabel, width: 160 },
    { field: 'description', headerName: 'Mô tả', flex: 1, minWidth: 200 },
    { field: 'createdDate', headerName: 'Ngày tạo', width: 120 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 140,
      renderCell: (params: any) => statusChip(params.row.status),
    },
  ];

  return (
    <>
      <PageAction title="Ký duyệt biên bản" />

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {justSigned && (
          <Alert severity="success" onClose={() => setJustSigned(null)}>
            Đã ký duyệt thành công: <strong>{justSigned}</strong>
          </Alert>
        )}

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* ── Tab bar — icon + badge + label bên dưới giống AssetHandover ── */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: '#fff',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, v) => {
                setActiveTab(v);
                setSelectedIds([]);
                setSearchValue('');
              }}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'bold',
                  minHeight: 64,
                },
              }}
            >
              {tabConfigs.map((t, i) => (
                <Tab
                  key={i}
                  iconPosition="top"
                  icon={
                    <Badge badgeContent={pendingCounts[i]} color="error">
                      {t.icon}
                    </Badge>
                  }
                  label={t.label}
                />
              ))}
            </Tabs>
          </Box>

          {/* ── Table với filter trạng thái ── */}
          <TableCustom
            title="Biên bản chờ ký duyệt"
            rows={safeRows}
            columns={columns}
            total={filtered.length}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            paginationMode="client"
            checkboxSelection
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            showDelete={false}
            isRowSelectable={(params) => params?.row?.status === 'cho-duyet'}
            showStatusFilter={true}
            statusOptions={buildStatusOptions(currentAllRows)}
            statusValue={currentStatusValue}
            onStatusChange={(val) => {
              statusSetters[activeTab](val);
              setPaginationModel(prev => ({ ...prev, page: 0 }));
            }}
            // ✅ Nút Ký biên bản
            canSign={(items) => items.length > 0 && items.every(i => i.status === 'cho-duyet')}
            handleSignDocument={(items, _user, _onSign) => handleSign(items)}
            onSign={() => { }}
          />
        </Box>
      </Box>
    </>
  );
}