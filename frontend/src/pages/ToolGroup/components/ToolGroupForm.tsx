import { InfoOutlineRounded } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import SaveBtn from '../../../components/Button/SaveBtn'
import CancelBtn from '../../../components/Button/CancelBtn'
import FieldInput from '../../../components/TextField/FieldInput'
import { useFormik } from 'formik'
import ViewBtn from '../../../components/Button/ViewBtn'
import { ToolGroupValidation } from '../validation/Validation'

export default function ToolGroupForm() {
    const [expanded, setExpanded] = useState(false)
    const formik = useFormik({
        initialValues: {
            code: '',
            name: '',
        },
        validationSchema: ToolGroupValidation,
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
                <Typography>Chi tiết nhóm ccdc</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" gap={2}>
                    <SaveBtn onSave={formik.submitForm} />
                    <CancelBtn />
                </Box>
                <Paper sx={{ mt: 2, p: 2, borderRadius: '12px' }}>
                    <Box display={"flex"} alignItems={"center"} gap={2}>
                        <InfoOutlineRounded color='primary' />
                        <Typography>Thông tin nhóm ccdc</Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 12 }}>
                            <FieldInput title="Mã nhóm ccdc *" formik={formik} field="code" />
                        </Grid>
                        <Grid size={{ xs: 12 }}>    
                            <FieldInput title="Tên nhóm ccdc *" formik={formik} field="name" />
                        </Grid>
                    </Grid>
                </Paper >

            </AccordionDetails >
        </Accordion >
    )
}
