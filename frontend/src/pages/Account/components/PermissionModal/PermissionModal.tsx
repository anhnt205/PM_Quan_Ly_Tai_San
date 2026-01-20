import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Checkbox,
  Button,
  Divider,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAccountMutation } from "../../Mutation";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function PermissionModal({ open, onClose, userId }: Props) {
  const { userPermissions, isLoading, updatePermissionBatchMutation } =
    useAccountMutation(undefined, undefined, undefined, userId);

  const [localPermissions, setLocalPermissions] = useState<any[]>([]);

  useEffect(() => {
    if (open && userPermissions && localPermissions.length === 0) {
      setLocalPermissions(userPermissions);
    }
    if (!open) {
      setLocalPermissions([]);
    }
  }, [userPermissions, open, localPermissions.length]);

  const handleToggle = (index: number, field: string) => {
    const newData = [...localPermissions];
    newData[index] = { ...newData[index], [field]: !newData[index][field] };
    setLocalPermissions(newData);
  };

  const handleConfirm = () => {
    updatePermissionBatchMutation.mutate(localPermissions, {
      onSuccess: () => {
        setLocalPermissions([]);
        onClose();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "10px" } }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 2,
          position: "relative",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          Thiết lập quyền
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <Close />
        </IconButton>
      </Box>
      <Divider />

      <DialogContent sx={{ px: 3, py: 1 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Stack
            spacing={1}
            divider={<Divider sx={{ borderStyle: "dashed" }} />}
          >
            {localPermissions.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1,
                }}
              >
                <Typography sx={{ flex: 1, fontSize: "14px" }}>
                  {item.permissionName}
                </Typography>

                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      size="small"
                      checked={!!item.canCreate}
                      onChange={() => handleToggle(idx, "canCreate")}
                    />
                    <Typography variant="body2">Thêm</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      size="small"
                      checked={!!item.canUpdate}
                      onChange={() => handleToggle(idx, "canUpdate")}
                    />
                    <Typography variant="body2">Sửa</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      size="small"
                      checked={!!item.canDelete}
                      onChange={() => handleToggle(idx, "canDelete")}
                    />
                    <Typography variant="body2">Xóa</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 1,
            textTransform: "none",
            fontWeight: "bold",
            py: 1.2,
          }}
          onClick={handleConfirm}
          disabled={updatePermissionBatchMutation.isPending}
        >
          Xác nhận
        </Button>
      </DialogContent>
    </Dialog>
  );
}
