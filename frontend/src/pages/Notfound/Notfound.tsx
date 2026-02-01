import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        {/* Icon hoặc Hình ảnh minh họa */}
        <ErrorOutlineIcon
          sx={{ fontSize: 100, color: "primary.main", mb: 2 }}
        />

        <Typography
          variant="h1"
          sx={{ fontWeight: 700, fontSize: "6rem", color: "primary.main" }}
        >
          404
        </Typography>

        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Oops! Trang không tồn tại.
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
          Có vẻ như đường dẫn bạn đang truy cập không tồn tại hoặc đã bị xóa.
          Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Quay lại
          </Button>

          <Button variant="contained" onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
