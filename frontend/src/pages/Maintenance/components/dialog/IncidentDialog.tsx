import { useMemo, useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Divider, IconButton, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { AnnualPlan } from '../../../../mockdata/mockWorkflow';
import type { IncidentReport } from '../../../../mockdata/mockIncidentReports';
import { devices } from '../../../../mockdata/mockDevices';
import IncidentPreview from '../preview/IncidentPreview';
import StepAssets from '../step/StepAssets';
import { useAllDepartmentsQuery } from '../../../Department/Mutation';
import { useAllStaffsQuery } from '../../../Staff/Mutation';
import type { PlanSigner } from '../../../../mockdata/mockPlans';

interface Props {
  open: boolean;
  onClose: () => void;
  selectedPlans: AnnualPlan[];
  onSubmit: (rec: IncidentReport) => void;
}

const IncidentDialog = ({ open, onClose, selectedPlans, onSubmit }: Props) => {
  const [number, setNumber] = useState('');
  const [detectedAt, setDetectedAt] = useState('');
  const [reporter, setReporter] = useState('');
  const [systemName, setSystemName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'Nhẹ' | 'Trung bình' | 'Nặng' | 'Nghiêm trọng'>('Nặng');

  const planIds = selectedPlans.map(p => p.id);
  // department selection + API-backed device selector (reuse StepAssets)
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);

  // fetch departments & users from API (same as CreatePlan)
  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();

  type SimpleDept = { id: string; name: string };
  type SimpleUser = { id: string; name: string; departmentId?: string; title?: string };

  const departments: SimpleDept[] = (apiDepartments || []).map((d: any) => ({ id: String(d?.id ?? ''), name: String(d?.tenPhongBan ?? d?.name ?? '') }));
  const users: SimpleUser[] = (apiUsers || []).map((u: any) => ({
    id: String(u?.id ?? ''),
    name: String(u?.hoTen ?? u?.name ?? ''),
    departmentId: String(u?.phongBanId ?? u?.departmentId ?? ''),
    title: String(u?.tenChucVu ?? u?.chucVu ?? u?.title ?? ''),
  }));

  // reset selection when dept changes or dialog opens
  useEffect(() => {
    if (!open) return;
    setAssets([]);
    setSelectedDeviceIds([]);
  }, [open, selectedDeptId]);

  // keep device id list in sync with assets from StepAssets
  useEffect(() => {
    setSelectedDeviceIds(assets.map(a => a.deviceId));
  }, [assets]);

  // Signers (same pattern as other dialogs)
  const [signers, setSigners] = useState<PlanSigner[]>([]);
  const [addDeptId, setAddDeptId] = useState('');
  const [addUserId, setAddUserId] = useState('');
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState('');
  const [editUserId, setEditUserId] = useState('');

  const handleAddSigner = () => {
    if (!addUserId || !addDeptId) return;
    if (signers.some(s => s.userId === addUserId)) return;
    const user = users.find(u => u.id === addUserId);
    const dept = departments.find(d => d.id === addDeptId);
    if (!user || !dept) return;
    setSigners(prev => [...prev, {
      userId: user.id, userName: user.name,
      departmentId: dept.id, departmentName: dept.name,
      order: prev.length + 1, signed: false,
    }]);
    setAddDeptId(''); setAddUserId('');
  };

  const handleRemoveSigner = (userId: string) => {
    setSigners(prev => prev.filter(s => s.userId !== userId).map((s, i) => ({ ...s, order: i + 1 })));
  };

  const handleEdit = (signer: PlanSigner) => {
    setEditingSignerId(signer.userId);
    setEditDeptId(signer.departmentId);
    setEditUserId(signer.userId);
  };

  const handleSaveEdit = () => {
    setSigners(prev => prev.map(s => s.userId === editingSignerId ? {
      ...s,
      userId: editUserId,
      userName: users.find(u => u.id === editUserId)?.name || '',
      departmentId: editDeptId,
      departmentName: departments.find(d => d.id === editDeptId)?.name || '',
    } : s));
    setEditingSignerId(null);
  };

  // toggleDevice removed — selection managed by StepAssets

  const handleSubmit = () => {
    const today = new Date().toLocaleDateString('vi-VN');
      const rec: IncidentReport = {
      id: `INC-${Date.now()}`,
      planIds,
      number: number || `INC-${String(Date.now()).slice(-6)}`,
      detectedAt: detectedAt || new Date().toISOString(),
      reporter,
      reporterDeptId: selectedDeptId,
      systemName,
      location,
      description,
      severity,
      deviceEntries: assets.map(a => {
        const id = a.deviceId || a.deviceId;
        const d = devices.find(dd => dd.id === id);
        return { deviceId: id, deviceName: d?.name || (a.tenTaiSan || id), position: d?.location, note: '' };
      }),
      signers: signers,
      status: 'cho-duyet',
      createdDate: today,
    };
    onSubmit(rec);
    // reset minimal state
    setNumber(''); setDetectedAt(''); setReporter(''); setSystemName(''); setLocation(''); setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>Tạo Phiếu báo sự cố thiết bị</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Thông tin</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Số phiếu" value={number} onChange={e => setNumber(e.target.value)} size="small" fullWidth />
                  <FormControl size="small">
                    <InputLabel>Phòng ban báo cáo</InputLabel>
                    <Select value={selectedDeptId} label="Phòng ban báo cáo" onChange={e => setSelectedDeptId(e.target.value)}>
                      <MenuItem value="">— Chọn phòng ban —</MenuItem>
                      {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField label="Ngày giờ phát hiện" value={detectedAt} onChange={e => setDetectedAt(e.target.value)} placeholder="YYYY-MM-DD hh:mm" size="small" fullWidth />
                  <TextField label="Người báo" value={reporter} onChange={e => setReporter(e.target.value)} size="small" fullWidth />
                  <TextField label="Hệ thống / TB" value={systemName} onChange={e => setSystemName(e.target.value)} size="small" fullWidth />
                  <TextField label="Vị trí" value={location} onChange={e => setLocation(e.target.value)} size="small" fullWidth />
                  <FormControl size="small">
                    <InputLabel>Mức độ</InputLabel>
                    <Select value={severity} label="Mức độ" onChange={e => setSeverity(e.target.value as any)}>
                      <MenuItem value="Nhẹ">Nhẹ</MenuItem>
                      <MenuItem value="Trung bình">Trung bình</MenuItem>
                      <MenuItem value="Nặng">Nặng</MenuItem>
                      <MenuItem value="Nghiêm trọng">Nghiêm trọng</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="Mô tả tình trạng" value={description} onChange={e => setDescription(e.target.value)} multiline rows={4} size="small" fullWidth />
                </Box>
              </Box>

              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>Danh sách thiết bị liên quan</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {!selectedDeptId && <Typography variant="body2" color="text.secondary">Chọn phòng ban để xem thiết bị.</Typography>}
                  {selectedDeptId && (
                    <StepAssets sourceDeptId={selectedDeptId} assets={assets} onAssetsChange={setAssets} />
                  )}
                </Box>
              </Box>
            </Box>

            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Quy trình duyệt
              </Typography>

              <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                {signers.length > 0 ? (
                  <Box sx={{ position: 'relative', pl: 5 }}>
                    <Box sx={{ position: 'absolute', left: 16, top: 8, bottom: 8, width: '1px', bgcolor: 'divider' }} />
                    {signers.map((s, idx) => {
                      const user = users.find(u => u.id === s.userId);
                      const isEditingThis = editingSignerId === s.userId;
                      return (
                        <Box key={s.userId} sx={{ position: 'relative', mb: 1.5 }}>
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
                                  <Button size="small" onClick={() => setEditingSignerId(null)}>Hủy</Button>
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
                                  }}>{user?.name?.charAt(0) ?? '?'}</Box>
                                  <Box>
                                    <Typography fontWeight={600} fontSize={13}>{user?.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{user?.title}</Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                      <Typography variant="caption" color="text.secondary">{departments.find(d => d.id === s.departmentId)?.name}</Typography>
                                    </Box>
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <Button size="small" variant="outlined" onClick={() => handleEdit(s)}>Sửa</Button>
                                  <Button size="small" color="error" variant="outlined" onClick={() => handleRemoveSigner(s.userId)}>Xóa</Button>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">Chưa có người duyệt</Typography>
                )}
              </Box>

              {/* Form thêm người duyệt */}
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
                      <MenuItem key={u.id} value={u.id} disabled={signers.some(s => s.userId === u.id)}>{u.name} – {u.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button variant="contained" onClick={handleAddSigner} disabled={!addUserId}>Thêm người duyệt</Button>
              </Box>
            </Box>
          </Box>
          {/* ── Hàng dưới: Preview FULL WIDTH ── */}
          <Box>
            <IncidentPreview
              number={number}
              detectedAt={detectedAt}
              reporter={reporter}
              reporterDeptId={selectedDeptId}
              signers={signers}
              systemName={systemName}
              location={location}
              description={description}
              severity={severity}
              deviceIds={selectedDeviceIds}
              planIds={planIds}
            />
          </Box>

        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">Hủy</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={selectedDeviceIds.length === 0 || !description}>
          Tạo Phiếu và Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncidentDialog;
