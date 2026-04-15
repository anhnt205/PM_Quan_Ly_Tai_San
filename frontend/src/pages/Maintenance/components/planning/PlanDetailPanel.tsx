import { useState, useMemo } from 'react';
import {
    Box, Typography, Tabs, Tab, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip, Checkbox,
    Button, IconButton, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { devices } from '../../../../mockdata/mockDevices';
import { departments } from '../../../../mockdata/mockDepartments';
import {
    months as monthLabels,
    maintenanceLevelLabels,
    maintenanceLevelColors,
    type MaintenanceLevel,
} from '../../../../mockdata/mockPlans';
import type { AnnualPlan } from '../../../../mockdata/mockWorkflow';
import type { RepairRequest } from '../../../../mockdata/mockRepairRequests';
import { calculatePlanMaterials } from '../../../../mockdata/mockNorms';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import InspectionRecordDialog from './InspectionRecordDialog';
import type { AcceptanceTestRecord, MaterialQualityRecord, TechnicalInspectionRecord } from '../../../../mockdata/mockInspectionRecords';
import RepairRequestDialog from '../dialog/RepairRequestDialog';
// import AcceptanceTestDialog from './AcceptanceDialog';
// import MaterialQualityDialog from './MaterialQualityDialog';

interface Props {
    plan: AnnualPlan;
    repairRequests: RepairRequest[];
    inspectionRecords: TechnicalInspectionRecord[];       // thêm
    acceptanceTestRecords: AcceptanceTestRecord[];
    materialQualityRecords: MaterialQualityRecord[];
    onCreateMaterialQualityRecord: (record: MaterialQualityRecord) => void;
    onClose: () => void;
    onCreateRepairRequest: (req: RepairRequest) => void;
    onCreateInspectionRecord: (record: TechnicalInspectionRecord) => void;  // thêm
    onCreateAcceptanceRecord: (record: AcceptanceTestRecord) => void;        // thêm
}

const PlanDetailPanel = ({
    plan, repairRequests, inspectionRecords, acceptanceTestRecords, materialQualityRecords,
    onClose, onCreateRepairRequest, onCreateInspectionRecord, onCreateAcceptanceRecord, onCreateMaterialQualityRecord
}: Props) => {
    const [tab, setTab] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
    const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
    const [activeRepairRequest, setActiveRepairRequest] = useState<typeof repairRequests[0] | null>(null);
    const [acceptanceDialogOpen, setAcceptanceDialogOpen] = useState(false);
    const [activeInspectionRecord, setActiveInspectionRecord] = useState<TechnicalInspectionRecord | null>(null);
    const [materialQualityDialogOpen, setMaterialQualityDialogOpen] = useState(false);
    const [activeMaterialAcceptance, setActiveMaterialAcceptance] = useState<AcceptanceTestRecord | null>(null);

    const planRequests = repairRequests.filter(r => r.planId === plan.id);

    const usedDeviceIds = useMemo(() => {
        const ids = new Set<string>();
        planRequests
            .filter(r => r.month === selectedMonth + 1)  // +1 vì selectedMonth là 0-based
            .forEach(r => r.deviceIds.forEach(id => ids.add(id)));
        return ids;
    }, [planRequests, selectedMonth]);

    const schedule: Record<string, MaintenanceLevel[]> = (plan as any).monthlySchedule || {};

    const devicesForMonth = useMemo(() => {
        return plan.deviceIds
            .map(id => devices.find(d => d.id === id))
            .filter(Boolean)
            .filter(d => {
                const row = schedule[d!.id];
                if (!row) return true;
                return row[selectedMonth] && (row[selectedMonth] as string) !== '';
            })
            .map(d => d!);
    }, [plan.deviceIds, schedule, selectedMonth]);

    const availableDevices = devicesForMonth.filter(d => !usedDeviceIds.has(d.id));

    const handleToggle = (deviceId: string) => {
        setSelectedDeviceIds(prev =>
            prev.includes(deviceId) ? prev.filter(id => id !== deviceId) : [...prev, deviceId]
        );
    };

    const handleSelectAll = () => {
        if (selectedDeviceIds.length === availableDevices.length) {
            setSelectedDeviceIds([]);
        } else {
            setSelectedDeviceIds(availableDevices.map(d => d.id));
        }
    };

    const handleOpenDialog = () => setDialogOpen(true);

    const handleCreateRequest = (req: RepairRequest) => {
        onCreateRepairRequest(req);
        setSelectedDeviceIds([]);
        setDialogOpen(false);
    };

    const handleCreateInspection = (record: TechnicalInspectionRecord) => {
        onCreateInspectionRecord(record);   // ← dùng prop thay vì local state
        setInspectionDialogOpen(false);
        setActiveRepairRequest(null);
    };

    const handleCreateAcceptance = (record: AcceptanceTestRecord) => {
        onCreateAcceptanceRecord(record);
        setAcceptanceDialogOpen(false);
        setActiveInspectionRecord(null);
    };

    const handleCreateMaterialQuality = (record: MaterialQualityRecord) => {
        onCreateMaterialQualityRecord(record);
        setMaterialQualityDialogOpen(false);
        setActiveMaterialAcceptance(null);
    };

    const sourceDept = departments.find(d => d.id === (plan as any).sourceDepartmentId);
    const execDept = departments.find(d => d.id === (plan as any).executionDepartmentId);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                    Chi tiết: {plan.id}
                </Typography>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2"><b>Năm:</b> {plan.year}</Typography>
                <Typography variant="body2"><b>Ngày tạo:</b> {plan.createdDate}</Typography>
                {sourceDept && <Typography variant="body2"><b>ĐV quản lý:</b> {sourceDept.name}</Typography>}
                {execDept && <Typography variant="body2"><b>ĐV thực hiện:</b> {execDept.name}</Typography>}
                <Chip
                    label={plan.status === 'da-duyet' ? 'Đã duyệt' : plan.status === 'cho-duyet' ? 'Chờ duyệt' : plan.status === 'tu-choi' ? 'Từ chối' : 'Bản nháp'}
                    color={plan.status === 'da-duyet' ? 'success' : plan.status === 'cho-duyet' ? 'warning' : plan.status === 'tu-choi' ? 'error' : 'default'}
                    size="small"
                />
            </Box>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Xem theo thiết bị" />
                <Tab label="Xem theo biên bản" />
            </Tabs>

            {tab === 0 && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {plan.status === 'da-duyet' && (
                        <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2, alignItems: 'center' }}>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Tháng SCBD</InputLabel>
                                <Select
                                    value={selectedMonth}
                                    label="Tháng SCBD"
                                    onChange={(e) => {
                                        setSelectedMonth(e.target.value as number);
                                        setSelectedDeviceIds([]);
                                    }}
                                >
                                    {monthLabels.map((m, idx) => (
                                        <MenuItem key={idx} value={idx}>{m}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                startIcon={<PostAddIcon />}
                                disabled={selectedDeviceIds.length === 0}
                                onClick={handleOpenDialog}
                                size="small"
                            >
                                Tạo Giấy đề nghị SC ({selectedDeviceIds.length})
                            </Button>
                        </Box>
                    )}

                    <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {plan.status === 'da-duyet' && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={selectedDeviceIds.length > 0 && selectedDeviceIds.length < availableDevices.length}
                                                checked={availableDevices.length > 0 && selectedDeviceIds.length === availableDevices.length}
                                                onChange={handleSelectAll}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Mã TB</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Tên TB</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Nhóm</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Cấp BD tháng {selectedMonth + 1}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>SL</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {devicesForMonth.map((device, idx) => {
                                    const level = schedule[device.id]?.[selectedMonth] || '';
                                    const isUsed = usedDeviceIds.has(device.id);
                                    return (
                                        <TableRow key={device.id} sx={{ bgcolor: isUsed ? '#f5f5f5' : undefined }}>
                                            {plan.status === 'da-duyet' && (
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedDeviceIds.includes(device.id)}
                                                        onChange={() => handleToggle(device.id)}
                                                        disabled={isUsed}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>{device.id}</TableCell>
                                            <TableCell>{device.name}</TableCell>
                                            <TableCell>{device.group}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={maintenanceLevelLabels[level as MaintenanceLevel] || 'Không'}
                                                    size="small"
                                                    sx={{ bgcolor: maintenanceLevelColors[level as MaintenanceLevel] || 'transparent' }}
                                                />
                                            </TableCell>
                                            <TableCell>{device.quantity}</TableCell>
                                            <TableCell>
                                                {isUsed ? (
                                                    <Chip label="Đã lập lệnh" size="small" color="info" />
                                                ) : (
                                                    <Chip label="Chưa lập" size="small" variant="outlined" />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {devicesForMonth.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                            Không có thiết bị cần SCBD trong tháng {selectedMonth + 1}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {tab === 1 && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Danh sách Giấy đề nghị sửa chữa
                    </Typography>
                    {planRequests.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                            Chưa có giấy đề nghị nào được tạo từ kế hoạch này
                        </Typography>
                    ) : (
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell width={40} />
                                        <TableCell sx={{ fontWeight: 700 }}>Số</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Tháng/Năm</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Số TB</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Ngày tạo</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Trạng thái GĐN</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>BB Giám định</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {planRequests.map(req => {
                                        const isExpanded = expandedRequestId === req.id;
                                        const relatedInspections = inspectionRecords.filter(r => r.repairRequestId === req.id);
                                        const canCreateInspection = req.status === 'da-duyet' && relatedInspections.length === 0;

                                        return (
                                            <>
                                                <TableRow
                                                    key={req.id}
                                                    hover
                                                    sx={{ cursor: 'pointer', bgcolor: isExpanded ? 'action.selected' : undefined }}
                                                    onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <IconButton size="small">
                                                            {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 500 }}>{req.number || req.id}</TableCell>
                                                    <TableCell>{req.month}/{req.year}</TableCell>
                                                    <TableCell>{req.deviceIds.length}</TableCell>
                                                    <TableCell>{req.createdDate}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={req.status === 'cho-duyet' ? 'Chờ duyệt' : req.status === 'da-duyet' ? 'Đã duyệt' : 'Bản nháp'}
                                                            color={req.status === 'cho-duyet' ? 'warning' : req.status === 'da-duyet' ? 'success' : 'default'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {relatedInspections.length > 0 ? (
                                                            <Chip
                                                                icon={<AssignmentIcon sx={{ fontSize: 14 }} />}
                                                                label={relatedInspections[0].status === 'cho-duyet' ? 'Chờ duyệt' : 'Đã duyệt'}
                                                                color={relatedInspections[0].status === 'cho-duyet' ? 'warning' : 'success'}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        ) : canCreateInspection ? (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="primary"
                                                                startIcon={<AddCircleOutlineIcon sx={{ fontSize: 14 }} />}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveRepairRequest(req);
                                                                    setInspectionDialogOpen(true);
                                                                }}
                                                                sx={{ fontSize: '0.75rem', py: 0.25 }}
                                                            >
                                                                Tạo BB giám định
                                                            </Button>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">
                                                                {req.status !== 'da-duyet' ? 'Chờ GĐN duyệt' : '—'}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                                {/* Expanded: chi tiết BB giám định */}
                                                {isExpanded && (
                                                    <TableRow key={`${req.id}-detail`}>
                                                        <TableCell colSpan={7} sx={{ py: 0, bgcolor: 'action.hover' }}>
                                                            <Box sx={{ px: 3, py: 1.5 }}>
                                                                {relatedInspections.length === 0 ? (
                                                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                                        {req.status === 'da-duyet'
                                                                            ? 'Chưa có biên bản giám định. Nhấn "Tạo BB giám định" để tạo mới.'
                                                                            : 'Giấy đề nghị chưa được duyệt. Biên bản giám định sẽ có thể tạo sau khi GĐN được duyệt.'}
                                                                    </Typography>
                                                                ) : (
                                                                    relatedInspections.map(record => (
                                                                        <Box key={record.id} sx={{ mb: 1 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                                                <AssignmentIcon fontSize="small" color="primary" />
                                                                                <Typography variant="body2" fontWeight={600}>{record.number}</Typography>
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    Ngày: {record.inspectionDate}
                                                                                </Typography>
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    Tại: {record.location}
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={record.status === 'cho-duyet' ? 'Chờ duyệt' : record.status === 'dang-ky' ? 'Đang ký' : 'Đã duyệt'}
                                                                                    color={record.status === 'cho-duyet' ? 'warning' : record.status === 'dang-ky' ? 'info' : 'success'}
                                                                                    size="small"
                                                                                />
                                                                            </Box>

                                                                            {/* Thành phần ký */}
                                                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: 3.5 }}>
                                                                                {record.signers.map(signer => (
                                                                                    <Chip
                                                                                        key={signer.order}
                                                                                        label={`${signer.order}. ${signer.name || '?'} (${signer.title})`}
                                                                                        size="small"
                                                                                        variant={signer.signed ? 'filled' : 'outlined'}
                                                                                        color={signer.signed ? 'success' : 'default'}
                                                                                    />
                                                                                ))}
                                                                            </Box>

                                                                            {/* Thiết bị */}
                                                                            <Table size="small" sx={{ mt: 1, ml: 3.5 }}>
                                                                                <TableHead>
                                                                                    <TableRow>
                                                                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Thiết bị</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Tình trạng KT</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Biện pháp</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {record.deviceEntries.map((entry, i) => (
                                                                                        <TableRow key={i}>
                                                                                            <TableCell sx={{ fontSize: '0.75rem' }}>{entry.deviceName}</TableCell>
                                                                                            <TableCell sx={{ fontSize: '0.75rem' }}>{entry.technicalCondition}</TableCell>
                                                                                            <TableCell sx={{ fontSize: '0.75rem' }}>
                                                                                                {entry.actionRepair && <Chip label="S.chữa" size="small" sx={{ mr: 0.5, bgcolor: '#fff3e0' }} />}
                                                                                                {entry.actionReplace && <Chip label="Thay mới" size="small" sx={{ bgcolor: '#fce4ec' }} />}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                            <Box sx={{ mt: 1.5, ml: 3.5 }}>
                                                                                {(() => {
                                                                                    const relatedAcceptance = acceptanceTestRecords.filter(
                                                                                        a => a.inspectionRecordId === record.id
                                                                                    );
                                                                                    const canCreateAcceptance = record.status === 'da-duyet' && relatedAcceptance.length === 0;
                                                                                    return (
                                                                                        <Box sx={{
                                                                                            p: 1, border: '1px dashed',
                                                                                            borderColor: relatedAcceptance.length > 0 ? 'success.light' : 'divider',
                                                                                            borderRadius: 1,
                                                                                        }}>
                                                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                                                                    BB Nghiệm thu chạy thử
                                                                                                </Typography>
                                                                                                {relatedAcceptance.length > 0 ? (
                                                                                                    <Chip
                                                                                                        label={relatedAcceptance[0].status === 'cho-duyet' ? 'Chờ duyệt' : 'Đã duyệt'}
                                                                                                        color={relatedAcceptance[0].status === 'cho-duyet' ? 'warning' : 'success'}
                                                                                                        size="small"
                                                                                                    />
                                                                                                ) : canCreateAcceptance ? (
                                                                                                    <Button
                                                                                                        size="small" variant="outlined" color="success"
                                                                                                        startIcon={<AddCircleOutlineIcon sx={{ fontSize: 14 }} />}
                                                                                                        onClick={(e) => {
                                                                                                            e.stopPropagation();
                                                                                                            setActiveInspectionRecord(record);
                                                                                                            setAcceptanceDialogOpen(true);
                                                                                                        }}
                                                                                                        sx={{ fontSize: '0.72rem', py: 0.25 }}
                                                                                                    >
                                                                                                        Tạo BB nghiệm thu
                                                                                                    </Button>
                                                                                                ) : (
                                                                                                    <Typography variant="caption" color="text.disabled">
                                                                                                        Chờ BB giám định duyệt
                                                                                                    </Typography>
                                                                                                )}
                                                                                            </Box>
                                                                                            {relatedAcceptance.length > 0 && (
                                                                                                <Box sx={{ mt: 0.5 }}>
                                                                                                    <Typography variant="caption" color="text.secondary">
                                                                                                        {relatedAcceptance[0].number} — Ngày: {relatedAcceptance[0].date}
                                                                                                    </Typography>
                                                                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                                                                                        {relatedAcceptance[0].signers.map(s => (
                                                                                                            <Chip
                                                                                                                key={s.order}
                                                                                                                label={`${s.order}. ${s.name || '?'} (${s.title})`}
                                                                                                                size="small"
                                                                                                                variant={s.signed ? 'filled' : 'outlined'}
                                                                                                                color={s.signed ? 'success' : 'default'}
                                                                                                            />
                                                                                                        ))}
                                                                                                        <Box sx={{
                                                                                                            mt: 1, p: 1, border: '1px dashed',
                                                                                                            borderColor: materialQualityRecords.filter(m => m.acceptanceRecordId === relatedAcceptance[0].id).length > 0
                                                                                                                ? 'warning.light' : 'divider',
                                                                                                            borderRadius: 1,
                                                                                                        }}>
                                                                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                                                                                    BB Đánh giá VT thu hồi
                                                                                                                    <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>
                                                                                                                        (tùy chọn)
                                                                                                                    </Typography>
                                                                                                                </Typography>
                                                                                                                {(() => {
                                                                                                                    const relatedMQ = materialQualityRecords.filter(
                                                                                                                        m => m.acceptanceRecordId === relatedAcceptance[0].id
                                                                                                                    );
                                                                                                                    const canCreate = relatedAcceptance[0].status === 'da-duyet' && relatedMQ.length === 0;
                                                                                                                    if (relatedMQ.length > 0) return (
                                                                                                                        <Chip
                                                                                                                            label={relatedMQ[0].status === 'cho-duyet' ? 'Chờ duyệt' : 'Đã duyệt'}
                                                                                                                            color={relatedMQ[0].status === 'cho-duyet' ? 'warning' : 'success'}
                                                                                                                            size="small"
                                                                                                                        />
                                                                                                                    );
                                                                                                                    if (canCreate) return (
                                                                                                                        <Button
                                                                                                                            size="small" variant="outlined" color="warning"
                                                                                                                            startIcon={<AddCircleOutlineIcon sx={{ fontSize: 14 }} />}
                                                                                                                            onClick={(e) => {
                                                                                                                                e.stopPropagation();
                                                                                                                                setActiveMaterialAcceptance(relatedAcceptance[0]);
                                                                                                                                setMaterialQualityDialogOpen(true);
                                                                                                                            }}
                                                                                                                            sx={{ fontSize: '0.72rem', py: 0.25 }}
                                                                                                                        >
                                                                                                                            Tạo BB đánh giá VT
                                                                                                                        </Button>
                                                                                                                    );
                                                                                                                    return (
                                                                                                                        <Typography variant="caption" color="text.disabled">
                                                                                                                            Chờ BB nghiệm thu duyệt
                                                                                                                        </Typography>
                                                                                                                    );
                                                                                                                })()}
                                                                                                            </Box>
                                                                                                        </Box>
                                                                                                    </Box>
                                                                                                </Box>
                                                                                            )}
                                                                                        </Box>
                                                                                    );
                                                                                })()}
                                                                            </Box>
                                                                        </Box>
                                                                    ))
                                                                )}
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Dialog tạo BB giám định */}
                    {/* {activeRepairRequest && (
            <InspectionRecordDialog
              open={inspectionDialogOpen}
              onClose={() => { setInspectionDialogOpen(false); setActiveRepairRequest(null); }}
              plan={plan}
              repairRequest={activeRepairRequest}
              onSubmit={handleCreateInspection}
            />
          )} */}

                    {/* {activeInspectionRecord && (
            <AcceptanceTestDialog
              open={acceptanceDialogOpen}
              onClose={() => { setAcceptanceDialogOpen(false); setActiveInspectionRecord(null); }}
              plan={plan}
              repairRequest={planRequests.find(r => r.id === activeInspectionRecord.repairRequestId)!}
              inspectionRecord={activeInspectionRecord}
              onSubmit={handleCreateAcceptance}
            />
          )} */}

                    {/* {activeMaterialAcceptance && (
            <MaterialQualityDialog
              open={materialQualityDialogOpen}
              onClose={() => { setMaterialQualityDialogOpen(false); setActiveMaterialAcceptance(null); }}
              plan={plan}
              repairRequest={planRequests.find(r => r.id === activeMaterialAcceptance.repairRequestId)!}
              acceptanceRecord={activeMaterialAcceptance}
              onSubmit={handleCreateMaterialQuality}
            />
          )} */}
                </Box>
            )}

            <RepairRequestDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                plan={plan}
                selectedDeviceIds={selectedDeviceIds}
                selectedMonth={selectedMonth}
                onSubmit={handleCreateRequest}
            />
        </Box>
    );
};

export default PlanDetailPanel;
