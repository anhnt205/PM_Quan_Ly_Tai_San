import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

interface Props {
    title: string,
    data: any[],
    labelkey: string,
    formik?: any,
    field?: string,
    disabled?: boolean
}

export default function FieldAutoCompleted({ title, data, labelkey, formik, field, disabled }: Props) {
    const currentValue = (formik && field) ? formik.values[field] : null;
    return (
        <Autocomplete
            disabled={disabled}
            fullWidth
            options={data}
            getOptionLabel={(option: any) => option[labelkey] || ''}
            value={data.find(i => i.id === currentValue) || null}
            onChange={(e, newValue) => {
                if (formik && field) {
                    formik.setFieldValue(field, newValue?.id)
                }
            }}
            renderInput={(params) => (
                <TextField {...params}
                    label={title}
                    error={field && formik.touched[field] && Boolean(
                        formik.errors[field]
                    )}
                    helperText={
                        (field && formik.touched[field] && typeof formik.errors[field] === 'string')
                            ? formik.errors[field]
                            : ''
                    }
                    size='small'
                    InputProps={{
                        ...params.InputProps,
                        sx: {
                            borderRadius: '12px'
                        }
                    }} />
            )
            } />
    )
}
