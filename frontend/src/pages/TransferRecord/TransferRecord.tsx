import { useState, SyntheticEvent } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import PageAction from "../../components/common/PageAction";
import { LocalShipping, Construction } from "@mui/icons-material";
import AssetTransferRecordTab from "./AssetTransferRecordTab";
import ToolTransferRecordTab from "./ToolTransferRecordTab";

export default function TransferRecord() {
  const [mainTab, setMainTab] = useState(0);

  const handleMainTabChange = (_event: SyntheticEvent, newValue: number) => {
    setMainTab(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#f8f9fa" }}>
      <Box sx={{ 
        px: 3, 
        pt: 1.5,
        pb: 0,
        display: "flex", 
        flexDirection: "column",
        bgcolor: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        zIndex: 1
      }}>
        <Box sx={{ fontWeight: "bold", fontSize: "1.25rem", color: "#344767", mb: 1 }}>
          Sổ điều chuyển
        </Box>
        <Tabs 
          value={mainTab} 
          onChange={handleMainTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#04b46eff",
              height: 3,
              borderRadius: "3px 3px 0 0"
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              minHeight: "40px",
              color: "#67748e",
              px: 0,
              mr: 4,
              minWidth: "auto",
              "&.Mui-selected": {
                color: "#04b46eff",
              },
            },
          }}
        >
          <Tab icon={<LocalShipping sx={{ fontSize: 20 }} />} iconPosition="start" label="Điều chuyển tài sản" />
          <Tab icon={<Construction sx={{ fontSize: 20 }} />} iconPosition="start" label="Điều chuyển vật tư" />
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {mainTab === 0 && <AssetTransferRecordTab />}
        {mainTab === 1 && <ToolTransferRecordTab />}
      </Box>
    </Box>
  );
}