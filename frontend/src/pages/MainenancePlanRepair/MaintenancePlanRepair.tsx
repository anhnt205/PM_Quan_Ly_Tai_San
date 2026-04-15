import { useMemo, useState } from 'react';
import {
  Box, Card, CardContent, Paper, Chip,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { Trash2, Calendar } from 'lucide-react';
import { Button } from '@mui/material';
import PageAction from '../../components/common/PageAction';
import TableCustom from '../../components/common/TableCustom';
import MaintenancePlanCalendar from './components/MaintenancePlanCalendar';
import { FilterOption } from '../../components/common/FilterStatusGroup';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

// ✅ Giữ nguyên context và types từ luồng cũ
import { useCmms } from '../../hooks/CmmsContext';

import type { AnnualPlan } from '../../mockdata/mockWorkflow';
import CreatePlanDialog from '../Maintenance/components/planning/CreatePlan';
import PlanDetailPanel from '../Maintenance/components/planning/PlanDetailPanel';
import { calculatePlanMaterials } from '../../mockdata/mockNorms';

// ── Status config (từ Planning.tsx cũ) ──────────────────
const planStatusConfig: Record<string, {
  label: string;
  color: 'default' | 'warning' | 'success' | 'error';
}> = {
  'draft': { label: 'Bản nháp', color: 'default' },
  'cho-duyet': { label: 'Chờ duyệt', color: 'warning' },
  'da-duyet': { label: 'Đã duyệt', color: 'success' },
  'tu-choi': { label: 'Từ chối', color: 'error' },
};

const renderStatus = (status: string) => {
  const cfg = planStatusConfig[status] ?? planStatusConfig['draft'];
  return <Chip label={cfg.label} color={cfg.color} size="small" />;
};

export default function MaintenancePlanRepair() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<AnnualPlan | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
  const [showForm, setShowForm] = useState(false);

  // ✅ Toàn bộ state và handler từ CmmsContext — giữ nguyên như Planning.tsx cũ
  const {
    annualPlans,
    addAnnualPlan,
    repairRequests,
    inspectionRecords,
    acceptanceTestRecords,
    materialQualityRecords,
    addRepairRequest,
    addInspectionRecord,
    addAcceptanceTestRecord,
    addMaterialQualityRecord,
  } = useCmms();

  const selectedSchedule: Record<string, any> = (selectedPlan as any)?.monthlySchedule ?? {};
  const yearlyMaterials = useMemo(
    () => selectedPlan ? calculatePlanMaterials(selectedSchedule) : [],
    [selectedPlan]
  );

  // ── Lọc + phân trang client-side ────────────────────────
  const filtered = annualPlans.filter(p => {
    const matchSearch = !searchValue
      || p.id.toLowerCase().includes(searchValue.toLowerCase())
      || p.description.toLowerCase().includes(searchValue.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice(
    paginationModel.page * paginationModel.pageSize,
    (paginationModel.page + 1) * paginationModel.pageSize,
  );

  // ── Đếm theo status cho filter tabs ─────────────────────
  const countByStatus = (s: string) => annualPlans.filter(p => p.status === s).length;

  const handleSendToSigner = async (selectedItems: AnnualPlan[]) => {
    // TODO: gọi API gửi duyệt
    console.log('Gửi duyệt:', selectedItems);
  };

  const statusOptions: FilterOption[] = [
    { label: 'Tất cả', value: '', count: annualPlans.length, color: 'primary' },
    { label: 'Bản nháp', value: 'draft', count: countByStatus('draft'), color: 'default' },
    { label: 'Chờ duyệt', value: 'cho-duyet', count: countByStatus('cho-duyet'), color: 'warning' },
    { label: 'Đã duyệt', value: 'da-duyet', count: countByStatus('da-duyet'), color: 'success' },
    { label: 'Từ chối', value: 'tu-choi', count: countByStatus('tu-choi'), color: 'error' },
  ];

  // ── Columns đầy đủ / thu gọn ─────────────────────────────
  const isDetailOpen = !!selectedPlan;

  const columnsFull = [
    { field: 'id', headerName: 'Mã kế hoạch', width: 140, editable: false },
    { field: 'description', headerName: 'Mô tả', flex: 1, minWidth: 200, editable: false },
    { field: 'year', headerName: 'Năm', width: 80, editable: false },
    { field: 'createdDate', headerName: 'Ngày tạo', width: 110, editable: false },
    {
      field: 'deviceIds',
      headerName: 'Số TB',
      width: 80,
      editable: false,
      renderCell: (params: any) => params.row.deviceIds?.length ?? 0,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 130,
      editable: false,
      renderCell: (params: any) => renderStatus(params.value),
    },
  ];

  const columnsCollapsed = [
    { field: 'id', headerName: 'Mã kế hoạch', flex: 1, editable: false },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 120,
      editable: false,
      renderCell: (params: any) => renderStatus(params.value),
    },
  ];

  return (
    <>
      {/* ✅ PageAction của code mới — nút Mới điều hướng sang CreatePlan */}
      <PageAction
        title="Lập kế hoạch sửa chữa bảo dưỡng"
        onNewClick={() => setShowForm(true)}
      />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 180px)', minHeight: 500 }}>

          {/* ── Bảng danh sách ── */}
          <Card
            elevation={0}
            sx={{
              flex: isDetailOpen ? '0 0 400px' : 1,
              transition: 'flex 0.3s ease',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ height: '100%', p: '0 !important' }}>
              <TableCustom
                title="Danh sách kế hoạch"
                rows={paginated}
                columns={isDetailOpen ? columnsCollapsed : columnsFull}
                total={filtered.length}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                checkboxSelection={!isDetailOpen}
                onRowClick={(params) => setSelectedPlan(params.row as AnnualPlan)}
                statusOptions={statusOptions}
                statusValue={statusFilter}
                onStatusChange={setStatusFilter}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onDelete={() => { }}
                showDelete={false}
                isRowSelectable={(params) => params?.row?.status === 'draft'}
                isCheckShowShare={(items: any[]) =>
                  items.length > 0 && items.every(item => item.status === 'draft')
                }
                handleSendToSigner={handleSendToSigner}

                customContent={
                  showCalendar && !isDetailOpen ? (
                    <MaintenancePlanCalendar
                      onClose={() => setShowCalendar(false)}
                      plans={annualPlans as any}
                      onPlanClick={(plan: any) => {
                        setSelectedPlan(plan as AnnualPlan);
                        setShowCalendar(false);
                      }}
                      onCreateRepair={() => navigate(ROUTES.ASSETGROUP)}
                    />
                  ) : undefined
                }
              />
            </CardContent>
          </Card>

          {/* ── Panel chi tiết — giữ nguyên 100% từ Planning.tsx cũ ── */}
          {isDetailOpen && selectedPlan && (
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                overflow: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <PlanDetailPanel
                plan={selectedPlan}
                repairRequests={repairRequests}
                inspectionRecords={inspectionRecords}
                acceptanceTestRecords={acceptanceTestRecords}
                materialQualityRecords={materialQualityRecords}
                onClose={() => setSelectedPlan(null)}
                onCreateRepairRequest={addRepairRequest}
                onCreateInspectionRecord={addInspectionRecord}
                onCreateAcceptanceRecord={addAcceptanceTestRecord}
                onCreateMaterialQualityRecord={addMaterialQualityRecord}
              />
            </Paper>
          )}
        </Box>
      </Box>

      {selectedPlan && yearlyMaterials.length > 0 && (
        <Box sx={{ mt: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Tổng hợp vật tư cần thiết — Kế hoạch năm {selectedPlan.year} ({selectedPlan.id})
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tên vật tư</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Tổng số lượng</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Đơn vị</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {yearlyMaterials.map((mat, i) => (
                  <TableRow key={mat.name}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{mat.name}</TableCell>
                    <TableCell align="right">{mat.quantity.toLocaleString()}</TableCell>
                    <TableCell>{mat.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <CreatePlanDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        onSave={(plan) => {
          addAnnualPlan(plan);
          setShowForm(false);
        }}
      />
    </>
  );
}