import React, { useState } from 'react'
import { Avatar, Box, Button, Container, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import backgroundImage from '../../assets/images/background.jpg';
import logo from '../../assets/images/logo_1.png';
import { EmailOutlined, LockOutline, Visibility, VisibilityOff } from '@mui/icons-material'
import * as yup from 'yup'
import { useFormik } from 'formik';
import userData from '../../data/User.json'
import { showErrorAlert, showSuccessAlert } from '../../components/Alert';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/userSlice';
import FieldInput from '../../components/TextField/FieldInput';
const validationSchema = yup.object({
    email: yup.string().required('Vui lòng nhập email'),
    password: yup.string().required('Vui lòng nhập mật khẩu'),
})

export default function Login() {
    const [showPassWord, setShowPassWord] = useState(true)

    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: (values) => {
            const exitUser = userData.find(i => i.username === values.email && i.password === values.password)
            if (!exitUser) {
                return showErrorAlert("Sai tài khoản hoặc mật khẩu")
            }
            dispatch(loginSuccess(exitUser))
            showSuccessAlert('Đăng nhập thành công')

        },
    })
    return (
        <Box sx={{ width: '100%', height: '100vh', background: `url(${backgroundImage})`, backgroundSize: 'cover', position: 'relative' }}>
            <Box height={120} display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                background: `repeating-linear-gradient(
                    20deg, 
                    rgba(255, 255, 255, 0.15) 0px, 
                    rgba(255, 255, 255, 0.15) 1px, 
                    transparent 2px, 
                    transparent 40px
                ),linear-gradient(to right,rgb(0, 158, 96, 1) 0%,rgb(2, 110, 66, 1) 100%)`
            }}>
                <Typography fontSize={50} fontWeight={700} sx={{ color: 'white' }}>PHẦN MỀM QUẢN LÝ TÀI SẢN</Typography>
            </Box>
            <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Container maxWidth={'xs'} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'white',
                    borderRadius: '12px',
                    p: 5,
                    gap: 3
                }}>
                    <Avatar src={logo} alt='logo' sx={{ width: 80, height: 80 }} />
                    <Typography fontWeight={700} fontSize={24}>Đăng nhập</Typography>
                    <FieldInput
                        title="Email *"
                        formik={formik}
                        field="email"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <EmailOutlined />
                                    </InputAdornment>
                                )
                            }
                        }} />
                    <FieldInput
                        title="Mật khẩu *"
                        type={showPassWord ? 'password' : 'text'}
                        formik={formik}
                        field="password"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <LockOutline />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end" onClick={() => setShowPassWord(!showPassWord)}>
                                        <IconButton>
                                            {showPassWord ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }} />
                    <Button variant='contained' fullWidth sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgb(0, 158, 96, 1)',
                        fontWeight: 'bold'
                    }} onClick={() => formik.submitForm()}>Đăng nhập</Button>
                </Container>
            </Box>
            <Box sx={{ position: 'absolute', bottom: 10, left: 10, index: 999 }}>
                <Typography sx={{ color: 'white' }}>quanlytaisan-Version:dev_01</Typography>
            </Box>
        </Box >
    )
}
