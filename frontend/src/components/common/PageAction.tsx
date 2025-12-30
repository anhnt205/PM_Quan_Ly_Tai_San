import { Download, Settings, Upload } from "@mui/icons-material";
import NewButton from "../Button/NewButton";
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface Props {
  title: string;
  onNewClick: () => void;
}

export default function PageAction({ title, onNewClick }: Props) {
  const [anchorElExcel, setAnchorElExcel] = useState<null | HTMLElement>(null);

  const handleOnpenElExcel = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElExcel(event.currentTarget);
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        position: "sticky",
        gap: 2,
        top: 60,
        zIndex: 99,
        bgcolor: "white",
        boxShadow: "1px 1px 2px rgba(0,0,0,0.5)",
        p: 1,
      }}
    >
      <NewButton onClick={onNewClick} />
      <Typography>{title}</Typography>
      <IconButton onClick={handleOnpenElExcel}>
        <Settings color="success" />
      </IconButton>

      <Menu
        open={Boolean(anchorElExcel)}
        onClose={() => setAnchorElExcel(null)}
        anchorEl={anchorElExcel}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
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
  );
}
