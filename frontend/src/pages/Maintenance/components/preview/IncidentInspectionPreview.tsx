import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import { useAllDepartmentsQuery } from '../../../Department/Mutation';
import type { IncidentInspectionRecord, IncidentInspectionSigner } from '../../../../mockdata/mockIncidentInspection';

interface Props {
  number?: string;
  inspectionDate?: string;
  location?: string;
  findings?: string;
  recommendation?: string;
  items?: Array<{
    stt: number;
    itemName: string;
    repairLevel: string;
    quantity: number;
    condition: string;
    actionRepair: boolean;
    actionReplace: boolean;
    note: string;
  }>;
  signers?: IncidentInspectionSigner[];
}

const IncidentInspectionPreview = ({
  number,
  inspectionDate,
  location,
  findings,
  recommendation,
  items = [],
  signers = [],
}: Props) => {
  const { data: apiDepartments = [] } = useAllDepartmentsQuery();

  const today = new Date();
  const dateStr = inspectionDate || `Quảng Ninh, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 0, fontFamily: '"Times New Roman", serif' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
            TẬP ĐOÀN CÔNG NGHIỆP THAN - KHOÁNG SẢN VIỆT NAM
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
            CÔNG TY THAN UÔNG BÍ - TKV
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit', color: '#0066cc' }}>
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}>
            Độc lập – Tự do – Hạnh phúc
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ textAlign: 'right', fontStyle: 'italic', fontSize: 12, mb: 2, fontFamily: 'inherit' }}>
        {dateStr}
      </Typography>

      {/* Title */}
      <Typography sx={{ textAlign: 'center', fontWeight: 700, fontSize: 14, color: '#0066cc', mb: 1, fontFamily: 'inherit' }}>
        BIÊN BAN
      </Typography>
      <Typography sx={{ textAlign: 'center', fontWeight: 700, fontSize: 14, color: '#0066cc', mb: 2, fontFamily: 'inherit' }}>
        KIỂM TRA SỰ CỐ THIẾT BỊ
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Chủ tịch, Hôm nay, Chứng tỏ gồm */}
      <Box sx={{ mb: 2, fontSize: 12 }}>
        <Typography sx={{ fontFamily: 'inherit', mb: 1 }}>
          Hôm nay, ngày ....... tháng ........ năm ........... Tại .....................................................................
        </Typography>
        <Typography sx={{ fontFamily: 'inherit', fontWeight: 600, mb: 1 }}>Chứng tỏ gồm:</Typography>
        <Box sx={{ ml: 2 }}>
          <Typography sx={{ fontFamily: 'inherit', mb: 0.5 }}>1. Nguyễn Văn A ...................... Phó phòng ...................... Phòng CV</Typography>
          <Typography sx={{ fontFamily: 'inherit', mb: 0.5 }}>2. Trần Văn B ...................... Nhân viên ...................... Phòng CV</Typography>
          <Typography sx={{ fontFamily: 'inherit', mb: 0.5 }}>3. Lê Văn C ...................... Phó quản đốc ...................... PX K12</Typography>
          <Typography sx={{ fontFamily: 'inherit', mb: 1 }}>4. Nguyễn Văn D ...................... Phó quản đốc ...................... PX CDL2</Typography>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ mb: 2, fontSize: 12 }}>
        <Typography sx={{ fontFamily: 'inherit', mb: 1 }}>
          Đã tiến hành kiểm tra tình trạng kỹ thuật thiết bị bị: .............................................................................
        </Typography>
        <Typography sx={{ fontFamily: 'inherit', mb: 1 }}>Số dãng ký: ..............................................................................</Typography>
        <Typography sx={{ fontFamily: 'inherit', mb: 1 }}>Sau khi xay ra sự cố vào lúc ....... giờ ....... ngày ....... tháng ....... năm ..........</Typography>
      </Box>

      {/* Findings */}
      <Box sx={{ mb: 2, fontSize: 12 }}>
        <Typography sx={{ fontFamily: 'inherit', fontWeight: 600, mb: 1 }}>1. Nội dung sự cố:</Typography>
        <Typography sx={{ fontFamily: 'inherit', ml: 2, mb: 2 }}>
          {findings || '.......................................................................'}
        </Typography>

        <Typography sx={{ fontFamily: 'inherit', fontWeight: 600, mb: 1 }}>2. Điều kiện văn hành: ...............................................................................</Typography>
        <Typography sx={{ fontFamily: 'inherit', ml: 2, mb: 2 }}>..........................................................................</Typography>

        <Typography sx={{ fontFamily: 'inherit', fontWeight: 600, mb: 1 }}>3. Nội dung sinh chảy báo dương gián nhật: ........................................................</Typography>
        <Typography sx={{ fontFamily: 'inherit', ml: 2, mb: 2 }}>..........................................................................</Typography>

        <Typography sx={{ fontFamily: 'inherit', fontWeight: 600, mb: 1 }}>4. Tính trạng thiết bị: ...............................................................................</Typography>
        <Typography sx={{ fontFamily: 'inherit', ml: 2, mb: 2 }}>..........................................................................</Typography>

        <Typography sx={{ fontFamily: 'inherit', fontWeight: 600, mb: 1 }}>5. Số lỗ xe xác xác xác nguyên nhân: ...............................................................</Typography>
        <Typography sx={{ fontFamily: 'inherit', ml: 2, mb: 2 }}>..........................................................................</Typography>

        <Typography sx={{ fontFamily: 'inherit', fontWeight: 600, mb: 1 }}>6. Nội dung cần sửa chữa khác phục: (theo bảng kế chỉ tiết định kèm)</Typography>
      </Box>

      {/* Items table */}
      <TableContainer sx={{ mb: 2 }}>
        <Table size="small" sx={{ '& th, & td': { fontSize: 11, fontFamily: '"Times New Roman", serif', border: '1px solid #000', py: 0.5, px: 1 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell align="center" sx={{ fontWeight: 700 }}>TT</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tên vật tư, thiết bị</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>DVT</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>SL</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tính trạng kỹ thuật</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>SC</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Thay mới</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.stt}>
                  <TableCell align="center">{item.stt}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell align="center">{item.repairLevel || '—'}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell>{item.condition}</TableCell>
                  <TableCell align="center">{item.actionRepair ? '✓' : '—'}</TableCell>
                  <TableCell align="center">{item.actionReplace ? '✓' : '—'}</TableCell>
                  <TableCell>{item.note}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Chưa có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography sx={{ fontSize: 12, mb: 2, fontFamily: 'inherit' }}>
        Biên bản được lập song lực ...... giờ cùng ngày, được các thành phần thống nhật tháng qua./.
      </Typography>

      {/* Signatures */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        {signers.length > 0 ? (
          signers.map((signer, idx) => (
            <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="caption" fontWeight={700} display="block" sx={{ textTransform: 'uppercase', mb: 0.5, fontFamily: 'inherit', fontSize: 11 }}>
                {idx === 0 ? 'Chủ tịch' : idx === signers.length - 1 ? 'Thành viên' : 'Thành viên'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontStyle: 'italic', mb: 3, fontFamily: 'inherit', fontSize: 10 }}>
                (Ký, ghi rõ họ tên)
              </Typography>
              <Box sx={{ borderBottom: '1px solid', borderColor: '#000', width: '70%', mx: 'auto', mb: 0.5 }} />
              <Typography variant="caption" fontWeight={600} display="block" sx={{ fontFamily: 'inherit', fontSize: 11 }}>
                {signer.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontFamily: 'inherit', fontSize: 10 }}>
                {signer.departmentName}
              </Typography>
            </Box>
          ))
        ) : (
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'inherit' }}>
              Chưa có người ký
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer signatures */}
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', gap: 2, borderTop: '1px solid #000', pt: 2 }}>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="caption" fontWeight={700} sx={{ fontFamily: 'inherit', fontSize: 11 }}>
            PQĐ Cơ điện
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="caption" fontWeight={700} sx={{ fontFamily: 'inherit', fontSize: 11 }}>
            Quản đốc
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="caption" fontWeight={700} sx={{ fontFamily: 'inherit', fontSize: 11 }}>
            .............
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="caption" fontWeight={700} sx={{ fontFamily: 'inherit', fontSize: 11 }}>
            Phòng CV
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default IncidentInspectionPreview;