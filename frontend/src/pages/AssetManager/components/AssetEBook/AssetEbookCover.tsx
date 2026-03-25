import React, { ChangeEvent } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AssetEbookCoverProps {
  asset:any,
onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;}

const CoverWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'transparent',
});

const A4Paper = styled(Box)({
  width: '210mm',
  minHeight: '297mm',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#d46f9e', // Màu hồng đậm giống bìa hồ sơ thực tế
  padding: '25px', // Khoảng cách từ mép giấy đến viền ngoài
  boxSizing: 'border-box',
  fontFamily: '"Times New Roman", Times, serif',
  color: '#0e0e0e',
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  position: 'relative',
});

const OuterBorder = styled(Box)({
  border: '3px solid #1a1a1a', // Viền ngoài đậm
  padding: '5px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
});

const InnerBorder = styled(Box)({
  border: '1px solid #1a1a1a', // Viền trong mảnh
  flex: 1,
  boxSizing: 'border-box',
  padding: '60px 40px',
  display: 'flex',
  flexDirection: 'column',
});

const HeaderText = styled(Typography)({
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: '18px',
  textAlign: 'center',
  fontWeight: 'bold',
  lineHeight: 1.5,
});

const TitleText = styled(Typography)({
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: '44px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginTop: '90px',
  letterSpacing: '3px',
});

const SubTitleText = styled(Typography)({
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: '17px',
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: '15px',
  fontWeight: 500,
  color: '#026e42',
});

const ContentWrapper = styled(Box)({
  marginTop: '80px',
  marginBottom: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const FieldRow = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
  marginBottom: '20px',
  width: '80%',
});

const FieldLabel = styled(Typography)({
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: '19px',
  fontWeight: 'bold',
  marginRight: '12px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
});

const FieldValueWrapper = styled(Box)({
  flexGrow: 1,
  borderBottom: '2px dotted #1a1a1a', // Viền gạch chấm
  position: 'relative',
  height: '30px',
});

// Giả lập màu mực bút bi xanh khi nhập tay
const penColor = '#1818a8';

const StyledInput = styled('input')({
  width: '100%',
  border: 'none',
  background: 'transparent',
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: '22px', // Chữ to hơn một chút giống viết tay
  outline: 'none',
  padding: '0 8px',
  boxSizing: 'border-box',
  position: 'absolute',
  bottom: '2px',
  fontStyle: 'italic',
  color: penColor,
});

const ValueText = styled(Typography)({
  position: 'absolute',
  bottom: '2px',
  left: '8px',
  fontFamily: '"Times New Roman", Times, serif',
  fontStyle: 'italic',
  color: penColor,
  fontSize: '22px',
  lineHeight: 1,
});

const FooterText = styled(Typography)({
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: '18px',
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: '60px',
  marginBottom: '20px',
});

export default function AssetEbookCover({
  asset,
  onPageChange,
  currentPage=1,
  totalPages=4,
}: AssetEbookCoverProps) {

  return (
    <CoverWrapper>
      <A4Paper>
        <OuterBorder>
          <InnerBorder>
            {/* Phần Header */}
            <Box>
              <HeaderText>TẬP ĐOÀN CÔNG NGHIỆP THAN - KHOÁNG SẢN VIỆT NAM</HeaderText>
              <HeaderText>CÔNG TY CỔ PHẦN THAN UÔNG BÍ - VINACOMIN</HeaderText>
            </Box>

            {/* Tiêu đề chính */}
            <Box>
              <TitleText>LÝ LỊCH THIẾT BỊ</TitleText>
            </Box>

            {/* Thông tin thiết bị */}
            <ContentWrapper>
              <FieldRow>
                <FieldLabel>SỐ ĐĂNG KÝ : {asset?.soThe}</FieldLabel>
              </FieldRow>

              <FieldRow>
                <FieldLabel>LOẠI THIẾT BỊ : {asset?.tenNhom}</FieldLabel>
              </FieldRow>

              <FieldRow>
                <FieldLabel>KIỂU THIẾT BỊ :</FieldLabel>
              </FieldRow>
            </ContentWrapper>

            {/* Footer */}
            <FooterText>Tháng ..... năm 201.....</FooterText>
          </InnerBorder>
        </OuterBorder>
      </A4Paper>
    </CoverWrapper>
  );
}
