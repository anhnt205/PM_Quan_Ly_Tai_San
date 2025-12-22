import { Download, Settings, Upload } from '@mui/icons-material'
import { Box, Button, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'

interface Props {
    title: string
}

export default function PageAction({
    title
}: Props) {
    const [anchorElExcel, setAnchorElExcel] = useState<null | HTMLElement>(null)

    const handleOnpenElExcel = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElExcel(event.currentTarget)
    }
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button variant='contained'>Mới</Button>
            <Typography>{title}</Typography>
            <IconButton onClick={handleOnpenElExcel}><Settings color='success' /></IconButton>

            <Menu
                open={Boolean(anchorElExcel)}
                onClose={() => setAnchorElExcel(null)}
                anchorEl={anchorElExcel}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}>
                <MenuItem>
                    <ListItemIcon>
                        <Download />
                    </ListItemIcon>
                    Import dữ liệu
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Upload />
                    </ListItemIcon>
                    Xuất toàn bộ
                </MenuItem>
            </Menu>
        </Box>
    )
}
