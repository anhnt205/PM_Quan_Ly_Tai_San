import { InfoOutlineRounded, Visibility, VisibilityOff } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import SaveBtn from '../../../components/Button/SaveBtn'
import CancelBtn from '../../../components/Button/CancelBtn'
import FieldInput from '../../../components/TextField/FieldInput'
import Positions from '../../../data/Position.json'
import Departments from '../../../data/Department.json'
import FieldAutoCompleted from '../../../components/TextField/FieldAutoCompleted'
import { useFormik } from 'formik'
import { StaffValidation } from '../validate/Validation'
import UploadButton from '../../../components/Button/UploadButton'
import ViewBtn from '../../../components/Button/ViewBtn'

export default function StaffForm() {
    const [showPin, setShowPin] = useState(false);
    const [expanded, setExpanded] = useState(false)
    const formik = useFormik({
        initialValues: {
            code: '',
            name: '',
            phone: '',
            email: '',
            department: '',
            position: '',
            isFlashSign: false, // Ký nháy
            isNormalSign: false, // Ký thường
            isDigitalSign: false, // Ký số
            agreementUuid: '',
            pin: '',
            savePin: false

        },
        validationSchema: StaffValidation,
        onSubmit(values) {

        },
    })

    return (
        <Accordion sx={{ background: '#f6f8f4ff' }} expanded={expanded}>
            <AccordionSummary
                expandIcon={
                    <ViewBtn expanded={expanded} setExpanded={setExpanded} />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'none', // Ngăn không cho xoay
                    },
                }}>
                <Typography>Chi tiết nhân viên</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" gap={2}>
                    <SaveBtn onSave={formik.submitForm} />
                    <CancelBtn />
                </Box>
                <Paper sx={{ mt: 2, p: 2, borderRadius: '12px' }}>
                    <Box display={"flex"} alignItems={"center"} gap={2}>
                        <InfoOutlineRounded color='primary' />
                        <Typography>Thông tin nhân viên</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid size={{ xs: 12 }}>
                                    <FieldInput title="Mã nhân viên *" formik={formik} field="code" />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FieldInput title="Tên nhân viên *" formik={formik} field="name" />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FieldInput title="Email *" formik={formik} field="email" />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FieldInput title="Số điện thoại *" formik={formik} field="phone" />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FieldAutoCompleted
                                        title="Chức vụ *"
                                        data={Positions}
                                        labelkey='name'
                                        formik={formik}
                                        field="position" />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FieldAutoCompleted
                                        title="Phòng ban/Bộ phận *"
                                        data={Departments}
                                        labelkey='name'
                                        formik={formik}
                                        field="department" />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Box display="flex" flexDirection="column" gap={2.5}>

                                {/* Dòng 1: Ký nháy */}
                                <Box display="flex" alignItems="center">
                                    <Box width={100}><Typography>Ký nháy:</Typography></Box>
                                    <Checkbox
                                        name="isFlashSign"
                                        checked={formik.values.isFlashSign}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.values.isFlashSign && <Box flex={1} ml={1}>
                                        <UploadButton label="Nhấn để chọn file chữ ký (.png, .jpg...)" />
                                    </Box>}
                                </Box>

                                {/* Dòng 2: Ký thường */}
                                <Box display="flex" alignItems="center">
                                    <Box width={100}><Typography>Ký thường:</Typography></Box>
                                    <Checkbox
                                        name="isNormalSign"
                                        checked={formik.values.isNormalSign}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.values.isNormalSign && <Box flex={1} ml={1}>
                                        <UploadButton label="Nhấn để chọn file chữ ký (.png, .jpg...)" />
                                    </Box>}
                                </Box>

                                {/* Dòng 3: Ký số */}
                                <Box display="flex" alignItems="center">
                                    <Box width={100}><Typography>Ký số:</Typography></Box>
                                    <Checkbox
                                        name="isDigitalSign"
                                        checked={formik.values.isDigitalSign}
                                        onChange={formik.handleChange}
                                    />
                                </Box>
                                {formik.values.isDigitalSign && <Box display="flex" flexDirection={"column"} gap={1}>
                                    {/* Dòng 4: Agreement UUID */}
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Agreement UUID"
                                        name="agreementUuid"
                                        value={formik.values.agreementUuid}
                                        onChange={formik.handleChange}
                                        InputProps={{
                                            sx: { borderRadius: '8px' }
                                        }}
                                    />
                                    {/* Dòng 5: PIN */}
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="PIN"
                                        type={showPin ? 'text' : 'password'}
                                        name="pin"
                                        value={formik.values.pin}
                                        onChange={formik.handleChange}
                                        InputProps={{
                                            sx: { borderRadius: '8px' },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPin(!showPin)}
                                                        edge="end"
                                                    >
                                                        {showPin ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    {/* Dòng 6: Lưu mã PIN */}
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Typography>Lưu mã PIN :</Typography>
                                        <Checkbox
                                            name="savePin"
                                            checked={formik.values.savePin}
                                            onChange={formik.handleChange}
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 28 },
                                                color: '#aaa'
                                            }}
                                        />
                                    </Box>
                                </Box>}

                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

            </AccordionDetails>
        </Accordion>
    )
}
