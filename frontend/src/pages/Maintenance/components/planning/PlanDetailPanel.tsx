import React, { useState, useMemo } from 'react';
import {
    Box, Typography, Tabs, Tab, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip, Checkbox,
    Button, IconButton, Select, MenuItem, FormControl, InputLabel,
    Collapse, Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
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
import type {
    AcceptanceTestRecord,
    MaterialQualityRecord,
    TechnicalInspectionRecord,
} from '../../../../mockdata/mockInspectionRecords';
import RepairRequestDialog from '../dialog/RepairRequestDialog';

interface Props {
    plan: AnnualPlan;
    repairRequests: RepairRequest[];
    inspectionRecords: TechnicalInspectionRecord[];
    acceptanceTestRecords: AcceptanceTestRecord[];
    materialQualityRecords: MaterialQualityRecord[];
    onClose: () => void;
    onCreateRepairRequest: (req: RepairRequest) => void;
    onCreateInspectionRecord: (record: TechnicalInspectionRecord) => void;
    onCreateAcceptanceRecord: (record: AcceptanceTestRecord) => void;
    onCreateMaterialQualityRecord: (record: MaterialQualityRecord) => void;
}

// ── Helpers ───────────────────────────────────────────────
const StatusChip = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; color: any }> = {
        draft: { label: 'Bản nháp', color: 'default' },
        'cho-duyet': { label: 'Chờ duyệt', color: 'warning' },
        'da-duyet': { label: 'Đã duyệt', color: 'success' },
        'tu-choi': { label: 'Từ chối', color: 'error' },
        'dang-ky': { label: 'Đang ký', color: 'info' },
    };
    const cfg = map[status] ?? { label: status, color: 'default' };
    return <Chip label={cfg.label} color={cfg.color} size="small" />;
};
const ROW_H = 36;
const CONNECTOR_WIDTH = 16;
const MAX_DEPTH = 4;
const INDENT_SPACE = CONNECTOR_WIDTH * MAX_DEPTH;
// ── Tree connector component ──────────────────────────────
// Vẽ đường dọc (nếu không phải node cuối) + đường ngang vào node
interface TreeConnectorProps {
    depth: number;       // 1 = cấp 1 (GĐN), 2 = BB GĐ, 3 = BB NT, 4 = BB VT
    isLast: boolean;     // node cuối trong nhóm → không cần đường dọc tiếp
    rowHeight?: number;  // chiều cao row, default 36
}


const TreeConnector = ({ depth, isLast, rowHeight = 36 }: TreeConnectorProps) => {
    // Màu đường nối theo cấp
    const lineColor = ['#90caf9', '#a5d6a7', '#ffcc80', '#ce93d8'][depth - 1] ?? '#bdbdbd';

    return (
        <Box sx={{ display: 'flex', alignItems: 'stretch', height: rowHeight, flexShrink: 0 }}>
            {/* Các đường dọc của cấp cha (chỉ là spacer có đường) */}
            {Array.from({ length: depth - 1 }).map((_, i) => (
                <Box
                    key={i}
                    sx={{
                        width: CONNECTOR_WIDTH,
                        flexShrink: 0,
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: CONNECTOR_WIDTH / 2 - 0.75,
                            top: 0,
                            bottom: 0,
                            width: 1.5,
                            bgcolor: lineColor,
                            opacity: 0.5,
                        },
                    }}
                />
            ))}
            {/* Đường nối của cấp hiện tại: dọc (½ chiều cao xuống) + ngang sang phải */}
            <Box sx={{ width: CONNECTOR_WIDTH, flexShrink: 0, position: 'relative' }}>
                {/* Đường dọc — từ trên xuống giữa (hoặc hết nếu không phải last) */}
                <Box sx={{
                    position: 'absolute',
                    left: CONNECTOR_WIDTH / 2 - 0.75,
                    top: 0,
                    height: isLast ? '50%' : '100%',
                    width: 1.5,
                    bgcolor: lineColor,
                }} />
                {/* Đường ngang */}
                <Box sx={{
                    position: 'absolute',
                    left: CONNECTOR_WIDTH / 2 - 0.75,
                    top: '50%',
                    width: CONNECTOR_WIDTH / 2 + 0.75,
                    height: 1.5,
                    bgcolor: lineColor,
                    transform: 'translateY(-50%)',
                }} />
            </Box>
        </Box>
    );
};

