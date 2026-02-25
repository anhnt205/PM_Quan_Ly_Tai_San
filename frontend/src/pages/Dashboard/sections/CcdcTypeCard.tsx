import React from "react";
import {
  Paper,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import BarChart from "../components/BarChart";

export default function CcdcTypeCard({
  selectedNhomCCDC,
  setSelectedNhomCCDC,
  uniqueNhomCCDC,
  ccdcBarData,
}: any) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        minHeight: 320,
        bgcolor: "#f0faf5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "success.main", fontWeight: 600 }}
        >
          Phân bố CCDC theo loại
        </Typography>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={selectedNhomCCDC ?? ""}
            onChange={(e) => {
              const val = String(e.target.value);
              setSelectedNhomCCDC(val === "" ? undefined : val);
            }}
            displayEmpty
          >
            {(uniqueNhomCCDC || []).map((nhom: any) => (
              <MenuItem key={nhom.id} value={nhom.id}>
                {nhom.tenNhom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: 200 }}>
        <BarChart data={ccdcBarData} height={200} barColor="#FF9800" />
      </Box>
    </Paper>
  );
}
