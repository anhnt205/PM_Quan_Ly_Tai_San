import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}

export default function ViewBtn({ expanded, setExpanded }: Props) {
  return (
    <Button
      size="small"
      variant="contained"
      sx={{
        height: "32px",
        textTransform: "none",
        px: 2,
        fontWeight: 600,
        minWidth: "80px",
      }}
      startIcon={expanded ? <Visibility /> : <VisibilityOff />}
      onClick={() => setExpanded(!expanded)}
    >
      {expanded ? "Thu gọn" : "Mở rộng"}
    </Button>
  );
}
