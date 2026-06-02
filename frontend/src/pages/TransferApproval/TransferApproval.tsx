import { useState, SyntheticEvent } from "react";
import { Box, Tab, Tabs, Badge } from "@mui/material";
import PageAction from "../../components/common/PageAction";
import { LocalShipping, Construction } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useAssetTransferPageQuery } from "../AssetTransfer/Mutation";
import { useToolTransferPageQuery } from "../ToolTransfer/Mutation";
import {
  getAssetTransferCount,
  getToolTransferCount,
  findById,
} from "../../utils/helpers";
import { useAllPositionsQuery } from "../Position/Mutation";
import AssetTransferApprovalTab from "./AssetTransferApprovalTab";
import ToolTransferApprovalTab from "./ToolTransferApprovalTab";
import { useMenuData } from "../../hooks/useMenuData";

export default function TransferApproval() {
  const [mainTab, setMainTab] = useState(0);
  const { user } = useSelector((state: any) => state.user);

  const handleMainTabChange = (_event: SyntheticEvent, newValue: number) => {
    setMainTab(newValue);
  };
  const { counts } = useMenuData();

  const {
    assetTransfer: assetTransferCounts,
    toolTransfer: toolTransferCounts,
  } = counts;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#f8f9fa",
      }}
    >
      <PageAction title="Phê duyệt điều chuyển" hideActionRow={true} />
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
          Phê duyệt điều chuyển
        </Box>
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
              <Badge badgeContent={assetTransferCounts.total} color="error">
                <LocalShipping sx={{ fontSize: 20 }} />
              </Badge>
            }
            iconPosition="start"
            label="Điều chuyển tài sản"
          />
          <Tab
            icon={
              <Badge badgeContent={toolTransferCounts.total} color="error">
                <Construction sx={{ fontSize: 20 }} />
              </Badge>
            }
            iconPosition="start"
            label="Điều chuyển vật tư"
          />
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {mainTab === 0 && <AssetTransferApprovalTab assetTransferCounts={assetTransferCounts} />}
        {mainTab === 1 && <ToolTransferApprovalTab toolTransferCounts={toolTransferCounts} />}
      </Box>
    </Box>
  );
}
