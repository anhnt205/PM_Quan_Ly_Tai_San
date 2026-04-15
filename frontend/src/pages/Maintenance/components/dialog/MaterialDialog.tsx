import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, IconButton, Divider, FormControl, InputLabel, Select, MenuItem, Alert,
} from '@mui/material';
import RecyclingIcon from '@mui/icons-material/Recycling';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import type { AnnualPlan } from '../../../../mockdata/mockWorkflow';
import type { RepairRequest } from '../../../../mockdata/mockRepairRequests';
import type {
  AcceptanceTestRecord,
  MaterialQualityRecord,
  MaterialRecoveryItem,
  InspectionSigner,
} from '../../../../mockdata/mockInspectionRecords';
import { departments, users } from '../../../../mockdata/mockDepartments';

interface Props {
  open: boolean;
  onClose: () => void;
  plan: AnnualPlan;
  repairRequest: RepairRequest;
  acceptanceRecord: AcceptanceTestRecord;
  onSubmit: (record: MaterialQualityRecord) => void;
}

const MaterialDialog = ({ open, onClose, plan, repairRequest, acceptanceRecord, onSubmit }: Props) => {
  const [number, setNumber] = useState(`BB-DG-${repairRequest.id}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState(acceptanceRecord.location || '');
  const [repairLevel, setRepairLevel] = useState(acceptanceRecord.repairLevel || '');
  const [deviceName, setDeviceName] = useState(acceptanceRecord.deviceName || '');
  const [deviceType, setDeviceType] = useState('');
  const [deviceSerial, setDeviceSerial] = useState(acceptanceRecord.registrationNumber || '');
  const [managementUnit, setManagementUnit] = useState((plan as any).sourceDepartmentName || '');
  const [recoveryCount, setRecoveryCount] = useState(0);
  const [scrapCount, setScrapCount] = useState(0);
  const [destroyCount, setDestroyCount] = useState(0);

  const [items, setItems] = useState<MaterialRecoveryItem[]>(() => (
    acceptanceRecord.materialItems && acceptanceRecord.materialItems.length > 0
      ? acceptanceRecord.materialItems.map(mi => ({ name: mi.name, unit: mi.unit, quantity: mi.quantity, condition: '', treatment: '', note: '' }))
      : [{ name: '', unit: 'Cái', quantity: 1, condition: '', treatment: '', note: '' }]
  ));

  const [signers, setSigners] = useState<InspectionSigner[]>([...acceptanceRecord.signers]);

  const [addDeptId, setAddDeptId] = useState('');
  const [addUserId, setAddUserId] = useState('');
  const [editingSignerIdx, setEditingSignerIdx] = useState<number | null>(null);
  const [editDeptId, setEditDeptId] = useState('');
  const [editUserId, setEditUserId] = useState('');

  const addItem = () => setItems(prev => [...prev, { name: '', unit: 'Cái', quantity: 1, condition: '', treatment: '', note: '' }]);
  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof MaterialRecoveryItem, value: string | number) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));
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
    const record: MaterialQualityRecord = {
      id: `DG-${Date.now()}`,
      acceptanceRecordId: acceptanceRecord.id,
      repairRequestId: repairRequest.id,
      planId: plan.id,
      number,
      date,
      location,
      repairLevel,
      deviceName,
      deviceType,
      deviceSerial,
      managementUnit,
      items,
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
  const d = new Date(date);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RecyclingIcon color="warning" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Biên bản đánh giá chất lượng vật tư phụ tùng thu hồi sau sửa chữa
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Căn cứ BB nghiệm thu: {acceptanceRecord.number}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: 'auto' }}>

        {/* 2-column grid: Thông tin | Quy trình duyệt */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 3 }}>

          {/* Col 1: Thông tin */}
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>Thông tin</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Số biên bản" value={number} onChange={e => setNumber(e.target.value)} placeholder={`VD: BB-DG-${repairRequest.id}`} size="small" fullWidth />
              <TextField label="Ngày lập" type="date" value={date} onChange={e => setDate(e.target.value)} size="small" fullWidth InputLabelProps={{ shrink: true }} />
              <TextField label="Địa điểm (Tại...)" value={location} onChange={e => setLocation(e.target.value)} size="small" fullWidth placeholder="vd: Phân xưởng khai thác 1, khu vực A" />
              <TextField label="Cấp sửa chữa" value={repairLevel} onChange={e => setRepairLevel(e.target.value)} size="small" fullWidth placeholder="vd: Sửa chữa nhỏ" />
              <TextField label="Của thiết bị" value={deviceName} onChange={e => setDeviceName(e.target.value)} size="small" fullWidth />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Kiểu" value={deviceType} onChange={e => setDeviceType(e.target.value)} size="small" sx={{ flex: 1 }} />
                <TextField label="Số (đăng ký)" value={deviceSerial} onChange={e => setDeviceSerial(e.target.value)} size="small" sx={{ flex: 1 }} />
              </Box>
              <TextField label="Đơn vị quản lý vận hành" value={managementUnit} onChange={e => setManagementUnit(e.target.value)} size="small" fullWidth />
            </Box>
          </Box>

          {/* Col 2: Quy trình duyệt */}
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

        {/* Full-width: Danh mục vật tư thu hồi */}
        <Box sx={{ mt: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600}>Danh mục vật tư thu hồi</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={addItem} variant="outlined">Thêm dòng</Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700, width: 40 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tên vật tư, thiết bị</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 55 }}>ĐVT</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 50 }}>SL</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tình trạng</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Biện pháp xử lý</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 80 }}>Ghi chú</TableCell>
                  <TableCell sx={{ width: 36 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{String(idx + 1).padStart(2, '0')}</TableCell>
                    <TableCell>
                      <TextField value={item.name} size="small" variant="standard" fullWidth onChange={e => updateItem(idx, 'name', e.target.value)} placeholder="Tên vật tư..." />
                    </TableCell>
                    <TableCell>
                      <TextField value={item.unit} size="small" variant="standard" onChange={e => updateItem(idx, 'unit', e.target.value)} inputProps={{ style: { width: 36 } }} />
                    </TableCell>
                    <TableCell>
                      <TextField type="number" value={item.quantity} size="small" variant="standard" onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)} inputProps={{ min: 1, style: { width: 36 } }} />
                    </TableCell>
                    <TableCell>
                      <TextField value={item.condition} size="small" variant="standard" fullWidth onChange={e => updateItem(idx, 'condition', e.target.value)} placeholder="Mô tả tình trạng..." />
                    </TableCell>
                    <TableCell>
                      <TextField value={item.treatment} size="small" variant="standard" fullWidth onChange={e => updateItem(idx, 'treatment', e.target.value)} placeholder="Phục hồi / Phế liệu / Hủy" />
                    </TableCell>
                    <TableCell>
                      <TextField value={item.note} size="small" variant="standard" fullWidth onChange={e => updateItem(idx, 'note', e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => removeItem(idx)} color="error" disabled={items.length === 1}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Số lượng phân loại */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField label="Số để lại phục hồi" type="number" size="small" value={recoveryCount} onChange={e => setRecoveryCount(Math.max(0, parseInt(e.target.value) || 0))} sx={{ width: 200 }} />
            <TextField label="Số phế liệu" type="number" size="small" value={scrapCount} onChange={e => setScrapCount(Math.max(0, parseInt(e.target.value) || 0))} sx={{ width: 200 }} />
            <TextField label="Số hủy" type="number" size="small" value={destroyCount} onChange={e => setDestroyCount(Math.max(0, parseInt(e.target.value) || 0))} sx={{ width: 200 }} />
          </Box>
        </Box>

        {/* Full-width Preview */}
        <Box sx={{ mt: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5, fontFamily: 'serif', fontSize: '0.875rem', lineHeight: 1.8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="caption" display="block">TẬP ĐOÀN CÔNG NGHIỆP</Typography>
              <Typography variant="caption" display="block">THAN – KHOÁNG SẢN VIỆT NAM</Typography>
              <Typography variant="caption" display="block" fontWeight={700}>CÔNG <u>TY THAN UÔNG BÍ</u> - TKV</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" display="block" fontWeight={700}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
              <Typography variant="caption" display="block" fontWeight={700}><u>Độc lập – Tự do – Hạnh phúc</u></Typography>
            </Box>
          </Box>

          <Typography variant="caption" display="block" sx={{ textAlign: 'right', fontStyle: 'italic', mb: 2 }}>
            Quảng Ninh, ngày {d.getDate()} tháng {d.getMonth() + 1} năm {d.getFullYear()}
          </Typography>

          <Typography variant="subtitle2" align="center" fontWeight={700} sx={{ color: 'primary.main', mb: 0.25 }}>BIÊN BẢN</Typography>
          <Typography variant="subtitle2" align="center" fontWeight={700} sx={{ mb: 2 }}>ĐÁNH GIÁ CHẤT LƯỢNG VẬT TƯ PHỤ TÙNG THU HỒI SAU SỬA CHỮA</Typography>

          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>Hôm nay, ngày {d.getDate()} tháng {d.getMonth() + 1} năm {d.getFullYear()}. Tại {location || '………………………'}</Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>Hội đồng đánh giá chất lượng vật tư phụ tùng thu hồi sau sửa chữa cấp: <b>{repairLevel || '……………'}</b></Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>Của thiết bị: <b>{deviceName || '……………'}</b> Kiểu: {deviceType || '………'} Số: {deviceSerial || '……………………………'}</Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>Đơn vị quản lý vận hành: {managementUnit || '………………'}</Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>Thành phần gồm:</Typography>
          <Box sx={{ pl: 2, mb: 1.5 }}>
            {signers.map((s, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 3, mb: 0.25 }}>
                <Typography variant="caption" sx={{ minWidth: 16 }}>{i + 1}.</Typography>
                <Typography variant="caption" sx={{ minWidth: 150, fontWeight: 500 }}>{s.name || '………………………'}</Typography>
                <Typography variant="caption" sx={{ minWidth: 120 }}>{s.title}</Typography>
                <Typography variant="caption">{s.departmentName}</Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>Đã tiến hành kiểm tra chi tiết các vật tư phụ tùng thu hồi sau sửa chữa cụ thể như sau:</Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5 }}>
            <Table size="small" sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700, width: 40, fontSize: '0.72rem' }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem' }}>Tên vật tư, thiết bị</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 45, fontSize: '0.72rem' }}>ĐVT</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 40, fontSize: '0.72rem' }}>SL</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem' }}>Tình trạng</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem' }}>Biện pháp xử lý</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 70, fontSize: '0.72rem' }}>Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{String(idx + 1).padStart(2, '0')}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{item.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{item.unit}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{item.quantity}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{item.condition}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{item.treatment}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{item.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="caption" display="block">Số để lại phục hồi phục vụ cho sản xuất: {recoveryCount || '…………'}.</Typography>
          <Typography variant="caption" display="block">Số để làm phế liệu: {scrapCount || '…………'} (mục)</Typography>
          <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>Số lượng hủy: {destroyCount || '…………'} (mục)</Typography>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            {[
              { label: signers[2]?.departmentName || 'Phân xưởng', signer: signers[2] },
              { label: signers[3]?.departmentName || 'Phân xưởng', signer: signers[3] },
              { label: 'Phòng CV', signer: signers[0] },
              { label: 'PHÓ GIÁM ĐỐC', signer: signers[signers.length - 1] },
            ].map((col, idx) => (
              <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="caption" fontWeight={700} display="block" sx={{ textTransform: 'uppercase', fontSize: idx === 3 ? '0.75rem' : '0.7rem' }}>{col.label}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontStyle: 'italic', mb: 3, fontSize: '0.7rem' }}>(Ký, ghi rõ họ tên)</Typography>
                <Box sx={{ borderBottom: '1px solid', borderColor: 'text.primary', width: '75%', mx: 'auto', mb: 0.5 }} />
                <Typography variant="caption" fontWeight={600} display="block" sx={{ fontSize: '0.72rem' }}>{col.signer?.name || ''}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.7rem' }}>{col.signer?.title || ''}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Chip label="Trạng thái: Chờ duyệt" color="warning" size="small" />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>* Biên bản này thực tế có thể có hoặc không (tùy trường hợp cụ thể)</Typography>
          </Box>
        </Box>

      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit">Hủy</Button>
        <Button variant="contained" color="warning" disabled={signers.length === 0} onClick={handleSubmit}>Tạo biên bản</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialDialog;