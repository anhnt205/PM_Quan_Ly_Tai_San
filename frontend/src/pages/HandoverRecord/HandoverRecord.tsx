import { useState, SyntheticEvent } from "react";
import { Box, Tab, Tabs, Badge } from "@mui/material";
import PageAction from "../../components/common/PageAction";
import AssetRecordTab from "./AssetRecordTab";
import ToolRecordTab from "./ToolRecordTab";
import { Inventory, Construction } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useAssetHandoverPageQuery } from "../AssetHandover/Mutation";
import { useToolHandoverPageQuery } from "../ToolHandover/Mutation";
import { getAssetHandoverCount, getToolHandoverCount } from "../../utils/helpers";

export default function HandoverRecord() {
  const [mainTab, setMainTab] = useState(0);
  const { user } = useSelector((state: any) => state.user);

  const handleMainTabChange = (_event: SyntheticEvent, newValue: number) => {
    setMainTab(newValue);
  };

  // Although this is a Record page, we might still want to show badges for pending items 
  // or maybe not. User said "tương tự" (similar), so I'll keep the structure.
  const { data: assetHandover = { items: [] } } = useAssetHandoverPageQuery(0, 999999);
  const assetHandoverCount = getAssetHandoverCount(user?.taiKhoan?.tenDangNhap, assetHandover.items);

  const { data: toolHandover = { items: [] } } = useToolHandoverPageQuery(0, 999999);
  const toolHandoverCount = getToolHandoverCount(user?.taiKhoan?.tenDangNhap, toolHandover.items);

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
          Quản lý biên bản
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
          <Tab 
            icon={
              <Badge badgeContent={assetHandoverCount} color="error">
                <Inventory sx={{ fontSize: 20 }} />
              </Badge>
            } 
            iconPosition="start" 
            label="Bàn giao tài sản" 
          />
          <Tab 
            icon={
              <Badge badgeContent={toolHandoverCount} color="error">
                <Construction sx={{ fontSize: 20 }} />
              </Badge>
            } 
            iconPosition="start" 
            label="Bàn giao vật tư" 
          />
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {mainTab === 0 && <AssetRecordTab />}
        {mainTab === 1 && <ToolRecordTab />}
      </Box>
    </Box>
  );
}
