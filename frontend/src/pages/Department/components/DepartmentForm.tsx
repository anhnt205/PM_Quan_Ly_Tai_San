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
import { DepartmentValidation } from '../validate/Validation'
import UploadButton from '../../../components/Button/UploadButton'

export default function StaffForm() {
    const [showPin, setShowPin] = useState(false);
    const [expanded, setExpanded] = useState(false)
    const formik = useFormik({
        initialValues: {
            code: '',
            name: '',
            phone: '',
            email: '',
        },
        validationSchema: DepartmentValidation,
        onSubmit(values) {

        },
    })

    return (
        <Accordion sx={{ background: '#f6f8f4ff' }} expanded={expanded}>
            <AccordionSummary
                expandIcon={
                    <Button size='small'
                        variant='contained'
                        startIcon={expanded ? <Visibility /> : <VisibilityOff />}
                        onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Mở rộng' : 'Thu gọn'}
                    </Button>}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'none', // Ngăn không cho xoay
                    },
                }}>
                <Typography>Chi tiết phòng ban</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" gap={2}>
                    <SaveBtn onSave={formik.submitForm} />
                    <CancelBtn />
                </Box>
                <Paper sx={{ mt: 5, p: 2, borderRadius: '12px' }}>
                    <Box display={"flex"} alignItems={"center"} gap={2}>
                        <InfoOutlineRounded color='primary' />
                        <Typography>Thông tin nhân viên</Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 6 }}>
                            <FieldInput title="Mã phòng ban *" formik={formik} field="code" />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <FieldInput title="Tên phòng ban *" formik={formik} field="name" />
                        </Grid>
                    </Grid>
                </Paper >

            </AccordionDetails >
        </Accordion >
    )
}
