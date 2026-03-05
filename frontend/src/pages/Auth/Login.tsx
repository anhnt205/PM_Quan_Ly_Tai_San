import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import backgroundImage from "../../assets/images/background.jpg";
import logo from "../../assets/images/logo_1.png";
import {
  EmailOutlined,
  LockOutline,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import * as yup from "yup";
import { useFormik } from "formik";
import FieldInput from "../../components/TextField/FieldInput";
import { validationSchema } from "./validation";

import { useAuthMutation } from "./Mutation";

export default function Login() {
  const [showPassWord, setShowPassWord] = useState(true);

  const { loginMutation } = useAuthMutation();

  const formik = useFormik({
    initialValues: {
      tenDangNhap: "",
      matKhau: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background: `url(${backgroundImage})`,
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      <Box
        height={120}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          background: `repeating-linear-gradient(
                    20deg, 
                    rgba(255, 255, 255, 0.15) 0px, 
                    rgba(255, 255, 255, 0.15) 1px, 
                    transparent 2px, 
                    transparent 40px
                ),linear-gradient(to right,rgb(0, 158, 96, 1) 0%,rgb(2, 110, 66, 1) 100%)`,
        }}
      >
        <Typography fontSize={50} fontWeight={700} sx={{ color: "white" }}>
          PHẦN MỀM QUẢN LÝ TÀI SẢN
        </Typography>
      </Box>
      <Box
        sx={{
          height: "calc(100vh - 120px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container
          maxWidth={"xs"}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "white",
            borderRadius: "12px",
            p: 5,
            gap: 3,
          }}
        >
          <Avatar src={logo} alt="logo" sx={{ width: 80, height: 80 }} />
          <Typography fontWeight={700} fontSize={24}>
            Đăng nhập
          </Typography>
          <FieldInput
            title="Tên đăng nhập *"
            formik={formik}
            field="tenDangNhap"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FieldInput
            title="Mật khẩu *"
            type={showPassWord ? "password" : "text"}
            formik={formik}
            field="matKhau"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutline />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={() => setShowPassWord(!showPassWord)}
                  >
                    <IconButton>
                      {showPassWord ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              p: 2,
              borderRadius: "12px",
              background: "rgb(0, 158, 96, 1)",
              fontWeight: "bold",
            }}
            onClick={() => formik.submitForm()}
          >
            Đăng nhập
          </Button>
        </Container>
      </Box>
      <Box sx={{ position: "absolute", bottom: 10, left: 10, index: 999 }}>
        <Typography sx={{ color: "white" }}>
          quanlytaisan-Version:dev_1.1_05/03/2026
        </Typography>
      </Box>
    </Box>
  );
}
