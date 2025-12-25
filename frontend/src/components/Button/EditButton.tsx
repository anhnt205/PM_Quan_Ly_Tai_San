import { Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import React from "react";

export default function CancelBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant='contained'
      size='small'
      color="primary"
      onClick={onClick}
      sx={{
        height: '32px',
        textTransform: 'none',
        px: 2,
        fontWeight: 600,
        minWidth: '80px'
      }}
      startIcon={<Edit />}>Chỉnh sửa thông tin</Button>
  )
}