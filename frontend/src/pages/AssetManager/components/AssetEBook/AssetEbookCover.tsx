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
  marginRight: '-3px', // Chỉnh lại center bù phần bị lệch do spacing
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
  width: '100%',
  padding: '0 40px',
  boxSizing: 'border-box',
});

const FieldRow = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '20px',
  width: '100%',
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
  minHeight: '28px',
  marginLeft: '10px',
  position: 'relative',
  backgroundImage: 'linear-gradient(to right, #1a1a1a 30%, rgba(255,255,255,0) 0%)',
  backgroundPosition: 'bottom',
  backgroundSize: '5px 2px',
  backgroundRepeat: 'repeat-x',
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '2px', // cách viền một xíu
});

// Giả lập màu mực bút bi xanh khi nhập tay

const ValueText = styled(Typography)({
  fontFamily: '"Times New Roman", Times, serif',
  fontStyle: 'italic',
  fontSize: '18px', // Chữ nhỏ lại theo ý user
  lineHeight: 1.5,
  wordBreak: 'break-word',
  width: '100%',
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
              <HeaderText>CÔNG TY CỔ PHẦN THAN UÔNG BÍ - TKV</HeaderText>
            </Box>

            {/* Tiêu đề chính */}
            <Box>
              <TitleText>LÝ LỊCH THIẾT BỊ</TitleText>
            </Box>

            {/* Thông tin thiết bị */}
            <ContentWrapper>
              <FieldRow>
                <FieldLabel>Tên thiết bị :</FieldLabel>
                <FieldValueWrapper>
                  <ValueText>{asset?.tenTaiSan}</ValueText>
                </FieldValueWrapper>
              </FieldRow>

              <FieldRow>
                <FieldLabel>Mã hiệu :</FieldLabel>
                <FieldValueWrapper>
                  <ValueText>{asset?.kyHieu}</ValueText>
                </FieldValueWrapper>
              </FieldRow>

              <FieldRow>
                <FieldLabel>Số chế tạo :</FieldLabel>
                <FieldValueWrapper>
                  <ValueText></ValueText>
                </FieldValueWrapper>
              </FieldRow>

              <FieldRow>
                <FieldLabel>Số kiểm kê :</FieldLabel>
                <FieldValueWrapper>
                  <ValueText></ValueText>
                </FieldValueWrapper>
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
