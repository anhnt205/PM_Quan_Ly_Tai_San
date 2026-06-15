import React, { createContext, useContext, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useAssetTransferPageQuery } from "../pages/AssetTransfer/Mutation";
import { useToolTransferPageQuery } from "../pages/ToolTransfer/Mutation";
import { useToolHandoverPageQuery } from "../pages/ToolHandover/Mutation";
import { useAssetHandoverPageQuery } from "../pages/AssetHandover/Mutation";
import { useAllPositionsQuery } from "../pages/Position/Mutation";
import { useConfig } from "../hooks/useContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/api.config";
import {
  getAssetHandoverCount,
  getAssetTransferCount,
  getToolHandoverCount,
  getToolTransferCount,
  findById,
} from "../utils/helpers";
import { showErrorAlert } from "../components/Alert";
import {
  useMaintenanceAcceptanceTestPageQuery,
  useMaintenanceAcceptanceTestVehiclePageQuery,
  useMaintenanceBienPhapMayMocPageQuery,
  useMaintenanceBienPhapPhuongTienPageQuery,
  useMaintenanceIncidentInspectionPageQuery,
  useMaintenanceIncidentPageQuery,
  useMaintenanceInspectionPageQuery,
  useMaintenanceMaterialAssessmentPageQuery,
  useMaintenancePlanningPageQuery,
  useMaintenanceRepairPageQuery,
  useMaintenanceVehicleInspectionPageQuery,
} from "../pages/Maintenance/mutation";

interface MenuDataContextType {
  config: any;
  updateConfig: (newConfig: any) => void;
  isUpdatingConfig: boolean;
  counts: {
    assetTransfer: {
      total: number;
      c1: number;
      c2: number;
      c3: number;
    };
    toolTransfer: {
      total: number;
      c1: number;
      c2: number;
      c3: number;
    };
    assetHandover: number;
    toolHandover: number;
    transferAssetPageItems: number;
    transferToolPageItems: number;
    totalPlan: number;
    totalIncident: number;
    totalRepair: number;
    totalIncidentInspection: number;
    totalMaterialAssessment: number;
    totalMachineInspection: number;
    totalVehicleAcceptance: number;
    totalInspectionMachine: number;
    totalInspectionVehicle: number;
    totalMeasureMachine: number;
    totalMeasureVehicle: number;
    shareCounts: {
      totalPlan: number;
      totalIncident: number;
      totalRepair: number;
      totalIncidentInspection: number;
      totalMaterialAssessment: number;
      totalInspectionMachine: number;
      totalInspectionVehicle: number;
      totalMachineInspection: number;
      totalVehicleAcceptance: number;
      totalMeasureMachine: number;
      totalMeasureVehicle: number;
      totalAssetTransfer: number;
      totalToolTransfer: number;
      totalAssetHandover: number;
      totalToolHandover: number;
      total: number;
    };
  };
}

const MenuDataContext = createContext<MenuDataContextType | undefined>(
  undefined,
);

