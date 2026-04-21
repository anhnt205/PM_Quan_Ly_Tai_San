import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Typography, Divider, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, Select, MenuItem, FormControl, InputLabel, Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { AnnualPlan } from '../../../../mockdata/mockWorkflow';
import type { IncidentReport } from '../../../../mockdata/mockIncidentReports';
import type { IncidentInspectionRecord, IncidentInspectionItem, IncidentInspectionSigner } from '../../../../mockdata/mockIncidentInspection';
import IncidentInspectionPreview from '../preview/IncidentInspectionPreview';
import { useAllDepartmentsQuery } from '../../../Department/Mutation';
import { useAllStaffsQuery } from '../../../Staff/Mutation';

interface Props {
    open: boolean;
    onClose: () => void;
    plan: AnnualPlan;
    incidentReport: IncidentReport;
    onSubmit: (record: IncidentInspectionRecord) => void;
}

const IncidentInspectionDialog = ({ open, onClose, plan, incidentReport, onSubmit }: Props) => {
    const [number, setNumber] = useState('');
    const [inspectionDate, setInspectionDate] = useState('');
    const [location, setLocation] = useState(incidentReport.location || '');
    const [findings, setFindings] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [items, setItems] = useState<IncidentInspectionItem[]>([
        {
            stt: 1,
            itemName: '',
            repairLevel: '',
            quantity: 1,
            condition: '',
            actionRepair: false,
            actionReplace: false,
            note: '',
        },
    ]);
    const [signers, setSigners] = useState<IncidentInspectionSigner[]>([]);
    const [addDeptId, setAddDeptId] = useState('');
    const [addUserId, setAddUserId] = useState('');

    const { data: apiDepartments = [] } = useAllDepartmentsQuery();
    const { data: apiUsers = [] } = useAllStaffsQuery();

    type SimpleDept = { id: string; name: string };
    type SimpleUser = { id: string; name: string; departmentId?: string; title?: string };

    const departments: SimpleDept[] = (apiDepartments || []).map((d: any) => ({
        id: String(d?.id ?? ''),
        name: String(d?.tenPhongBan ?? d?.name ?? ''),
    }));

    const users: SimpleUser[] = (apiUsers || []).map((u: any) => ({
        id: String(u?.id ?? ''),
        name: String(u?.hoTen ?? u?.name ?? ''),
        departmentId: String(u?.phongBanId ?? u?.departmentId ?? ''),
        title: String(u?.tenChucVu ?? u?.chucVu ?? u?.title ?? ''),
    }));

    const handleAddItem = () => {
        setItems([
            ...items,
            {
                stt: items.length + 1,
                itemName: '',
                repairLevel: '',
                quantity: 1,
                condition: '',
                actionRepair: false,
                actionReplace: false,
                note: '',
            },
        ]);
    };

    const handleRemoveItem = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx).map((item, i) => ({ ...item, stt: i + 1 })));
    };

    const handleItemChange = (idx: number, field: keyof IncidentInspectionItem, value: any) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: value };
        setItems(updated);
    };

    const handleAddSigner = () => {
        if (!addUserId || !addDeptId) return;
        if (signers.some(s => s.name === users.find(u => u.id === addUserId)?.name)) return;

        const user = users.find(u => u.id === addUserId);
        const dept = departments.find(d => d.id === addDeptId);
        if (!user || !dept) return;

        setSigners([
            ...signers,
            {
                order: signers.length + 1,
                name: user.name,
                title: user.title || '',
                departmentName: dept.name,
                signed: false,
            },
        ]);
        setAddDeptId('');
        setAddUserId('');
    };

    const handleRemoveSigner = (idx: number) => {
        setSigners(signers.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 })));
    };

    const handleSubmit = () => {
        const today = new Date().toLocaleDateString('vi-VN');
        const record: IncidentInspectionRecord = {
            id: `BBKTKSC-${Date.now()}`,
            incidentReportId: incidentReport.id,
            planId: plan.id,
            number: number || `BBKTKSC/PX-${String(Date.now()).slice(-4)}`,
            inspectionDate: inspectionDate || today,
            location,
            items,
            findings,
            recommendation,
            signers,
            status: 'cho-duyet',
            createdDate: today,
        };
        onSubmit(record);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={600}>
                    Tạo Biên bản kiểm tra sự cố — {incidentReport.number}
                </Typography>
                <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 3, overflow: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* ──── Top section: 2-column layout ──── */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 3 }}>
                        {/* Left column: Thông tin cơ bản */}
                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2.5 }}>
                            <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                Thông tin
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    label="Số biên bản"
                                    value={number}
                                    onChange={e => setNumber(e.target.value)}
                                    size="small"
                                    fullWidth
                                />
                                <TextField
                                    label="Ngày kiểm tra"
                                    value={inspectionDate}
                                    onChange={e => setInspectionDate(e.target.value)}
                                    placeholder="YYYY-MM-DD"
                                    size="small"
                                    fullWidth
                                />
                                <TextField
                                    label="Vị trí"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    size="small"
                                    fullWidth
                                    sx={{ gridColumn: '1 / -1' }}
                                />
                                <TextField
                                    label="Nhận xét, kết luận"
                                    value={findings}
                                    onChange={e => setFindings(e.target.value)}
                                    multiline
                                    rows={3}
                                    size="small"
                                    fullWidth
                                    sx={{ gridColumn: '1 / -1' }}
                                />
                                <TextField
                                    label="Đề nghị biện pháp xử lý"
                                    value={recommendation}
                                    onChange={e => setRecommendation(e.target.value)}
                                    multiline
                                    rows={3}
                                    size="small"
                                    fullWidth
                                    sx={{ gridColumn: '1 / -1' }}
                                />
                            </Box>
                        </Box>

                        {/* Right column: Người ký */}
                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="subtitle1" fontWeight={600} mb={2}>Người ký biên bản</Typography>
                            <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                                {signers.length > 0 ? (
                                    <Table size="small" sx={{ mb: 2 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>STT</TableCell>
                                                <TableCell>Người ký</TableCell>
                                                <TableCell>Chức vụ</TableCell>
                                                <TableCell>Đơn vị</TableCell>
                                                <TableCell align="center">Xóa</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {signers.map((s, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{s.order}</TableCell>
                                                    <TableCell>{s.name}</TableCell>
                                                    <TableCell>{s.title}</TableCell>
                                                    <TableCell>{s.departmentName}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton size="small" color="error" onClick={() => handleRemoveSigner(idx)}>
                                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">Chưa có người ký</Typography>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Đơn vị</InputLabel>
                                    <Select value={addDeptId} label="Đơn vị" onChange={e => { setAddDeptId(e.target.value); setAddUserId(''); }}>
                                        {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" fullWidth disabled={!addDeptId}>
                                    <InputLabel>Người ký</InputLabel>
                                    <Select value={addUserId} label="Người ký" onChange={e => setAddUserId(e.target.value)}>
                                        {users.filter(u => u.departmentId === addDeptId).map(u => (
                                            <MenuItem key={u.id} value={u.id}>
                                                {u.name} – {u.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button variant="contained" onClick={handleAddSigner} disabled={!addUserId}>Thêm</Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* ──── Danh sách kiểm tra (full width) ──── */}
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>Danh sách kiểm tra sự cố</Typography>
                            <Button size="small" startIcon={<AddIcon />} onClick={handleAddItem}>Thêm dòng</Button>
                        </Box>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                                        <TableCell sx={{ fontWeight: 700 }} align="center">STT</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Tên vật tư, thiết bị</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Cấp BD</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="center">SL</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Tình trạng thiết bị</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="center">SC</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="center">Thay mới</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
                                        <TableCell align="center">Xóa</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell align="center">{item.stt}</TableCell>
                                            <TableCell>
                                                <TextField value={item.itemName} onChange={e => handleItemChange(idx, 'itemName', e.target.value)} size="small" fullWidth variant="standard" />
                                            </TableCell>
                                            <TableCell>
                                                <Select value={item.repairLevel} onChange={e => handleItemChange(idx, 'repairLevel', e.target.value)} size="small" variant="standard" fullWidth>
                                                    <MenuItem value="">—</MenuItem>
                                                    <MenuItem value="Chăm sóc thường xuyên">Chăm sóc thường xuyên</MenuItem>
                                                    <MenuItem value="Sửa chữa định kỳ">Sửa chữa định kỳ</MenuItem>
                                                    <MenuItem value="Sửa chữa thử nghiệm">Sửa chữa thử nghiệm</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField type="number" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value || '1'))} size="small" inputProps={{ min: 1 }} variant="standard" sx={{ width: '60px' }} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField value={item.condition} onChange={e => handleItemChange(idx, 'condition', e.target.value)} size="small" fullWidth variant="standard" placeholder="Mô tả tình trạng" />
                                            </TableCell>
                                            <TableCell align="center"><Checkbox checked={item.actionRepair} onChange={e => handleItemChange(idx, 'actionRepair', e.target.checked)} /></TableCell>
                                            <TableCell align="center"><Checkbox checked={item.actionReplace} onChange={e => handleItemChange(idx, 'actionReplace', e.target.checked)} /></TableCell>
                                            <TableCell>
                                                <TextField value={item.note} onChange={e => handleItemChange(idx, 'note', e.target.value)} size="small" fullWidth variant="standard" />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" color="error" onClick={() => handleRemoveItem(idx)} disabled={items.length === 1}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* ──── Preview (full width) ──── */}
                    <Box>
                        <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
                            Xem trước biên bản
                        </Typography>
                        <IncidentInspectionPreview
                            number={number}
                            inspectionDate={inspectionDate}
                            location={location}
                            findings={findings}
                            recommendation={recommendation}
                            items={items}
                            signers={signers}
                        />
                    </Box>
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={onClose} color="inherit">
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={items.some(item => !item.itemName || !item.repairLevel)}
                >
                    Tạo biên bản
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default IncidentInspectionDialog;