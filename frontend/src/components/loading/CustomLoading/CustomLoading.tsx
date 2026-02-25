import React from "react";
import { Box, useTheme, keyframes, styled } from "@mui/material";

// CẤU HÌNH KÍCH THƯỚC
const cubeSize = 24; // Kích thước nhỏ theo yêu cầu
const translateZ = `${cubeSize / 2}px`;

// 1. Animation xoay ngang quanh trục Y
const rotateAnimation = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

// 2. Container: Đặt góc nhìn "từ trên xuống"
const CubeContainer = styled(Box)(({ theme }) => ({
  width: cubeSize,
  height: cubeSize,
  perspective: 1000, // Tăng perspective một chút cho góc nhìn tự nhiên hơn
  margin: "auto",
  // Góc 35deg là góc chuẩn để tạo hiệu ứng isometric khi kết hợp với xoay Y.
  transform: "rotateX(35deg)",
  transformStyle: "preserve-3d", // Quan trọng: truyền không gian 3D xuống cho Cube
}));

// 3. Khối lập phương: Chỉ thực hiện việc xoay ngang
const Cube = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "relative",
  transformStyle: "preserve-3d",
  // Xoay ngang liên tục quanh trục Y của chính nó.
  animation: `${rotateAnimation} 3s infinite linear`,
  // Không cần thêm rotateX ở đây nữa vì Container đã lo việc đó.
}));

// 4. Các mặt của hộp: Giữ nguyên màu xám
const Face = styled("div")(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
  // Sử dụng màu xám
  border: `2px solid ${theme.palette.grey[500]}`,
  background: "transparent",
  // Giảm opacity một chút để các cạnh phía sau không quá rối
  opacity: 0.7,
}));

interface Props {
  fullScreen?: boolean;
  text?: string;
}

export default function CustomLoading({ fullScreen = false, text }: Props) {
  const theme = useTheme();

  const LoadingContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        // Thêm padding để tránh bị cắt khi xoay
        py: 2,
      }}
    >
      <CubeContainer>
        <Cube>
          <Face sx={{ transform: `translateZ(${translateZ})` }} /> {/* Trước */}
          <Face
            sx={{ transform: `rotateY(180deg) translateZ(${translateZ})` }}
          />{" "}
          {/* Sau */}
          <Face
            sx={{ transform: `rotateY(90deg) translateZ(${translateZ})` }}
          />{" "}
          {/* Phải */}
          <Face
            sx={{ transform: `rotateY(-90deg) translateZ(${translateZ})` }}
          />{" "}
          {/* Trái */}
          <Face
            sx={{ transform: `rotateX(90deg) translateZ(${translateZ})` }}
          />{" "}
          {/* Trên */}
          <Face
            sx={{ transform: `rotateX(-90deg) translateZ(${translateZ})` }}
          />{" "}
          {/* Dưới */}
        </Cube>
      </CubeContainer>

      {text && (
        <Box
          sx={{
            color: theme.palette.grey[600],
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {text}
        </Box>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(255, 255, 255, 0.9)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {LoadingContent}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
      {LoadingContent}
    </Box>
  );
}
