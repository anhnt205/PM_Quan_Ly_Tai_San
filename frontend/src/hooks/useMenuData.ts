import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useAssetTransferPageQuery } from "../pages/AssetTransfer/Mutation";
import { useToolTransferPageQuery } from "../pages/ToolTransfer/Mutation";
import { useToolHandoverPageQuery } from "../pages/ToolHandover/Mutation";
import { useAssetHandoverPageQuery } from "../pages/AssetHandover/Mutation";
import {
  useMaintenanceRepairPageQuery,
  useMaintenanceRepairResultPageQuery,
} from "../pages/MaintenanceRepair/Mutation";
import { useAllPositionsQuery } from "../pages/Position/Mutation";
import { useConfig } from "./useContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/api.config";
import {
  getAssetHandoverCount,
  getAssetTransferCount,
  getToolHandoverCount,
  getToolTransferCount,
  getMaintenanceRepairCount,
  findById,
} from "../utils/helpers";
import { showErrorAlert } from "../components/Alert";
import { useMaintenancePlanningPageQuery } from "../pages/MainenancePlanRepair/Mutation";

export const useMenuData = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const { config, setConfig } = useConfig();

  const { data: chucVu = [] } = useAllPositionsQuery();

  // 1. Lấy dữ liệu cấu hình
  useQuery({
    queryKey: ["expirationConfig", user?.taiKhoan?.tenDangNhap],
    queryFn: async () => {
      const res = await api.get(`/config/${user?.taiKhoan?.tenDangNhap}`);
      setConfig(res.data);
      return res.data;
    },
    enabled: !!user?.taiKhoan?.tenDangNhap,
  });

  // 2. Mutation để lưu dữ liệu
  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig: {
      thoiHanTaiLieu: number;
      ngayBaoHetHan: number;
      ngayBaoDangKiem: number;
    }) =>
      await api.post("/config", {
        idAccount: user?.taiKhoan?.tenDangNhap,
        ...newConfig,
      }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["expirationConfig", user?.taiKhoan?.tenDangNhap],
      });
      setConfig({
        idAccount: user?.taiKhoan?.tenDangNhap || "",
        ...variables,
      });
    },
    onError: (error: any) => {
      showErrorAlert(
        `Lỗi cấu hình: ${error.response?.data?.message || error.message}`,
      );
    },
  });

  // Data fetching for counts
  const { data: assetTransfer = { items: [] } } = useAssetTransferPageQuery(0, 999999);
  const { data: toolTransfer = { items: [] } } = useToolTransferPageQuery(0, 999999);
  const { data: toolHandover = { items: [] } } = useToolHandoverPageQuery(0, 999999);
  const { data: assetHandover = { items: [] } } = useAssetHandoverPageQuery(0, 999999);
  const { data: plan = { items: [] } } = useMaintenancePlanningPageQuery(
    0,
    999999,
  );


  const { data: transferAssetPage = { items: [], totalItems: 0 } } = useAssetTransferPageQuery(
    0,
    999999,
    "",
    undefined,
    undefined,
    4,
    user?.taiKhoan?.phongBanId,
    true,
  );
  const { data: transferToolPage = { items: [], totalItems: 0, loaiCounts: {} } } = useToolTransferPageQuery(
    0,
    999999,
    "",
    undefined,
    undefined,
    4,
    true,
    user?.taiKhoan?.phongBanId,
  );

  const { data: maintenanceRepair = { items: [] } } = useMaintenanceRepairPageQuery(0, 999999);
  const { data: maintenanceRepairResult = { items: [] } } = useMaintenanceRepairResultPageQuery(0, 999999);

  const isBanHanh = findById(chucVu, user?.taiKhoan?.chucVuId)?.banHanhQuyetDinh || false;

  const tenDangNhap = user?.taiKhoan?.tenDangNhap;

  const assetTransferCount1 = getAssetTransferCount(1, tenDangNhap, assetTransfer.items, isBanHanh);
  const assetTransferCount2 = getAssetTransferCount(2, tenDangNhap, assetTransfer.items, isBanHanh);
  const assetTransferCount3 = getAssetTransferCount(3, tenDangNhap, assetTransfer.items, isBanHanh);

  const toolTransferCount1 = getToolTransferCount(1, tenDangNhap, toolTransfer.items, isBanHanh);
  const toolTransferCount2 = getToolTransferCount(2, tenDangNhap, toolTransfer.items, isBanHanh);
  const toolTransferCount3 = getToolTransferCount(3, tenDangNhap, toolTransfer.items, isBanHanh);

  const assetHandoverCount = getAssetHandoverCount(tenDangNhap, assetHandover.items);
  const toolHandoverCount = getToolHandoverCount(tenDangNhap, toolHandover.items);

  const maintenanceRepairCount = getMaintenanceRepairCount(tenDangNhap, maintenanceRepair.items);
  const maintenanceRepairResultCount = getMaintenanceRepairCount(tenDangNhap, maintenanceRepairResult.items);

  return {
    config,
    updateConfig: updateConfigMutation.mutate,
    isUpdatingConfig: updateConfigMutation.isPending,
    counts: {
      assetTransfer: {
        total: assetTransferCount1 + assetTransferCount2 + assetTransferCount3,
        c1: assetTransferCount1,
        c2: assetTransferCount2,
        c3: assetTransferCount3,
      },
      toolTransfer: {
        total: toolTransferCount1 + toolTransferCount2 + toolTransferCount3,
        c1: toolTransferCount1,
        c2: toolTransferCount2,
        c3: toolTransferCount3,
      },
      assetHandover: assetHandoverCount,
      toolHandover: toolHandoverCount,
      maintenanceRepair: maintenanceRepairCount,
      maintenanceRepairResult: maintenanceRepairResultCount,
      transferAssetPageItems: transferAssetPage.totalItems,
      transferToolPageItems: transferToolPage.totalItems,
    },
  };
};
