import { useState } from 'react';
import {
    Box, Button, IconButton, Typography, FormControl, InputLabel,
    Select, MenuItem, Divider, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, Alert, TextField,
} from '@mui/material';
import FieldDate from '../../../../components/TextField/FieldDate';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { departments, users } from '../../../../mockdata/mockDepartments';
import type { MaintenanceLevel, PlanSigner } from '../../../../mockdata/mockPlans';
import type { AnnualPlan } from '../../../../mockdata/mockWorkflow';
import StepSchedule from '../step/StepSchedule';
import StepPreview from '../step/StepPreview';
import StepAssets from '../step/StepAssets';

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (plan: AnnualPlan) => void;
}

const CreatePlanDialog = ({ open, onClose, onSave }: Props) => {
    const [sourceDeptId, setSourceDeptId] = useState('');
    const [executionDeptId, setExecutionDeptId] = useState('');
    const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
    const [schedule, setSchedule] = useState<Record<string, MaintenanceLevel[]>>({});
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const [signers, setSigners] = useState<PlanSigner[]>([]);
    const [planCode, setPlanCode] = useState('');
    const [planName, setPlanName] = useState('');
    const [planDate, setPlanDate] = useState('');
    const [addDeptId, setAddDeptId] = useState('');
    const [addUserId, setAddUserId] = useState('');
    const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
    const [editDeptId, setEditDeptId] = useState('');
    const [editUserId, setEditUserId] = useState('');

    const handleClose = () => {
        setSourceDeptId(''); setExecutionDeptId('');
        setSelectedAssetIds([]); setSchedule({}); setQuantities({});
        setSigners([]); setAddDeptId(''); setAddUserId('');
        setPlanCode(''); setPlanName(''); setPlanDate('');
        onClose();
    };

    const handleAddSigner = () => {
        if (!addUserId || !addDeptId) return;
        if (signers.some(s => s.userId === addUserId)) return;
        const user = users.find(u => u.id === addUserId);
        const dept = departments.find(d => d.id === addDeptId);
        if (!user || !dept) return;
        setSigners(prev => [...prev, {
            userId: user.id, userName: user.name,
            departmentId: dept.id, departmentName: dept.name,
            order: prev.length + 1, signed: false
        }]);
        setAddDeptId(''); setAddUserId('');
    };

    const handleRemoveSigner = (userId: string) => {
        setSigners(signers.filter(s => s.userId !== userId).map((s, i) => ({ ...s, order: i + 1 })));
    };

    const handleEdit = (signer: PlanSigner) => {
        setEditingSignerId(signer.userId);
        setEditDeptId(signer.departmentId);
        setEditUserId(signer.userId);
    };

    const handleSaveEdit = () => {
        setSigners(prev => prev.map(s =>
            s.userId === editingSignerId ? {
                ...s,
                userId: editUserId,
                userName: users.find(u => u.id === editUserId)?.name || '',
                departmentId: editDeptId,
                departmentName: departments.find(d => d.id === editDeptId)?.name || '',
            } : s
        ));
        setEditingSignerId(null);
    };

    const canSave = !!sourceDeptId && !!executionDeptId
        && sourceDeptId !== executionDeptId
        && selectedAssetIds.length > 0
        && Object.keys(schedule).length > 0
        && signers.length > 0
        && planCode.trim() !== ''
        && planName.trim() !== ''
        && planDate.trim() !== '';

    const handleSave = (status: 'draft' | 'cho-duyet') => {
        const year = planDate ? parseInt(planDate.slice(0, 4)) : new Date().getFullYear();
        const newPlan: AnnualPlan = {
            id: planCode.trim() || `KH-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
            year,
            deviceIds: selectedAssetIds,
            status,
            createdDate: planDate || new Date().toISOString().slice(0, 10),
            description: planName || `Kế hoạch SCBD - ${departments.find(d => d.id === sourceDeptId)?.name || sourceDeptId}`,
            sourceDepartmentId: sourceDeptId,
            executionDepartmentId: executionDeptId,
            monthlySchedule: schedule as any,
            signers,
        };
        onSave(newPlan);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth
            PaperProps={{ sx: { height: '90vh' } }}>

            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" fontWeight={600}>Tạo kế hoạch mới</Typography>
                <IconButton size="small" onClick={handleClose}><CloseIcon /></IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 3, overflow: 'auto' }}>
                {/* ── ROW 1: 2 cột trên cùng ── */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 3, mb: 3 }}>

                    {/* ── CỘT TRÁI: Đơn vị + Chọn thiết bị ── */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {/* Thông tin kế hoạch */}
                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}>
                            <Typography variant="subtitle1" fontWeight={600} mb={2}>Thông tin kế hoạch</Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField label="Mã phiếu" size="small" value={planCode} onChange={e => setPlanCode(e.target.value)} />
                                <TextField label="Tên kế hoạch" size="small" value={planName} onChange={e => setPlanName(e.target.value)} />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <FieldDate title="Thời gian lập kế hoạch" selectedDate={planDate} setSelectedDate={setPlanDate} />
                            </Box>
                        </Box>

                        {/* Đơn vị */}
                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}>
                            <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                1. Đơn vị
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl size="small" sx={{ flex: 1 }}>
                                    <InputLabel>Đơn vị quản lý (Nguồn)</InputLabel>
                                    <Select value={sourceDeptId} label="Đơn vị quản lý (Nguồn)"
                                        onChange={e => { setSourceDeptId(e.target.value); setSelectedAssetIds([]); setSchedule({}); }}>
                                        {departments.filter(d => !['PB-09', 'PB-10'].includes(d.id)).map(d => (
                                            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" sx={{ flex: 1 }}>
                                    <InputLabel>Đơn vị thực hiện</InputLabel>
                                    <Select value={executionDeptId} label="Đơn vị thực hiện"
                                        onChange={e => setExecutionDeptId(e.target.value)}>
                                        {departments.filter(d => !['PB-09', 'PB-10'].includes(d.id)).map(d => (
                                            <MenuItem key={d.id} value={d.id} disabled={d.id === sourceDeptId}>
                                                {d.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        {/* Chọn thiết bị */}
                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}>
                            <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                2. Chọn thiết bị
                            </Typography>
                            {!sourceDeptId ? (
                                <Alert severity="info">Vui lòng chọn đơn vị quản lý trước</Alert>
                            ) : (
                                <StepAssets
                                    sourceDeptId={sourceDeptId}
                                    selectedAssetIds={selectedAssetIds}
                                    quantities={quantities}
                                    onSelectionChange={setSelectedAssetIds}
                                    onQuantityChange={setQuantities}
                                />
                            )}
                        </Box>
                    </Box>

                    {/* ── CỘT PHẢI: Quy trình duyệt ── */}
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle1" fontWeight={600} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            Quy trình duyệt
                            <Chip label={`${signers.length} người`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 400 }} />
                        </Typography>

                        {/* Timeline */}
                        <Box sx={{ flex: 1, overflowY: 'auto' }}>
                            {signers.length > 0 ? (
                                <Box sx={{ position: 'relative', pl: 5, mb: 3 }}>
                                    <Box sx={{ position: 'absolute', left: 16, top: 8, bottom: 8, width: '1px', bgcolor: 'divider' }} />
                                    {signers.map((s, idx) => {
                                        const user = users.find(u => u.id === s.userId);
                                        const isEditingThis = editingSignerId === s.userId;
                                        return (
                                            <Box key={s.userId} sx={{ position: 'relative', mb: 1.5 }}>
                                                <Box sx={{
                                                    position: 'absolute', left: -37, top: 14,
                                                    width: 24, height: 24, borderRadius: '50%',
                                                    bgcolor: 'green', color: 'white',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 11, fontWeight: 600, zIndex: 1,
                                                    boxShadow: '0 0 0 3px white'
                                                }}>{idx + 1}</Box>

                                                <Box sx={{
                                                    border: '1px solid',
                                                    borderColor: isEditingThis ? 'primary.main' : 'divider',
                                                    borderRadius: 2, p: 1.5,
                                                    bgcolor: isEditingThis ? 'primary.50' : 'background.paper',
                                                    transition: 'all 0.2s',
                                                    '&:hover': !isEditingThis ? { boxShadow: 1, borderColor: 'grey.300' } : {}
                                                }}>
                                                    {isEditingThis ? (
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                            <FormControl size="small" fullWidth>
                                                                <InputLabel>Phòng ban</InputLabel>
                                                                <Select value={editDeptId} label="Phòng ban"
                                                                    onChange={e => { setEditDeptId(e.target.value); setEditUserId(''); }}>
                                                                    {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                                                                </Select>
                                                            </FormControl>
                                                            <FormControl size="small" fullWidth>
                                                                <InputLabel>Người duyệt</InputLabel>
                                                                <Select value={editUserId} label="Người duyệt"
                                                                    onChange={e => setEditUserId(e.target.value)}>
                                                                    {users.filter(u => u.departmentId === editDeptId).map(u => (
                                                                        <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Button variant="contained" size="small" onClick={handleSaveEdit}>Lưu</Button>
                                                                <Button size="small" onClick={() => setEditingSignerId(null)}>Hủy</Button>
                                                            </Box>
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                <Box sx={{
                                                                    width: 36, height: 36, borderRadius: '50%',
                                                                    bgcolor: 'green', color: 'white',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    fontWeight: 600, fontSize: 13, flexShrink: 0,
                                                                }}>
                                                                    {user?.name?.charAt(0) ?? '?'}
                                                                </Box>
                                                                <Box>
                                                                    <Typography fontWeight={600} fontSize={13}>{user?.name}</Typography>
                                                                    <Typography variant="caption" color="text.secondary">{user?.title}</Typography>
                                                                    <Box sx={{ mt: 0.5 }}>
                                                                        <Chip
                                                                            label={departments.find(d => d.id === s.departmentId)?.name ?? s.departmentId}
                                                                            size="small"
                                                                            sx={{ fontSize: 10, height: 18, bgcolor: 'grey.100' }}
                                                                        />
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                <Button size="small" variant="outlined" onClick={() => handleEdit(s)} sx={{ minWidth: 0, px: 1, fontSize: 12 }}>Sửa</Button>
                                                                <Button size="small" color="error" variant="outlined" onClick={() => handleRemoveSigner(s.userId)} sx={{ minWidth: 0, px: 1, fontSize: 12 }}>Xóa</Button>
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            ) : (
                                <Alert severity="info" sx={{ mb: 2 }}>Chưa có người duyệt</Alert>
                            )}
                        </Box>

                        {/* Add signer form */}
                        <Box sx={{
                            display: 'flex', flexDirection: 'column', gap: 1.5,
                            p: 2, bgcolor: 'grey.50', borderRadius: 2,
                            border: '1px dashed', borderColor: 'divider', mt: 'auto'
                        }}>
                            <FormControl size="small" fullWidth>
                                <InputLabel>Phòng ban</InputLabel>
                                <Select value={addDeptId} label="Phòng ban"
                                    onChange={e => { setAddDeptId(e.target.value); setAddUserId(''); }}>
                                    {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl size="small" fullWidth disabled={!addDeptId}>
                                <InputLabel>Người duyệt</InputLabel>
                                <Select value={addUserId} label="Người duyệt" onChange={e => setAddUserId(e.target.value)}>
                                    {users.filter(u => u.departmentId === addDeptId).map(u => (
                                        <MenuItem key={u.id} value={u.id} disabled={signers.some(s => s.userId === u.id)}>
                                            {u.name} – {u.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button variant="contained" startIcon={<PersonAddIcon />}
                                onClick={handleAddSigner} disabled={!addUserId} fullWidth>
                                Thêm người duyệt
                            </Button>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* ── Lịch sửa chữa ── */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                        3. Lịch sửa chữa bảo dưỡng
                    </Typography>
                    {selectedAssetIds.length === 0 ? (
                        <Alert severity="info">Vui lòng chọn thiết bị trước</Alert>
                    ) : (
                        <StepSchedule assetIds={selectedAssetIds} schedule={schedule} onScheduleChange={setSchedule} />
                    )}
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* ── Xem trước ── */}
                <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                        4. Xem trước kế hoạch
                    </Typography>
                    <StepPreview
                        sourceDeptId={sourceDeptId}
                        executionDeptId={executionDeptId}
                        assetIds={selectedAssetIds}
                        quantities={quantities}
                        schedule={schedule}
                        signers={signers}
                    />
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={handleClose} color="inherit">Hủy</Button>
                <Button variant="outlined" disabled={!canSave} onClick={() => handleSave('draft')}>Lưu nháp</Button>
                <Button variant="contained" disabled={!canSave} onClick={() => handleSave('cho-duyet')}>Gửi phê duyệt</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreatePlanDialog;