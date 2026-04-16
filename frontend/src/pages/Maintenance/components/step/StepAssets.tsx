import { useState, useEffect } from 'react';
import {
    Box, Typography, Chip, TextField, Checkbox,
    Alert, Divider, Button, Dialog,
    DialogTitle, DialogContent, DialogActions, Table,
    TableHead, TableRow, TableCell, TableBody, IconButton,
    Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { devices } from '../../../../mockdata/mockDevices';
import { departmentDeviceMap } from '../../../../mockdata/mockDepartments';
import { TableViewOutlined } from '@mui/icons-material';

interface Props {
    sourceDeptId: string;
    selectedAssetIds: string[];
    quantities: Record<string, number>;
    onSelectionChange: (ids: string[]) => void;
    onQuantityChange: (quantities: Record<string, number>) => void;
}

const StepAssets = ({ sourceDeptId, selectedAssetIds, quantities, onSelectionChange, onQuantityChange }: Props) => {
    const deptDeviceIds = departmentDeviceMap[sourceDeptId] || [];
    const deptDevices = devices.filter(d => deptDeviceIds.includes(d.id));

    const [search, setSearch] = useState('');
    const [openTable, setOpenTable] = useState(false);
    const [localSelection, setLocalSelection] = useState<string[]>(selectedAssetIds);
    const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(quantities || {});

    useEffect(() => setLocalSelection(selectedAssetIds), [selectedAssetIds]);
    useEffect(() => setLocalQuantities(quantities || {}), [quantities]);

    if (deptDevices.length === 0) {
        return <Typography color="text.secondary" fontSize={14}>Đơn vị này chưa có thiết bị nào.</Typography>;
    }

    const filtered = search.trim()
        ? deptDevices.filter(d =>
            d.id.toLowerCase().includes(search.toLowerCase()) ||
            d.name.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    const toggleDevice = (id: string) => {
        if (selectedAssetIds.includes(id)) {
            const newSel = selectedAssetIds.filter(a => a !== id);
            const { [id]: _, ...rest } = quantities || {};
            onSelectionChange(newSel);
            onQuantityChange(rest);
        } else {
            const dev = devices.find(d => d.id === id);
            onSelectionChange([...selectedAssetIds, id]);
            onQuantityChange({ ...(quantities || {}), [id]: quantities?.[id] ?? dev?.quantity ?? 1 });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField size="small" placeholder="Tìm theo mã hoặc tên thiết bị..." value={search} onChange={e => setSearch(e.target.value)} fullWidth />
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenTable(true)}
                    sx={{ minWidth: 36, px: 1 }} // thu nhỏ button cho gọn
                >
                    <TableViewOutlined fontSize="small" />
                </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                Chọn thiết bị và nhập số lượng — đã chọn <strong>{selectedAssetIds.length}</strong>/{deptDevices.length}
            </Typography>

            {!search.trim() ? (
                <Alert severity="info">Nhập từ khóa để tìm thiết bị</Alert>
            ) : filtered.length === 0 ? (
                <Alert severity="warning">Không tìm thấy thiết bị</Alert>
            ) : (
                filtered.map((device, idx) => {
                    const isSelected = selectedAssetIds.includes(device.id);
                    return (
                        <Box key={device.id}>
                            <Box
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                    p: 1.5, borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                    bgcolor: isSelected ? 'primary.50' : 'background.paper',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    '&:hover': { borderColor: 'primary.light', bgcolor: 'grey.50' }
                                }}
                                onClick={() => toggleDevice(device.id)}
                            >
                                <Checkbox
                                    checked={isSelected}
                                    size="small"
                                    onClick={e => e.stopPropagation()}
                                    onChange={() => toggleDevice(device.id)}
                                    sx={{ p: 0 }}
                                />

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography fontSize={13} fontWeight={isSelected ? 600 : 400} noWrap>
                                        {device.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                                        <Chip label={device.group} size="small" sx={{ fontSize: 10, height: 18 }} />
                                        <Chip
                                            label={device.assetType}
                                            size="small"
                                            color={device.assetType === 'TSCĐ' ? 'primary' : 'default'}
                                            variant="outlined"
                                            sx={{ fontSize: 10, height: 18 }}
                                        />
                                        <Chip
                                            label={device.status === 'active' ? 'Hoạt động' : device.status === 'maintenance' ? 'Bảo dưỡng' : 'Hỏng'}
                                            size="small"
                                            color={device.status === 'active' ? 'success' : device.status === 'maintenance' ? 'warning' : 'error'}
                                            sx={{ fontSize: 10, height: 18 }}
                                        />
                                    </Box>
                                </Box>

                                {isSelected && (
                                    <TextField
                                        type="number"
                                        size="small"
                                        label="SL"
                                        value={quantities[device.id] ?? device.quantity ?? 1}
                                        onChange={e => {
                                            const val = Math.max(1, parseInt(e.target.value) || 1);
                                            onQuantityChange({ ...quantities, [device.id]: val });
                                        }}
                                        onClick={e => e.stopPropagation()}
                                        inputProps={{ min: 1 }}
                                        sx={{ width: 80, flexShrink: 0 }}
                                    />
                                )}
                            </Box>
                        </Box>
                    );
                })
            )}

            {/* Large selection dialog */}
            <Dialog open={openTable} onClose={() => setOpenTable(false)} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Chọn thiết bị
                    <IconButton size="small" onClick={() => setOpenTable(false)}><CloseIcon fontSize="small" /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Paper sx={{ width: '100%', overflow: 'auto' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Chọn</TableCell>
                                    <TableCell>Mã</TableCell>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Nhóm</TableCell>
                                    <TableCell>Loại</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>SL</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deptDevices.map(dev => (
                                    <TableRow key={dev.id} hover>
                                        <TableCell>
                                            <Checkbox checked={localSelection.includes(dev.id)} onChange={() => {
                                                if (localSelection.includes(dev.id)) setLocalSelection(localSelection.filter(id => id !== dev.id));
                                                else setLocalSelection([...localSelection, dev.id]);
                                            }} />
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace' }}>{dev.id}</TableCell>
                                        <TableCell>{dev.name}</TableCell>
                                        <TableCell>{dev.group}</TableCell>
                                        <TableCell>{dev.assetType}</TableCell>
                                        <TableCell>{dev.status}</TableCell>
                                        <TableCell>
                                            <TextField size="small" type="number" value={localQuantities[dev.id] ?? dev.quantity ?? 1}
                                                onChange={e => setLocalQuantities({ ...localQuantities, [dev.id]: Math.max(1, parseInt(e.target.value) || 1) })}
                                                sx={{ width: 100 }} inputProps={{ min: 1 }} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTable(false)}>Hủy</Button>
                    <Button variant="contained" onClick={() => {
                        onSelectionChange(localSelection);
                        onQuantityChange(localQuantities);
                        setOpenTable(false);
                    }}>Áp dụng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StepAssets;
