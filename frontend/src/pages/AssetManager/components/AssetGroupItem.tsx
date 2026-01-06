import { Apartment, Handshake } from "@mui/icons-material";
import { Box, Card, Checkbox, Paper, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  item: any;
  selectedGroup: string;
  setSelectedGroup: Dispatch<SetStateAction<string>>;
}

export default function AssetGroupItem({
  item,
  selectedGroup,
  setSelectedGroup,
}: Props) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: 260,
        height: 140,
        flexShrink: 0, // ⭐ QUAN TRỌNG để không bị co
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box display={"flex"} gap={2} alignItems={"center"}>
        <Apartment
          sx={{
            width: 40,
            height: 40,
            p: 1,
            bgcolor: "#e8f9f4",
            borderRadius: 2,
          }}
          color="primary"
        />
        <Typography fontWeight={600} fontSize={14}>
          {item?.tenNhom}
        </Typography>
      </Box>
      <Box
        display={"flex"}
        gap={2}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography color="primary">
          Số lượng tài sản:{" "}
          <span style={{ color: "black" }}>{item?.soLuongTaiSan}</span>
        </Typography>
        <Checkbox
          checked={selectedGroup === item?.id}
          onChange={() => {
            setSelectedGroup(selectedGroup === item?.id ? "" : item?.id);
          }}
        />
      </Box>
    </Paper>
  );
}
