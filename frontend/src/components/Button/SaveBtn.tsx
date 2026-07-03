import { Save } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'

interface Props {
    onSave: () => void
}
export default function SaveBtn({ onSave }: Props) {
    return (
        <Button
            variant='contained'
            sx={{
                height: '32px',
                textTransform: 'none',
                px: 2,
                fontWeight: 600,
                minWidth: '80px'
            }}
            startIcon={<Save />} onClick={onSave}>Lưu</Button>
    )
}
