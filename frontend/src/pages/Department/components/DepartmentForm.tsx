import { InfoOutlineRounded, ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import SaveBtn from '../../../components/Button/SaveBtn'
import CancelBtn from '../../../components/Button/CancelBtn'
import FieldInput from '../../../components/TextField/FieldInput'
import { useFormik } from 'formik'
import { DepartmentValidation } from '../validation/Validation'
import ViewBtn from '../../../components/Button/ViewBtn'

export default function DepartmentForm({onCancel}: {onCancel: () => void}) {
    const [expanded, setExpanded] = useState(true)
    const formik = useFormik({
        initialValues: {
            code: '',
            name: '',
            isStorage: false,
            isDepartment: false,
        },
        validationSchema: DepartmentValidation,
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
                    <Typography>Chi tiết phòng ban</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" gap={2}>
                    <SaveBtn onSave={formik.submitForm} />
                    <CancelBtn onClick={onCancel} />
                </Box>
                <Paper sx={{ mt: 2, p: 2, borderRadius: '12px' }}>
                    <Box display={"flex"} alignItems={"center"} gap={2}>
                        <InfoOutlineRounded color='primary' />
                        <Typography>Thông tin phòng ban</Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 6 }}>
                            <FieldInput title="Mã phòng ban *" formik={formik} field="code" />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <FieldInput title="Tên phòng ban *" formik={formik} field="name" />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Box display="flex" alignItems="center">
                                <Box width={200}><Typography>Là kho:</Typography></Box>
                                <Checkbox
                                    name="isStorage"
                                    checked={formik.values.isStorage}
                                    onChange={formik.handleChange}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Box display="flex" alignItems="center">
                                <Box width={200}><Typography>Là phòng ban lãnh đạo:</Typography></Box>
                                <Checkbox
                                    name="isDepartment"
                                    checked={formik.values.isDepartment}
                                    onChange={formik.handleChange}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper >

            </AccordionDetails >
        </Accordion >
    )
}
