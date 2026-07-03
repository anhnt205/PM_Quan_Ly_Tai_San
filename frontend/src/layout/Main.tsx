import { AppBar, Box } from '@mui/material'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import MenuHeader from './MenuHeader'

export default function Main() {
    return (
        <Box sx={{ minHeight: '100vh', width: '100%', }}>
            <Header />
            <AppBar position="sticky" color="default" elevation={2}>
                <MenuHeader />
            </AppBar>
            <Box sx={{ width: '100%' }}>
                <Outlet />
            </Box>
        </Box>
    )
}
