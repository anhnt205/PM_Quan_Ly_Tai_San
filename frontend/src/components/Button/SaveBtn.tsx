import { Save } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'

interface Props {
    onSave: () => void
}
export default function SaveBtn({ onSave }: Props) {
    return (
        <Button variant='contained' startIcon={<Save />} onClick={onSave}>Lưu</Button>
    )
}
