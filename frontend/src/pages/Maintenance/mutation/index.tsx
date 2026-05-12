import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import api from "../../../config/api.config";
import { listNguoiKy } from "../config";
import socketService from "../../../services/socketService";
import { MessageTypeFunctions } from "../../../utils/const";
import { SignaturesData } from "../../AssetTransfer/types";

export const useMaintenanceMutation = (
  key: string,
  apiUri: string,
  activeTab: number,
) => {
  const queryClient = useQueryClient();

  // ky tai lieu
  const signMutation = useMutation({
    mutationFn: async ({
      SignaturesData,
      asset,
    }: {
      SignaturesData: SignaturesData[];
      asset: any;
    }) => {
      const res = await api.post("/chuky", SignaturesData);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      data.SignaturesData.forEach((item) => {
        signStatusMutation.mutate({
          idTaiLieu: item.idTaiLieu,
          userId: item.idNguoiKy,
        });
      });
      console.log("data", data.asset);
      const list = await listNguoiKy(
        Array.isArray(data.asset) ? data.asset : [data.asset],
      );
      socketService.send({
        type:
          activeTab === 0
            ? MessageTypeFunctions.PLAN
            : activeTab === 1
              ? MessageTypeFunctions.REPAIR
              : activeTab === 2
                ? MessageTypeFunctions.INSPECTION
                : activeTab === 3
                  ? MessageTypeFunctions.ACCEPTANCE_TEST
                  : activeTab === 4
                    ? MessageTypeFunctions.MATERIAL
                    : activeTab === 5
                      ? MessageTypeFunctions.INCIDENT
                      : activeTab === 6
                        ? MessageTypeFunctions.INSPECTION
                        : "",
        recieve: list,
      });
      showSuccessAlert("Ký thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Ký thất bại",
      );
    },
  });

  // cap nhat trang thai ky
  // ky tai lieu
  const signStatusMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      userId,
    }: {
      idTaiLieu: string;
      userId: string;
    }) => {
      const res = await api.post(
        `/${apiUri}/capnhattrangthai?id=${idTaiLieu}&userId=${userId}`,
      );
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: [key] });

      console.log("Cập nhật trạng thái ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật trạng thái ký thất bại",
      );
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      const res = await api.put(`/${apiUri}/batch`, data);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      const list = await listNguoiKy(data);
      socketService.send({
        type:
          activeTab === 0
            ? MessageTypeFunctions.PLAN
            : activeTab === 1
              ? MessageTypeFunctions.REPAIR
              : activeTab === 2
                ? MessageTypeFunctions.INSPECTION
                : activeTab === 3
                  ? MessageTypeFunctions.ACCEPTANCE_TEST
                  : activeTab === 4
                    ? MessageTypeFunctions.MATERIAL
                    : activeTab === 5
                      ? MessageTypeFunctions.INCIDENT
                      : activeTab === 6
                        ? MessageTypeFunctions.ACCEPTANCE_TEST
                        : "",
        recieve: list,
      });
      console.log("Trình duyệt thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Trình duyệt thất bại",
      );
    },
  });

  return {
    signMutation,
    updateManyMutation,
  };
};
