import { useState } from 'react';
import {
  Box, Card, CardContent, Paper, Chip,
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
// import PlanDetailPanel from '@/components/planning/PlanDetailPanel';
import type { AnnualPlan } from '../../mockdata/mockWorkflow';
import CreatePlanInline from '../Maintenance/components/planning/CreatePlan';

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
        onNewClick={() => {
          setShowForm(true);
        }}
      />

      <Box sx={{ p: 2 }}>
        {showForm && (
          <CreatePlanInline
            onClose={() => setShowForm(false)}
            onSave={(plan) => {
              addAnnualPlan(plan);   // lưu vào context
              setShowForm(false);
            }}
          />
        )}
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
              {/* <PlanDetailPanel
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
              /> */}
            </Paper>
          )}
        </Box>
      </Box>
    </>
  );
}