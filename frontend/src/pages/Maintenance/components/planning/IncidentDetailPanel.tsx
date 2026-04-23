import React, { useState, useMemo } from 'react';
import {
    Box, Typography, Tabs, Tab, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip, Checkbox,
    Button, IconButton, Dialog, DialogTitle, DialogActions, DialogContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { devices } from '../../../../mockdata/mockDevices';
import { departments } from '../../../../mockdata/mockDepartments';
import type { IncidentReport } from '../../../../mockdata/mockIncidentReports';
import type { IncidentInspectionRecord } from '../../../../mockdata/mockIncidentInspection';
import type { AnnualPlan } from '../../../../mockdata/mockWorkflow';
import type {
    AcceptanceTestRecord,
    MaterialQualityRecord,
    TechnicalInspectionRecord,
} from '../../../../mockdata/mockInspectionRecords';

import InspectionRecordDialog from '../dialog/InspectionRecordDialog';
import AcceptanceTestDialog from '../dialog/AcceptanceTestDialog';
import MaterialDialog from '../dialog/MaterialDialog';
import IncidentPreview from '../preview/IncidentPreview';
import IncidentInspectionDialog from '../dialog/Incidentinspectiondialog';

interface Props {
    incident: IncidentReport;
    plan: AnnualPlan;
    inspectionRecords: TechnicalInspectionRecord[];
    acceptanceTestRecords: AcceptanceTestRecord[];
    materialQualityRecords: MaterialQualityRecord[];
    incidentInspectionRecords: IncidentInspectionRecord[];
    onClose: () => void;
    onCreateIncidentInspectionRecord: (record: IncidentInspectionRecord) => void;
    onCreateInspectionRecord: (record: TechnicalInspectionRecord) => void;
    onCreateAcceptanceRecord: (record: AcceptanceTestRecord) => void;
    onCreateMaterialQualityRecord: (record: MaterialQualityRecord) => void;
}

const StatusChip = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; color: any }> = {
        draft: { label: 'Bản nháp', color: 'default' },
        'cho-duyet': { label: 'Chờ duyệt', color: 'warning' },
        'da-duyet': { label: 'Đã duyệt', color: 'success' },
        'tu-choi': { label: 'Từ chối', color: 'error' },
        'dang-ky': { label: 'Đang ký', color: 'info' },
    };
    const cfg = map[status] ?? { label: status, color: 'default' };
    return <Chip label={cfg.label} color={cfg.color} size="small" sx={{ color: '#fff' }} />;
};

const ActionCell = ({ onView, onAdd, addTooltip = 'Tạo biên bản', addColor = 'primary' }: any) => (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', alignItems: 'center' }}>
        {onView && (
            <IconButton size="small" onClick={e => { e.stopPropagation(); onView(); }}>
                <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
        )}
        {onAdd && (
            <IconButton
                size="small"
                color={addColor}
                onClick={e => { e.stopPropagation(); onAdd(); }}
            >
                <AddCircleOutlineIcon sx={{ fontSize: 16 }} />
            </IconButton>
        )}
    </Box>
);

