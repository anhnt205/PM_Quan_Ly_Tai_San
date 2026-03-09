import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default function SimpleProgress({ title, loading }: { title: string, loading: boolean}) {
  return (
    <Dialog open={loading}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: "100%", my: 2 }}>
          {/* variant="indeterminate" giúp thanh chạy liên tục */}
          <LinearProgress color="primary" variant="indeterminate" />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
