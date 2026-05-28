import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { CongTy } from "../../../utils/const";

export interface LyLichNhomTaiSanRequest {
  lyLichId: string;
  nhomTaiSanId: string;
}

export interface LyLichNhomTaiSanResponse {
  lyLichId: string;
  tenLyLich: string;
  nhomTaiSanId: string;
  tenNhomTaiSan: string;
}

export const useGetAssetProfileGroupQuery = (
  page: number = 0,
  size: number = 1000,
) => {
  return useQuery({
    queryKey: ["assetProfileGroup", page, size],
    queryFn: async () => {
      const res = await api.get("/ly-lich-nhom-tai-san", {
        params: {
          page,
          size,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useGetAllAssetProfileQuery = () => {
  return useQuery({
    queryKey: ["allAssetProfiles"],
    queryFn: async () => {
      const res = await api.get("/ly-lich");
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useGetAllAssetGroupQuery = () => {
  return useQuery({
    queryKey: ["allAssetGroups"],
    queryFn: async () => {
      const res = await api.get("/nhomtaisan", {
        params: {
          idcongty: CongTy.CT001,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateAssetProfileGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LyLichNhomTaiSanRequest[]) => {
      const res = await api.put("/ly-lich-nhom-tai-san/update-list", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetProfileGroup"] });
      showSuccessAlert("Cập nhật danh sách lý lịch - nhóm tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật danh sách thất bại",
      );
    },
  });
};
