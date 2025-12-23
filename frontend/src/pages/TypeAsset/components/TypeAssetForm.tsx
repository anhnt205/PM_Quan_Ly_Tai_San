import { InfoOutlineRounded } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import SaveBtn from '../../../components/Button/SaveBtn'
import CancelBtn from '../../../components/Button/CancelBtn'
import FieldInput from '../../../components/TextField/FieldInput'
import { useFormik } from 'formik'
import ViewBtn from '../../../components/Button/ViewBtn'
import { TypeAssetValidation } from '../validation/Validation'
import FieldAutoCompleted from '../../../components/TextField/FieldAutoCompleted'
import AssetParents from '../../../data/AssetParent.json'

export default function TypeAssetForm() {
    const [expanded, setExpanded] = useState(false)
    const formik = useFormik({
        initialValues: {
            code: '',
            name: '',
            assetParent: ''
        },
        validationSchema: TypeAssetValidation,
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
                <Typography>Chi tiết loại tài sản</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" gap={2}>
                    <SaveBtn onSave={formik.submitForm} />
                    <CancelBtn />
                </Box>
                <Paper sx={{ mt: 2, p: 2, borderRadius: '12px' }}>
                    <Box display={"flex"} alignItems={"center"} gap={2}>
                        <InfoOutlineRounded color='primary' />
                        <Typography>Thông tin loại tài sản</Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 12 }}>
                            <FieldInput title="Mã loại tài sản *" formik={formik} field="code" />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FieldAutoCompleted title="Mã loại tài sản cha *" data={AssetParents} labelkey='name' formik={formik} field="assetParent" />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FieldInput title="Tên loại tài sản *" formik={formik} field="name" />
                        </Grid>
                    </Grid>
                </Paper >

            </AccordionDetails >
        </Accordion >
    )
}
