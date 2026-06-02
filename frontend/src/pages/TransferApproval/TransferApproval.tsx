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

export default function TransferApproval() {
  const [mainTab, setMainTab] = useState(0);
  const { user } = useSelector((state: any) => state.user);
  const { data: chucVu = [] } = useAllPositionsQuery();

  const handleMainTabChange = (_event: SyntheticEvent, newValue: number) => {
    setMainTab(newValue);
  };

  const isBanHanh =
    findById(chucVu, user?.taiKhoan?.chucVuId)?.banHanhQuyetDinh ||
    (false as boolean);

  // Queries to get counts for badges
  const { data: assetTransfer = { items: [] } } = useAssetTransferPageQuery(
    0,
    999999,
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    undefined,
    undefined,
    true,
  );
  const assetCount1 = getAssetTransferCount(
    1,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer.items,
    isBanHanh,
  );
  const assetCount2 = getAssetTransferCount(
    2,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer.items,
    isBanHanh,
  );
  const assetCount3 = getAssetTransferCount(
    3,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer.items,
    isBanHanh,
  );
  const totalAssetCount = assetCount1 + assetCount2 + assetCount3;

  const { data: toolTransfer = { items: [] } } = useToolTransferPageQuery(
    0,
    999999,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    undefined,
    undefined,
    undefined,
    true,
  );
  const toolCount1 = getToolTransferCount(
    1,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer.items,
    isBanHanh,
  );
  const toolCount2 = getToolTransferCount(
    2,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer.items,
    isBanHanh,
  );
  const toolCount3 = getToolTransferCount(
    3,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer.items,
    isBanHanh,
  );
  const totalToolCount = toolCount1 + toolCount2 + toolCount3;

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
              <Badge badgeContent={totalAssetCount} color="error">
                <LocalShipping sx={{ fontSize: 20 }} />
              </Badge>
            }
            iconPosition="start"
            label="Điều chuyển tài sản"
          />
          <Tab
            icon={
              <Badge badgeContent={totalToolCount} color="error">
                <Construction sx={{ fontSize: 20 }} />
              </Badge>
            }
            iconPosition="start"
            label="Điều chuyển vật tư"
          />
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {mainTab === 0 && <AssetTransferApprovalTab isBanHanh={isBanHanh} />}
        {mainTab === 1 && <ToolTransferApprovalTab isBanHanh={isBanHanh} />}
      </Box>
    </Box>
  );
}
