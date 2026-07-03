import { Cancel } from '@mui/icons-material'
import { Button } from '@mui/material'

export default function CancelBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant='contained'
      size='small'
      color='error'
      onClick={onClick}
      sx={{
        height: '32px',
        textTransform: 'none',
        px: 2,
        fontWeight: 600,
        minWidth: '80px'
      }}
      startIcon={<Cancel />}>Hủy</Button>
  )
}
