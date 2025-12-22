import { Cancel } from '@mui/icons-material'
import { Button } from '@mui/material'

export default function CancelBtn() {
  return (
    <Button variant='contained' size='small' color='error' startIcon={<Cancel />}>Hủy</Button>
  )
}
