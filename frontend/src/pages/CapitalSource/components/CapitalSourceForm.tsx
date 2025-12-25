import { InfoOutlineRounded, Visibility, VisibilityOff, ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import SaveBtn from '../../../components/Button/SaveBtn'
import CancelBtn from '../../../components/Button/CancelBtn'
import FieldInput from '../../../components/TextField/FieldInput'
import { useFormik } from 'formik'
import ViewBtn from '../../../components/Button/ViewBtn'
import { CapitalSourceValidation } from '../validation/Validation'

export default function CapitalSourceForm({onCancel, capitalSource}: {onCancel: () => void; capitalSource?: any}) {
    const [expanded, setExpanded] = useState(true)
    const formik = useFormik({
        initialValues: {
            code: '',
            name: '',
            note: '',
        },
        validationSchema: CapitalSourceValidation,
        onSubmit(values) {},
    });

    useEffect(() => {
        if (capitalSource) {
            formik.setValues(capitalSource);
        }
    }, [capitalSource]);

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
                    <Typography>Chi tiết nguồn vốn</Typography>
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
                        <Typography>Thông tin nguồn vốn</Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 6 }}>
                            <FieldInput title="Mã nguồn kinh phí *" formik={formik} field="code" />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <FieldInput title="Tên nguồn kinh phí *" formik={formik} field="name" />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FieldInput title="Ghi chú" formik={formik} field="note" />

                        </Grid>
                    </Grid>
                </Paper>

            </AccordionDetails>
        </Accordion>
    );
}