export const MenuDataProvider = ({ children }: { children: ReactNode }) => {
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
  const { data: assetTransfer = { items: [] } } = useAssetTransferPageQuery(
    0,
    999999,
  );
  const { data: toolTransfer = { items: [] } } = useToolTransferPageQuery(
    0,
    999999,
  );
  const { data: toolHandover = { items: [] } } = useToolHandoverPageQuery(
    0,
    999999,
  );
  const { data: assetHandover = { items: [] } } = useAssetHandoverPageQuery(
    0,
    999999,
  );

  // kế hoạch
  const { data: plan = { items: [], totalItems: 0 } } =
    useMaintenancePlanningPageQuery(
      0,
      10,
      undefined,
      undefined,
      undefined,
      user?.taiKhoan?.tenDangNhap,
      true,
    );

  // sự cố
  const { data: incident = { items: [], totalItems: 0 } } =
    useMaintenanceIncidentPageQuery(
      0,
      10,
      undefined,
      undefined,
      undefined,
      user?.taiKhoan?.tenDangNhap,
      true,
    );

  // sửa chữa
  const { data: repair = { items: [], totalItems: 0 } } =
    useMaintenanceRepairPageQuery(
      0,
      10,
      undefined,
      undefined,
      undefined,
      user?.taiKhoan?.tenDangNhap,
      true,
    );

  // kiểm tra sự cố
  const { data: incidentInspection = { items: [], totalItems: 0 } } =
    useMaintenanceIncidentInspectionPageQuery(
      0,
      10,
      undefined,
      undefined,
      undefined,
      user?.taiKhoan?.tenDangNhap,
      true,
    );

  // nghiệm thu máy móc
  const { data: machineInspection = { items: [], totalItems: 0 } } =
    useMaintenanceAcceptanceTestPageQuery(
      0,
      10,
      undefined,
      undefined,
      undefined,
      user?.taiKhoan?.tenDangNhap,
      true,
    );

  // nghiệm thu phương tiện
  const { data: vehicleAcceptance = { items: [], totalItems: 0 } } =
    useMaintenanceAcceptanceTestVehiclePageQuery(
      0,
      10,
      undefined,
      undefined,
      undefined,
      user?.taiKhoan?.tenDangNhap,
      true,
    );

  // đánh giá vật tư
  const { data: materialAssessment = { items: [], totalItems: 0 } } =
    useMaintenanceMaterialAssessmentPageQuery(
      0,
      999999,
      undefined,
      undefined,
      user?.taiKhoan?.tenDangNhap,
      true,
    );

  // giám định máy móc
  const { data: inspectionMachine = { items: [], totalItems: 0 } } =
    useMaintenanceInspectionPageQuery(
      0,
      10,
      undefined,
      undefined,
      undefined,
      user?.taiKhoan?.tenDangNhap,
      true,
    );
  const { data: inspectionVehicle = { items: [], totalItems: 0 } } =
    useMaintenanceVehicleInspectionPageQuery(
      0,
      10,
      undefined,
      undefined,
      undefined,
      user?.taiKhoan?.tenDangNhap,
      true,
    );

  // biên pháp máy móc
  const { data: bienPhapMayMoc = { items: [], totalItems: 0 } } =
    useMaintenanceBienPhapMayMocPageQuery(
      0,
      10,
      undefined,
      undefined,
      user?.taiKhoan?.tenDangNhap,
      true,
    );

  // biên pháp phương tiện
  const { data: bienPhapPhuongTien = { items: [], totalItems: 0 } } =
    useMaintenanceBienPhapPhuongTienPageQuery(
      0,
      10,
      undefined,
      undefined,
      user?.taiKhoan?.tenDangNhap,
      true,
    );
  // điều chuyển tài sản
  const { data: transferAssetPage = { items: [], totalItems: 0 } } =
    useAssetTransferPageQuery(
      0,
      999999,
      "",
      undefined,
      undefined,
      4,
      user?.taiKhoan?.phongBanId,
      true,
    );

  // điều chuyển công cụ
  const { data: transferToolPage = { items: [], totalItems: 0 } } =
    useToolTransferPageQuery(
      0,
      999999,
      "",
      undefined,
      undefined,
      4,
      true,
      user?.taiKhoan?.phongBanId,
    );

  const isBanHanh =
    findById(chucVu, user?.taiKhoan?.chucVuId)?.banHanhQuyetDinh || false;
  const tenDangNhap = user?.taiKhoan?.tenDangNhap;

  const assetTransferCount1 = getAssetTransferCount(
    1,
    tenDangNhap,
    assetTransfer.items,
    isBanHanh,
  );
  const assetTransferCount2 = getAssetTransferCount(
    2,
    tenDangNhap,
    assetTransfer.items,
    isBanHanh,
  );
  const assetTransferCount3 = getAssetTransferCount(
    3,
    tenDangNhap,
    assetTransfer.items,
    isBanHanh,
  );

  const toolTransferCount1 = getToolTransferCount(
    1,
    tenDangNhap,
    toolTransfer.items,
    isBanHanh,
  );
  const toolTransferCount2 = getToolTransferCount(
    2,
    tenDangNhap,
    toolTransfer.items,
    isBanHanh,
  );
  const toolTransferCount3 = getToolTransferCount(
    3,
    tenDangNhap,
    toolTransfer.items,
    isBanHanh,
  );

  // bàn giao tài sản
  const assetHandoverCount = getAssetHandoverCount(
    tenDangNhap,
    assetHandover.items,
  );
  // bàn giao công cụ
  const toolHandoverCount = getToolHandoverCount(
    tenDangNhap,
    toolHandover.items,
  );

  // share counts
  const { data: shareCountsData = { total: 0 } } = useQuery({
    queryKey: ["maintenanceShareCounts", tenDangNhap],
    queryFn: async () => {
      const res = await api.get(`/maintenance/share-counts`, {
        params: { userid: tenDangNhap },
      });
      return res.data?.data || { total: 0 };
    },
    enabled: !!tenDangNhap,
  });

  const value = {
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
      transferAssetPageItems: transferAssetPage.totalItems,
      transferToolPageItems: transferToolPage.totalItems,
      totalPlan: plan.totalItems,
      totalIncident: incident.totalItems,
      totalRepair: repair.totalItems,
      totalIncidentInspection: incidentInspection.totalItems,
      totalMaterialAssessment: materialAssessment.totalItems,
      totalMachineInspection: machineInspection.totalItems,
      totalVehicleAcceptance: vehicleAcceptance.totalItems,
      totalInspectionMachine: inspectionMachine.totalItems,
      totalInspectionVehicle: inspectionVehicle.totalItems,
      totalMeasureMachine: bienPhapMayMoc.totalItems,
      totalMeasureVehicle: bienPhapPhuongTien.totalItems,
      shareCounts: {
        totalPlan: shareCountsData.totalPlan || 0,
        totalIncident: shareCountsData.totalIncident || 0,
        totalRepair: shareCountsData.totalRepair || 0,
        totalIncidentInspection: shareCountsData.totalIncidentInspection || 0,
        totalMaterialAssessment: shareCountsData.totalMaterialAssessment || 0,
        totalInspectionMachine: shareCountsData.totalInspectionMachine || 0,
        totalInspectionVehicle: shareCountsData.totalInspectionVehicle || 0,
        totalMachineInspection: shareCountsData.totalMachineInspection || 0,
        totalVehicleAcceptance: shareCountsData.totalVehicleAcceptance || 0,
        totalMeasureMachine: shareCountsData.totalMeasureMachine || 0,
        totalMeasureVehicle: shareCountsData.totalMeasureVehicle || 0,
        totalAssetTransfer: shareCountsData.totalAssetTransfer || 0,
        totalToolTransfer: shareCountsData.totalToolTransfer || 0,
        totalAssetHandover: shareCountsData.totalAssetHandover || 0,
        totalToolHandover: shareCountsData.totalToolHandover || 0,
        total: shareCountsData.total || 0,
      },
    },
  };

  return (
    <MenuDataContext.Provider value={value}>
      {children}
    </MenuDataContext.Provider>
  );
};

export const useMenuDataContext = () => {
  const context = useContext(MenuDataContext);
  if (context === undefined) {
    throw new Error(
      "useMenuDataContext must be used within a MenuDataProvider",
    );
  }
  return context;
};
