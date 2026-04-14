import { useState } from 'react';
import {
    Box, Stepper, Step, StepLabel, Button, Paper, IconButton,
    Typography, FormControl, InputLabel, Select, MenuItem,
    Divider, List, ListItem, ListItemText, ListItemSecondaryAction, Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { departments, users } from '../../../../mockdata/mockDepartments';
import type { MaintenanceLevel, PlanSigner } from '../../../../mockdata/mockPlans';
import type { AnnualPlan } from '../../../../mockdata/mockWorkflow';
import StepDepartments from '../step/StepDepartments';
import StepAssets from '../step/StepAssets';
import StepSchedule from '../step/StepSchedule';
import StepPreview from '../step/StepPreview';
import StepComplete from '../step/StepComplete';

const steps = [
    'Chọn đơn vị & Người ký',
    'Chọn thiết bị',
    'Lịch 12 tháng',
    'Xem trước',
    'Hoàn thành',
];

interface Props {
    onClose: () => void;
    onSave: (plan: AnnualPlan) => void;
}

const CreatePlanInline = ({ onClose, onSave }: Props) => {
    const [activeStep, setActiveStep] = useState(0);
    const [sourceDeptId, setSourceDeptId] = useState('');
    const [executionDeptId, setExecutionDeptId] = useState('');
    const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
    const [schedule, setSchedule] = useState<Record<string, MaintenanceLevel[]>>({});
    const [planStatus, setPlanStatus] = useState<'draft' | 'pending-approval'>('draft');
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [creatorDeptId, setCreatorDeptId] = useState('');
    const [creatorUserId, setCreatorUserId] = useState('');
    const [directorDeptId, setDirectorDeptId] = useState('');
    const [directorUserId, setDirectorUserId] = useState('');

    // ── State riêng cho phần người ký (trên Stepper) ──
    const [addDeptId, setAddDeptId] = useState('');
    const [addUserId, setAddUserId] = useState('');

    const creatorUsers = users.filter(u => u.departmentId === creatorDeptId);
    const directorUsers = users.filter(u => u.departmentId === directorDeptId);
    const deptUsers = users.filter(u => u.departmentId === addDeptId);

    const buildSigner = (
        userId: string, deptId: string,
        role: 'creator' | 'director' | 'middle'
    ): PlanSigner | null => {
        const user = users.find(u => u.id === userId);
        const dept = departments.find(d => d.id === deptId);
        if (!user || !dept) return null;
        return {
            userId: user.id, userName: user.name,
            departmentId: dept.id, departmentName: dept.name,
            role, signed: false,
        };
    };

    // Tổng hợp signers theo đúng thứ tự khi submit
    const buildSigners = (): PlanSigner[] => {
        const result: PlanSigner[] = [];
        const creator = buildSigner(creatorUserId, creatorDeptId, 'creator');
        if (creator) result.push(creator);
        result.push(...middleSigners);
        const director = buildSigner(directorUserId, directorDeptId, 'director');
        if (director) result.push(director);
        return result;
    };

    const [middleSigners, setMiddleSigners] = useState<PlanSigner[]>([]);

    const addMiddleSigner = () => {
        if (!addUserId || !addDeptId) return;
        const signer = buildSigner(addUserId, addDeptId, 'middle');
        if (!signer) return;
        if (middleSigners.some(s => s.userId === addUserId)) return;
        setMiddleSigners(prev => [...prev, signer]);
        setAddUserId('');
        setAddDeptId('');
    };

    const removeMiddleSigner = (userId: string) => {
        setMiddleSigners(prev => prev.filter(s => s.userId !== userId));
    };

    const canNext = (): boolean => {
        switch (activeStep) {
            case 0: return !!sourceDeptId && !!executionDeptId && sourceDeptId !== executionDeptId;
            case 1: return selectedAssetIds.length > 0;
            case 2: return Object.keys(schedule).length > 0;
            case 3: return true;
            default: return false;
        }
    };

    const handleFinish = () => {
        const newPlan: AnnualPlan = {
            id: `KH-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
            year: new Date().getFullYear(),
            deviceIds: selectedAssetIds,
            status: planStatus === 'pending-approval' ? 'cho-duyet' : 'draft',
            createdDate: new Date().toISOString().slice(0, 10),
            description: `Kế hoạch SCBD - ${departments.find(d => d.id === sourceDeptId)?.name || sourceDeptId}`,
            sourceDepartmentId: sourceDeptId,
            executionDepartmentId: executionDeptId,
            monthlySchedule: schedule as any,
            signers: buildSigners(),
        };
        onSave(newPlan);
        onClose();
    };

    const renderStep = () => {
        switch (activeStep) {
            case 0: return (
                <StepDepartments
                    sourceDeptId={sourceDeptId}
                    executionDeptId={executionDeptId}
                    onSourceChange={(id) => {
                        setSourceDeptId(id);
                        setSelectedAssetIds([]);
                        setSchedule({});
                    }}
                    onExecutionChange={setExecutionDeptId}
                />
            );
            case 1: return (
                <StepAssets
                    sourceDeptId={sourceDeptId}
                    selectedAssetIds={selectedAssetIds}
                    quantities={quantities}
                    onSelectionChange={setSelectedAssetIds}
                    onQuantityChange={setQuantities}
                />
            );
            case 2: return (
                <StepSchedule
                    assetIds={selectedAssetIds}
                    schedule={schedule}
                    onScheduleChange={setSchedule}
                />
            );
            case 3: return (
                <StepPreview
                    sourceDeptId={sourceDeptId}
                    executionDeptId={executionDeptId}
                    assetIds={selectedAssetIds}
                    quantities={quantities}
                    schedule={schedule}
                    signers={buildSigners()}
                />
            );
            case 4: return (
                <StepComplete
                    sourceDeptId={sourceDeptId}
                    executionDeptId={executionDeptId}
                    assetCount={selectedAssetIds.length}
                    signerCount={buildSigners().length}
                    status={planStatus}
                    onSubmitForApproval={() => setPlanStatus('pending-approval')}
                />
            );
            default: return null;
        }
    };

    return (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 3, mb: 2 }}>

            {/* ── Header ── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>Tạo kế hoạch mới</Typography>
                <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
            </Box>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PHẦN NGƯỜI KÝ — cố định trên Stepper
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <Box sx={{
                p: 2, mb: 2,
                border: '1px solid', borderColor: 'divider',
                borderRadius: 1.5, bgcolor: 'grey.50',
            }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary"
                    sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 2 }}>
                    Danh sách người ký
                </Typography>

                {/* ── 1. Người lập phiếu ── */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                        Người lập phiếu
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Phòng ban</InputLabel>
                            <Select
                                value={creatorDeptId}
                                label="Phòng ban"
                                onChange={e => { setCreatorDeptId(e.target.value); setCreatorUserId(''); }}
                            >
                                {departments.map(d => (
                                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 160 }} disabled={!creatorDeptId}>
                            <InputLabel>Nhân viên</InputLabel>
                            <Select
                                value={creatorUserId}
                                label="Nhân viên"
                                onChange={e => setCreatorUserId(e.target.value)}
                            >
                                {creatorUsers.map(u => (
                                    <MenuItem key={u.id} value={u.id}>{u.name} – {u.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {creatorUserId && (
                            <Chip
                                size="small"
                                label={users.find(u => u.id === creatorUserId)?.name}
                                color="primary" variant="outlined"
                                onDelete={() => { setCreatorUserId(''); setCreatorDeptId(''); }}
                            />
                        )}
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* ── 2. Người ký thêm ── */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                        Người ký thêm
                    </Typography>

                    {middleSigners.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                            {middleSigners.map((s, idx) => (
                                <Chip
                                    key={s.userId}
                                    label={`${idx + 1}. ${s.userName} (${s.departmentName})`}
                                    size="small"
                                    onDelete={() => removeMiddleSigner(s.userId)}
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Phòng ban</InputLabel>
                            <Select
                                value={addDeptId}
                                label="Phòng ban"
                                onChange={e => { setAddDeptId(e.target.value); setAddUserId(''); }}
                            >
                                {departments.map(d => (
                                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 160 }} disabled={!addDeptId}>
                            <InputLabel>Người ký</InputLabel>
                            <Select
                                value={addUserId}
                                label="Người ký"
                                onChange={e => setAddUserId(e.target.value)}
                            >
                                {deptUsers.map(u => (
                                    <MenuItem key={u.id} value={u.id}
                                        disabled={middleSigners.some(s => s.userId === u.id)}>
                                        {u.name} – {u.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            size="small" variant="outlined"
                            startIcon={<PersonAddIcon />}
                            onClick={addMiddleSigner}
                            disabled={!addUserId}
                        >
                            Thêm
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* ── 3. Giám đốc ── */}
                <Box>
                    <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                        Giám đốc
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Phòng ban</InputLabel>
                            <Select
                                value={directorDeptId}
                                label="Phòng ban"
                                onChange={e => { setDirectorDeptId(e.target.value); setDirectorUserId(''); }}
                            >
                                {departments.map(d => (
                                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 160 }} disabled={!directorDeptId}>
                            <InputLabel>Nhân viên</InputLabel>
                            <Select
                                value={directorUserId}
                                label="Nhân viên"
                                onChange={e => setDirectorUserId(e.target.value)}
                            >
                                {directorUsers.map(u => (
                                    <MenuItem key={u.id} value={u.id}>{u.name} – {u.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {directorUserId && (
                            <Chip
                                size="small"
                                label={users.find(u => u.id === directorUserId)?.name}
                                color="secondary" variant="outlined"
                                onDelete={() => { setDirectorUserId(''); setDirectorDeptId(''); }}
                            />
                        )}
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* ── Stepper ── */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map(label => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
            </Stepper>

            {/* ── Nội dung bước ── */}
            <Box sx={{ minHeight: 300 }}>
                {renderStep()}
            </Box>

            {/* ── Navigation ── */}
            <Box sx={{
                display: 'flex',
                justifyContent: activeStep === 4 ? 'center' : 'space-between',
                mt: 3, pt: 2,
                borderTop: '1px solid', borderColor: 'divider',
            }}>
                {activeStep < 4 && (
                    <>
                        <Button disabled={activeStep === 0} onClick={() => setActiveStep(p => p - 1)} startIcon={<ArrowBackIcon />}>
                            Quay lại
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setActiveStep(p => p + 1)}
                            disabled={!canNext()}
                            endIcon={activeStep === 3 ? <CheckIcon /> : <ArrowForwardIcon />}
                        >
                            {activeStep === 3 ? 'Hoàn thành' : 'Tiếp theo'}
                        </Button>
                    </>
                )}
                {activeStep === 4 && (
                    <Button variant="contained" color="primary" onClick={handleFinish}>
                        Lưu kế hoạch & Đóng
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default CreatePlanInline;