// ── ActionCell: nút Xem + Tạo (icon only) ────────────────
interface ActionCellProps {
    onView?: () => void;
    onAdd?: () => void;
    addTooltip?: string;
    addColor?: 'primary' | 'success' | 'warning' | 'secondary';
}

const ActionCell = ({ onView, onAdd, addTooltip = 'Tạo biên bản', addColor = 'primary' }: ActionCellProps) => (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', alignItems: 'center' }}>
        {onView && (
            <Tooltip title="Xem chi tiết" placement="top">
                <IconButton size="small" onClick={e => { e.stopPropagation(); onView(); }}>
                    <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Tooltip>
        )}
        {onAdd && (
            <Tooltip title={addTooltip} placement="top">
                <IconButton
                    size="small"
                    color={addColor}
                    onClick={e => { e.stopPropagation(); onAdd(); }}
                >
                    <AddCircleOutlineIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Tooltip>
        )}
    </Box>
);

// ── Component chính ───────────────────────────────────────
const PlanDetailPanel = ({
    plan, repairRequests, inspectionRecords, acceptanceTestRecords,
    materialQualityRecords, onClose, onCreateRepairRequest,
    onCreateInspectionRecord, onCreateAcceptanceRecord, onCreateMaterialQualityRecord,
}: Props) => {
    const [tab, setTab] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
    const [repairDialogOpen, setRepairDialogOpen] = useState(false);

    const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());
    const [expandedInspections, setExpandedInspections] = useState<Set<string>>(new Set());
    const [expandedAcceptances, setExpandedAcceptances] = useState<Set<string>>(new Set());

    const [inspectionParentReqId, setInspectionParentReqId] = useState<string | null>(null);
    const [acceptanceParentInspId, setAcceptanceParentInspId] = useState<string | null>(null);
    const [materialParentAccId, setMaterialParentAccId] = useState<string | null>(null);

    const schedule: Record<string, MaintenanceLevel[]> = (plan as any).monthlySchedule ?? {};
    const planRequests = repairRequests.filter(r => r.planId === plan.id);

    // ── Tab 0 helpers ─────────────────────────────────────
    const usedDeviceIds = useMemo(() => {
        const ids = new Set<string>();
        planRequests
            .filter(r => r.month === selectedMonth + 1)
            .forEach(r => r.deviceIds.forEach(id => ids.add(id)));
        return ids;
    }, [planRequests, selectedMonth]);

    const devicesForMonth = useMemo(() => {
        return plan.deviceIds
            .map(id => devices.find(d => d.id === id))
            .filter(Boolean)
            .filter(d => { const row = schedule[d!.id]; return !row || !!row[selectedMonth]; })
            .map(d => d!);
    }, [plan.deviceIds, schedule, selectedMonth]);

    const availableDevices = devicesForMonth.filter(d => !usedDeviceIds.has(d.id));

    const handleToggle = (id: string) =>
        setSelectedDeviceIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleSelectAll = () =>
        setSelectedDeviceIds(
            selectedDeviceIds.length === availableDevices.length ? [] : availableDevices.map(d => d.id)
        );

    const toggle = (set: Set<string>, id: string, setter: (s: Set<string>) => void) => {
        const next = new Set(set);
        next.has(id) ? next.delete(id) : next.add(id);
        setter(next);
    };

    const sourceDept = departments.find(d => d.id === (plan as any).sourceDepartmentId);
    const execDept = departments.find(d => d.id === (plan as any).executionDepartmentId);

    const canCreateInspectionForReq = (req: RepairRequest) =>
        req.status === 'da-duyet' &&
        inspectionRecords.filter(r => r.repairRequestId === req.id).length === 0;

    const canCreateAcceptanceForInsp = (insp: TechnicalInspectionRecord) =>
        insp.status === 'da-duyet' &&
        acceptanceTestRecords.filter(a => a.inspectionRecordId === insp.id).length === 0;

    const canCreateMaterialForAcc = (acc: AcceptanceTestRecord) =>
        acc.status === 'da-duyet' &&
        materialQualityRecords.filter(m => m.acceptanceRecordId === acc.id).length === 0;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>Chi tiết: {plan.id}</Typography>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="body2"><b>Năm:</b> {plan.year}</Typography>
                <Typography variant="body2"><b>Ngày tạo:</b> {plan.createdDate}</Typography>
                {sourceDept && <Typography variant="body2"><b>ĐV quản lý:</b> {sourceDept.name}</Typography>}
                {execDept && <Typography variant="body2"><b>ĐV thực hiện:</b> {execDept.name}</Typography>}
                <StatusChip status={plan.status} />
            </Box>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Xem theo thiết bị" />
                <Tab label="Xem theo biên bản" />
            </Tabs>

            {/* ══════════════ TAB 0: Thiết bị ══════════════ */}
            {tab === 0 && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {plan.status === 'da-duyet' && (
                        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Tháng SCBD</InputLabel>
                                <Select
                                    value={selectedMonth}
                                    label="Tháng SCBD"
                                    onChange={e => { setSelectedMonth(e.target.value as number); setSelectedDeviceIds([]); }}
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
                                onClick={() => setRepairDialogOpen(true)}
                                size="small"
                            >
                                Tạo Giấy đề nghị SC ({selectedDeviceIds.length})
                            </Button>
                        </Box>
                    )}

                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
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
                                                {isUsed
                                                    ? <Chip label="Đã lập lệnh" size="small" color="info" />
                                                    : <Chip label="Chưa lập" size="small" variant="outlined" />
                                                }
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

            {/* ══════════════ TAB 1: Biên bản — tree view ══════════════ */}
            {tab === 1 && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'action.hover' }}>
                                    <TableCell sx={{ fontWeight: 700 }}>Biên bản</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Loại</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Ngày</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="right">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {planRequests.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                )}

                                {planRequests.map((req, reqIdx) => {
                                    const inspections = inspectionRecords.filter(i => i.repairRequestId === req.id);
                                    const isReqLast = reqIdx === planRequests.length - 1;

                                    return (
                                        <React.Fragment key={req.id}>
                                            {/* ───────── CẤP 1: Repair Request ───────── */}
                                            <TableRow hover>
                                                <TableCell
                                                    sx={{
                                                        pl: 2,
                                                        position: 'relative',
                                                        height: ROW_H,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 0,
                                                            height: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <TreeConnector depth={1} isLast={isReqLast} />
                                                    </Box>
                                                    {inspections.length > 0 && (
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                ml: `${INDENT_SPACE - 20}px`, // icon nằm trước text
                                                            }}
                                                            onClick={() => toggle(expandedRequests, req.id, setExpandedRequests)}
                                                        >
                                                            {expandedRequests.has(req.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    )}
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            ml: `${INDENT_SPACE}px`,
                                                        }}
                                                    >{req.number}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="GĐ Sửa chữa" size="small" />
                                                </TableCell>
                                                <TableCell>{req.createdDate}</TableCell>
                                                <TableCell><StatusChip status={req.status} /></TableCell>
                                                <TableCell align="right">
                                                    <ActionCell
                                                        onView={() => { }}
                                                        onAdd={canCreateInspectionForReq(req) ? () => setInspectionParentReqId(req.id) : undefined}
                                                        addTooltip="Tạo BB Giám định"
                                                        addColor="success"
                                                    />
                                                </TableCell>
                                            </TableRow>

                                            {/* ───────── CẤP 2: Inspections (collapsed) ───────── */}
                                            <TableRow>
                                                <TableCell colSpan={5} sx={{ p: 0 }}>
                                                    <Collapse in={expandedRequests.has(req.id)} timeout="auto" unmountOnExit>
                                                        <Table size="small">
                                                            <TableBody>
                                                                {inspections.map((insp, inspIdx) => {
                                                                    const acceptances = acceptanceTestRecords.filter(a => a.inspectionRecordId === insp.id);
                                                                    const isInspLast = inspIdx === inspections.length - 1;

                                                                    return (
                                                                        <React.Fragment key={insp.id}>
                                                                            <TableRow hover>
                                                                                <TableCell
                                                                                    sx={{
                                                                                        pl: 2,
                                                                                        position: 'relative',
                                                                                        height: ROW_H,
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                    }}
                                                                                >
                                                                                    <Box
                                                                                        sx={{
                                                                                            position: 'absolute',
                                                                                            left: 0,
                                                                                            top: 0,
                                                                                            height: '100%',
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                        }}
                                                                                    >
                                                                                        <TreeConnector depth={2} isLast={isInspLast} />
                                                                                    </Box>
                                                                                    {acceptances.length > 0 && (
                                                                                        <IconButton
                                                                                            size="small"
                                                                                            sx={{
                                                                                                ml: `${INDENT_SPACE - 20}px`, // icon nằm trước text
                                                                                            }}
                                                                                            onClick={() => toggle(expandedInspections, insp.id, setExpandedInspections)}
                                                                                        >
                                                                                            {expandedInspections.has(insp.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                                                        </IconButton>
                                                                                    )}
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        sx={{
                                                                                            ml: `${INDENT_SPACE}px`,
                                                                                        }}
                                                                                    >{insp.number}</Typography>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Chip label="BB Giám định" size="small" color="success" />
                                                                                </TableCell>
                                                                                <TableCell>{insp.inspectionDate}</TableCell>
                                                                                <TableCell><StatusChip status={insp.status} /></TableCell>
                                                                                <TableCell align="right">
                                                                                    <ActionCell
                                                                                        onView={() => { }}
                                                                                        onAdd={canCreateAcceptanceForInsp(insp) ? () => setAcceptanceParentInspId(insp.id) : undefined}
                                                                                        addTooltip="Tạo BB Nghiệm thu"
                                                                                        addColor="warning"
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>

                                                                            {/* ───────── CẤP 3: Acceptances (collapsed) ───────── */}
                                                                            <TableRow>
                                                                                <TableCell colSpan={5} sx={{ p: 0 }}>
                                                                                    <Collapse in={expandedInspections.has(insp.id)} timeout="auto" unmountOnExit>
                                                                                        <Table size="small">
                                                                                            <TableBody>
                                                                                                {acceptances.map((acc, accIdx) => {
                                                                                                    const materials = materialQualityRecords.filter(m => m.acceptanceRecordId === acc.id);
                                                                                                    const isAccLast = accIdx === acceptances.length - 1;

                                                                                                    return (
                                                                                                        <React.Fragment key={acc.id}>
                                                                                                            <TableRow hover>
                                                                                                                <TableCell
                                                                                                                    sx={{
                                                                                                                        pl: 2,
                                                                                                                        position: 'relative',
                                                                                                                        height: ROW_H,
                                                                                                                        display: 'flex',
                                                                                                                        alignItems: 'center',
                                                                                                                    }}
                                                                                                                >

                                                                                                                    <Box
                                                                                                                        sx={{
                                                                                                                            position: 'absolute',
                                                                                                                            left: 0,
                                                                                                                            top: 0,
                                                                                                                            height: '100%',
                                                                                                                            display: 'flex',
                                                                                                                            alignItems: 'center',
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <TreeConnector depth={3} isLast={isAccLast} />
                                                                                                                    </Box>
                                                                                                                    {materials.length > 0 && (
                                                                                                                        <IconButton
                                                                                                                            size="small"
                                                                                                                            sx={{
                                                                                                                                ml: `${INDENT_SPACE - 20}px`, // icon nằm trước text
                                                                                                                            }}
                                                                                                                            onClick={() => toggle(expandedAcceptances, acc.id, setExpandedAcceptances)}
                                                                                                                        >
                                                                                                                            {expandedAcceptances.has(acc.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                                                                                        </IconButton>
                                                                                                                    )}
                                                                                                                    <Typography
                                                                                                                        variant="body2"
                                                                                                                        sx={{
                                                                                                                            ml: `${INDENT_SPACE}px`,
                                                                                                                        }}
                                                                                                                    >{acc.number}</Typography>
                                                                                                                </TableCell>
                                                                                                                <TableCell>
                                                                                                                    <Chip label="BB Nghiệm thu" size="small" color="warning" />
                                                                                                                </TableCell>
                                                                                                                <TableCell>{acc.date}</TableCell>
                                                                                                                <TableCell><StatusChip status={acc.status} /></TableCell>
                                                                                                                <TableCell align="right">
                                                                                                                    <ActionCell
                                                                                                                        onView={() => { }}
                                                                                                                        onAdd={canCreateMaterialForAcc(acc) ? () => setMaterialParentAccId(acc.id) : undefined}
                                                                                                                        addTooltip="Tạo BB Vật tư"
                                                                                                                        addColor="secondary"
                                                                                                                    />
                                                                                                                </TableCell>
                                                                                                            </TableRow>

                                                                                                            {/* ───────── CẤP 4: Materials (collapsed) ───────── */}
                                                                                                            <TableRow>
                                                                                                                <TableCell colSpan={5} sx={{ p: 0 }}>
                                                                                                                    <Collapse in={expandedAcceptances.has(acc.id)} timeout="auto" unmountOnExit>
                                                                                                                        <Table size="small">
                                                                                                                            <TableBody>
                                                                                                                                {materials.map((mat, matIdx) => {
                                                                                                                                    const isMatLast = matIdx === materials.length - 1;

                                                                                                                                    return (
                                                                                                                                        <TableRow key={mat.id} hover>
                                                                                                                                            <TableCell
                                                                                                                                                sx={{
                                                                                                                                                    pl: 2,
                                                                                                                                                    position: 'relative',
                                                                                                                                                    height: ROW_H,
                                                                                                                                                    display: 'flex',
                                                                                                                                                    alignItems: 'center',
                                                                                                                                                }}
                                                                                                                                            >

                                                                                                                                                <Box
                                                                                                                                                    sx={{
                                                                                                                                                        position: 'absolute',
                                                                                                                                                        left: 0,
                                                                                                                                                        top: 0,
                                                                                                                                                        height: '100%',
                                                                                                                                                        display: 'flex',
                                                                                                                                                        alignItems: 'center',
                                                                                                                                                    }}
                                                                                                                                                >
                                                                                                                                                    <TreeConnector depth={4} isLast={isMatLast} />
                                                                                                                                                </Box>
                                                                                                                                                <Typography
                                                                                                                                                    variant="body2"
                                                                                                                                                    sx={{
                                                                                                                                                        ml: `${INDENT_SPACE}px`,
                                                                                                                                                    }}
                                                                                                                                                >{mat.number}</Typography>
                                                                                                                                            </TableCell>
                                                                                                                                            <TableCell>
                                                                                                                                                <Chip label="BB Vật tư" size="small" color="secondary" />
                                                                                                                                            </TableCell>
                                                                                                                                            <TableCell>{(mat as any).date || '—'}</TableCell>
                                                                                                                                            <TableCell><StatusChip status={mat.status} /></TableCell>
                                                                                                                                            <TableCell align="right">
                                                                                                                                                <ActionCell onView={() => { }} />
                                                                                                                                            </TableCell>
                                                                                                                                        </TableRow>
                                                                                                                                    );
                                                                                                                                })}
                                                                                                                            </TableBody>
                                                                                                                        </Table>
                                                                                                                    </Collapse>
                                                                                                                </TableCell>
                                                                                                            </TableRow>
                                                                                                        </React.Fragment>
                                                                                                    );
                                                                                                })}
                                                                                            </TableBody>
                                                                                        </Table>
                                                                                    </Collapse>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        </React.Fragment>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Dialog tạo giấy đề nghị SC */}
            <RepairRequestDialog
                open={repairDialogOpen}
                onClose={() => setRepairDialogOpen(false)}
                plan={plan}
                selectedDeviceIds={selectedDeviceIds}
                selectedMonth={selectedMonth}
                onSubmit={req => {
                    onCreateRepairRequest(req);
                    setSelectedDeviceIds([]);
                    setRepairDialogOpen(false);
                }}
            />

            {/*
              TODO: Uncomment và truyền đúng parentId khi mở dialog:

              <InspectionRecordDialog
                open={!!inspectionParentReqId}
                repairRequest={repairRequests.find(r => r.id === inspectionParentReqId)!}
                onClose={() => setInspectionParentReqId(null)}
                onSubmit={record => { onCreateInspectionRecord(record); setInspectionParentReqId(null); }}
              />

              <AcceptanceTestDialog
                open={!!acceptanceParentInspId}
                inspectionRecord={inspectionRecords.find(r => r.id === acceptanceParentInspId)!}
                onClose={() => setAcceptanceParentInspId(null)}
                onSubmit={record => { onCreateAcceptanceRecord(record); setAcceptanceParentInspId(null); }}
              />

              <MaterialQualityDialog
                open={!!materialParentAccId}
                acceptanceRecord={acceptanceTestRecords.find(r => r.id === materialParentAccId)!}
                onClose={() => setMaterialParentAccId(null)}
                onSubmit={record => { onCreateMaterialQualityRecord(record); setMaterialParentAccId(null); }}
              />
            */}
        </Box>
    );
};

export default PlanDetailPanel;