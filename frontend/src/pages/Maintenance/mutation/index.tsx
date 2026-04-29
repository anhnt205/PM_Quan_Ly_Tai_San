import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import api from "../../../config/api.config";
import { SignaturesData } from "../../MaintenanceRepair/types";

export const useMaintenanceMutation = (key: string, apiUri: string) => {
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
      //   const list = await listNguoiKy([data.asset]);
      //   socketService.send({
      //     type: MessageTypeFunctions.ASSET_TRANSFER,
      //     recieve: list,
      //   });
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

  return {
    signMutation,
  };
};
