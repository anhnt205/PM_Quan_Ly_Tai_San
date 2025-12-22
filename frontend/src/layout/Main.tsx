import { Box } from '@mui/material'
import Header from './Header'
import { Outlet } from 'react-router-dom'

export default function Main() {
    return (
        <Box sx={{ minHeight: '100vh', width: '100%' }}>
            <Header />
            <Box sx={{ p: 2, width: '100%' }}>
                <Outlet />
            </Box>
        </Box>
    )
}