const IncidentDetailPanel = ({
    incident,
    plan,
    inspectionRecords,
    acceptanceTestRecords,
    materialQualityRecords,
    incidentInspectionRecords,
    onClose,
    onCreateIncidentInspectionRecord,
    onCreateInspectionRecord,
    onCreateAcceptanceRecord,
    onCreateMaterialQualityRecord,
}: Props) => {
    const [tab, setTab] = useState(0);
    const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
    const [expandedBBKTKSC, setExpandedBBKTKSC] = useState<Set<string>>(new Set());
    const [expandedInspections, setExpandedInspections] = useState<Set<string>>(new Set());
    const [expandedAcceptances, setExpandedAcceptances] = useState<Set<string>>(new Set());
    const [incidentInspectionParentId, setIncidentInspectionParentId] = useState<string | null>(null);
    const [incInspectionParentBBKTKSCId, setIncInspectionParentBBKTKSCId] = useState<string | null>(null);
    const [acceptanceParentInspId, setAcceptanceParentInspId] = useState<string | null>(null);
    const [materialParentAccId, setMaterialParentAccId] = useState<string | null>(null);
    const [incidentPreviewId, setIncidentPreviewId] = useState<string | null>(null);

    // Lấy danh sách BB Kiểm tra sự cố thuộc incident này
    const incidentInspections = useMemo(
        () => incidentInspectionRecords.filter(r => r.incidentReportId === incident.id),
        [incident.id, incidentInspectionRecords]
    );

    // Lấy danh sách thiết bị từ deviceEntries
    const deviceIds = useMemo(
        () => incident.deviceEntries.map(e => e.deviceId),
        [incident.deviceEntries]
    );

    const devicesInIncident = useMemo(
        () => devices.filter(d => deviceIds.includes(d.id)),
        [deviceIds]
    );

    const handleToggle = (id: string) =>
        setSelectedDeviceIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );

    const handleSelectAll = () =>
        setSelectedDeviceIds(
            selectedDeviceIds.length === devicesInIncident.length
                ? []
                : devicesInIncident.map(d => d.id)
        );

    const toggle = (set: Set<string>, id: string, setter: (s: Set<string>) => void) => {
        const next = new Set(set);
        next.has(id) ? next.delete(id) : next.add(id);
        setter(next);
    };

    const reporterDept = incident.reporterDeptId
        ? departments.find(d => d.id === incident.reporterDeptId)
        : null;

    const severityColors: Record<string, string> = {
        'Nhẹ': '#4caf50',
        'Trung bình': '#ff9800',
        'Nặng': '#f44336',
        'Nghiêm trọng': '#9c27b0',
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                    Chi tiết: Phiếu báo sự cố {incident.number}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Info section */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="body2">
                    <b>Ngày phát hiện:</b> {incident.detectedAt}
                </Typography>
                <Typography variant="body2">
                    <b>Hệ thống:</b> {incident.systemName}
                </Typography>
                {incident.severity && (
                    <Chip
                        label={incident.severity}
                        size="small"
                        sx={{
                            bgcolor: severityColors[incident.severity] || '#bdbdbd',
                            color: '#fff',
                        }}
                    />
                )}
                {reporterDept && (
                    <Typography variant="body2">
                        <b>Đơn vị báo cáo:</b> {reporterDept.name}
                    </Typography>
                )}
                <StatusChip status={incident.status ?? 'cho-duyet'} />
            </Box>

            {incident.description && (
                <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2">
                        <b>Mô tả:</b> {incident.description}
                    </Typography>
                </Box>
            )}

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Xem theo thiết bị" />
                <Tab label="Xem theo biên bản" />
            </Tabs>

            {/* ══════════════ TAB 0: Thiết bị ══════════════ */}
            {tab === 0 && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {incident.status === 'da-duyet' && (
                        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={selectedDeviceIds.length === 0}
                                onClick={() => setIncidentInspectionParentId(incident.id)}
                                size="small"
                            >
                                Tạo BB Kiểm tra sự cố ({selectedDeviceIds.length})
                            </Button>
                        </Box>
                    )}

                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {incident.status === 'da-duyet' && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={
                                                    selectedDeviceIds.length > 0 &&
                                                    selectedDeviceIds.length < devicesInIncident.length
                                                }
                                                checked={
                                                    devicesInIncident.length > 0 &&
                                                    selectedDeviceIds.length === devicesInIncident.length
                                                }
                                                onChange={handleSelectAll}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Mã TB</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Tên TB</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Nhóm</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Vị trí</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {devicesInIncident.map((device, idx) => {
                                    const entry = incident.deviceEntries.find(e => e.deviceId === device.id);
                                    return (
                                        <TableRow key={device.id}>
                                            {incident.status === 'da-duyet' && (
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedDeviceIds.includes(device.id)}
                                                        onChange={() => handleToggle(device.id)}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>{device.id}</TableCell>
                                            <TableCell>{device.name}</TableCell>
                                            <TableCell>{device.group}</TableCell>
                                            <TableCell>{entry?.position || '—'}</TableCell>
                                            <TableCell>{entry?.note || '—'}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* ══════════════ TAB 1: Biên bản — tree view ══════════════ */}
            {tab === 1 && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
                        <Table size="small" sx={{ minWidth: 900 }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'action.hover' }}>
                                    <TableCell sx={{ fontWeight: 700 }}>Biên bản</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Loại</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Ngày</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="right">
                                        Thao tác
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {incidentInspections.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* ─── BB Kiểm tra sự cố (Cấp 1) ─── */}
                                {incidentInspections.map((bbktksc) => {
                                    const incInspections = inspectionRecords.filter(
                                        r => (r as any).incidentInspectionRecordId === bbktksc.id
                                    );
                                    const isBBExpanded = expandedBBKTKSC.has(bbktksc.id);

                                    return (
                                        <React.Fragment key={`bbktksc-${bbktksc.id}`}>
                                            {/* Depth 1: BBKTKSC */}
                                            <TableRow hover>
                                                <TableCell sx={{ pl: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {incInspections.length > 0 && (
                                                            <IconButton
                                                                size="small"
                                                                onClick={() =>
                                                                    toggle(
                                                                        expandedBBKTKSC,
                                                                        bbktksc.id,
                                                                        setExpandedBBKTKSC
                                                                    )
                                                                }
                                                            >
                                                                {isBBExpanded ? (
                                                                    <KeyboardArrowUpIcon />
                                                                ) : (
                                                                    <KeyboardArrowDownIcon />
                                                                )}
                                                            </IconButton>
                                                        )}
                                                        <Typography variant="body2" sx={{ ml: incInspections.length > 0 ? 0 : '28px' }}>
                                                            {bbktksc.number}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="BB Kiểm tra SC" size="small" color="warning" sx={{ color: '#fff' }} />
                                                </TableCell>
                                                <TableCell>{bbktksc.inspectionDate}</TableCell>
                                                <TableCell>
                                                    <StatusChip status={bbktksc.status} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <ActionCell
                                                        onView={() => { }}
                                                        onAdd={() => setIncInspectionParentBBKTKSCId(bbktksc.id)}
                                                        addTooltip="Tạo BB Giám định"
                                                        addColor="success"
                                                    />
                                                </TableCell>
                                            </TableRow>

                                            {/* Depth 2: BB Giám định */}
                                            {isBBExpanded &&
                                                incInspections.map((insp) => {
                                                    const incAcceptances = acceptanceTestRecords.filter(
                                                        a => a.inspectionRecordId === insp.id
                                                    );
                                                    const isInspExpanded = expandedInspections.has(insp.id);

                                                    return (
                                                        <React.Fragment key={`incinsp-${insp.id}`}>
                                                            <TableRow hover>
                                                                <TableCell sx={{ pl: 6 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        {incAcceptances.length > 0 && (
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() =>
                                                                                    toggle(
                                                                                        expandedInspections,
                                                                                        insp.id,
                                                                                        setExpandedInspections
                                                                                    )
                                                                                }
                                                                            >
                                                                                {isInspExpanded ? (
                                                                                    <KeyboardArrowUpIcon />
                                                                                ) : (
                                                                                    <KeyboardArrowDownIcon />
                                                                                )}
                                                                            </IconButton>
                                                                        )}
                                                                        <Typography variant="body2" sx={{ ml: incAcceptances.length > 0 ? 0 : '28px' }}>
                                                                            {insp.number}
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip label="BB Giám định" size="small" color="success" sx={{ color: '#fff' }} />
                                                                </TableCell>
                                                                <TableCell>{insp.inspectionDate}</TableCell>
                                                                <TableCell>
                                                                    <StatusChip status={insp.status} />
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <ActionCell
                                                                        onView={() => { }}
                                                                        onAdd={() => setAcceptanceParentInspId(insp.id)}
                                                                        addTooltip="Tạo BB Nghiệm thu"
                                                                        addColor="warning"
                                                                    />
                                                                </TableCell>
                                                            </TableRow>

                                                            {/* Depth 3: BB Nghiệm thu */}
                                                            {isInspExpanded &&
                                                                incAcceptances.map((acc) => {
                                                                    const incMaterials = materialQualityRecords.filter(
                                                                        m => m.acceptanceRecordId === acc.id
                                                                    );
                                                                    const isAccExpanded = expandedAcceptances.has(acc.id);

                                                                    return (
                                                                        <React.Fragment key={`incacc-${acc.id}`}>
                                                                            <TableRow hover>
                                                                                <TableCell sx={{ pl: 10 }}>
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                        {incMaterials.length > 0 && (
                                                                                            <IconButton
                                                                                                size="small"
                                                                                                onClick={() =>
                                                                                                    toggle(
                                                                                                        expandedAcceptances,
                                                                                                        acc.id,
                                                                                                        setExpandedAcceptances
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                {isAccExpanded ? (
                                                                                                    <KeyboardArrowUpIcon />
                                                                                                ) : (
                                                                                                    <KeyboardArrowDownIcon />
                                                                                                )}
                                                                                            </IconButton>
                                                                                        )}
                                                                                        <Typography variant="body2" sx={{ ml: incMaterials.length > 0 ? 0 : '28px' }}>
                                                                                            {acc.number}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Chip label="BB Nghiệm thu" size="small" color="warning" sx={{ color: '#fff' }} />
                                                                                </TableCell>
                                                                                <TableCell>{acc.date}</TableCell>
                                                                                <TableCell>
                                                                                    <StatusChip status={acc.status} />
                                                                                </TableCell>
                                                                                <TableCell align="right">
                                                                                    <ActionCell
                                                                                        onView={() => { }}
                                                                                        onAdd={() => setMaterialParentAccId(acc.id)}
                                                                                        addTooltip="Tạo BB Vật tư"
                                                                                        addColor="secondary"
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>

                                                                            {/* Depth 4: BB Vật tư */}
                                                                            {isAccExpanded &&
                                                                                incMaterials.map((mat) => (
                                                                                    <TableRow hover key={`incmat-${mat.id}`}>
                                                                                        <TableCell sx={{ pl: 14 }}>
                                                                                            <Typography variant="body2">{mat.number}</Typography>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <Chip label="BB Vật tư" size="small" color="secondary" />
                                                                                        </TableCell>
                                                                                        <TableCell>{(mat as any).date || '—'}</TableCell>
                                                                                        <TableCell>
                                                                                            <StatusChip status={mat.status} />
                                                                                        </TableCell>
                                                                                        <TableCell align="right">
                                                                                            <ActionCell onView={() => { }} />
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                        </React.Fragment>
                                                                    );
                                                                })}
                                                        </React.Fragment>
                                                    );
                                                })}
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Dialogs */}
            {incidentInspectionParentId && (
                <IncidentInspectionDialog
                    open={true}
                    onClose={() => setIncidentInspectionParentId(null)}
                    plan={plan}
                    incidentReport={incident}
                    onSubmit={(record) => {
                        onCreateIncidentInspectionRecord(record);
                        setIncidentInspectionParentId(null);
                    }}
                />
            )}

            {incInspectionParentBBKTKSCId && (() => {
                const parentBBKTKSC = incidentInspectionRecords.find(
                    r => r.id === incInspectionParentBBKTKSCId
                );
                // Lấy danh sách deviceId từ BB Kiểm tra sự cố
                // (items[].itemName không phải deviceId — dùng deviceEntries của incident)
                const bbDeviceIds = incident.deviceEntries.map(e => e.deviceId);

                return parentBBKTKSC ? (
                    <InspectionRecordDialog
                        open={true}
                        onClose={() => setIncInspectionParentBBKTKSCId(null)}
                        plan={plan}
                        repairRequest={null}          // ← không có GĐ sửa chữa
                        deviceIds={bbDeviceIds}       // ← truyền deviceIds từ incident
                        onSubmit={(record) => {
                            onCreateInspectionRecord({
                                ...record,
                                incidentInspectionRecordId: parentBBKTKSC.id,
                                repairRequestId: '',
                            });
                            setIncInspectionParentBBKTKSCId(null);
                        }}
                    />
                ) : null;
            })()}

            {acceptanceParentInspId && (() => {
                const parentInsp = inspectionRecords.find(r => r.id === acceptanceParentInspId);
                return parentInsp ? (
                    <AcceptanceTestDialog
                        open={true}
                        onClose={() => setAcceptanceParentInspId(null)}
                        plan={plan}
                        repairRequest={null as any}
                        inspectionRecord={parentInsp}
                        onSubmit={(record) => {
                            onCreateAcceptanceRecord(record);
                            setAcceptanceParentInspId(null);
                        }}
                    />
                ) : null;
            })()}

            {materialParentAccId && (() => {
                const parentAcc = acceptanceTestRecords.find(a => a.id === materialParentAccId);
                return parentAcc ? (
                    <MaterialDialog
                        open={true}
                        onClose={() => setMaterialParentAccId(null)}
                        plan={plan}
                        repairRequest={null as any}
                        acceptanceRecord={parentAcc}
                        onSubmit={(record) => {
                            onCreateMaterialQualityRecord(record);
                            setMaterialParentAccId(null);
                        }}
                    />
                ) : null;
            })()}

            {/* Incident Preview */}
            {incidentPreviewId && (
                <Dialog open={true} onClose={() => setIncidentPreviewId(null)} maxWidth="md" fullWidth>
                    <DialogTitle>Phiếu báo sự cố — {incident.number}</DialogTitle>
                    <DialogContent dividers>
                        <IncidentPreview
                            number={incident.number}
                            detectedAt={incident.detectedAt}
                            reporter={incident.reporter}
                            reporterDeptId={incident.reporterDeptId}
                            signers={incident.signers}
                            systemName={incident.systemName}
                            location={incident.location}
                            description={incident.description}
                            severity={incident.severity}
                            subsystem={incident.subsystem}
                            deviceEntries={incident.deviceEntries}
                            planIds={incident.planIds}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIncidentPreviewId(null)}>Đóng</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default IncidentDetailPanel;