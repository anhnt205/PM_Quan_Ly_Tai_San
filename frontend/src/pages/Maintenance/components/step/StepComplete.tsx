import {
  Box,
  Typography,
  Alert,
  Chip,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import { departments } from '../../../../mockdata/mockDepartments';

interface Props {
  sourceDeptId: string;
  executionDeptId: string;
  assetCount: number;
  signerCount: number;
  status: 'draft' | 'pending-approval';
  onSubmitForApproval: () => void;
}

const StepComplete = ({ sourceDeptId, executionDeptId, assetCount, signerCount, status, onSubmitForApproval }: Props) => {
  const sourceDept = departments.find(d => d.id === sourceDeptId);
  const execDept = departments.find(d => d.id === executionDeptId);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 3 }}>
      <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />
      <Typography variant="h5" fontWeight={700}>
        Kế hoạch đã được tạo!
      </Typography>

      <Card sx={{ width: '100%', maxWidth: 500 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Đơn vị nguồn:</Typography>
              <Typography variant="body2" fontWeight={600}>{sourceDept?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Đơn vị thực hiện:</Typography>
              <Typography variant="body2" fontWeight={600}>{execDept?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Số thiết bị:</Typography>
              <Typography variant="body2" fontWeight={600}>{assetCount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Số người ký:</Typography>
              <Typography variant="body2" fontWeight={600}>{signerCount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Trạng thái:</Typography>
              <Chip
                label={status === 'draft' ? 'Bản nháp' : 'Chờ phê duyệt'}
                color={status === 'draft' ? 'default' : 'warning'}
                size="small"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* {status === 'draft' && (
        <Alert severity="info" sx={{ maxWidth: 500, width: '100%' }}>
          Kế hoạch đang ở trạng thái <strong>Bản nháp</strong>. Nhấn nút bên dưới để gửi phê duyệt.
        </Alert>
      )} */}
      {status === 'pending-approval' && (
        <Alert severity="success" sx={{ maxWidth: 500, width: '100%' }}>
          Kế hoạch đã được gửi phê duyệt. Tất cả người ký sẽ thấy kế hoạch này.
        </Alert>
      )}

      {/* {status === 'draft' && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SendIcon />}
          onClick={onSubmitForApproval}
        >
          Gửi phê duyệt
        </Button>
      )} */}
    </Box>
  );
};

export default StepComplete;
