import React, { useMemo, useState, useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Collapse,
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
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

import { useCmms } from '../../hooks/CmmsContext';
import IncidentDialog from '../Maintenance/components/dialog/IncidentDialog';

import type { AnnualPlan } from '../../mockdata/mockWorkflow';
import CreatePlanDialog from '../Maintenance/components/planning/CreatePlan';
import PlanDetailPanel from '../Maintenance/components/planning/PlanDetailPanel';
import IncidentDetailPanel from '../Maintenance/components/planning/IncidentDetailPanel';
import { calculatePlanMaterials } from '../../mockdata/mockNorms';
import { initialIncidentInspectionRecords } from '../../mockdata/mockIncidentInspection';
import { extendedIncidentReports } from '../../mockdata/mockIncidentReports';
import type { IncidentReport } from '../../mockdata/mockIncidentReports';
import MaintenancePlanCalendar from './components/MaintenancePlanCalendar';
import { FilterOption } from '../../components/common/FilterStatusGroup';
import PageAction from '../../components/common/PageAction';
import TableCustom from '../../components/common/TableCustom';

// ── Status config ──────────────────────────────────────────
const planStatusConfig: Record<string, {
  label: string;
  color: 'default' | 'warning' | 'success' | 'error';
}> = {
  'draft': { label: 'Bản nháp', color: 'default' },
  'cho-duyet': { label: 'Chờ duyệt', color: 'warning' },
  'da-duyet': { label: 'Đã duyệt', color: 'success' },
  'tu-choi': { label: 'Từ chối', color: 'error' },
};

const incidentStatusConfig: Record<string, {
  label: string;
  color: 'default' | 'warning' | 'success' | 'error' | 'info';
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

const renderIncidentStatus = (status: string) => {
  const cfg = incidentStatusConfig[status] ?? incidentStatusConfig['cho-duyet'];
  return <Chip label={cfg.label} color={cfg.color} size="small" />;
};

export default function MaintenancePlanRepair() {
  const navigate = useNavigate();

  // ── View state ──────────────────────────────────────────
  // selectedPlan + selectedIncident determine what's shown in the right panel:
  //   null, null        → nothing open
  //   plan, null        → PlanDetailPanel
  //   plan, incident    → IncidentDetailPanel
  const [selectedPlan, setSelectedPlan] = useState<AnnualPlan | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({});
  // Track which plan rows have their incident sub-table open
  const [expandedIncidentPlanIds, setExpandedIncidentPlanIds] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [incidentInspectionRecords, setIncidentInspectionRecords] = useState(
    initialIncidentInspectionRecords
  );

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
    incidentReports,
    addIncidentReport,
  } = useCmms();

  useEffect(() => {
    console.log('📋 [CMMS Context Data]', {
      totalPlans: annualPlans.length,
      years: Array.from(new Set(annualPlans.map(p => p.year))).sort((a, b) => b - a),
    });
  }, [annualPlans]);

  // ── Merge static + context incident reports ───────────────
  const allIncidentReports = useMemo<IncidentReport[]>(() => {
    const extended = extendedIncidentReports as IncidentReport[];
    const fromContext = (incidentReports as IncidentReport[]) || [];
    return [
      ...extended,
      ...fromContext.filter(r => !extended.some(e => e.id === r.id)),
    ];
  }, [incidentReports]);

  // ── Helper: get incidents for a plan ─────────────────────
  const getIncidentsForPlan = (planId: string): IncidentReport[] =>
    allIncidentReports.filter(inc => inc.planIds?.includes(planId));

  const selectedSchedule: Record<string, any> = (selectedPlan as any)?.monthlySchedule ?? {};
  const yearlyMaterials = useMemo(
    () => selectedPlan ? calculatePlanMaterials(selectedSchedule) : [],
    [selectedPlan, selectedSchedule]
  );

  // ── Client-side filtering ─────────────────────────────────
  const filtered = useMemo(() => {
    if (!annualPlans || annualPlans.length === 0) return [];
    return annualPlans.filter(p => {
      const matchSearch = !searchValue
        || p.id.toLowerCase().includes(searchValue.toLowerCase())
        || p.description.toLowerCase().includes(searchValue.toLowerCase());
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [annualPlans, searchValue, statusFilter]);

  const plansByYear = useMemo(() => {
    const groups = filtered.reduce((acc, plan) => {
      const list = acc.get(plan.year) ?? [];
      list.push(plan);
      acc.set(plan.year, list);
      return acc;
    }, new Map<number, AnnualPlan[]>());
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  // ── Toggle helpers ────────────────────────────────────────
  const toggleYear = (year: number) =>
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));

  const toggleIncidentExpand = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIncidentPlanIds(prev => {
      const next = new Set(prev);
      next.has(planId) ? next.delete(planId) : next.add(planId);
      return next;
    });
  };

  const handleToggleSelect = (planId: string) => {
    setSelectedIds(prev =>
      prev.includes(planId) ? prev.filter(id => id !== planId) : [...prev, planId]
    );
  };

  // ── Row click handlers ────────────────────────────────────
  const handlePlanRowClick = (plan: AnnualPlan) => {
    // If clicking the same plan that's already showing an incident, keep incident open
    // but if we click a different plan, reset incident selection
    if (selectedPlan?.id !== plan.id) {
      setSelectedIncident(null);
    }
    setSelectedPlan(plan);
  };

  const handleIncidentRowClick = (plan: AnnualPlan, incident: IncidentReport, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlan(plan);
    setSelectedIncident(incident);
  };

  const handleCloseDetail = () => {
    setSelectedPlan(null);
    setSelectedIncident(null);
  };

  const handleCloseIncident = () => {
    // Go back to PlanDetailPanel
    setSelectedIncident(null);
  };

  // ── Selection helpers ─────────────────────────────────────
  const selectedPlans = annualPlans.filter(plan => selectedIds.includes(plan.id));
  const canSendToSigner = selectedPlans.length > 0 && selectedPlans.every(p => p.status === 'draft');
  const canCreateIncident = selectedPlans.length > 0;

  const [showIncidentDialog, setShowIncidentDialog] = useState(false);

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

  // ── Detail panel is open when a plan (or incident) is selected ───
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

  // ── Severity color helper ─────────────────────────────────
  const severityColor: Record<string, string> = {
    'Nhẹ': '#4caf50',
    'Trung bình': '#ff9800',
    'Nặng': '#f44336',
    'Nghiêm trọng': '#9c27b0',
  };

  return (
    <>
      <PageAction
        title="Lập kế hoạch sửa chữa bảo dưỡng"
        onNewClick={() => setShowForm(true)}
      />

      <Box sx={{ p: 2 }}>
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
                onRowClick={(params) => handlePlanRowClick(params.row as AnnualPlan)}
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
                  <>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      sx={{ display: isDetailOpen ? 'none' : undefined }}
                      disabled={!canCreateIncident}
                      onClick={() => setShowIncidentDialog(true)}
                    >
                      Tạo phiếu báo sự cố ({selectedPlans.length})
                    </Button>

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
                  </>
                }
                customContent={
                  !isDetailOpen ? (
                    <Stack spacing={2} sx={{ py: 1, px: 1, flex: 1, overflow: 'auto' }}>
                      {plansByYear.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          Không có kế hoạch phù hợp.
                        </Typography>
                      ) : (
                        plansByYear.map(([year, plans]: [number, AnnualPlan[]]) => (
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
                                  Tổng TB: {plans.reduce((sum, p) => sum + (p.deviceIds?.length ?? 0), 0)}
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                              <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                  <TableHead>
                                    <TableRow sx={{ bgcolor: '#1FA463' }}>
                                      {/* expand incident column */}
                                      <TableCell padding="checkbox" sx={{ color: '#fff', width: 40 }} />
                                      <TableCell padding="checkbox" sx={{ color: '#fff' }} />
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Mã kế hoạch</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Mô tả</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Đơn vị/Phân xưởng</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Năm</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Ngày tạo</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }} align="right">Số TB</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Sự cố</TableCell>
                                      <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Trạng thái</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {plans.map((plan: AnnualPlan) => {
                                      const planIncidents = getIncidentsForPlan(plan.id);
                                      const isIncidentOpen = expandedIncidentPlanIds.has(plan.id);
                                      const selectedPlanId: string | undefined = (selectedPlan as AnnualPlan | null)?.id;
                                      const isSelected = selectedPlanId === plan.id && !selectedIncident;

                                      return (
                                        <React.Fragment key={plan.id}>
                                          {/* ── Plan row ── */}
                                          <TableRow
                                            hover
                                            selected={isSelected}
                                            sx={{
                                              cursor: 'pointer',
                                              bgcolor: isSelected ? 'action.selected' : undefined,
                                            }}
                                            onClick={() => handlePlanRowClick(plan)}
                                          >
                                            {/* Incident expand button */}
                                            <TableCell
                                              padding="checkbox"
                                              onClick={(e) => planIncidents.length > 0 && toggleIncidentExpand(plan.id, e)}
                                              sx={{ width: 40 }}
                                            >
                                              {planIncidents.length > 0 && (
                                                <Tooltip title={isIncidentOpen ? 'Ẩn sự cố' : `${planIncidents.length} sự cố`}>
                                                  <IconButton size="small">
                                                    {isIncidentOpen
                                                      ? <KeyboardArrowUpIcon fontSize="small" />
                                                      : <KeyboardArrowDownIcon fontSize="small" />}
                                                  </IconButton>
                                                </Tooltip>
                                              )}
                                            </TableCell>

                                            {/* Checkbox */}
                                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                              <Checkbox
                                                size="small"
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
                                            <TableCell>
                                              {planIncidents.length > 0
                                                ? <Chip
                                                    icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
                                                    label={planIncidents.length}
                                                    size="small"
                                                    color="warning"
                                                    variant="outlined"
                                                  />
                                                : <Typography variant="caption" color="text.disabled">—</Typography>
                                              }
                                            </TableCell>
                                            <TableCell>{renderStatus(plan.status)}</TableCell>
                                          </TableRow>

                                          {/* ── Incident sub-rows (dropdown) ── */}
                                          {planIncidents.length > 0 && (
                                            <TableRow>
                                              <TableCell colSpan={10} sx={{ p: 0, border: 0 }}>
                                                <Collapse in={isIncidentOpen} timeout="auto" unmountOnExit>
                                                  <Box sx={{ bgcolor: '#fffde7', borderBottom: '1px solid', borderColor: 'divider' }}>
                                                    <Table size="small">
                                                      <TableHead>
                                                        <TableRow sx={{ bgcolor: '#f9a825' }}>
                                                          <TableCell sx={{ pl: 6, fontWeight: 700, color: '#fff', fontSize: 12 }}>
                                                            Số phiếu
                                                          </TableCell>
                                                          <TableCell sx={{ fontWeight: 700, color: '#fff', fontSize: 12 }}>
                                                            Ngày phát hiện
                                                          </TableCell>
                                                          <TableCell sx={{ fontWeight: 700, color: '#fff', fontSize: 12 }}>
                                                            Hệ thống
                                                          </TableCell>
                                                          <TableCell sx={{ fontWeight: 700, color: '#fff', fontSize: 12 }}>
                                                            Mức độ
                                                          </TableCell>
                                                          <TableCell sx={{ fontWeight: 700, color: '#fff', fontSize: 12 }}>
                                                            Trạng thái
                                                          </TableCell>
                                                        </TableRow>
                                                      </TableHead>
                                                      <TableBody>
                                                        {planIncidents.map((incident) => {
                                                          const isIncidentSelected =
                                                            selectedIncident?.id === incident.id;
                                                          return (
                                                            <TableRow
                                                              key={incident.id}
                                                              hover
                                                              selected={isIncidentSelected}
                                                              sx={{
                                                                cursor: 'pointer',
                                                                bgcolor: isIncidentSelected
                                                                  ? 'rgba(249,168,37,0.15)'
                                                                  : undefined,
                                                                '&:hover': {
                                                                  bgcolor: 'rgba(249,168,37,0.08)',
                                                                },
                                                              }}
                                                              onClick={(e) =>
                                                                handleIncidentRowClick(plan, incident, e)
                                                              }
                                                            >
                                                              <TableCell sx={{ pl: 6 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                  <WarningAmberIcon
                                                                    sx={{ fontSize: 14, color: '#f9a825' }}
                                                                  />
                                                                  <Typography variant="body2" fontWeight={500}>
                                                                    {incident.number}
                                                                  </Typography>
                                                                </Box>
                                                              </TableCell>
                                                              <TableCell>
                                                                <Typography variant="body2">
                                                                  {incident.detectedAt}
                                                                </Typography>
                                                              </TableCell>
                                                              <TableCell>
                                                                <Typography variant="body2">
                                                                  {incident.systemName}
                                                                </Typography>
                                                              </TableCell>
                                                              <TableCell>
                                                                {incident.severity ? (
                                                                  <Chip
                                                                    label={incident.severity}
                                                                    size="small"
                                                                    sx={{
                                                                      bgcolor: severityColor[incident.severity] || '#bdbdbd',
                                                                      color: '#fff',
                                                                      fontSize: 11,
                                                                    }}
                                                                  />
                                                                ) : '—'}
                                                              </TableCell>
                                                              <TableCell>
                                                                {renderIncidentStatus(incident.status ?? 'cho-duyet')}
                                                              </TableCell>
                                                            </TableRow>
                                                          );
                                                        })}
                                                      </TableBody>
                                                    </Table>
                                                  </Box>
                                                </Collapse>
                                              </TableCell>
                                            </TableRow>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
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
                            setSelectedIncident(null);
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

          {/* ── Panel chi tiết ── */}
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
              {selectedIncident ? (
                /* ── IncidentDetailPanel khi đã chọn sự cố ── */
                <IncidentDetailPanel
                  incident={selectedIncident}
                  plan={selectedPlan}
                  inspectionRecords={inspectionRecords}
                  acceptanceTestRecords={acceptanceTestRecords}
                  materialQualityRecords={materialQualityRecords}
                  incidentInspectionRecords={incidentInspectionRecords}
                  onClose={handleCloseIncident}
                  onCreateIncidentInspectionRecord={(record) =>
                    setIncidentInspectionRecords(prev => [...prev, record])
                  }
                  onCreateInspectionRecord={addInspectionRecord}
                  onCreateAcceptanceRecord={addAcceptanceTestRecord}
                  onCreateMaterialQualityRecord={addMaterialQualityRecord}
                />
              ) : (
                /* ── PlanDetailPanel khi chỉ chọn kế hoạch ── */
                <PlanDetailPanel
                  plan={selectedPlan}
                  repairRequests={repairRequests}
                  inspectionRecords={inspectionRecords}
                  acceptanceTestRecords={acceptanceTestRecords}
                  materialQualityRecords={materialQualityRecords}
                  onClose={handleCloseDetail}
                  onCreateRepairRequest={addRepairRequest}
                  onCreateInspectionRecord={addInspectionRecord}
                  onCreateAcceptanceRecord={addAcceptanceTestRecord}
                  onCreateMaterialQualityRecord={addMaterialQualityRecord}
                />
              )}
            </Paper>
          )}
        </Box>
      </Box>

      {/* Yearly materials summary */}
      {selectedPlan && !selectedIncident && yearlyMaterials.length > 0 && (
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
      <IncidentDialog
        open={showIncidentDialog}
        onClose={() => setShowIncidentDialog(false)}
        selectedPlans={selectedPlans}
        onSubmit={(rec) => {
          addIncidentReport(rec);
          setShowIncidentDialog(false);
          setSelectedIds([]);
        }}
      />
    </>
  );
}