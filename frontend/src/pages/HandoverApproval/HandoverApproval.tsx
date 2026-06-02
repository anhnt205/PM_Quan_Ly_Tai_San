import { useState, SyntheticEvent } from "react";
import { Box, Tab, Tabs, Badge, Typography } from "@mui/material";
import PageAction from "../../components/common/PageAction";
import AssetApprovalTab from "./AssetApprovalTab";
import ToolApprovalTab from "./ToolApprovalTab";
import { Inventory, Construction } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useAssetHandoverPageQuery } from "../AssetHandover/Mutation";
import { useToolHandoverPageQuery } from "../ToolHandover/Mutation";
import {
  getAssetHandoverCount,
  getToolHandoverCount,
} from "../../utils/helpers";

export default function HandoverApproval() {
  const [mainTab, setMainTab] = useState(0);
  const { user } = useSelector((state: any) => state.user);

  const handleMainTabChange = (_event: SyntheticEvent, newValue: number) => {
    setMainTab(newValue);
  };

  const { data: assetHandover = { items: [] } } = useAssetHandoverPageQuery(
    0,
    999999,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    true,
  );
  const assetHandoverCount = getAssetHandoverCount(
    user?.taiKhoan?.tenDangNhap,
    assetHandover.items,
  );

  const { data: toolHandover = { items: [] } } = useToolHandoverPageQuery(
    0,
    999999,
    undefined,
    undefined,
    true,
  );
  const toolHandoverCount = getToolHandoverCount(
    user?.taiKhoan?.tenDangNhap,
    toolHandover.items,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#f8f9fa",
      }}
    >
      <PageAction title="Quản lý biên bản bàn giao" hideActionRow={true} />
      <Box
        sx={{
          px: 3,
          pt: 1.5,
          pb: 0,
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            fontSize: "1.25rem",
            color: "#344767",
            mb: 1,
          }}
        >
          Phê duyệt bàn giao
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Tabs
            value={mainTab}
            onChange={handleMainTabChange}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#04b46eff",
                height: 3,
                borderRadius: "3px 3px 0 0",
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
          <Box sx={{ flexGrow: 1 }} />
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {mainTab === 0 && <AssetApprovalTab />}
        {mainTab === 1 && <ToolApprovalTab />}
      </Box>
    </Box>
  );
}
