import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, TextField, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper,
    Checkbox, Divider, Chip, FormControl, InputLabel, Select, MenuItem,
    Alert, IconButton,
} from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { devices } from '../../../../mockdata/mockDevices';
import { departments, users } from '../../../../mockdata/mockDepartments';
import type { AnnualPlan } from '../../../../mockdata/mockWorkflow';
import type { RepairRequest } from '../../../../mockdata/mockRepairRequests';
import type {
    TechnicalInspectionRecord,
    DeviceInspectionEntry,
    InspectionSigner,
} from '../../../../mockdata/mockInspectionRecords';

interface Props {
    open: boolean;
    onClose: () => void;
    plan: AnnualPlan;
    // null khi gọi từ luồng sự cố (không có GĐ sửa chữa)
    repairRequest: RepairRequest | null;
    // Danh sách deviceId override — dùng khi repairRequest là null
    deviceIds?: string[];
    onSubmit: (record: TechnicalInspectionRecord) => void;
}

const InspectionRecordDialog = ({ open, onClose, plan, repairRequest, deviceIds, onSubmit }: Props) => {
    // Tính danh sách device để hiển thị:
    // 1. Nếu có repairRequest → dùng repairRequest.deviceIds
    // 2. Nếu không → dùng prop deviceIds
    // 3. Fallback: mảng rỗng
    const effectiveDeviceIds: string[] = repairRequest?.deviceIds ?? deviceIds ?? [];

    const [number, setNumber] = useState(
        repairRequest ? `BB-GD-${repairRequest.id}` : `BB-GD-SC-${Date.now()}`
    );
    const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0]);
    const [location, setLocation] = useState('');
    const [recoveryCount, setRecoveryCount] = useState(0);
    const [scrapCount, setScrapCount] = useState(0);
    const [destroyCount, setDestroyCount] = useState(0);

    const [entries, setEntries] = useState<DeviceInspectionEntry[]>(() =>
        effectiveDeviceIds.map(id => {
            const device = devices.find(d => d.id === id);
            return {
                deviceId: id,
                deviceName: device?.name || id,
                unit: 'Cái',
                quantity: device?.quantity || 1,
                technicalCondition: '',
                actionRepair: true,
                actionReplace: false,
                note: '',
            };
        })
    );

    const defaultSigners: InspectionSigner[] = [
        { order: 1, name: 'Lý Văn Nam', title: 'Trưởng phòng KT', departmentName: 'Phòng Kỹ thuật', signed: false },
        { order: 2, name: 'Phan Văn Oanh', title: 'Phó phòng KT', departmentName: 'Phòng Kỹ thuật', signed: false },
        { order: 3, name: '', title: 'Phó quản đốc', departmentName: (plan as any).sourceDepartmentName || 'ĐV quản lý', signed: false },
        { order: 4, name: '', title: 'Phó quản đốc', departmentName: (plan as any).executionDepartmentName || 'ĐV thực hiện', signed: false },
    ];
    const [signers, setSigners] = useState<InspectionSigner[]>(defaultSigners);

    const [addDeptId, setAddDeptId] = useState('');
    const [addUserId, setAddUserId] = useState('');
    const [editingSignerIdx, setEditingSignerIdx] = useState<number | null>(null);
    const [editDeptId, setEditDeptId] = useState('');
    const [editUserId, setEditUserId] = useState('');

    const updateEntry = (idx: number, field: keyof DeviceInspectionEntry, value: unknown) => {
        setEntries(prev => prev.map((e, i) => i === idx ? { ...e, [field]: value } : e));
    };

    const handleAddSigner = () => {
        if (!addDeptId || !addUserId) return;
        const user = users.find(u => u.id === addUserId);
        const dept = departments.find(d => d.id === addDeptId);
        if (!user || !dept) return;
        if (signers.some(s => s.name === user.name && s.departmentName === dept.name)) return;
        setSigners(prev => [...prev, {
            order: prev.length + 1,
            name: user.name,
            title: user.title || '',
            departmentName: dept.name,
            signed: false,
        }]);
        setAddDeptId(''); setAddUserId('');
    };

    const handleRemoveSigner = (idx: number) => {
        setSigners(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 })));
    };

    const handleEdit = (idx: number) => {
        setEditingSignerIdx(idx);
        const s = signers[idx];
        const dept = departments.find(d => d.name === s.departmentName);
        const user = users.find(u => u.name === s.name && u.departmentId === dept?.id);
        setEditDeptId(dept?.id || '');
        setEditUserId(user?.id || '');
    };

    const handleSaveEdit = () => {
        if (editingSignerIdx === null) return;
        const user = users.find(u => u.id === editUserId);
        const dept = departments.find(d => d.id === editDeptId);
        setSigners(prev => prev.map((s, i) => i === editingSignerIdx ? {
            ...s,
            name: user?.name || s.name,
            title: user?.title || s.title,
            departmentName: dept?.name || s.departmentName,
        } : s));
        setEditingSignerIdx(null);
    };

    const handleSubmit = () => {
        const record: TechnicalInspectionRecord = {
            id: `IR-${Date.now()}`,
            repairRequestId: repairRequest?.id ?? '',
            planId: plan.id,
            number,
            inspectionDate,
            location,
            deviceEntries: entries,
            recoveryCount,
            scrapCount,
            destroyCount,
            signers,
            status: 'cho-duyet',
            createdDate: new Date().toLocaleDateString('vi-VN'),
        };
        onSubmit(record);
        handleClose();
    };

    const handleClose = () => { setEditingSignerIdx(null); onClose(); };

    // Label tham chiếu ở header dialog — khác nhau tùy luồng
    const referenceLabel = repairRequest
        ? `${repairRequest.number || repairRequest.id} — Tháng ${repairRequest.month}/${repairRequest.year}`
        : `Kế hoạch: ${plan.id}`;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EngineeringIcon color="primary" />
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            Biên bản giám định kỹ thuật và bàn giao thiết bị đưa vào sửa chữa
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Căn cứ: {referenceLabel}
                        </Typography>
                    </Box>
                </Box>
                <IconButton size="small" onClick={handleClose}><CloseIcon /></IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 3, overflow: 'auto' }}>
                {effectiveDeviceIds.length === 0 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Không có thiết bị nào để giám định. Vui lòng kiểm tra lại dữ liệu đầu vào.
                    </Alert>
                )}

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 3 }}>

                    {/* Left: Thông tin + Số lượng vật tư */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
                            <Typography variant="subtitle1" fontWeight={600} mb={2}>Thông tin</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Số biên bản"
                                    value={number}
                                    onChange={e => setNumber(e.target.value)}
                                    size="small"
                                    fullWidth
                                />
                                <TextField
                                    label="Ngày lập"
                                    type="date"
                                    value={inspectionDate}
                                    onChange={e => setInspectionDate(e.target.value)}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Địa điểm (Tại...)"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    size="small"
                                    fullWidth
                                    placeholder="vd: Phân xưởng khai thác 1, khu vực A"
                                />
                                {repairRequest ? (
                                    <Typography variant="body2" color="text.secondary">
                                        Căn cứ vào giấy đề nghị: <b>{repairRequest.number}</b> — Ngày tạo: <b>{repairRequest.createdDate}</b>
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Căn cứ vào BB Kiểm tra sự cố — Kế hoạch: <b>{plan.id}</b>
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
                            <Typography variant="subtitle1" fontWeight={600} mb={2}>Số lượng vật tư</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {[
                                    { label: 'Số để lại phục hồi phục vụ cho sản xuất', value: recoveryCount, setter: setRecoveryCount },
                                    { label: 'Số để làm phế liệu (mục)', value: scrapCount, setter: setScrapCount },
                                    { label: 'Số lượng hủy (mục)', value: destroyCount, setter: setDestroyCount },
                                ].map(({ label, value, setter }) => (
                                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ flex: 1 }}>{label}:</Typography>
                                        <TextField
                                            type="number"
                                            value={value}
                                            onChange={e => setter(Math.max(0, parseInt(e.target.value) || 0))}
                                            size="small"
                                            inputProps={{ min: 0, style: { width: 120 } }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* Right: Quy trình duyệt */}
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            Quy trình duyệt
                            <Chip label={`${signers.length} người`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 400 }} />
                        </Typography>

                        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                            {signers.length > 0 ? (
                                <Box sx={{ position: 'relative', pl: 5 }}>
                                    <Box sx={{ position: 'absolute', left: 16, top: 8, bottom: 8, width: '1px', bgcolor: 'divider' }} />
                                    {signers.map((s, idx) => {
                                        const isEditingThis = editingSignerIdx === idx;
                                        return (
                                            <Box key={`${s.name}-${idx}`} sx={{ position: 'relative', mb: 1.5 }}>
                                                <Box sx={{
                                                    position: 'absolute', left: -37, top: 14,
                                                    width: 24, height: 24, borderRadius: '50%',
                                                    bgcolor: 'primary.main', color: 'white',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 11, fontWeight: 600, zIndex: 1,
                                                    boxShadow: '0 0 0 3px white',
                                                }}>{idx + 1}</Box>
                                                <Box sx={{
                                                    border: '1px solid',
                                                    borderColor: isEditingThis ? 'primary.main' : 'divider',
                                                    borderRadius: 2, p: 1.5,
                                                    bgcolor: isEditingThis ? 'primary.50' : 'background.paper',
                                                    transition: 'all 0.2s',
                                                    '&:hover': !isEditingThis ? { boxShadow: 1, borderColor: 'grey.300' } : {},
                                                }}>
                                                    {isEditingThis ? (
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                            <FormControl size="small" fullWidth>
                                                                <InputLabel>Phòng ban</InputLabel>
                                                                <Select value={editDeptId} label="Phòng ban" onChange={e => { setEditDeptId(e.target.value); setEditUserId(''); }}>
                                                                    {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                                                                </Select>
                                                            </FormControl>
                                                            <FormControl size="small" fullWidth>
                                                                <InputLabel>Người duyệt</InputLabel>
                                                                <Select value={editUserId} label="Người duyệt" onChange={e => setEditUserId(e.target.value)}>
                                                                    {users.filter(u => u.departmentId === editDeptId).map(u => (
                                                                        <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Button variant="contained" size="small" onClick={handleSaveEdit}>Lưu</Button>
                                                                <Button size="small" onClick={() => setEditingSignerIdx(null)}>Hủy</Button>
                                                            </Box>
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                <Box sx={{
                                                                    width: 36, height: 36, borderRadius: '50%',
                                                                    bgcolor: 'primary.main', color: 'white',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    fontWeight: 600, fontSize: 13, flexShrink: 0,
                                                                }}>{s.name?.charAt(0) ?? '?'}</Box>
                                                                <Box>
                                                                    <Typography fontWeight={600} fontSize={13}>{s.name || '—'}</Typography>
                                                                    <Typography variant="caption" color="text.secondary">{s.title}</Typography>
                                                                    <Box sx={{ mt: 0.5 }}>
                                                                        <Chip label={s.departmentName} size="small" sx={{ fontSize: 10, height: 18, bgcolor: 'grey.100' }} />
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                <Button size="small" variant="outlined" onClick={() => handleEdit(idx)}>Sửa</Button>
                                                                <Button size="small" color="error" variant="outlined" onClick={() => handleRemoveSigner(idx)}>Xóa</Button>
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

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                            <FormControl size="small" fullWidth>
                                <InputLabel>Phòng ban</InputLabel>
                                <Select value={addDeptId} label="Phòng ban" onChange={e => { setAddDeptId(e.target.value); setAddUserId(''); }}>
                                    {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl size="small" fullWidth disabled={!addDeptId}>
                                <InputLabel>Người duyệt</InputLabel>
                                <Select value={addUserId} label="Người duyệt" onChange={e => setAddUserId(e.target.value)}>
                                    {users.filter(u => u.departmentId === addDeptId).map(u => (
                                        <MenuItem key={u.id} value={u.id}>{u.name} – {u.title}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleAddSigner} disabled={!addUserId} fullWidth>
                                Thêm người duyệt
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Tình trạng thiết bị */}
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Tình trạng thiết bị</Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Tên TB / Vật tư</TableCell>
                                    <TableCell sx={{ fontWeight: 700, width: 60 }}>ĐVT</TableCell>
                                    <TableCell sx={{ fontWeight: 700, width: 55 }}>SL</TableCell>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>Tình trạng KT</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700, width: 70 }}>S.chữa</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700, width: 80 }}>Thay mới</TableCell>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Ghi chú</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entries.map((entry, idx) => (
                                    <TableRow key={entry.deviceId}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{entry.deviceName}</TableCell>
                                        <TableCell>
                                            <TextField value={entry.unit} onChange={e => updateEntry(idx, 'unit', e.target.value)} size="small" variant="standard" inputProps={{ style: { width: 40, fontSize: '0.8rem' } }} />
                                        </TableCell>
                                        <TableCell>
                                            <TextField type="number" value={entry.quantity} onChange={e => updateEntry(idx, 'quantity', parseInt(e.target.value) || 1)} size="small" variant="standard" inputProps={{ min: 1, style: { width: 36, fontSize: '0.8rem' } }} />
                                        </TableCell>
                                        <TableCell>
                                            <TextField value={entry.technicalCondition} onChange={e => updateEntry(idx, 'technicalCondition', e.target.value)} size="small" variant="outlined" placeholder="Mô tả tình trạng..." fullWidth multiline maxRows={2} inputProps={{ style: { fontSize: '0.8rem' } }} error={!entry.technicalCondition} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Checkbox checked={entry.actionRepair} onChange={e => updateEntry(idx, 'actionRepair', e.target.checked)} size="small" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Checkbox checked={entry.actionReplace} onChange={e => updateEntry(idx, 'actionReplace', e.target.checked)} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <TextField value={entry.note} onChange={e => updateEntry(idx, 'note', e.target.value)} size="small" variant="standard" fullWidth inputProps={{ style: { fontSize: '0.8rem' } }} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Preview */}
                <Box sx={{ mt: 4 }}>
                    <Divider sx={{ mb: 3 }}>
                        <Chip label="Xem trước biên bản" size="small" />
                    </Divider>
                    <Box sx={{ fontFamily: 'serif', fontSize: '0.875rem', lineHeight: 1.8, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="caption" display="block">TẬP ĐOÀN CÔNG NGHIỆP</Typography>
                                <Typography variant="caption" display="block">THAN – KHOÁNG SẢN VIỆT NAM</Typography>
                                <Typography variant="caption" display="block" fontWeight={700} sx={{ textTransform: 'uppercase' }}>Công <u>ty than Uông Bí</u> - TKV</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="caption" display="block" fontWeight={700}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
                                <Typography variant="caption" display="block" fontWeight={700}><u>Độc lập – Tự do – Hạnh phúc</u></Typography>
                            </Box>
                        </Box>
                        <Typography variant="caption" display="block" sx={{ textAlign: 'right', fontStyle: 'italic', mb: 2 }}>
                            Quảng Ninh, ngày {new Date(inspectionDate).getDate()} tháng {new Date(inspectionDate).getMonth() + 1} năm {new Date(inspectionDate).getFullYear()}
                        </Typography>
                        <Typography variant="subtitle2" align="center" fontWeight={700} display="block" sx={{ color: 'primary.main', mb: 0.5 }}>BIÊN BẢN</Typography>
                        <Typography variant="subtitle2" align="center" fontWeight={700} display="block" sx={{ mb: 2 }}>GIÁM ĐỊNH KỸ THUẬT VÀ BÀN GIAO THIẾT BỊ ĐƯA VÀO SỬA CHỮA</Typography>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                            Hôm nay, ngày {new Date(inspectionDate).getDate()} tháng {new Date(inspectionDate).getMonth() + 1} năm {new Date(inspectionDate).getFullYear()}. Tại {location || '……………………………'}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>Chúng tôi gồm:</Typography>
                        <Box sx={{ pl: 2, mb: 1 }}>
                            {signers.map((s, i) => (
                                <Box key={i} sx={{ display: 'flex', gap: 3, mb: 0.25 }}>
                                    <Typography variant="caption" sx={{ minWidth: 16 }}>{i + 1}.</Typography>
                                    <Typography variant="caption" sx={{ minWidth: 140, fontWeight: 500 }}>{s.name || '………………………'}</Typography>
                                    <Typography variant="caption" sx={{ minWidth: 120 }}>{s.title}</Typography>
                                    <Typography variant="caption">{s.departmentName}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                            Cùng tiến hành thực hiện giải thể và kiểm tra tình trạng kỹ thuật thiết bị theo văn bản đề nghị số{' '}
                            <b>{repairRequest?.number ?? plan.id}</b> ngày {repairRequest?.createdDate ?? '—'} của phân xưởng {(plan as any).sourceDepartmentName || '……………'}.
                        </Typography>
                        <Typography variant="caption" display="block">Số đăng ký: ……………… trước khi đưa vào sửa chữa cấp ………………</Typography>
                        <Typography variant="caption" display="block" sx={{ mb: 1 }}>Với tình trạng kỹ thuật và nội dung sửa chữa như sau:</Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5 }}>
                            <Table size="small" sx={{ tableLayout: 'fixed' }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 700, width: 40, fontSize: '0.75rem' }}>STT</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Tên vật tư, thiết bị</TableCell>
                                        <TableCell sx={{ fontWeight: 700, width: 50, fontSize: '0.75rem' }}>ĐVT</TableCell>
                                        <TableCell sx={{ fontWeight: 700, width: 40, fontSize: '0.75rem' }}>SL</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Tình trạng kỹ thuật</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, width: 55, fontSize: '0.75rem' }}>S.chữa</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, width: 65, fontSize: '0.75rem' }}>Thay mới</TableCell>
                                        <TableCell sx={{ fontWeight: 700, width: 80, fontSize: '0.75rem' }}>Ghi chú</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {entries.map((entry, idx) => (
                                        <>
                                            <TableRow key={`group-${idx}`} sx={{ bgcolor: '#fafafa' }}>
                                                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{String.fromCharCode(73 + idx)}/</TableCell>
                                                <TableCell colSpan={7} sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Thiết bị: {entry.deviceName}</TableCell>
                                            </TableRow>
                                            <TableRow key={`entry-${idx}`}>
                                                <TableCell sx={{ fontSize: '0.75rem' }}></TableCell>
                                                <TableCell sx={{ fontSize: '0.75rem' }}>{entry.deviceName}</TableCell>
                                                <TableCell sx={{ fontSize: '0.75rem' }}>{entry.unit}</TableCell>
                                                <TableCell sx={{ fontSize: '0.75rem' }}>{entry.quantity}</TableCell>
                                                <TableCell sx={{ fontSize: '0.75rem' }}>{entry.technicalCondition}</TableCell>
                                                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{entry.actionRepair ? '✓' : ''}</TableCell>
                                                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{entry.actionReplace ? '✓' : ''}</TableCell>
                                                <TableCell sx={{ fontSize: '0.75rem' }}>{entry.note}</TableCell>
                                            </TableRow>
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography variant="caption" display="block">Số để lại phục hồi: {recoveryCount || '…………'}.</Typography>
                        <Typography variant="caption" display="block">Số để làm phế liệu: {scrapCount || '…………'} (mục)</Typography>
                        <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>Số lượng hủy: {destroyCount || '…………'} (mục)</Typography>
                        <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                            Biên bản được lập xong lúc …… giờ cùng ngày và được các thành phần cùng thống nhất thông qua./.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            {[
                                { label: signers[2]?.departmentName || 'Phân xưởng', signer: signers[2] },
                                { label: signers[3]?.departmentName || 'Phân xưởng', signer: signers[3] },
                                { label: 'Phòng CV', signer: signers[0] },
                            ].map((col, idx) => (
                                <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
                                    <Typography variant="caption" fontWeight={700} display="block" sx={{ textTransform: 'uppercase' }}>{col.label}</Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontStyle: 'italic', mb: 3 }}>(Ký, ghi rõ họ tên)</Typography>
                                    <Box sx={{ borderBottom: '1px solid', borderColor: 'text.primary', width: '70%', mx: 'auto', mb: 0.5 }} />
                                    <Typography variant="caption" fontWeight={600} display="block">{col.signer?.name || ''}</Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">{col.signer?.title || ''}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={handleClose} color="inherit">Hủy</Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={signers.length === 0 || effectiveDeviceIds.length === 0}
                    onClick={handleSubmit}
                >
                    Tạo biên bản
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InspectionRecordDialog;