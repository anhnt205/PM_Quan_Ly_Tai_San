import { useMemo, useState, useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Trash2, Calendar } from 'lucide-react';
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
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({});
  const [showForm, setShowForm] = useState(false);

  // ✅ Toàn bộ state và handler từ CmmsContext
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

  // 🔍 DEBUG
  useEffect(() => {
    console.log('📋 [CMMS Context Data]', {
      totalPlans: annualPlans.length,
      years: Array.from(new Set(annualPlans.map(p => p.year))).sort((a, b) => b - a),
      statusCounts: annualPlans.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    });
  }, [annualPlans]);

  const selectedSchedule: Record<string, any> = (selectedPlan as any)?.monthlySchedule ?? {};
  const yearlyMaterials = useMemo(
    () => selectedPlan ? calculatePlanMaterials(selectedSchedule) : [],
    [selectedPlan]
  );

  // ── Lọc client-side ────────────────────────
  const filtered = useMemo(() => {
    if (!annualPlans || annualPlans.length === 0) {
      return [];
    }

    const result = annualPlans.filter(p => {
      const matchSearch = !searchValue
        || p.id.toLowerCase().includes(searchValue.toLowerCase())
        || p.description.toLowerCase().includes(searchValue.toLowerCase());
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });

    console.log('✅ [Filtered Plans]', {
      totalIn: annualPlans.length,
      totalOut: result.length,
    });

    return result;
  }, [annualPlans, searchValue, statusFilter]);

  const plansByYear = useMemo(() => {
    const groups = filtered.reduce((acc, plan) => {
      const list = acc.get(plan.year) ?? [];
      list.push(plan);
      acc.set(plan.year, list);
      return acc;
    }, new Map<number, AnnualPlan[]>());

    const result = Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);

    console.log('🎯 [Plans by Year]', {
      count: result.length,
      years: result.map(([year, plans]) => ({ year, planCount: plans.length })),
    });

    return result;
  }, [filtered]);

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const handleToggleSelect = (planId: string) => {
    setSelectedIds((prev) =>
      prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId],
    );
  };

  const isPlanSelectable = (plan: AnnualPlan) => plan.status === 'draft';

  const selectedPlans = annualPlans.filter((plan) => selectedIds.includes(plan.id));
  const canSendToSigner = selectedPlans.length > 0 && selectedPlans.every((plan) => plan.status === 'draft');

  // ── Đếm theo status cho filter tabs ─────────────────────
  const countByStatus = (s: string) => annualPlans.filter(p => p.status === s).length;

  const handleSendToSigner = async (selectedItems: AnnualPlan[]) => {
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
    { field: 'sourceDepartmentId', headerName: 'Đơn vị/Phân xưởng', width: 160, editable: false },
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
      <PageAction
        title="Lập kế hoạch sửa chữa bảo dưỡng"
        onNewClick={() => setShowForm(true)}
      />

      <Box sx={{ p: 2 }}>
        {/* 🔧 FIX: Tăng height của flex container */}
        <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 180px)', minHeight: 600, maxHeight: '80vh' }}>

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
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 🔧 FIX: CardContent với flex layout + overflow auto */}
            <CardContent sx={{
              height: '100%',
              p: '0 !important',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}>
              <TableCustom
                title="Danh sách kế hoạch"
                rows={isDetailOpen ? filtered : []}
                columns={isDetailOpen ? columnsCollapsed : columnsFull}
                total={filtered.length}
                isCompact={isDetailOpen}
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
                extraActions={
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    sx={{ display: isDetailOpen ? 'none' : undefined }}
                    disabled={!canSendToSigner}
                    onClick={async () => await handleSendToSigner(selectedPlans)}
                  >
                    Trình duyệt người ký ({selectedPlans.length})
                  </Button>
                }
                customContent={
                  !isDetailOpen ? (
                    <Stack spacing={2} sx={{ py: 1, px: 1, flex: 1, overflow: 'auto' }}>
                      {plansByYear.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          Không có kế hoạch phù hợp.
                        </Typography>
                      ) : (
                        plansByYear.map(([year, plans]) => (
                          <Accordion
                            key={year}
                            expanded={!!expandedYears[year]}
                            onChange={() => toggleYear(year)}
                            disableGutters
                            sx={{ mb: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMore />}
                              sx={{ bgcolor: 'background.paper', minHeight: 56 }}
                            >
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
                                <Typography variant="subtitle1" fontWeight={700}>
                                  {year}
                                </Typography>
                                <Chip label={`${plans.length} kế hoạch`} size="small" />
                                <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
                                  Tổng TB: {plans.reduce((sum, plan) => sum + (plan.deviceIds?.length ?? 0), 0)}
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                              <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                  <TableHead>
                                    <TableRow sx={{ bgcolor: '#1FA463' }}>
                                      <TableCell padding="checkbox" sx={{ color: '#fff' }} />
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Mã kế hoạch</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Mô tả</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Đơn vị/Phân xưởng</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Năm</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Ngày tạo</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }} align="right">Số TB</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Trạng thái</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {plans.map((plan) => (
                                      <TableRow
                                        key={plan.id}
                                        hover
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => setSelectedPlan(plan)}
                                      >
                                        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                          <Checkbox
                                            size="small"
                                            disabled={!isPlanSelectable(plan)}
                                            checked={selectedIds.includes(plan.id)}
                                            onChange={() => handleToggleSelect(plan.id)}
                                          />
                                        </TableCell>
                                        <TableCell>{plan.id}</TableCell>
                                        <TableCell>{plan.description}</TableCell>
                                        <TableCell>{plan.sourceDepartmentId ?? '—'}</TableCell>
                                        <TableCell>{plan.year}</TableCell>
                                        <TableCell>{plan.createdDate}</TableCell>
                                        <TableCell align="right">{plan.deviceIds?.length ?? 0}</TableCell>
                                        <TableCell>{renderStatus(plan.status)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </AccordionDetails>
                          </Accordion>
                        ))
                      )}

                      {showCalendar && (
                        <MaintenancePlanCalendar
                          onClose={() => setShowCalendar(false)}
                          plans={annualPlans as any}
                          onPlanClick={(plan: any) => {
                            setSelectedPlan(plan as AnnualPlan);
                            setShowCalendar(false);
                          }}
                          onCreateRepair={() => navigate(ROUTES.ASSETGROUP)}
                        />
                      )}
                    </Stack>
                  ) : undefined
                }
              />
            </CardContent>
          </Card>

          {/* ── Panel chi tiết — Hiển thị toàn bộ kế hoạch khi detail open ── */}
          {isDetailOpen && selectedPlan && (
            <>

              {/* Panel chi tiết chính */}
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
            </>
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